import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FirebaseError } from 'firebase/app';
import { Logo } from '../components/common/Logo';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      setError('');
      setLoading(true);
      await register({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            setError('An account with this email already exists');
            break;
          case 'auth/invalid-email':
            setError('Invalid email address');
            break;
          case 'auth/weak-password':
            setError('Password is too weak');
            break;
          default:
            setError('Failed to create account');
        }
      } else {
        setError('Failed to create account');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-background-primary">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-4 left-4 text-text-secondary hover:text-text-primary flex items-center gap-2 transition-colors"
        onClick={() => navigate(-1)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </motion.button>

      {/* Logo */}
      <div className="mb-12">
        <Logo width={180} height={60} className="text-text-primary" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        {/* Sign up text */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-text-primary">Sign up</h1>
          <p className="text-text-secondary text-lg">Create a new account</p>
        </div>

        {error && (
          <div className="p-4 bg-status-error/10 border border-status-error/20 rounded-lg text-status-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Name"
              className="w-full pl-12 pr-4 py-4 bg-background-card text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-12 pr-4 py-4 bg-background-card text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-12 pr-4 py-4 bg-background-card text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Sign up button */}
          <button
            type="submit"
            className="w-full py-4 bg-accent-primary text-text-inverse rounded-lg font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign up'}
          </button>

          {/* Terms and conditions */}
          <div className="text-center text-text-secondary text-sm">
            By continuing Sign up you agree to the following{' '}
            <Link to="/terms" className="text-accent-primary hover:text-accent-hover transition-colors">
              Terms & Conditions
            </Link>
            {' '}without reservation
          </div>
        </form>

        {/* Login link */}
        <div className="text-center text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="text-accent-primary hover:text-accent-hover transition-colors">
            Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  );
} 