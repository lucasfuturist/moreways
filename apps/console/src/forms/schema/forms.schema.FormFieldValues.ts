/**
 * forms.schema.FormFieldValues
 *
 * Defines the shape of the data stored in a form submission.
 * Simple key-value map where values can be primitives or arrays (for multiselect).
 */
export type FormFieldValues = Record<string, unknown>;