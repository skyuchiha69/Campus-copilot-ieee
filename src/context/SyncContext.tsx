import React, { createContext, useContext, useState, useEffect } from 'react';
import { SyncState } from '../types';
import { syncService } from '../services/sync';

interface SyncContextType extends SyncState {
  triggerSync: () => Promise<void>;
  simulateFailure: () => void;
  simulateReconnect: () => void;
  isSyncModalOpen: boolean;
  openSyncModal: () => void;
  closeSyncModal: () => void;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [syncState, setSyncState] = useState<SyncState>(syncService.getSyncState());
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = syncService.subscribe((next) => {
      setSyncState(next);
    });
    return () => unsubscribe();
  }, []);

  const triggerSync = async () => {
    await syncService.triggerManualSync();
  };

  const simulateFailure = () => {
    syncService.simulateFailure();
  };

  const simulateReconnect = () => {
    syncService.simulateReconnect();
  };

  return (
    <SyncContext.Provider
      value={{
        ...syncState,
        triggerSync,
        simulateFailure,
        simulateReconnect,
        isSyncModalOpen,
        openSyncModal: () => setIsSyncModalOpen(true),
        closeSyncModal: () => setIsSyncModalOpen(false),
      }}
    >
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = () => {
  const ctx = useContext(SyncContext);
  if (!ctx) throw new Error('useSync must be used within SyncProvider');
  return ctx;
};
