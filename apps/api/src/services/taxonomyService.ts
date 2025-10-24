import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";

const prisma = new PrismaClient();

export class TaxonomyService {
  /**
   * Suche nach Tags
   */
  async searchTags(query: string, limit: number = 20): Promise<any[]> {
    try {
      // TODO: Implementiere echte Tag-Suche
      // Für jetzt: Lade aus JSON-Datei
      // const taxonomy = require('../data/taxonomy.json');

      logger.info("Tags searched", { query });

      // Placeholder
      return [];
    } catch (error) {
      logger.error("Error searching tags", { error });
      throw error;
    }
  }

  /**
   * Hole alle Top-Level Tags
   */
  async getTopLevelTags(): Promise<any[]> {
    try {
      // TODO: Implementiere echte Tag-Struktur
      logger.info("Top-level tags fetched");

      return [];
    } catch (error) {
      logger.error("Error fetching top-level tags", { error });
      throw error;
    }
  }

  /**
   * Hole Subtags einer Kategorie
   */
  async getSubtags(parentTagId: string): Promise<any[]> {
    try {
      // TODO: Implementiere Subtag-Logik
      logger.info("Subtags fetched", { parentTagId });

      return [];
    } catch (error) {
      logger.error("Error fetching subtags", { error });
      throw error;
    }
  }

  /**
   * Speichere Benutzer-Tags
   */
  async setUserTags(
    userId: string,
    tagIds: string[],
    preference: "interested" | "experienced" | "curious"
  ) {
    try {
      // Lösche alte Tags
      await prisma.userTag.deleteMany({
        where: { userId },
      });

      // Füge neue Tags hinzu
      const userTags = await prisma.userTag.createMany({
        data: tagIds.map((tagId) => ({
          userId,
          tagId,
          preference,
        })),
      });

      logger.info("User tags updated", { userId, count: userTags.count });

      return userTags;
    } catch (error) {
      logger.error("Error setting user tags", { error, userId });
      throw error;
    }
  }

  /**
   * Hole Benutzer-Tags
   */
  async getUserTags(userId: string) {
    try {
      return await prisma.userTag.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      logger.error("Error fetching user tags", { error, userId });
      throw error;
    }
  }

  /**
   * Erstelle Persönlichkeitsprofil
   */
  async createPersonality(
    userId: string,
    personality: {
      archetype: string;
      traits: any;
      dominanceLevel: number; // 0-100
      submissionLevel: number; // 0-100
    }
  ) {
    try {
      const existing = await prisma.userPersonality.findUnique({
        where: { userId },
      });

      let result;
      if (existing) {
        result = await prisma.userPersonality.update({
          where: { userId },
          data: {
            archetype: personality.archetype,
            traits: personality.traits,
            dominanceLevel: personality.dominanceLevel,
            submissionLevel: personality.submissionLevel,
          },
        });
      } else {
        result = await prisma.userPersonality.create({
          data: {
            userId,
            archetype: personality.archetype,
            traits: personality.traits,
            dominanceLevel: personality.dominanceLevel,
            submissionLevel: personality.submissionLevel,
          },
        });
      }

      logger.info("Personality profile created/updated", {
        userId,
        archetype: personality.archetype,
      });

      return result;
    } catch (error) {
      logger.error("Error creating personality profile", { error, userId });
      throw error;
    }
  }

  /**
   * Hole Persönlichkeitsprofil
   */
  async getPersonality(userId: string) {
    try {
      return await prisma.userPersonality.findUnique({
        where: { userId },
      });
    } catch (error) {
      logger.error("Error fetching personality", { error, userId });
      throw error;
    }
  }
}

export default new TaxonomyService();
