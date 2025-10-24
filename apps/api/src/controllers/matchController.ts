import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import matchService from "../services/matchService";
import { AppError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";

class MatchController {
  /**
   * Get matches for current user
   */
  async getMatches(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const { limit = 20, offset = 0 } = req.query;

      if (!userId) {
        return next(new AppError(401, "Unauthorized"));
      }

      const matches = await matchService.getMatches(
        userId,
        parseInt(limit as string),
        parseInt(offset as string)
      );

      res.json({
        status: "success",
        data: matches,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Find potential matches (recommendations)
   */
  async getPotentialMatches(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const { limit = 10 } = req.query;

      if (!userId) {
        return next(new AppError(401, "Unauthorized"));
      }

      const potential = await matchService.findPotentialMatches(
        userId,
        parseInt(limit as string)
      );

      res.json({
        status: "success",
        data: potential,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create match between two users
   */
  async createMatch(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const { targetUserId } = req.body;

      if (!userId || !targetUserId) {
        return next(new AppError(400, "Missing required parameters"));
      }

      const match = await matchService.createMatch(userId, targetUserId);

      res.status(201).json({
        status: "success",
        message: "Match created",
        data: match,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "MATCH_ALREADY_EXISTS") {
          return next(new AppError(409, "Match already exists with this user"));
        }
      }
      next(error);
    }
  }

  /**
   * Reject/delete match
   */
  async rejectMatch(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const { matchId } = req.params;

      if (!userId || !matchId) {
        return next(new AppError(400, "Missing required parameters"));
      }

      await matchService.rejectMatch(matchId, userId);

      res.json({
        status: "success",
        message: "Match removed",
      });
    } catch (error) {
      if (error instanceof Error && error.message === "MATCH_NOT_FOUND") {
        return next(new AppError(404, "Match not found"));
      }
      if (error instanceof Error && error.message === "UNAUTHORIZED") {
        return next(new AppError(403, "Unauthorized to reject this match"));
      }
      next(error);
    }
  }

  /**
   * Get match details
   */
  async getMatchDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const { matchId } = req.params;

      if (!userId || !matchId) {
        return next(new AppError(400, "Missing required parameters"));
      }

      // TODO: Implementiere Match-Details-Logik

      res.json({
        status: "success",
        data: {
          /* match details */
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Unmatch (bi-directional delete)
   */
  async unmatch(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const { matchId } = req.params;

      if (!userId || !matchId) {
        return next(new AppError(400, "Missing required parameters"));
      }

      await matchService.rejectMatch(matchId, userId);

      res.json({
        status: "success",
        message: "Unmatched successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new MatchController();
