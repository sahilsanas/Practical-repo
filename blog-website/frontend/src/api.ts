export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    ...init
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = (data && (data.message as string)) || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data as T;
}

export async function listPosts(params?: { published?: boolean }): Promise<Post[]> {
  const query = params?.published === undefined ? '' : `?published=${params.published}`;
  const data = await http<{ posts: Post[] }>(`/posts${query}`);
  return data.posts;
}

export async function getPostById(id: string): Promise<Post> {
  const data = await http<{ post: Post }>(`/posts/${encodeURIComponent(id)}`);
  return data.post;
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const data = await http<{ post: Post }>(`/posts/slug/${encodeURIComponent(slug)}`);
  return data.post;
}

export async function createPost(input: {
  title: string;
  slug: string;
  content: string;
  published?: boolean;
}): Promise<Post> {
  const data = await http<{ post: Post }>(`/posts`, {
    method: 'POST',
    body: JSON.stringify(input)
  });
  return data.post;
}

export async function updatePost(id: string, input: Partial<Pick<Post, 'title' | 'slug' | 'content' | 'published'>>): Promise<Post> {
  const data = await http<{ post: Post }>(`/posts/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(input)
  });
  return data.post;
}

export async function deletePost(id: string): Promise<void> {
  await http<void>(`/posts/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
