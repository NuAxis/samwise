'use strict';
var chai = require('chai');
var expect = chai.expect;
chai.should();

describe('Duns', function() {
  var Samwise = require('../../lib/index');
  var SEVEN_DUNS =  '8837177';
  var EIGHT_DUNS = '88371771';
  var NINE_DUNS = '883717717';
  var THIRTEEN_DUNS = '0223841150000';
  var HYPHEN_DUNS = '08-011-5718';
  var LETTERS_DUNS = 'abc1234567890';
  var BAD_DUNSES = [
      '1234567890',
      '12345678901',
      '123456789011',
      '1',
      '',
      '--',
      '12345678901234567890'
    ];

  describe('#isVaid', function() {
    it('should return true when the Duns is 13 digits (not counting hyphens)', function() {
      var THIRTEEN_DUNSTest = Samwise.Duns.isValid(THIRTEEN_DUNS);

      expect(THIRTEEN_DUNSTest).to.equal(true);
    });

    it('should return true when the Duns is 9 digits (not counting hyphens)', function() {
      var NINE_DUNSTest = Samwise.Duns.isValid(NINE_DUNS);

      expect(NINE_DUNSTest).to.equal(true);
    });

    it('should return true when the Duns is 8 digits (not counting hyphens)', function() {
      var EIGHT_DUNSTest = Samwise.Duns.isValid(EIGHT_DUNS);

      expect(EIGHT_DUNSTest).to.equal(true);
    });

    it('should return true when the Duns is 7 digits (not counting hyphens)', function() {
      var SEVEN_DUNSTest = Samwise.Duns.isValid(SEVEN_DUNS);

      expect(SEVEN_DUNSTest).to.equal(true);
    });

    it('should return false when the Duns is not 8, 9, or 13 digits (not counting hyphens)', function() {
      for (var i = 0; i < BAD_DUNSES.length; i++) {
        expect(Samwise.Duns.isValid(BAD_DUNSES[i])).to.equal(false);
      }
    });

    it('should return false when the Duns contains letters', function() {
      var LETTERS_DUNSTest = Samwise.Duns.isValid(LETTERS_DUNS);

      expect(LETTERS_DUNSTest).to.equal(false);
    });

    it('should return false when the Duns number is nil', function() {
      var nullDunsTest = Samwise.Duns.isValid(null);

      expect(nullDunsTest).to.equal(false);
    });
  });

  describe('#format', function() {
    it('should format an 7 digit Duns into a 13 digit Duns', function() {
      var formattedDuns = Samwise.Duns.format(SEVEN_DUNS);

      expect(formattedDuns.length).to.equal(13);
    });

    it('should format an 8 digit Duns into a 13 digit Duns', function() {
      var formattedDuns = Samwise.Duns.format(EIGHT_DUNS);

      expect(formattedDuns.length).to.equal(13);
    });

    it('should format a 9 digit Duns into a 13 digit Duns', function() {
      var formattedDuns = Samwise.Duns.format(NINE_DUNS);

      expect(formattedDuns.length).to.equal(13);
    });

    it('should remove hyphens from a Duns number', function() {
      var formattedDuns = Samwise.Duns.format(HYPHEN_DUNS);

      expect(formattedDuns).to.equal('0801157180000');
    });

    it('should raise a error if the Duns is invalid', function() {
      for (var i = 0; i < BAD_DUNSES.length; i++) {
        (function() {
          Samwise.Duns.format(BAD_DUNSES[i]);
        }).should.throw(Samwise.Errors.INVALID_DUNS);
      }
    });
  });
});
