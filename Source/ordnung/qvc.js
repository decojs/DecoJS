define([
	"ordnung/Executable", 
	"ordnung/ExecutableResult", 
	"ordnung/utils", 
	"ordnung/ajax", 
	"knockout", 
	"ordnung/koExtensions"], 
	function(
		Executable,
		ExecutableResult,
		utils,
		ajax,
		ko){
	
	var qvc = {
		execute: function(executable){
			var parameters = {parameters:ko.toJSON(executable.parameters)};
			var url = qvc.config.baseUrl + (qvc.config.baseUrl.match(/\/$/) ? "" : "/") + executable.type + "/" + executable.name;
			ajax(url, parameters, "POST", function (xhr) {
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
		
		},
		
		loadValidationConstraints: function(name, executable){
			var url = qvc.config.baseUrl + (qvc.config.baseUrl.match(/\/$/) ? "" : "/") + "validation/"+name;
			ajax(url, null, "GET", function(xhr){
				if (xhr.status === 200) {
					executable.applyConstraints(JSON.parse(xhr.responseText || "{\"parameters\":[]}").parameters);
				}
			});
		},
		
		config: {
			baseUrl: "/"
		}
	};
	
	function createExecutable(name, type, options){
		if(name == null || name.length == 0)
			throw new Error(type + " is missing name\nA " + type + " must have a name!\nusage: createCommand('name', {<options>})");
	
		var executable = new Executable(name, type, options || {}, qvc);
		var execute = executable.execute.bind(executable);
		execute.isValid = ko.computed(function(){return executable.isValid(); });
		execute.isBusy = ko.computed(function(){return executable.isBusy();});
		execute.hasError = ko.computed(function(){return executable.hasError();});
		execute.result = function(){return executable.result.result;};
		execute.clearValidationMessages = executable.clearValidationMessages.bind(executable);
		
		return execute;
	}
	
	return {
		createCommand: function(name, options){
			return createExecutable(name, Executable.Command, options);
		},
		createQuery: function(name, options){
			return createExecutable(name, Executable.Query, options);
		},
		config: function(config){
			utils.extend(qvc.config, config);
		}
	}
});