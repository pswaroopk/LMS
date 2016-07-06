/**
 * @module book
 * @type {object}
 */
module.exports = {

  attributes: {
    authorId: { type: 'string', required: true, unique: true, primaryKey:true },
    name: { type: 'string', required: true },
    books: { collection: 'book', via: 'author' }
  }
};
