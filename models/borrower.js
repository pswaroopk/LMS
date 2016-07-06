/**
 * @module book
 * @type {object}
 */
module.exports = {

  attributes: {    
    cardNo: { type: 'string', required: true, primaryKey: true },
    ssn: { type: 'string' },
    fname: { type: 'string' },
    lname: { type: 'string' },
    address: { type: 'string' },
    phone: { type: 'string' }
  }
};