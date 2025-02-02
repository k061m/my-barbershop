import { useTheme } from '../../contexts/ThemeContext';

export default function LoadingSpinner() {
  const { theme } = useTheme();

  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div 
        className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent"
        style={{ 
          borderColor: `${theme.colors.accent.primary} transparent transparent transparent`
        }}
      />
    </div>
  );
} 