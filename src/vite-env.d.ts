/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BASE_URL: string,
    readonly VITE_GITHUB_ID: string
    readonly VITE_REDIRECT_URI: string

}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}