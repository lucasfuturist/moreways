import { IngestJob, ParseResult, RawPdfLine } from '../schema/ingest.schema.pdfInput';
import { IngestParsePdfAsync } from '../svc/ingest.svc.parsePdf';
import { GraphNodeRepo } from '../../graph/repo/graph.repo.nodeRepo';
import { EnrichmentService } from '../svc/ingest.svc.enrichNode';
import { lintGraph } from '../svc/ingest.svc.linter'; 

export interface IDocumentIntelligence {
  extractLines(fileBuffer: Buffer): Promise<RawPdfLine[]>;
}

export class IngestWorker {
  
  constructor(
    private readonly ocrProvider: IDocumentIntelligence,
    private readonly graphRepo: GraphNodeRepo,
    private readonly enricher: EnrichmentService
  ) {}

  public async processJob(job: IngestJob, fileBuffer: Buffer): Promise<ParseResult> {
    console.log(`[Worker] Starting Job ${job.jobId} for corpus ${job.corpus}`);

    // Step 1: Layout Analysis (OCR)
    const rawLines = await this.ocrProvider.extractLines(fileBuffer);
    console.log(`[Worker] OCR complete. Extracted ${rawLines.length} lines.`);

    // Step 2: Parsing
    const parseResult = await IngestParsePdfAsync(rawLines, job);
    console.log(`[Worker] Parsing complete. Root ID: ${parseResult.rootId}`);

    // Step 3: Audit (Gate A)
    this.auditTreeStructure(parseResult, job.jurisdiction);

    // Step 4: Semantic Enrichment
    console.log(`[Worker] Enriching ${parseResult.nodeMap.size} nodes (Embedding/LLM)...`);
    
    // [FIX] Build Context Map (Parent Text Lookup)
    // We need to know the parent's text to inject into the child's embedding.
    const contextMap = new Map<string, string>();
    
    // We iterate once to build the map. 
    // Ideally, we'd do a topological sort, but since `parentId` always points "up",
    // we can just look it up directly if it exists in the map.
    // Note: The parser generates the map. We can access any node by ID.
    
    for (const [id, node] of parseResult.nodeMap) {
        let context = "";
        if (node.parentId && parseResult.nodeMap.has(node.parentId)) {
            const parent = parseResult.nodeMap.get(node.parentId)!;
            // Use the first line (Header) of the parent as context
            // e.g. "Section 7.04: Call Frequency"
            context = parent.content[0] || ""; 
        }
        contextMap.set(id, context);
    }

    const enrichmentMap = new Map<string, { embedding?: number[], summary?: any }>();
    
    for (const [id, node] of parseResult.nodeMap) {
      const parentCtx = contextMap.get(id) || "";
      // [FIX] Pass parent context
      const data = await this.enricher.enrichNode(node, parentCtx);
      enrichmentMap.set(id, data);
    }

    // Step 5: Persist
    console.log(`[Worker] Persisting nodes to Graph DB...`);
    
    await this.graphRepo.commitParseResult(parseResult, job.jurisdiction, job.corpus, enrichmentMap, job.jobId);

    return parseResult;
  }

  private auditTreeStructure(result: ParseResult, jurisdiction: 'MA' | 'FED'): void {
    console.log('[Worker] Running Gate A: Integrity Linter...');
    const lintResult = lintGraph(result.nodeMap, jurisdiction);

    lintResult.errors.forEach(e => {
        if (e.severity === 'WARNING') console.warn(`   ⚠️ [Linter] ${e.message}`);
        if (e.severity === 'CRITICAL') console.error(`   ❌ [Linter] ${e.message}`);
    });

    if (!lintResult.valid) {
        throw new Error(`Ingest Failed: Graph integrity check failed.`);
    }
    console.log('[Worker] Gate A Passed ✅');
  }
}