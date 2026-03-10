import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, ShieldAlert, Loader2 } from 'lucide-react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import styles from './loginn.module.css';

export function Login({ onLogin }: { onLogin: (role: string) => void }) {
  const navigate = useNavigate();

  // Role toggle
  const [userType, setUserType] = useState<'citizen' | 'admin'>('citizen');
  const [adminDept, setAdminDept] = useState('electric');

  // Login method
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');

  // Password fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // OTP fields
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  // Loading & error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Signup mode toggle
  const [isSignup, setIsSignup] = useState(false);

  // Helper: navigate after login
  const handlePostLogin = () => {
    onLogin(userType);
    if (userType === 'admin') {
      localStorage.setItem('adminDept', adminDept);
      navigate('/admin');
    } else {
      navigate('/citizen');
    }
  };

  // Handle Email/Password Login or Signup
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      handlePostLogin();
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/user-not-found') {
        setError('No account found with this email. Please sign up first.');
      } else if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Incorrect password. Please try again.');
      } else if (code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please log in instead.');
      } else if (code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err?.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Send OTP via Firebase Phone Auth
  const sendOTP = async () => {
    if (mobile.length !== 10) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      // Setup invisible reCAPTCHA
      const recaptchaContainer = document.getElementById('recaptcha-container');
      if (!recaptchaContainer) {
        setError('reCAPTCHA container not found.');
        setLoading(false);
        return;
      }
      const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainer, {
        size: 'invisible',
      });
      const phoneNumber = `+91${mobile}`;
      const result = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
      setError('');
    } catch (err: any) {
      console.error('OTP send error:', err);
      setError(err?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) {
      setError('Please send OTP first.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await confirmationResult.confirm(otp);
      handlePostLogin();
    } catch (err: any) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Google login via Firebase
  const googleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      handlePostLogin();
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        setError('Google sign-in was cancelled.');
      } else {
        setError(err?.message || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.adminPage}>
      <div className={styles.loginContainer}>
        {/* Logo Header */}
        <div className={styles.logoHeader}>
          <div className={styles.logoIcon}>
            <ShieldCheck style={{ width: 32, height: 32, color: 'white' }} />
          </div>
          <h1 className={styles.logoTitle}>
            GovFinTech <span>Portal</span>
          </h1>
          <p className={styles.logoSubtitle}>Unified Digital E-Governance Platform</p>
        </div>

        {/* Login Box */}
        <div className={styles.loginBox}>
          {/* Citizen / Admin Tabs */}
          <div className={styles.roleTabsContainer}>
            <button
              onClick={() => setUserType('citizen')}
              className={userType === 'citizen' ? styles.roleTabActive : styles.roleTabInactive}
            >
              <User style={{ width: 16, height: 16 }} /> Citizen
            </button>
            <button
              onClick={() => setUserType('admin')}
              className={userType === 'admin' ? styles.roleTabActive : styles.roleTabInactive}
            >
              <ShieldAlert style={{ width: 16, height: 16 }} /> Admin
            </button>
          </div>

          <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>

          {/* Error message */}
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              color: '#dc2626',
              padding: '10px 14px',
              borderRadius: '8px',
              marginBottom: '12px',
              fontSize: '0.9rem',
            }}>
              {error}
            </div>
          )}

          {/* Admin: Department Select */}
          {userType === 'admin' && (
            <div className={styles.inputGroup}>
              <label>Department</label>
              <select
                value={adminDept}
                onChange={(e) => setAdminDept(e.target.value)}
              >
                <option value="water">Water Utility Board</option>
                <option value="electric">Electric Department (HQ)</option>
                <option value="tax">Municipal Property Tax</option>
                <option value="paped">Paped AGS Department</option>
              </select>
            </div>
          )}

          {/* Toggle Buttons */}
          <div style={{ marginBottom: '15px' }}>
            <button
              onClick={() => setLoginMethod('password')}
              className={loginMethod === 'password' ? styles.activeTab : styles.inactiveTab}
            >
              Email/Password
            </button>
            <button
              onClick={() => setLoginMethod('otp')}
              className={loginMethod === 'otp' ? styles.activeTab : styles.inactiveTab}
              style={{ marginLeft: '10px' }}
            >
              OTP Login
            </button>
          </div>

          {/* Email + Password Login/Signup */}
          {loginMethod === 'password' && (
            <form onSubmit={handleEmailAuth}>
              <div className={styles.inputGroup}>
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password (min 6 characters)"
                  required
                  minLength={6}
                />
              </div>

              <div className={styles.options}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsSignup(!isSignup);
                    setError('');
                  }}
                  className={styles.forgotPassword}
                >
                  {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
                </a>
              </div>

              <button type="submit" className={styles.loginButton} disabled={loading}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} />
                    {isSignup ? 'Creating Account...' : 'Logging in...'}
                  </span>
                ) : (
                  isSignup ? 'Sign Up' : 'Login'
                )}
              </button>
            </form>
          )}

          {/* OTP Login */}
          {loginMethod === 'otp' && (
            <form onSubmit={verifyOTP}>
              <div className={styles.inputGroup}>
                <label>Mobile Number</label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  maxLength={10}
                  placeholder="Enter 10-digit Mobile Number"
                  required
                />
              </div>

              <div className={styles.otpGroup}>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  placeholder="Enter OTP"
                  disabled={!otpSent}
                />
                <button
                  type="button"
                  className={styles.sendOtp}
                  onClick={sendOTP}
                  disabled={loading || otpSent}
                >
                  {loading ? 'Sending...' : otpSent ? 'OTP Sent ✅' : 'Send OTP'}
                </button>
              </div>

              <button type="submit" className={styles.loginButton} disabled={loading || !otpSent}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} />
                    Verifying...
                  </span>
                ) : (
                  'Login with OTP'
                )}
              </button>
            </form>
          )}

          {/* Invisible reCAPTCHA container for Phone Auth */}
          <div id="recaptcha-container"></div>

          <div className={styles.divider}><span>OR</span></div>

          {/* Google Login */}
          <button className={styles.googleButton} onClick={googleLogin} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Login with Google
          </button>

        </div>
      </div>
    </div>
  );
}
