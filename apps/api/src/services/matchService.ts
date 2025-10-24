import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";

const prisma = new PrismaClient();

export class MatchService {
  /**
   * Berechne Kompatibilität zwischen zwei Benutzern
   */
  private async calculateCompatibility(
    userId1: string,
    userId2: string
  ): Promise<number> {
    try {
      // Finde Tags beider Benutzer
      const tags1 = await prisma.userTag.findMany({
        where: { userId: userId1 },
        select: { tagId: true },
      });

      const tags2 = await prisma.userTag.findMany({
        where: { userId: userId2 },
        select: { tagId: true },
      });

      const set1 = new Set(tags1.map((t) => t.tagId));
      const set2 = new Set(tags2.map((t) => t.tagId));

      // Berechne Überschneidung
      const intersection = new Set([...set1].filter((x) => set2.has(x)));
      const union = new Set([...set1, ...set2]);

      // Jaccard Similarity
      const tagSimilarity = union.size > 0 ? intersection.size / union.size : 0;

      // Gewichte andere Faktoren
      const personality1 = await prisma.userPersonality.findUnique({
        where: { userId: userId1 },
      });
      const personality2 = await prisma.userPersonality.findUnique({
        where: { userId: userId2 },
      });

      let personalitySimilarity = 0;
      if (personality1 && personality2) {
        // Simple Archetype-Kompatibilität (später komplexer)
        personalitySimilarity =
          personality1.archetype === personality2.archetype ? 0.3 : 0.1;
      }

      // Finale Score: 70% Tags, 30% Persönlichkeit
      const compatibilityScore =
        tagSimilarity * 0.7 + personalitySimilarity * 0.3;

      return Math.min(Math.max(compatibilityScore, 0), 1);
    } catch (error) {
      logger.error("Error calculating compatibility", { error });
      return 0;
    }
  }

  /**
   * Erstelle Match
   */
  async createMatch(userId1: string, userId2: string) {
    try {
      // Überprüfe ob Match bereits existiert
      const existingMatch = await prisma.match.findFirst({
        where: {
          OR: [
            { user1Id: userId1, user2Id: userId2 },
            { user1Id: userId2, user2Id: userId1 },
          ],
        },
      });

      if (existingMatch) {
        throw new Error("MATCH_ALREADY_EXISTS");
      }

      // Berechne Kompatibilität
      const compatibilityScore = await this.calculateCompatibility(
        userId1,
        userId2
      );

      const match = await prisma.match.create({
        data: {
          user1Id: userId1,
          user2Id: userId2,
          compatibilityScore,
          status: "matched",
        },
      });

      logger.info("Match created", {
        userId1,
        userId2,
        score: compatibilityScore,
      });

      return match;
    } catch (error) {
      logger.error("Error creating match", { error });
      throw error;
    }
  }

  /**
   * Finde Matches für Benutzer
   */
  async getMatches(userId: string, limit: number = 20, offset: number = 0) {
    try {
      return await prisma.match.findMany({
        where: {
          OR: [{ user1Id: userId }, { user2Id: userId }],
        },
        take: limit,
        skip: offset,
        orderBy: { compatibilityScore: "desc" },
        include: {
          user1: {
            select: {
              id: true,
              pseudonym: true,
              ageRange: true,
              locationLat: true,
              locationLon: true,
              photos: {
                select: { id: true, photoUrl: true, isPrimary: true },
                take: 1,
              },
            },
          },
          user2: {
            select: {
              id: true,
              pseudonym: true,
              ageRange: true,
              locationLat: true,
              locationLon: true,
              photos: {
                select: { id: true, photoUrl: true, isPrimary: true },
                take: 1,
              },
            },
          },
        },
      });
    } catch (error) {
      logger.error("Error fetching matches", { error, userId });
      throw error;
    }
  }

  /**
   * Lehne Match ab
   */
  async rejectMatch(matchId: string, userId: string) {
    try {
      const match = await prisma.match.findUnique({
        where: { id: matchId },
      });

      if (!match) {
        throw new Error("MATCH_NOT_FOUND");
      }

      if (match.user1Id !== userId && match.user2Id !== userId) {
        throw new Error("UNAUTHORIZED");
      }

      await prisma.match.delete({
        where: { id: matchId },
      });

      logger.info("Match rejected", { matchId, userId });
    } catch (error) {
      logger.error("Error rejecting match", { error });
      throw error;
    }
  }

  /**
   * Finde potenzielle Matches (Matching-Algorithmus)
   */
  async findPotentialMatches(userId: string, limit: number = 10) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          tags: { select: { tagId: true } },
          matchesAsUser1: { select: { user2Id: true } },
          matchesAsUser2: { select: { user1Id: true } },
        },
      });

      if (!user) {
        throw new Error("USER_NOT_FOUND");
      }

      // Sammle IDs der bereits gematchten Benutzer
      const matchedIds = [
        userId,
        ...user.matchesAsUser1.map((m) => m.user2Id),
        ...user.matchesAsUser2.map((m) => m.user1Id),
      ];

      // Finde Benutzer in Umkreis ohne bestehende Matches
      const candidates = await prisma.user.findMany({
        where: {
          id: { notIn: matchedIds },
          isActive: true,
          // Geo-Filter (wenn Koordinaten vorhanden)
          ...(user.locationLat &&
            user.locationLon && {
              locationLat: {
                gte: user.locationLat - 5,
                lte: user.locationLat + 5,
              },
              locationLon: {
                gte: user.locationLon - 5,
                lte: user.locationLon + 5,
              },
            }),
        },
        take: limit * 3, // Hole mehr als nötig, um zu sortieren
        include: {
          tags: { select: { tagId: true } },
          photos: {
            select: { id: true, photoUrl: true, isPrimary: true },
            take: 1,
          },
        },
      });

      // Berechne Scores und sortiere
      const scored = await Promise.all(
        candidates.map(async (candidate) => ({
          ...candidate,
          compatibilityScore: await this.calculateCompatibility(
            userId,
            candidate.id
          ),
        }))
      );

      return scored
        .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
        .slice(0, limit);
    } catch (error) {
      logger.error("Error finding potential matches", { error, userId });
      throw error;
    }
  }
}

export default new MatchService();
