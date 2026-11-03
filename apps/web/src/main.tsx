import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/marketing.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

// Remove crawler HTML fallback once the SPA is mounted (keeps Meta/OG source readable pre-JS)
queueMicrotask(() => {
  document.getElementById('aikova-seo-fallback')?.remove()
})
