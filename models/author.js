/**
 * @module book
 * @type {object}
 */
module.exports = {

  attributes: {
    name: { type: 'string', required: true },
    books: { collection: 'book', via: 'authors' }
  }
};
