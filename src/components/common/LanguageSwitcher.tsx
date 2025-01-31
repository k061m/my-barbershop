import { useTheme } from '../../contexts/ThemeContext';
import { Language } from '../../types';

interface LanguageSwitcherProps {
  /** Currently selected language */
  currentLanguage: Language;
  /** Callback function when language changes */
  onLanguageChange: (language: Language) => void;
  /** Optional className for additional styling */
  className?: string;
}

/**
 * LanguageSwitcher Component
 * 
 * A dropdown component that allows users to switch between available languages.
 * Supports all languages defined in the Language type.
 * 
 * @component
 * @example
 * ```tsx
 * <LanguageSwitcher
 *   currentLanguage="en"
 *   onLanguageChange={(lang) => setLanguage(lang)}
 * />
 * ```
 */
export default function LanguageSwitcher({
  currentLanguage,
  onLanguageChange,
  className = ''
}: LanguageSwitcherProps) {
  const { theme } = useTheme();

  const languages: Record<Language, string> = {
    en: 'English',
    de: 'Deutsch',
    ar: 'العربية'
  };

  return (
    <select
      value={currentLanguage}
      onChange={(e) => onLanguageChange(e.target.value as Language)}
      className={`select select-sm ${className}`}
      style={{ 
        backgroundColor: theme.colors.background.primary,
        color: theme.colors.text.primary
      }}
      aria-label="Select language"
    >
      {Object.entries(languages).map(([code, name]) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </select>
  );
} 