import http from "http";
import app from "./app";
import { logger } from "./lib/logger";
import { setupWebSocket } from "./ws";

// Hard guard: DEV_AUTH_BYPASS must never run in production.
if (
  process.env.NODE_ENV === "production" &&
  process.env.DEV_AUTH_BYPASS === "true"
) {
  throw new Error(
    "FATAL: DEV_AUTH_BYPASS=true is set in a production environment. " +
      "This bypasses all authentication. Refusing to start.",
  );
}

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const server = http.createServer(app);

setupWebSocket(server);

server.listen(port, () => {
  logger.info({ port }, "Server listening");
});
