import { useTheme } from '../../contexts/ThemeContext';

export default function LoadingSpinner() {
  const { theme } = useTheme();
  return <div className="loading loading-spinner loading-lg" style={{ color: theme.colors.accent.primary }}></div>;
} 