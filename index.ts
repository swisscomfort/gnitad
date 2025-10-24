import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import rateLimit from 'express-rate-limit';

import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import photoRoutes from './routes/photos';
import matchRoutes from './routes/matches';
import chatRoutes from './routes/chat';
import taxonomyRoutes from './routes/taxonomy';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', authMiddleware, userRoutes);
app.use('/api/v1/photos', authMiddleware, photoRoutes);
app.use('/api/v1/matches', authMiddleware, matchRoutes);
app.use('/api/v1/chat', authMiddleware, chatRoutes);
app.use('/api/v1/taxonomy', taxonomyRoutes);

// WebSocket setup for real-time chat
io.use((socket, next) => {
  // Auth middleware for WebSocket
  const token = socket.handshake.auth.token;
  // TODO: Verify JWT token
  next();
});

io.on('connection', (socket) => {
  logger.info('Client connected', { socketId: socket.id });

  socket.on('join_chat', (matchId: string) => {
    socket.join(`chat:${matchId}`);
    logger.info('User joined chat', { matchId, socketId: socket.id });
  });

  socket.on('send_message', (data) => {
    const { matchId, message } = data;
    // Broadcast to other users in the chat
    socket.to(`chat:${matchId}`).emit('new_message', message);
  });

  socket.on('typing', (data) => {
    const { matchId } = data;
    socket.to(`chat:${matchId}`).emit('user_typing', { socketId: socket.id });
  });

  socket.on('disconnect', () => {
    logger.info('Client disconnected', { socketId: socket.id });
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.API_PORT || 3000;
httpServer.listen(PORT, () => {
  logger.info(`API Server running on port ${PORT}`, {
    environment: process.env.NODE_ENV,
    port: PORT,
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

export { app, io };
