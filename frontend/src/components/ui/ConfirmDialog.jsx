import { useEffect, useId, useRef } from 'react';
import Button from './Button';

function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'primary',
}) {
  const dialogRef = useRef(null);
  const cancelRef = useRef(null);
  const acionadorRef = useRef(null);
  const onCancelRef = useRef(onCancel);
  const id = useId();

  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    if (!open) return undefined;

    acionadorRef.current = document.activeElement;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    cancelRef.current?.focus();

    function lidarComTeclado(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancelRef.current();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focaveis = dialogRef.current.querySelectorAll(
        'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focaveis.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (event.shiftKey && (
        document.activeElement === primeiro
        || document.activeElement === dialogRef.current
      )) {
        event.preventDefault();
        ultimo.focus();
      } else if (!event.shiftKey && (
        document.activeElement === ultimo
        || document.activeElement === dialogRef.current
      )) {
        event.preventDefault();
        primeiro.focus();
      }
    }

    document.addEventListener('keydown', lidarComTeclado);
    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener('keydown', lidarComTeclado);
      if (acionadorRef.current instanceof HTMLElement && acionadorRef.current.isConnected) {
        acionadorRef.current.focus();
      }
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-description`}
        tabIndex={-1}
        className="w-full max-w-md rounded-card bg-white p-6 shadow-card-hover"
      >
        <h2 id={`${id}-title`} className="text-xl font-bold text-roxo">{title}</h2>
        <p id={`${id}-description`} className="mt-3 text-suave">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button ref={cancelRef} variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={variant} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </section>
    </div>
  );
}

export default ConfirmDialog;
