import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

export interface AuthRequest extends Request {
  userId?: string;
  user?: {
    id: string;
    email: string;
    pseudonym: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      logger.error('JWT_SECRET not configured');
      return res.status(500).json({
        error: 'Server configuration error',
      });
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as {
        userId: string;
        email: string;
        pseudonym: string;
      };

      // Attach user info to request
      req.userId = decoded.userId;
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        pseudonym: decoded.pseudonym,
      };

      next();
    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Token expired',
        });
      }
      
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token',
      });
    }
  } catch (error) {
    logger.error('Auth middleware error', { error });
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const optionalAuthMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without auth
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as {
        userId: string;
        email: string;
        pseudonym: string;
      };

      req.userId = decoded.userId;
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        pseudonym: decoded.pseudonym,
      };
    } catch {
      // Ignore errors for optional auth
    }

    next();
  } catch (error) {
    next();
  }
};
