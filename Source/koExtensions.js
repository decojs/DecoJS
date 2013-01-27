define(["knockout"], function(ko){

		
	if (typeof ko !== 'undefined') {
		ko.bindingHandlers.validationMessageFor = {
			init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
				var value = valueAccessor();
				var validator = value.validator;
				if (validator) {
					ko.applyBindingsToNode(element, { hidden: validator.isValid, text: validator.message }, validator);
				}
			}
		};
		
		ko.extenders.validation = function (target, options) {
			//new Validator(target, options);
			target.subscribe(function (newValue) {
				target.validator.validate(newValue);
			});
			return target;
		};
		
		ko.bindingHandlers.command = ko.bindingHandlers.query = {
			init: function (element, valueAccessor, allBindingAccessor, viewModel) {
				ko.applyBindingsToNode(element, { click: valueAccessor().execute }, viewModel);
			}
		};
	}

});