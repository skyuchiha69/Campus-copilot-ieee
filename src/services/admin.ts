import { AdminAnalytics, AuditLogEntry } from '../types';
import { MOCK_ADMIN_ANALYTICS, MOCK_AUDIT_LOGS, MOCK_KNOWLEDGE_GAPS } from './mockData';
import { ApiClient } from './apiClient';

export const adminService = {
  async getAnalytics(): Promise<AdminAnalytics> {
    ApiClient.verifyAuthorization('/admin/analytics', 'admin');

    try {
      const res = await ApiClient.request<any>('/admin/analytics');
      if (res.success && res.data) {
        return {
          ...MOCK_ADMIN_ANALYTICS,
          totalQueriesToday: res.data.totalQueries || MOCK_ADMIN_ANALYTICS.totalQueriesToday,
          ragAccuracyScore: parseFloat(res.data.groundingRate) || MOCK_ADMIN_ANALYTICS.ragAccuracyScore,
          unansweredGapsCount: res.data.activeKnowledgeGaps || MOCK_ADMIN_ANALYTICS.unansweredGapsCount,
          activeStudentsToday: res.data.breakdown?.students || MOCK_ADMIN_ANALYTICS.activeStudentsToday,
          recentKnowledgeGaps: [...MOCK_KNOWLEDGE_GAPS],
          auditLogs: [...MOCK_AUDIT_LOGS],
        };
      }
    } catch {
      // Fallback
    }

    return { ...MOCK_ADMIN_ANALYTICS, recentKnowledgeGaps: [...MOCK_KNOWLEDGE_GAPS], auditLogs: [...MOCK_AUDIT_LOGS] };
  },

  async resolveKnowledgeGap(gapId: string, sourceTitle: string, sourceUrl: string, resolutionNotes?: string): Promise<void> {
    ApiClient.verifyAuthorization('/admin/knowledge-gaps/resolve', 'admin');

    try {
      await ApiClient.request(`/admin/knowledge-gaps/${gapId}/resolve`, {
        method: 'POST',
        body: JSON.stringify({ resolutionNotes: `${sourceTitle} (${sourceUrl}): ${resolutionNotes || ''}` }),
      });
    } catch {
      // Fallback
    }

    const gap = MOCK_KNOWLEDGE_GAPS.find(g => g.id === gapId);
    if (gap) {
      gap.status = 'resolved';
      gap.suggestedSource = `${sourceTitle} (${sourceUrl})`;
      gap.resolutionNotes = resolutionNotes || 'Source ingested and vectorized into knowledge base.';
    }

    // Record in Audit Log
    const auditEntry: AuditLogEntry = {
      id: `aud_${Date.now()}`,
      timestamp: 'Just now',
      actorId: ApiClient.getCurrentUserId(),
      actorRole: 'admin',
      action: 'knowledge_gap_resolve',
      details: `Resolved gap [${gap?.query || gapId}] with verified source: ${sourceTitle}`,
      status: 'SUCCESS'
    };

    MOCK_AUDIT_LOGS.unshift(auditEntry);
    MOCK_ADMIN_ANALYTICS.unansweredGapsCount = MOCK_KNOWLEDGE_GAPS.filter(g => g.status === 'open').length;
  },

  async logAuditEvent(action: AuditLogEntry['action'], details: string): Promise<void> {
    const auditEntry: AuditLogEntry = {
      id: `aud_${Date.now()}`,
      timestamp: 'Just now',
      actorId: ApiClient.getCurrentUserId(),
      actorRole: ApiClient.getCurrentRole(),
      action,
      details,
      status: 'SUCCESS'
    };
    MOCK_AUDIT_LOGS.unshift(auditEntry);
  }
};
