import React, { Component } from 'react'

class Error extends Component<{},{}> {
  render() {
    return (
      <div className="error">API error, try again later.</div>
    )
  }
}

export default Error;
