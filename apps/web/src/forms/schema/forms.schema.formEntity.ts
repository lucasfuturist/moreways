/**
 * forms.schema.formEntity
 *
 * Defines the structure of a Form in the system.
 * Related docs: 02-technical-vision-and-conventions.md (Section 3)
 */
import { z } from "zod";

export const FormFieldSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  type: z.enum(["text", "number", "date", "select"]),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(),
});

export const FormSchemaDataSchema = z.object({
  title: z.string(),
  fields: z.array(FormFieldSchema),
});

export type FormSchemaData = z.infer<typeof FormSchemaDataSchema>;

export interface FormEntity {
  id: string;
  organizationId: string; // [MULTI-TENANT] Mandatory
  version: number;
  schema: FormSchemaData;
  createdAt: Date;
}
