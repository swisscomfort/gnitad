import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";

const prisma = new PrismaClient();

export class PhotoService {
  /**
   * Upload Foto
   */
  async uploadPhoto(input: {
    userId: string;
    photoUrl: string;
    photoType: "object" | "face" | "body";
    isPrimary?: boolean;
  }) {
    try {
      // Zähle existierende Fotos
      const photoCount = await prisma.userPhoto.count({
        where: { userId: input.userId },
      });

      const photo = await prisma.userPhoto.create({
        data: {
          userId: input.userId,
          photoUrl: input.photoUrl,
          photoType: input.photoType,
          isPrimary: input.isPrimary || photoCount === 0, // Erstes Foto ist Primär
          orderIndex: photoCount,
        },
      });

      logger.info("Photo uploaded", {
        userId: input.userId,
        photoId: photo.id,
      });
      return photo;
    } catch (error) {
      logger.error("Error uploading photo", { error });
      throw error;
    }
  }

  /**
   * Finde Fotos eines Benutzers
   */
  async getUserPhotos(userId: string) {
    try {
      return await prisma.userPhoto.findMany({
        where: { userId },
        orderBy: { orderIndex: "asc" },
      });
    } catch (error) {
      logger.error("Error finding photos", { error, userId });
      throw error;
    }
  }

  /**
   * Lösche Foto
   */
  async deletePhoto(photoId: string, userId: string) {
    try {
      const photo = await prisma.userPhoto.findUnique({
        where: { id: photoId },
      });

      if (!photo || photo.userId !== userId) {
        throw new Error("PHOTO_NOT_FOUND");
      }

      await prisma.userPhoto.delete({
        where: { id: photoId },
      });

      logger.info("Photo deleted", { photoId, userId });
    } catch (error) {
      logger.error("Error deleting photo", { error });
      throw error;
    }
  }

  /**
   * Update Foto Tags (AI-erkannt)
   */
  async updatePhotoTags(
    photoId: string,
    userId: string,
    tags: {
      suggestedTags?: Array<{ tagId: string; confidence: number }>;
      userConfirmedTags?: string[];
      detectedObjects?: Array<{ object: string; confidence: number }>;
    }
  ) {
    try {
      const photo = await prisma.userPhoto.findUnique({
        where: { id: photoId },
      });

      if (!photo || photo.userId !== userId) {
        throw new Error("PHOTO_NOT_FOUND");
      }

      const updated = await prisma.userPhoto.update({
        where: { id: photoId },
        data: {
          suggestedTags: tags.suggestedTags || undefined,
          userConfirmedTags: tags.userConfirmedTags || undefined,
          detectedObjects: tags.detectedObjects || undefined,
        },
      });

      logger.info("Photo tags updated", { photoId, userId });
      return updated;
    } catch (error) {
      logger.error("Error updating photo tags", { error });
      throw error;
    }
  }

  /**
   * Setze Primär-Foto
   */
  async setPrimaryPhoto(photoId: string, userId: string) {
    try {
      // Finde Photo
      const photo = await prisma.userPhoto.findUnique({
        where: { id: photoId },
      });

      if (!photo || photo.userId !== userId) {
        throw new Error("PHOTO_NOT_FOUND");
      }

      // Deaktiviere alles andere als Primär
      await prisma.userPhoto.updateMany({
        where: { userId },
        data: { isPrimary: false },
      });

      // Setze neues Primär-Foto
      const updated = await prisma.userPhoto.update({
        where: { id: photoId },
        data: { isPrimary: true },
      });

      logger.info("Primary photo updated", { photoId, userId });
      return updated;
    } catch (error) {
      logger.error("Error setting primary photo", { error });
      throw error;
    }
  }
}

export default new PhotoService();
