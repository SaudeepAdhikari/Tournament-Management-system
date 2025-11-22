import React from 'react';

/**
 * LoadingSpinner Component
 * Reusable loading indicator
 */
export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
        xl: 'w-16 h-16 border-4'
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div className={`${sizeClasses[size]} border-indigo-600 border-t-transparent rounded-full animate-spin`} />
            {text && <p className="text-white/70 text-sm">{text}</p>}
        </div>
    );
}

/**
 * FullPageLoader Component
 * Loading screen for page transitions
 */
export function FullPageLoader({ text = 'Loading...' }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-black">
            <LoadingSpinner size="xl" text={text} />
        </div>
    );
}

/**
 * ButtonSpinner Component
 * Small spinner for buttons
 */
export function ButtonSpinner() {
    return (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
    );
}
