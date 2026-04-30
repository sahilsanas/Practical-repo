import { useEffect, useMemo, useState } from 'react';
import { Student, createStudent, deleteStudent, listStudents, updateStudent } from './api';

type FormState = {
  firstName: string;
  lastName: string;
  rollNumber: string;
  email: string;
  program: string;
  year: string;
  status: 'active' | 'inactive';
};

const emptyForm: FormState = {
  firstName: '',
  lastName: '',
  rollNumber: '',
  email: '',
  program: '',
  year: '1',
  status: 'active'
};

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const editingStudent = useMemo(
    () => (editingId ? students.find((s) => s.id === editingId) ?? null : null),
    [editingId, students]
  );

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await listStudents();
      setStudents(data);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load students');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  }

  function startEdit(s: Student) {
    setEditingId(s.id);
    setForm({
      firstName: s.firstName,
      lastName: s.lastName,
      rollNumber: s.rollNumber,
      email: s.email ?? '',
      program: s.program,
      year: String(s.year),
      status: s.status
    });
    setError(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const yearNumber = Number(form.year);
    if (!Number.isFinite(yearNumber)) {
      setError('Year must be a number');
      return;
    }

    try {
      if (editingId) {
        await updateStudent(editingId, {
          firstName: form.firstName,
          lastName: form.lastName,
          rollNumber: form.rollNumber,
          email: form.email || undefined,
          program: form.program,
          year: yearNumber,
          status: form.status
        });
      } else {
        await createStudent({
          firstName: form.firstName,
          lastName: form.lastName,
          rollNumber: form.rollNumber,
          email: form.email || undefined,
          program: form.program,
          year: yearNumber,
          status: form.status
        });
      }

      await refresh();
      startCreate();
    } catch (e: any) {
      setError(e?.message ?? 'Save failed');
    }
  }

  async function onDelete(id: string) {
    if (!confirm('Delete this student?')) return;
    setError(null);
    try {
      await deleteStudent(id);
      await refresh();
      if (editingId === id) startCreate();
    } catch (e: any) {
      setError(e?.message ?? 'Delete failed');
    }
  }

  return (
    <div className="container">
      <header className="nav">
        <strong>Student Platform</strong>
        <span className="muted">Manage student records</span>
      </header>

      <div className="grid">
        <section className="card">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0 }}>{editingId ? 'Edit Student' : 'Add Student'}</h2>
            {editingId && (
              <button type="button" onClick={startCreate}>
                New
              </button>
            )}
          </div>

          {editingId && editingStudent ? (
            <p className="muted" style={{ marginTop: 6 }}>
              Editing: {editingStudent.firstName} {editingStudent.lastName}
            </p>
          ) : null}

          <form className="grid" onSubmit={onSubmit}>
            <div className="row">
              <label style={{ flex: 1, minWidth: 220 }}>
                First name
                <input
                  value={form.firstName}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  required
                />
              </label>
              <label style={{ flex: 1, minWidth: 220 }}>
                Last name
                <input
                  value={form.lastName}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  required
                />
              </label>
            </div>

            <div className="row">
              <label style={{ flex: 1, minWidth: 220 }}>
                Roll number
                <input
                  value={form.rollNumber}
                  onChange={(e) => setForm((f) => ({ ...f, rollNumber: e.target.value }))}
                  required
                />
              </label>
              <label style={{ flex: 1, minWidth: 220 }}>
                Email (optional)
                <input
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="name@example.com"
                />
              </label>
            </div>

            <div className="row">
              <label style={{ flex: 1, minWidth: 220 }}>
                Program
                <input
                  value={form.program}
                  onChange={(e) => setForm((f) => ({ ...f, program: e.target.value }))}
                  required
                />
              </label>
              <label style={{ width: 140 }}>
                Year
                <input
                  value={form.year}
                  onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                  inputMode="numeric"
                  required
                />
              </label>
              <label style={{ width: 160 }}>
                Status
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as FormState['status'] }))}
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </label>
            </div>

            {error ? <div className="error">{error}</div> : null}

            <div className="row">
              <button type="submit" disabled={loading}>
                {editingId ? 'Update' : 'Add'}
              </button>
              <button type="button" onClick={refresh} disabled={loading}>
                Refresh
              </button>
              {loading ? <span className="muted">Loading…</span> : null}
            </div>
          </form>
        </section>

        <section className="card">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0 }}>Students</h2>
            <span className="muted">{students.length} total</span>
          </div>

          {students.length === 0 ? (
            <p className="muted">No students yet. Add one above.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Roll</th>
                    <th>Program</th>
                    <th>Year</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id}>
                      <td>
                        {s.firstName} {s.lastName}
                        {s.email ? <div className="muted">{s.email}</div> : null}
                      </td>
                      <td>{s.rollNumber}</td>
                      <td>{s.program}</td>
                      <td>{s.year}</td>
                      <td>{s.status}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <button type="button" onClick={() => startEdit(s)}>
                          Edit
                        </button>{' '}
                        <button type="button" onClick={() => onDelete(s.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
