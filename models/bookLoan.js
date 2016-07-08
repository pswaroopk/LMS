module.exports = {

  attributes: {
    loanid: { type: 'integer', required: true, primaryKey: true },
    bookcopy: { model: 'bookcopy', required: true },
    cardno: { model: 'borrower', required: true }
    dateOut: { type: 'date' },
    dateIn: { type: 'date' },
    dueDate: { type: 'date' }
  }
};
