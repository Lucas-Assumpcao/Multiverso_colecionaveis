import { classNames } from './classNames';

const variants = {
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amarelo/25 text-roxo',
  danger: 'bg-vermelho-escuro text-white',
  neutral: 'bg-lilas text-roxo',
};

function Badge({ variant = 'neutral', className, children, ...props }) {
  return (
    <span
      className={classNames(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
