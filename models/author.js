/**
 * @module book
 * @type {object}
 */
module.exports = {

  attributes: {
    authorid: { type: 'string', required: true, unique: true, primaryKey:true },
    name: { type: 'string', required: true },
    books: { collection: 'book', via: 'authors' }
  }
};
