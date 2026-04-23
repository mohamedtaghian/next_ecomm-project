import jwt from "jsonwebtoken";
import { apiError } from "./apiResponse";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

/**
 * Extracts and verifies the JWT from the Authorization header.
 * Returns { userId, role } on success, or a NextResponse error.
 */
export function authenticate(request) {
  const authHeader = request.headers.get("authorization");
  const token =
    authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : request.headers.get("token"); // support legacy plain token header

  if (!token) return { error: apiError("No token provided", 401) };

  try {
    const decoded = verifyToken(token);
    return { userId: decoded.id, role: decoded.role };
  } catch {
    return { error: apiError("Invalid or expired token", 401) };
  }
}

/**
 * Require admin role. Pass result of authenticate().
 */
export function requireAdmin(auth) {
  if (auth.error) return auth.error;
  if (auth.role !== "admin") return apiError("Admin access required", 403);
  return null;
}
