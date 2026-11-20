import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import './index.css'
import App from './App.tsx'
import { installPressedState } from './lib/pressed'

// Pressed states on pointerdown, in every browser (see lib/pressed.ts).
// The pointer listener also covers iOS Safari's need for a touch listener before :active applies.
installPressedState()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
