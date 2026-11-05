import { useId } from 'react';
import { classNames } from './classNames';

function Field({
  id,
  label,
  help,
  error,
  labelClassName,
  as: Control = 'input',
  children,
  className,
  inputClassName,
  ...inputProps
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const helpId = `${inputId}-help`;
  const errorId = `${inputId}-error`;
  const describedBy = [
    inputProps['aria-describedby'],
    help ? helpId : null,
    error ? errorId : null,
  ].filter(Boolean).join(' ') || undefined;

  return (
    <div className={classNames('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={inputId}
        className={classNames('text-sm font-semibold text-chumbo', labelClassName)}
      >
        {label}
      </label>
      <Control
        {...inputProps}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={classNames(
          'w-full rounded-lg border border-borda bg-white px-3 py-3 text-chumbo placeholder:text-suave',
          error && 'border-vermelho-escuro',
          inputClassName,
        )}
      >
        {children}
      </Control>
      {help && <p id={helpId} className="text-sm text-suave">{help}</p>}
      {error && <p id={errorId} className="text-sm text-vermelho-escuro">{error}</p>}
    </div>
  );
}

export default Field;
