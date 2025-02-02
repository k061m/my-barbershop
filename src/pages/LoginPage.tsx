import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FirebaseError } from 'firebase/app';
import { Logo } from '../components/common/Logo';
import Card from '../components/common/Card';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            setError('Invalid email or password');
            break;
          case 'auth/invalid-email':
            setError('Invalid email address');
            break;
          default:
            setError('Failed to log in');
        }
      } else {
        setError('Failed to log in');
      }
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ backgroundColor: theme.colors.background.primary }}
    >
      <Card className="w-full max-w-md">
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <Logo width={180} height={60} className="mb-4" />
            <h2 
              className="text-2xl font-semibold"
              style={{ color: theme.colors.text.primary }}
            >
              Welcome Back
            </h2>
          </div>
          
          {error && (
            <div 
              className="p-4 rounded-lg"
              style={{ 
                backgroundColor: theme.colors.status.error,
                color: theme.colors.text.primary 
              }}
            >
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: theme.colors.text.secondary }}
              >
                Email
              </label>
              <input 
                type="email" 
                placeholder="your@email.com" 
                className="w-full px-4 py-2 rounded-lg"
                style={{ 
                  backgroundColor: theme.colors.background.card,
                  color: theme.colors.text.primary
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: theme.colors.text.secondary }}
              >
                Password
              </label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full px-4 py-2 rounded-lg"
                style={{ 
                  backgroundColor: theme.colors.background.card,
                  color: theme.colors.text.primary
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <div className="mt-1 text-right">
                <Link 
                  to="/forgot-password" 
                  className="text-sm hover:opacity-80 transition-opacity"
                  style={{ color: theme.colors.accent.primary }}
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-2 rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ 
                backgroundColor: theme.colors.accent.primary,
                color: theme.colors.background.primary
              }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div 
              className="text-center"
              style={{ color: theme.colors.text.secondary }}
            >
              <span className="text-sm">Don't have an account? </span>
              <Link 
                to="/register" 
                className="text-sm hover:opacity-80 transition-opacity"
                style={{ color: theme.colors.accent.primary }}
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
} 