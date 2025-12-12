# File Scan

**Roots:**

- `C:\projects\moreways\argueOS-v1-form\src\crm`


## Tree: C:\projects\moreways\argueOS-v1-form\src\crm

```
crm/

├── repo/
│   ├── crm.repo.ClientRepo.ts
│   ├── crm.repo.FormSubmissionRepo.ts
│   ├── crm.repo.MatterRepo.ts
├── schema/
│   ├── crm.schema.ClientModel.ts
│   ├── crm.schema.FormSubmissionModel.ts
│   ├── crm.schema.MatterModel.ts
├── ui/
│   ├── ClaimAnalysisCard.tsx
│   ├── CrmDashboard.tsx
│   ├── MemoExportButton.tsx
│   ├── SubmissionInbox.tsx
├── util/
│   ├── crm.util.memoFormatter.ts

```

## Files

### `C:/projects/moreways/argueOS-v1-form/src/crm/repo/crm.repo.ClientRepo.ts`

```ts
import { db } from "@/infra/db/infra.repo.dbClient";
import type { Client } from "@/crm/schema/crm.schema.ClientModel";

export const ClientRepo = {
  /**
   * Create a new Client. 
   * Maps Domain Model (First/Last) -> DB Model (FullName).
   */
  async create(data: Omit<Client, "id" | "createdAt" | "updatedAt">) {
    return await db.client.create({
      data: {
        organizationId: data.organizationId,
        email: data.email,
        phone: data.phone,
        // [FIX] DB expects 'fullName', Domain has First/Last
        fullName: `${data.firstName} ${data.lastName}`.trim(),
        
        // Optional: Link to portal user if provided
        userId: data.externalPortalUserId,
      }
    });
  },

  async findByEmail(organizationId: string, email: string) {
    const record = await db.client.findFirst({
      where: { organizationId, email }
    });

    if (!record) return null;

    // [FIX] Split fullName back to First/Last for domain model
    const [firstName, ...rest] = record.fullName.split(" ");
    const lastName = rest.join(" ");

    return {
        id: record.id,
        organizationId: record.organizationId,
        firstName,
        lastName: lastName || "",
        email: record.email || "",
        phone: record.phone || undefined,
        externalPortalUserId: record.userId || undefined,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        status: 'lead' as const // DB doesn't track client status, defaulting
    };
  }
};
```

### `C:/projects/moreways/argueOS-v1-form/src/crm/repo/crm.repo.FormSubmissionRepo.ts`

