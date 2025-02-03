import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { motion } from 'framer-motion';

export default function VerifyCodePage() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      
      // Here you would verify the code with Firebase
      // For now, we'll just navigate to the reset password page
      // The actual verification will be done on the reset password page
      navigate(`/forgot-password/reset?oobCode=${code}`);
    } catch (err) {
      setLoading(false);
      setError('Invalid verification code');
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
        {/* Title and subtitle */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-text-primary">Enter Code</h1>
          <p className="text-text-secondary text-lg">Please enter the verification code sent to your email</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-status-error/10 border border-status-error/20 rounded-lg text-status-error"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Code input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Enter verification code"
              className="w-full pl-12 pr-4 py-4 bg-background-card text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary tracking-wider font-mono"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              aria-label="Verification code"
              autoComplete="one-time-code"
              maxLength={6}
            />
          </div>

          {/* Verify button */}
          <motion.button
            type="submit"
            className="w-full py-4 bg-accent-primary text-text-inverse rounded-lg font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
            disabled={loading}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </div>
            ) : (
              'Verify Code'
            )}
          </motion.button>

          {/* Resend code */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/forgot-password/email')}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Didn't receive a code? Send again
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 