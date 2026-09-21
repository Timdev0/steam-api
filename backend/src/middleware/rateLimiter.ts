import rateLimit from "express-rate-limit";

/**
 * Protects the Steam API key (shared by every visitor) from abuse:
 * 30 requests / minute / IP on the /api routes.
 */
export const steamApiLimiter = rateLimit({
  windowMs: 60_000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again in a minute." },
});