```ts
/**
 * crm.repo.FormSubmissionRepo.ts
 *
 * Repository for handling Form Submissions.
 * Bridges the gap between the raw DB schema (Prisma) and the Domain Model.
 *
 * Capabilities:
 * - fetching submissions scoped by Organization
 * - creating new submissions (with auto-client creation/linking)
 * - mapping DB JSON types to TypeScript interfaces
 * - [SECURITY] Handles Field-Level Encryption (FLE) for PII fields
 * - [AUDIT] Logs PII access events
 *
 * Related docs:
 * - 04-data-and-api-spec.md
 * - 03-security-and-data-handling.md (Encryption Policy)
 */

import { db } from "@/infra/db/infra.repo.dbClient";
import type { FormSubmission } from "@/crm/schema/crm.schema.FormSubmissionModel";
import { Prisma } from "@prisma/client";
import { EncryptionService } from "@/infra/security/security.svc.encryption";
import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import { AuditService } from "@/infra/audit/infra.svc.audit"; // [NEW]

/**
 * [INTERNAL] Helper to identify which keys in a schema require encryption.
 */
function getSensitiveKeys(schema: FormSchemaJsonShape): Set<string> {
  const sensitive = new Set<string>();
  if (!schema?.properties) return sensitive;

  for (const [key, def] of Object.entries(schema.properties)) {
    if (def.metadata?.isPII) {
      sensitive.add(key);
    }
  }
  return sensitive;
}

/**
 * [INTERNAL] Helper to decrypt data object based on schema.
 */
function decryptSubmissionData(data: Record<string, any>, schema: FormSchemaJsonShape): Record<string, any> {
  const sensitiveKeys = getSensitiveKeys(schema);
  const cleanData = { ...data };

  for (const key of sensitiveKeys) {
    const value = cleanData[key];
    // Only attempt decrypt if it looks like our packed format (iv:tag:content)
    if (typeof value === 'string' && value.includes(':')) {
      const decrypted = EncryptionService.decrypt(value);
      // If decryption succeeds, replace; otherwise keep raw (or handle error)
      if (decrypted !== null) {
        cleanData[key] = decrypted;
      }
    }
  }
  return cleanData;
}

export const FormSubmissionRepo = {
  /**
   * Create a new submission.
   * 
   * [SECURITY] Automatically encrypts fields marked as `isPII` in the schema.
   * Automatically handles Client linking logic.
   */
  async create(input: {
    organizationId: string;
    formSchemaId: string;
    submissionData: Record<string, any>;
    flags?: any[]; 
    clientId?: string;
  }) {
    // 1. Determine Client ID (Auto-Linking Logic)
    let clientId = input.clientId;
    
    if (!clientId) {
       // Heuristic: Try to find by email in the form data
       const emailKey = Object.keys(input.submissionData).find(k => /email/i.test(k));
       const email = emailKey ? input.submissionData[emailKey] : null;

       const nameKey = Object.keys(input.submissionData).find(k => /name|full/i.test(k));
       const name = nameKey ? input.submissionData[nameKey] : "Anonymous User";
       
       if (email) {
           const existing = await db.client.findFirst({
               where: { organizationId: input.organizationId, email: String(email) }
           });
           
           if (existing) {
               clientId = existing.id;
           } else {
               const newClient = await db.client.create({
                   data: {
                       organizationId: input.organizationId,
                       email: String(email),
                       fullName: String(name),
                   }
               });
               clientId = newClient.id;
           }
       } else {
           const anon = await db.client.create({
               data: {
                   organizationId: input.organizationId,
                   fullName: "Anonymous Web User",
               }
           });
           clientId = anon.id;
       }
    }

    // 2. [SECURITY] Encrypt Sensitive Data
    // We must fetch the schema definition to know which fields are PII.
    const formDef = await db.formSchema.findUnique({
      where: { id: input.formSchemaId },
      select: { schemaJson: true }
    });

    const securedData = { ...input.submissionData };

    if (formDef) {
      const schema = formDef.schemaJson as unknown as FormSchemaJsonShape;
      const sensitiveKeys = getSensitiveKeys(schema);

      for (const key of sensitiveKeys) {
        const val = securedData[key];
        if (typeof val === 'string' && val.length > 0) {
          securedData[key] = EncryptionService.encrypt(val);
        }
      }
    }

    // 3. Persist Submission
    const record = await db.formSubmission.create({
      data: {
        organizationId: input.organizationId,
        formSchemaId: input.formSchemaId,
        clientId: clientId!, 
        submissionData: securedData as Prisma.InputJsonValue,
        flags: (input.flags || []) as Prisma.InputJsonValue
      }
    });

    return {
        id: record.id,
        organizationId: record.organizationId,
        createdAt: record.createdAt
    };
  },

  /**
   * Get all submissions for an organization.
   * [SECURITY] Decrypts data on-the-fly for authorized viewers.
   */
  async findMany(organizationId: string, formId?: string) {
    const whereClause: any = { organizationId };
    
    if (formId) {
      whereClause.formSchemaId = formId;
    }

    const records = await db.formSubmission.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        formSchema: {
            select: { schemaJson: true, version: true }
        }
      }
    });

    return records.map(r => {
      const schema = r.formSchema.schemaJson as unknown as FormSchemaJsonShape;
      const rawData = r.submissionData as Record<string, any>;
      
      // [SECURITY] Decrypt PII for display
      const cleanData = decryptSubmissionData(rawData, schema);

      return {
        id: r.id,
        organizationId: r.organizationId,
        formSchemaId: r.formSchemaId,
        formVersionId: r.formSchema.version.toString(),
        submissionData: cleanData, 
        schemaSnapshot: (schema as any) || {},
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        isDraft: false, 
        flags: (r.flags as any[]) || [] 
      };
    });
  },

  /**
   * Get a single detailed submission.
   * [SECURITY] Decrypts data on-the-fly.
   * [AUDIT] Logs access event.
   */
  async findById(organizationId: string, submissionId: string, actorId: string = "unknown") {
    const record = await db.formSubmission.findFirst({
      where: { id: submissionId, organizationId }, // [SECURITY] Scope by Org
      include: {
        formSchema: {
            select: { schemaJson: true, version: true }
        }
      }
    });

    if (!record) return null;

    const schema = record.formSchema?.schemaJson as unknown as FormSchemaJsonShape;
    const rawData = record.submissionData as Record<string, any>;
    
    // [SECURITY] Decrypt
    const cleanData = decryptSubmissionData(rawData, schema);

    // [AUDIT] Log PII Access
    AuditService.log({
        actorId: actorId,
        action: "PII_ACCESS",
        targetId: submissionId,
        metadata: {
            organizationId,
            schemaId: record.formSchemaId
        }
    });

    return {
      id: record.id,
      organizationId: record.organizationId,
      formSchemaId: record.formSchemaId,
      formVersionId: record.formSchema.version.toString(),
      submissionData: cleanData,
      schemaSnapshot: (schema as any) || {},
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      isDraft: false,
      flags: (record.flags as any[]) || []
    };
  }
};

export const formSubmissionRepo = FormSubmissionRepo;
```

