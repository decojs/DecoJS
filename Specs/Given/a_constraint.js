define([], function(){
  
  return {
    whichIsInvalid: function(type, message, attributes){
      return {
        validate: sinon.stub().returns(false), 
        type: type || "dummy",
        attributes: attributes || {

        },
        message: message || "invalid"
      }
    }

  }

});