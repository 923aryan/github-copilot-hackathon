import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'
import { Toaster } from './components/ui/toaster.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
    <App />
    <Toaster />
  </ThemeProvider>
  // </StrictMode>,
)
