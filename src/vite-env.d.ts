/// <reference types="vite/client" />

declare global {
  interface Window {
    fablethread?: {
      load: () => Promise<unknown>
      save: (data: unknown) => Promise<boolean>
      exportBook: (payload: { title: string; markdown: string }) => Promise<string | null>
    }
  }
}
export {}
