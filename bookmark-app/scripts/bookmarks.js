'use strict';

/* global store, api */
var selectedIndex;

const bm = (function () {


  function editTemplate(bookmark) {
    return `
    <li data-item-id="${bookmark.id}" class="js-bookmark-entry bookmark-entry expanded">
      <form class="bookmark-edit-form js-bookmark-edit-form">
        <div class="js-bookmark-header-edit bookmark-header-edit">
          <input value="${bookmark.title}" name="title" class="js-website-name-edit website-name-edit">
          <input value="${bookmark.url}" name="url" class="js-website-url-edit website-url-edit">
          <div class="rating rating-edit js-star-rating">
             ${ratingHTML(true, bookmark.rating)}
          </div>
        </div>
        <textarea class="edit-description-entry js-edit-description-entry" rows="5" name="desc" >${bookmark.desc}</textarea>
        <ul class="edit-buttons js-edit-buttons">
          <button aria-label="Submit Button" type="submit" class="js-confirm-edit confirm-edit"><i class="fas fa-check"></i></button>
          <button aria-label="Cancel Button" type="reset" class="js-cancel-edit cancel-edit"><i class="fas fa-times"></i></button>
          <button aria-label="Delete Button" class="js-delete-entry delete-entry"><i class="fas fa-trash"></i></button>
        </ul>
        
      </form>
    </li>`;
  }

  function expandedTemplate(bookmark) {
    return `
          <li class="js-bookmark-entry bookmark-entry expanded" data-item-id="${bookmark.id}">
            <div class="js-bookmark-header bookmark-header">
              <span class="js-website-name website-name">${bookmark.title}</span>
              <span class="js-website-url website-url">${bookmark.url}</span>
              <div class="rating js-star-rating">
                  ${ratingHTML(false, bookmark.rating)}
              </div>
            </div>
            <div class="expanded-text-container">
              <p class="description-entry js-description-entry">${bookmark.desc}</p>
              <a target="_blank" href="${bookmark.url}">Visit Site</a>
            </div>
            <div class="button-container">
              <button class="js-edit-entry-button"><i class="fas fa-edit"></i></button>
              <button class="js-delete-entry delete-entry"><i class="fas fa-trash"></i></button>
            </div>
        </li>
        `;
  }

  function ratingHTML(editing, rating) {
    let string = '';
    rating = parseInt(rating);
    for (let i = 5; i > 0; i--) {
      if (editing) {
        string += `<span class="${(i === rating) ? 'checked' : ''}"><input type="radio" name="rating" id="star-${i}" value="${i}"><label for="star-${i}"></label></span>`
      } else {
        string += `<span class="${(i === rating) ? 'checked' : ''}"><label></label></span>`
      }
    }
    return string;
  }

  function defaultTemplate(bookmark) {
    return `
        <li class="js-bookmark-entry bookmark-entry condensed" data-item-id="${bookmark.id}">
          <div class="js-bookmark-header bookmark-header">
            <span class="js-website-name website-name">${bookmark.title}</span>
            <span class="js-website-url website-url">${bookmark.url}</span>
            <div class="rating js-star-rating">
              ${ratingHTML(false, bookmark.rating)}
            </div>
          </div
        </li>`;
  }

  function generateBookmarkHTML(bookmark) {
    const expandedId = store.expandedId;
    //Expanded View
    if (bookmark.id === expandedId) {
      if (store.editing) {
        return editTemplate(bookmark);
      }
      return expandedTemplate(bookmark);
    }
    //Default/Condensed View
    return defaultTemplate(bookmark);
  }

  function generateBookmarksString(bookmarks) {
    const items = bookmarks.map(item => generateBookmarkHTML(item));
    return items.join('');
  }

  function render() {
    selectedIndex = 0;
    let items = [...store.bookmarks];

    if (store.addForm) {
      $('.js-add-new-form').removeClass('hidden');
    } else {
      $('.js-add-new-form').addClass('hidden');
    }

    //search filter
    const searchFilter = store.searchTerm;
    if (searchFilter !== '') {
      items = items.filter(item => item.desc.includes(searchFilter) || item.title.includes(searchFilter));
    }

    //rating filter
    const ratingFilter = store.ratingFilter;
    if (ratingFilter >= 1) {
      items = items.filter(item => item.rating && item.rating >= ratingFilter);
    }

    //render the bookmarks
    const bookmarksString = generateBookmarksString(items);
    $('#js-bookmarks').html(bookmarksString);

    //render the error
    renderError();
  }

  function renderError() {
    if (store.error) {
      $('.js-error-alert').removeClass('hidden');
      $('#error-msg').text(store.error);
    } else {
      $('.js-error-alert').addClass('hidden');
    }

  }

  function handleRatingsFilter() {
    $('#js-filter-by-rating-entry').change(event => {
      const ratingToFilter = $('#js-filter-by-rating-entry').val();
      store.updateRatingsFilter(ratingToFilter);
      render();
    });
  }

  function handleClickOnBookmark() {
    $('#js-bookmarks').on('click', '.js-bookmark-header', event => {
      const liItem = $(event.currentTarget).parent();
      const id = liItem.data('item-id');
      store.setExpandedId(id);
      render();
    });
  }

  function handleDeleteBookmark() {
    $('#js-bookmarks').on('click', '.js-delete-entry', function (event) {
      const id = $(event.currentTarget).closest('li').data('item-id');
      api
        .deleteItem(id)
        .then(() => {
          store.deleteBookmark(id);
          render();
        })
        .catch(error => {
          store.setError(error.message);
          render();
        });
    });

  }

  function handleClickEditBookmark() {
    $('#js-bookmarks').on('click', '.js-edit-entry-button', function (event) {
      store.setEditing(true);
      render();
    });
  }

  function handleEditSubmitBookmark() {
    $('#js-bookmarks').on('submit', '.js-bookmark-edit-form', function (event) {
      //grabFormValues
      event.preventDefault();
      const obj = $('.js-bookmark-edit-form').serializeJson();
      const id = $(event.currentTarget).parent().data('item-id');

      api
        .editItem(obj, id)
        .then(() => {
          store.editBookmark(obj, id);
          render();
        })
        .catch(error => {
          store.setError(error.message);
          render();
        });

      //promise statement
      /*store.addNewBoomkark();
      render();

      //catch
      store.setError();
      render();*/
    });
  }

  function handleEditCancelBookmark() {
    $('#js-bookmarks').on('reset', '.js-bookmark-edit-form', function (event) {
      store.setEditing(false);
      render();
    });
  }

  function handleAddNewBookmark() {
    $('#js-add-new-button').click(function (event) {
      //disable click new
      store.setAddForm(true);
      render();
    });
  }

  function handleCancelNewBookmark() {
    $('#js-add-new-cancel').click(function (event) {
      store.setAddForm(false);
      resetRatingEntry();
      render();
    });
  }

  function handleSubmitNewBoomkark() {
    $('.js-add-new-form').submit(function (event) {
      //grabFormValues
      event.preventDefault();
      const obj = $('.js-add-new-form').serializeJson();

      api
        .createItem(obj)
        .then(data => {
          store.addNewBookmark(data);
          resetRatingEntry();
          store.setAddForm(false);
          $('.js-add-new-form').trigger('reset');
          render();
        })
        .catch(error => {
          store.setError(error.message);
          render();
        });

      //promise statement
      /*store.addNewBoomkark();
      render();

      //catch
      store.setError();
      render();*/
    });
  }

  function handleSearchFilter() {
    $('#js-search-entry').on('keyup', function (event) {
      const term = $(event.currentTarget).val();
      store.setSearchTerm(term);
      render();
    });
  }

  function handleCloseErrorAlert() {
    $('.error-close-btn').click(function (event) {
      $('#error-msg').empty();
      store.setError(null);
      render();

    });
  }

  function resetRatingEntry() {
    $('.js-add-new-form .rating span').removeClass('checked');
  }

  function handleRatingButtons() {
    selectedIndex = 0;
    $('main').on('click', '.js-star-rating input', function () {
      selectedIndex = $(this).closest('div').find('span.checked input').val();
      // $('.js-add-new-form .js-star-rating.rating-edit span').removeClass('checked');
      $(this).closest('div').find('span').removeClass('checked');
      $(this).parent().addClass('checked');
    });

    $('main').on('mouseenter', '.js-star-rating input', function () {

      const $el = $(this).closest('div');
      if ($(this).closest('div').find('span.checked input').length !== 0) {
        selectedIndex = $(this).closest('div').find('span.checked input').val();
      }

      if (selectedIndex !== 0) {
        $el.find('span.checked').removeClass('checked');
      }
      $(this).closest('div').find('.hover').removeClass('hover');
      $(this).parent().addClass('hover');
    });
    $('main').on('mouseleave', '.rating-edit', function () {
      $(this).closest('div').find('.hover').removeClass('hover');
      $(this).closest('div').find(`#star-${selectedIndex}`).parent().addClass('checked');

    });
  }

  function bindEventListeners() {
    handleAddNewBookmark();
    handleSubmitNewBoomkark();
    handleCancelNewBookmark();
    handleDeleteBookmark();
    handleClickEditBookmark();
    handleEditSubmitBookmark();
    handleEditCancelBookmark();
    handleRatingsFilter();
    handleClickOnBookmark();
    handleSearchFilter();
    handleCloseErrorAlert();
    handleRatingButtons();
  }

  return { render, bindEventListeners };
})();
