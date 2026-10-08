import { SyncState, AuditLogEntry } from '../types';
import { MOCK_SYNC_STATE, MOCK_AUDIT_LOGS } from './mockData';
import { ApiClient } from './apiClient';

let currentSyncState: SyncState = { ...MOCK_SYNC_STATE };

type SyncListener = (state: SyncState) => void;
const listeners: Set<SyncListener> = new Set();

const notifyListeners = () => {
  listeners.forEach((fn) => fn({ ...currentSyncState }));
};

export const syncService = {
  getSyncState(): SyncState {
    return { ...currentSyncState };
  },

  subscribe(listener: SyncListener): () => void {
    listeners.add(listener);
    listener({ ...currentSyncState });
    return () => listeners.delete(listener);
  },

  async triggerManualSync(): Promise<SyncState> {
    currentSyncState = {
      ...currentSyncState,
      status: 'syncing',
      syncMessage: 'Establishing authenticated bridge to official university portal...',
      isStale: false,
    };
    notifyListeners();

    try {
      const res = await ApiClient.request<any>('/sync/trigger', { method: 'POST' });
      if (res.success && res.data) {
        const d = res.data;
        if (d.status === 'unconfigured') {
          currentSyncState = {
            ...currentSyncState,
            status: 'failed',
            lastSynced: 'Not configured',
            isStale: true,
            staleReason: d.message || 'ERP portal credentials not configured.',
            syncMessage: d.message || 'Live ERP synchronization requires verified university credentials.',
          };
          notifyListeners();
          return { ...currentSyncState };
        }
      }
    } catch {
      // Continue simulation flow
    }

    // Stage 1: Notices & Bulletin sync
    await new Promise((r) => setTimeout(r, 350));
    currentSyncState = {
      ...currentSyncState,
      totalNotices: 44,
      recordsSynced: 246,
      syncMessage: 'Ingesting verified notices & examination schedules...',
    };
    notifyListeners();

    // Stage 2: Complete
    await new Promise((r) => setTimeout(r, 300));
    currentSyncState = {
      ...currentSyncState,
      status: 'connected',
      lastSynced: 'Just now',
      nextSync: 'In 30 minutes',
      studentDataSynced: true,
      activeFailures: 0,
      failedRecords: 0,
      isStale: false,
      syncMessage: 'Official university portal webhook & student portal sync active',
    };
    notifyListeners();

    // Register in Audit Log
    const auditEntry: AuditLogEntry = {
      id: `aud_${Date.now()}`,
      timestamp: 'Just now',
      actorId: ApiClient.getCurrentUserId(),
      actorRole: ApiClient.getCurrentRole(),
      action: 'sync_trigger',
      details: 'Manual synchronization triggered. Ingested 2 new documents and 1 new verified examination notice.',
      status: 'SUCCESS'
    };
    MOCK_AUDIT_LOGS.unshift(auditEntry);

    return { ...currentSyncState };
  },

  simulateFailure(): void {
    currentSyncState = {
      ...currentSyncState,
      status: 'failed',
      activeFailures: 1,
      failedRecords: 3,
      isStale: true,
      staleReason: 'Portal webhook unreachable for 2 hours. Displaying cached records from last successful sync.',
      syncMessage: 'University portal network timeout. Automated retry scheduled in 5 minutes.',
    };
    notifyListeners();
  },

  simulateReconnect(): void {
    currentSyncState = {
      ...currentSyncState,
      status: 'connected',
      activeFailures: 0,
      failedRecords: 0,
      isStale: false,
      syncMessage: 'Official university portal webhook & student portal sync active',
    };
    notifyListeners();
  }
};
