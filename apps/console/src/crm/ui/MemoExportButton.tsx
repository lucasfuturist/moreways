/**
 * crm.ui.MemoExportButton
 *
 * UI Component: A button that formats the current submission as a markdown memo
 * and copies it to the user's clipboard.
 */

"use client";

import React, { useState } from "react";
import { Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatSubmissionAsMemo } from "@/crm/util/crm.util.memoFormatter";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

interface MemoExportButtonProps {
  schema: FormSchemaJsonShape;
  submissionData: Record<string, any>;
  clientName?: string;
  formName?: string;
  submissionDate?: string;
  variant?: "ghost" | "secondary" | "primary";
  size?: "sm" | "md";
  className?: string;
}

export function MemoExportButton({ 
  schema, 
  submissionData,
  clientName,
  formName,
  submissionDate,
  variant = "secondary",
  size = "sm",
  className 
}: MemoExportButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied">("idle");

  const handleCopy = async () => {
    // Safety check for clipboard API
    if (!navigator?.clipboard?.writeText) {
        alert("Clipboard access not supported in this browser context.");
        return;
    }

    try {
      const text = formatSubmissionAsMemo(schema, submissionData, { clientName, formName, submissionDate });
      await navigator.clipboard.writeText(text);
      
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      console.error("Memo export failed:", err);
      alert("Could not copy to clipboard. See console for details.");
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleCopy} 
      className={className}
      disabled={status === "copied"}
    >
      {status === "copied" ? (
        <>
          <Check className="w-3.5 h-3.5 mr-2" /> Copied
        </>
      ) : (
        <>
          <FileText className="w-3.5 h-3.5 mr-2" /> Copy as Memo
        </>
      )}
    </Button>
  );
}