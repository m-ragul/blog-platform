const Spinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} border-4 border-white/5 border-t-electric-blue rounded-full animate-spin drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]`}
      ></div>
    </div>
  );
};

export default Spinner;