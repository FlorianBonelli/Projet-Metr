import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'

// IMPORTANT: Remplacez cette valeur par votre Client ID Google OAuth
// Obtenez-le depuis https://console.cloud.google.com/apis/credentials
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'VOTRE_GOOGLE_CLIENT_ID'

console.log('GOOGLE_CLIENT_ID utilisé :', GOOGLE_CLIENT_ID)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
