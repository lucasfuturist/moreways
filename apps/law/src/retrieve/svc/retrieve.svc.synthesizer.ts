import { openai } from '../../infra/openai/infra.openai.client';
import { LegalNodeRecord } from '../../graph/schema/graph.schema.nodes';

// [FIX] Updated to use LegalNodeRecord to match ContextAssembler output and resolve Type Errors
export async function synthesizeAnswer(query: string, contextNodes: LegalNodeRecord[]) {
    const contextBlock = contextNodes.map(n => 
        `[${n.urn}] (${n.structure_type}): ${n.content_text}`
    ).join('\n\n');

    const prompt = `
    You are a strict legal assistant. Answer the user query based ONLY on the provided Context.
    
    CONTEXT:
    ${contextBlock}
    
    USER QUERY:
    ${query}
    
    INSTRUCTIONS:
    1. Cite specific URNs for every claim.
    2. If the context does not contain the answer, say "I cannot answer based on the provided laws."
    `;

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0
    });

    return response.choices[0].message.content;
}