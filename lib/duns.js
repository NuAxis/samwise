'use strict';

var Errors = require('./errors');

var Duns = {
  isValid: function(duns) {
    if (!duns) {
      return false;
    }

    var dunsNum = duns.toString();
    dunsNum = dunsNum.replace(/-/g, '');

    if (dunsNum.length !== 7 &&
      dunsNum.length !== 8 &&
      dunsNum.length !== 9 &&
      dunsNum.length !== 13) {

      return false;
    }

    if (!dunsNum.match(/^\d+$/)) {
      return false;
    }

    return true;
  },

  format: function(duns) {
    if (!this.isValid(duns)) {
      throw Error(Errors.INVALID_DUNS);
    }

    var dunsNum = duns.toString();
    dunsNum = dunsNum.replace(/-/g, '');

    switch (dunsNum.length) {
      case 7: return '00' + dunsNum + '0000';
      case 8: return '0' + dunsNum + '0000';
      case 9: return dunsNum + '0000';
      default: return dunsNum;
    }
  }
};

module.exports = Duns;
