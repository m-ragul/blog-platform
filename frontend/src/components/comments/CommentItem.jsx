import { FaTrash, FaReply } from 'react-icons/fa';
import { formatRelativeTime } from '../../utils/helpers';
import useAuth from '../../hooks/useAuth';

const CommentItem = ({ comment, onDelete, onReply }) => {
  const { user } = useAuth();
  const isOwner = user?.id === comment.author.id;

  return (
    <div className="mb-6 group/item">
      <div className="flex gap-5">
        {/* Avatar */}
        <div className="flex-shrink-0 pt-1">
          <div className="w-12 h-12 bg-linear-to-br from-electric-violet to-electric-blue text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-electric-violet/20 group-hover/item:scale-110 transition-transform duration-500">
            {comment.author.username.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Comment Content */}
        <div className="flex-1">
          <div className="glass-card !bg-white/5 !rounded-2xl p-6 border-white/5 group-hover/item:border-white/10 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="font-bold text-white tracking-tight">
                  {comment.author.username}
                </span>
                <span className="text-[10px] text-slate-500 ml-3 uppercase tracking-widest font-bold font-mono">
                  {formatRelativeTime(comment.createdAt)}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => onReply(comment)}
                  className="text-electric-blue/70 hover:text-electric-blue text-[11px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors"
                >
                  <FaReply />
                  Reply
                </button>
                {isOwner && (
                  <button
                    onClick={() => onDelete(comment.id)}
                    className="text-rose-500/70 hover:text-rose-400 text-[11px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors"
                  >
                    <FaTrash />
                    Delete
                  </button>
                )}
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed font-medium">{comment.content}</p>
          </div>

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="ml-6 mt-4 space-y-4 border-l-2 border-white/5 pl-8">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onDelete={onDelete}
                  onReply={onReply}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;