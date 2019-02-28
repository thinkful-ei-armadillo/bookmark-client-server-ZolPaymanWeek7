import React, { Component } from 'react';
import config from '../config';

export default class EditBookmark extends Component {
    constructor(props){
        super(props);
        this.state = {
            title: '',
            url: '',
            rating: 1,
            description: ''
        }
    }


    componentDidMount() {
        const bookmarkId = this.props.match.params.bookmarkId
        fetch(`${config.API_ENDPOINT}/${bookmarkId}`, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(responseData => {
                delete responseData.id;
            this.setState({
                ...this.state,
                ...responseData
            })
        })
            .catch(error => {/* some content omitted */})
        }

    handleSubmit = (event) => {
        event.preventDefault();
        fetch(`${config.API_ENDPOINT}/${this.props.match.params.bookmarkId}`, {
            method: 'PATCH',
            body: JSON.stringify({...this.state})
        })
        .then(res => res.json())
        .then(data => {
            debugger;
        })
    }

    render() {
        const { title, url, rating, description } = this.state;
        return (
            <section className='EditBookmark'>
            <h2>Edit a bookmark</h2>
            <form className='EditBookmark__form'
              onSubmit={this.handleSubmit}
            >
              {/* <div className='EditBookmark__error' role='alert'>
                {error && <p>{error.message}</p>}
              </div> */}
              <div>
                <label htmlFor='title'>
                  Title
                </label>
                <input
                  type='text'
                  name='title'
                  id='title'
                  required
                  defaultValue={title}
                />
              </div>
              <div>
                <label htmlFor='url'>
                  URL
                </label>
                <input
                  type='url'
                  name='url'
                  id='url'
                  required
                  defaultValue={url}
                />
              </div>
              <div>
                <label htmlFor='description'>
                  Description
                </label>
                <textarea
                  name='description'
                  id='description'
                  defaultValue={description}
                />
              </div>
              <div>
                <label htmlFor='rating'>
                  Rating
                </label>
                <input
                  type='number'
                  name='rating'
                  id='rating'
                  min='1'
                  max='5'
                  defaultValue={rating}
                  required
                />
              </div>
              <div className='AddBookmark__buttons'>
                <button type='button' onClick={this.handleClickCancel}>
                  Cancel
                </button>
                {' '}
                <button type='submit'>
                  Save
                </button>
              </div>
            </form>
          </section>
        )
    }
}