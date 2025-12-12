// src/intake/ui/intake.ui.FormFromPromptPage.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion"; 
import { 
  MessageSquare, Undo2, Redo2, Code2, 
  LayoutTemplate, ChevronLeft, Save, Loader2 
} from "lucide-react";

import { ChatPanel } from "./chat/ChatPanel";
import { ReactiveCanvas } from "@/forms/ui/canvas/ReactiveCanvas";
import { FormSchemaPreview } from "@/intake/ui/intake.ui.FormSchemaPreview";
import { AssistantPanel } from "@/forms/ui/ai/AssistantPanel";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ThemeToggle"; 
import { AuroraBackground } from "@/components/ui/aurora-background";
import { HistoryControl } from "@/forms/ui/editor/HistoryControl"; 

import { useHistory } from "@/forms/ui/hooks/forms.ui.hooks.useHistory";
import { useLocalStorage } from "@/infra/ui/hooks/useLocalStorage";
import { useOs } from "@/infra/ui/hooks/useOs";

import { ElementInventory } from "@/forms/ui/inventory/ElementInventory";
import { injectCatalogItem } from "@/forms/util/forms.util.elementInjector";
import { CommandPalette } from "@/forms/ui/overlays/CommandPalette";
import { SaveFormDialog } from "@/forms/ui/overlays/SaveFormDialog";
import { ShareDialog } from "@/forms/ui/overlays/ShareDialog";

import type { FormSchemaJsonShape, FormFieldDefinition } from "@/forms/schema/forms.schema.FormSchemaJsonShape";
import type { FormSchema } from "@/forms/schema/forms.schema.FormSchemaModel";
import type { FormVersionSummary } from "@/forms/repo/forms.repo.FormSchemaRepo";

// --- Types ---

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp?: number;
}

// --- Helpers ---

function deserializeSchemaToFields(schema: FormSchemaJsonShape): any[] {
    if (!schema || !schema.properties) return [];
    const requiredSet = new Set(schema.required || []);
    const fieldKeys = schema.order || Object.keys(schema.properties);
    
    return fieldKeys.map(key => {
        const def = schema.properties[key];
        if (!def) return null;
        
        if (def.options && Array.isArray(def.options)) {
            def.options = def.options.map((opt: any) => ({
                id: opt.id || crypto.randomUUID(),
                label: opt.label || String(opt),
                value: opt.value || String(opt).toLowerCase().replace(/\s/g, '_')
            }));
        }

        return { key, def, isRequired: requiredSet.has(key) };
    }).filter((f): f is any => f !== null);
}

function serializeCanvasToSchema(fields: any[], messages?: Message[]): FormSchemaJsonShape {
  const properties: Record<string, FormFieldDefinition> = {};
  const order: string[] = [];
  
  fields.forEach((f) => {
    const def = { ...f.def };
    properties[f.key] = def;
    order.push(f.key);
  });
  
  const schema: FormSchemaJsonShape = { 
      type: "object", 
      properties, 
      order, 
      required: fields.filter((f) => f.isRequired).map((f) => f.key) 
  };

  if (messages && messages.length > 0) {
      schema.metadata = {
          ...schema.metadata,
          chatHistory: messages.map(m => ({
              role: m.role,
              content: m.text,
              timestamp: m.timestamp
          }))
      };
  }

  return schema;
}

// --- Component ---

interface FormFromPromptPageProps {
    initialFormId?: string;
}

