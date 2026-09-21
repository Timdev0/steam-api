export class SteamApiError extends Error {
  readonly status: number;

  constructor(message: string, status = 502) {
    super(message);
    this.name = "SteamApiError";
    this.status = status;
  }
}
