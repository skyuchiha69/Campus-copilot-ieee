import { Response, NextFunction } from 'express';
import { RequestWithId } from '../middleware/requestId';
import { aiOrchestrator } from '../services/ai/orchestrator';
import Conversation from '../models/Conversation';
import Message from '../models/Message';
import { AppError } from '../middleware/errorHandler';

export const handleChat = async (req: RequestWithId, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { prompt, message, conversationId, studyMode = 'general', attachedDocId } = req.body;
    const query = (prompt || message || '').trim();

    if (!query) {
      return next(new AppError('Prompt / message is required.', 400, 'VALIDATION_ERROR'));
    }

    // 1. Resolve or create conversation
    let conversation = null;
    if (conversationId && conversationId !== 'new_conv_123' && conversationId !== 'new') {
      conversation = await Conversation.findOne({ _id: conversationId, user_id: userId });
    }

    if (!conversation) {
      const initialTitle = query.length > 35 ? query.substring(0, 35) + '...' : query;
      conversation = await Conversation.create({
        user_id: userId,
        title: initialTitle,
        mode: (studyMode as any) || 'general'
      });
    }

    const currentConvId = conversation._id.toString();

    // 2. Save incoming User message to MongoDB
    await Message.create({
      conversation_id: currentConvId,
      user_id: userId,
      role: 'user',
      content: query,
      study_mode: studyMode
    });

    // 3. Process query through multi-step RAG AI Orchestrator
    const aiResult = await aiOrchestrator.handleQuery(userId, query, studyMode, attachedDocId);

    // 4. Save Assistant response to MongoDB with grounding metadata
    const assistantMsg = await Message.create({
      conversation_id: currentConvId,
      user_id: userId,
      role: 'assistant',
      content: aiResult.answer,
      grounding_status: aiResult.groundingStatus,
      sources: aiResult.sources,
      category: aiResult.category,
      study_mode: studyMode
    });

    // 5. Touch conversation timestamp
    conversation.updatedAt = new Date();
    await conversation.save();

    return res.json({
      success: true,
      data: {
        conversationId: currentConvId,
        messageId: assistantMsg._id.toString(),
        answer: aiResult.answer,
        response: aiResult.answer,
        category: aiResult.category,
        groundingStatus: aiResult.groundingStatus,
        sources: aiResult.sources,
        studyMode: aiResult.studyMode,
        createdAt: assistantMsg.created_at
      },
      error: null,
      requestId: req.id
    });
  } catch (error) {
    next(error);
  }
};

export const listConversations = async (req: RequestWithId, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const conversations = await Conversation.find({ user_id: userId }).sort({ updatedAt: -1 });

    return res.json({
      success: true,
      data: conversations,
      error: null,
      requestId: req.id
    });
  } catch (error) {
    next(error);
  }
};

export const getConversation = async (req: RequestWithId, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const conversation = await Conversation.findOne({ _id: id, user_id: userId });
    if (!conversation) {
      return next(new AppError('Conversation not found or access denied.', 404, 'NOT_FOUND'));
    }

    const messages = await Message.find({ conversation_id: id }).sort({ created_at: 1 });

    return res.json({
      success: true,
      data: {
        conversation,
        messages
      },
      error: null,
      requestId: req.id
    });
  } catch (error) {
    next(error);
  }
};

export const createConversation = async (req: RequestWithId, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { title = 'New Conversation', mode = 'general' } = req.body;

    const conversation = await Conversation.create({
      user_id: userId,
      title,
      mode
    });

    return res.status(201).json({
      success: true,
      data: conversation,
      error: null,
      requestId: req.id
    });
  } catch (error) {
    next(error);
  }
};

export const deleteConversation = async (req: RequestWithId, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const conversation = await Conversation.findOne({ _id: id, user_id: userId });
    if (!conversation) {
      return next(new AppError('Conversation not found or access denied.', 404, 'NOT_FOUND'));
    }

    await Conversation.deleteOne({ _id: id, user_id: userId });
    await Message.deleteMany({ conversation_id: id, user_id: userId });

    return res.json({
      success: true,
      data: { message: 'Conversation deleted successfully.' },
      error: null,
      requestId: req.id
    });
  } catch (error) {
    next(error);
  }
};
