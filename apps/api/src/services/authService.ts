import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { logger } from "../utils/logger";

const prisma = new PrismaClient();

/**
 * Hash Email für Datenschutz
 */
function hashEmail(email: string): string {
  return crypto.createHash("sha256").update(email.toLowerCase()).digest("hex");
}

export class AuthService {
  /**
   * Registriere neuen Benutzer
   */
  async register(input: {
    pseudonym: string;
    email: string;
    password: string;
    ageRange: string;
    locationLat?: number;
    locationLon?: number;
  }) {
    try {
      // Überprüfe ob Pseudonym existiert
      const existingPseudonym = await prisma.user.findUnique({
        where: { pseudonym: input.pseudonym },
      });

      if (existingPseudonym) {
        throw new Error("PSEUDONYM_EXISTS");
      }

      // Hash Email
      const emailHash = hashEmail(input.email);

      // Überprüfe ob Email bereits registriert
      const existingEmail = await prisma.user.findUnique({
        where: { emailHash },
      });

      if (existingEmail) {
        throw new Error("EMAIL_EXISTS");
      }

      // Hash Password
      const passwordHash = await bcrypt.hash(input.password, 12);

      // Erstelle User
      const user = await prisma.user.create({
        data: {
          pseudonym: input.pseudonym,
          emailHash,
          passwordHash,
          ageRange: input.ageRange,
          locationLat: input.locationLat,
          locationLon: input.locationLon,
          isVerified: false,
          isActive: true,
        },
      });

      logger.info("User registered", {
        userId: user.id,
        pseudonym: user.pseudonym,
      });

      // Generiere JWT Token
      const token = this.generateToken(user.id, user.pseudonym);

      return {
        user: {
          id: user.id,
          pseudonym: user.pseudonym,
          ageRange: user.ageRange,
        },
        token,
      };
    } catch (error) {
      logger.error("Registration error", { error });
      throw error;
    }
  }

  /**
   * Login Benutzer
   */
  async login(input: { email: string; password: string }) {
    try {
      const emailHash = hashEmail(input.email);

      // Finde User
      const user = await prisma.user.findUnique({
        where: { emailHash },
        select: {
          id: true,
          pseudonym: true,
          passwordHash: true,
          isActive: true,
          isVerified: true,
        },
      });

      if (!user) {
        throw new Error("INVALID_CREDENTIALS");
      }

      if (!user.isActive) {
        throw new Error("ACCOUNT_INACTIVE");
      }

      // Verifiziere Passwort
      const isValidPassword = await bcrypt.compare(
        input.password,
        user.passwordHash
      );

      if (!isValidPassword) {
        throw new Error("INVALID_CREDENTIALS");
      }

      // Update lastActive
      await prisma.user.update({
        where: { id: user.id },
        data: { lastActive: new Date() },
      });

      // Generiere JWT Token
      const token = this.generateToken(user.id, user.pseudonym);

      logger.info("User logged in", { userId: user.id });

      return {
        user: {
          id: user.id,
          pseudonym: user.pseudonym,
          isVerified: user.isVerified,
        },
        token,
      };
    } catch (error) {
      logger.error("Login error", { error });
      throw error;
    }
  }

  /**
   * Generiere JWT Token
   */
  private generateToken(userId: string, pseudonym: string): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET not configured");
    }

    return jwt.sign(
      {
        userId,
        pseudonym,
      },
      secret,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        algorithm: "HS256",
      }
    );
  }

  /**
   * Verifiziere JWT Token
   */
  verifyToken(token: string): { userId: string; pseudonym: string } {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET not configured");
    }

    try {
      const decoded = jwt.verify(token, secret) as {
        userId: string;
        pseudonym: string;
      };
      return decoded;
    } catch (error) {
      logger.error("Token verification failed", { error });
      throw error;
    }
  }

  /**
   * Refresh JWT Token
   */
  async refreshToken(userId: string): Promise<string> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, pseudonym: true, isActive: true },
      });

      if (!user || !user.isActive) {
        throw new Error("USER_NOT_FOUND_OR_INACTIVE");
      }

      return this.generateToken(user.id, user.pseudonym);
    } catch (error) {
      logger.error("Token refresh error", { error });
      throw error;
    }
  }

  /**
   * Request Password Reset
   */
  async requestPasswordReset(email: string): Promise<string> {
    try {
      const emailHash = hashEmail(email);

      const user = await prisma.user.findUnique({
        where: { emailHash },
        select: { id: true },
      });

      if (!user) {
        // Nicht preisgeben ob Email existiert
        logger.warn("Password reset requested for non-existent email", {
          email,
        });
        return "reset_token_sent";
      }

      // Generiere Reset Token (gültig für 1 Stunde)
      const resetToken = jwt.sign(
        { userId: user.id, type: "password_reset" },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      // Speichere Reset Token in Database (später für Email senden)
      // TODO: Speichere resetToken in DB zur Validation später

      logger.info("Password reset requested", { userId: user.id });
      return "reset_token_sent";
    } catch (error) {
      logger.error("Password reset error", { error });
      throw error;
    }
  }

  /**
   * Reset Password
   */
  async resetPassword(resetToken: string, newPassword: string) {
    try {
      const decoded = jwt.verify(resetToken, process.env.JWT_SECRET!) as {
        userId: string;
        type: string;
      };

      if (decoded.type !== "password_reset") {
        throw new Error("INVALID_RESET_TOKEN");
      }

      const passwordHash = await bcrypt.hash(newPassword, 12);

      await prisma.user.update({
        where: { id: decoded.userId },
        data: { passwordHash },
      });

      logger.info("Password reset successful", { userId: decoded.userId });
    } catch (error) {
      logger.error("Password reset error", { error });
      throw error;
    }
  }
}

export default new AuthService();
