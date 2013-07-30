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


(function(){
  
  function functionName(m){
    return m.name || m.toString().match(/function\s+([^(]+)/)[1];
  }

  function typeOf(obj) {
    var typeString = ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1];
    if(typeString == "Object"){
      return functionName(obj.constructor);
    }else{
      return typeString;
    }
  }

  function toBeA(aOrAn, type){
    var actual = typeOf(this.actual);
    var notText = this.isNot ? " not" : "";
    var expected = functionName(type);

    this.message = function(){
      return "expected " + actual + notText + " to be " + aOrAn + expected;
    }

    return actual === expected;
  }

  beforeEach(function(){
    this.addMatchers({
      toBeA: function(type){
        return toBeA.call(this, "a ", type)
      },
      toBeAn: function(type){
        return toBeA.call(this, "an ", type)
      }
    });
  });

})();




moquire.then(window.__karma__.start);