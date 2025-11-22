import React from 'react';

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger' // 'danger', 'warning', 'info'
}) {
    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: '⚠️',
                    confirmBtn: 'bg-red-600 hover:bg-red-700 text-white',
                    iconBg: 'bg-red-500/10 border-red-500/20'
                };
            case 'warning':
                return {
                    icon: '⚡',
                    confirmBtn: 'bg-yellow-600 hover:bg-yellow-700 text-white',
                    iconBg: 'bg-yellow-500/10 border-yellow-500/20'
                };
            case 'info':
                return {
                    icon: 'ℹ️',
                    confirmBtn: 'bg-indigo-600 hover:bg-indigo-700 text-white',
                    iconBg: 'bg-indigo-500/10 border-indigo-500/20'
                };
            default:
                return {
                    icon: '❓',
                    confirmBtn: 'bg-slate-600 hover:bg-slate-700 text-white',
                    iconBg: 'bg-slate-500/10 border-slate-500/20'
                };
        }
    };

    const styles = getTypeStyles();

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-fade-in">
            <div className="glass-card p-8 max-w-md w-full animate-scale-in">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-full ${styles.iconBg} border-2 flex items-center justify-center mx-auto mb-6`}>
                    <span className="text-4xl">{styles.icon}</span>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-white text-center mb-3">
                    {title}
                </h2>

                {/* Message */}
                <p className="text-slate-300 text-center mb-8">
                    {message}
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-200 font-medium"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`flex-1 px-6 py-3 rounded-xl ${styles.confirmBtn} transition-all duration-200 font-medium shadow-lg`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
