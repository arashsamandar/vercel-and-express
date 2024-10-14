import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import MyParent from "./tests/myParent.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MyParent />
  </StrictMode>,
)
