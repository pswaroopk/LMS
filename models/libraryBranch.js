/**
 * @module book
 * @type {object}
 */
module.exports = {

  attributes: {
    branchid: { type: 'string', required: true, unique: true, primaryKey:true},
    name: { type: 'string', required: true },
    address: { type: 'string' },
    bookcopies: { collection: 'bookcopy', via: 'branchid' }
  }
};
