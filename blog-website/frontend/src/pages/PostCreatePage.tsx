import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api';

function toKebabCase(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function PostCreatePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const post = await createPost({ title, slug, content, published });
      navigate(`/posts/${post.id}`);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to create post');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid">
      <h2 style={{ margin: 0 }}>New Post</h2>
      {error && <div className="error">{error}</div>}

      <form className="card grid" onSubmit={onSubmit}>
        <label>
          <span>Title</span>
          <input
            value={title}
            onChange={(e) => {
              const next = e.target.value;
              setTitle(next);
              if (!slug) setSlug(toKebabCase(next));
            }}
            placeholder="My first post"
            required
          />
        </label>

        <label>
          <span>Slug</span>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="my-first-post" required />
        </label>

        <label>
          <span>Content</span>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
        </label>

        <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} style={{ width: 'auto' }} />
          <span>Published</span>
        </label>

        <div className="row">
          <button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}
