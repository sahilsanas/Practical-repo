export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  rollNumber: string;
  email?: string;
  program: string;
  year: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8081/api';

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

export async function listStudents(): Promise<Student[]> {
  const data = await http<{ students: Student[] }>(`/students`);
  return data.students;
}

export async function createStudent(input: {
  firstName: string;
  lastName: string;
  rollNumber: string;
  email?: string;
  program: string;
  year: number;
  status?: 'active' | 'inactive';
}): Promise<Student> {
  const data = await http<{ student: Student }>(`/students`, {
    method: 'POST',
    body: JSON.stringify(input)
  });
  return data.student;
}

export async function updateStudent(
  id: string,
  input: Partial<Pick<Student, 'firstName' | 'lastName' | 'rollNumber' | 'email' | 'program' | 'year' | 'status'>>
): Promise<Student> {
  const data = await http<{ student: Student }>(`/students/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(input)
  });
  return data.student;
}

export async function deleteStudent(id: string): Promise<void> {
  await http<void>(`/students/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
