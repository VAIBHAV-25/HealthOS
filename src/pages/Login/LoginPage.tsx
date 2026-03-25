import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Mail, Lock, Eye, EyeOff, AlertCircle, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

type AuthMode = 'login' | 'signup';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, signup, loading, error, clearError } = useAuthStore();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('demo@healthos.com');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [validationError, setValidationError] = useState('');

  const switchMode = (m: AuthMode) => {
    setMode(m);
    clearError();
    setValidationError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
  };

  const validate = () => {
    if (!email) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email.';
    if (!password) return 'Password is required.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (mode === 'signup') {
      if (!displayName.trim()) return 'Full name is required.';
      if (password !== confirmPassword) return 'Passwords do not match.';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const err = validate();
    if (err) { setValidationError(err); return; }
    setValidationError('');

    if (mode === 'login') {
      await login(email, password);
    } else {
      await signup(email, password, displayName.trim());
    }

    if (!useAuthStore.getState().error) navigate('/');
  };

  const displayError = validationError || error;

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-blob blob1" />
        <div className="login-blob blob2" />
        <div className="login-blob blob3" />
      </div>

      <div className="login-container">
        <div className="login-card">
          {/* Brand */}
          <div className="login-header">
            <div className="login-brand">
              <div className="login-icon"><Heart size={28} /></div>
              <div>
                <h1 className="login-title">HealthOS</h1>
                <p className="login-tagline">B2B Healthcare Platform</p>
              </div>
            </div>

            {/* Mode tabs */}
            <div className="auth-tabs">
              <button
                className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                onClick={() => switchMode('login')}
                type="button"
              >
                Sign In
              </button>
              <button
                className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
                onClick={() => switchMode('signup')}
                type="button"
              >
                Create Account
              </button>
            </div>

            <h2 className="login-heading">
              {mode === 'login' ? 'Welcome back' : 'Join HealthOS'}
            </h2>
            <p className="login-subheading">
              {mode === 'login'
                ? 'Sign in to your clinical dashboard'
                : 'Create your account to get started'}
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {/* Full name – signup only */}
            {mode === 'signup' && (
              <div className="form-group">
                <label className="form-label" htmlFor="displayName">Full Name</label>
                <div className="input-wrapper">
                  <User size={16} className="input-icon" />
                  <input
                    id="displayName"
                    type="text"
                    className={`form-input ${displayError ? 'input-error' : ''}`}
                    placeholder="Dr. Jane Smith"
                    value={displayName}
                    onChange={(e) => { setDisplayName(e.target.value); setValidationError(''); clearError(); }}
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail size={16} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  className={`form-input ${displayError ? 'input-error' : ''}`}
                  placeholder="doctor@hospital.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setValidationError(''); clearError(); }}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock size={16} className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input ${displayError ? 'input-error' : ''}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setValidationError(''); clearError(); }}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm password – signup only */}
            {mode === 'signup' && (
              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <Lock size={16} className="input-icon" />
                  <input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    className={`form-input ${displayError ? 'input-error' : ''}`}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setValidationError(''); clearError(); }}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirm((s) => !s)}
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {/* Error */}
            {displayError && (
              <div className="error-banner" role="alert">
                <AlertCircle size={16} />
                <span>{displayError}</span>
              </div>
            )}

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
              id="login-submit"
            >
              {loading
                ? <span className="btn-spinner" />
                : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Switch mode link */}
          <p className="auth-switch">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              className="auth-switch-btn"
              onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
              type="button"
            >
              {mode === 'login' ? 'Create one' : 'Sign in'}
            </button>
          </p>

          {/* Demo hint – login only */}
          {mode === 'login' && (
            <div className="demo-hint">
              <p>Demo credentials pre-filled ↑</p>
              <code>demo@healthos.com / password123</code>
            </div>
          )}
        </div>

        {/* Illustration panel */}
        <div className="login-illustration">
          <div className="stats-preview">
            <div className="stat-chip"><span className="chip-dot critical" />3 Critical Patients</div>
            <div className="stat-chip"><span className="chip-dot stable" />18 Stable</div>
            <div className="stat-chip"><span className="chip-dot info" />47 Appointments Today</div>
          </div>
          <h2 className="illustration-heading">
            Clinical Intelligence<br />at Your Fingertips
          </h2>
          <p className="illustration-sub">
            Manage patients, track analytics, and stay informed — all in one unified platform.
          </p>
          <div className="feature-list">
            {[
              'Real-time patient monitoring',
              'Advanced analytics dashboard',
              'Smart notification system',
              'Multi-department management',
            ].map((f) => (
              <div key={f} className="feature-item">
                <span className="feature-check">✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
