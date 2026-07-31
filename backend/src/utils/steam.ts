type ParsedInput =
  | { type: "steamid"; value: string }
  | { type: "vanity"; value: string };

export function parseSteamInput(input: string): ParsedInput | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // SteamID64 brut (17 chiffres)
  if (/^\d{17}$/.test(trimmed)) {
    return { type: "steamid", value: trimmed };
  }

  // URL /profiles/<steamid64>
  const profileMatch = trimmed.match(/steamcommunity\.com\/profiles\/(\d{17})/);
  if (profileMatch?.[1]) {
    return { type: "steamid", value: profileMatch[1] };
  }

  // URL /id/<vanity>
  const vanityMatch = trimmed.match(/steamcommunity\.com\/id\/([^/]+)/);
  if (vanityMatch?.[1]) {
    return { type: "vanity", value: vanityMatch[1] };
  }

  // Sinon : vanity tapé directement
  return { type: "vanity", value: trimmed };
}
