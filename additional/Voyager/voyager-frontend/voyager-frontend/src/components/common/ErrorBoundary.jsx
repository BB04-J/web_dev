import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In a real deployment this would report to a logging service.
    console.error("Voyager crashed:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="container"
          style={{
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: 14,
          }}
        >
          <span style={{ fontSize: "2.4rem" }}>🧭</span>
          <h2>We've gone off course</h2>
          <p style={{ maxWidth: 420 }}>
            Something unexpected happened while rendering this page. You can
            try again, or head back to the dashboard.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-ghost" onClick={this.handleReset}>
              Try again
            </button>
            <a className="btn btn-primary" href="/">
              Back to dashboard
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
