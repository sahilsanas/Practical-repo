import { Link, Route, Routes } from 'react-router-dom';
import PostCreatePage from './pages/PostCreatePage';
import PostEditPage from './pages/PostEditPage';
import PostListPage from './pages/PostListPage';
import PostViewPage from './pages/PostViewPage';

export default function App() {
  return (
    <div className="container">
      <header className="nav">
        <strong>Blog Website</strong>
        <Link to="/">Posts</Link>
        <Link to="/new">New Post</Link>
      </header>

      <Routes>
        <Route path="/" element={<PostListPage />} />
        <Route path="/new" element={<PostCreatePage />} />
        <Route path="/posts/:id" element={<PostViewPage />} />
        <Route path="/posts/:id/edit" element={<PostEditPage />} />
      </Routes>
    </div>
  );
}
