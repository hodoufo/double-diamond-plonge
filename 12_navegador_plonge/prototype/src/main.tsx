import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ContactNewDraftProvider } from './context/ContactNewDraftContext'
import { DetailPanelProvider } from './context/DetailPanelContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <DetailPanelProvider>
        <ContactNewDraftProvider>
          <App />
        </ContactNewDraftProvider>
      </DetailPanelProvider>
    </BrowserRouter>
  </StrictMode>,
)
