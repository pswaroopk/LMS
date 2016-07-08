module.exports = {

  attributes: {
    bookcopy: { model: 'bookcopy', required: true },
    cardno: { model: 'borrower', required: true },
    dateout: { type: 'date', required: true },
    datein: { type: 'date' },
    duedate: { type: 'date' }
  }
};
