import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../config/env.js", () => ({
  env: {
    steamApiKey: "test-key",
    steamApiUrl: "https://api.steampowered.com",
    frontendUrls: ["http://localhost:5173"],
  },
}));

import { getInventory } from "./steam.service.js";

function mockFetchOnce(body: unknown, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      json: async () => body,
    }),
  );
}

describe("getInventory", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it("merges assets with their matching description into clean items", async () => {
    mockFetchOnce({
      success: 1,
      total_inventory_count: 1,
      assets: [
        { appid: 730, contextid: "2", assetid: "111", classid: "222", instanceid: "0", amount: "1" },
      ],
      descriptions: [
        {
          appid: 730,
          classid: "222",
          instanceid: "0",
          market_hash_name: "AK-47 | Redline (Field-Tested)",
          name: "AK-47 | Redline",
          icon_url: "abc123",
          tradable: 1,
          marketable: 1,
        },
      ],
    });

    const result = await getInventory("steamid-a", 730, 2);

    expect(result.totalCount).toBe(1);
    expect(result.items).toEqual([
      {
        assetId: "111",
        classId: "222",
        name: "AK-47 | Redline",
        marketHashName: "AK-47 | Redline (Field-Tested)",
        iconUrl: "abc123",
        amount: 1,
        tradable: true,
        marketable: true,
      },
    ]);
  });

  it("drops an asset that has no matching description instead of crashing", async () => {
    mockFetchOnce({
      success: 1,
      total_inventory_count: 1,
      assets: [
        { appid: 730, contextid: "2", assetid: "999", classid: "no-match", instanceid: "0", amount: "1" },
      ],
      descriptions: [],
    });

    const result = await getInventory("steamid-b", 730, 2);
    expect(result.items).toEqual([]);
  });

  it("throws when the inventory is private (Steam returns a literal null body)", async () => {
    mockFetchOnce(null);

    await expect(getInventory("steamid-c", 730, 2)).rejects.toThrow(/private|unavailable/i);
  });

  it("throws with Steam's own message when it reports failure explicitly", async () => {
    mockFetchOnce({ success: 0, Error: "This profile is private." });

    await expect(getInventory("steamid-d", 730, 2)).rejects.toThrow("This profile is private.");
  });
});
