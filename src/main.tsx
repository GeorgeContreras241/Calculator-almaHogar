import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { iniciarDeteccionDeVersion } from './lib/version'

iniciarDeteccionDeVersion()

createRoot(document.getElementById('root')!).render(
  <App />
)
