// src/forms/ui/canvas/DraggableFieldList.tsx

import React, { useState, useRef, useEffect } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { clsx } from "clsx";
import { FieldRenderer } from "./forms.ui.canvas.FieldRenderer";
import { FieldToolbar } from "./FieldToolbar";
import type { FormFieldDefinition } from "@/forms/schema/forms.schema.FormSchemaJsonShape";

interface DraggableListProps {
  fields: any[];
  setFields: (fields: any[]) => void;
  activeFieldIdx: number | null;
  onSelectField: (idx: number | null, e?: React.MouseEvent<HTMLDivElement>) => void; 
  onUpdateField: (idx: number, updates: any) => void;
  onDuplicateField: (idx: number) => void;
  onDeleteField: (idx: number) => void;
  isBlueprintMode?: boolean;
}

export function DraggableFieldList({ 
  fields, 
  setFields, 
  activeFieldIdx, 
  onSelectField, 
  onUpdateField,
  onDuplicateField,
  onDeleteField,
  isBlueprintMode 
}: DraggableListProps) {
  return (
    <Reorder.Group axis="y" values={fields} onReorder={setFields} className="space-y-4 relative p-4 pb-32">
      {fields.map((field, index) => (
        <DraggableItem
          key={field.key}
          item={field}
          index={index}
          isActive={activeFieldIdx === index}
          onClick={(e) => onSelectField(index, e)}
          onUpdate={(u) => onUpdateField(index, u)}
          onDuplicate={() => onDuplicateField(index)}
          onDelete={() => onDeleteField(index)}
          isBlueprintMode={isBlueprintMode}
        />
      ))}
    </Reorder.Group>
  );
}

interface DraggableItemProps {
  item: any;
  index: number;
  isActive: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onUpdate: (u: any) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  isBlueprintMode?: boolean;
}

function DraggableItem({ item, isActive, onClick, onUpdate, onDuplicate, onDelete, isBlueprintMode }: DraggableItemProps) {
  const controls = useDragControls();
  const def = item.def as FormFieldDefinition;
  const ref = useRef<any>(null);
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    if (isBlueprintMode && ref.current) {
        setWidth(ref.current.offsetWidth);
    }
  }, [isBlueprintMode]);

  return (
    <Reorder.Item
      ref={ref}
      value={item}
      dragListener={false}
      dragControls={controls}
      className="relative"
      style={{ zIndex: isActive ? 50 : 1 }}
    >
      {isBlueprintMode && (
        <div className="absolute -top-3 left-0 right-0 flex justify-between px-2 pointer-events-none z-10">
           <span className="text-[9px] font-mono text-cyan-600 dark:text-cyan-400 bg-white/80 dark:bg-black/60 px-1 rounded shadow-sm border border-cyan-100 dark:border-cyan-900">key: {def.key}</span>
           <span className="text-[9px] font-mono text-cyan-600 dark:text-cyan-400 bg-white/80 dark:bg-black/60 px-1 rounded shadow-sm border border-cyan-100 dark:border-cyan-900">
             w: {def.layout?.width || "full"} <span className="opacity-50">({width}px)</span>
           </span>
        </div>
      )}

      {isActive && (
          <FieldToolbar 
            field={item} 
            onUpdate={onUpdate}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
          />
      )}

      <div
        onClick={(e) => { e.stopPropagation(); onClick(e); }}
        className={clsx(
          "relative group p-6 rounded-xl border transition-all duration-300 cursor-pointer backdrop-blur-md",
          // [FIX] Reinforced borders and background opacity for better "weight"
          isBlueprintMode 
            ? "border-dashed border-cyan-500/30 bg-cyan-50/50 dark:bg-cyan-900/10" 
            : "bg-white/95 dark:bg-slate-900/60 border-slate-200/80 dark:border-white/10 shadow-sm",
          
          isActive 
            ? "bg-indigo-50/90 dark:bg-violet-900/40 border-indigo-500/50 dark:border-verdigris-500/50 shadow-xl ring-1 ring-indigo-500/20 dark:ring-verdigris-500/30 translate-x-1 z-10" 
            : "hover:bg-white dark:hover:bg-slate-800/60 hover:shadow-lg hover:border-slate-300 dark:hover:border-white/20"
        )}
      >
        <div className="flex items-start gap-4">
          <div 
            onPointerDown={(e) => controls.start(e)} 
            className={clsx(
                "cursor-grab active:cursor-grabbing p-1.5 rounded-md transition-colors mt-1 flex-shrink-0", 
                isActive ? "text-indigo-600 dark:text-verdigris-400 bg-indigo-100 dark:bg-verdigris-400/10" : "text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400"
            )}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="5" r="2" /><circle cx="9" cy="12" r="2" /><circle cx="9" cy="19" r="2" /><circle cx="15" cy="5" r="2" /><circle cx="15" cy="12" r="2" /><circle cx="15" cy="19" r="2" /></svg>
          </div>

          <div className="flex-1 pointer-events-none select-none min-w-0">
              <FieldRenderer def={def} />
          </div>

          <div className={clsx("absolute top-4 right-4 transition-opacity pointer-events-none", isBlueprintMode || isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50")}>
             <span className="text-[9px] font-mono font-medium text-slate-500 dark:text-slate-400 uppercase bg-slate-100 dark:bg-black/40 px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/10">{def.kind}</span>
          </div>
        </div>
      </div>
    </Reorder.Item>
  );
}