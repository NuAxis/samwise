var Samwise = require('../lib/index');
var DG_API_KEY = 'DEMO_KEY';
var searchTerms = 'Technology';

Samwise.Api.searchEntities(DG_API_KEY, searchTerms, function(error, entities) {
  if(!error && entities.length > 0) {
    for (entity in entities) {
      console.log(entities[entity].legalBusinessName);
    }
  } else {
    console.log(error);
  }
});
