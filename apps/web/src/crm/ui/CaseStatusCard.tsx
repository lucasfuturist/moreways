import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface CaseStatusCardProps {
  type: string;
  status: string;
  date: Date;
}

export function CaseStatusCard({ type, status, date }: CaseStatusCardProps) {
  const statusConfig = {
    draft: { color: "bg-slate-100 text-slate-600", icon: Clock, label: "Draft" },
    submitted: { color: "bg-blue-100 text-blue-700", icon: Clock, label: "Submitted" },
    reviewing: { color: "bg-purple-100 text-purple-700", icon: Clock, label: "Under Review" },
    accepted: { color: "bg-green-100 text-green-700", icon: CheckCircle2, label: "Accepted" },
    action_required: { color: "bg-orange-100 text-orange-700", icon: AlertCircle, label: "Action Needed" },
  }[status] || { color: "bg-slate-100", icon: Clock, label: status };

  const Icon = statusConfig.icon;

  return (
    <Card className="p-6 border hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">{type}</h3>
          <p className="text-sm text-slate-500">Created {new Date(date).toLocaleDateString()}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${statusConfig.color}`}>
          <Icon className="w-3 h-3" />
          {statusConfig.label}
        </div>
      </div>
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-primary h-full transition-all duration-500" 
          style={{ width: status === 'submitted' ? '33%' : status === 'reviewing' ? '66%' : status === 'accepted' ? '100%' : '10%' }}
        />
      </div>
    </Card>
  );
}