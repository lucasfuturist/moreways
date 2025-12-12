/**
 * scripts/promptCriticScenarios.ts
 *
 * Defines the test cases used by the auto-optimizer to grade the agent's performance.
 * Each scenario represents a known "edge case" or critical interaction type.
 */

export type Role = "user" | "assistant";

export interface TestTurn {
  role: Role;
  text: string;
}

export interface PromptTestScenario {
  id: string;
  label: string;
  formName: string;
  fieldTitle: string;
  fieldKind: string;
  schemaSummary: string;
  history: TestTurn[];   // turns *before* the key user message
  userInput: string;     // the user message we care about
}

/**
 * A small set of known "edge" transcripts where we want
 * high empathy, clarity, goal_alignment, and sensitivity.
 */
export const PROMPT_TEST_SCENARIOS: PromptTestScenario[] = [
  {
    id: "banana_peel",
    label: "Slip-and-fall mention during name field",
    formName: "Personal Injury Intake",
    fieldTitle: "Full Name",
    fieldKind: "text",
    schemaSummary:
      "- Full Name (text)\n- Phone Number (phone)\n- Date of Incident (date)\n- Description of what happened (textarea)",
    history: [
      { role: "assistant", text: "I'm here to help you with the New Form. Let's get started." },
      { role: "assistant", text: "I see. Could you state your full name?" },
    ],
    userInput: "i slipped on a banana peel",
  },
  {
    id: "what_else",
    label: "User asks what else is collected",
    formName: "Divorce Consultation",
    fieldTitle: "Date of Marriage",
    fieldKind: "date",
    schemaSummary: "- Date of Marriage (date)\n- Children (checkbox)\n- Assets (textarea)",
    history: [
      { role: "assistant", text: "When did you get married?" }
    ],
    userInput: "what else are you gonna ask me?",
  },
  {
    id: "is_safe",
    label: "User asks if data is safe",
    formName: "General Intake",
    fieldTitle: "Social Security Number",
    fieldKind: "text",
    schemaSummary: "- Social Security Number (text)\n- Date of Birth (date)",
    history: [
      { role: "assistant", text: "Please provide your SSN." }
    ],
    userInput: "is it safe to put that here?",
  }
];