'use strict';

var request = require('request');
var errors = require('./errors');
var dunsUtil = require('./duns');

var Api = {
  baseUrl:  process.env.SAM_GOV_API_URL || 'https://api.data.gov',
  searchApiPath: '/sam/v3/registrations',
  dataApiPath: '/sam/v8/registrations',
  ContactType: {
    GOVT_BUSINESS: 0,
    ALT_GOVT_BUSINESS: 1,
    PAST_PERFORMANCE: 2,
    ALT_PAST_PERFORMANCE: 3,
    ELECTRONIC_BUSINESS: 4,
    ALT_ELECTRONIC_BUSINESS: 5
  },

  searchEntities: function(apiKey, qterms, callback) {

    var url = this.baseUrl + this.getSamSearchPath(apiKey, qterms);
    var options = { 'url': url, 'json': true };
    this.makeApiCall(options, callback, 'searchEntities');
  },

  getRegistration: function(apiKey, duns, callback) {

    var url = this.baseUrl + this.getSamDataPath(apiKey, duns);
    var options = { 'url': url, 'json': true };
    this.makeApiCall(options, callback, 'getRegistration');
  },

  getGovBusinessPointOfContact: function(apiKey, duns, callback) {

    var url = this.baseUrl + this.getSamDataPath(apiKey, duns);
    var options = { 'url': url, 'json': true };
    this.makeApiCall(options, callback, null);
  },

  getSamDataPath: function(apiKey, duns) {
    if (!apiKey || !duns) {
      throw new Error(errors.API_KEY_OR_DUNS_MISSING);
    }
    return this.dataApiPath + '/' + dunsUtil.format(duns) + '?api_key=' + apiKey;
  },

  getSamSearchPath: function(apiKey, qterms) {
    if (!apiKey || !qterms) {
      throw new Error(errors.API_KEY_OR_QTERMS_MISSING);
    }
    return this.searchApiPath + '?qterms=' + qterms + '&api_key=' + apiKey;
  },


  makeApiCall: function(options, callback, type) {
    /* istanbul ignore next */
    callback = callback || function() {};
    request(options, function(error, response, body) {

      if (error) {
        callback(error, null);
        return;
      }
      if (response.statusCode !== 200) {
        callback({ Code: response.statusCode}, null);
        return;
      }

      var content;
      if (type === 'searchEntities') {
        content =  body.results;
      } else if (type === 'getRegistration') {
        content = body;
      } else {
        var registration = {};
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
        content = registration;
      }

      callback(null, content);
    });
  }
};

module.exports = Api;
