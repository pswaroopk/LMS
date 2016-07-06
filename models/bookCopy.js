/**
 * @module book
 * @type {object}
 */
module.exports = {

  attributes: {
    bookId: { type: 'string', required: true, unique: true ,primaryKey:true},
    book: { model: 'book', required: true },
    librarybranch: { model: 'librarybranch', required: true }
  }
};
