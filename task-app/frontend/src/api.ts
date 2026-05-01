export type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8083/api';

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    ...init
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = (data && (data.message as string)) || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data as T;
}

export async function listTasks(): Promise<Task[]> {
  const data = await http<{ tasks: Task[] }>(`/tasks`);
  return data.tasks;
}

export async function createTask(input: {
  title: string;
  description?: string;
  completed?: boolean;
  dueDate?: string;
}): Promise<Task> {
  const data = await http<{ task: Task }>(`/tasks`, {
    method: 'POST',
    body: JSON.stringify(input)
  });
  return data.task;
}

export async function updateTask(
  id: string,
  input: { title?: string; description?: string; completed?: boolean; dueDate?: string }
): Promise<Task> {
  const data = await http<{ task: Task }>(`/tasks/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      body: JSON.stringify(input)
    }
  );
  return data.task;
}

export async function deleteTask(id: string): Promise<void> {
  await http<void>(`/tasks/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
