import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

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
          <h1 className="text-4xl font-bold text-text-primary">Forgot password</h1>
          <p className="text-text-secondary text-lg">Select which contact details should we use to reset your password</p>
        </div>

        {/* Contact options */}
        <div className="space-y-4">
          {/* Via email option */}
          <button
            onClick={() => navigate('/forgot-password/email')}
            className="w-full p-4 bg-background-card hover:bg-background-hover text-left rounded-lg transition-colors flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-background-hover rounded-full flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="text-text-primary font-medium">Via email</div>
              <div className="text-text-secondary text-sm">Reset using your email address</div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-secondary ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Via SMS option */}
          <button
            onClick={() => navigate('/forgot-password/sms')}
            className="w-full p-4 bg-background-card hover:bg-background-hover text-left rounded-lg transition-colors flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-background-hover rounded-full flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="text-text-primary font-medium">Via sms</div>
              <div className="text-text-secondary text-sm">Reset using your phone number</div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-secondary ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </motion.div>
    </div>
  );
} 