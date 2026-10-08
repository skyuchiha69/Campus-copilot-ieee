import { Response } from 'express';
import { RequestWithId } from '../middleware/requestId';
import mongoose from 'mongoose';

export const getHealth = (_req: RequestWithId, res: Response) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected';
  const hasLiveKey = Boolean(
    process.env.AI_API_KEY &&
    process.env.AI_API_KEY !== 'your_openai_or_gemini_api_key' &&
    process.env.AI_API_KEY !== 'dummy-key-for-local-development'
  );

  return res.json({
    success: true,
    data: {
      api: 'healthy',
      database: dbStatus,
      rag: hasLiveKey ? 'available' : 'hybrid_deterministic',
      timestamp: new Date().toISOString()
    },
    error: null,
    requestId: _req.id
  });
};
