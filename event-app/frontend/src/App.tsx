import { useState } from 'react';
import { createRegistration, Registration } from './api';

export default function App() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<Registration | null>(null);

  async function submit() {
    setError(null);
    setSuccess(null);

    const nameTrimmed = fullName.trim();
    const emailTrimmed = email.trim();

    if (!nameTrimmed) {
      setError('Full name is required');
      return;
    }

    if (!emailTrimmed) {
      setError('Email is required');
      return;
    }

    setLoading(true);
    try {
      const created = await createRegistration({
        fullName: nameTrimmed,
        email: emailTrimmed,
        phone: phone.trim() || undefined,
        organization: organization.trim() || undefined
      });
      setSuccess(created);
      setFullName('');
      setEmail('');
      setPhone('');
      setOrganization('');
    } catch (e: any) {
      setError(e?.message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <header className="nav">
        <strong>Event Registration</strong>
        <span className="muted">Submit your details to register</span>
      </header>

      {error ? (
        <div className="card error" style={{ marginBottom: 12 }}>
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="card" style={{ marginBottom: 12 }}>
          <strong>Registered successfully</strong>
          <div className="muted" style={{ marginTop: 6 }}>
            Registration ID: {success.id}
          </div>
        </div>
      ) : null}

      <section className="card">
        <div className="grid">
          <label>
            <span>Full name</span>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g., Priya Sharma"
              disabled={loading}
            />
          </label>

          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., priya@example.com"
              disabled={loading}
            />
          </label>

          <label>
            <span>Phone (optional)</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g., +91 98765 43210"
              disabled={loading}
            />
          </label>

          <label>
            <span>Organization (optional)</span>
            <input
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="e.g., ABC College"
              disabled={loading}
            />
          </label>

          <button type="button" onClick={submit} disabled={loading}>
            {loading ? 'Submitting…' : 'Register'}
          </button>
        </div>
      </section>
    </div>
  );
}