### `C:/projects/moreways/argueOS-v1-form/src/crm/repo/crm.repo.MatterRepo.ts`

```ts
import { db } from "@/infra/db/infra.repo.dbClient";
import { MatterStatus } from "@prisma/client"; 

export const MatterRepo = {
  /**
   * Find matters for an org, optionally filtered by client.
   */
  async findMany(organizationId: string, clientId?: string) {
    const where: any = { organizationId };
    if (clientId) where.clientId = clientId;

    return await db.matter.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        client: true
      }
    });
  },

  /**
   * Create a new Matter from a Lead/Submission.
   */
  async create(data: { 
    organizationId: string; 
    clientId: string; 
    name: string; 
    status?: MatterStatus 
  }) {
    return await db.matter.create({
      data: {
        organizationId: data.organizationId,
        clientId: data.clientId,
        name: data.name,
        status: data.status || 'LEAD'
      }
    });
  },

  /**
   * Update matter status.
   */
  async updateStatus(organizationId: string, matterId: string, status: MatterStatus) {
    return await db.matter.update({
      where: { id: matterId, organizationId }, // [SECURITY]
      data: { status }
    });
  }
};
```

### `C:/projects/moreways/argueOS-v1-form/src/crm/schema/crm.schema.ClientModel.ts`

```ts
/**
 * Module: ClientModel
 * 
 * Represents a person seeking legal services.
 * Linked to an Organization (Tenant).
 * Can optionally link back to an external Portal User ID (from Moreways Site).
 */

import { z } from "zod";

export const ClientSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string(), // [MULTI-TENANT]
  
  // Link to external auth/portal system (optional)
  externalPortalUserId: z.string().optional(),
  
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  
  // Basic CRM Metadata
  status: z.enum(["lead", "active", "churned", "archived"]).default("lead"),
  source: z.string().optional(), // e.g., "AI Intake", "Referral"
  
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Client = z.infer<typeof ClientSchema>;
```

### `C:/projects/moreways/argueOS-v1-form/src/crm/schema/crm.schema.FormSubmissionModel.ts`

```ts
/**
 * Module: FormSubmissionModel
 * 
 * Represents the structured data returned from the Intake Form / AI Chat.
 * This is the immutable record of what the client said.
 */

import { z } from "zod";

export const FormSubmissionSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string(), // [MULTI-TENANT]
  
  // Context
  formSchemaId: z.string(),
  formVersionId: z.string(),
  matterId: z.string().optional(), // Might be a loose submission before a Matter exists
  
  // The Payload
  // We use z.record(z.any()) for the raw JSONB answers
  answers: z.record(z.string(), z.any()),
  
  // Completion metadata
  isDraft: z.boolean().default(false),
  completionPercentage: z.number().min(0).max(100).default(0),
  
  // Logic/Risk Flags generated by the system
  riskScore: z.number().optional(), // 0-100
  flags: z.array(z.string()).default([]), // e.g. ["urgent", "statute_warning"]
  
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type FormSubmission = z.infer<typeof FormSubmissionSchema>;
```

### `C:/projects/moreways/argueOS-v1-form/src/crm/schema/crm.schema.MatterModel.ts`

```ts
/**
 * Module: MatterModel
 * 
 * Represents a specific legal case or engagement.
 * A Client can have multiple Matters.
 */

import { z } from "zod";

// Aligned with Portal Status but with internal granularity
export const MatterStatusSchema = z.enum([
  "intake_pending",   // Client is filling form
  "intake_submitted", // Ready for review
  "in_review",        // Lawyer is looking
  "info_requested",   // Need more docs
  "accepted",         // Case opened
  "rejected",         // No case
  "closed"            // Archive
]);

export type MatterStatus = z.infer<typeof MatterStatusSchema>;

export const MatterSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string(), // [MULTI-TENANT]
  clientId: z.string(),
  
  title: z.string(), // e.g. "Smith v. Landlord"
  description: z.string().optional(),
  
  status: MatterStatusSchema.default("intake_submitted"),
  
  // Workflow tracking
  assignedUserId: z.string().optional(), // Lawyer assigned
  
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Matter = z.infer<typeof MatterSchema>;
```

### `C:/projects/moreways/argueOS-v1-form/src/crm/ui/ClaimAnalysisCard.tsx`

