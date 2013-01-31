define(["ordnung/ExecutableResult", "ordnung/validation", "ordnung/utils", "knockout"], function(ExecutableResult, validation, utils, ko){
	function Executable(type, options, qvc){
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

			self.validate();
			if (!self.isValid()) {
				return false;
			}

			self.options.beforeExecute(self);

			if (self.options.canExecute(self) === false) {
				return false;
			}
			self.isBusy(true);

			return true;
		};
		
		
		this.onError = function () {
			self.hasError(true);
			self.applyViolationMessages(self.result);
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
			}
			self.isBusy(false);
		};
		
		
		(function init(){
			self.name = options.name;
			self.type = type;
			utils.extend(self.parameters, options.parameters);
			utils.extend(self.options, options);
			utils.extend(self, new validation.Validatable());
		})();
	}
	
	Executable.Command = "command";
	Executable.Query = "query";
	
	return Executable;
});