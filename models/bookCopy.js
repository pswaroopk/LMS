/**
 * @module book
 * @type {object}
 */
module.exports = {

  attributes: {
    isbn: { model: 'book', required: true },
    branchid: { model: 'librarybranch', required: true }
  }
};
