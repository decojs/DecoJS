define(function(){
  return function ExecutableResult(model){
    model = model || {};
    this.success = model.success || false;
    this.valid = model.valid || false;
    this.result = model.result || null;
    this.exception = model.exception || null;
    this.violations = model.violations || [];  
  };
});