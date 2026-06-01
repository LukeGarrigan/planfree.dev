/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER: string
  readonly VITE_SENTRY_DSN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
