import type { Request, Response, NextFunction } from "express";
import { getOrCreateUser } from "../lib/userProvisioning";

export interface AuthedRequest extends Request {
  userId: string;
}

const devAuthBypassEnabled =
  process.env.NODE_ENV !== "production" && process.env.DEV_AUTH_BYPASS === "true";

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (devAuthBypassEnabled) {
    (req as AuthedRequest).userId = "bjarne";
    next();
    return;
  }

  const auth = (req as any).auth;
  const userId = auth?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  (req as AuthedRequest).userId = userId;
  next();
}

/** Must run after requireAuth. Gates access to VectorVest-members-only routes. */
export async function requireVerifiedMember(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const userId = (req as AuthedRequest).userId;
  const user = await getOrCreateUser(userId);
  if (!user || user.membershipStatus !== "verified") {
    res.status(403).json({
      error: "MembershipNotVerified",
      membershipStatus: user?.membershipStatus ?? "pending",
    });
    return;
  }
  next();
}

/** Must run after requireAuth (and typically requireVerifiedMember). */
export async function requireAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = (req as AuthedRequest).userId;
  const user = await getOrCreateUser(userId);
  if (!user || user.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  next();
}
