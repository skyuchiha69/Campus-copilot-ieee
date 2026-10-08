import React from 'react';
import { Lock, ShieldCheck } from 'lucide-react';

interface PrivacyBadgeProps {
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const PrivacyBadge: React.FC<PrivacyBadgeProps> = ({
  label = 'Private to you',
  size = 'md',
  className = '',
}) => {
  const sizeStyles = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      title="This record is retrieved from your authenticated student portal and is never visible to others."
      className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-purple-950/70 text-purple-200 border border-purple-500/40 shadow-sm backdrop-blur-sm ${sizeStyles} ${className}`}
    >
      <Lock className="w-3 h-3 text-purple-300" />
      <span>{label}</span>
    </span>
  );
};
