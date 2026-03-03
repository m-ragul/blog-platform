import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  type = 'text',
  placeholder,
  ...props
}, ref) => {
  return (
    <div className="mb-6">
      {label && (
        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2 px-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`w-full px-5 py-3 glass-card !bg-white/5 !rounded-xl border-white/5 focus:border-electric-blue/50 focus:bg-white/10 outline-none transition-all duration-300 text-white placeholder-slate-600 ${error ? '!border-rose-500/50 focus:!border-rose-500' : ''
          }`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-rose-500 px-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;