import React, { Component } from 'react';

import background from '../../media/images/bg.jpg';

import './style.css';

class Header extends Component<{}, {}> {
  render() {
    return (
      <div className="header">
        <div className="title">StarWars</div>
        <div className="sub-title">Characters</div>
        <img src={background} className="img-background" alt="bg" />
      </div>
    )
  }
}

export default Header;
