define(["Executable", "ExecutableResult", "utils", "knockout", "koExtensions"], function(Executable, ExecutableResult, utils, ko){
	
	var qvc = {
		execute: function(executable){
			var parameters = JSON.stringify(ko.toJS(executable.parameters));
			var url = qvc.config.baseUrl + (qvc.config.baseUrl.match(/\/$/) ? "" : "/") + executable.type + "/" + executable.name;
			utils.ajax(url, parameters, "POST", function (xhr) {
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
		config: {
			baseUrl: "/",
		}
	};
	
	return {
		createCommand: function(options){
			return new Executable(Executable.Command, options, qvc);
		},
		createQuery: function(options){
			return new Executable(Executable.Query, options, qvc);
		},
		config: function(config){
			utils.extend(qvc.config, config);
		}
	}
});