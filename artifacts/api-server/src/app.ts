import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// Clerk proxy must be before body parsers
app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

// CORS: restrict to an explicit allowlist; never reflect arbitrary origins with credentials.
// Set CORS_ORIGIN (comma-separated) in production. Falls back to localhost dev origins.
const rawCorsOrigins = process.env.CORS_ORIGIN;
const allowedOrigins: string[] = rawCorsOrigins
  ? rawCorsOrigins.split(",").map((o) => o.trim())
  : [];

app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      // Allow server-to-server (no Origin header)
      if (!origin) return callback(null, true);
      // In dev with no explicit allowlist, permit any localhost/replit origin
      if (allowedOrigins.length === 0) {
        const isLocalDev =
          /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
          origin.endsWith(".replit.dev") ||
          origin.endsWith(".repl.co");
        if (isLocalDev) return callback(null, true);
        return callback(new Error(`CORS: origin '${origin}' not allowed`));
      }
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS: origin '${origin}' not in allowlist`));
    },
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const devAuthBypassEnabled =
  process.env.NODE_ENV !== "production" && process.env.DEV_AUTH_BYPASS === "true";

if (devAuthBypassEnabled) {
  logger.warn(
    "DEV_AUTH_BYPASS is enabled: all requests are treated as the hardcoded admin user 'bjarne'. This must NEVER be enabled in production.",
  );
  app.use((req, _res, next) => {
    (req as any).auth = { userId: "bjarne" };
    next();
  });
} else {
  // Clerk middleware — resolves publishable key from host for custom domains
  app.use(
    clerkMiddleware((req) => ({
      publishableKey: publishableKeyFromHost(
        getClerkProxyHost(req) ?? "",
        process.env.CLERK_PUBLISHABLE_KEY,
      ),
    })),
  );
}

app.use("/api", router);

export default app;
