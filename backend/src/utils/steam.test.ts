import { describe, expect, it } from "vitest";
import { parseSteamInput } from "./steam.js";

describe("parseSteamInput", () => {
  it("recognizes a raw SteamID64", () => {
    expect(parseSteamInput("76561197960287930")).toEqual({
      type: "steamid",
      value: "76561197960287930",
    });
  });

  it("trims whitespace before parsing", () => {
    expect(parseSteamInput("  76561197960287930  ")).toEqual({
      type: "steamid",
      value: "76561197960287930",
    });
  });

  it("extracts the SteamID64 from a /profiles/ URL", () => {
    expect(parseSteamInput("https://steamcommunity.com/profiles/76561197960287930")).toEqual({
      type: "steamid",
      value: "76561197960287930",
    });
  });

  it("extracts the vanity name from an /id/ URL", () => {
    expect(parseSteamInput("https://steamcommunity.com/id/gaben")).toEqual({
      type: "vanity",
      value: "gaben",
    });
  });

  it("extracts the vanity name from an /id/ URL with a trailing slash", () => {
    expect(parseSteamInput("https://steamcommunity.com/id/gaben/")).toEqual({
      type: "vanity",
      value: "gaben",
    });
  });

  it("treats an unrecognized input as a vanity name typed directly", () => {
    expect(parseSteamInput("gaben")).toEqual({ type: "vanity", value: "gaben" });
  });

  it("returns null for an empty input", () => {
    expect(parseSteamInput("")).toBeNull();
    expect(parseSteamInput("   ")).toBeNull();
  });

  it("does not mistake a 17-digit non-SteamID number for a vanity name", () => {
    // Only 16 digits -> doesn't match the SteamID64 pattern
    expect(parseSteamInput("1234567890123456")).toEqual({
      type: "vanity",
      value: "1234567890123456",
    });
  });
});
