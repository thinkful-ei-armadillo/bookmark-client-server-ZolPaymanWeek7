'use strict';

const api = (function () {
  const BASE_URL =
    'https://thinkful-list-api.herokuapp.com/PaymanAlex/bookmarks';
  const headers = {
    'Content-Type': 'application/json'
  };

  function listApiFetch(...args) {
    let error = false;
    return fetch(...args)
      .then(res => {
        if (!res.ok) {
          error = true;
        }
        return res.json();
      })
      .then(data => {
        if (error) {
          throw new Error(data.message);
        }
        return data;
      });
  }

  function createItem(data) {
    const params = { method: 'POST', headers, body: data };
    return listApiFetch(`${BASE_URL}`, params);
  }

  function editItem(data, id) {
    const params = { method: 'PATCH', headers, body: data };
    return listApiFetch(`${BASE_URL}/${id}`, params);
  }

  function getItems() {
    const params = { method: 'GET', headers };
    return listApiFetch(`${BASE_URL}`, params);
  }

  function deleteItem(id) {
    const params = { method: 'DELETE', headers };
    return listApiFetch(`${BASE_URL}/${id}`, params);
  }

  return {
    createItem,
    deleteItem,
    getItems,
    editItem
  };
})();
