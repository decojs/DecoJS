

// list of files / patterns to load in the browser
files = [
  'Source/Libs/es5-shim.min.js',
  'Source/Libs/json2.js',
  JASMINE,
  JASMINE_ADAPTER,
  'Specs/Libs/overload.js',
  'Specs/Libs/jazzmine.js',
  REQUIRE,
  REQUIRE_ADAPTER,
  'Specs/Libs/moquire.js',
  'Specs/Libs/sinon-1.3.4.js',
  'Specs/Libs/jasmine.async.js',
  {pattern: 'Source/Libs/knockout-2.1.0.js', included: false},

  'Specs/specs-main.js',
  {pattern: 'Source/ordnung/**/*.js', included: false},
  {pattern: 'Specs/Modules/**/*.js', included: true},
  {pattern: 'Specs/Mocks/**/*.js', included: false}
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