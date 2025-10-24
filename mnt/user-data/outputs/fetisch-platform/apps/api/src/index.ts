import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import matchRoutes from './routes/match.routes.js';
import photoRoutes from './routes/photo.routes.js';
import chatRoutes from './routes/chat.routes.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

const app: Express = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_API_URL || '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(compression()); // Compress responses
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/matches', matchRoutes);
app.use('/api/v1/photos', photoRoutes);
app.use('/api/v1/chat', chatRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handler (must be last)
app.use(errorHandler);

// WebSocket connection handling
io.on('connection', (socket) => {
  logger.info(`WebSocket client connected: ${socket.id}`);

  socket.on('join-match', (matchId: string) => {
    socket.join(`match:${matchId}`);
    logger.info(`Socket ${socket.id} joined match ${matchId}`);
  });

  socket.on('send-message', async (data) => {
    // Handle real-time messaging
    io.to(`match:${data.matchId}`).emit('new-message', data);
  });

  socket.on('disconnect', () => {
    logger.info(`WebSocket client disconnected: ${socket.id}`);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

// Start server
httpServer.listen(PORT, () => {
  logger.info(`🚀 API Server running on port ${PORT}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
});

export { io };
