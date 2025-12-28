import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './modules/dashboard/store/store'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {console.log('🚀 [main.jsx] Rendering App...')}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
