import { getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import { getOrCreateUser } from "../lib/userProvisioning";

export interface AuthedRequest extends Request {
  userId: string;
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const auth = getAuth(req);
  const userId = (auth?.sessionClaims as any)?.userId ?? auth?.userId;
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
