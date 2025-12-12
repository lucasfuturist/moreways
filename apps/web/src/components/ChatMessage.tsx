"use client";

import { motion } from "framer-motion";
import { User, Sparkles } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

export default function ChatMessage({ message, isUser }: ChatMessageProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-end gap-3 mb-6 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* 
        AVATAR 
        ------
        User: Neutral Slate (Low profile)
        AI:   Vibrant Indigo/Purple Gradient (High profile, feels like "magic")
      */}
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 relative shadow-sm ring-1 
        ${isUser 
          ? 'bg-slate-200 dark:bg-slate-700 ring-white/50 dark:ring-white/10' 
          : 'bg-gradient-to-br from-indigo-500 to-purple-600 ring-indigo-400/50 shadow-indigo-500/30'
        }
      `}>
        {isUser ? (
          <User className="w-4 h-4 text-slate-500 dark:text-slate-300" />
        ) : (
          <Sparkles className="w-4 h-4 text-white fill-white/20" />
        )}
      </div>

      {/* BUBBLE */}
      <div className={`max-w-[85%] relative group`}>
        <div className={`
            px-5 py-4 text-sm leading-relaxed backdrop-blur-md transition-all duration-300
            ${isUser
              /* USER BUBBLE: 
                 Light Mode: Dark Slate
                 Dark Mode: Indigo (High Contrast)
              */
              ? 'bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl rounded-tr-sm shadow-xl shadow-indigo-900/10 dark:shadow-indigo-500/20 border border-white/10'
              
              /* AI BUBBLE:
                 Light Mode: White Glass
                 Dark Mode: Dark Glass (Slate-800/50)
              */
              : 'bg-white/60 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 rounded-2xl rounded-tl-sm shadow-sm border border-white/50 dark:border-white/10'
            }
          `}
        >
          {message}
        </div>
        
        {/* METADATA LABEL */}
        <div className={`text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity px-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {isUser ? 'You' : 'Moreways Assistant'}
        </div>
      </div>
    </motion.div>
  );
}