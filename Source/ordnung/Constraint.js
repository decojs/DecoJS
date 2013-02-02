define([], function(){
	
	
	
	
	function Constraint(name, attributes){
		var self = this;
		
		this.name = name;
		this.attributes = attributes;
		this.message = attributes.message;
		this.test = function(){};
		
		
		this.init();
	}
	
	Constraint.prototype.init = function(){
		require(["ordnung/constraints/"+this.name], function(test){
			this.test = test;
		}.bind(this));
	};
	
	Constraint.prototype.validate = function(value){
		return this.test(value, this.attributes);
	};
	
	
	return Constraint;
});