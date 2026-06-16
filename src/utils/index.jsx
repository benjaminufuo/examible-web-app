import React from "react";

export class GlobalErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something broke. Please try again.</h1>;
    }

    return this.props.children;
  }
}
