import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";
import crypto from "crypto";

const prisma = new PrismaClient();

/**
 * Einfache Nachricht-Verschlüsselung (später libsodium verwenden)
 */
function encryptMessage(message: string, key: string): string {
  // TODO: Implementiere echte Verschlüsselung
  return Buffer.from(message).toString("base64");
}

function decryptMessage(encrypted: string, key: string): string {
  // TODO: Implementiere echte Entschlüsselung
  return Buffer.from(encrypted, "base64").toString("utf8");
}

export class ChatService {
  /**
   * Sende Nachricht
   */
  async sendMessage(input: {
    userId: string;
    recipientId: string;
    content: string;
    matchId?: string;
  }) {
    try {
      // Überprüfe ob Match existiert
      const match = await prisma.match.findFirst({
        where: {
          OR: [
            { user1Id: input.userId, user2Id: input.recipientId },
            { user1Id: input.recipientId, user2Id: input.userId },
          ],
          status: "matched",
        },
      });

      if (!match) {
        throw new Error("NO_MATCH_FOUND");
      }

      // Verschlüssele Nachricht
      const encryptedContent = encryptMessage(input.content, "shared-key");

      const message = await prisma.message.create({
        data: {
          userId: input.userId,
          recipientId: input.recipientId,
          content: encryptedContent,
          matchId: match.id,
          isRead: false,
        },
      });

      logger.info("Message sent", {
        messageId: message.id,
        from: input.userId,
        to: input.recipientId,
      });

      return {
        id: message.id,
        userId: message.userId,
        recipientId: message.recipientId,
        content: input.content, // Gib original content zurück
        createdAt: message.createdAt,
        isRead: message.isRead,
      };
    } catch (error) {
      logger.error("Error sending message", { error });
      throw error;
    }
  }

  /**
   * Hole Nachrichten mit anderem Benutzer
   */
  async getConversation(
    userId: string,
    otherUserId: string,
    limit: number = 50
  ) {
    try {
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { userId, recipientId: otherUserId },
            { userId: otherUserId, recipientId: userId },
          ],
        },
        take: limit,
        orderBy: { createdAt: "desc" },
      });

      // Entschlüssele Nachrichten
      return messages.reverse().map((msg) => ({
        id: msg.id,
        userId: msg.userId,
        recipientId: msg.recipientId,
        content: decryptMessage(msg.content, "shared-key"),
        createdAt: msg.createdAt,
        isRead: msg.isRead,
      }));
    } catch (error) {
      logger.error("Error fetching conversation", { error });
      throw error;
    }
  }

  /**
   * Markiere Nachricht als gelesen
   */
  async markAsRead(messageId: string, userId: string) {
    try {
      const message = await prisma.message.findUnique({
        where: { id: messageId },
      });

      if (!message || message.recipientId !== userId) {
        throw new Error("MESSAGE_NOT_FOUND");
      }

      await prisma.message.update({
        where: { id: messageId },
        data: { isRead: true },
      });

      logger.info("Message marked as read", { messageId });
    } catch (error) {
      logger.error("Error marking message as read", { error });
      throw error;
    }
  }

  /**
   * Hole ungelesene Nachrichten
   */
  async getUnreadCount(userId: string) {
    try {
      return await prisma.message.count({
        where: {
          recipientId: userId,
          isRead: false,
        },
      });
    } catch (error) {
      logger.error("Error fetching unread count", { error });
      throw error;
    }
  }

  /**
   * Hole Konversationsliste
   */
  async getConversations(userId: string) {
    try {
      // Finde alle eindeutigen Konversationspartner
      const messages = await prisma.message.findMany({
        where: {
          OR: [{ userId }, { recipientId: userId }],
        },
        distinct: ["userId", "recipientId"],
        orderBy: { createdAt: "desc" },
      });

      // Extrahiere Partner-IDs
      const partnerIds = [
        ...new Set(
          messages
            .map((msg) =>
              msg.userId === userId ? msg.recipientId : msg.userId
            )
            .filter((id) => id !== userId)
        ),
      ];

      // Finde Partner-Details
      const partners = await prisma.user.findMany({
        where: { id: { in: partnerIds } },
        select: {
          id: true,
          pseudonym: true,
          ageRange: true,
          photos: {
            select: { photoUrl: true, isPrimary: true },
            take: 1,
          },
        },
      });

      return partners;
    } catch (error) {
      logger.error("Error fetching conversations", { error });
      throw error;
    }
  }

  /**
   * Lösche Konversation
   */
  async deleteConversation(userId: string, otherUserId: string) {
    try {
      await prisma.message.deleteMany({
        where: {
          OR: [
            { userId, recipientId: otherUserId },
            { userId: otherUserId, recipientId: userId },
          ],
        },
      });

      logger.info("Conversation deleted", { userId, otherUserId });
    } catch (error) {
      logger.error("Error deleting conversation", { error });
      throw error;
    }
  }
}

export default new ChatService();
