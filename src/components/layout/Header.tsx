import { useTheme } from '../../contexts/ThemeContext';
import Logo from '../common/Logo';
import Navbar from './Navbar';

export default function Header() {
  const { theme } = useTheme();
  
  return (
    <header 
      className="sticky top-0 z-50 border-b"
      style={{ 
        backgroundColor: theme.colors.background.primary,
        borderColor: theme.colors.border
      }}
    >
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Logo />
        <Navbar />
      </div>
    </header>
  );
} 