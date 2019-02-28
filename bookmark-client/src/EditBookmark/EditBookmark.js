import React, { Component } from 'react';
import BookmarksContext from '../BookmarksContext';
import config from '../config';

export default class EditBookmark extends Component {
  static contextType = BookmarksContext;
  state = {
    title: '',
    url: '',
    rating: 1,
    description: ''
  };

  componentDidMount() {
    const bookmarkId = this.props.match.params.bookmarkId;
    fetch(`${config.API_ENDPOINT}/${bookmarkId}`, {
      method: 'GET'
    })
      .then(res => res.json())
      .then(responseData => {
        delete responseData.id;
        this.setState({
          ...this.state,
          ...responseData
        });
      })
      .catch(error => {
        /* some content omitted */
      });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { description, title, url, rating } = this.state;
    fetch(`${config.API_ENDPOINT}/${this.props.match.params.bookmarkId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        description,
        title,
        url,
        rating
      }),
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) {
          // get the error message from the response,
          return res.json().then(error => {
            // then throw it
            throw error;
          });
        }
      })
      .then(() => {
        this.context.updateBookmark({
          description,
          title,
          url,
          rating,
          id: this.props.match.params.bookmarkId
        });
      })
      .then(res => {
        this.props.history.push('/');
      });
  }

  change = e => {
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;
    if (name === 'title') {
      this.setState({
        title: value
      });
    } else if (name === 'description') {
      this.setState({
        description: value
      });
    } else if (name === 'url') {
      this.setState({
        url: value
      });
    } else {
      this.setState({
        rating: value
      });
    }
  };

  render() {
    const { title, url, rating, description } = this.state;
    console.log(description);
    return (
      <section className="EditBookmark">
        <h2>Edit a bookmark</h2>
        <form
          className="EditBookmark__form"
          onSubmit={e => this.handleSubmit(e)}
        >
          {/* <div className='EditBookmark__error' role='alert'>
                {error && <p>{error.message}</p>}
              </div> */}
          <div>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              required
              defaultValue={title}
              onChange={this.change}
            />
          </div>
          <div>
            <label htmlFor="url">URL</label>
            <input
              type="url"
              name="url"
              id="url"
              required
              defaultValue={url}
              onChange={this.change}
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              onChange={this.change}
              value={description}
            />
          </div>
          <div>
            <label htmlFor="rating">Rating</label>
            <input
              type="number"
              name="rating"
              id="rating"
              min="1"
              max="5"
              onChange={this.change}
              defaultValue={rating}
              required
            />
          </div>
          <div className="AddBookmark__buttons">
            <button type="button" onClick={this.handleClickCancel}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </section>
    );
  }
}
