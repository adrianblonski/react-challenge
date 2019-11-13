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
  editRef: React.RefObject<HTMLTextAreaElement>;

  constructor(props: Props) {
    super(props);

    this.state = {
      editing: false,
      value: '',
    };

    this.editRef = React.createRef();
  }

  componentDidMount() {
    this.getNote();
  }

  getNote = ():void => {
    const { id } = this.props;

    const n: string = localStorage.getItem(`character${id}`);
    this.setState({
      editing: false,
      value: n || '-',
    });
  };

  setNote = ():void => {
    const { id } = this.props;

    const text: string = this.editRef.current.value;
    localStorage.setItem(`character${id}`, text);

    this.getNote();
  };

  onEdit = (): void => {
    const { editing } = this.state;
    this.setState({ editing: !editing });
  };

  onKeyEdit = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter') this.onEdit();
  };

  onKeySave = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter') this.setNote();
  };

  render() {
    const { value, editing } = this.state;

    const showNotes = ():JSX.Element => (
      <div className="element">{value}</div>
    );

    const showEdit = ():JSX.Element => (
      <div className="edit">
        <textarea ref={this.editRef} defaultValue={value} />
        <div
          role="button"
          className="btn btn-secondary"
          onClick={this.setNote}
          onKeyDown={this.onKeySave}
          tabIndex={0}
        >

          Save
        </div>
      </div>
    );

    return (
      <div className="character-info">
        <div className="description">
          Your note:
          <div
            role="button"
            className="btn-edit"
            onClick={this.onEdit}
            onKeyDown={this.onKeyEdit}
            tabIndex={0}
          >
            <img src={edit} alt="Edit" />
          </div>
        </div>
        {editing ? showEdit() : showNotes()}
      </div>
    );
  }
}

export default Notes;
