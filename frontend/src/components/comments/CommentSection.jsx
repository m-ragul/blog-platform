import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import commentService from '../../services/commentService';
import useAuth from '../../hooks/useAuth';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import Spinner from '../common/Spinner';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const data = await commentService.getCommentsByPost(postId);
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (content, parentCommentId = null) => {
    try {
      await commentService.addComment(postId, {
        content,
        parentCommentId,
      });
      toast.success('Comment added successfully!');
      fetchComments();
      setReplyingTo(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add comment');
      throw error;
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await commentService.deleteComment(commentId);
      toast.success('Comment deleted successfully!');
      fetchComments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  const handleReply = (comment) => {
    if (!isAuthenticated) {
      toast.error('Please login to reply');
      return;
    }
    setReplyingTo(comment);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-black text-white mb-10 tracking-tight">
        Dialogue <span className="text-electric-blue">({comments.length})</span>
      </h2>

      {/* Add Comment Form */}
      <div className="mb-12">
        {isAuthenticated ? (
          replyingTo ? (
            <CommentForm
              onSubmit={handleAddComment}
              parentComment={replyingTo}
              onCancel={() => setReplyingTo(null)}
            />
          ) : (
            <CommentForm onSubmit={handleAddComment} />
          )
        ) : (
          <div className="p-6 glass-card border-dashed border-white/10 text-center">
            <p className="text-slate-400 font-medium">Please <Link to="/login" className="text-electric-blue hover:underline">login</Link> to join the conversation.</p>
          </div>
        )}
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-slate-500 italic opacity-50 font-medium font-serif text-lg">
            This space is waiting for its first thought.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onDelete={handleDeleteComment}
              onReply={handleReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;