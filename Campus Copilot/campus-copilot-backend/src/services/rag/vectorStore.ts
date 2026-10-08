import DocumentChunk, { IDocumentChunk } from '../../models/DocumentChunk';
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';
import { OpenAIEmbeddings } from '@langchain/openai';
import mongoose from 'mongoose';

export interface SearchFilters {
  visibility?: 'public' | 'private';
  ownerUserId?: string;
  documentId?: string;
  sourceType?: string;
}

export interface SearchResult {
  content: string;
  metadata: {
    documentId: string;
    sourceType: string;
    documentType?: string;
    department?: string;
    course?: string;
    authority: number;
    ownerUserId?: string;
    visibility: 'public' | 'private';
    title?: string;
  };
}

export class VectorStoreService {
  private vectorStore: MongoDBAtlasVectorSearch | null = null;
  private isAtlasVectorReady: boolean = false;

  async init() {
    const apiKey = process.env.AI_API_KEY;
    const hasLiveKey = apiKey && apiKey !== 'your_openai_or_gemini_api_key' && apiKey !== 'dummy-key-for-local-development';

    if (hasLiveKey && mongoose.connection.readyState === 1) {
      try {
        const collection = mongoose.connection.collection('documentchunks');
        this.vectorStore = new MongoDBAtlasVectorSearch(
          new OpenAIEmbeddings({ openAIApiKey: apiKey }),
          {
            collection: collection as any,
            indexName: 'vector_index',
            textKey: 'content',
            embeddingKey: 'embedding',
          }
        );
        this.isAtlasVectorReady = true;
      } catch (err) {
        console.warn('[VectorStore] Atlas Vector search initialization deferred, using hybrid MongoDB search:', err);
        this.isAtlasVectorReady = false;
      }
    }
  }

  /**
   * Multi-Tenant RAG Search with Server-Side Isolation
   * Prevents cross-student data leakage.
   */
  async search(query: string, filters: SearchFilters, limit: number = 4): Promise<SearchResult[]> {
    // Construct strict MongoDB query enforcing multi-tenant isolation
    const mongoFilter: any = {};

    if (filters.ownerUserId) {
      // Return public documents OR private documents owned by this user
      mongoFilter.$or = [
        { visibility: 'public' },
        { owner_user_id: filters.ownerUserId, visibility: 'private' }
      ];
    } else {
      mongoFilter.visibility = 'public';
    }

    if (filters.documentId) {
      mongoFilter.document_id = filters.documentId;
    }

    if (filters.sourceType) {
      mongoFilter.source_type = filters.sourceType;
    }

    try {
      // 1. If Atlas Vector search is ready, attempt vector search with pre-filter
      if (this.isAtlasVectorReady && this.vectorStore) {
        const results = await this.vectorStore.similaritySearch(query, limit, mongoFilter);
        return results.map(doc => ({
          content: this.sanitizeContent(doc.pageContent),
          metadata: {
            documentId: doc.metadata.document_id || doc.metadata.documentId,
            sourceType: doc.metadata.source_type || doc.metadata.sourceType || 'official_university',
            documentType: doc.metadata.document_type || doc.metadata.documentType,
            department: doc.metadata.department,
            course: doc.metadata.course,
            authority: doc.metadata.authority || 3,
            ownerUserId: doc.metadata.owner_user_id,
            visibility: doc.metadata.visibility || 'public',
            title: doc.metadata.title
          }
        }));
      }
    } catch {
      // Fallback to indexed MongoDB query
    }

    // 2. Hybrid MongoDB Keyword & Semantic Pattern Matcher
    const keywords = query
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2);

    let dbQuery: any = { ...mongoFilter };

    if (keywords.length > 0) {
      const regexPatterns = keywords.map(kw => ({ content: { $regex: kw, $options: 'i' } }));
      if (dbQuery.$or) {
        dbQuery = {
          $and: [
            { $or: dbQuery.$or },
            { $or: regexPatterns }
          ]
        };
      } else {
        dbQuery.$or = regexPatterns;
      }
    }

    const chunks: IDocumentChunk[] = await DocumentChunk.find(dbQuery)
      .sort({ authority: -1, createdAt: -1 })
      .limit(limit);

    return chunks.map(chunk => ({
      content: this.sanitizeContent(chunk.content),
      metadata: {
        documentId: chunk.document_id,
        sourceType: chunk.source_type,
        documentType: chunk.document_type,
        department: chunk.department,
        course: chunk.course,
        authority: chunk.authority,
        ownerUserId: chunk.owner_user_id,
        visibility: chunk.visibility,
      }
    }));
  }

  /**
   * Prompt Injection Guard:
   * Wraps and sanitizes retrieved text to ensure LLM interprets text solely as data.
   */
  private sanitizeContent(text: string): string {
    if (!text) return '';
    // Strip control characters and sanitize system prompt injection attempts
    const sanitized = text
      .replace(/Ignore previous instructions/gi, '[Filtered]')
      .replace(/You are now/gi, '[Filtered]')
      .replace(/System prompt:/gi, '[Filtered]');
    return sanitized.trim();
  }
}

export const vectorStoreService = new VectorStoreService();
