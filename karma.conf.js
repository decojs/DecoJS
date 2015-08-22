module.exports = function(config){
  config.set({

    frameworks: [
      'jasmine'
    ],

    files: [
      {pattern: 'bower_components/es5-shim/es5-shim.js', included: false}, //for old IE
      'bower_components/json/json2.js', //for old IE
      'bower_components/es6-promise/promise.js', //for non ES6 browsers
      
      'node_modules/sinon/pkg/sinon.js',
      'node_modules/sinon/pkg/sinon-ie.js',
      'node_modules/requirejs/require.js',
      'node_modules/karma-requirejs/lib/adapter.js',
      
      'node_modules/jazzmine/bin/jazzmine.min.js',
      'node_modules/jasmine-sinon/lib/jasmine-sinon.js',
      {pattern: 'bower_components/knockout/dist/knockout.debug.js', included: false},

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