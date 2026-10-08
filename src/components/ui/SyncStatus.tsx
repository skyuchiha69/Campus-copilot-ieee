import React from 'react';
import { RefreshCw, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { SyncStatusType } from '../../types';
import { useSync } from '../../context/SyncContext';

interface SyncStatusProps {
  compact?: boolean;
  className?: string;
}

export const SyncStatus: React.FC<SyncStatusProps> = ({ compact = false, className = '' }) => {
  const { status, lastSynced, openSyncModal } = useSync();

  const getConfig = () => {
    switch (status) {
      case 'connected':
        return {
          dotColor: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
          label: 'University data synchronized',
          shortLabel: 'Synced',
          textColor: 'text-emerald-300',
          borderColor: 'border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/40',
        };
      case 'syncing':
        return {
          dotColor: 'bg-amber-400 animate-ping shadow-[0_0_8px_rgba(251,191,36,0.8)]',
          label: 'Updating university information...',
          shortLabel: 'Syncing...',
          textColor: 'text-amber-300',
          borderColor: 'border-amber-500/30 bg-amber-950/20 hover:bg-amber-950/40',
        };
      case 'failed':
        return {
          dotColor: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]',
          label: 'Unable to synchronize',
          shortLabel: 'Sync Alert',
          textColor: 'text-rose-300',
          borderColor: 'border-rose-500/30 bg-rose-950/20 hover:bg-rose-950/40',
        };
      default:
        return {
          dotColor: 'bg-slate-400',
          label: 'Idle',
          shortLabel: 'Idle',
          textColor: 'text-slate-300',
          borderColor: 'border-slate-700 bg-slate-800/30 hover:bg-slate-800/60',
        };
    }
  };

  const config = getConfig();

  return (
    <button
      onClick={openSyncModal}
      type="button"
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 cursor-pointer ${config.borderColor} ${className}`}
      title="Click to view university data synchronization health and freshness"
    >
      <span className="relative flex h-2 w-2">
        {status === 'syncing' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dotColor}`}></span>
      </span>

      <span className={`${config.textColor} hidden sm:inline`}>
        {compact ? config.shortLabel : config.label}
      </span>
      <span className={`${config.textColor} sm:hidden`}>
        {config.shortLabel}
      </span>

      {status === 'syncing' ? (
        <RefreshCw className="w-3 h-3 text-amber-400 animate-spin ml-0.5" />
      ) : (
        <span className="text-[10px] text-slate-400 ml-0.5 hidden md:inline">({lastSynced})</span>
      )}
    </button>
  );
};
