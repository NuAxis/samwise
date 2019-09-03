'use strict';
var nock = require('nock');
var chai = require('chai');

var expect = chai.expect;
chai.should();

describe('Duns', function() {
  var Samwise = require('../../lib/index');
  var API_KEY = 'DEMO_KEY';
  var GOOD_DUNS = '1304770320000';
  var BAD_DUNS = '1234567890123';
  var SECURED_DUNS = '1234123412341';
  var GOOD_QTERMS = 'GSA';

  describe('#getSamDataPath', function() {
    it('should product v4 path correctly', function() {
      var formattedPath = Samwise.Api.getSamDataPath(API_KEY, GOOD_DUNS);
      expect(formattedPath).to.equal('/sam/v8/registrations/1304770320000?api_key=DEMO_KEY');
    });
  });

  describe('#getSamSearchPath', function() {
    it('should product V1 path correctly', function() {
      var formattedPath = Samwise.Api.getSamSearchPath(API_KEY, GOOD_QTERMS);
      expect(formattedPath).to.equal('/sam/v3/registrations?qterms=GSA&api_key=DEMO_KEY');
    });
  });

  describe('#searchEntities', function() {
    it('should throw error if api key is not passed', function() {
      (function() {
        Samwise.Api.searchEntities();
      }).should.throw(Samwise.Errors.API_KEY_OR_QTERMS_MISSING);
    });

    it('should return results array if correct params passed', function() {
      nock(Samwise.Api.baseUrl)
        .get(Samwise.Api.getSamSearchPath(API_KEY, GOOD_QTERMS))
        .replyWithFile(200, __dirname + '/replies/entities.json');

        Samwise.Api.searchEntities(API_KEY, GOOD_QTERMS, function(error, entities) {
          expect(error).to.equal(null);
          expect(entities).not.to.equal(null);
          expect(entities.length).to.equal(10);
        });
    });
  });

  describe('#getRegistration', function() {
    it('should throw error if api key is not passed', function() {
      (function() {
        Samwise.Api.getRegistration();
      }).should.throw(Samwise.Errors.API_KEY_OR_DUNS_MISSING);
    });

    it('should return 404 for invalid duns number', function() {
      nock(Samwise.Api.baseUrl)
        .get(Samwise.Api.getSamDataPath(API_KEY, BAD_DUNS))
        .replyWithFile(404, __dirname + '/replies/not_found.json');
      Samwise.Api.getRegistration(API_KEY, BAD_DUNS, function(error, registration) {
        expect(error).not.to.equal(null);
        expect(error.Code).to.equal(404);
      });
    });

    it('should return 403 for forbidded duns number', function() {
      nock(Samwise.Api.baseUrl)
        .get(Samwise.Api.getSamDataPath(API_KEY, SECURED_DUNS))
        .replyWithFile(403, __dirname + '/replies/forbidden.json');

      Samwise.Api.getRegistration(API_KEY, SECURED_DUNS, function(error, registration) {
        expect(error).not.to.equal(null);
        expect(error.Code).to.equal(403);
      });
    });

    it('should return registration for good duns number', function() {
      nock(Samwise.Api.baseUrl)
        .get(Samwise.Api.getSamDataPath(API_KEY, GOOD_DUNS))
        .replyWithFile(200, __dirname + '/replies/registration.json');

      Samwise.Api.getRegistration(API_KEY, GOOD_DUNS, function(error, registration) {
        expect(error).to.equal(null);
        expect(registration).not.to.equal(null);
        expect(registration.sam_data.registration.legalBusinessName).to.equal('GSA Proposal Maven, LLC');
      });
    });
  });

  describe('#getGovBusinessPointOfContact', function() {
    it('should throw error if api key is not passed', function() {
      (function() {
        Samwise.Api.getGovBusinessPointOfContact();
      }).should.throw(Samwise.Errors.API_KEY_OR_DUNS_MISSING);
    });

    it('should return gov business point of contact info for a valid duns number', function(done) {
      nock(Samwise.Api.baseUrl)
        .get(Samwise.Api.getSamDataPath(API_KEY, GOOD_DUNS))
        .replyWithFile(200, __dirname + '/replies/registration.json');
      Samwise.Api.getGovBusinessPointOfContact(API_KEY, GOOD_DUNS, function(error, reg) {
        expect(error).to.equal(null);
        expect(reg).not.to.equal(null);
        expect(reg.lastName).to.equal('GILES');
        done();
      });
    });

    it('should return 404 not acceptable for a bad duns', function(done) {
      nock(Samwise.Api.baseUrl)
        .get(Samwise.Api.getSamDataPath(API_KEY, BAD_DUNS))
        .replyWithFile(404, __dirname + '/replies/not_found.json');

      Samwise.Api.getGovBusinessPointOfContact(API_KEY, BAD_DUNS, function(error, reg) {
        expect(reg).to.equal(null);
        expect(error).not.to.equal(null);
        expect(error.Code).to.equal(404);
        done();
      });
    });
  });
});
