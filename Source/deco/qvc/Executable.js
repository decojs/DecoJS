define([
  "deco/qvc/ExecutableResult", 
  "deco/qvc/Validatable", 
  "deco/utils", 
  "knockout"
], function(
  ExecutableResult, 
  Validatable, 
  utils, 
  ko){

  function Executable(name, type, parameters, hooks, qvc){    
    Validatable.call(this, name, parameters, qvc.constraintResolver)
    
    this.name = name;
    this.type = type;
    this.qvc = qvc;
    this.isBusy = ko.observable(false);
    this.hasError = ko.observable(false);
    this.result = new ExecutableResult();
    
    this.parameters = Object.seal(parameters);
    this.hooks = utils.extend({
      beforeExecute: function () {},
      canExecute: function(){return true;},
      error: function () {},
      success: function () {},
      result: function(){},
      complete: function () {},
      invalid: function() {}
    }, hooks);
  }
    
  Executable.prototype = utils.inheritsFrom(Validatable);
    
  Executable.prototype.execute = function () {
    if (this.isBusy()) {
      return false;
    }

    this.hasError(false);

    this.hooks.beforeExecute();

    this.validate();
    if (!this.isValid()) {
      this.hooks.invalid();
      return false;
    }

    if (this.hooks.canExecute() === false) {
      return false;
    }
    this.isBusy(true);

    this.qvc.execute(this);
    return false;
  };

  Executable.prototype.onError = function () {
    if("violations" in this.result && this.result.violations != null && this.result.violations.length > 0){
      this.applyViolations(this.result.violations);
      this.hooks.invalid();
    }else{
      this.hasError(true);
      this.hooks.error(this.result);
    }
  };

  Executable.prototype.onSuccess = function () {
    this.hasError(false);
    this.clearValidationMessages();
    this.hooks.success(this.result);
    this.hooks.result(this.result.result);
  };

  Executable.prototype.onComplete = function () {
    this.hooks.complete();
    this.isBusy(false);
  };
  
  Executable.Command = "command";
  Executable.Query = "query";
  
  return Executable;
});