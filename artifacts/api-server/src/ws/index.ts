import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { logger } from "../lib/logger";

interface ClientInfo {
  userId: string;
  username: string;
  avatarUrl?: string | null;
}

// Map of ws → client info
const clients = new Map<WebSocket, ClientInfo>();

// Broadcast to all connected clients
function broadcast(data: unknown): void {
  const message = JSON.stringify(data);
  for (const [ws] of clients) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  }
}

// Get current online users list
function getOnlineUsers(): Array<{ userId: string; username: string; avatarUrl?: string | null }> {
  const seen = new Set<string>();
  const users: Array<{ userId: string; username: string; avatarUrl?: string | null }> = [];
  for (const [, info] of clients) {
    if (!seen.has(info.userId)) {
      seen.add(info.userId);
      users.push({ userId: info.userId, username: info.username, avatarUrl: info.avatarUrl });
    }
  }
  return users;
}

function broadcastPresence(): void {
  const users = getOnlineUsers();
  broadcast({ type: "presence", count: users.length, users });
}

// Called by REST routes when a new message is created
export function broadcastNewMessage(message: unknown): void {
  broadcast({ type: "message", message });
}

// Called by REST routes when a message's reactions are updated
export function broadcastReactionUpdate(message: unknown): void {
  broadcast({ type: "reaction", message });
}

// Called by REST routes when a message is deleted
export function broadcastMessageDelete(messageId: number, channelId: string): void {
  broadcast({ type: "delete", messageId, channelId });
}

export function getOnlineCount(): number {
  return getOnlineUsers().length;
}

export function getOnlineUsersList() {
  return getOnlineUsers();
}

export function setupWebSocket(server: Server): void {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws, req) => {
    logger.info({ url: req.url }, "WebSocket connection opened");
    (ws as any)._isAlive = true;

    ws.on("message", async (data) => {
      try {
        const msg = JSON.parse(data.toString());

        if (msg.type === "auth" && msg.userId && msg.username) {
          // Only verified VectorVest members may join presence/broadcast — a
          // pending/rejected user must not receive live chat over the socket
          // even though their REST calls are already blocked.
          const [user] = await db
            .select({ membershipStatus: usersTable.membershipStatus })
            .from(usersTable)
            .where(eq(usersTable.userId, msg.userId));
          if (!user || user.membershipStatus !== "verified") {
            ws.close(4403, "Membership not verified");
            return;
          }

          // Register this client
          clients.set(ws, {
            userId: msg.userId,
            username: msg.username,
            avatarUrl: msg.avatarUrl ?? null,
          });
          logger.info({ userId: msg.userId }, "WebSocket client authenticated");
          // Send current presence to the new client
          const users = getOnlineUsers();
          ws.send(JSON.stringify({ type: "presence", count: users.length, users }));
          // Broadcast updated presence to everyone
          broadcastPresence();
        }
      } catch (err) {
        logger.warn({ err }, "WebSocket message parse error");
      }
    });

    ws.on("close", () => {
      const info = clients.get(ws);
      clients.delete(ws);
      if (info) {
        logger.info({ userId: info.userId }, "WebSocket client disconnected");
        broadcastPresence();
      }
    });

    ws.on("error", (err) => {
      logger.warn({ err }, "WebSocket error");
      clients.delete(ws);
    });

    // Ping/pong for keepalive
    ws.on("pong", () => {
      (ws as any)._isAlive = true;
    });
  });

  // Heartbeat — terminate dead connections every 30s
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if ((ws as any)._isAlive === false) {
        clients.delete(ws);
        ws.terminate();
        return;
      }
      (ws as any)._isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on("close", () => clearInterval(interval));

  logger.info("WebSocket server initialized at /ws");
}
