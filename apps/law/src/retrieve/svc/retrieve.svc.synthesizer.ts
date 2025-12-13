import { openai } from '../../infra/openai/infra.openai.client';
import { LegalNodeRecord } from '../../graph/schema/graph.schema.nodes';

type Alert = { 
    type: 'OVERRIDE' | 'PREEMPTION' | 'EXPIRY'; 
    message: string; 
    severity: 'WARNING' | 'CRITICAL';
};

export async function synthesizeAnswer(
    query: string, 
    contextNodes: LegalNodeRecord[], 
    alerts: Alert[] = []
) {
    const contextBlock = contextNodes.map(n => 
        `[ID: ${n.urn}] (Type: ${n.structure_type})\n${n.content_text}`
    ).join('\n\n');

    const alertBlock = alerts.length > 0 
        ? alerts.map(a => `⚠️ CRITICAL JUDICIAL ALERT [${a.type}]: ${a.message}`).join('\n')
        : "No judicial overrides active.";

    const prompt = `
    You are a helpful AI assistant designed to explain legal texts in a clear, conversational way.

    **USER'S QUESTION:**
    "${query}"

    ---
    **LEGAL CONTEXT PROVIDED:**
    ${contextBlock}
    
    ---
    **CRITICAL ALERTS:**
    ${alertBlock}

    ---
    **YOUR TASK AND RULES:**

    1.  **BE CONVERSATIONAL:** Address the user directly and explain the concepts simply.
    2.  **STAY GROUNDED:** Base your ENTIRE answer **ONLY** on the Legal Context provided.
    3.  **MANDATORY CITATIONS:** This is a strict rule. Every sentence containing a specific claim or piece of information from the context MUST end with its source ID in brackets. For example: "Dealers are required to repair defects that affect a car's safety or use [urn:ma:lemon_law:7n_3i]." Do not group citations at the end of a paragraph.
    4.  **HANDLE MISSING INFORMATION:** If the context does not contain the answer, state that clearly. For example: "Based on the documents provided, I can't find a specific rule about call frequency."
    5.  **HANDLE ALERTS:** If an alert is present, you MUST warn the user about it.
    ---

    Now, please generate a helpful, conversational response to the user's question, following all rules.
    `;

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "system", content: "You are a helpful legal explainer who cites every fact." },{ role: "user", content: prompt }],
        temperature: 0.1, // Lowered temp slightly to encourage fact-based responses
        max_tokens: 1000
    });

    return response.choices[0].message.content;
}