module.exports = function(config){
  config.set({

    frameworks: [
      'jasmine',
      'requirejs'
    ],

    files: [
      {pattern: 'bower_components/es5-shim/es5-shim.js', included: false}, //for old IE
      'bower_components/json2/json2.js', //for old IE
      'node_modules/jazzmine/bin/jazzmine.min.js',
      'node_modules/sinon/pkg/sinon.js',
      'node_modules/sinon/pkg/sinon-ie.js',
      'node_modules/jasmine-sinon/lib/jasmine-sinon.js',
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