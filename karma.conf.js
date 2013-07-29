

// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  REQUIRE,
  REQUIRE_ADAPTER,
  'Specs/Libs/moquire.js',
  'Specs/Libs/sinon-1.3.4.js',
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