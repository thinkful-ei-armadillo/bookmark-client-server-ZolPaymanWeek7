/* global store, $, api, bm */

'use strict';

$.fn.extend({
  serializeJson: function () {
    const formData = new FormData(this[0]);
    const o = {};
    formData.forEach((val, name) => (o[name] = val));
    if (o["desc"] === '') { o["desc"] = " "; }
    return JSON.stringify(o);
  }
});

function main() {
  bm.bindEventListeners();
  api.getItems()
    .then((items) => {
      items.forEach(item => store.addNewBookmark(item));
      bm.render();
    });
}

$(main);
