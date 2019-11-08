import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

interface Props {
  key: string,
  name: string,
  index: number
}

class CharacterItem extends Component<Props, {}> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  render() {
    const href = `/characters/${this.props.index}`;
    return (
      <Link to={href} className="character-item">
        <div>{this.props.name}</div>
      </Link>
    )
  }
}

export default CharacterItem;
