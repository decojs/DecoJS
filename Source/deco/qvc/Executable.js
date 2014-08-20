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

  function Executable(name, type, parameters, callbacks, qvc){    
    Validatable.call(this, name, parameters, qvc.constraintResolver)
    
    this.name = name;
    this.type = type;
    this.qvc = qvc;
    this.isBusy = ko.observable(false);
    this.hasError = ko.observable(false);
    this.result = new ExecutableResult();
    
    this.parameters = Object.seal(parameters);
    this.callbacks = utils.extend({
      beforeExecute: function () {},
      canExecute: function(){return true;},
      error: function () {},
      success: function () {},
      result: function(){},
      complete: function () {},
      invalid: function() {}
    }, callbacks);
  }
    
  Executable.prototype = utils.inheritsFrom(Validatable);
    
  Executable.prototype.execute = function () {
    if (this.onBeforeExecute() === false) {
      return;
    }
    this.qvc.execute(this);
  };

  Executable.prototype.onBeforeExecute = function () {

    if (this.isBusy()) {
      return false;
    }

    this.hasError(false);

    this.callbacks.beforeExecute();

    this.validate();
    if (!this.isValid()) {
      this.callbacks.invalid();
      return false;
    }

    if (this.callbacks.canExecute() === false) {
      return false;
    }
    this.isBusy(true);

    return true;
  };

  Executable.prototype.onError = function () {
    this.hasError(true);
    if("violations" in this.result && this.result.violations != null)
      this.applyViolations(this.result.violations);
    this.callbacks.error(this.result);
  };

  Executable.prototype.onSuccess = function () {
    this.hasError(false);
    this.clearValidationMessages();
    this.callbacks.success(this.result);
    this.callbacks.result(this.result.result);
  };

  Executable.prototype.onComplete = function () {
    if (!this.hasError()) {
      this.callbacks.complete(this.result);
      this.clearValidationMessages();
    }
    this.isBusy(false);
  };
  
  Executable.Command = "command";
  Executable.Query = "query";
  
  return Executable;
});