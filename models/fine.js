/**
 * @module book
 * @type {object}
 */
module.exports = {

  attributes: {
    paid: { type: 'integer' },
    fineAmount: { type: 'integer' },
    bookloan: { model: 'bookloan', required: true }
  }
};
