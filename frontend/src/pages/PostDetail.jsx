import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaHeart, FaRegHeart, FaCalendar, FaUser, FaEdit, FaTrash } from 'react-icons/fa';
import postService from '../services/postService';
import likeService from '../services/likeService';
import useAuth from '../hooks/useAuth';
import CommentSection from '../components/comments/CommentSection';
import Spinner from '../components/common/Spinner';
import Button from '../components/common/Button';
import { formatDate } from '../utils/helpers';

const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeStatus, setLikeStatus] = useState({ liked: false, likesCount: 0 });
  const [likingPost, setLikingPost] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (post && isAuthenticated) {
      fetchLikeStatus();
    }
  }, [post, isAuthenticated]);

  const fetchPost = async () => {
    try {
      const data = await postService.getPostBySlug(slug);
      setPost(data);
    } catch (error) {
      toast.error('Post not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchLikeStatus = async () => {
    try {
      const data = await likeService.getLikeStatus(post.id);
      setLikeStatus(data);
    } catch (error) {
      console.error('Failed to fetch like status:', error);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like posts');
      return;
    }

    setLikingPost(true);
    try {
      const data = await likeService.toggleLike(post.id);
      setLikeStatus(data);
    } catch (error) {
      toast.error('Failed to like post');
    } finally {
      setLikingPost(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await postService.deletePost(post.id);
      toast.success('Post deleted successfully!');
      navigate('/');
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

  if (!post) return null;

  const isOwner = user?.id === post.author.id;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <article className="glass-card overflow-hidden">
        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative h-96 w-full overflow-hidden">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-midnight to-transparent opacity-60"></div>
          </div>
        )}

        <div className="p-10">
          {/* Category */}
          {post.category && (
            <span className="inline-block px-4 py-1 rounded-lg bg-electric-violet/10 text-electric-violet text-xs font-black uppercase tracking-widest mb-6 border border-electric-violet/20">
              {post.category.name}
            </span>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tightest">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center justify-between mb-10 pb-10 border-b border-white/5">
            <div className="flex items-center space-x-6 text-sm font-medium text-slate-400">
              <div className="flex items-center group">
                <div className="w-10 h-10 bg-linear-to-br from-electric-violet to-electric-blue rounded-xl flex items-center justify-center text-white font-bold mr-3 shadow-lg shadow-electric-violet/20">
                  {post.author.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-bold">{post.author.username}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">{formatDate(post.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Edit/Delete Buttons */}
            {isOwner && (
              <div className="flex gap-3">
                <Button
                  onClick={() => navigate(`/edit-post/${post.id}`)}
                  variant="secondary"
                  className="!px-4 !py-2 !text-xs"
                >
                  <FaEdit className="mr-2 text-electric-blue" />
                  Edit
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="danger"
                  className="!px-4 !py-2 !text-xs"
                >
                  <FaTrash className="mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>

          {/* Content */}
          <div
            className="prose prose-invert prose-lg max-w-none mb-10"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-10">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs font-bold text-slate-500 bg-white/5 px-3 py-1 rounded-lg border border-white/5 uppercase tracking-wide hover:text-white hover:border-white/20 transition-all cursor-default"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Like Button */}
          <div className="flex items-center gap-4 pt-10 border-t border-white/5">
            <button
              onClick={handleLike}
              disabled={likingPost || !isAuthenticated}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black tracking-widest uppercase text-xs transition-all duration-300 ${likeStatus.liked
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 active:scale-95'
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white active:scale-95'
                } ${!isAuthenticated && 'opacity-30 cursor-not-allowed grayscale'}`}
            >
              {likeStatus.liked ? <FaHeart className="text-white animate-pulse" /> : <FaRegHeart />}
              <span>{likeStatus.likesCount} Contributions</span>
            </button>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <div className="glass-card p-10 mt-10">
        <CommentSection postId={post.id} />
      </div>
    </div>
  );
};

export default PostDetail;