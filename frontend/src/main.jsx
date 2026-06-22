// import { StrictMode } from 'react'
// import MyApp from "./MyApp.jsx";
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

if ('scrollRestoration' in window.history) {window.history.scrollRestoration = 'manual';} // for Scroll behaviour

createRoot(document.getElementById('root'))
    .render(<App />)
