define([
	"ordnung/Executable", 
	"ordnung/ExecutableResult", 
	"ordnung/utils", 
	"ordnung/ajax",
	"ordnung/ConstraintResolver",
	"knockout", 
	"ordnung/koExtensions"], 
	function(
		Executable,
		ExecutableResult,
		utils,
		ajax,
		ConstraintResolver,
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
						executable.onError();
					}
				} else {
					executable.result = new ExecutableResult({exception: {message: xhr.responseText, cause: xhr}});
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
					}catch(e){
						var response = {parameters: []};
					}
					callback(name, response.parameters);
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
		if(name == null || name.length == 0)
			throw new Error(type + " is missing name\nA " + type + " must have a name!\nusage: createCommand('name', [parameters, callbacks])");
	
		var executable = new Executable(name, type, parameters || {}, callbacks || {}, qvc);
		var execute = executable.execute.bind(executable);
		execute.isValid = ko.computed(function(){return executable.isValid(); });
		execute.isBusy = ko.computed(function(){return executable.isBusy();});
		execute.hasError = ko.computed(function(){return executable.hasError();});
		execute.success = function(callback){
			executable.callbacks.success = callback;
			return execute;
		};
		execute.error = function(callback){
			executable.callbacks.error = callback;
			return execute;
		};
		execute.beforeExecute = function(callback){
			executable.callbacks.beforeExecute = callback;
			return execute;
		};
		execute.canExecute = function(callback){
			executable.callbacks.canExecute = callback;
			return execute;
		};
		execute.result = function(){
			if(arguments.length == 1){
				executable.callbacks.result = arguments[0];
				return execute;
			}
			return executable.result.result;
		};
		execute.complete = function(callback){
			executable.callbacks.complete = callback;
			return execute;
		};
		execute.clearValidationMessages = executable.clearValidationMessages.bind(executable);
		
		return execute;
	}
	
	return {
		createCommand: function(name, parameters, callbacks){
			return createExecutable(name, Executable.Command, parameters, callbacks);
		},
		createQuery: function(name, parameters, callbacks){
			return createExecutable(name, Executable.Query, parameters, callbacks);
		},
		config: function(config){
			utils.extend(qvc.config, config);
		}
	}
});