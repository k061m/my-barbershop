import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { Logo } from '../components/common/Logo';
import { motion } from 'framer-motion';

export default function ForgotPasswordViaSmsPage() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      // Here you would implement SMS verification
      // For now, we'll just navigate to the code sent page
      navigate('/forgot-password/code-sent');
    } catch (err) {
      setLoading(false);
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/invalid-phone-number':
            setError('Invalid phone number');
            break;
          default:
            setError('Failed to send verification code');
        }
      } else {
        setError('Failed to send verification code');
      }
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const number = value.replace(/\D/g, '');
    
    // Format the number as (XXX) XXX-XXXX
    if (number.length <= 3) return number;
    if (number.length <= 6) return `(${number.slice(0, 3)}) ${number.slice(3)}`;
    return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
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
          <h1 className="text-4xl font-bold text-text-primary">Forgot password</h1>
          <p className="text-text-secondary text-lg">Please enter your phone number to reset your password</p>
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
          {/* Phone input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              type="tel"
              placeholder="(555) 555-5555"
              className="w-full pl-12 pr-4 py-4 bg-background-card text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
              value={phoneNumber}
              onChange={handlePhoneChange}
              pattern="\(\d{3}\) \d{3}-\d{4}"
              maxLength={14}
              required
              aria-label="Phone number"
            />
          </div>

          {/* Send code button */}
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
                Sending code...
              </div>
            ) : (
              'Send code'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
} 