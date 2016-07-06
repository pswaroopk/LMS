/**
 * @module book
 * @type {object}
 */
module.exports = {

  attributes: {
    name: { type: 'string', required: true },
    address: { type: 'string' },
    bookcopies: { collection: 'bookcopy', via: 'librarybranch' }
  }
};
