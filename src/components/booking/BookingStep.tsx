import { ReactNode } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface BookingStepProps {
  stepNumber: number;
  title: string;
  children: ReactNode;
}

export default function BookingStep({ stepNumber, title, children }: BookingStepProps) {
  const { theme } = useTheme();

  return (
    <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: theme.colors.background.card }}>
      <h3 className="font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
        Step {stepNumber}
      </h3>
      <h2 className="text-xl font-bold mb-4" style={{ color: theme.colors.text.primary }}>
        {title}
      </h2>
      {children}
    </div>
  );
} 