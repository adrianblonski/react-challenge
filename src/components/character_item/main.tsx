import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

interface Props {
  key: string,
  name: string,
  index: string
}

class CharacterItem extends Component<Props, {}> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  render() {
    const { index, name } = this.props;

    const href = `/characters/${index}`;
    return (
      <Link to={href} className="character-item">
        <div>{name}</div>
      </Link>
    );
  }
}

export default CharacterItem;
