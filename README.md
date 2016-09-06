# samwise

[![Build Status](https://travis-ci.org/NuAxis/samwise.svg?branch=develop)](https://travis-ci.org/NuAxis/samwise)
[![Code Climate](https://codeclimate.com/github/NuAxis/samwise/badges/gpa.svg)](https://codeclimate.com/github/NuAxis/samwise)
[![Test Coverage](https://codeclimate.com/github/NuAxis/samwise/badges/coverage.svg)](https://codeclimate.com/github/NuAxis/samwise/coverage)

A simple SAM API wrapper inspired by https://github.com/18F/samwise

```npm install samwisejs```

## Interfaces
```javascript
var Samwise = require('samwisejs');

Samwise.Api.searchEntities(API_KEY, TERMS, function(error, entities) {});
Samwise.Api.getRegistration(API_KEY, DUNS, function(error, registration) {});
Samwise.Api.getGovBusinessPointOfContact(API_KEY, DUNS, function(error, contact) {});
```

## Example

```javascript
var Samwise = require('samwisejs');
var DUNS = '1234567'; // 7,8,9 and 13 digit duns with/without dashes are accepted
var DG_API_KEY = 'DEMO_KEY'; // get at https://api.data.gov/signup/
var searchTerms = ''; // http://gsa.github.io/sam_api/sam/search.html

var printResult = function(error, entities) {
  if(!error && entities.length > 0) {
    for(var i = 0; i < entities.length; i++) {
      console.log(entities[i].legalBusinessName);
    }
  }
}
```


## Build

``` gulp ```

OR

```npm test```

## Browserify

```npm run browserify```
