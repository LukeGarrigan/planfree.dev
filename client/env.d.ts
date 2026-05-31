/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
