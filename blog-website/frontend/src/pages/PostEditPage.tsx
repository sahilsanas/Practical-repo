import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Post, getPostById, updatePost } from '../api';

export default function PostEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    getPostById(id)
      .then((p) => {
        if (cancelled) return;
        setPost(p);
        setTitle(p.title);
        setSlug(p.slug);
        setContent(p.content);
        setPublished(p.published);
      })
      .catch((e: any) => {
        if (!cancelled) setError(e?.message ?? 'Failed to load post');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    setError(null);

    try {
      const updated = await updatePost(id, { title, slug, content, published });
      navigate(`/posts/${updated.id}`);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to update post');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="muted">Loading…</div>;
  if (error) return <div className="error">{error}</div>;
  if (!post) return <div className="muted">Post not found.</div>;

  return (
    <div className="grid">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>Edit Post</h2>
        <Link to={`/posts/${post.id}`}>Cancel</Link>
      </div>

      <form className="card grid" onSubmit={onSubmit}>
        <label>
          <span>Title</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>

        <label>
          <span>Slug</span>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} required />
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
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
