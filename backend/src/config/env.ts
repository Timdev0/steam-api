import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export const env = {
  steamApiKey: required("STEAM_API_KEY"),
  port: Number(process.env.PORT) || 3000,
  steamApiUrl: required("STEAM_API_URL"),
  // Comma-separated list of allowed CORS origins (no trailing slash).
  // Vite's dev server defaults to port 5173.
  frontendUrls: (process.env.FRONTEND_URL || "http://localhost:5173")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean),
};
