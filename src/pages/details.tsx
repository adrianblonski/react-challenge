import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom';

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
    if(this.state.loading) return (<div className="loading">Loading...</div>);

    return (
      <div>
        {this.state.name}    <br />
        {this.state.gender}  <br />
        {this.state.species} <br />
        {this.state.height}  <br />
        {this.state.mass}    <br />
      </div>
    )
  }
}

export default Details
