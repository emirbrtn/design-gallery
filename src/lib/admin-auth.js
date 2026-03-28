import "server-only";
import crypto from "node:crypto";

const COOKIE_NAME = "admin-session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET eksik.");
  }

  return secret;
}

function sign(value) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function getAdminCookieName() {
  return COOKIE_NAME;
}

export function getAdminSessionMaxAge() {
  return SESSION_MAX_AGE;
}

export function createAdminSessionToken() {
  const payload = JSON.stringify({
    role: "admin",
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  });

  const encodedPayload = Buffer.from(payload).toString("base64url");
  const signature = sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifyAdminSessionToken(token) {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [encodedPayload, providedSignature] = parts;
  const expectedSignature = sign(encodedPayload);

  const a = Buffer.from(providedSignature);
  const b = Buffer.from(expectedSignature);

  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    );

    if (payload.role !== "admin") return false;
    if (!payload.exp || Date.now() > payload.exp) return false;

    return true;
  } catch {
    return false;
  }
}
