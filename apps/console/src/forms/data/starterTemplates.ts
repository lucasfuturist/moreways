import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

export interface StarterTemplate {
  id: string;
  name: string;
  category: "Torts" | "Family" | "Corporate" | "Labor";
  description: string;
  schema: FormSchemaJsonShape;
}

export const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: "t1",
    name: "Personal Injury Intake",
    category: "Torts",
    description: "Standard slip & fall data collection with incident details.",
    schema: {
      type: "object",
      properties: {
        clientInfo: { id: "f_1", key: "clientInfo", kind: "header", title: "Client Information" },
        fullName: { id: "f_2", key: "fullName", kind: "text", title: "Full Name", isRequired: true },
        phone: { id: "f_3", key: "phone", kind: "phone", title: "Phone Number", isRequired: true },
        incidentDetails: { id: "f_4", key: "incidentDetails", kind: "header", title: "Incident Details" },
        dateOfIncident: { id: "f_5", key: "dateOfIncident", kind: "date", title: "Date of Incident", isRequired: true },
        description: { id: "f_6", key: "description", kind: "textarea", title: "Description of Events", layout: { width: "full" } },
        injuries: { id: "f_7", key: "injuries", kind: "textarea", title: "Injuries Sustained" }
      },
      order: ["clientInfo", "fullName", "phone", "incidentDetails", "dateOfIncident", "description", "injuries"],
      required: ["fullName", "phone", "dateOfIncident"]
    }
  },
  {
    id: "t2",
    name: "Simple NDA Generator",
    category: "Corporate",
    description: "Confidentiality agreement inputs for two parties.",
    schema: {
      type: "object",
      properties: {
        partyA: { id: "f_1", key: "partyA", kind: "header", title: "Disclosing Party" },
        nameA: { id: "f_2", key: "nameA", kind: "text", title: "Entity Name", isRequired: true },
        repA: { id: "f_3", key: "repA", kind: "text", title: "Representative Name" },
        partyB: { id: "f_4", key: "partyB", kind: "header", title: "Receiving Party" },
        nameB: { id: "f_5", key: "nameB", kind: "text", title: "Entity Name", isRequired: true },
        terms: { id: "f_6", key: "terms", kind: "header", title: "Terms" },
        duration: { id: "f_7", key: "duration", kind: "number", title: "Duration (Years)", isRequired: true },
        jurisdiction: { 
            id: "f_8", key: "jurisdiction", kind: "select", title: "Jurisdiction", 
            options: [
                { id: "o_1", label: "Delaware", value: "DE" }, 
                { id: "o_2", label: "California", value: "CA" }, 
                { id: "o_3", label: "New York", value: "NY" }
            ] 
        }
      },
      order: ["partyA", "nameA", "repA", "partyB", "nameB", "terms", "duration", "jurisdiction"],
      required: ["nameA", "nameB", "duration"]
    }
  },
  {
    id: "t3",
    name: "Divorce Consultation",
    category: "Family",
    description: "Initial intake for marital dissolution inquiries.",
    schema: {
      type: "object",
      properties: {
        basics: { id: "f_1", key: "basics", kind: "header", title: "Basics" },
        marriageDate: { id: "f_2", key: "marriageDate", kind: "date", title: "Date of Marriage" },
        separationDate: { id: "f_3", key: "separationDate", kind: "date", title: "Date of Separation" },
        children: { id: "f_4", key: "children", kind: "checkbox", title: "Are there minor children?" },
        assets: { id: "f_5", key: "assets", kind: "header", title: "Assets" },
        realEstate: { id: "f_6", key: "realEstate", kind: "checkbox", title: "Do you own real estate?" },
        notes: { id: "f_7", key: "notes", kind: "textarea", title: "Additional Notes" }
      },
      order: ["basics", "marriageDate", "separationDate", "children", "assets", "realEstate", "notes"],
      required: []
    }
  }
];