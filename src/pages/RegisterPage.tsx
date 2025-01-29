import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FirebaseError } from 'firebase/app';
import { Logo } from '../components/Logo';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

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

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/popup-closed-by-user':
            setError('Sign in cancelled');
            break;
          case 'auth/popup-blocked':
            setError('Popup was blocked. Please allow popups for this site');
            break;
          default:
            setError('Failed to sign in with Google');
        }
      } else {
        setError('Failed to sign in with Google');
      }
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="card w-96 bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col items-center mb-6">
            <Logo width={180} height={60} className="mb-4" />
            <h2 className="card-title text-2xl">Create Account</h2>
          </div>
          
          {error && (
            <div className="alert alert-error mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="btn btn-outline gap-2 mb-6"
            disabled={loading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="divider">OR</div>

          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input 
                type="email" 
                placeholder="your@email.com" 
                className="input input-bordered" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="input input-bordered" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <label className="label">
                <span className="label-text-alt text-neutral">Must be at least 6 characters</span>
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="input input-bordered" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
            </div>

            <div className="form-control mt-6">
              <button 
                type="submit" 
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </div>

            <div className="text-center mt-4">
              <span className="text-sm">Already have an account? </span>
              <Link to="/login" className="text-sm link link-primary">
                Log in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 