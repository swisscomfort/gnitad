import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import authService from "../services/authService";
import { AppError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";

// Validation Schemas
const registerSchema = z.object({
  pseudonym: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z0-9_-]+$/),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  ageRange: z.enum([
    "18-25",
    "25-30",
    "30-35",
    "35-40",
    "40-45",
    "45-50",
    "50+",
  ]),
  locationLat: z.number().min(-90).max(90).optional(),
  locationLon: z.number().min(-180).max(180).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

class AuthController {
  /**
   * Register endpoint
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = registerSchema.parse(req.body);

      const result = await authService.register({
        pseudonym: validatedData.pseudonym,
        email: validatedData.email,
        password: validatedData.password,
        ageRange: validatedData.ageRange,
        locationLat: validatedData.locationLat,
        locationLon: validatedData.locationLon,
      });

      res.status(201).json({
        status: "success",
        message: "Registration successful",
        data: result,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new AppError(400, `Validation error: ${error.message}`));
      }

      if (error instanceof Error) {
        if (error.message === "PSEUDONYM_EXISTS") {
          return next(new AppError(409, "Pseudonym already exists"));
        }
        if (error.message === "EMAIL_EXISTS") {
          return next(new AppError(409, "Email already registered"));
        }
      }

      next(error);
    }
  }

  /**
   * Login endpoint
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = loginSchema.parse(req.body);

      const result = await authService.login({
        email: validatedData.email,
        password: validatedData.password,
      });

      res.json({
        status: "success",
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new AppError(400, `Validation error: ${error.message}`));
      }

      if (error instanceof Error) {
        if (error.message === "INVALID_CREDENTIALS") {
          return next(new AppError(401, "Invalid email or password"));
        }
        if (error.message === "ACCOUNT_INACTIVE") {
          return next(
            new AppError(403, "Account is deactivated. Contact support.")
          );
        }
      }

      next(error);
    }
  }

  /**
   * Refresh token endpoint
   */
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return next(new AppError(401, "Unauthorized"));
      }

      const token = await authService.refreshToken(userId);

      res.json({
        status: "success",
        message: "Token refreshed",
        data: { token },
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "USER_NOT_FOUND_OR_INACTIVE") {
          return next(new AppError(401, "User not found or inactive"));
        }
      }

      next(error);
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = z.object({ email: z.string().email() }).parse(req.body);

      await authService.requestPasswordReset(email);

      // Immer erfolg zurückgeben (aus Sicherheitsgründen)
      res.json({
        status: "success",
        message: "If this email is registered, a reset link will be sent",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new AppError(400, `Validation error: ${error.message}`));
      }
      next(error);
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { resetToken, newPassword } = z
        .object({
          resetToken: z.string(),
          newPassword: z.string().min(8),
        })
        .parse(req.body);

      await authService.resetPassword(resetToken, newPassword);

      res.json({
        status: "success",
        message: "Password reset successful",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new AppError(400, `Validation error: ${error.message}`));
      }

      if (error instanceof Error) {
        if (error.message === "INVALID_RESET_TOKEN") {
          return next(new AppError(400, "Invalid or expired reset token"));
        }
      }

      next(error);
    }
  }

  /**
   * Logout endpoint
   */
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // Token wird einfach vom Client gelöscht
      // Bei Session-basierten Systemen würde man hier die Session löschen

      res.json({
        status: "success",
        message: "Logout successful",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify email endpoint (wenn Two-Factor nötig)
   */
  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { verificationCode } = z
        .object({ verificationCode: z.string() })
        .parse(req.body);

      // TODO: Implementiere Email-Verification-Logik

      res.json({
        status: "success",
        message: "Email verified",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new AppError(400, `Validation error: ${error.message}`));
      }
      next(error);
    }
  }
}

export default new AuthController();
