import { Request, Response, NextFunction } from "express";
import { JudgeService } from "../../validate/svc/validate.svc.judge";
import { HybridSearchService } from "../../retrieve/svc/retrieve.svc.hybridSearch";
import { SupabaseGraphReader } from "../../infra/supabase/infra.supabase.reader";
import { SupabaseOverrideRepo } from "../../graph/repo/graph.repo.overrideRepo";
import { ValidationRequestSchema } from "../../validate/schema/validate.schema.verdict";

// DI
const searcher = new HybridSearchService();
const reader = new SupabaseGraphReader();
const overrideRepo = new SupabaseOverrideRepo();
const judge = new JudgeService(searcher, reader, overrideRepo);

export class ValidateController {
  public handleValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { intent, formData } = ValidationRequestSchema.parse(req.body);

      const verdict = await judge.evaluate(intent, formData);

      // Evidence pack: fetch real node excerpts for each cited URN
      const evidence = await Promise.all(
        (verdict.relevant_citations || []).map(async (urn) => {
          const node = await reader.getNodeByUrn(urn);
          const excerpt = node?.content_text?.substring(0, 700) || "";
          return {
            urn,
            excerpt,
          };
        })
      );

      res.json({
        data: verdict,
        meta: {
          timestamp: new Date().toISOString(),
          model: "gpt-4o-magistrate",
          citation_evidence: evidence.filter((e) => e.excerpt.length > 0),
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
