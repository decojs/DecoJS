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

	describe("with a value containing curly braces", function(){
	
		beforeEach(function(){
			validator = new Validator();
			validator.constraints = [
				a_constraint.whichIsInvalid("dummy", "test {value}", {attr:"an attribute"})
			];
			
			
			validator.validate("a {attr}")
		});
	
		it("should interpolate the value into the message without messing up curly braces", function(){
			expect(validator.message()).toBe("test a {attr}");
		});
	});
	
	describe("with the name of the field", function(){
	
		beforeEach(function(){
			validator = new Validator(null, {
				name: "a name",
				path: "a path"
			});
			validator.constraints = [
				a_constraint.whichIsInvalid("dummy", "test {this.name}", {})
			];
			
			
			validator.validate("a value")
		});
	
		it("should interpolate the name into the message", function(){
			expect(validator.message()).toBe("test a name");
		});
	});
	
	describe("with the path to the field", function(){
	
		beforeEach(function(){
			validator = new Validator(null, {
				name: "a name",
				path: "a path"
			});
			validator.constraints = [
				a_constraint.whichIsInvalid("dummy", "test {this.path}", {})
			];
			
			
			validator.validate("a value")
		});
	
		it("should interpolate the path into the message", function(){
			expect(validator.message()).toBe("test a path");
		});
	});

	describe("with a missing value", function(){
	
		beforeEach(function(){
			validator = new Validator();
			validator.constraints = [
				a_constraint.whichIsInvalid("dummy", "test {unexisting}", {attr:"an attribute"})
			];
			
			
			validator.validate("a value")
		});
	
		it("should interpolate the value into the message", function(){
			expect(validator.message()).toBe("test {unexisting}");
		});
	});
	
	
});