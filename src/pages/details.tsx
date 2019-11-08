import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom';

import loadingImg from '../media/images/loading.png';
import yoda from '../media/images/reading-yoda.png';

interface RouteInfo {
  id: string
}

interface Props extends RouteComponentProps<RouteInfo>{}

interface State {
  loading: boolean,
  error: boolean,

  name: string,
  gender: string,
  species: string[],
  height: number,
  mass: number
}

class Details extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    
    this.state = {
      loading: true,
      error: false,

      name: '',
      gender: '',
      species: [],
      height: 0,
      mass: 0
    };
  }

  getResponse = async():Promise<any> => {
    const { id } = this.props.match.params;

    /* BASIC CHARACTER DATA */
    const basicResponse: any = await fetch(`https://swapi.co/api/people/${id}/`, {method: 'GET'});
    const body: any = await basicResponse.json();
    if(basicResponse.status !== 200) {
      this.setState({ error: true });
      throw Error(body.message);
    }

    /* SPECIES */
    let species: string[] = [];
    for(let i = 0; i < body.species.length; i++) {
      const speciesResponse: any = await fetch(body.species, {method: 'GET'});
      const speciesBody: any = await speciesResponse.json();
      if(basicResponse.status !== 200) {
        this.setState({ error: true });
        throw Error(body.message);
      }

      species.push(speciesBody.name);
    }

    body.species = species;

    return body;
  }

  componentDidMount () {
    this.getResponse().then((res: any) => {
      this.setState({
        loading: false,
        name: res.name,
        gender: res.gender,
        species: res.species,
        height: parseInt(res.height),
        mass: parseInt(res.mass)
      });
    });
  }

  render() {
    if(this.state.loading) 
      return (
        <div className="centered">
          <img src={loadingImg} className="img-loading" alt="Loading..." />
        </div>
      );

    const speciesToString = ():string => {
      let s: string = '';
      this.state.species.forEach((spec: string, index: number): void => {
        if(index !== 0) s += ', ';
        s +=  spec;
      });
      return s;
    }

    return (
      <div className="row">
        <div className="character-details col-xl-4 col-10 offset-xl-2 offset-1">
          <div className="character-name">{this.state.name}</div>
          <div className="character-info">
            <div className="description">Gender:</div>
            <div className="element">{this.state.gender}</div>
          </div>
          <div className="character-info">
            <div className="description">Species:</div>
            <div className="element">{speciesToString()}</div>
          </div>
          <div className="character-info">
            <div className="description">Height:</div>
            <div className="element">{this.state.height} cm</div>
          </div>
          <div className="character-info">
            <div className="description">Mass:</div>
            <div className="element">{this.state.mass} kg</div>
          </div>
        </div>
        <div className="yoda col-xl-4 col-10 offset-xl-2 offset-1">
          <img src={yoda} alt="yoda" />
        </div>
      </div>
    )
  }
}

export default Details
