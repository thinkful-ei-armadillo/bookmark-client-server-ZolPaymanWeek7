import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import AddBookmark from './AddBookmark/AddBookmark';
import BookmarkList from './BookmarkList/BookmarkList';
import BookmarksContext from './BookmarksContext';
import Nav from './Nav/Nav';
import EditBookmark from './EditBookmark/EditBookmark';
import config from './config';
import './App.css';

class App extends Component {
  state = {
    bookmarks: [],
    error: null
  };

  setBookmarks = bookmarks => {
    this.setState({
      bookmarks,
      error: null
    });
  };

  addBookmark = bookmark => {
    this.setState({
      bookmarks: [...this.state.bookmarks, bookmark]
    });
  };

  updateBookmark = updatedBookmark => {
    const newBookmarks = this.state.bookmarks.map(bookmark =>
      Number(bookmark.id) === Number(updatedBookmark.id)
        ? updatedBookmark
        : bookmark
    );
    console.log(newBookmarks);
    this.setState({
      bookmarks: newBookmarks
    });
  };

  componentDidMount() {
    fetch(config.API_ENDPOINT, {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.json();
      })
      .then(this.setBookmarks)
      .catch(error => this.setState({ error }));
  }

  render() {
    const contextValue = {
      bookmarks: this.state.bookmarks,
      addBookmark: this.addBookmark,
      updateBookmark: this.updateBookmark
    };
    debugger;
    return (
      <main className="App">
        <h1>Bookmarks!</h1>
        <BookmarksContext.Provider value={contextValue}>
          <Nav />
          <div className="content" aria-live="polite">
            <Route path="/add-bookmark" component={AddBookmark} />
            <Route exact path="/" component={BookmarkList} />
            <Route path="/edit/:bookmarkId" component={EditBookmark} />
          </div>
        </BookmarksContext.Provider>
      </main>
    );
  }
}

export default App;
