define([], function(){
	
	function Constraint(name, attributes){		
		this.name = name;
		this.attributes = attributes;
		this.message = attributes.message;
		
		
		this.init(name);
	}
		
	Constraint.prototype.init = function(name){
		require(["ordnung/constraints/" + name], function(Tester){
			var tester = new Tester(this.attributes);
			this.validate = tester.isValid.bind(tester);
		}.bind(this));
	};
	
	Constraint.prototype.validate = function(value){
		return true;//real test not loaded yet
	};
	
	
	return Constraint;
});