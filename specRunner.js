var Jasmine = require('jasmine');
var jasmine = new Jasmine();
var CustomReporter = require('jasmine-console-reporter');
var customReporter = new CustomReporter();

jasmine.addReporter(customReporter);
// Load configuration from a file or from an object.

jasmine.loadConfigFile('spec/support/jasmine.json');


jasmine.execute();
