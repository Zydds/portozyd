'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null);
  const resolveRef = useRef(null);
  const okRef = useRef(null);

  const confirmBox = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setDialog({ message, ...options });
    });
  }, []);

  const answer = useCallback((value) => {
    const resolve = resolveRef.current;
    resolveRef.current = null;
    setDialog(null);
    if (resolve) resolve(value);
  }, []);

  useEffect(() => {
    if (!dialog) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') answer(false);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    okRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [dialog, answer]);

  return (
    <ConfirmContext.Provider value={confirmBox}>
      {children}
      {dialog && (
        <div className="confirm-backdrop" onClick={() => answer(false)} role="presentation">
          <div
            className="confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-label={dialog.title || 'Are you sure?'}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="confirm-title">{dialog.title || 'Are you sure?'}</h3>
            <p className="confirm-message">{dialog.message}</p>
            <div className="confirm-actions">
              <button type="button" className="confirm-btn confirm-cancel" onClick={() => answer(false)}>
                {dialog.cancelText || 'Cancel'}
              </button>
              <button
                type="button"
                ref={okRef}
                className={`confirm-btn confirm-ok${dialog.danger ? ' danger' : ''}`}
                onClick={() => answer(true)}
              >
                {dialog.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used inside <ConfirmProvider>');
  return ctx;
}
