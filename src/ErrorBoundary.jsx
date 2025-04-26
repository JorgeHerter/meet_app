import React from 'react';
import * as atatus from 'atatus-spa';

class ErrorBoundary extends React.Component {
  componentDidCatch(error, info) {
    atatus.notify(error, {
      severity: 'error',
      componentStack: info.componentStack,
    });
  }

  render() {
    return this.props.children;
  }
}

export default ErrorBoundary;
