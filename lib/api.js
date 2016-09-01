const request = require('request');
const errors = require('./errors');
const duns = require('./duns');

var Api = function() {}
Api.baseUrl = process.env.SAM_GOV_API_URL || 'https://api.data.gov';
Api.version = 'v4';
Api.path = '/sam/' + Api.version + '/registrations/';

Api.formatPath = function(apiKey, duns) {
  return this.path + duns + '?api_key=' + apiKey;
};

Api.getRegistration = function(apiKey, dunsNumber, callback) {
  if(!apiKey || !dunsNumber) {
    throw new Error(errors.API_KEY_OR_DUNS_MISSING);
  }

  var formattedDuns = duns.format(dunsNumber);
  const url = this.baseUrl + this.formatPath(apiKey, formattedDuns);

  var options = { 'url': url, 'json': true };
  var registration = {};

  request(options, function(error, response, body) {
    if(error){
        callback(error, null);
        return;
    }

    if(response.statusCode != 200) {
      callback({ statusCode: response.statusCode}, null);
      return;
    }

    registration.firstName = body.sam_data.registration.govtBusinessPoc.firstName;
    registration.lastName = body.sam_data.registration.govtBusinessPoc.firstName;
    registration.usPhone = body.sam_data.registration.govtBusinessPoc.usPhone;
    registration.fax = body.sam_data.registration.govtBusinessPoc.fax;
    registration.address = body.sam_data.registration.govtBusinessPoc.address;
    registration.email = body.sam_data.registration.govtBusinessPoc.email;
    registration.legalBusinessName = body.sam_data.registration.legalBusinessName;

    if(callback) {
      callback(null, registration);
    }
  });
}

module.exports = Api;
