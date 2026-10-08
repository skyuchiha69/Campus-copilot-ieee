import React from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';
import { GroundingStatus } from '../../types';

interface GroundingIndicatorProps {
  status?: GroundingStatus;
  size?: 'sm' | 'md';
}

export const ConfidenceIndicator: React.FC<GroundingIndicatorProps> = ({
  status = 'strongly_grounded',
  size = 'sm',
}) => {
  const getConfig = () => {
    switch (status) {
      case 'strongly_grounded':
        return {
          icon: <ShieldCheck className="w-3 h-3 text-emerald-400" />,
          label: 'Strongly Grounded',
          badgeClass: 'bg-emerald-950/50 text-emerald-300 border-emerald-500/40 shadow-sm',
          tooltip: 'Answer is directly supported and cross-referenced with verified university sources or student portal records.',
        };
      case 'partially_grounded':
        return {
          icon: <AlertTriangle className="w-3 h-3 text-amber-400" />,
          label: 'Partially Grounded',
          badgeClass: 'bg-amber-950/50 text-amber-300 border-amber-500/40 shadow-sm',
          tooltip: 'Answer synthesized from partial syllabus documents with curriculum reasoning required.',
        };
      case 'not_verified':
      default:
        return {
          icon: <AlertCircle className="w-3 h-3 text-rose-400" />,
          label: 'Not Verified',
          badgeClass: 'bg-rose-950/50 text-rose-300 border-rose-500/40 shadow-sm',
          tooltip: 'Information not found in verified university sources. Flagged to admin knowledge gap console.',
        };
    }
  };

  const config = getConfig();

  return (
    <div
      title={config.tooltip}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${config.badgeClass}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
};
