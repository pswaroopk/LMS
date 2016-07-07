module.exports = {

  attributes: {
    loanId: { type: 'integer', required: true, primaryKey: true },
    bookcopy: { model: 'bookcopy', required: true },
    dateOut: { type: 'date' },
    dateIn: { type: 'date' },
    dueDate: { type: 'date' }
  }
};
