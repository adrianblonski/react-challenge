import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom';

import loadingImg from '../media/images/loading.png';
import yoda from '../media/images/reading-yoda.png';

import NotFound from './not_found';
import Error from './error';
import Notes from '../components/notes/main';

interface RouteInfo {
  id: string
}

interface Props extends RouteComponentProps<RouteInfo>{}

interface State {
  loading: boolean,
  error: boolean,
  notFound: boolean,

  name: string,
  gender: string,
  species: string[],
  height: string,
  mass: string,
  films: string[]
}

class Details extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    
    this.state = {
      loading: true,
      error: false,
      notFound: false,

      name: '',
      gender: '',
      species: [],
      height: '',
      mass: '',
      films: []
    };
  }

  getResponse = async():Promise<any> => {
    const { id } = this.props.match.params;

    /* BASIC CHARACTER DATA */
    const basicResponse: any = await fetch(`https://swapi.co/api/people/${id}/`, {method: 'GET'});
    const body: any = await basicResponse.json();
    if(basicResponse.status !== 200) {
      if(basicResponse.status === 404) 
        this.setState({ notFound: true });

      this.setState({ 
        error: true,
        loading: false
      });
      return -1;
    }

    /* SPECIES */
    let species: string[] = [];
    for(let i = 0; i < body.species.length; i++) {
      const speciesResponse: any = await fetch(body.species[i], {method: 'GET'});
      const speciesBody: any = await speciesResponse.json();
      if(speciesResponse.status !== 200) {
        this.setState({ 
          error: true,
          loading: false
        });
        console.error("Couldn't fetch data from API");
        return -1;
      }

      species.push(speciesBody.name);
    }
    body.species = species;

    /* FILMS */
    let films: string[] = [];
    for(let i = 0; i < body.films.length; i++) {
      const filmsResponse: any = await fetch(body.films[i], {method: 'GET'});
      const filmsBody: any = await filmsResponse.json();
      if(filmsResponse.status !== 200) {
        this.setState({ 
          error: true,
          loading: false
        });
        console.error("Couldn't fetch data from API");
        return -1;
      }

      films.push(filmsBody.title);
    }
    body.films = films;

    return body;
  }

  componentDidMount () {
    this.getResponse().then((res: any) => {
      if(res === -1) return;

      this.setState({
        loading: false,

        name: res.name,
        gender: res.gender,
        species: res.species,
        height: res.height,
        mass: res.mass,
        films: res.films
      });
    });


  }

  render() {
    if(this.state.notFound)
      return (<NotFound />);

    if(this.state.error) 
      return (<Error />);

    if(this.state.loading) 
      return (
        <div className="centered">
          <img src={loadingImg} className="img-loading" alt="Loading..." />
        </div>
      );

    const { name, gender, species, height, mass, films } = this.state; 

    const speciesToString = ():string => {
      let s: string = '';
      species.forEach((spec: string, index: number): void => {
        if(index !== 0) s += ', ';
        s +=  spec;
      });
      return s;
    }

    const heightToString = ():string => {
      return height + (parseInt(height) ? ' cm' : '');
    }

    const massToString = (): string => {
      return mass + (parseInt(mass) ? ' kg' : '');
    }

    return (
      <div className="row">
        <div className="character-details col-xl-4 col-10 offset-xl-2 offset-1">
          <div className="character-name">{name}</div>
          <div className="character-info">
            <div className="description">Gender:</div>
            <div className="element">{gender}</div>
          </div>
          <div className="character-info">
            <div className="description">Species:</div>
            <div className="element">{speciesToString()}</div>
          </div>
          <div className="character-info">
            <div className="description">Height:</div>
            <div className="element">{heightToString()}</div>
          </div>
          <div className="character-info">
            <div className="description">Mass:</div>
            <div className="element">{massToString()}</div>
          </div>
          <div className="character-info">
            <div className="description">Films:</div>
            {films.map((film: string, index: number):JSX.Element => {
              return (<div key={index} className="element">{film}</div>);
            })}
          </div>
          <Notes id={this.props.match.params.id} />
        </div>
        <div className="yoda col-xl-4 col-10 offset-xl-2 offset-1">
          <img src={yoda} alt="yoda" />
        </div>
      </div>
    )
  }
}

export default Details
