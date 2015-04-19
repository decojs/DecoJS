define([], function(){

  function ConstraintResolver(qvc){
    this.qvc = qvc;
    this.constraints = Object.create(null);
  }
  
  ConstraintResolver.prototype.applyValidationConstraints = function(name){
    if((name in this.constraints) === false){
      this.constraints[name] = this.qvc.loadConstraints(name);
    }
    
    return this.constraints[name];
  };
  
  return ConstraintResolver;
});