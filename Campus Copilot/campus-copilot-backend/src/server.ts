// Polyfill global Web Streams for Node 16 compatibility before loading LangChain
try {
  const streamWeb = require('stream/web');
  if (typeof (global as any).ReadableStream === 'undefined' && streamWeb?.ReadableStream) {
    (global as any).ReadableStream = streamWeb.ReadableStream;
    (global as any).WritableStream = streamWeb.WritableStream;
    (global as any).TransformStream = streamWeb.TransformStream;
  }
} catch {}

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { requestIdMiddleware } from './middleware/requestId';
import { errorHandler } from './middleware/errorHandler';
import apiRoutes from './routes/api';
import { vectorStoreService } from './services/rag/vectorStore';

// Load environment variables
dotenv.config();

const app = express();

// Security & Request Parsing Middleware
const allowedOrigins = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5173'] : '*';
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id']
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Request ID & Tracing
app.use(requestIdMiddleware);

// Canonical API Routes
app.use('/api', apiRoutes);

// Root Liveness Probe
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'campus-copilot-backend', timestamp: new Date().toISOString() });
});

// Centralized Error Handler (Must be registered last)
app.use(errorHandler);

// Connect to Database and Initialize Vector Store
connectDB().then(() => {
  vectorStoreService.init().catch((err) => {
    console.warn('[Server] Vector store deferred initialization:', err.message);
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Campus Copilot Backend] running on port ${PORT} (API v1 ready at http://localhost:${PORT}/api/v1)`);
});

export default app;
