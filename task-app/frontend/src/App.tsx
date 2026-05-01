import { useEffect, useMemo, useState } from 'react';
import { createTask, deleteTask, listTasks, Task, updateTask } from './api';

function toDateInputValue(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(
    () => (selectedId ? tasks.find((t) => t.id === selectedId) ?? null : null),
    [selectedId, tasks]
  );

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [completed, setCompleted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setSelectedId(null);
    setTitle('');
    setDescription('');
    setDueDate('');
    setCompleted(false);
  }

  function loadIntoForm(t: Task) {
    setSelectedId(t.id);
    setTitle(t.title);
    setDescription(t.description ?? '');
    setDueDate(toDateInputValue(t.dueDate));
    setCompleted(Boolean(t.completed));
  }

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await listTasks();
      setTasks(data);

      // keep selection valid
      setSelectedId((prev) => {
        if (!prev) return prev;
        return data.some((t) => t.id === prev) ? prev : null;
      });
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (!selected) return;
    // If selected task changes due to refresh, re-hydrate form
    loadIntoForm(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id, selected?.updatedAt]);

  async function submit() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (selectedId) {
        await updateTask(selectedId, {
          title: trimmedTitle,
          description: description.trim() || undefined,
          completed,
          dueDate: dueDate.trim() || undefined
        });
      } else {
        await createTask({
          title: trimmedTitle,
          description: description.trim() || undefined,
          completed,
          dueDate: dueDate.trim() || undefined
        });
      }
      await refresh();
      resetForm();
    } catch (e: any) {
      setError(e?.message ?? 'Save failed');
    } finally {
      setLoading(false);
    }
  }

  async function toggleCompleted(t: Task) {
    setLoading(true);
    setError(null);
    try {
      await updateTask(t.id, { completed: !t.completed });
      await refresh();
    } catch (e: any) {
      setError(e?.message ?? 'Update failed');
    } finally {
      setLoading(false);
    }
  }

  async function removeSelected() {
    if (!selectedId) return;
    setLoading(true);
    setError(null);
    try {
      await deleteTask(selectedId);
      await refresh();
      resetForm();
    } catch (e: any) {
      setError(e?.message ?? 'Delete failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <header className="nav">
        <strong>Task Management</strong>
        <span className="muted">Create, update, and delete tasks</span>
      </header>

      {error ? (
        <div className="card error" style={{ marginBottom: 12 }}>
          {error}
        </div>
      ) : null}

      <div className="cols">
        <section className="card">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0 }}>Tasks</h2>
            <div className="row">
              <button type="button" onClick={refresh} disabled={loading}>
                Refresh
              </button>
              <button type="button" onClick={resetForm} disabled={loading}>
                New Task
              </button>
            </div>
          </div>

          {tasks.length === 0 ? (
            <p className="muted" style={{ marginTop: 10 }}>
              No tasks yet. Create one on the right.
            </p>
          ) : (
            <div style={{ overflowX: 'auto', marginTop: 10 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: 90 }}>Done</th>
                    <th>Title</th>
                    <th style={{ width: 140 }}>Due</th>
                    <th style={{ width: 120 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={t.completed}
                          onChange={() => toggleCompleted(t)}
                          disabled={loading}
                          aria-label={`Mark ${t.title} as ${t.completed ? 'incomplete' : 'complete'}`}
                        />
                      </td>
                      <td>
                        <strong>{t.title}</strong>
                        {t.description ? <div className="muted">{t.description}</div> : null}
                        {selectedId === t.id ? (
                          <div style={{ marginTop: 6 }}>
                            <span className="badge">Selected</span>
                          </div>
                        ) : null}
                      </td>
                      <td>{t.dueDate ? toDateInputValue(t.dueDate) : <span className="muted">—</span>}</td>
                      <td>
                        <button type="button" onClick={() => loadIntoForm(t)} disabled={loading}>
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="card">
          <h2 style={{ margin: 0 }}>{selectedId ? 'Edit Task' : 'Create Task'}</h2>

          <div className="grid" style={{ marginTop: 10 }}>
            <label>
              <span>Title</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Finish report" />
            </label>

            <label>
              <span>Description (optional)</span>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Notes…"
              />
            </label>

            <label>
              <span>Due date (optional)</span>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </label>

            <label>
              <span>Completed</span>
              <input type="checkbox" checked={completed} onChange={(e) => setCompleted(e.target.checked)} />
            </label>

            <div className="row" style={{ justifyContent: 'space-between' }}>
              <button type="button" onClick={submit} disabled={loading}>
                {selectedId ? 'Update' : 'Create'}
              </button>

              {selectedId ? (
                <button type="button" onClick={removeSelected} disabled={loading}>
                  Delete
                </button>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
