import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Variable d'environnement manquante : ${name}`);
  return value;
}

export const env = {
  steamApiKey: required("STEAM_API_KEY"),
  port: Number(process.env.PORT) || 3000,
  steamApiUrl: required("STEAM_API_URL"),
};
