define(["ordnung/utils", "ordnung/Validator", "knockout", "ordnung/koExtensions"],function(utils, Validator, ko){
	
	function recursivlyExtendParameters(parameters, validatableFields) {
		for (var key in parameters) {
			var property = parameters[key];
			if (ko.isObservable(property)) {
				property.extend({ validation: {} });
				validatableFields.push(property);
			}
			property = ko.utils.unwrapObservable(property);
			if (typeof property === "object") {
				recursivlyExtendParameters(property, validatableFields);
			}
		}
	}

	function applyConstraintRules(parameters, fields) {
	
		fields.forEach(function(field){
			var fieldName = field.name;
			var constraints = field.constraints;
			
			var object = findField(fieldName, parameters, "Error applying constraints to field");
			
			if (ko.isObservable(object) && "validator" in object) {
				object.validator.setConstraints(constraints);
			} else {
				throw new Error("Error applying constraints to field: " + fieldName + "\n" +
					"It is not an observable or is not extended with a validator. \n" +
					fieldName + "=`" + ko.toJSON(object) + "`");
			}
		});
	}


	function findField(fieldPath, parameters, errorMessage){
		return fieldPath.split(".").reduce(function(object, name){
			var path = object.path;
			var field = ko.utils.unwrapObservable(object.field);
			if (name in field) {
				return {
					field: field[name],
					path: path + "." + name
				};
			} else {
				throw new Error(errorMessage + ": " + fieldPath + "\n" +
					name + " is not a member of " + path + "\n" +
					path + " = `" + ko.toJSON(field) + "`");
			}
		}, {
			field: parameters,
			path: "parameters"
		}).field;
	}



	
	function applyViolationMessageToField(parameters, fieldPath, message) {
		var object = findField(fieldPath, parameters, "Error applying violation");
		
		if (typeof message === "string" && "validator" in object) {
			object.validator.isValid(false);
			object.validator.message(message);
		}else{
			throw new Error("Error applying violation\n"+fieldPath+" is not validatable\nit should be an observable");
		}
	};

	function applyViolationMessageToExecutable(executable, message) {
		executable.validator.isValid(false);
		var oldMessage = executable.validator.message();
		var newMessage = oldMessage.length == 0 ? message : oldMessage + ", " + message;
		executable.validator.message(newMessage);
	};

	function applyViolationMessages(executable, violations) {
		violations.forEach(function(violation){
			var message = violation.message;
			var fieldName = violation.fieldName;
			if (fieldName.length > 0) {
				//one of the fields violates a constraint
				applyViolationMessageToField(executable.parameters, fieldName, message);
			} else {
				//the executable violates a constraint
				applyViolationMessageToExecutable(executable, message);
			}
		});
	};





	function Validatable(_self){
		var self = _self || this;
		
		self.validator = new Validator();
		self.validatableFields = [];
		
		
		
		(function init(){
			recursivlyExtendParameters(self.parameters, self.validatableFields);
		})();
	}
	
	Validatable.prototype.isValid = function () {
		return this.validatableFields.every(function(constraint){
			return constraint.validator && constraint.validator.isValid();
		}) && this.validator.isValid();
	};
		
	Validatable.prototype.applyViolations = function(result){
		if ("violations" in result && result.violations) {
			applyViolationMessages(this, result.violations);
		}
	};
	
	Validatable.prototype.validate = function(){
		this.validator.validate(true);
		if (this.validator.isValid()) {
			this.validatableFields.forEach(function(constraint){
				var validator = constraint.validator;
				if (validator) {
					validator.validate(constraint());
				}
			});
		}
	};
	
	
	Validatable.prototype.clearValidationMessages = function () {
		this.validator.reset();
		this.validatableFields.forEach(function(constraint){
			var validator = constraint.validator;
			if (validator) {
				validator.reset();
			}
		});
	};






	return{
		extendExecutable: function(executable, validatableFields){
			recursivlyExtendParameters(executable.parameters, validatableFields);
		},
		applyConstraints: function(executable, constraints){
			applyConstraintRules(executable.parameters, constraints);
		},
		applyViolations: function(executable, violations){
			applyViolationMessages(executable, violations);
		},
		Validatable: Validatable
	};
});