import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { motion } from 'framer-motion';

export default function PasswordResetSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-background-primary">
      {/* Logo */}
      <div className="mb-12">
        <Logo width={180} height={60} className="text-text-primary" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        {/* Success icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-status-success/10 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-status-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Title and subtitle */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-text-primary">Password Reset</h1>
          <p className="text-text-secondary text-lg">Your password has been reset successfully</p>
        </div>

        {/* Sign in button */}
        <button
          onClick={() => navigate('/login')}
          className="w-full py-4 bg-accent-primary text-text-inverse rounded-lg font-medium hover:bg-accent-hover transition-colors"
        >
          Sign in
        </button>
      </motion.div>
    </div>
  );
} 