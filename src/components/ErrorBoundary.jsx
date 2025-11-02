import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { err: null };
  }
  static getDerivedStateFromError(err) {
    return { err };
  }
  componentDidCatch(err, info) {
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary", err, info);
  }
  render() {
    if (this.state.err) {
      return (
        <div className="mx-auto max-w-2xl rounded-xl border bg-red-50 p-4 text-sm text-red-800">
          <div className="mb-1 font-semibold">Something went wrong</div>
          <pre className="whitespace-pre-wrap text-xs">{String(this.state.err)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
