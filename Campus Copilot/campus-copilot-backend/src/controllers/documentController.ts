import { Response, NextFunction } from 'express';
import { RequestWithId } from '../middleware/requestId';
import DocumentRecord from '../models/Document';
import DocumentChunk from '../models/DocumentChunk';
import { AppError } from '../middleware/errorHandler';
import pdfParse from 'pdf-parse';
import crypto from 'crypto';

export const uploadDocument = async (req: RequestWithId, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const file = req.file;

    if (!file) {
      return next(new AppError('No file uploaded. Please provide a valid document.', 400, 'FILE_MISSING'));
    }

    const { title, visibility = 'private', sourceType = 'student_document' } = req.body;
    const docId = `DOC_${Date.now()}_${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    let extractedText = '';

    if (file.mimetype === 'application/pdf' || file.originalname.endsWith('.pdf')) {
      try {
        const parsed = await pdfParse(file.buffer);
        extractedText = parsed.text;
      } catch (err) {
        console.warn('PDF parsing error, falling back to raw buffer string:', err);
        extractedText = file.buffer.toString('utf-8');
      }
    } else {
      extractedText = file.buffer.toString('utf-8');
    }

    if (!extractedText || extractedText.trim().length === 0) {
      extractedText = `Document: ${title || file.originalname}\nUploaded on ${new Date().toISOString()}`;
    }

    // Chunking text into ~500 character slices for RAG retrieval
    const chunkSize = 500;
    const overlap = 50;
    const chunks: string[] = [];

    for (let i = 0; i < extractedText.length; i += (chunkSize - overlap)) {
      const chunk = extractedText.substring(i, i + chunkSize).trim();
      if (chunk.length > 20) {
        chunks.push(chunk);
      }
    }

    if (chunks.length === 0) {
      chunks.push(extractedText.substring(0, chunkSize));
    }

    // Store chunks in DocumentChunk collection with ownership isolation
    const chunkDocs = chunks.map((content, idx) => ({
      document_id: docId,
      source_type: sourceType,
      document_type: 'notes',
      authority: sourceType === 'official_university' ? 5 : 1,
      content,
      chunk_index: idx,
      owner_user_id: userId,
      visibility: visibility as 'public' | 'private',
      last_synced: new Date()
    }));

    await DocumentChunk.insertMany(chunkDocs);

    // Save parent Document record
    const documentRecord = await DocumentRecord.create({
      document_id: docId,
      title: title || file.originalname,
      file_name: file.originalname,
      file_type: file.mimetype || 'application/octet-stream',
      file_size: file.size,
      owner_user_id: userId,
      visibility,
      source_type: sourceType,
      chunks_count: chunks.length,
      status: 'indexed'
    });

    return res.status(201).json({
      success: true,
      data: {
        document: documentRecord,
        chunksIndexed: chunks.length,
        message: 'Document successfully processed and indexed for grounded RAG queries.'
      },
      error: null,
      requestId: req.id
    });
  } catch (error) {
    next(error);
  }
};

export const listDocuments = async (req: RequestWithId, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const documents = await DocumentRecord.find({
      $or: [
        { owner_user_id: userId },
        { visibility: 'public' }
      ]
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: documents,
      error: null,
      requestId: req.id
    });
  } catch (error) {
    next(error);
  }
};

export const getDocumentById = async (req: RequestWithId, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const document = await DocumentRecord.findOne({
      document_id: id,
      $or: [
        { owner_user_id: userId },
        { visibility: 'public' }
      ]
    });

    if (!document) {
      return next(new AppError('Document not found or access denied.', 404, 'NOT_FOUND'));
    }

    const chunks = await DocumentChunk.find({ document_id: id }).sort({ chunk_index: 1 });

    return res.json({
      success: true,
      data: {
        document,
        chunks
      },
      error: null,
      requestId: req.id
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDocument = async (req: RequestWithId, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const document = await DocumentRecord.findOne({
      document_id: id,
      owner_user_id: userId
    });

    if (!document) {
      return next(new AppError('Document not found or you do not have permission to delete it.', 404, 'NOT_FOUND'));
    }

    await DocumentRecord.deleteOne({ document_id: id, owner_user_id: userId });
    await DocumentChunk.deleteMany({ document_id: id, owner_user_id: userId });

    return res.json({
      success: true,
      data: { message: 'Document and all associated vector chunks deleted successfully.' },
      error: null,
      requestId: req.id
    });
  } catch (error) {
    next(error);
  }
};
