import { useTheme } from '../contexts/ThemeContext';

export default function ContactPage() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: theme.colors.background.primary }}>
      <div className="container mx-auto px-4">
        <h1 
          className="text-4xl font-bold mb-8 text-center"
          style={{ color: theme.colors.text.primary }}
        >
          Contact Us
        </h1>
        <div 
          className="max-w-2xl mx-auto p-6 rounded-lg"
          style={{ backgroundColor: theme.colors.background.card }}
        >
          <p 
            className="text-lg mb-6 text-center"
            style={{ color: theme.colors.text.secondary }}
          >
            Contact page content coming soon...
          </p>
        </div>
      </div>
    </div>
  );
} 