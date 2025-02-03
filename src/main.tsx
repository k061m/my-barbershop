// Import necessary dependencies
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'

// Create a root for the React application and render the content
ReactDOM.createRoot(document.getElementById('root')!).render(
  // Wrap the app in React.StrictMode for additional checks and warnings during development
  <React.StrictMode>
    // Wrap the entire app in the AuthProvider to make authentication context available throughout the app
    <AuthProvider>
      // Render the main App component
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