export default function FormFromPromptPage({ initialFormId }: FormFromPromptPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { os, metaKey } = useOs();
  
  // [INTEGRATION] Context Detection
  const context = searchParams.get("context");
  const isAdmin = context === "admin";

  // -- Core State --
  const [formId, setFormId] = useState<string | null>(initialFormId || null);
  const [formName, setFormName] = useState("New Form");
  const [version, setVersion] = useState<number>(0);
  const [versions, setVersions] = useState<FormVersionSummary[]>([]);
  
  // -- AI State --
  const INIT_MSG: Message = { 
    id: "init", 
    role: "assistant", 
    text: isAdmin 
        ? "I am your Template Architect. Describe the master form you want to create for the platform." 
        : "I am your Legal Architect. Describe the matter, and I'll design the intake form for you.", 
    timestamp: Date.now() 
  };
  
  const [messages, setMessages] = useState<Message[]>([INIT_MSG]);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // -- History & Canvas --
  const { state: fields, set: setFields, undo, redo, canUndo, canRedo } = useHistory<any[]>([]);
  
  // -- UI Toggles --
  const [isInventoryOpen, setIsInventoryOpen] = useLocalStorage("argueos_inventory_open", false);
  const [isChatOpen, setIsChatOpen] = useLocalStorage("argueos_chat_open", true);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [isBlueprintMode, setIsBlueprintMode] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [mode, setMode] = useState<"builder" | "preview">("builder");

  // 1. Load Initial Data
  useEffect(() => {
    if (initialFormId) {
        setIsLoading(true);
        fetch(`/api/forms/${initialFormId}`)
            .then(res => res.json())
            .then((data: FormSchema) => {
                setFormName(data.name);
                setVersion(data.version);
                setFields(deserializeSchemaToFields(data.schemaJson));
                
                const hist = data.schemaJson.metadata?.chatHistory;
                if (Array.isArray(hist) && hist.length > 0) {
                    const restoredMessages = hist.map((h: any, idx: number) => ({
                        id: `restored_${idx}`,
                        role: h.role,
                        text: h.content || h.text,
                        timestamp: h.timestamp || Date.now()
                    }));
                    setMessages(restoredMessages);
                }

                fetch(`/api/forms/${initialFormId}/versions`)
                    .then(r => r.json())
                    .then(setVersions)
                    .catch(console.error);
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }
  }, [initialFormId]);

  // Keyboard Shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
        if (e.key === "j" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setIsCmdOpen(o => !o); }
        if (e.key === "b" && !e.metaKey && !e.ctrlKey && (e.target as HTMLElement).tagName !== "INPUT" && (e.target as HTMLElement).tagName !== "TEXTAREA") setIsBlueprintMode(p => !p);
        if (e.key === "s" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setIsSaveDialogOpen(true); }
        if (e.key === "z" && (e.metaKey || e.ctrlKey)) {
             if (e.shiftKey) redo(); else undo();
        }
    };
    window.addEventListener("keydown", down); return () => window.removeEventListener("keydown", down);
  }, [undo, redo]);

  // Handlers
  const handleCommand = (action: string, payload?: any) => {
    if (action === "undo") undo();
    if (action === "redo") redo();
    if (action === "addElement" && payload) setFields(injectCatalogItem(fields, payload));
    if (action === "save") setIsSaveDialogOpen(true);
  };

  // [INTEGRATION] Dynamic Back Navigation
  const handleBack = () => {
      if (isAdmin) {
          router.push('/admin');
      } else {
          router.push('/forms');
      }
  };

  const handleSaveConfirm = async (name: string) => {
    setIsSaving(true);
    const schema = serializeCanvasToSchema(fields, messages);
    try {
        const url = formId ? `/api/forms/${formId}` : `/api/forms`;
        const method = formId ? "PUT" : "POST";
        // In a real app, Admin might set a specific "Global/System" Organization ID
        const body = formId ? { schema, name } : { name, schema, organizationId: "org_default_local" };
        
        const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) throw new Error("Save failed");
        
        const data = await res.json();
        const newId = data.id || data.formSchemaId;
        
        setFormId(newId);
        setFormName(name);
        setVersion(data.version);
        
        if(newId) {
            fetch(`/api/forms/${newId}/versions`).then(r => r.json()).then(setVersions);
            // [INTEGRATION] Preserve context param
            const nextUrl = `/forms/${newId}/editor${isAdmin ? '?context=admin' : ''}`;
            window.history.pushState({}, "", nextUrl);
        }
        
        setIsSaveDialogOpen(false);
    } catch (e) { 
        alert("Save failed"); 
    } finally {
        setIsSaving(false);
    }
  };

  const handleSchemaUpdate = (newSchema: FormSchemaJsonShape, message: string) => {
      console.log("[NewForm] Received AI Schema Update:", newSchema);
      const newFields = deserializeSchemaToFields(newSchema);
      setFields(newFields);
  };

  const getCurrentSchema = (): FormSchemaJsonShape => {
      return serializeCanvasToSchema(fields);
  };

  const runAiAction = async (userPrompt: string) => {
      if (!userPrompt.trim()) return;

      setIsLoading(true);
      
      const newMsg: Message = { id: Date.now().toString(), role: 'user', text: userPrompt, timestamp: Date.now() };
      const updatedMessages = [...messages, newMsg];
      setMessages(updatedMessages);
      setPrompt("");

      try {
          const currentSchema = serializeCanvasToSchema(fields); 
          const history = updatedMessages.map(m => ({ role: m.role, content: m.text }));

          const res = await fetch("/api/intake/forms/from-prompt", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  prompt: userPrompt,
                  organizationId: "org_default_local",
                  currentSchema,
                  history
              })
          });

          if (!res.ok) {
              throw new Error(`AI request failed (${res.status})`);
          }

          const data = await res.json();

          const newHistory = [...updatedMessages, { 
              id: Date.now().toString(), 
              role: 'assistant' as const, 
              text: data.message, 
              timestamp: Date.now() 
          }];
          setMessages(newHistory);

          if (data.schema) {
              handleSchemaUpdate(data.schema, data.message);
              
              if (data.formSchemaId) {
                  setFormId(data.formSchemaId);
                  setVersion(data.version);
                  fetch(`/api/forms/${data.formSchemaId}/versions`).then(r => r.json()).then(setVersions);
              }
          }

      } catch (error: any) {
          console.error("AI Action Error:", error);
          setMessages(prev => [...prev, { 
              id: Date.now().toString(), 
              role: 'assistant', 
              text: "System Error: I couldn't update the form. Please try again.", 
              timestamp: Date.now() 
          }]);
      } finally {
          setIsLoading(false);
      }
  };

  const panelTransition = { type: "spring", stiffness: 350, damping: 35 } as const;

  return (
    <div className="h-screen w-screen overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 relative selection:bg-indigo-500/30 font-sans transition-colors duration-500">
      
      {/* Overlays */}
      <CommandPalette isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} onAction={handleCommand} />
      <SaveFormDialog isOpen={isSaveDialogOpen} onClose={() => setIsSaveDialogOpen(false)} onSave={handleSaveConfirm} currentName={formName} />
      <ShareDialog isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} formId={formId} />

      {/* 1. GLOBAL BACKGROUND LAYERS */}
      <AuroraBackground className="fixed inset-0 z-0 opacity-60 dark:opacity-40 pointer-events-none" children={null} />
      <div className="bg-noise" />

      {/* 2. FLOATING HEADER */}
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <header className="pointer-events-auto w-full max-w-[95%] xl:max-w-7xl h-16 rounded-[2rem] bg-white/95 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-indigo-500/5 flex items-center justify-between px-6 transition-all duration-500">
            
            {/* Left: Branding & Status */}
            <div className="flex items-center gap-4">
                <button onClick={handleBack} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex flex-col">
                    <h1 className="text-sm font-bold font-heading text-slate-900 dark:text-white tracking-wide flex items-center">
                        {/* [INTEGRATION] Visual Indicator */}
                        {isAdmin && <span className="text-rose-500 mr-2 text-[10px] uppercase border border-rose-500/30 px-1 rounded bg-rose-500/10">Template Mode</span>}
                        {formName}
                    </h1>
                    <div className="flex items-center gap-1.5">
                        <div className={clsx("w-1.5 h-1.5 rounded-full", version > 0 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-amber-500")} />
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">
                            {isSaving ? "Saving..." : version > 0 ? `v${version} Saved` : 'Draft'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Center: Sliding View Switcher */}
            <div className="hidden md:flex items-center bg-transparent rounded-full p-1 relative">
                <div className="absolute inset-1 flex pointer-events-none">
                    <motion.div 
                        className="w-1/2 h-full bg-slate-100 dark:bg-indigo-600 rounded-full shadow-sm"
                        layoutId="view-toggle"
                        animate={{ x: mode === "builder" ? "0%" : "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                </div>
                <button onClick={() => setMode("builder")} className={clsx("relative z-10 px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-200", mode === "builder" ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200")}>Builder</button>
                <button onClick={() => setMode("preview")} className={clsx("relative z-10 px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-200", mode === "preview" ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200")}>Preview</button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                <div className="hidden lg:flex items-center bg-slate-100/50 dark:bg-white/5 rounded-full p-1 border border-slate-200/50 dark:border-white/5 mr-2">
                    <button onClick={undo} disabled={!canUndo} className="p-2 rounded-full hover:bg-white dark:hover:bg-white/10 text-slate-400 dark:text-slate-400 disabled:opacity-30 transition-colors"><Undo2 className="w-4 h-4"/></button>
                    <button onClick={redo} disabled={!canRedo} className="p-2 rounded-full hover:bg-white dark:hover:bg-white/10 text-slate-400 dark:text-slate-400 disabled:opacity-30 transition-colors"><Redo2 className="w-4 h-4"/></button>
                </div>
                <ThemeToggle />
                <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1" />
                <Button variant="primary" size="sm" onClick={() => setIsSaveDialogOpen(true)} className="rounded-full px-6 shadow-lg shadow-indigo-500/20 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                </Button>
                <button onClick={() => setIsChatOpen(!isChatOpen)} className={clsx("p-2.5 rounded-full transition-all border", isChatOpen ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400" : "bg-transparent border-transparent text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5")}>
                    <MessageSquare className="w-5 h-5" />
                </button>
            </div>
        </header>
      </div>

      {/* 3. WORKSPACE (Floating Islands) */}
      <div className="absolute inset-0 top-24 bottom-6 px-6 flex gap-6 z-10 pointer-events-none">
        
        {/* LEFT: AI Architect */}
        <AnimatePresence mode="popLayout">
            {isChatOpen && (
                <motion.aside
                    initial={{ width: 0, opacity: 0, x: -20 }}
                    animate={{ width: 400, opacity: 1, x: 0 }}
                    exit={{ width: 0, opacity: 0, x: -20 }}
                    transition={panelTransition}
                    className="flex-none flex flex-col pointer-events-auto glass-panel rounded-[2rem] overflow-hidden shadow-2xl bg-white/95 dark:bg-slate-900/80 border-white/50 dark:border-white/10 backdrop-blur-2xl"
                >
                    <div className="w-full h-full flex flex-col">
                        <AssistantPanel 
                            formId={formId || "new"} 
                            currentSchema={getCurrentSchema()} 
                            onSchemaUpdate={handleSchemaUpdate} 
                            onMinimize={() => setIsChatOpen(false)}
                            messages={messages}
                            setMessages={setMessages}
                        />
                    </div>
                </motion.aside>
            )}
        </AnimatePresence>

        {/* RIGHT: Canvas */}
        <motion.section 
            layout 
            transition={panelTransition}
            className="flex-1 flex flex-col pointer-events-auto glass-panel rounded-[2rem] overflow-hidden shadow-2xl relative bg-white/90 dark:bg-slate-900/40 border-white/50 dark:border-white/10"
        >
            {mode === "builder" ? (
                <div className="h-full flex flex-col relative">
                    {/* Inner Toolbar */}
                    <div className="h-12 border-b border-slate-200/50 dark:border-white/5 flex items-center justify-between px-6 bg-white/20 dark:bg-white/5">
                        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-500">
                            <button onClick={() => setIsBlueprintMode(!isBlueprintMode)} className={clsx("hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2", isBlueprintMode && "text-cyan-600 dark:text-cyan-400")}>
                                <Code2 className="w-3 h-3" /> Blueprint
                            </button>
                            <button onClick={() => setIsInventoryOpen(!isInventoryOpen)} className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2">
                                <LayoutTemplate className="w-3 h-3" /> Elements
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 relative overflow-hidden">
                        <ReactiveCanvas 
                            fields={fields} 
                            setFields={setFields} 
                            onFieldAiRequest={(key, p) => runAiAction(p)} 
                            isBlueprintMode={isBlueprintMode} 
                            onToggleChat={() => setIsChatOpen(!isChatOpen)}
                            onToggleElements={() => setIsInventoryOpen(!isInventoryOpen)}
                        />
                    </div>

                    {/* [UPDATED] Replaced fixed slider with concealed control */}
                    <HistoryControl 
                        versions={versions} 
                        currentVersionId={formId || ""} 
                        onSelectVersion={(id) => {
                            setFormId(id);
                            fetch(`/api/forms/${id}`).then(r=>r.json()).then(d => {
                                setFields(deserializeSchemaToFields(d.schemaJson));
                                setVersion(d.version);
                            });
                        }}
                    />
                </div>
            ) : (
                <div className="h-full overflow-y-auto p-8 bg-slate-50 dark:bg-slate-950">
                    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <FormSchemaPreview schema={serializeCanvasToSchema(fields)} formId={formId} />
                    </div>
                </div>
            )}
        </motion.section>

        {/* RIGHT DRAWER: Inventory */}
        <AnimatePresence mode="popLayout">
            {isInventoryOpen && (
                <motion.aside
                    initial={{ width: 0, opacity: 0, x: 20 }}
                    animate={{ width: 288, opacity: 1, x: 0 }} 
                    exit={{ width: 0, opacity: 0, x: 20 }}
                    transition={panelTransition}
                    className="flex-none pointer-events-auto glass-panel rounded-[2rem] overflow-hidden shadow-2xl bg-white/95 dark:bg-slate-900/80"
                >
                    <div className="w-72 h-full flex flex-col">
                        <ElementInventory onAdd={(item) => setFields(injectCatalogItem(fields, item))} onClose={() => setIsInventoryOpen(false)} />
                    </div>
                </motion.aside>
            )}
        </AnimatePresence>

      </div>
    </div>
  );
}