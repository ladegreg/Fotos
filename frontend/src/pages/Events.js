import React, {Component} from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';

import './Events.css';

class EventsPage extends Component {
  state = {
    creating: false
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleELRef = React.createRef();
    this.priceELRef = React.createRef();
    this.dateELRef = React.createRef();
    this.descriptionELRef = React.createRef();
  };

  startCreateEventHandler = () => {
    this.setState({ creating: true});
  };

  modalConfirmHandler = () => {
    this.setState({creating: false});
    const title = this.titleELRef.current.value;
    const price = +this.priceELRef.current.value;
    const date = this.dateELRef.current.value;
    const description = this.descriptionELRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0) {
        return;
      }

    const event = {title, price, date, description};
    console.log(event);

    const requestBody = {
        query:`
            mutation {
              createEvent (eventInput: {title: "${title}", price: "${price}", date: "${date}", description: "${description}"}) {
                title
                price
                date
                description
              }
            }
            `
      };

    const token = this.context.token;

    fetch('http://localhost:8010/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer' + token
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed');
      }
      return res.json();
    })
    .then(resData => {
      console.log(resData);
    })
    .catch(err => {
      console.log(err);
    });
  };

  modalCancelHandler = () => {
    this.setState({creating: false});
  };

  render() {
    return (
      <React.Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && <Modal title="Add Event" canCancle canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler}>
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" ref={this.titleELRef} />
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" ref={this.priceELRef} />
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input type="datetime-local" id="date" ref={this.dateELRef} />
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea id="description" rows="4" ref={this.descriptionELRef} />
            </div>
          </form>
        </Modal>}
        {this.context.token && <div className="event-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={this.startCreateEventHandler}>Create Event</button>
        </div>}
      </React.Fragment>
    );
  }
}

export default EventsPage;
