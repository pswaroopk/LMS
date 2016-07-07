/**
 * @module book
 * @type {object}
 */
module.exports = {

  attributes: {
    name: { type: 'string', required: true },
    // books: { collection: 'book', via: 'authors' },
    books: { collection: 'book', via: 'author', through: 'bookauthor'  }
  }
};
