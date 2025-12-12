import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { JudgeService } from '../../validate/svc/validate.svc.judge';
import { HybridSearchService } from '../../retrieve/svc/retrieve.svc.hybridSearch';
import { SupabaseGraphReader } from '../../infra/supabase/infra.supabase.reader';
import { ValidationRequestSchema } from '../../validate/schema/validate.schema.verdict';

// Dependency Injection
const searcher = new HybridSearchService();
const reader = new SupabaseGraphReader();
const judge = new JudgeService(searcher, reader);

export class ValidateController {
    
    public handleValidation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // 1. Validate Input
            const { intent, formData } = ValidationRequestSchema.parse(req.body);

            // 2. Execute Judgment
            const verdict = await judge.evaluate(intent, formData);

            // 3. Return Result
            res.json({
                data: verdict,
                meta: {
                    timestamp: new Date().toISOString(),
                    model: "gpt-4o-magistrate"
                }
            });

        } catch (error) {
            next(error);
        }
    }
}