const express = require('express');
const logger = require('../logger');
const uuid = require('uuid/v4');
const bookmarkRouter = express.Router();
const bodyParser = express.json();
const BookmarksService = require('../bookmarks-service');
const xss = require('xss');
const path = require('path');

const serializeBookmark = bookmark => ({
  id: bookmark.id,
  title: xss(bookmark.title),
  description: xss(bookmark.description),
  url: xss(bookmark.url),
  rating: bookmark.rating
});

bookmarkRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    BookmarksService.getAllBookmarks(knexInstance)
      .then(bookmarks => {
        res.json(bookmarks);
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { title, url, rating, description } = req.body;
    const newBookmark = { title, url, rating };

    for (const [key, value] of Object.entries(newBookmark))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });

    if (rating < 0 || rating > 5) {
      return res.status(400).json({
        error: { message: 'Rating must be between 0-5' }
      });
    }

    newBookmark.description = description;

    BookmarksService.insertBookmark(req.app.get('db'), newBookmark)
      .then(bookmark => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${bookmark.id}`))
          .json(serializeBookmark(bookmark));
      })
      .catch(next);
  });
bookmarkRouter
  .route('/:id')
  .all((req, res, next) => {
    BookmarksService.getById(req.app.get('db'), req.params.id)
      .then(bookmark => {
        if (!bookmark) {
          return res.status(404).json({
            error: { message: "bookmark doesn't exist" }
          });
        }
        res.bookmark = bookmark; // save the article for the next middleware
        next(); // don't forget to call next so the next middleware happens!
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeBookmark(res.bookmark));
    // .get((req, res, next) => {
    //   const { id } = req.params;
    //   // const bookmark1 = bookmark.find(c => c.id == id);
    //   const knexInstance = req.app.get('db');
    //   BookmarksService.getById(knexInstance, id)
    //     .then(bookmark => {
    //       res.json(bookmark);
    //     })
    //     .catch(next);
    // make sure we found a bookmark
    // if (!bookmark1) {
    //   logger.error(`bookmark with id ${id} not found.`);
    //   return res.status(404).send('bookmark Not Found');
    // }

    // res.json(bookmark1);
  })
  .delete((req, res, next) => {
    const { id } = req.params;
    BookmarksService.deleteBookmark(req.app.get('db'), req.params.id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const { title, url, description, rating } = req.body;
    const bookmarkToUpdate = { title, url, description, rating };

    const numberOfValues = Object.values(bookmarkToUpdate).filter(Boolean)
      .length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must content either 'title', 'url' or 'description' or 'rating'`
        }
      });
    }

    BookmarksService.updateBookmark(
      req.app.get('db'),
      req.params.id,
      bookmarkToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = bookmarkRouter;
