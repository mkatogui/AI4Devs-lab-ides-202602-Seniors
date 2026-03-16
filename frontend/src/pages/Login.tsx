import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Hero, LoginForm } from '@mkatogui/uds-react';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, from, navigate]);

  const handleSubmit = async (data: { email: string; password: string }) => {
    setApiError(null);
    setLoading(true);
    try {
      await login(data.email.trim(), data.password);
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Invalid email or password');
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
      <main className="App-main" aria-label="Sign in">
        <Container size="sm">
          <div className="Login-form-wrap">
            <LoginForm
          title="Sign in"
          description="Enter your credentials to continue."
          onSubmit={handleSubmit}
          onForgotPassword={() => window.alert('Password reset is not configured. Contact your administrator.')}
          loading={loading}
          error={apiError ?? undefined}
          showRememberMe
          emailLabel="Email"
          passwordLabel="Password"
          submitLabel="Sign in"
          aria-label="Sign in form"
            />
          </div>
        </Container>
      </main>
    </div>
  );
}

export default Login;
