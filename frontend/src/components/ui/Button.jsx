import { LoaderCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { classNames } from './classNames';

const variants = {
  primary: 'bg-amarelo text-roxo hover:brightness-95',
  secondary: 'border border-roxo text-roxo hover:bg-lilas/30',
  ghost: 'text-roxo hover:bg-lilas/30',
  danger: 'bg-vermelho-escuro text-white hover:brightness-90',
};

const sizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-5 py-3',
  lg: 'px-6 py-3.5 text-lg',
};

const baseClassName =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50';

function Button({
  to,
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText,
  disabled = false,
  type = 'button',
  className,
  children,
  onClick,
  ...props
}) {
  const isDisabled = disabled || loading;
  const content = (
    <>
      {loading && <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />}
      {loading && loadingText ? loadingText : children}
    </>
  );
  const classes = classNames(baseClassName, variants[variant], sizes[size], className);

  if (to) {
    return (
      <Link
        to={to}
        className={classNames(classes, isDisabled && 'pointer-events-none opacity-50')}
        aria-disabled={isDisabled || undefined}
        onClick={(event) => {
          if (isDisabled) {
            event.preventDefault();
            return;
          }
          onClick?.(event);
        }}
        {...props}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      onClick={onClick}
      {...props}
    >
      {content}
    </button>
  );
}

export default Button;
