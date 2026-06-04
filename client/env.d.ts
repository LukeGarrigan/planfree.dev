/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER: string
  readonly VITE_SENTRY_DSN?: string
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
