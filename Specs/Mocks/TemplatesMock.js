define(["when"], function(when){
  function Templates(){}

  Templates.prototype.getTemplate = Templates.getTemplate = sinon.stub();
  Templates.getTemplate.returns(when.resolve("<p>my template</p>"));

  Templates.reset = function(){
    Templates.getTemplate.reset();
  }

  return Templates;
});