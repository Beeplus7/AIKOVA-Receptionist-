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

// Keep crawler text in the DOM (visually hide only). Meta AI / bots that execute JS
// still retain readable copy if they land on the SPA instead of home.html.
queueMicrotask(() => {
  const el = document.getElementById('aikova-seo-fallback')
  if (!el) return
  el.setAttribute('aria-hidden', 'true')
  el.style.cssText =
    'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;'

  // SPA chrome is live — drop the HTML bootstrap CTA bar
  document.getElementById('aikova-boot-cta')?.remove()
})
