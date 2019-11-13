import React, { Component } from 'react';
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
  abortController: AbortController;

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
      films: [],
    };

    this.abortController = new AbortController();
  }

  componentDidMount() {
    this.getResponse();
  }

  componentWillUnmount() {
    this.abortController.abort();
  }

  getResponse = (): void => {
    const { match } = this.props;
    const { id } = match.params;

    const url = `https://swapi.co/api/people/${id}/`;

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
            notFound: res.status === 404,
          });
          return -1;
        }
        return res.json();
      })
      .then((body: any) => {
        if (body === -1) return;

        this.setState({
          name: body.name,
          gender: body.gender,
          height: body.height,
          mass: body.mass,
        });

        this.getNested(body.species, body.films);
      })
      .catch((err: any) => {
        if (err.name === 'AbortError') return;
        throw err;
      });
  }

  getNested = (speciesURL: string[], filmsURL: string[]): void => {
    const params: any = {
      method: 'GET',
      signal: this.abortController.signal,
    };

    const species: string[] = [];
    const films: string[] = [];

    const checkDone = (): void => {
      if (species.length === speciesURL.length && films.length === filmsURL.length) {
        this.setState({
          loading: false,
          species,
          films,
        });
      }
    };

    speciesURL.forEach((url: string) => {
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

          species.push(body.name);
          checkDone();
        })
        .catch((err: any) => {
          if (err.name === 'AbortError') return;
          throw err;
        });
    });

    filmsURL.forEach((url: string) => {
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

          films.push(body.title);
          checkDone();
        })
        .catch((err: any) => {
          if (err.name === 'AbortError') return;
          throw err;
        });
    });
  };

  render() {
    const { notFound, error, loading } = this.state;

    if (notFound) { return (<NotFound />); }

    if (error) { return (<Error />); }

    if (loading) {
      return (
        <div className="centered">
          <img src={loadingImg} className="img-loading" alt="Loading..." />
        </div>
      );
    }

    const { match } = this.props;
    const { id } = match.params;

    const {
      name, gender, species, height, mass, films,
    } = this.state;

    const speciesToString = ():string => {
      let s: string = '';
      species.forEach((spec: string, index: number): void => {
        if (index !== 0) s += ', ';
        s += spec;
      });
      return s;
    };

    const heightToString = ():string => height + (parseInt(height, 10) ? ' cm' : '');

    const massToString = (): string => mass + (parseInt(mass, 10) ? ' kg' : '');

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
            {films.map((film: string, index: number):JSX.Element => (
              <div
                key={index.toString()}
                className="element"
              >
                {film}
              </div>
            ))}
          </div>
          <Notes id={id} />
        </div>
        <div className="yoda col-xl-4 col-10 offset-xl-2 offset-1">
          <img src={yoda} alt="yoda" />
        </div>
      </div>
    );
  }
}

export default Details;
