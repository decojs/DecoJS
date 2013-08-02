

// list of files / patterns to load in the browser
files = [
  'bower_components/es5-shim/es5-shim.js', //for old IE
  'bower_components/json2/json2.js', //for old IE
  JASMINE,
  JASMINE_ADAPTER,
  'Specs/Libs/overload.js',
  'Specs/Libs/jazzmine.js',
  REQUIRE,
  REQUIRE_ADAPTER,
  'Specs/Libs/moquire.js',
  'Specs/Libs/sinon-1.3.4.js',
  {pattern: 'bower_components/knockout.js/knockout.js', included: false},

  'Specs/specs-main.js',
  {pattern: 'Source/ordnung/**/*.js', included: false},
  {pattern: 'Specs/Mocks/**/*.js', included: false},

  'Specs/Modules/**/*.js'
];

// list of files to exclude
exclude = [

];

reporters = ['dots'];

autoWatch = true;

/*browser = [
	"Chrome",
	"Firefox",
	"IE"
];*/