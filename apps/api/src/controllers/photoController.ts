import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import photoService from "../services/photoService";
import { AppError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";

class PhotoController {
  /**
   * Upload photo
   */
  async uploadPhoto(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return next(new AppError(401, "Unauthorized"));
      }

      const { photoUrl, photoType, isPrimary } = z
        .object({
          photoUrl: z.string().url(),
          photoType: z.enum(["object", "face", "body"]),
          isPrimary: z.boolean().optional(),
        })
        .parse(req.body);

      const photo = await photoService.uploadPhoto({
        userId,
        photoUrl,
        photoType,
        isPrimary,
      });

      res.status(201).json({
        status: "success",
        message: "Photo uploaded",
        data: photo,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new AppError(400, `Validation error: ${error.message}`));
      }
      next(error);
    }
  }

  /**
   * Get user photos
   */
  async getUserPhotos(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId || (req as any).user?.userId;

      if (!userId) {
        return next(new AppError(400, "Missing userId"));
      }

      const photos = await photoService.getUserPhotos(userId);

      res.json({
        status: "success",
        data: photos,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete photo
   */
  async deletePhoto(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const { photoId } = req.params;

      if (!userId || !photoId) {
        return next(new AppError(400, "Missing required parameters"));
      }

      await photoService.deletePhoto(photoId, userId);

      res.json({
        status: "success",
        message: "Photo deleted",
      });
    } catch (error) {
      if (error instanceof Error && error.message === "PHOTO_NOT_FOUND") {
        return next(new AppError(404, "Photo not found"));
      }
      next(error);
    }
  }

  /**
   * Set primary photo
   */
  async setPrimaryPhoto(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const { photoId } = req.params;

      if (!userId || !photoId) {
        return next(new AppError(400, "Missing required parameters"));
      }

      const photo = await photoService.setPrimaryPhoto(photoId, userId);

      res.json({
        status: "success",
        message: "Primary photo updated",
        data: photo,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "PHOTO_NOT_FOUND") {
        return next(new AppError(404, "Photo not found"));
      }
      next(error);
    }
  }

  /**
   * Update photo tags (AI-recognized)
   */
  async updatePhotoTags(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const { photoId } = req.params;
      const { suggestedTags, userConfirmedTags, detectedObjects } = req.body;

      if (!userId || !photoId) {
        return next(new AppError(400, "Missing required parameters"));
      }

      const photo = await photoService.updatePhotoTags(photoId, userId, {
        suggestedTags,
        userConfirmedTags,
        detectedObjects,
      });

      res.json({
        status: "success",
        message: "Photo tags updated",
        data: photo,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "PHOTO_NOT_FOUND") {
        return next(new AppError(404, "Photo not found"));
      }
      next(error);
    }
  }
}

export default new PhotoController();
