/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the backend API (no trailing slash). Unset in dev = relative /api calls via the Vite proxy. */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
