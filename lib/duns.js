const Errors = require('./errors');

var Duns = function() {}
Duns.isValid = function(Duns) {
  if(!Duns) {
    return false;
  }

  var DunsNum = Duns.toString();
  DunsNum = DunsNum.replace(/-/g, '');

  if(DunsNum.length != 7 &&
    DunsNum.length != 8 &&
    DunsNum.length != 9 &&
    DunsNum.length != 13) {

    return false;
  }

  if (!DunsNum.match(/^\d+$/)) {
    return false;
  }

  return true;
}

Duns.format = function(Duns) {
  if(!this.isValid(Duns)) {
    throw Error(Errors.INVALID_DUNS);
  }

  DunsNum = Duns.toString();
  DunsNum = DunsNum.replace(/-/g, '');

  switch(DunsNum.length) {
    case 7: return "00" + DunsNum + "0000";
    case 8: return "0" + DunsNum + "0000";
    case 9: return DunsNum + "0000";
    default: return DunsNum;
  }
}

module.exports = Duns;
