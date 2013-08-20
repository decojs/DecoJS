module.exports = function(config){
  config.set({

    frameworks: [
      'jasmine'
    ],

    files: [
      'bower_components/es5-shim/es5-shim.js', //for old IE
      'bower_components/json2/json2.js', //for old IE
      'node_modules/jazzmine/bin/jazzmine.min.js',
      'node_modules/karma-requirejs/lib/require.js',
      'node_modules/karma-requirejs/lib/adapter.js',
      'Specs/Libs/sinon-1.3.4.js',
      {pattern: 'bower_components/knockout.js/knockout.js', included: false},
      {pattern: 'bower_components/when/**/*', included: false},

      'Specs/specs-main.js',
      'Specs/Matchers/*',
      {pattern: 'Source/**/*.js', included: false},
      {pattern: 'Specs/Mocks/**/*.js', included: false},
      {pattern: 'Specs/Given/**/*.js', included: false},
      'Specs/Modules/**/*.js'
    ],

    exclude: [

    ],

    reporters: ['dots'],

    autoWatch: true

  });
};