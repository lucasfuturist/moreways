// src/forms/logic/forms.logic.naturalizer.ts

import type { FormFieldDefinition } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

const GREETINGS = [
  "Let's start with the basics.",
  "First things first.",
  "To get started,",
  "Let's begin."
];

const TRANSITIONS = [
  "Got it.",
  "Understood.",
  "Okay.",
  "Thanks.",
  "Noted.",
  "Alright.",
  "Moving on,"
];

/**
 * Cleans a field title for insertion into a sentence.
 * "Date of Incident" -> "date of incident"
 * "First Name" -> "first name"
 */
function cleanTitle(title: string): string {
  return title.trim().replace(/\?$/, ""); // Remove trailing question mark
}

/**
 * Returns a random phrasing from an array.
 */
function pick(options: string[]): string {
  return options[Math.floor(Math.random() * options.length)];
}

export function generateNaturalQuestion(
  def: FormFieldDefinition, 
  isFirstField: boolean = false
): string {
  // 1. If the title is already a question, just use it.
  if (def.title.trim().endsWith("?")) {
    return def.title;
  }

  const label = cleanTitle(def.title);
  const lowerLabel = label.toLowerCase();

  // 2. Handle specific "Known Concepts" (The "Smart" part)
  
  // Names
  if (lowerLabel.includes("name")) {
    if (lowerLabel.includes("full")) return pick(["Could you provide your full name?", "What is your full name?", "Please enter your full name."]);
    if (lowerLabel.includes("first")) return pick(["What is your first name?", "Could I get your first name?"]);
    if (lowerLabel.includes("last")) return pick(["And your last name?", "What is your last name?"]);
  }

  // Contact
  if (def.kind === "email" || lowerLabel.includes("email")) {
    return pick(["What is the best email address to reach you?", "Please provide your email address.", "What's your email?"]);
  }
  if (def.kind === "phone" || lowerLabel.includes("phone") || lowerLabel.includes("number")) {
    return pick(["What is a good phone number for you?", "Please enter your phone number.", "How can we reach you by phone?"]);
  }

  // Dates
  if (def.kind === "date" || lowerLabel.includes("date") || lowerLabel.includes("when")) {
    return pick([`When is the ${label}?`, `What is the ${label}?`, `Could you select the ${label}?`]);
  }

  // Descriptions / Long Text
  if (def.kind === "textarea" || lowerLabel.includes("describe") || lowerLabel.includes("tell us")) {
    return pick([
      `Please describe the ${label}.`, 
      `Can you tell me about the ${label}?`, 
      `In your own words, what is the ${label}?`
    ]);
  }

  // 3. Generic Fallbacks (Varied phrasing)
  const prefix = isFirstField ? pick(GREETINGS) + " " : "";
  
  const templates = [
    `What is the ${label}?`,
    `Please enter the ${label}.`,
    `Could you provide the ${label}?`,
    `Next, looking for the ${label}.`
  ];

  return prefix + pick(templates);
}

export function generateNaturalTransition(): string {
  return pick(TRANSITIONS);
}