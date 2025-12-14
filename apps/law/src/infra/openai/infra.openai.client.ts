import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import { IAiProvider } from '../../ingest/svc/ingest.svc.enrichNode';
import { withRetry } from '../../shared/utils/resilience';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  // Warn but don't crash immediately to allow build to pass if just typechecking
  console.warn("⚠️ Missing OPENAI_API_KEY in environment variables");
}

// [EXPORT 1] The Raw Singleton
export const openai = new OpenAI({ apiKey: apiKey || "dummy-key" });

// [EXPORT 2] The Class Wrapper
export class OpenAiClient implements IAiProvider {
  private client: OpenAI;

  constructor(key: string) {
    this.client = new OpenAI({ apiKey: key });
  }

  async generateEmbedding(text: string): Promise<number[]> {
    // [FIX] Updated property names to match shared resilience utility
    return withRetry(async () => {
      
      const response = await this.client.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
        encoding_format: "float",
      });

      return response.data[0].embedding;

    }, { maxRetries: 3, initialDelayMs: 1000 }); 
  }

  async generateLogicSummary(text: string): Promise<Record<string, any>> {
    const prompt = `
      Analyze this legal text. Extract the Actor (who), the Action (must/must not), 
      and any Exceptions. Return JSON only.
      
      Text: "${text.substring(0, 1000)}"
    `;

    // [FIX] Updated property names to match shared resilience utility
    return withRetry(async () => {
      
      const response = await this.client.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0
      });

      const content = response.choices[0].message.content;
      return content ? JSON.parse(content) : {};

    }, { maxRetries: 3, initialDelayMs: 1000 });
  }
}