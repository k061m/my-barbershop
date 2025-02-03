// Import necessary dependencies from React
import { createContext, useContext, useState, ReactNode } from 'react';
// Import the Language type from a local types file
import { Language } from '../types';

// Define the shape of the context value
interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
}

// Create a context for language management
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// LanguageProvider component to wrap the app and provide language context
export function LanguageProvider({ children }: { children: ReactNode }) {
  // State to hold the current language, initialized to 'en' (English)
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  // Function to update the language
  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
  };

  // Provide the language context to child components
  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use the language context in components
export function useLanguage() {
  // Get the context value
  const context = useContext(LanguageContext);
  // Throw an error if the hook is used outside of a LanguageProvider
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  // Return the context value
  return context;
}
