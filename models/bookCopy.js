/**
 * @module book
 * @type {object}
 */
module.exports = {

  attributes: {
    bookId: { type: 'string', required: true, unique: true ,primaryKey:true},
    isbn: { model: 'book', required: true },
    branchId: { model: 'librarybranch', required: true }
  }
};
