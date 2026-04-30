import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Post, listPosts } from '../api';

export default function PostListPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publishedOnly, setPublishedOnly] = useState(true);

  const subtitle = useMemo(() => (publishedOnly ? 'Showing published posts' : 'Showing all posts'), [publishedOnly]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    listPosts({ published: publishedOnly ? true : undefined })
      .then((data) => {
        if (!cancelled) setPosts(data);
      })
      .catch((e: any) => {
        if (!cancelled) setError(e?.message ?? 'Failed to load posts');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [publishedOnly]);

  return (
    <div className="grid">
      <div className="row">
        <h2 style={{ margin: 0 }}>Posts</h2>
        <span className="muted">{subtitle}</span>
        <label style={{ marginLeft: 'auto' }}>
          <span className="muted">Published only</span>
          <input
            type="checkbox"
            checked={publishedOnly}
            onChange={(e) => setPublishedOnly(e.target.checked)}
            style={{ width: 'auto' }}
          />
        </label>
      </div>

      {loading && <div className="muted">Loading…</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && posts.length === 0 && <div className="muted">No posts yet.</div>}

      {posts.map((p) => (
        <div key={p.id} className="card">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{p.title}</div>
              <div className="muted">/{p.slug}</div>
            </div>
            <div className="row">
              <span className="muted">{p.published ? 'Published' : 'Draft'}</span>
              <Link to={`/posts/${p.id}`}>Open</Link>
              <Link to={`/posts/${p.id}/edit`}>Edit</Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
