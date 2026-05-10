import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Wordle from './components/Wordle.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Wordle />
  </StrictMode>,
)
