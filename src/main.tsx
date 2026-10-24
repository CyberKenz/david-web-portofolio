import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'aos/dist/aos.css'
import AOS from 'aos'
import './index.css'
import App from './App.tsx'

AOS.init({
  duration: 700,
  easing: 'ease-out-quart',
  once: true,
  offset: 80,
  delay: 0,
  mirror: false,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
