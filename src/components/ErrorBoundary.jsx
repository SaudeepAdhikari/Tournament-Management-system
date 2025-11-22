import React from 'react';

/**
 * ErrorBoundary Component
 * Catches React errors and displays fallback UI
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-slate-900 to-black p-6">
                    <div className="max-w-2xl w-full rounded-2xl border border-red-500/20 p-10 shadow-xl backdrop-blur-lg bg-white/5">
                        <div className="text-center mb-6">
                            <div className="text-6xl mb-4">⚠️</div>
                            <h1 className="text-3xl font-bold text-white mb-2">Oops! Something went wrong</h1>
                            <p className="text-red-200/80">
                                We encountered an unexpected error. Don't worry, your data is safe.
                            </p>
                        </div>

                        {this.state.error && (
                            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                                <p className="text-sm font-mono text-red-300 break-all">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transform transition hover:scale-105"
                            >
                                Return to Home
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="border border-white/20 hover:bg-white/5 text-white px-6 py-3 rounded-lg font-medium transform transition hover:scale-105"
                            >
                                Reload Page
                            </button>
                        </div>

                        {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                            <details className="mt-6 p-4 rounded-lg bg-slate-800/50 border border-white/10">
                                <summary className="text-sm text-white/70 cursor-pointer mb-2">
                                    Error Details (Development Only)
                                </summary>
                                <pre className="text-xs text-red-300 overflow-auto max-h-64">
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
