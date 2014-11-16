define(function(){
  function Templates(){}

  Templates.prototype.getTemplate = Templates.getTemplate = sinon.stub();
  Templates.getTemplate.returns(Promise.resolve("<p>my template</p>"));

  Templates.reset = function(){
    Templates.getTemplate.reset();
  }

  return Templates;
});