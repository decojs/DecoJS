define(["ordnung/ExecutableResult", "ordnung/Validatable", "ordnung/utils", "knockout"], function(ExecutableResult, Validatable, utils, ko){

	function Executable(name, type, parameters, callbacks, qvc){
		var self = this;
		
		this.name;
		this.type;
		this.isBusy = ko.observable(false);
		this.hasError = ko.observable(false);
		this.result = new ExecutableResult();
		
		this.parameters = {};
		this.callbacks = {
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
			
			self.callbacks.beforeExecute();
			
			self.validate();
			if (!self.isValid()) {
				return false;
			}
			
			if (self.callbacks.canExecute() === false) {
				return false;
			}
			self.isBusy(true);
			
			return true;
		};
		
		
		this.onError = function () {
			self.hasError(true);
			if("violations" in self.result)
				self.applyViolations(self.result.violations);
			self.callbacks.error(self.result);
		};

		this.onSuccess = function () {
			self.hasError(false);
			self.clearValidationMessages();
			self.callbacks.success(self.result);
			self.callbacks.result(self.result.result);
		};

		this.onComplete = function () {
			if (!self.hasError()) {
				self.callbacks.complete(self.result);
				self.clearValidationMessages();
			}
			self.isBusy(false);
		};
		
		
		init: {
			self.name = name;
			self.type = type;
			utils.extend(self.parameters, parameters);
			utils.extend(self.callbacks, callbacks);
			utils.extend(self, new Validatable(self.name, self.parameters, qvc.constraintResolver));
		}
	}
	
	Executable.Command = "command";
	Executable.Query = "query";
	
	return Executable;
});