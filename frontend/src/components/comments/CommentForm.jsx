import { useState } from 'react';
import Button from '../common/Button';

const CommentForm = ({ onSubmit, parentComment = null, onCancel = null }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      await onSubmit(content, parentComment?.id);
      setContent('');
      if (onCancel) onCancel();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-10 group">
      {parentComment && (
        <div className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-electric-blue/80 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-electric-blue rounded-full animate-pulse"></div>
          Replying to {parentComment.author.username}
        </div>
      )}

      <div className="glass-card !bg-white/5 focus-within:!bg-white/10 !rounded-2xl transition-all p-1">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={parentComment ? 'Compose a thoughtful response...' : 'What are your thoughts?'}
          className="w-full bg-transparent px-6 py-4 text-white placeholder-slate-500 outline-none resize-none font-medium text-lg leading-relaxed"
          rows={3}
          required
        />

        <div className="flex items-center justify-between px-4 pb-4">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-2">
            Markdown Supported
          </div>
          <div className="flex gap-2">
            {onCancel && (
              <Button type="button" variant="secondary" onClick={onCancel} className="!px-4 !py-1.5 !text-xs !rounded-lg">
                Discard
              </Button>
            )}
            <Button type="submit" variant="primary" loading={loading} className="!px-6 !py-1.5 !text-xs !rounded-lg font-black shadow-xl">
              {parentComment ? 'Send Reply' : 'Post Thought'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;