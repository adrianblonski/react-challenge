import React, { Component } from 'react';

import loadingImg from '../media/images/loading.png';

import Error from '../pages/error';
import CharacterItem from '../components/character_item/main';

interface State {
  characters: string[],
  nextPageURL: string,
  loading: boolean,
  error: boolean
}

class CharactersPage extends Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      characters: [],
      nextPageURL: "-1",
      loading: true,
      error: false
    };
  }

  getResponse = async():Promise<any> => {
    const url: string = (this.state.nextPageURL === "-1") ? 
                        'https://swapi.co/api/people/' : this.state.nextPageURL;
    
    const response: any = await fetch(url, {method: 'GET'});
    const body: any = await response.json();
    if(response.status !== 200) {
      console.error(body.message);
      this.setState({ 
        error: true,
        loading: false 
      });
      return -1;
    } 

    return body;
  }

  processResponse = (res: any) => {
    if(res === -1) return;

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
    const { characters, loading, error } = this.state;

    if(error) return <Error />

    return (
      <div id="container" className="characters">
        {characters.map((character: string, index: number) => {
          return <CharacterItem key={index.toString()} name={character} index={index+1} />
        })}
        {loading ? <img src={loadingImg} className="img-loading" alt="Loading..." /> : null }
      </div>
    )
  }
}

export default CharactersPage;
