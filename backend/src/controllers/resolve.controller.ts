import type { Request, Response } from "express";
import { resolveSteamId } from "../services/steam.service.js";

export async function resolve(req: Request, res: Response) {
  const raw = req.query.input;
  const input = typeof raw === "string" ? raw : undefined;

  if (!input) {
    return res.status(400).json({ error: "Entrée manquante" });
  }

  try {
    const steamId = await resolveSteamId(input);
    if (!steamId) {
      return res.status(404).json({ error: "Profil introuvable" });
    }
    res.json({ steamId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}