define([
  "deco/utils", 
  "deco/qvc/Validator", 
  "knockout", 
  "deco/qvc/koExtensions"
], function(
  utils, 
  Validator, 
  ko
){
  
  function Validatable(name, parameters, constraintResolver){
    var self = this;
    
    this.validator = new Validator();
    this.validatableFields = [];
    this.validatableParameters = parameters;
    
    
    init: {
      recursivlyExtendParameters(self.validatableParameters, self.validatableFields, [], name);
      if(constraintResolver)
        constraintResolver.applyValidationConstraints(name, self);
    }
  }
  
  Validatable.prototype.isValid = function () {
    return this.validatableFields.every(function(constraint){
      return constraint.validator && constraint.validator.isValid();
    }) && this.validator.isValid();
  };
    
  Validatable.prototype.applyViolations = function(violations){
    violations.forEach(function(violation){
      var message = violation.message;
      var fieldName = violation.fieldName;
      if (fieldName && fieldName.length > 0) {
        //one of the fields violates a constraint
        applyViolationMessageToField(this.validatableParameters, fieldName, message);
      } else {
        //the validatable violates a constraint
        applyViolationMessageToValidatable(this, message);
      }
    }.bind(this));
  };
  
  Validatable.prototype.applyConstraints = function(fields){
    var parameters = this.validatableParameters;
    
    fields.forEach(function(field){
      var fieldName = field.name;
      var constraints = field.constraints;

      if(constraints == null || constraints.length == 0)
        return;
      
      var object = findField(fieldName, parameters, "Error applying constraints to field");
      
      if (ko.isObservable(object) && "validator" in object) {
        object.validator.setConstraints(constraints);
      } else {
        throw new Error("Error applying constraints to field: " + fieldName + "\n" +
          "It is not an observable or is not extended with a validator. \n" +
          fieldName + "=`" + ko.toJSON(object) + "`");
      }
    });
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
  
  
  
  function recursivlyExtendParameters(parameters, validatableFields, parents, executableName) {
    for (var key in parameters) {
      var property = parameters[key];
      var path = parents.concat([key]);
      if (ko.isObservable(property)) {        
        validatableFields.push(applyValidatorTo(property, key, path, executableName));
      }
      property = ko.utils.unwrapObservable(property);
      if (typeof property === "object") {
        recursivlyExtendParameters(property, validatableFields, path, executableName);
      }
    }
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

  function applyViolationMessageToValidatable(validatable, message) {
    validatable.validator.isValid(false);
    var oldMessage = validatable.validator.message();
    var newMessage = oldMessage.length == 0 ? message : oldMessage + ", " + message;
    validatable.validator.message(newMessage);
  };
  
  function applyValidatorTo(property, key, path, executableName){
    if('validator' in property && property.validator instanceof Validator){
      throw new Error("Observable `"+path+"` is parameter `"+property.validator.path+"` in "+property.validator.executableName+" and therefore cannot be a parameter in "+executableName+"!");
    }

    property.validator = new Validator(property, {
      name: key,
      path: path.join("."),
      executableName: executableName
    });

    property.subscribe(function (newValue) {
      property.validator.validate(newValue);
    });
    
    return property;
  }
  
  return Validatable;
});