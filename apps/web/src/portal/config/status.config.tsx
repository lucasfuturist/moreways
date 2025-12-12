import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  XCircle, 
  Search 
} from "lucide-react";

export type ClaimStatus = 'draft' | 'submitted' | 'reviewing' | 'action_required' | 'accepted' | 'rejected' | 'closed';

export const STATUS_CONFIG: Record<ClaimStatus, { 
  icon: any; 
  label: string; 
  color: string; 
  bg: string; 
  border: string;
  progress: number;
  description: string;
}> = {
  draft: { 
    icon: FileText, 
    label: "Draft", 
    color: "text-slate-500", 
    bg: "bg-slate-500/10", 
    border: "border-slate-500/20",
    progress: 10,
    description: "Claim has not been submitted yet."
  },
  submitted: { 
    icon: CheckCircle2, 
    label: "Received", 
    color: "text-blue-500", 
    bg: "bg-blue-500/10", 
    border: "border-blue-500/20",
    progress: 33,
    description: "We have received your claim details."
  },
  reviewing: { 
    icon: Search, 
    label: "Under Review", 
    color: "text-indigo-500", 
    bg: "bg-indigo-500/10", 
    border: "border-indigo-500/20",
    progress: 60,
    description: "An attorney is currently evaluating your case."
  },
  action_required: { 
    icon: AlertCircle, 
    label: "Action Needed", 
    color: "text-amber-500", 
    bg: "bg-amber-500/10", 
    border: "border-amber-500/20",
    progress: 60,
    description: "We need more information to proceed."
  },
  accepted: { 
    icon: CheckCircle2, 
    label: "Case Opened", 
    color: "text-emerald-500", 
    bg: "bg-emerald-500/10", 
    border: "border-emerald-500/20",
    progress: 100,
    description: "A partner firm has accepted your case."
  },
  rejected: { 
    icon: XCircle, 
    label: "Declined", 
    color: "text-red-500", 
    bg: "bg-red-500/10", 
    border: "border-red-500/20",
    progress: 100,
    description: "We could not match this claim with a partner."
  },
  closed: { 
    icon: FileText, 
    label: "Closed", 
    color: "text-slate-400", 
    bg: "bg-slate-400/10", 
    border: "border-slate-400/20",
    progress: 100,
    description: "This file has been archived."
  },
};

export const getStatusUI = (status: string) => {
  return STATUS_CONFIG[status as ClaimStatus] || STATUS_CONFIG.draft;
};