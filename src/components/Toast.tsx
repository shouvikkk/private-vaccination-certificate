import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" id="toast-notifications-container">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast" style={{
          borderLeft: `4px solid ${
            toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#f43f5e' : '#3b82f6'
          }`,
        }}>
          {toast.type === 'success' && <CheckCircle2 size={18} style={{ color: '#10b981' }} />}
          {toast.type === 'error' && <AlertCircle size={18} style={{ color: '#f43f5e' }} />}
          {toast.type === 'info' && <Info size={18} style={{ color: '#3b82f6' }} />}
          <div>
            <div style={{ fontWeight: 600 }}>{toast.title}</div>
            {toast.message && <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{toast.message}</div>}
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginLeft: 'auto' }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
