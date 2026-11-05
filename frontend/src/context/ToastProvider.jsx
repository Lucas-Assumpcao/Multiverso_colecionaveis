import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CircleCheck, CircleX, Info, X } from 'lucide-react';
import { ToastContext } from './toastCtx';

const toastVariants = {
  success: {
    Icon: CircleCheck,
    className: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  },
  error: {
    Icon: CircleX,
    className: 'border-vermelho-escuro/30 bg-red-50 text-vermelho-escuro',
  },
  info: {
    Icon: Info,
    className: 'border-roxo-claro/20 bg-lilas/40 text-roxo',
  },
};

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((variant, message) => {
    const id = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    setToasts((current) => [...current, { id, variant, message }]);
    timers.current.set(id, setTimeout(() => dismiss(id), 3500));
    return id;
  }, [dismiss]);

  const success = useCallback((message) => addToast('success', message), [addToast]);
  const error = useCallback((message) => addToast('error', message), [addToast]);
  const info = useCallback((message) => addToast('info', message), [addToast]);

  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    timers.current.clear();
  }, []);

  const value = useMemo(() => ({ success, error, info }), [success, error, info]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 left-1/2 z-[70] flex w-[calc(100%-2rem)] -translate-x-1/2 flex-col gap-3 sm:left-auto sm:right-4 sm:w-auto sm:translate-x-0">
        {toasts.map((toast) => {
          const { Icon, className } = toastVariants[toast.variant];

          return (
            <div
              key={toast.id}
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className={`flex items-center gap-3 rounded-xl border p-4 shadow-card ${className}`}
            >
              <Icon aria-hidden="true" className="size-5 shrink-0" />
              <p className="flex-1 text-sm font-medium">{toast.message}</p>
              <button
                type="button"
                aria-label="Fechar aviso"
                onClick={() => dismiss(toast.id)}
                className="inline-flex size-11 shrink-0 items-center justify-center rounded transition-colors hover:bg-black/5"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
