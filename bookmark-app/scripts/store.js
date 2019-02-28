'use strict';
const store = (function () {
  function setAddForm(value) {
    this.addForm = value;
  }

  function setError(message) {
    this.error = message;
  }

  function findById(id) {
    return this.bookmarks.find(bookmark => bookmark.id === id);
  }

  function setEditing(value) {
    this.editing = value;
    //set to true
  }

  function updateRatingsFilter(num) {
    this.ratingFilter = num;
  }

  function setExpandedId(id) {
    if (id !== this.expandedId) {
      this.setEditing(false);
      this.expandedId = id;
    } else if (this.editing === false) {
      this.expandedId = null;
    }
  }

  function setSearchTerm(term) {
    this.searchTerm = term;
  }

  function addNewBookmark(object) {
    this.bookmarks.push(object);
  }

  function deleteBookmark(id) {
    this.bookmarks = this.bookmarks.filter(element => element.id !== id);
    this.editing = false;
    this.expandedId = null;
  }

  function editBookmark(obj, id) {
    const bookmark = this.findById(id);
    obj = JSON.parse(obj);
    Object.assign(bookmark, obj);
    this.setEditing(false);
  }

  return {
    setAddForm,
    addNewBookmark,
    setEditing,
    setExpandedId,
    deleteBookmark,
    editBookmark,
    findById,
    updateRatingsFilter,
    setSearchTerm,
    setError,
    editing: false,
    expandedId: null,
    bookmarks: [],
    addForm: false,
    error: null,
    searchTerm: '',
    ratingFilter: 0
  };
})();
