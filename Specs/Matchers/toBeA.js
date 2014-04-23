


(function(jazzmine){
  
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

  
  
  
  
  jazzmine.addMatchers({
    toBeA: function(type){
      return toBeA.call(this, "a ", type)
    },
    toBeAn: function(type){
      return toBeA.call(this, "an ", type)
    }
  });

})(jazzmine);