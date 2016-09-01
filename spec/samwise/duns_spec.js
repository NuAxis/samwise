describe("Duns", function() {
  const Samwise = require('../../lib/index');
  const sevenDuns =  '8837177';
  const eightDuns = '88371771';
  const nineDuns = '883717717';
  const thirteenDuns = '0223841150000';
  const hyphenDuns = '08-011-5718';
  const lettersDuns = 'abc12345678';
  const badDunses = [
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
      var thirteenDunsTest = Samwise.Duns.isValid(thirteenDuns);

      expect(thirteenDunsTest).toBeTruthy();
    });

    it('should return true when the Duns is 9 digits (not counting hyphens)', function() {
      var nineDunsTest = Samwise.Duns.isValid(nineDuns);

      expect(nineDunsTest).toBeTruthy();
    });

    it('should return true when the Duns is 8 digits (not counting hyphens)', function() {
      var eightDunsTest = Samwise.Duns.isValid(eightDuns);

      expect(eightDunsTest).toBeTruthy();
    });

    it('should return true when the Duns is 7 digits (not counting hyphens)', function() {
      var sevenDunsTest = Samwise.Duns.isValid(sevenDuns);

      expect(sevenDunsTest).toBeTruthy();
    });

    it('should return false when the Duns is not 8, 9, or 13 digits (not counting hyphens)', function() {
      for (i = 0; i < badDunses.length; i++) {
        expect(Samwise.Duns.isValid(badDunses[i])).toBeFalsy();
      }
    });

    it('should return false when the Duns contains letters', function() {
      var lettersDunsTest = Samwise.Duns.isValid(lettersDuns);

      expect(lettersDunsTest).toBeFalsy();
    });

    it('should return false when the Duns number is nil', function() {
      var nullDunsTest = Samwise.Duns.isValid(null);

      expect(nullDunsTest).toBeFalsy();
    });
  });

  describe('#format', function() {
    it('should format an 7 digit Duns into a 13 digit Duns', function() {
      var formattedDuns = Samwise.Duns.format(sevenDuns);

      expect(formattedDuns.length).toEqual(13);
    });

    it('should format an 8 digit Duns into a 13 digit Duns', function() {
      var formattedDuns = Samwise.Duns.format(eightDuns);

      expect(formattedDuns.length).toEqual(13);
    });

    it('should format a 9 digit Duns into a 13 digit Duns', function() {
      var formattedDuns = Samwise.Duns.format(nineDuns);

      expect(formattedDuns.length).toEqual(13);
    });

    it('should remove hyphens from a Duns number', function() {
      var formattedDuns = Samwise.Duns.format(hyphenDuns);

      expect(formattedDuns).toEqual('0801157180000');
    });

    it('should raise a error if the Duns is invalid', function() {
      for (i = 0; i < badDunses.length; i++) {
        expect(function() {
          Samwise.Duns.format(badDunses[i])
        }).toThrowError(Samwise.Errors.INVALID_DUNS);
      }
    });
  });
});
