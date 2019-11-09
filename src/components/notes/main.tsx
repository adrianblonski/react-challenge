import React, { Component } from 'react';

import edit from '../../media/images/edit.png';

import './style.css';

interface Props {
  id: string
}

interface State {
  editing: boolean,
  value: string
}

class Notes extends Component<Props, State> {
  editRef: React.RefObject<HTMLTextAreaElement>

  constructor(props: Props) {
    super(props);

    this.state = { 
      editing: false,
      value: ''
    };

    this.editRef = React.createRef();
  }

  getNote = ():void => {
    const n: string = localStorage.getItem(`character${this.props.id}`);
    this.setState({
      editing: false,
      value: n ? n : '-'
    });
  }

  setNote = ():void => {
    const text: string = this.editRef.current.value;
    localStorage.setItem(`character${this.props.id}`, text);

    this.getNote();
  }

  onClickEdit = (): void => {
    this.setState({ editing: !this.state.editing });
  }

  componentDidMount() {
    this.getNote();
  }

  render() {
    const showNotes = ():JSX.Element => {
      return (
        <div className="element">{this.state.value}</div>
      );
    }

    const showEdit = ():JSX.Element => {
      return (
        <div className="edit">
          <textarea ref={this.editRef} defaultValue={this.state.value}></textarea>
          <div className="btn btn-secondary" onClick={this.setNote}>Save</div>
        </div>
      );
    }

    return (
      <div className="character-info">
        <div className="description">
          Your note:
          <img src={edit} alt="Edit" onClick={this.onClickEdit} />
        </div>
        {this.state.editing ? showEdit() : showNotes()}
      </div>
    )
  }
}

export default Notes;
