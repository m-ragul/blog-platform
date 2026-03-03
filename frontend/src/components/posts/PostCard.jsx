import { Link } from 'react-router-dom';
import { FaHeart, FaComment, FaCalendar, FaUser } from 'react-icons/fa';
import { formatRelativeTime, truncateText } from '../../utils/helpers';

const PostCard = ({ post }) => {
  return (
    <div className="glass-card group overflow-hidden">
      {/* Featured Image */}
      {post.featuredImage && (
        <Link to={`/post/${post.slug}`} className="block relative overflow-hidden h-52">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-t from-midnight/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
        </Link>
      )}

      <div className="p-6">
        {/* Category */}
        {post.category && (
          <span className="inline-block px-3 py-1 rounded-lg bg-electric-violet/10 text-electric-violet text-[10px] font-black uppercase tracking-[0.1em] mb-4 border border-electric-violet/20">
            {post.category.name}
          </span>
        )}

        {/* Title */}
        <Link to={`/post/${post.slug}`}>
          <h2 className="text-xl font-bold text-white mb-3 group-hover:text-electric-blue transition-colors duration-300 leading-tight">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">
          {post.excerpt || truncateText(post.content?.replace(/<[^>]*>/g, ''), 150)}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded-md border border-white/5 uppercase tracking-wide"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-5 border-t border-white/5">
          {/* Author & Date */}
          <div className="flex items-center space-x-4 text-[11px] font-medium text-slate-500">
            <div className="flex items-center group/author">
              <FaUser className="mr-2 text-electric-blue/60 group-hover/author:text-electric-blue transition-colors" />
              <span className="group-hover/author:text-slate-300 transition-colors">{post.author?.username}</span>
            </div>
            <div className="flex items-center">
              <FaCalendar className="mr-2 text-slate-600" />
              <span>{formatRelativeTime(post.createdAt)}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-4 text-[11px] font-bold">
            <div className="flex items-center text-rose-400/80 bg-rose-500/5 px-2 py-1 rounded-lg border border-rose-500/10">
              <FaHeart className="mr-1.5" />
              <span>{post.likesCount || 0}</span>
            </div>
            <div className="flex items-center text-electric-blue/80 bg-electric-blue/5 px-2 py-1 rounded-lg border border-electric-blue/10">
              <FaComment className="mr-1.5" />
              <span>{post.commentsCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;