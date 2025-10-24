import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import userService from "../services/userService";
import { AppError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";

class UserController {
  /**
   * Get current user profile
   */
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return next(new AppError(401, "Unauthorized"));
      }

      const user = await userService.findById(userId);

      if (!user) {
        return next(new AppError(404, "User not found"));
      }

      res.json({
        status: "success",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return next(new AppError(401, "Unauthorized"));
      }

      const validatedData = z
        .object({
          privacyLevel: z.number().min(1).max(5).optional(),
          locationLat: z.number().min(-90).max(90).optional(),
          locationLon: z.number().min(-180).max(180).optional(),
          searchRadiusKm: z.number().min(1).max(200).optional(),
        })
        .parse(req.body);

      const updated = await userService.updateProfile(userId, validatedData);

      res.json({
        status: "success",
        message: "Profile updated",
        data: updated,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new AppError(400, `Validation error: ${error.message}`));
      }
      next(error);
    }
  }

  /**
   * Deactivate account
   */
  async deactivateAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return next(new AppError(401, "Unauthorized"));
      }

      await userService.deactivateAccount(userId);

      res.json({
        status: "success",
        message:
          "Account deactivated. You can reactivate anytime by logging in.",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reactivate account
   */
  async reactivateAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return next(new AppError(401, "Unauthorized"));
      }

      await userService.reactivateAccount(userId);

      res.json({
        status: "success",
        message: "Account reactivated",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete account (GDPR)
   */
  async deleteAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const { confirmation } = req.body;

      if (!userId) {
        return next(new AppError(401, "Unauthorized"));
      }

      if (confirmation !== "DELETE_MY_ACCOUNT") {
        return next(
          new AppError(
            400,
            "Invalid confirmation. Please confirm deletion with exact text."
          )
        );
      }

      await userService.deleteUser(userId);

      res.json({
        status: "success",
        message:
          "Account deleted. All personal data has been removed from our system.",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get public user profile (reduced data for privacy)
   */
  async getPublicProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      const user = await userService.findById(userId);

      if (!user) {
        return next(new AppError(404, "User not found"));
      }

      // Filter sensitive data based on privacy level
      const publicData = {
        id: user.id,
        pseudonym: user.pseudonym,
        ageRange: user.ageRange,
        photos: user.privacyLevel >= 2 ? user.photos.slice(0, 1) : [],
        personality: user.privacyLevel >= 3 ? user.personality : null,
      };

      res.json({
        status: "success",
        data: publicData,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user preferences
   */
  async getPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return next(new AppError(401, "Unauthorized"));
      }

      // TODO: Implementiere Preferences-Logik
      const preferences = {
        ageRangeFilter: ["25-35", "35-45"],
        distanceFilter: 50,
        notificationSettings: {
          emailNotifications: true,
          pushNotifications: true,
        },
      };

      res.json({
        status: "success",
        data: preferences,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user preferences
   */
  async updatePreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return next(new AppError(401, "Unauthorized"));
      }

      // TODO: Implementiere Preferences-Update

      res.json({
        status: "success",
        message: "Preferences updated",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
