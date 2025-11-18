import { Component } from 'react';
import { AlertCircle } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border-2 border-red-400/40 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-500/20 rounded-full">
                <AlertCircle className="w-12 h-12 text-red-400" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Something went wrong</h1>
                <p className="text-gray-300 mt-2">We encountered an unexpected error</p>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6">
              <p className="text-gray-200 leading-relaxed">
                We apologize for the inconvenience. An error occurred while processing your request.
                Your progress may have been saved, and you can try refreshing the page.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="bg-slate-800/50 rounded-xl p-4 mb-6">
                <summary className="cursor-pointer text-gray-300 font-semibold mb-2">
                  Error Details (Development Only)
                </summary>
                <div className="text-sm text-gray-400 overflow-auto">
                  <p className="font-mono mb-2">{this.state.error.toString()}</p>
                  <pre className="whitespace-pre-wrap text-xs">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={this.handleReset}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl transition-all text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Return to Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-8 py-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-lg font-semibold"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
