import { describe, expect, it } from "vitest";
import { getInventoryGame, INVENTORY_GAMES } from "./inventoryGames.js";

describe("getInventoryGame", () => {
  it("resolves a known slug", () => {
    expect(getInventoryGame("cs2")).toEqual(INVENTORY_GAMES.cs2);
  });

  it("is case-insensitive", () => {
    expect(getInventoryGame("CS2")).toEqual(INVENTORY_GAMES.cs2);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getInventoryGame("dota2")).toBeUndefined();
  });
});
