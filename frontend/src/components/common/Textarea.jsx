import { forwardRef } from 'react';

const Textarea = forwardRef(({
  label,
  error,
  rows = 4,
  placeholder,
  ...props
}, ref) => {
  return (
    <div className="mb-8 px-1">
      {label && (
        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3">
          {label} {props.required && <span className="text-electric-blue">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        placeholder={placeholder}
        className={`w-full px-5 py-4 glass-card !bg-white/5 !rounded-xl border-white/5 focus:border-electric-blue/50 focus:bg-white/10 outline-none transition-all duration-300 text-white placeholder:text-slate-600 font-medium resize-none ${error ? 'border-rose-500/50 focus:border-rose-500' : ''
          }`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-xs font-bold text-rose-400 ml-1">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;