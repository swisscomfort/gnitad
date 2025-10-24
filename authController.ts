import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
// import { db } from '@/database'; // TODO: Import database client

// Validation schemas
const registerSchema = z.object({
  pseudonym: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  age_range: z.enum(['18-25', '25-30', '30-35', '35-40', '40-45', '45-50', '50+']),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
  }),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

class AuthController {
  async register(req: Request, res: Response) {
    // Validate request body
    const validatedData = registerSchema.parse(req.body);

    // TODO: Check if user already exists
    // const existingUser = await db.users.findByEmail(validatedData.email);
    // if (existingUser) {
    //   throw new AppError('User already exists', 409);
    // }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create user
    // TODO: Insert into database
    const userId = 'temp-uuid'; // Replace with actual DB insert
    
    // const user = await db.users.create({
    //   pseudonym: validatedData.pseudonym,
    //   email_hash: hashEmail(validatedData.email),
    //   password_hash: hashedPassword,
    //   age_range: validatedData.age_range,
    //   location_lat: validatedData.location.lat,
    //   location_lon: validatedData.location.lon,
    // });

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET!;
    const token = jwt.sign(
      {
        userId,
        email: validatedData.email,
        pseudonym: validatedData.pseudonym,
      },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    logger.info('User registered', { userId, pseudonym: validatedData.pseudonym });

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: userId,
        pseudonym: validatedData.pseudonym,
      },
      token,
    });
  }

  async login(req: Request, res: Response) {
    // Validate request body
    const { email, password } = loginSchema.parse(req.body);

    // TODO: Find user by email
    // const user = await db.users.findByEmail(email);
    // if (!user) {
    //   throw new AppError('Invalid credentials', 401);
    // }

    // For demo purposes (replace with actual DB query)
    const user = {
      id: 'temp-uuid',
      pseudonym: 'DemoUser',
      email,
      password_hash: await bcrypt.hash('password123', 12), // Demo only!
    };

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET!;
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        pseudonym: user.pseudonym,
      },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // TODO: Update last_active timestamp
    // await db.users.updateLastActive(user.id);

    logger.info('User logged in', { userId: user.id });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        pseudonym: user.pseudonym,
      },
      token,
    });
  }

  async refreshToken(req: Request, res: Response) {
    // TODO: Implement refresh token logic
    throw new AppError('Not implemented yet', 501);
  }

  async logout(req: Request, res: Response) {
    // TODO: Implement logout (invalidate refresh token)
    logger.info('User logged out', { userId: (req as any).userId });
    
    res.json({
      message: 'Logout successful',
    });
  }

  async verifyEmail(req: Request, res: Response) {
    // TODO: Implement email verification
    throw new AppError('Not implemented yet', 501);
  }

  async forgotPassword(req: Request, res: Response) {
    // TODO: Implement password reset request
    throw new AppError('Not implemented yet', 501);
  }

  async resetPassword(req: Request, res: Response) {
    // TODO: Implement password reset
    throw new AppError('Not implemented yet', 501);
  }
}

export const authController = new AuthController();
