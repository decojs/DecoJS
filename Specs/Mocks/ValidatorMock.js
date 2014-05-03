define([], function(){
  function Validator(){
    this.isValid = sinon.spy();
    this.message = sinon.spy(function(){return ""});
    
    Validator.latest = this;
  };
  
  return Validator;
});