```tsx
"use client";

import React from "react";
import { clsx } from "clsx";
import { ShieldAlert, CheckCircle, AlertTriangle, XCircle, Gavel, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Sparkline } from "@/components/viz/Sparkline"; // Assuming you have this or generic div

// Reuse the schema type or define locally for UI
interface ClaimAssessment {
  meritScore: number;
  category: "high_merit" | "potential" | "low_merit" | "frivolous" | "insufficient_data";
  primaFacieAnalysis: {
    duty: string;
    breach: string;
    causation: string;
    damages: string;
  };
  credibilityFlags: string[];
  summary: string;
}

interface ClaimAnalysisCardProps {
  assessment: ClaimAssessment | null;
  isLoading: boolean;
  onRunAssessment: () => void;
}

export function ClaimAnalysisCard({ assessment, isLoading, onRunAssessment }: ClaimAnalysisCardProps) {
  if (!assessment && !isLoading) {
    return (
      <GlassCard className="p-6 flex flex-col items-center justify-center text-center space-y-4 border-dashed border-slate-700 bg-slate-900/30">
        <div className="p-3 rounded-full bg-slate-800 text-slate-400">
            <Gavel className="w-6 h-6" />
        </div>
        <div>
            <h3 className="text-sm font-bold text-slate-200">AI Merit Analysis</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">Run a preliminary legal check on this intake.</p>
        </div>
        <button 
            onClick={onRunAssessment}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
        >
            Run Assessment
        </button>
      </GlassCard>
    );
  }

  if (isLoading) {
    return (
        <GlassCard className="p-8 flex flex-col items-center justify-center space-y-4">
            <div className="relative">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
            </div>
            <p className="text-xs font-mono text-indigo-400 animate-pulse">ANALYZING PRIMA FACIE ELEMENTS...</p>
        </GlassCard>
    );
  }

  if (!assessment) return null;

  // Visual Logic
  const scoreColor = 
    assessment.meritScore >= 80 ? "text-emerald-400" : 
    assessment.meritScore >= 50 ? "text-amber-400" : "text-red-400";
  
  const ringColor = 
    assessment.meritScore >= 80 ? "border-emerald-500" : 
    assessment.meritScore >= 50 ? "border-amber-500" : "border-red-500";

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* SCORE HEADER */}
        <div className="flex gap-4">
            <GlassCard noPadding className="flex-1 p-5 flex items-center justify-between bg-gradient-to-br from-slate-900 to-slate-950 border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Gavel className="w-24 h-24" />
                </div>
                
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Merit Score</span>
                        <span className={clsx("text-[9px] px-1.5 py-0.5 rounded border border-white/10 uppercase font-mono", scoreColor)}>
                            {assessment.category.replace("_", " ")}
                        </span>
                    </div>
                    <div className={clsx("text-4xl font-black tracking-tighter", scoreColor)}>
                        {assessment.meritScore}/100
                    </div>
                </div>

                {/* Donut Chart Simulation */}
                <div className={clsx("w-16 h-16 rounded-full border-4 flex items-center justify-center shadow-[0_0_20px_currentColor]", ringColor, scoreColor)}>
                    <span className="text-lg font-bold">{assessment.meritScore}</span>
                </div>
            </GlassCard>
        </div>

        {/* SUMMARY & FLAGS */}
        <GlassCard noPadding className="p-5 space-y-4 bg-slate-900/50">
            <div>
                <h4 className="text-[10px] font-bold uppercase text-slate-500 mb-2">Executive Summary</h4>
                <p className="text-sm text-slate-200 leading-relaxed italic border-l-2 border-indigo-500 pl-3">
                    "{assessment.summary}"
                </p>
            </div>

            {assessment.credibilityFlags.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2 text-red-400">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-wide">Credibility Warnings</span>
                    </div>
                    <ul className="space-y-1">
                        {assessment.credibilityFlags.map((flag, i) => (
                            <li key={i} className="text-xs text-red-300 flex items-start gap-1.5">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-red-500" />
                                {flag}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </GlassCard>

        {/* PRIMA FACIE GRID */}
        <div className="grid grid-cols-2 gap-3">
            <ElementBox label="Duty" value={assessment.primaFacieAnalysis.duty} />
            <ElementBox label="Breach" value={assessment.primaFacieAnalysis.breach} />
            <ElementBox label="Causation" value={assessment.primaFacieAnalysis.causation} />
            <ElementBox label="Damages" value={assessment.primaFacieAnalysis.damages} />
        </div>
    </div>
  );
}

function ElementBox({ label, value }: { label: string, value: string }) {
    const isNegative = value.toLowerCase().includes("n/a") || value.toLowerCase().includes("unclear") || value.toLowerCase().includes("no ");
    return (
        <GlassCard noPadding className={clsx("p-3 border-l-2", isNegative ? "border-l-red-500 bg-red-500/5" : "border-l-emerald-500 bg-emerald-500/5")}>
            <div className="flex justify-between items-start mb-1">
                <span className="text-[9px] font-bold uppercase text-slate-500">{label}</span>
                {isNegative ? <XCircle className="w-3 h-3 text-red-500" /> : <CheckCircle className="w-3 h-3 text-emerald-500" />}
            </div>
            <p className="text-xs text-slate-300 line-clamp-3 leading-snug">{value}</p>
        </GlassCard>
    );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/crm/ui/CrmDashboard.tsx`

```tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Clock, 
  MessageSquare,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

// Mock Data - Simplified for clarity
const METRICS = [
  { label: "People Waiting", value: "8", subtext: "2 came in today", icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
  { label: "Unread Messages", value: "3", subtext: "Needs reply", icon: MessageSquare, color: "text-blue-400", bg: "bg-blue-400/10" },
  { label: "Active Clients", value: "24", subtext: "In progress", icon: Users, color: "text-indigo-400", bg: "bg-indigo-400/10" },
  { label: "Signed Up", value: "142", subtext: "This year", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
];

export default function CrmDashboard() {
  const router = useRouter();

  return (
    <div className="h-full w-full bg-[#0F172A] text-slate-200 p-8 font-sans relative overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 pr-4"> 
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2 font-heading">Good Morning</h1>
          <p className="text-slate-400">Here is what's happening with your leads today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="primary" onClick={() => router.push('/crm/inbox')}>
            Go to Inbox <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {METRICS.map((metric, i) => (
          <GlassCard key={i} className="relative overflow-hidden group border-white/5" hoverEffect={true}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl ${metric.bg} ${metric.color}`}>
                <metric.icon className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{metric.value}</h3>
            <p className="text-sm font-medium text-slate-400">{metric.label}</p>
            <p className="text-xs text-slate-500 mt-1">{metric.subtext}</p>
          </GlassCard>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Recent Leads */}
        <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                <button onClick={() => router.push('/crm/inbox')} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">View Inbox</button>
            </div>
            
            <div className="space-y-3">
                {[
                    { id: 1, name: "John Smith", action: "Submitted Intake", time: "10m ago", tag: "Potential New Client" },
                    { id: 2, name: "Jane Doe", action: "Sent a message", time: "2h ago", tag: "Needs Reply" },
                    { id: 3, name: "Mike Ross", action: "Signed Agreement", time: "4h ago", tag: "Client" },
                ].map((item) => (
                    <GlassCard key={item.id} noPadding className="p-4 flex items-center justify-between hover:bg-white/5 cursor-pointer group transition-all" onClick={() => router.push(`/crm/inbox`)}>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white">{item.name}</h4>
                                <p className="text-xs text-slate-400">{item.action} • {item.time}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-500 font-medium">{item.tag}</span>
                            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="space-y-6">
            <GlassCard className="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border-indigo-500/30">
                <h3 className="text-sm font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                    <button onClick={() => router.push('/crm/inbox')} className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-slate-200 transition-colors flex items-center justify-between group">
                        <span>Reply to Messages</span>
                        <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">3</span>
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-slate-200 transition-colors flex items-center justify-between group">
                        <span>Copy Intake Link</span>
                        <span className="text-slate-500 group-hover:text-white text-xs">Copy</span>
                    </button>
                </div>
            </GlassCard>
        </div>
      </div>
    </div>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/crm/ui/MemoExportButton.tsx`

```tsx
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
```

### `C:/projects/moreways/argueOS-v1-form/src/crm/ui/SubmissionInbox.tsx`

```tsx
"use client";

import React, { useState, useEffect } from "react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/Button";
import { 
  Mail, ChevronRight, User, 
  Send, Phone
} from "lucide-react";
import type { FormSchema } from "@/forms/schema/forms.schema.FormSchemaModel";
import type { FormFieldDefinition } from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import { MemoExportButton } from "@/crm/ui/MemoExportButton"; 
import { ClaimAnalysisCard } from "@/crm/ui/ClaimAnalysisCard"; // [NEW]

// --- Types ---
interface SubmissionSummary { 
  id: string; 
  createdAt: string; 
  submissionData: Record<string, any>; 
  formSchemaId: string; 
}

interface SubmissionDetail extends SubmissionSummary { 
  schemaSnapshot: { 
    properties: Record<string, FormFieldDefinition>; 
    order?: string[]; 
  }; 
}

// [NEW] Local state for the analysis result
interface ClaimAssessment {
  meritScore: number;
  category: "high_merit" | "potential" | "low_merit" | "frivolous" | "insufficient_data";
  primaFacieAnalysis: {
    duty: string;
    breach: string;
    causation: string;
    damages: string;
  };
  credibilityFlags: string[];
  summary: string;
}

type TabView = "messages" | "details" | "analysis"; // Added "analysis"
type FilterType = "new" | "talking" | "done";

const MOCK_MESSAGES = [
    { id: 1, sender: 'client', text: 'I submitted the info. Did you get it?', time: '10:30 AM' },
    { id: 2, sender: 'agent', text: 'Yes, I have it right here. I am reviewing it now.', time: '10:32 AM' },
];

function inferColumns(data: Record<string, any>) {
  const keys = Object.keys(data);
  const nameKey = keys.find(k => /name|full/i.test(k)) || keys[0];
  const emailKey = keys.find(k => /email|mail/i.test(k));
  const phoneKey = keys.find(k => /phone|mobile|cell/i.test(k));
  return {
    name: data[nameKey] || "Unknown Client",
    email: emailKey ? data[emailKey] : "—",
    phone: phoneKey ? data[phoneKey] : "—",
  };
}

export default function InboxPage() {
  // Data State
  const [submissions, setSubmissions] = useState<SubmissionSummary[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<SubmissionSummary[]>([]);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [detail, setDetail] = useState<SubmissionDetail | null>(null);
  const [forms, setForms] = useState<FormSchema[]>([]);
  
  // [NEW] Assessment State
  const [assessment, setAssessment] = useState<ClaimAssessment | null>(null);
  const [isAssessing, setIsAssessing] = useState(false);

  // Loading State
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // UI State
  const [activeTab, setActiveTab] = useState<TabView>("messages");
  const [activeFilter, setActiveFilter] = useState<FilterType>("new");
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState(MOCK_MESSAGES);

  useEffect(() => {
    async function loadData() {
        try {
            const formsRes = await fetch("/api/forms");
            const formsData = await formsRes.json();
            setForms(formsData);

            if (formsData.length > 0) {
                const subRes = await fetch(`/api/crm/submissions?formId=${formsData[0].id}`);
                const subData = await subRes.json();
                const subs = Array.isArray(subData) ? subData : [];
                setSubmissions(subs);
                setFilteredSubmissions(subs);
            }
        } catch (e) {
            console.error("Failed to load inbox", e);
        } finally {
            setIsLoadingList(false);
        }
    }
    loadData();
  }, []);

  useEffect(() => {
      setFilteredSubmissions(submissions);
  }, [activeFilter, submissions]);

  useEffect(() => {
    if (!selectedSubmissionId) { 
        setDetail(null); 
        setAssessment(null); // Reset assessment on switch
        return; 
    }
    setIsLoadingDetail(true);
    setAssessment(null);
    
    fetch(`/api/crm/submissions/${selectedSubmissionId}`)
      .then(res => res.json())
      .then(data => { setDetail(data); setIsLoadingDetail(false); });
  }, [selectedSubmissionId]);

  // [NEW] Action to trigger AI analysis
  const handleRunAssessment = async () => {
      if (!detail) return;
      setIsAssessing(true);
      try {
          const formName = forms.find(f => f.id === detail.formSchemaId)?.name;
          const res = await fetch("/api/ai/assess-claim", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                  submissionData: detail.submissionData,
                  formName 
              })
          });
          const result = await res.json();
          if (result.error) throw new Error(result.error);
          setAssessment(result);
      } catch (err) {
          alert("Assessment failed. Check console.");
          console.error(err);
      } finally {
          setIsAssessing(false);
      }
  };

  const handleSendMessage = () => {
      if (!chatInput.trim()) return;
      const newMsg = { 
          id: Date.now(), 
          sender: 'agent', 
          text: chatInput, 
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
      };
      setChatHistory([...chatHistory, newMsg]);
      setChatInput("");
  };

  const currentFormName = forms.find(f => f.id === detail?.formSchemaId)?.name;

  const renderDetailContent = () => {
    if (!selectedSubmissionId) return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center opacity-60">
            <div className="w-20 h-20 rounded-[2rem] bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-6 shadow-inner border border-slate-200 dark:border-white/5">
                <User className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No Selection</h3>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-2 max-w-xs">Select a person from the inbox to start communicating.</p>
        </div>
    );

    if (isLoadingDetail || !detail) return (
        <div className="h-full flex items-center justify-center gap-2 text-sm text-indigo-500 font-medium animate-pulse">
            <div className="w-2 h-2 bg-current rounded-full" /> Loading client info...
        </div>
    );

    const { schemaSnapshot, submissionData } = detail;
    const fieldOrder = schemaSnapshot.order || Object.keys(schemaSnapshot.properties || {});
    const cols = inferColumns(submissionData);

    return (
      <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
        
        {/* HEADER */}
        <div className="flex-none px-6 py-5 border-b border-slate-200/60 dark:border-white/5 bg-white/40 dark:bg-white/[0.02] backdrop-blur-md flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 flex items-center justify-center flex-none border border-indigo-200 dark:border-white/10 shadow-sm">
                    <User className="w-6 h-6" />
                </div>
                <div className="flex flex-col min-w-0">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white truncate font-heading">{cols.name}</h2>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {cols.email}</span>
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {cols.phone}</span>
                    </div>
                </div>
            </div>

            {/* TABS SWITCHER */}
            <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-lg border border-slate-200 dark:border-white/10">
                <button 
                    onClick={() => setActiveTab("messages")} 
                    className={clsx("px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wide transition-all", activeTab === 'messages' ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300")}
                >
                    Chat
                </button>
                <button 
                    onClick={() => setActiveTab("details")} 
                    className={clsx("px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wide transition-all", activeTab === 'details' ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300")}
                >
                    Info
                </button>
                {/* [NEW] Analysis Tab */}
                <button 
                    onClick={() => setActiveTab("analysis")} 
                    className={clsx("px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wide transition-all", activeTab === 'analysis' ? "bg-white dark:bg-slate-800 text-rose-500 dark:text-rose-400 shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300")}
                >
                    AI Assess
                </button>
            </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-transparent relative">
           
           {/* TAB: MESSAGES */}
           {activeTab === 'messages' && (
               <div className="flex flex-col h-full animate-in slide-in-from-bottom-2 fade-in duration-300">
                   <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                       <div className="text-center text-xs text-slate-400 my-4 uppercase tracking-widest font-bold opacity-50">Today</div>
                       {chatHistory.map((msg) => (
                           <div key={msg.id} className={clsx("flex flex-col max-w-[80%]", msg.sender === 'agent' ? "self-end items-end" : "self-start items-start")}>
                               <div className={clsx("px-4 py-3 rounded-2xl text-sm shadow-sm leading-relaxed", 
                                   msg.sender === 'agent' ? "bg-indigo-600 text-white rounded-br-sm" : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 rounded-bl-sm"
                               )}>
                                   {msg.text}
                               </div>
                               <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                           </div>
                       ))}
                   </div>
                   
                   <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 flex gap-2 items-center">
                       <input 
                           className="flex-1 bg-slate-100 dark:bg-slate-950 border-transparent rounded-full px-4 h-10 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-black transition-colors outline-none placeholder:text-slate-400"
                           placeholder="Type a message (SMS)..."
                           value={chatInput}
                           onChange={(e) => setChatInput(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                       />
                       <Button size="icon" onClick={handleSendMessage} className="rounded-full bg-indigo-600 hover:bg-indigo-500 h-10 w-10">
                           <Send className="w-4 h-4" />
                       </Button>
                   </div>
               </div>
           )}

           {/* TAB: INFO (Data View) */}
           {activeTab === 'details' && (
               <div className="p-8 space-y-6 max-w-2xl mx-auto animate-in slide-in-from-bottom-2 fade-in duration-300">
                   <div className="flex justify-end border-b border-slate-200 dark:border-white/5 pb-4 mb-4">
                        <MemoExportButton 
                            schema={{...schemaSnapshot, type: "object"}} 
                            submissionData={submissionData}
                            clientName={cols.name}
                            formName={currentFormName}
                            submissionDate={detail.createdAt}
                            variant="secondary"
                            size="sm"
                            className="text-xs"
                        />
                   </div>
                   {fieldOrder.map(key => {
                     const def = schemaSnapshot.properties[key];
                     if (!def || def.kind === 'info' || def.kind === 'divider') return null;
                     
                     if (def.kind === 'header') return (
                        <div key={key} className="pt-6 pb-2 border-b border-slate-200 dark:border-white/5">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{def.title}</h4>
                        </div>
                     );

                     return (
                       <div key={key} className="group">
                         <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">{def.title}</label>
                         <div className="text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm leading-relaxed">
                            {submissionData[key] ? String(submissionData[key]) : <span className="text-slate-400 italic">No response</span>}
                         </div>
                       </div>
                     )
                   })}
                   <div className="h-12" />
               </div>
           )}

           {/* [NEW] TAB: ANALYSIS (AI Judge) */}
           {activeTab === 'analysis' && (
               <div className="p-8 max-w-2xl mx-auto">
                   <ClaimAnalysisCard 
                       assessment={assessment} 
                       isLoading={isAssessing} 
                       onRunAssessment={handleRunAssessment} 
                   />
               </div>
           )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full p-4 lg:p-6 overflow-hidden flex gap-6 relative">
        
        {/* LEFT PANEL: Inbox List */}
        <div className="w-[380px] xl:w-[420px] flex-none flex flex-col glass-panel rounded-[2rem] overflow-hidden shadow-2xl relative bg-white/90 dark:bg-slate-900/60 border-white/50 dark:border-white/10 backdrop-blur-2xl transition-all duration-500">
            <div className="flex-none px-6 py-5 border-b border-slate-200 dark:border-white/5 flex flex-col gap-4 bg-white/50 dark:bg-white/5">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold font-heading text-slate-900 dark:text-white tracking-tight">Inbox</h1>
                </div>
                <div className="flex gap-2">
                    {[{ id: 'new', label: 'New' }, { id: 'talking', label: 'Talking' }, { id: 'done', label: 'Done' }].map((f) => (
                        <button key={f.id} onClick={() => setActiveFilter(f.id as FilterType)} className={clsx("flex-1 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border transition-all", activeFilter === f.id ? "bg-slate-800 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-sm" : "bg-white/50 dark:bg-white/5 border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-white/10")}>{f.label}</button>
                    ))}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-white/30 dark:bg-transparent">
                {isLoadingList ? (
                    <div className="p-4 space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse" />)}</div>
                ) : filteredSubmissions.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center"><Mail className="w-8 h-8 text-slate-300 mb-2" /><p className="text-xs text-slate-500">No messages.</p></div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                        {filteredSubmissions.map(sub => {
                            const cols = inferColumns(sub.submissionData);
                            const isSelected = selectedSubmissionId === sub.id;
                            return (
                                <div key={sub.id} onClick={() => setSelectedSubmissionId(sub.id)} className={clsx("flex flex-col gap-1 p-4 cursor-pointer transition-all border-l-4 hover:bg-slate-50 dark:hover:bg-white/5 relative", isSelected ? "bg-indigo-50/50 dark:bg-white/5 border-indigo-500" : "border-transparent")}>
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={clsx("font-bold text-sm", isSelected ? "text-indigo-900 dark:text-white" : "text-slate-700 dark:text-slate-200")}>{cols.name}</span>
                                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded">{new Date(sub.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                                        <span className="truncate max-w-[180px] flex items-center gap-1">{activeFilter === 'new' ? "New Inquiry" : "Latest message..."}</span>
                                        {isSelected && <ChevronRight className="w-3 h-3" />}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>

        {/* RIGHT PANEL: Chat & Info */}
        <div className="flex-1 flex flex-col glass-panel rounded-[2rem] overflow-hidden shadow-2xl relative bg-white/80 dark:bg-slate-900/40 border-white/50 dark:border-white/10 backdrop-blur-2xl transition-all duration-500">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />
             {renderDetailContent()}
        </div>
    </div>
  );
}
```

### `C:/projects/moreways/argueOS-v1-form/src/crm/util/crm.util.memoFormatter.ts`

```ts
/**
 * crm.util.memoFormatter
 *
 * Pure utility to transform a structured FormSubmission into a readable
 * Markdown/Text "Legal Memo" format for clipboard export.
 *
 * Improvements:
 * - Handles undefined booleans correctly (doesn't default to "No").
 * - Includes Client Name and Form Name in header.
 * - Groups array values (multiselect) cleanly.
 *
 * Related docs:
 * - 01-product-spec-v1.md (Turn data into work product)
 */

import type { FormSchemaJsonShape } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

export function formatSubmissionAsMemo(
  schema: FormSchemaJsonShape, 
  data: Record<string, any>,
  meta: { clientName?: string; formName?: string; submissionDate?: string } = {}
): string {
  const lines: string[] = [];
  
  // 1. Memo Header
  lines.push(`# INTAKE SUMMARY`);
  if (meta.formName) lines.push(`**Form:** ${meta.formName}`);
  if (meta.clientName) lines.push(`**Client:** ${meta.clientName}`);
  lines.push(`**Exported:** ${new Date().toLocaleString()}`);
  if (meta.submissionDate) lines.push(`**Submitted:** ${new Date(meta.submissionDate).toLocaleString()}`);
  lines.push(`---`);
  lines.push(``);

  // 2. Determine Order
  const keys = schema.order || Object.keys(schema.properties);

  // 3. Iterate Fields
  keys.forEach((key) => {
    const field = schema.properties[key];
    if (!field) return;

    const value = data[key];
    // Check strictly for undefined/null/empty-string, but allow 0 or false
    const hasValue = value !== undefined && value !== null && value !== "";

    switch (field.kind) {
      // Structural Elements
      case "header":
        lines.push(``);
        lines.push(`## ${field.title.toUpperCase()}`);
        lines.push(``);
        break;
      
      case "info":
      case "divider":
        // Skip static elements in output
        break;

      // Booleans
      case "checkbox":
      case "switch":
        if (!hasValue) {
            lines.push(`- **${field.title}:** (No answer)`);
        } else {
            lines.push(`- **${field.title}:** ${value ? "Yes" : "No"}`);
        }
        break;

      // Arrays (Multi-select / Checkbox Groups)
      case "checkbox_group":
      case "multiselect":
        lines.push(`- **${field.title}:**`);
        if (Array.isArray(value) && value.length > 0) {
           value.forEach((v: string) => lines.push(`  * ${v}`));
        } else if (!hasValue || (Array.isArray(value) && value.length === 0)) {
           lines.push(`  (None selected)`);
        }
        break;

      // Standard Values
      default:
        lines.push(`- **${field.title}:** ${hasValue ? value : "(No answer)"}`);
        break;
    }
  });

  // 4. Footer
  lines.push(``);
  lines.push(`---`);
  lines.push(`*End of Intake Record*`);

  return lines.join("\n");
}
```

