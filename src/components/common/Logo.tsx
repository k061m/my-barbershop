import { useTheme } from '../../contexts/ThemeContext';

export default function Logo() {
  const { theme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-8 h-8"
        style={{ color: theme.colors.accent.primary }}
      >
        <path
          fill="currentColor"
          d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
        />
        <circle
          cx="12"
          cy="10"
          r="3"
          fill={theme.colors.background.primary}
        />
      </svg>
      <span className="text-xl font-bold" style={{ color: theme.colors.text.primary }}>
        BarberShop
      </span>
    </div>
  );
} 