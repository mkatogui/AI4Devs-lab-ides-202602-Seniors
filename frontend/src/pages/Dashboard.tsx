import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  CardTitle,
  CardContent,
  CardFooter,
  Alert,
  DataTable,
  Skeleton,
  Badge,
} from '@mkatogui/uds-react';
import { useAuth } from '../context/AuthContext';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3010';

interface CandidateRow {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  createdAt: string;
  cvFilePath: string | null;
}

function formatDate(s: string): string {
  try {
    return new Date(s).toLocaleDateString(undefined, { dateStyle: 'short' });
  } catch {
    return s;
  }
}

function Dashboard() {
  const { getAuthHeaders } = useAuth();
  const [candidates, setCandidates] = useState<CandidateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/candidates`, { headers: getAuthHeaders() });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'Could not load candidates');
        }
        const json = await res.json();
        if (!cancelled && Array.isArray(json.data)) setCandidates(json.data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load candidates');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [getAuthHeaders]);

  const tableData: Record<string, unknown>[] = candidates.map((c) => ({
    id: c.id,
    name: [c.firstName, c.lastName].filter(Boolean).join(' ') || '—',
    email: c.email || '—',
    phone: c.phone || '—',
    added: formatDate(c.createdAt),
    cv: c.cvFilePath,
  }));

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'added', header: 'Added' },
    {
      key: 'cv',
      header: 'CV',
      render: (value: unknown) =>
        value ? <Badge variant="status" size="sm">Yes</Badge> : <span aria-hidden>—</span>,
    },
  ];

  return (
    <div className="Dashboard">
      <main className="App-main">
        <Card variant="icon-top">
          <CardTitle>Recruiter dashboard</CardTitle>
          <CardContent>
            <p>Add new candidates to the ATS, manage their data, and track selection processes.</p>
          </CardContent>
          <CardFooter>
            <Link to="/candidates/new" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="md" type="button" aria-label="Add a new candidate to the system">
                Add candidate
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card variant="icon-top" className="Dashboard-list-card">
          <CardTitle>Added talent</CardTitle>
          <CardContent>
            {error && (
              <Alert variant="error" message={error} className="Dashboard-list-alert" role="alert" />
            )}
            {!error && (
              loading ? (
                <Skeleton variant="table" lines={5} size="md" />
              ) : (
                <DataTable
                  columns={columns}
                  data={tableData}
                  emptyMessage="No candidates yet. Add your first candidate above."
                  density="default"
                />
              )
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default Dashboard;
