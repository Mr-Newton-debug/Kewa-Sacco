import React from 'react';
import { ShieldAlert, RotateCcw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Portal runtime error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-900/60 p-6 sm:p-8 rounded-3xl max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="inline-flex bg-rose-950/80 p-3 rounded-2xl border border-rose-800 text-rose-400">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-white">Interface Error</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              A calculation or render exception was caught to protect your session and data integrity.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow"
            >
              <RotateCcw className="w-4 h-4" /> Reload Portal Interface
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}