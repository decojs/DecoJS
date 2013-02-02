define(["ordnung/Constraint", "knockout"], function(Constraint, ko){
	function Validator(){
		var self = this;
		
		this.constraints = [];
		
		this.isValid = ko.observable(true);
		this.message = ko.observable("");
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
				this.message(constraint.message);
				return false;
			}
		}.bind(this))){
			this.isValid(true);
			this.message("");
		}
	};
	
	return Validator;
});