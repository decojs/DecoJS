var tests = Object.keys(window.__karma__.files).filter(function (file) {
      return /Modules\/.*js$/.test(file);
});


requirejs.config(moquire.config({
    // Karma serves files from '/base'
    baseUrl: '/base/Source',

    paths: {
      "Mocks": "/base/Specs/Mocks",
      "Given": "/base/Specs/Given",
      "knockout": "/base/Source/Libs/knockout-2.1.0",
      "ordnung": "/base/Source/ordnung"
    },
    packages: [
        { name: 'when', location: '/base/components/when', main: 'when' }
    ],

    shim: {
    }
}));

beforeEach(function(){
  this.addMatchers({
    toBeA: function(type){
      var actual = this.actual;
      var notText = this.isNot ? " not" : "";

      this.message = function(){
        return "expected " + (typeof actual) + notText + " to be a " + type;
      }

      return typeof actual == type;
    }
  });
});

moquire.then(window.__karma__.start);