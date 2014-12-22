define([
  "deco/qvc/Executable", 
  "deco/qvc/ExecutableResult", 
  "deco/utils", 
  "deco/ajax",
  "deco/qvc/ConstraintResolver",
  "deco/errorHandler",
  "knockout", 
  "deco/qvc/koExtensions"], 
  function(
    Executable,
    ExecutableResult,
    utils,
    ajax,
    ConstraintResolver,
    errorHandler,
    ko){
  
  function QVC(){

    var qvc = this;

    this.constraintResolver = new ConstraintResolver(qvc);

    this.execute = function(executable){
      var parameters = ko.toJS(executable.parameters);
      var data = {
        parameters: JSON.stringify(parameters),
        csrfToken: qvc.config.csrf
      };
      var url = ajax.addToPath(qvc.config.baseUrl, executable.type + "/" + executable.name);
      ajax(url, data, "POST", function (xhr) {
        if (xhr.status === 200) {
          executable.result = new ExecutableResult(JSON.parse(xhr.responseText || "{}"));
          if (executable.result.success === true) {
            executable.onSuccess();
          } else {
            if(executable.result.exception && executable.result.exception.message){
              errorHandler.onError(executable.result.exception.message);
            }
            executable.onError();
          }
        } else {
          executable.result = new ExecutableResult({exception: {message: xhr.responseText, cause: xhr}});
          errorHandler.onError(executable.result.exception.message);
          executable.onError();
        }
        executable.onComplete();
      });
    
    };
    
    this.loadConstraints = function(name, callback){
      var url = ajax.addToPath(qvc.config.baseUrl, "constraints/" + name);
      ajax(url, null, "GET", function(xhr){
        if (xhr.status === 200) {
          try{
            var response = JSON.parse(xhr.responseText || "{\"parameters\":[]}");
            if("parameters" in response == false){
              response.parameters = [];
            }
            if(response.exception && response.exception.message){
              errorHandler.onError(response.exception.message);
            }
          }catch(e){
            var response = {parameters: []};
          }
          callback(name, response.parameters);
        }else{
          errorHandler.onError(xhr.responseText);
        }
      });
    };

    
    this.config = {
      baseUrl: "/",
      csrf: ""
    }
  };

  var qvc = new QVC();
  
  function createExecutable(name, type, parameters, callbacks){  
    var executable = new Executable(name, type, parameters || {}, callbacks || {}, qvc);
    var execute = executable.execute.bind(executable);
    execute.isValid = ko.computed(executable.isValid, executable);
    execute.isBusy = ko.computed(executable.isBusy, executable);
    execute.hasError = ko.computed(executable.hasError, executable);
    execute.success = function(callback){
      executable.hooks.success = callback;
      return execute;
    };
    execute.error = function(callback){
      executable.hooks.error = callback;
      return execute;
    };
    execute.invalid = function(callback){
      executable.hooks.invalid = callback;
      return execute;
    };
    execute.beforeExecute = function(callback){
      executable.hooks.beforeExecute = callback;
      return execute;
    };
    execute.canExecute = function(callback){
      executable.hooks.canExecute = callback;
      return execute;
    };
    execute.result = function(){
      if(arguments.length == 1){
        executable.hooks.result = arguments[0];
        return execute;
      }
      return executable.result.result;
    };
    execute.complete = function(callback){
      executable.hooks.complete = callback;
      return execute;
    };
    execute.clearValidationMessages = executable.clearValidationMessages.bind(executable);
    execute.validator = executable.validator;
    execute.parameters = executable.parameters;
    execute.validate = executable.validate.bind(executable);
    
    return execute;
  }
  
  return {
    createCommand: function(name, parameters, hooks){
      if(name == null || name.length == 0)
        throw new Error("Command is missing name\nA command must have a name!\nusage: createCommand('name', [parameters, hooks])");
      return createExecutable(name, Executable.Command, parameters, hooks);
    },
    createQuery: function(name, parameters, hooks){
      if(name == null || name.length == 0)
        throw new Error("Query is missing name\nA query must have a name!\nusage: createQuery('name', [parameters, hooks])");
      return createExecutable(name, Executable.Query, parameters, hooks);
    },
    config: function(config){
      utils.extend(qvc.config, config);
    }
  }
});