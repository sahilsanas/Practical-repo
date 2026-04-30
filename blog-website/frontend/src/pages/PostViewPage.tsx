import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Post, deletePost, getPostById } from '../api';

export default function PostViewPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    getPostById(id)
      .then((p) => {
        if (!cancelled) setPost(p);
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

  async function onDelete() {
    if (!id) return;
    const ok = confirm('Delete this post?');
    if (!ok) return;

    setDeleting(true);
    try {
      await deletePost(id);
      window.location.href = '/';
    } catch (e: any) {
      setError(e?.message ?? 'Failed to delete post');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <div className="muted">Loading…</div>;
  if (error) return <div className="error">{error}</div>;
  if (!post) return <div className="muted">Post not found.</div>;

  return (
    <div className="grid">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>{post.title}</h2>
        <div className="row">
          <Link to={`/posts/${post.id}/edit`}>Edit</Link>
          <button onClick={onDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>

      <div className="muted">Slug: /{post.slug} • {post.published ? 'Published' : 'Draft'}</div>

      <article className="card">
        <div style={{ whiteSpace: 'pre-wrap' }}>{post.content}</div>
      </article>

      <div>
        <Link to="/">Back</Link>
      </div>
    </div>
  );
}
