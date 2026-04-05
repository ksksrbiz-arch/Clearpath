import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', fontFamily: 'var(--sans, sans-serif)' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1a3a2a' }}>Something went wrong</h1>
          <p style={{ color: '#6a6a66', marginBottom: '1.5rem' }}>Please refresh the page to try again.</p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '.6rem 1.5rem', background: '#c4956a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            Refresh Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
