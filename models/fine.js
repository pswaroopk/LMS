/**
 * @module book
 * @type {object}
 */
module.exports = {

  attributes: {
    paid: { type: 'number' },
    fineAmount: { type: 'number' },
    bookloan: { model: 'bookloan', required: true }
  }
};
