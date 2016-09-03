'use strict';

var nock = require('nock');

describe('Duns', function() {
  var Samwise = require('../../lib/index');
  var API_KEY = 'DEMO_KEY';
  var GOOD_DUNS = '1304770320000';
  var BAD_DUNS = '1234567890123';
  var SECURED_DUNS = '1234123412341';
  var GOOD_QTERMS = 'GSA';

  describe('#getSamV4Path', function() {
    it('should product v4 path correctly', function() {
      var formattedPath = Samwise.Api.getSamV4Path(API_KEY, GOOD_DUNS);
      expect(formattedPath).toBe('/sam/v4/registrations/1304770320000?api_key=DEMO_KEY');
    });
  });

  describe('#getSamV1Path', function() {
    it('should product V1 path correctly', function() {
      var formattedPath = Samwise.Api.getSamV1Path(API_KEY, GOOD_QTERMS);
      expect(formattedPath).toBe('/sam/v1/registrations?qterms=GSA&api_key=DEMO_KEY');
    });
  });

  describe('#getRegistrations', function() {
    it('should throw error if api key is not passed', function() {
      expect(function() {
        Samwise.Api.getRegistrations();
      }).toThrowError(Samwise.Errors.API_KEY_OR_QTERMS_MISSING);
    });

    it('should return results array if correct params passed', function() {
      nock(Samwise.Api.baseUrl)
        .get(Samwise.Api.getSamV1Path(API_KEY, GOOD_QTERMS))
        .replyWithFile(200, __dirname + '/replies/registrations.json');

        Samwise.Api.getRegistrations(API_KEY, GOOD_QTERMS, function(error, registrations) {
          expect(error).toBeNull();
          expect(registrations).not.toBeNull();
          expect(registrations.length).toBe(10);
        });
    });
  });

  describe('#getRegistration', function() {
    it('should throw error if api key is not passed', function() {
      expect(function() {
        Samwise.Api.getRegistration();
      }).toThrowError(Samwise.Errors.API_KEY_OR_DUNS_MISSING);
    });

    it('should return 404 for invalid duns number', function() {
      nock(Samwise.Api.baseUrl)
        .get(Samwise.Api.getSamV4Path(API_KEY, BAD_DUNS))
        .replyWithFile(404, __dirname + '/replies/not_found.json');
      Samwise.Api.getRegistration(API_KEY, BAD_DUNS, function(error, registration) {
        expect(error).not.toBeNull();
        expect(error.Code).toBe(404);
      });
    });

    it('should return 403 for forbidded duns number', function() {
      nock(Samwise.Api.baseUrl)
        .get(Samwise.Api.getSamV4Path(API_KEY, SECURED_DUNS))
        .replyWithFile(403, __dirname + '/replies/forbidden.json');

      Samwise.Api.getRegistration(API_KEY, SECURED_DUNS, function(error, registration) {
        expect(error).not.toBeNull();
        expect(error.Code).toBe(403);
      });
    });

    it('should return registration for good duns number', function() {
      nock(Samwise.Api.baseUrl)
        .get(Samwise.Api.getSamV4Path(API_KEY, GOOD_DUNS))
        .replyWithFile(200, __dirname + '/replies/registration.json');

      Samwise.Api.getRegistration(API_KEY, GOOD_DUNS, function(error, registration) {
        expect(error).toBeNull();
        expect(registration).not.toBeNull();
        expect(registration.sam_data.registration.legalBusinessName).toBe('GSA Proposal Maven, LLC');
      });
    });
  });

  describe('#getGovBusinessPointOfContact', function() {
    it('should throw error if api key is not passed', function() {
      expect(function() {
        Samwise.Api.getGovBusinessPointOfContact();
      }).toThrowError(Samwise.Errors.API_KEY_OR_DUNS_MISSING);
    });

    it('should return gov business point of contact info for a valid duns number', function(done) {
      nock(Samwise.Api.baseUrl)
        .get(Samwise.Api.getSamV4Path(API_KEY, GOOD_DUNS))
        .replyWithFile(200, __dirname + '/replies/registration.json');
      Samwise.Api.getGovBusinessPointOfContact(API_KEY, GOOD_DUNS, function(error, reg) {
        expect(error).toBeNull();
        expect(reg).not.toBeNull();
        expect(reg.lastName).toBe('GILES');
        done();
      });
    });

    it('should return 404 not acceptable for a bad duns', function(done) {
      nock(Samwise.Api.baseUrl)
        .get(Samwise.Api.getSamV4Path(API_KEY, BAD_DUNS))
        .replyWithFile(404, __dirname + '/replies/not_found.json');

      Samwise.Api.getGovBusinessPointOfContact(API_KEY, BAD_DUNS, function(error, reg) {
        expect(reg).toBeNull();
        expect(error).not.toBeNull();
        expect(error.Code).toBe(404);
        done();
      });
    });
  });
});
