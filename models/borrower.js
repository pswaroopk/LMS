/**
 * @module book
 * @type {object}
 */
module.exports = {

  attributes: {
    cardno: { type: 'string', required: true, primaryKey: true },
    ssn: { type: 'string', required: true },
    fname: { type: 'string', required: true },
    lname: { type: 'string' },
    address: { type: 'string', required: true },
    city: { type: 'string' },
    state: { type: 'string' },
    phone: { type: 'string' }
  }
};
