import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Button } from '@mkatogui/uds-react';
import { useAuth } from '../context/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * Shared layout using UDS Navbar. Provides consistent chrome and navigation.
 * data-theme is set in index.html (corporate palette for recruiter ATS).
 */
function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const isAddCandidate = location.pathname === '/candidates/new';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="App">
      <Navbar
        variant="standard"
        sticky
        logo={
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 600 }}>
            LTI
          </Link>
        }
        ctaButton={
          !isAddCandidate ? (
            <Link to="/candidates/new" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="md">
                Add candidate
              </Button>
            </Link>
          ) : undefined
        }
      >
        <Link to="/" className={`App-nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          Dashboard
        </Link>
        <Link to="/candidates/new" className={`App-nav-link ${isAddCandidate ? 'active' : ''}`}>
          Add candidate
        </Link>
        <button type="button" onClick={handleLogout} className="App-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}>
          Log out {user?.email ? `(${user.email})` : ''}
        </button>
      </Navbar>
      {children}
    </div>
  );
}

export default AppLayout;
