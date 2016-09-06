'use strict';

var request = require('request');
var errors = require('./errors');
var dunsUtil = require('./duns');

var Api = {
  baseUrl:  process.env.SAM_GOV_API_URL || 'https://api.data.gov',
  pathV1: '/sam/v1/registrations',
  pathV4: '/sam/v4/registrations',

  getSamV4Path: function(apiKey, duns) {
    return this.pathV4 + '/' + duns + '?api_key=' + apiKey;
  },

  getSamV1Path: function(apiKey, qterms) {
    return this.pathV1 + '?qterms=' + qterms + '&api_key=' + apiKey;
  },

  searchEntities: function(apiKey, qterms, callback) {
    /* istanbul ignore next */
    callback = callback || function() {};
    if (!apiKey || !qterms) {
      throw new Error(errors.API_KEY_OR_QTERMS_MISSING);
    }

    var url = this.baseUrl + this.getSamV1Path(apiKey, qterms);

    var options = { 'url': url, 'json': true };
    var registrations = {};

    request(options, function(error, response, body) {
      /* istanbul ignore if */
      if (error) {
        callback(error, null);
        return;
      }

      if (response.statusCode !== 200) {
        callback({ Code: response.statusCode}, null);
        return;
      }

      registrations = body.results;

      callback(null, registrations);
    });
  },

  getRegistration: function(apiKey, duns, callback) {
    /* istanbul ignore next */
    callback = callback || function() {};
    if (!apiKey || !duns) {
      throw new Error(errors.API_KEY_OR_DUNS_MISSING);
    }

    var formattedDuns = dunsUtil.format(duns);
    var url = this.baseUrl + this.getSamV4Path(apiKey, formattedDuns);

    var options = { 'url': url, 'json': true };
    var registration = {};

    request(options, function(error, response, body) {
      /* istanbul ignore if */
      if (error) {
        callback(error, null);
        return;
      }

      if (response.statusCode !== 200) {
        callback({ Code: response.statusCode}, null);
        return;
      }

      registration = body;

      callback(null, registration);
    });
  },

  ContactType: {
    GOVT_BUSINESS: 0,
    ALT_GOVT_BUSINESS: 1,
    PAST_PERFORMANCE: 2,
    ALT_PAST_PERFORMANCE: 3,
    ELECTRONIC_BUSINESS: 4,
    ALT_ELECTRONIC_BUSINESS: 5
  },

  getGovBusinessPointOfContact: function(apiKey, duns, callback) {
    /* istanbul ignore next */
    callback = callback || function() {};
    if (!apiKey || !duns) {
      throw new Error(errors.API_KEY_OR_DUNS_MISSING);
    }

    var formattedDuns = dunsUtil.format(duns);
    var url = this.baseUrl + this.getSamV4Path(apiKey, formattedDuns);

    var options = { 'url': url, 'json': true };
    var registration = {};

    request(options, function(error, response, body) {
      /* istanbul ignore if */
      if (error) {
        callback(error, null);
        return;
      }

      if (response.statusCode !== 200) {
        callback({ Code: response.statusCode}, null);
        return;
      }

      registration.firstName = body.sam_data.registration.govtBusinessPoc.firstName;
      registration.lastName = body.sam_data.registration.govtBusinessPoc.lastName;
      registration.usPhone = body.sam_data.registration.govtBusinessPoc.usPhone;
      registration.fax = body.sam_data.registration.govtBusinessPoc.fax;
      registration.address = body.sam_data.registration.govtBusinessPoc.address;
      registration.email = body.sam_data.registration.govtBusinessPoc.email;
      registration.legalBusinessName = body.sam_data.registration.legalBusinessName;
      registration.hasDelinquentFederalDebt = body.sam_data.registration.hasDelinquentFederalDebt;
      registration.duns = body.sam_data.registration.duns;
      registration.status = body.sam_data.registration.status;

      callback(null, registration);
    });
  }

};

module.exports = Api;
