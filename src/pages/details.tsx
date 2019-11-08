import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom';

interface RouteInfo {
  id: string
}

interface Props extends RouteComponentProps<RouteInfo>{}

interface State {
  data: string
}

class Details extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    
    this.state = {
      data: ''
    };
  }

  render() {
    return (
      <div>
        {this.state.data === '' ? 'Loading...' : this.state.data}
      </div>
    )
  }
}

export default Details
