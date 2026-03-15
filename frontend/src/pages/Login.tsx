import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Hero,
  Button,
  Card,
  CardTitle,
  CardContent,
  CardFooter,
  Input,
  Alert,
} from '@mkatogui/uds-react';
import { useAuth } from '../context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, from, navigate]);

  const getEmailError = useCallback((value: string): string | null => {
    if (!value.trim()) return 'Email is required';
    if (!EMAIL_REGEX.test(value.trim())) return 'Please enter a valid email address';
    return null;
  }, []);

  const getPasswordError = useCallback((value: string): string | null => {
    if (!value) return 'Password is required';
    return null;
  }, []);

  const handleBlurEmail = () => setEmailError(getEmailError(email));
  const handleBlurPassword = () => setPasswordError(getPasswordError(password));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    const eErr = getEmailError(email);
    const pErr = getPasswordError(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    if (eErr || pErr) return;

    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Login Login--uds">
      <Hero
        variant="centered"
        size="compact"
        headline="LTI — Talent Tracking System"
        subheadline="Sign in to access the recruiter dashboard."
        className="Login-hero"
      />
      <main className="Login-main">
        <Card variant="icon-top" size="lg" className="Login-card">
          <CardTitle className="Login-cardTitle">Sign in</CardTitle>
          <CardContent>
            <form onSubmit={handleSubmit} noValidate aria-label="Sign in form" className="Login-form">
              {apiError && (
                <Alert variant="error" message={apiError} className="Login-alert" role="alert" />
              )}
              <div className="uds-input-group Login-field" style={{ maxWidth: '360px' }}>
                <Input
                  id="login-email"
                  label="Email address"
                  variant="email"
                  size="md"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleBlurEmail}
                  errorText={emailError ?? undefined}
                  helperText="We will never share your email."
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
              <div className="uds-input-group Login-field" style={{ maxWidth: '360px' }}>
                <Input
                  id="login-password"
                  label="Password"
                  variant="password"
                  size="md"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handleBlurPassword}
                  errorText={passwordError ?? undefined}
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>
              <CardFooter className="Login-footer">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default Login;
