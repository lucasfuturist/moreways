"use client";

import React, { useEffect, useState } from "react";
import { UnifiedRunner } from "@/components/runner/UnifiedRunner";
import { Loader2, AlertCircle } from "lucide-react";

export default function DynamicIntakePage({ params }: { params: { id: string } }) {
  const [schema, setSchema] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch schema from our local proxy
    fetch(`/api/intake/form/${params.id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Form not found");
        return res.json();
      })
      .then((data) => {
        // Factory returns { id, title, schema: { ... } }
        setSchema(data.schema);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm font-medium uppercase tracking-wider">Loading Intake...</p>
      </div>
    );
  }

  if (error || !schema) {
    return (
      <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center text-red-400 gap-4">
        <AlertCircle className="w-10 h-10" />
        <p className="text-lg font-bold">Unable to load form</p>
        <p className="text-sm text-slate-500">ID: {params.id}</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-slate-950">
      <UnifiedRunner 
        formId={params.id}
        organizationId="org_default_local" // Default org for public link
        schema={schema}
        intent={schema.title || "General Intake"} // Pass the Form Title as Intent to the Brain
      />
    </div>
  );
}