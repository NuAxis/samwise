'use strict';

var nock = require('nock');

describe('Duns', function() {
  var Samwise = require('../../lib/index');
  var API_KEY = '1234567890abcdefghijklmnopqrstuvwxyz1234';
  var GOOD_DUNS = '1304770320000';
  var INVALID_DUNS = '123456';
  var BAD_DUNS = '1234567890123';

  describe('#formatPath', function() {
    it('should format path correctly', function() {
      var formattedPath = Samwise.Api.formatPath(API_KEY, GOOD_DUNS);
      expect(formattedPath).toBe('/sam/v4/registrations/1304770320000?api_key=1234567890abcdefghijklmnopqrstuvwxyz1234');
    });
  });

  describe('#getRegistration', function() {
    it('should return registration info for a valid duns number', function(done) {
      nock(Samwise.Api.baseUrl)
        .get(Samwise.Api.formatPath(API_KEY, GOOD_DUNS))
        .reply(200, {
          sam_data: {
            registration: {
              legalBusinessName: 'Fake LLC',
              govtBusinessPoc: {
                firstName: 'John',
                lastName: 'Doe',
                usPhone: '1234567890',
                fax: '1234567890',
                email: 'john.doe@fake.com',
                address:
                 { zipPlus4: '1234',
                   zip: '12345',
                   countryCode: 'USA',
                   line1: '1234 Good Street',
                   stateorProvince: 'DC',
                   line2: 'Suite 123',
                   city: 'Washington' }
                 }
              }
            }
        });
      Samwise.Api.getRegistration(API_KEY, GOOD_DUNS, function(error, reg) {
        expect(error).toBeNull();
        expect(reg).not.toBeNull();
        expect(reg.legalBusinessName).toBe('Fake LLC');
        done();
      });
    });

    it('should return 406 not acceptable for a bad duns', function(done) {
      nock(Samwise.Api.baseUrl)
        .get(Samwise.Api.formatPath(API_KEY, BAD_DUNS))
        .reply(406, {});

      Samwise.Api.getRegistration(API_KEY, BAD_DUNS, function(error, reg) {
        expect(reg).toBeNull();
        expect(error).not.toBeNull();
        expect(error.statusCode).toBe(406);
        done();
      });
    });

    it('should throw error if duns is invalid', function() {
      expect(function() {
        Samwise.Api.getRegistration(API_KEY, INVALID_DUNS);
      }).toThrowError(Samwise.Errors.INVALID_DUNS);
    });
  });
});
