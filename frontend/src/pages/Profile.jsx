import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import postService from '../services/postService';
import useAuth from '../hooks/useAuth';
import Spinner from '../components/common/Spinner';
import Button from '../components/common/Button';
import { formatDate } from '../utils/helpers';

const Profile = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
  });

  useEffect(() => {
    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  const fetchUserPosts = async () => {
    try {
      const data = await postService.getPostsByUser(user.id, 0, 50);
      setPosts(data.content);

      // Calculate stats
      const totalLikes = data.content.reduce((sum, post) => sum + post.likesCount, 0);
      const totalComments = data.content.reduce((sum, post) => sum + post.commentsCount, 0);

      setStats({
        totalPosts: data.content.length,
        totalLikes,
        totalComments,
      });
    } catch (error) {
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await postService.deletePost(postId);
      toast.success('Post deleted successfully!');
      fetchUserPosts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Profile Header */}
      <div className="glass-card p-10 mb-12 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-electric-violet opacity-20 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          {/* Avatar */}
          <div className="w-32 h-32 bg-linear-to-br from-electric-violet to-electric-blue text-white rounded-[2.5rem] flex items-center justify-center text-5xl font-black shadow-2xl shadow-electric-violet/30 animate-float">
            {user.username.charAt(0).toUpperCase()}
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl font-black text-white mb-3 tracking-tight">
              {user.username}
            </h1>
            <p className="text-slate-400 font-medium text-lg mb-8">{user.email}</p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center md:justify-start gap-8">
              <div className="glass-card !bg-white/5 !rounded-2xl px-6 py-4 border-white/5 hover:border-white/10 transition-all">
                <p className="text-3xl font-black text-white mb-1">{stats.totalPosts}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Masterpieces</p>
              </div>
              <div className="glass-card !bg-white/5 !rounded-2xl px-6 py-4 border-white/5 hover:border-white/10 transition-all">
                <p className="text-3xl font-black text-rose-500 mb-1">{stats.totalLikes}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Appreciations</p>
              </div>
              <div className="glass-card !bg-white/5 !rounded-2xl px-6 py-4 border-white/5 hover:border-white/10 transition-all">
                <p className="text-3xl font-black text-electric-blue mb-1">{stats.totalComments}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Dialogues</p>
              </div>
            </div>
          </div>

          {/* Create Post Button */}
          <div className="md:self-start pt-2">
            <Link to="/create-post">
              <Button variant="primary" className="!px-8 !py-4 shadow-xl">Start Writing</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="glass-card p-10">
        <h2 className="text-3xl font-black text-white mb-8 tracking-tight">My Archive</h2>

        {posts.length === 0 ? (
          <div className="text-center py-20 glass-card !bg-white/5 border-dashed border-white/10">
            <p className="text-2xl text-slate-400 font-medium mb-6">"The first step to wisdom is silence; the second is listening."</p>
            <Link to="/create-post">
              <Button variant="primary" className="!px-10">Begin Your First Story</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-4">
              <thead>
                <tr className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  <th className="pb-4 px-6">Entry Title</th>
                  <th className="pb-4 px-4 text-center">Status</th>
                  <th className="pb-4 px-4">Classification</th>
                  <th className="pb-4 px-4 text-center">Metrics</th>
                  <th className="pb-4 px-4">Timeline</th>
                  <th className="pb-4 px-6 text-right">Operations</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="group hover:translate-x-1 transition-all duration-300">
                    <td className="py-5 px-6 glass-card !bg-white/5 !rounded-l-2xl border-r-0 border-white/5 group-hover:border-white/10">
                      <Link
                        to={`/post/${post.slug}`}
                        className="text-white hover:text-electric-blue font-bold text-lg transition-colors"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="py-5 px-4 glass-card !bg-white/5 !rounded-none border-x-0 border-white/5 group-hover:border-white/10 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${post.status === 'PUBLISHED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="py-5 px-4 glass-card !bg-white/5 !rounded-none border-x-0 border-white/5 group-hover:border-white/10">
                      <span className="text-slate-400 font-medium">{post.category?.name || '-'}</span>
                    </td>
                    <td className="py-5 px-4 glass-card !bg-white/5 !rounded-none border-x-0 border-white/5 group-hover:border-white/10 text-center">
                      <div className="flex items-center justify-center gap-4">
                        <div className="flex items-center text-rose-400/70 text-xs font-bold">
                          <FaEye className="mr-1.5 opacity-50" /> {post.likesCount}
                        </div>
                        <div className="flex items-center text-electric-blue/70 text-xs font-bold">
                          <FaEye className="mr-1.5 opacity-50" /> {post.commentsCount}
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-4 glass-card !bg-white/5 !rounded-none border-x-0 border-white/5 group-hover:border-white/10">
                      <span className="text-slate-500 text-xs font-mono font-bold uppercase">{formatDate(post.createdAt)}</span>
                    </td>
                    <td className="py-5 px-6 glass-card !bg-white/5 !rounded-r-2xl border-l-0 border-white/5 group-hover:border-white/10 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/post/${post.slug}`}>
                          <button
                            className="w-10 h-10 rounded-xl bg-white/5 text-slate-400 hover:text-electric-blue hover:bg-white/10 flex items-center justify-center transition-all"
                            title="View"
                          >
                            <FaEye />
                          </button>
                        </Link>
                        <Link to={`/edit-post/${post.id}`}>
                          <button
                            className="w-10 h-10 rounded-xl bg-white/5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 flex items-center justify-center transition-all"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="w-10 h-10 rounded-xl bg-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 flex items-center justify-center transition-all"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;