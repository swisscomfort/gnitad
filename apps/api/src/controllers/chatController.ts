import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import chatService from "../services/chatService";
import { AppError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";

class ChatController {
  /**
   * Send message
   */
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const { recipientId, content } = z
        .object({
          recipientId: z.string().uuid(),
          content: z.string().min(1).max(5000),
        })
        .parse(req.body);

      if (!userId) {
        return next(new AppError(401, "Unauthorized"));
      }

      const message = await chatService.sendMessage({
        userId,
        recipientId,
        content,
      });

      res.status(201).json({
        status: "success",
        message: "Message sent",
        data: message,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new AppError(400, `Validation error: ${error.message}`));
      }
      if (error instanceof Error && error.message === "NO_MATCH_FOUND") {
        return next(
          new AppError(
            403,
            "You can only message matched users. Create a match first."
          )
        );
      }
      next(error);
    }
  }

  /**
   * Get conversation
   */
  async getConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const { otherUserId } = req.params;
      const { limit = 50 } = req.query;

      if (!userId || !otherUserId) {
        return next(new AppError(400, "Missing required parameters"));
      }

      const messages = await chatService.getConversation(
        userId,
        otherUserId,
        parseInt(limit as string)
      );

      res.json({
        status: "success",
        data: messages,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get conversations list
   */
  async getConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return next(new AppError(401, "Unauthorized"));
      }

      const conversations = await chatService.getConversations(userId);

      res.json({
        status: "success",
        data: conversations,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark message as read
   */
  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const { messageId } = req.params;

      if (!userId || !messageId) {
        return next(new AppError(400, "Missing required parameters"));
      }

      await chatService.markAsRead(messageId, userId);

      res.json({
        status: "success",
        message: "Message marked as read",
      });
    } catch (error) {
      if (error instanceof Error && error.message === "MESSAGE_NOT_FOUND") {
        return next(new AppError(404, "Message not found"));
      }
      next(error);
    }
  }

  /**
   * Get unread message count
   */
  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return next(new AppError(401, "Unauthorized"));
      }

      const count = await chatService.getUnreadCount(userId);

      res.json({
        status: "success",
        data: { unreadCount: count },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete conversation
   */
  async deleteConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const { otherUserId } = req.params;

      if (!userId || !otherUserId) {
        return next(new AppError(400, "Missing required parameters"));
      }

      await chatService.deleteConversation(userId, otherUserId);

      res.json({
        status: "success",
        message: "Conversation deleted",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete single message
   */
  async deleteMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const { messageId } = req.params;

      if (!userId || !messageId) {
        return next(new AppError(400, "Missing required parameters"));
      }

      // TODO: Implementiere Message-Deletion

      res.json({
        status: "success",
        message: "Message deleted",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ChatController();
