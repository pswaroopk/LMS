var Promise = require('bluebird');
/**
 * @module book
 * @type {object}
 */
module.exports = {

  attributes: {
    //loanid: {model: 'integer' required true}
    fineamount: { type: 'float' },
    paid: { type: 'boolean', defaultsTo: false},
    bookloan: { model: 'bookloan', required: true }
  },

  updateFine: function(bookloan){
    var Model = this;
    var timeDiff = (bookloan.datein.getTime() - bookloan.duedate.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays < 1) return new Promise(function(resolve, reject){ resolve (); });
    var fine = 0.25* diffDays
    return this.findOrCreate({
      bookloan: bookloan.id
    }, {
      fineamount: fine,
      bookloan: bookloan.id
    })
  }
};
