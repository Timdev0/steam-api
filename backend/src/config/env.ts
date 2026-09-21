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
  // Allowed CORS origin. Vite's dev server defaults to port 5173.
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
};
