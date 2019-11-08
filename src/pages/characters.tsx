import React, { Component } from 'react';

interface State {
  characters: string[],
  nextPageURL: string,
  loading: boolean
}

class CharactersPage extends Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      characters: [],
      nextPageURL: "-1",
      loading: true
    };
  }

  render() {
    return (
      <div id="container" className="characters-container">
        <p>Characters</p>
      </div>
    )
  }
}

export default CharactersPage;
