module.exports = {

  attributes: {
    loanId: { type: 'number', required: true, primaryKey: true },
    bookcopy: { model: 'bookcopy', required: true },
    dateOut: { type: 'date' },
    dateIn: { type: 'date' },
    dueDate: { type: 'date' }
  }
};
 
