import { z } from "zod";

// [1] Field Definition Schema (Loose Validation for LLM Output)
const LlmFormFieldSchema = z.object({
  kind: z.string().optional(), 
  type: z.string().optional(),
  
  title: z.string().optional(),
  description: z.string().optional(),
  
  // [FIX] Added .optional() to prevent validation errors if LLM omits this
  placeholder: z.string()
    .describe("A realistic, specific example value (e.g. 'Jane Doe', '$75,000').")
    .optional(),
  
  options: z.any().optional(),
  isRequired: z.boolean().optional(),
  
  layout: z.any().optional(),
  logic: z.any().optional(),
  metadata: z.any().optional(),
  
  // Allow numeric bounds for sliders
  min: z.number().optional(),
  max: z.number().optional(),
}).passthrough();

// [2] Inner Schema Definition
export const FormSchemaDefinitionSchema = z.object({
  type: z.literal("object").optional(),
  properties: z.record(LlmFormFieldSchema),
  required: z.array(z.string()).optional(),
  order: z.array(z.string()).optional(),
});

// [3] The Envelope
export const FormGenerationEnvelopeSchema = z.object({
  thought_process: z.string().optional(),
  summary_message: z.string().default("I've updated the form."),
  schema_update: FormSchemaDefinitionSchema,
});

export type FormGenerationEnvelope = z.infer<typeof FormGenerationEnvelopeSchema>;