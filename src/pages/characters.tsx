import React, { Component } from 'react';

import CharacterItem from '../components/character_item/main';

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

  getResponse = async():Promise<any> => {
    const url: string = (this.state.nextPageURL === "-1") ? 
                        'https://swapi.co/api/people/' : this.state.nextPageURL;
    const response: any = await fetch(url, {method: 'GET'});
    const body: any = await response.json();
    if(response.status !== 200) throw Error(body.message);

    return body;
  }

  processResponse = (res: any) => {
    const characters: string[] = res.results.map((character: any): string => character.name);
    const nextPageURL: string = res.next;
    this.setState({
      characters: [...this.state.characters, ...characters],
      nextPageURL,
      loading: false
    });
  }

  trackScrolling = ():void => {
    const { loading, nextPageURL } = this.state;

    const e: HTMLElement = document.getElementById('container');
    if(e.getBoundingClientRect().bottom <= window.innerHeight && !loading && nextPageURL) {
      this.setState({ loading: true });
      this.getResponse().then(this.processResponse);
    }
  }

  componentDidMount() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    document.addEventListener('scroll', this.trackScrolling);
    this.getResponse().then(this.processResponse);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.trackScrolling);
  }

  render() {
    const { characters, loading } = this.state;

    return (
      <div id="container" className="characters-container">
        {characters.map((character: string, index: number) => {
          return <CharacterItem key={index.toString()} name={character} index={index+1} />
        })}
        {loading ? <div className="loading">Loading...</div> : null }
      </div>
    )
  }
}

export default CharactersPage;
