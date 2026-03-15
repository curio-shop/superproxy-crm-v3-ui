import { Component, ErrorInfo, ReactNode } from 'react';
import { Icon } from '@iconify/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="fixed inset-0 bg-[#F8FAFC] z-[200] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <Icon icon="ph:warning-circle" className="w-8 h-8 text-red-600" />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  Something went wrong
                </h2>
                <p className="text-slate-600 text-sm">
                  An unexpected error occurred while loading this component. Please try again.
                </p>
              </div>

              {this.state.error && import.meta.env.DEV && (
                <div className="w-full mt-4 p-4 bg-red-50 rounded-lg border border-red-200 text-left">
                  <p className="text-xs font-mono text-red-800 mb-2 font-semibold">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="text-xs text-red-700 overflow-auto max-h-40">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}

              <button
                onClick={this.handleReset}
                className="mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
              >
                Try Again
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
