import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { motion } from 'framer-motion';

export default function CodeSentPage() {
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
        {/* Email icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-background-card rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* Title and subtitle */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-text-primary">Code has been sent</h1>
          <p className="text-text-secondary text-lg">You'll shortly receive an email with a code to setup a new password.</p>
        </div>

        {/* Done button */}
        <button
          onClick={() => navigate('/reset-password')}
          className="w-full py-4 bg-accent-primary text-text-inverse rounded-lg font-medium hover:bg-accent-hover transition-colors"
        >
          Done
        </button>
      </motion.div>
    </div>
  );
} 