describe("when the message should be interpolated", [
	"ordnung/qvc/Validator",
	"Given/a_constraint"
], function(
	Validator,
	a_constraint
){

	var validator;
	
	describe("with the value", function(){
	
		beforeEach(function(){
			validator = new Validator();
			validator.constraints = [
				a_constraint.whichIsInvalid("dummy", "test {value}", {})
			];
			
			
			validator.validate("a value")
		});
	
		it("should interpolate the value into the message", function(){
			expect(validator.message()).toBe("test a value");
		});
	});


	describe("with an attribute", function(){
	
		beforeEach(function(){
			validator = new Validator();
			validator.constraints = [
				a_constraint.whichIsInvalid("dummy", "test {attr}", {attr:"an attribute"})
			];
			
			
			validator.validate("a value")
		});
	
		it("should interpolate the value into the message", function(){
			expect(validator.message()).toBe("test an attribute");
		});
	});
	
	
});