import React, { Component } from 'react';

import loadingImg from '../media/images/loading.png';

import Error from './error';
import CharacterItem from '../components/character_item/main';

import { Character } from '../interfaces/character';

interface State {
  characters: Character[],
  nextPageURL: string,
  loading: boolean,
  error: boolean
}

class CharactersPage extends Component<{}, State> {
  abortController: AbortController;

  constructor(props: {}) {
    super(props);

    this.state = {
      characters: [],
      nextPageURL: '-1',
      loading: true,
      error: false,
    };

    this.abortController = new AbortController();
  }

  componentDidMount() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.addEventListener('scroll', this.trackScrolling);

    this.getResponse();
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.trackScrolling);
    this.abortController.abort();
  }

  getResponse = ():void => {
    const { nextPageURL } = this.state;

    const url: string = (nextPageURL === '-1')
      ? 'https://swapi.co/api/people/' : nextPageURL;

    const params: any = {
      method: 'GET',
      signal: this.abortController.signal,
    };

    fetch(url, params)
      .then((res: any) => {
        if (res.status !== 200) {
          this.setState({
            error: true,
            loading: false,
          });
          return -1;
        }
        return res.json();
      })
      .then((body: any) => {
        if (body === -1) return;

        const { characters } = this.state;

        const charactersFetched: Character[] = body.results.map((character: any): Character => ({
          id: character.url.replace('https://swapi.co/api/people/', '').slice(0, -1),
          name: character.name,
        }));

        this.setState({
          characters: [...characters, ...charactersFetched],
          nextPageURL: body.next,
          loading: false,
        });
      })
      .catch((err: any) => {
        if (err.name === 'AbortError') return;
        throw err;
      });
  };

  trackScrolling = ():void => {
    const { loading, nextPageURL } = this.state;

    const e: HTMLElement = document.getElementById('container');
    if (e.getBoundingClientRect().bottom - 1 <= window.innerHeight && !loading && nextPageURL) {
      this.setState({ loading: true });
      this.getResponse();
    }
  };

  render() {
    const { characters, loading, error } = this.state;

    if (error) return <Error />;

    return (
      <div id="container" className="characters">
        {characters.map(
          (character: Character, index: number) => (
            <CharacterItem
              key={index.toString()}
              name={character.name}
              index={character.id}
            />
          ),
        )}
        {loading ? <img src={loadingImg} className="img-loading" alt="Loading..." /> : null }
      </div>
    );
  }
}

export default CharactersPage;
