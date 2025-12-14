// src/forms/logic/forms.logic.naturalizer.ts

import type { FormFieldDefinition } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

const INTROS = [
  "Let's start with the basics.",
  "To get the ball rolling,",
  "First things first,",
  "I'll need to gather some initial details.",
  "Let's begin with this:"
];

const ACKNOWLEDGMENTS = [
  "Got it.",
  "Understood.",
  "Okay, thanks.",
  "That's clear.",
  "Noted.",
  "I see.",
  "Perfect.",
  "Thank you."
];

const BRIDGES = [
  "Moving on,",
  "Next up,",
  "Now,",
  "Next question:",
  "Changing gears slightly,",
  "Just a few more details."
];

function cleanTitle(title: string): string {
  return title.trim().replace(/\?$/, "").replace(/:$/, "");
}

function pick(options: string[]): string {
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Generates a transition phrase to bridge two questions.
 * "Got it. Moving on..."
 */
export function generateNaturalTransition(): string {
  const ack = pick(ACKNOWLEDGMENTS);
  const bridge = pick(BRIDGES);
  
  // 30% chance of just an acknowledgement, 30% just bridge, 40% both
  const roll = Math.random();
  if (roll < 0.3) return `${ack}`;
  if (roll < 0.6) return `${bridge}`;
  return `${ack} ${bridge}`;
}

export function generateNaturalQuestion(
  def: FormFieldDefinition, 
  isFirstField: boolean = false
): string {
  // 1. Preserve explicit questions defined by the lawyer/AI
  if (def.title.trim().endsWith("?")) {
    return isFirstField ? `${pick(INTROS)} ${def.title}` : def.title;
  }

  const label = cleanTitle(def.title);
  const lower = label.toLowerCase();

  // 2. Intelligent Field Mapping
  
  // -- IDENTITY --
  if (lower.includes("name")) {
    if (lower.includes("full")) return pick(["Could you give me your full name?", "What is your full name?", "Please state your full name."]);
    if (lower.includes("first")) return pick(["What's your first name?", "Could I get your first name?"]);
    if (lower.includes("last")) return pick(["And your last name?", "What is your last name?"]);
  }

  // -- CONTACT --
  if (def.kind === "email" || lower.includes("email")) {
    return pick(["What is the best email address for you?", "Where should we email you?", "Please provide your email address."]);
  }
  if (def.kind === "phone" || lower.includes("phone") || lower.includes("number")) {
    return pick(["What is a good phone number to reach you?", "Do you have a cell phone number?", "Please enter your phone number."]);
  }
  if (lower.includes("address") || lower.includes("live") || lower.includes("location")) {
    return pick(["Where are you located?", "What is your current address?", "Could you provide the address?"]);
  }

  // -- TIME --
  if (def.kind === "date" || lower.includes("date") || lower.includes("when")) {
    if (lower.includes("birth")) return "What is your date of birth?";
    return pick([`When did the ${label} happen?`, `What is the ${label}?`, `Could you select the ${label}?`]);
  }

  // -- NARRATIVE --
  if (def.kind === "textarea" || lower.includes("describe") || lower.includes("tell us") || lower.includes("happened")) {
    return pick([
      `Please describe the ${label} in your own words.`, 
      `Can you tell me more about the ${label}?`, 
      `What details can you share about the ${label}?`,
      `Please explain the ${label}.`
    ]);
  }

  // -- FINANCIAL --
  if (def.kind === "currency" || lower.includes("salary") || lower.includes("income") || lower.includes("cost")) {
    return pick([`What is the amount for ${label}?`, `How much is the ${label}?`, `Please estimate the ${label}.`]);
  }

  // 3. Generic Construction (Fallback)
  const prefix = isFirstField ? pick(INTROS) + " " : "";
  
  const templates = [
    `What is the ${label}?`,
    `Please enter the ${label}.`,
    `Could you provide the ${label}?`,
    `I need to know the ${label}.`,
    `Next, looking for the ${label}.`
  ];

  return prefix + pick(templates);
}