/**
 * forms.ui.simulator.AutoFillEngine
 *
 * Logic to simulate human typing behavior for form demonstrations.
 * Supports different "Personas" with distinct data patterns.
 */

import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

export type PersonaType = "standard" | "anxious" | "corporate" | "senior";

interface PersonaProfile {
  label: string;
  description: string;
  typingSpeed: number; // ms per char
  dataGenerator: (key: string, kind: string) => any;
}

// --- DATA GENERATORS ---

const GENERATORS: Record<PersonaType, PersonaProfile> = {
  standard: {
    label: "Standard User",
    description: "Efficient, clear answers. Good capitalization.",
    typingSpeed: 30,
    dataGenerator: (key, kind) => {
      const lower = key.toLowerCase();
      if (kind === 'date') return new Date().toISOString().split('T')[0];
      if (kind === 'checkbox') return true;
      if (lower.includes('email')) return "alex.smith@example.com";
      if (lower.includes('phone')) return "(555) 123-4567";
      if (lower.includes('name')) return "Alex Smith";
      if (kind === 'textarea') return "I was walking down the aisle when I slipped on a wet floor sign that had fallen over.";
      return "Sample Answer";
    }
  },
  anxious: {
    label: "Anxious Client",
    description: "Verbose, emotional, lower-case typing. Slow.",
    typingSpeed: 80,
    dataGenerator: (key, kind) => {
      const lower = key.toLowerCase();
      if (kind === 'date') return "2023-11-15";
      if (kind === 'checkbox') return true;
      if (lower.includes('email')) return "worried.customer@gmail.com";
      if (lower.includes('name')) return "jane doe...";
      if (kind === 'textarea') return "it happened so fast... i really dont know what to do now. i am in a lot of pain and i need help asap please.";
      return "please help";
    }
  },
  corporate: {
    label: "Busy Professional",
    description: "Brief, all-caps or jargon-heavy. Super fast.",
    typingSpeed: 10,
    dataGenerator: (key, kind) => {
      const lower = key.toLowerCase();
      if (kind === 'date') return new Date().toISOString().split('T')[0];
      if (kind === 'checkbox') return true;
      if (lower.includes('email')) return "admin@corp.legal";
      if (lower.includes('name')) return "R. STONE";
      if (kind === 'textarea') return "Incident confirmed per attached report. Claimant seeks damages. Proceeding with standard intake protocol.";
      return "N/A";
    }
  },
  senior: {
    label: "Senior Citizen",
    description: "Polite, slow typing. Detailed.",
    typingSpeed: 120,
    dataGenerator: (key, kind) => {
      const lower = key.toLowerCase();
      if (kind === 'date') return "1955-04-12";
      if (kind === 'checkbox') return true;
      if (lower.includes('email')) return "grandpa.joe@aol.com";
      if (lower.includes('name')) return "Mr. Joseph P. Sullivan";
      if (kind === 'textarea') return "Dear Sir/Madam, I am writing to inform you of an unfortunate fall I took at the grocery store last Tuesday.";
      return "Yes, thank you.";
    }
  }
};

/**
 * The Iterator.
 * Takes a schema and a callback, and "plays" the form field by field.
 */
export async function playSimulation(
  schema: FormSchemaJsonShape, 
  persona: PersonaType,
  onFieldUpdate: (key: string, value: any, isFinal: boolean) => void,
  onFieldFocus: (key: string | null) => void
) {
  const profile = GENERATORS[persona];
  const keys = schema.order || Object.keys(schema.properties);

  for (const key of keys) {
    const def = schema.properties[key];
    if (!def || ['header', 'info', 'divider'].includes(def.kind)) continue;

    // 1. Focus Field
    onFieldFocus(key);

    // 2. Generate Target Value
    let targetValue = profile.dataGenerator(key, def.kind);
    
    // Handle Selection Types (Instant fill, no typing)
    if (['select', 'radio', 'checkbox_group'].includes(def.kind)) {
       if (def.options && def.options.length > 0) {
           // Pick first option for simplicity
           const opt = def.options[0];
           targetValue = typeof opt === 'string' ? opt : opt.value;
       }
       // Slight delay for "thinking"
       await new Promise(r => setTimeout(r, 400));
       onFieldUpdate(key, targetValue, true);
       continue;
    }

    // Handle Boolean (Instant)
    if (def.kind === 'checkbox' || def.kind === 'switch') {
        await new Promise(r => setTimeout(r, 400));
        onFieldUpdate(key, true, true);
        continue;
    }

    // 3. Typing Simulation (Strings only)
    if (typeof targetValue === 'string' && targetValue.length > 0) {
        let currentBuffer = "";
        for (const char of targetValue) {
            currentBuffer += char;
            onFieldUpdate(key, currentBuffer, false);
            
            // Randomized variance in typing speed
            const variance = Math.random() * 30 - 15; 
            await new Promise(r => setTimeout(r, profile.typingSpeed + variance));
        }
    } else {
        // Numeric/Date direct set
        onFieldUpdate(key, targetValue, true);
    }

    // Pause between fields
    await new Promise(r => setTimeout(r, 500));
  }

  onFieldFocus(null); // Done
}