import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Breadcrumb,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Container,
  Form,
  FormSection,
  Grid,
  Input,
  Alert,
  FileUpload,
} from '@mkatogui/uds-react';
import { useAuth } from '../context/AuthContext';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3010';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_CV_SIZE = 10 * 1024 * 1024; // 10MB

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  cv?: string;
}

function AddCandidate() {
  const navigate = useNavigate();
  const { getAuthHeaders } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /** Single-field validation (UDS Forms: inline errors, validate on blur). */
  function getFieldError(field: keyof FormErrors, value: string | null, file?: File | null): string | undefined {
    switch (field) {
      case 'firstName':
        return !value?.trim() ? 'First name is required' : undefined;
      case 'lastName':
        return !value?.trim() ? 'Last name is required' : undefined;
      case 'email':
        if (!value?.trim()) return 'Email is required';
        return !EMAIL_REGEX.test(value.trim()) ? 'Enter a valid email address' : undefined;
      case 'cv':
        return file && file.size > MAX_CV_SIZE ? 'CV must be 10MB or smaller' : undefined;
      default:
        return undefined;
    }
  }

  function validate(): boolean {
    const next: FormErrors = {};
    const fn = getFieldError('firstName', firstName); if (fn) next.firstName = fn;
    const ln = getFieldError('lastName', lastName); if (ln) next.lastName = ln;
    const em = getFieldError('email', email); if (em) next.email = em;
    const cv = getFieldError('cv', null, cvFile); if (cv) next.cv = cv;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  /** Validate field on blur (UDS Pattern: Forms — "shown on blur, not keystroke"). */
  function handleBlur(field: keyof FormErrors) {
    return () => {
      let message: string | undefined;
      if (field === 'firstName') message = getFieldError('firstName', firstName);
      else if (field === 'lastName') message = getFieldError('lastName', lastName);
      else if (field === 'email') message = getFieldError('email', email);
      else if (field === 'cv') message = getFieldError('cv', null, cvFile);
      setErrors((prev) => ({ ...prev, [field]: message }));
    };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    if (!validate()) return;

    setLoading(true);

    const submit = async () => {
      try {
        if (cvFile) {
          const formData = new FormData();
          formData.append('firstName', firstName.trim());
          formData.append('lastName', lastName.trim());
          formData.append('email', email.trim());
          if (phone.trim()) formData.append('phone', phone.trim());
          if (address.trim()) formData.append('address', address.trim());
          if (education.trim()) formData.append('education', education.trim());
          if (experience.trim()) formData.append('experience', experience.trim());
          formData.append('cv', cvFile);

          const res = await fetch(`${API_BASE}/candidates`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: formData,
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || data.message || `Request failed (${res.status})`);
          }
        } else {
          const body: Record<string, unknown> = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
          };
          if (phone.trim()) body.phone = phone.trim();
          if (address.trim()) body.address = address.trim();
          if (education.trim()) body.education = education.trim();
          if (experience.trim()) body.experience = experience.trim();

          const res = await fetch(`${API_BASE}/candidates`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(body),
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || data.message || `Request failed (${res.status})`);
          }
        }
        setSuccessMessage('Candidate added successfully.');
        setTimeout(() => navigate('/'), 1500);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Connection error. Please try again.';
        setErrorMessage(message);
      } finally {
        setLoading(false);
      }
    };

    submit();
  }

  return (
    <div className="AddCandidate">
      <main className="App-main" aria-label="Add candidate">
        <Container size="lg">
          <Breadcrumb
            items={[
              { label: 'Dashboard', href: '/' },
              { label: 'Add candidate' },
            ]}
            className="App-breadcrumb"
          />
          <Card variant="icon-top" size="md">
          <CardHeader>
            <CardTitle>New candidate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="Card-intro AddCandidate-intro">
              Add a new candidate to the ATS. Fill in the required fields below; all others are optional.
            </p>
            <Form onSubmit={handleSubmit} noValidate aria-label="Add candidate form">
              {successMessage && (
                <Alert variant="success" message={successMessage} className="form-alert" />
              )}
              {errorMessage && (
                <Alert variant="error" message={errorMessage} className="form-alert" />
              )}

              <FormSection
                title="Name and contact"
                description="Required fields are marked with an asterisk."
              >
                <Grid columns={2} gap="md">
                  <Input
                    id="firstName"
                    label="First name"
                    size="md"
                    required
                    placeholder="e.g. María"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onBlur={handleBlur('firstName')}
                    errorText={errors.firstName}
                    disabled={loading}
                    autoComplete="given-name"
                  />
                  <Input
                    id="lastName"
                    label="Last name"
                    size="md"
                    required
                    placeholder="e.g. García"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onBlur={handleBlur('lastName')}
                    errorText={errors.lastName}
                    disabled={loading}
                    autoComplete="family-name"
                  />
                </Grid>
                <div className="form-field form-field--narrow">
                  <Input
                    id="email"
                    label="Email address"
                    type="email"
                    size="md"
                    required
                    placeholder="maria@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleBlur('email')}
                    errorText={errors.email}
                    helperText="We'll use this to contact the candidate."
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
              </FormSection>

              <FormSection
                title="Additional information"
                description="Phone, address, education, and experience are optional."
              >
                <Input
                  id="phone"
                  label="Phone"
                  helperText="Optional"
                  type="text"
                  size="md"
                  placeholder="+34 600 000 000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                  autoComplete="tel"
                  inputMode="tel"
                />
                <Input
                  id="address"
                  label="Address"
                  helperText="Optional"
                  size="md"
                  placeholder="City, country"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={loading}
                  autoComplete="street-address"
                />
                <Input
                  id="education"
                  label="Education"
                  helperText="Optional"
                  multiline
                  size="md"
                  placeholder="Degrees, institutions, years"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  disabled={loading}
                />
                <Input
                  id="experience"
                  label="Work experience"
                  helperText="Optional"
                  multiline
                  size="md"
                  placeholder="Previous roles and key achievements"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  disabled={loading}
                />
              </FormSection>

              <FormSection
                title="Resume"
                description="Upload a CV in PDF or DOCX format (max 10MB)."
              >
                <div className="form-field form-field--file">
                  <label htmlFor="cv-upload" className="form-label">
                    CV file
                  </label>
                  <p className="form-helper form-helper--above-upload">
                    Drag and drop here or click to browse.
                  </p>
                  <FileUpload
                    id="cv-upload"
                    variant="dropzone"
                    size="md"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    maxSize={MAX_CV_SIZE}
                    maxFiles={1}
                    multiple={false}
                    label="CV upload (optional)"
                    placeholderTitle="Drop files here or click to browse"
                    placeholderDescription="PDF or DOCX, up to 10MB"
                    onUpload={(files) => setCvFile(files[0] ?? null)}
                    onRemove={() => setCvFile(null)}
                    disabled={loading}
                  />
                  {errors.cv && (
                    <span className="form-error" role="alert">
                      {errors.cv}
                    </span>
                  )}
                </div>
              </FormSection>

              <CardFooter className="form-footer">
                <Button type="submit" variant="primary" size="md" disabled={loading} aria-busy={loading}>
                  {loading ? 'Saving...' : 'Save candidate'}
                </Button>
                <Link to="/" className="App-link-button">
                  <Button type="button" variant="secondary" size="md" disabled={loading}>
                    Back to dashboard
                  </Button>
                </Link>
              </CardFooter>
            </Form>
          </CardContent>
        </Card>
        </Container>
      </main>
    </div>
  );
}

export default AddCandidate;
