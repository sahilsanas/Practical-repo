export type Registration = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  organization?: string;
  createdAt: string;
  updatedAt: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8084/api';

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    ...init
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = (data && (data.message as string)) || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data as T;
}

export async function createRegistration(input: {
  fullName: string;
  email: string;
  phone?: string;
  organization?: string;
}): Promise<Registration> {
  const data = await http<{ registration: Registration }>(`/registrations`, {
    method: 'POST',
    body: JSON.stringify(input)
  });

  return data.registration;
}
