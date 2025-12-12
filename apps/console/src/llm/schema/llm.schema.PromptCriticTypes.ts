/**
 * llm.schema.PromptCriticTypes
 *
 * Defines the contract for the "Prompt Critic" pipeline.
 * This pipeline analyzes conversation transcripts to grade empathy, clarity, and effectiveness.
 */

export interface ConversationTurn {
  role: "user" | "assistant";
  text: string;
}

export interface PromptCriticInput {
  /** The form context (e.g. "Personal Injury Intake") */
  formName: string;
  
  /** The specific field the agent was trying to fill */
  fieldTitle: string;
  fieldKind: string;
  
  /** A summary of the full form so the critic knows what's possible */
  schemaSummary: string;
  
  /** The recent history leading up to the assistant's last reply */
  turns: ConversationTurn[];
}

export interface PromptCriticScores {
  empathy: number;        // 0-10
  clarity: number;        // 0-10
  goal_alignment: number; // 0-10
  sensitivity: number;    // 0-10 (handling of harm/risk)
}

export interface PromptCriticOutput {
  scores: PromptCriticScores;
  
  /** High-level verdict */
  rating: "good" | "needs_soft_tweak" | "problematic";
  
  /** If the rating is not 'good', what should the agent have said? */
  better_reply: string | null;
  
  /** actionable feedback for the system prompt engineer */
  system_prompt_suggestion: string | null;
  
  /** The critic's reasoning */
  notes: string;
}