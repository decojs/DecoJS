define(["ordnung/utils", "knockout", "ordnung/koExtensions"],function(utils, ko){
	
	function recursivlyExtendProperties(properties, validatableFields) {
		for (var key in properties) {
			var property = properties[key];
			if (ko.isObservable(property)) {
				property.extend({ validation: {} });
				validatableFields.push(property);
			}
			property = ko.utils.unwrapObservable(property);
			if (typeof property === "object") {
				recursivlyExtendProperties(property, validatableFields);
			}
		}
	}

	function applyConstraintRules(properties, fields) {
	
		fields.forEach(function(field){
			var fieldName = field.name;
			var constraints = field.constraints;
			
			var object = findField(fieldName, properties, "Error applying constraints to field");
			
			if (ko.isObservable(object) && "validator" in object) {
				object.validator.setOptions(constraints);
			} else {
				throw new Error("Error applying constraints to field: " + fieldName + "\n" +
					"It is not an observable or is not extended with a validator. \n" +
					fieldName + "=`" + object + "`");
			}
		});
	}


	function findField(fieldPath, properties, errorMessage){
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
					path + " = `" + object + "`");
			}
		}, {
			field: properties,
			path: "properties"
		}).field;
	}



	
	function applyViolationMessageToField(properties, fieldPath, message) {
		var object = findField(fieldPath, properties, "Error applying violation");
		
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
				applyViolationMessageToField(executable.properties, fieldName, message);
			} else {
				//the executable violates a constraint
				applyViolationMessageToExecutable(executable, message);
			}
		});
	};











	return{
		extendExecutable: function(executable, validatableFields){
			recursivlyExtendProperties(executable.properties, validatableFields);
		},
		applyConstraints: function(executable, constraints){
			applyConstraintRules(executable.properties, constraints);
		},
		applyViolations: function(executable, violations){
			applyViolationMessages(executable, violations);
		},
	
		Validatable: function(_self){
			var self = _self || this;
			
			this.constraints = [];
			
			this.isValid = function () {
				return self.constraints.every(function(constraint){
					return constraint.validator && constraint.validator.isValid();
				});
			};
			
			this.applyViolationMessages = function(result){
				if ("violations" in result && result.violations) {
					applyViolationMessages(self, result.violations);
				}
			};
			
			this.validate = function(){
				self.validator.validate(true);
				if (self.validator.isValid()) {
					self.constraints.forEach(function(constraint){
						var validator = constraint.validator;
						if (validator) {
							validator.validate(constraint());
						}
					});
				}
			};
			
			
			this.clearValidationMessages = function () {
				self.validator.reset();
				self.constraints.forEach(function(constraint){
					var validator = constraint.validator;
					if (validator) {
						validator.reset();
					}
				});
			};
			
		
		}
	};
});