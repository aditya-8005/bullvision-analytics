import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("React Error Boundary:", error);
    console.error(errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
          <div className="max-w-md rounded-xl border border-slate-700 bg-slate-900 p-8 text-center shadow-xl">
            <h1 className="text-2xl font-bold mb-4">
              Something went wrong
            </h1>

            <p className="text-slate-400 mb-6">
              An unexpected error occurred while rendering this page.
            </p>

            <button
              onClick={this.handleReload}
              className="rounded-lg bg-blue-600 px-5 py-2 font-medium hover:bg-blue-700 transition"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}