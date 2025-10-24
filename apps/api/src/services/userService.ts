import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { logger } from "../utils/logger";

const prisma = new PrismaClient();

export class UserService {
  /**
   * Erstelle einen neuen Benutzer
   */
  async createUser(input: {
    pseudonym: string;
    emailHash: string;
    passwordHash: string;
    ageRange: string;
    locationLat?: number;
    locationLon?: number;
  }) {
    try {
      // Überprüfe ob Pseudonym bereits existiert
      const existingUser = await prisma.user.findUnique({
        where: { pseudonym: input.pseudonym },
      });

      if (existingUser) {
        throw new Error("Pseudonym already exists");
      }

      const user = await prisma.user.create({
        data: {
          pseudonym: input.pseudonym,
          emailHash: input.emailHash,
          passwordHash: input.passwordHash,
          ageRange: input.ageRange,
          locationLat: input.locationLat,
          locationLon: input.locationLon,
          isVerified: false,
          isActive: true,
        },
        select: {
          id: true,
          pseudonym: true,
          ageRange: true,
          isVerified: true,
        },
      });

      logger.info("User created", {
        userId: user.id,
        pseudonym: user.pseudonym,
      });
      return user;
    } catch (error) {
      logger.error("Error creating user", { error });
      throw error;
    }
  }

  /**
   * Finde Benutzer nach Email-Hash
   */
  async findByEmailHash(emailHash: string) {
    try {
      return await prisma.user.findUnique({
        where: { emailHash },
        select: {
          id: true,
          pseudonym: true,
          emailHash: true,
          passwordHash: true,
          ageRange: true,
          isVerified: true,
          isActive: true,
          lastActive: true,
        },
      });
    } catch (error) {
      logger.error("Error finding user by email", { error });
      throw error;
    }
  }

  /**
   * Finde Benutzer nach ID
   */
  async findById(id: string) {
    try {
      return await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          pseudonym: true,
          ageRange: true,
          locationLat: true,
          locationLon: true,
          isVerified: true,
          isActive: true,
          privacyLevel: true,
          lastActive: true,
          createdAt: true,
          photos: {
            select: {
              id: true,
              photoUrl: true,
              photoType: true,
              isPrimary: true,
            },
          },
          tags: {
            select: {
              tagId: true,
              preference: true,
            },
          },
          personality: {
            select: {
              archetype: true,
              traits: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error("Error finding user by ID", { error });
      throw error;
    }
  }

  /**
   * Verifiziere Passwort
   */
  async verifyPassword(plainPassword: string, hashedPassword: string) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      logger.error("Error verifying password", { error });
      throw error;
    }
  }

  /**
   * Update Benutzer-Profil
   */
  async updateProfile(
    userId: string,
    updates: {
      privacyLevel?: number;
      locationLat?: number;
      locationLon?: number;
      searchRadiusKm?: number;
    }
  ) {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data: {
          ...updates,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          pseudonym: true,
          privacyLevel: true,
          locationLat: true,
          locationLon: true,
          searchRadiusKm: true,
        },
      });
    } catch (error) {
      logger.error("Error updating profile", { error, userId });
      throw error;
    }
  }

  /**
   * Update lastActive timestamp
   */
  async updateLastActive(userId: string) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { lastActive: new Date() },
      });
    } catch (error) {
      logger.error("Error updating lastActive", { error, userId });
    }
  }

  /**
   * Deaktiviere Benutzer-Account
   */
  async deactivateAccount(userId: string) {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data: { isActive: false },
      });
    } catch (error) {
      logger.error("Error deactivating account", { error, userId });
      throw error;
    }
  }

  /**
   * Reaktiviere Benutzer-Account
   */
  async reactivateAccount(userId: string) {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data: { isActive: true, lastActive: new Date() },
      });
    } catch (error) {
      logger.error("Error reactivating account", { error, userId });
      throw error;
    }
  }

  /**
   * Lösche Benutzer (GDPR - Datenlöschung)
   */
  async deleteUser(userId: string) {
    try {
      // Beginne Transaction
      await prisma.$transaction(async (tx) => {
        // Lösche alle Messages des Benutzers
        await tx.message.deleteMany({
          where: {
            userId,
          },
        });

        // Lösche alle Matches
        await tx.match.deleteMany({
          where: {
            OR: [{ user1Id: userId }, { user2Id: userId }],
          },
        });

        // Lösche alle Tags
        await tx.userTag.deleteMany({
          where: { userId },
        });

        // Lösche alle Fotos
        await tx.userPhoto.deleteMany({
          where: { userId },
        });

        // Lösche Persönlichkeitsprofil
        await tx.userPersonality.deleteMany({
          where: { userId },
        });

        // Lösche Benutzer
        await tx.user.delete({
          where: { id: userId },
        });
      });

      logger.info("User deleted", { userId });
    } catch (error) {
      logger.error("Error deleting user", { error, userId });
      throw error;
    }
  }
}

export default new UserService();
