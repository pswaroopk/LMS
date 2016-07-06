/**
 * @module book
 * @type {object}
 */
module.exports = {

  attributes: {
    isbn: { type: 'string', required: true, unique: true , primaryKey:true },
    title: { type: 'string', defaultsTo: 'NA' },
    author: { model: 'author' },
  }
};
