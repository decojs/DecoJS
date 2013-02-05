define(["ordnung/ExecutableResult", "ordnung/Validatable", "ordnung/utils", "knockout"], function(ExecutableResult, Validatable, utils, ko){

	function Executable(name, type, options, qvc){
		var self = this;
		
		this.name;
		this.type;
		this.isBusy = ko.observable(false);
		this.hasError = ko.observable(false);
		this.result = new ExecutableResult();
		
		this.parameters = {};
		this.options = {
			beforeExecute: function () {},
			canExecute: function(){return true;},
			error: function () {},
			success: function () {},
			result: function(){},
			complete: function () {}
		};
		
		
		this.execute = function () {
			if (self.onBeforeExecute() === false) {
				return;
			}
			qvc.execute(self);
		};

		this.onBeforeExecute = function () {
			
			if (self.isBusy()) {
				return false;
			}
			
			self.hasError(false);
			
			self.options.beforeExecute();
			
			self.validate();
			if (!self.isValid()) {
				return false;
			}
			
			if (self.options.canExecute() === false) {
				return false;
			}
			self.isBusy(true);
			
			return true;
		};
		
		
		this.onError = function () {
			self.hasError(true);
			if("violations" in self.result)
				self.applyViolations(self.result.violations);
			self.options.error(self.result);
		};

		this.onSuccess = function () {
			self.hasError(false);
			self.clearValidationMessages();
			self.options.success(self.result);
			self.options.result(self.result.result);
		};

		this.onComplete = function () {
			if (!self.hasError()) {
				self.options.complete(self.result);
				self.clearValidationMessages();
			}
			self.isBusy(false);
		};
		
		
		(function init(){
			self.name = name;
			self.type = type;
			utils.extend(self.parameters, options.parameters);
			utils.extend(self.options, options);
			utils.extend(self, new Validatable(self.name, self.parameters, qvc));
		})();
	}
	
	Executable.Command = "command";
	Executable.Query = "query";
	
	return Executable;
});