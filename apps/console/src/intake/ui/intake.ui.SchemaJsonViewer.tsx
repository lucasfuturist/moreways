// src/intake/ui/intake.ui.SchemaJsonViewer.tsx

import React from "react";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

interface SchemaJsonViewerProps {
  schema: FormSchemaJsonShape | null;
}

export function SchemaJsonViewer({ schema }: SchemaJsonViewerProps) {
  if (!schema) {
    return (
      <div className="p-4 text-sm text-gray-500 italic border border-dashed rounded bg-gray-50">
        No schema generated yet.
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
        Schema JSON Definition
      </h3>
      <div className="bg-slate-900 text-slate-50 p-4 rounded-md overflow-x-auto shadow-sm">
        <pre className="text-xs font-mono leading-relaxed">
          {JSON.stringify(schema, null, 2)}
        </pre>
      </div>
    </div>
  );
}