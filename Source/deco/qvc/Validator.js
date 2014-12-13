define([
  "deco/qvc/Constraint", 
  "knockout"
], function(
  Constraint, 
  ko
){

  function interpolate(message, attributes, value, name, path){
    return message.replace(/\{([^}]+)\}/g, function(match, key){
      if(key == "value") return value;
      if(key == "this.name") return name;
      if(key == "this.path") return path;
      if(key in attributes) return attributes[key];
      return match;
    });
  }
  

  function Validator(target, options){
    var self = this;
    
    this.constraints = [];
    
    this.isValid = ko.observable(true);
    this.message = ko.observable("");

    this.name = options && options.name;
    this.path = options && options.path;
    this.executableName = options && options.executableName;
    
    if(target && ko.isObservable(target)){
      target.isValid = function(){return self.isValid();};
    }
  }
  
  Validator.prototype.setConstraints = function(constraints){
    this.constraints = constraints.map(function(constraint){
      return new Constraint(constraint.name, constraint.attributes);
    });
  };
  
  Validator.prototype.reset = function(){
    this.isValid(true);
    this.message("");
  };
  
  Validator.prototype.validate = function(value){
    if(this.constraints.length == 0){
      this.reset();
    }else if(this.constraints.every(function (constraint) {
      if(constraint.validate(value)){
        return true;
      }else{
        this.isValid(false);
        this.message(interpolate(constraint.message, constraint.attributes, value, this.name, this.path));
        return false;
      }
    }.bind(this))){
      this.isValid(true);
      this.message("");
    }
  };
  
  return Validator;
});