import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Admin from './admin/Admin.jsx'
import NewsPage from './components/NewsPage.jsx'
import './index.css'

// Oddiy yoʻriqnoma: /admin — boshqaruv paneli, /news — yangiliklar, aks holda — sayt
const path = window.location.pathname.replace(/\/+$/, '')

function Root() {
  if (path === '/admin') return <Admin />
  if (path === '/news') return <NewsPage />
  return <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)
