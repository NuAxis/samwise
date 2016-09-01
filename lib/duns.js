'use strict';

var Errors = require('./errors');

var Duns = function() {};
Duns.isValid = function(Duns) {
  if (!Duns) {
    return false;
  }

  var DunsNum = Duns.toString();
  DunsNum = DunsNum.replace(/-/g, '');

  if (DunsNum.length !== 7 &&
    DunsNum.length !== 8 &&
    DunsNum.length !== 9 &&
    DunsNum.length !== 13) {

    return false;
  }

  if (!DunsNum.match(/^\d+$/)) {
    return false;
  }

  return true;
};

Duns.format = function(Duns) {
  if (!this.isValid(Duns)) {
    throw Error(Errors.INVALID_DUNS);
  }

  var dunsNum = Duns.toString();
  dunsNum = dunsNum.replace(/-/g, '');

  switch (dunsNum.length) {
    case 7: return '00' + dunsNum + '0000';
    case 8: return '0' + dunsNum + '0000';
    case 9: return dunsNum + '0000';
    default: return dunsNum;
  }
};

module.exports = Duns;
