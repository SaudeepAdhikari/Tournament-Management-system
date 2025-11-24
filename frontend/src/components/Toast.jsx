import React from 'react';

/**
 * Toast Notification Component
 * Simple toast notifications for user feedback
 */
export default function Toast({ message, type = 'info', onClose }) {
    const typeStyles = {
        success: 'bg-green-500/90 border-green-400',
        error: 'bg-red-500/90 border-red-400',
        warning: 'bg-yellow-500/90 border-yellow-400',
        info: 'bg-indigo-500/90 border-indigo-400'
    };

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (onClose) onClose();
        }, 4000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border-2 ${typeStyles[type]} text-white shadow-lg animate-slide-in-right`}>
            <span className="text-xl font-bold">{icons[type]}</span>
            <p className="font-medium">{message}</p>
            <button
                onClick={onClose}
                className="ml-2 text-white/80 hover:text-white transition"
            >
                ✕
            </button>
        </div>
    );
}

/**
 * ToastContainer Component
 * Manages multiple toast notifications
 */
export function ToastContainer({ toasts, removeToast }) {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
}

/**
 * Custom hook for toast notifications
 */
export function useToast() {
    const [toasts, setToasts] = React.useState([]);

    const addToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return {
        toasts,
        addToast,
        removeToast,
        success: (msg) => addToast(msg, 'success'),
        error: (msg) => addToast(msg, 'error'),
        warning: (msg) => addToast(msg, 'warning'),
        info: (msg) => addToast(msg, 'info')
    };
}
