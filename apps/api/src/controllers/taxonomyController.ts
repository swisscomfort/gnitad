import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import taxonomyService from "../services/taxonomyService";
import { AppError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";

class TaxonomyController {
  /**
   * Search tags
   */
  async searchTags(req: Request, res: Response, next: NextFunction) {
    try {
      const { q, limit = 20 } = req.query;

      if (!q) {
        return next(new AppError(400, "Search query required"));
      }

      const results = await taxonomyService.searchTags(
        q as string,
        parseInt(limit as string)
      );

      res.json({
        status: "success",
        data: results,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get top-level tags
   */
  async getTopLevelTags(req: Request, res: Response, next: NextFunction) {
    try {
      const tags = await taxonomyService.getTopLevelTags();

      res.json({
        status: "success",
        data: tags,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get subtags
   */
  async getSubtags(req: Request, res: Response, next: NextFunction) {
    try {
      const { tagId } = req.params;

      if (!tagId) {
        return next(new AppError(400, "Tag ID required"));
      }

      const subtags = await taxonomyService.getSubtags(tagId);

      res.json({
        status: "success",
        data: subtags,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Set user tags
   */
  async setUserTags(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const { tagIds, preference } = z
        .object({
          tagIds: z.array(z.string()),
          preference: z.enum(["interested", "experienced", "curious"]),
        })
        .parse(req.body);

      if (!userId) {
        return next(new AppError(401, "Unauthorized"));
      }

      const result = await taxonomyService.setUserTags(
        userId,
        tagIds,
        preference
      );

      res.json({
        status: "success",
        message: "Tags updated",
        data: result,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new AppError(400, `Validation error: ${error.message}`));
      }
      next(error);
    }
  }

  /**
   * Get user tags
   */
  async getUserTags(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return next(new AppError(401, "Unauthorized"));
      }

      const tags = await taxonomyService.getUserTags(userId);

      res.json({
        status: "success",
        data: tags,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create personality profile
   */
  async createPersonality(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const { archetype, traits, dominanceLevel, submissionLevel } = z
        .object({
          archetype: z.string(),
          traits: z.record(z.any()),
          dominanceLevel: z.number().min(0).max(100),
          submissionLevel: z.number().min(0).max(100),
        })
        .parse(req.body);

      if (!userId) {
        return next(new AppError(401, "Unauthorized"));
      }

      const personality = await taxonomyService.createPersonality(userId, {
        archetype,
        traits,
        dominanceLevel,
        submissionLevel,
      });

      res.status(201).json({
        status: "success",
        message: "Personality profile created",
        data: personality,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new AppError(400, `Validation error: ${error.message}`));
      }
      next(error);
    }
  }

  /**
   * Get personality profile
   */
  async getPersonality(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return next(new AppError(401, "Unauthorized"));
      }

      const personality = await taxonomyService.getPersonality(userId);

      res.json({
        status: "success",
        data: personality,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new TaxonomyController();
