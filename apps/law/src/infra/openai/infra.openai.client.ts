import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import { IAiProvider } from '../../ingest/svc/ingest.svc.enrichNode';
import { withRetry } from '../../shared/utils/resilience';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("Missing OPENAI_API_KEY in environment variables");
}

// [EXPORT 1] The Raw Singleton
// Useful for quick access if needed elsewhere, but try to use the Class Wrapper
export const openai = new OpenAI({ apiKey });

// [EXPORT 2] The Class Wrapper
export class OpenAiClient implements IAiProvider {
  private client: OpenAI;

  constructor(key: string) {
    this.client = new OpenAI({ apiKey: key });
  }

  async generateEmbedding(text: string): Promise<number[]> {
    // Wrapped in Retry Logic: 3 retries, starting at 1s delay
    return withRetry(async () => {
      
      const response = await this.client.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
        encoding_format: "float",
      });

      return response.data[0].embedding;

    }, 3, 1000, "OpenAI:Embedding");
  }

  async generateLogicSummary(text: string): Promise<Record<string, any>> {
    const prompt = `
      Analyze this legal text. Extract the Actor (who), the Action (must/must not), 
      and any Exceptions. Return JSON only.
      
      Text: "${text.substring(0, 1000)}"
    `;

    // Wrapped in Retry Logic
    return withRetry(async () => {
      
      const response = await this.client.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0
      });

      const content = response.choices[0].message.content;
      return content ? JSON.parse(content) : {};

    }, 3, 1000, "OpenAI:LogicSummary");
  }
}