import React from 'react';
import { Link } from 'react-router-dom';

import background from '../../media/images/bg.jpg';

import './style.css';

function Header() {
  return (
    <div className="header">
      <Link to="/">
        <div className="title">StarWars</div>
        <div className="sub-title">Characters</div>
      </Link>
      <img src={background} className="img-background" alt="bg" />
    </div>
  );
}

export default Header;
