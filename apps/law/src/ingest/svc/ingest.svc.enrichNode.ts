import { ProcessingNode } from '../schema/ingest.schema.pdfInput';

/**
 * Interface for AI Providers
 * Decouples the service from the specific implementation (OpenAI, Azure, Local)
 */
export interface IAiProvider {
  generateEmbedding(text: string): Promise<number[]>;
  generateLogicSummary(text: string): Promise<Record<string, any>>;
}

/**
 * ENRICHMENT SERVICE
 * Adds semantic vectors and logical summaries to structural nodes.
 * 
 * [COST SAFETY]
 * Respects the DRY_RUN environment variable to prevent accidental
 * API spending during large-scale ingestion tests.
 */
export class EnrichmentService {
  constructor(private readonly ai: IAiProvider) {}

  /**
   * Enrich a single node with AI metadata.
   * [FIX] Now accepts 'parentContext' to inject ancestry text into the embedding.
   */
  public async enrichNode(node: ProcessingNode, parentContext: string = ""): Promise<{ embedding?: number[], summary?: any }> {
    
    // [SAFETY] Cost Guardrail
    if (process.env.DRY_RUN === 'true') {
      return { 
        embedding: new Array(1536).fill(0), // Mock vector
        summary: { note: "DRY_RUN_SKIPPED" } 
      };
    }

    const nodeText = node.content.join(' ').trim();
    
    // [FIX] Contextual Embedding Strategy
    // We prepend the parent's header/text so the child node "(f) two calls per week" 
    // becomes "Debt Collection Regulations Section 7.04 (f) two calls per week".
    // This makes isolated paragraphs searchable.
    const textForEmbedding = `${parentContext} \n ${nodeText}`.trim();
    
    // 1. Skip empty or structural-only nodes 
    if (nodeText.length < 5 && node.children.length > 0) {
      // If it's a tiny container node (e.g. just "Part 1") with children, 
      // we might skip embedding it directly to reduce noise, 
      // OR we embed it to catch high-level queries. 
      // Let's keep embedding it but use the full text.
    }

    // 2. Generate Embedding (Vector)
    // Using the CONTEXTUAL text
    const embedding = await this.ai.generateEmbedding(textForEmbedding);

    // 3. Generate Logic Summary (LLM)
    // We only pay for GPT-4 analysis on nodes that contain actual rules (Sections/Paragraphs)
    let summary = undefined;
    
    // [LLM] filtering: Only summarize "leaf" nodes or substantial sections
    if (['SECTION', 'SUBSECTION', 'PARAGRAPH', 'SUBPARAGRAPH'].includes(node.type)) {
      try {
        // For summary, we might want just the node text to keep the JSON extraction clean,
        // or the context. Let's use context for better reasoning.
        summary = await this.ai.generateLogicSummary(textForEmbedding);
      } catch (error) {
        console.warn(`[Enrichment] Logic summary failed for ${node.tempId}:`, error);
        summary = { error: "Generation Failed" }; 
      }
    }

    return { embedding, summary };
  }
}

/**
 * Mock AI Provider 
 * Used for Unit Tests (always) and Integration Tests (when not testing the LLM connection).
 */
export class MockAiProvider implements IAiProvider {
  async generateEmbedding(text: string): Promise<number[]> {
    // Return a fake 1536-dim vector (Standard OpenAI size)
    return new Array(1536).fill(0.1);
  }

  async generateLogicSummary(text: string): Promise<Record<string, any>> {
    return {
      actor: "Predicted Actor",
      action: "Predicted Action",
      risk: "Low",
      mocked: true
    };
  }
}