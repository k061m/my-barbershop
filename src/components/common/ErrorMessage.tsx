import { useTheme } from '../../contexts/ThemeContext';
import { FaExclamationCircle } from 'react-icons/fa';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  const { theme } = useTheme();

  return (
    <div 
      className="rounded-lg p-4 flex items-center gap-3"
      style={{ backgroundColor: theme.colors.background.secondary }}
    >
      <FaExclamationCircle 
        className="w-5 h-5 flex-shrink-0 text-red-500"
      />
      <p className="text-red-500">
        {message}
      </p>
    </div>
  );
} 
