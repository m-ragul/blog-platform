const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  loading = false,
  className = '',
}) => {
  const baseClasses = 'px-6 py-2.5 rounded-xl font-bold tracking-tight transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center';

  const variants = {
    primary: 'bg-linear-to-r from-electric-violet to-electric-blue text-white shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)] hover:shadow-[0_0_25px_-2px_rgba(6,182,212,0.6)] hover:-translate-y-0.5',
    secondary: 'bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20',
    danger: 'bg-linear-to-r from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 hover:-translate-y-0.5',
    outline: 'border-2 border-electric-blue text-electric-blue hover:bg-electric-blue/10 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;