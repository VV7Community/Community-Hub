import http from "http";
import app from "./app";
import { logger } from "./lib/logger";
import { setupWebSocket } from "./ws";
import { scheduleEventSync } from "./lib/startupSync";

// Safety check: DEV_AUTH_BYPASS should never be active in production.
// app.ts already prevents the bypass from actually being enabled when
// NODE_ENV=production, so this is belt-and-suspenders — warn but don't crash.
if (
  process.env.NODE_ENV === "production" &&
  process.env.DEV_AUTH_BYPASS === "true"
) {
  console.warn(
    "WARNING: DEV_AUTH_BYPASS=true is set in a production environment. " +
      "The bypass is NOT active (app.ts guards against this), but this env " +
      "var should be removed from the production environment.",
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
  scheduleEventSync();
});
