describe("when the message should be interpolated", [
	"deco/qvc/Validator",
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
	describe("with multiple attributes", function(){
	
		beforeEach(function(){
			validator = new Validator();
			validator.constraints = [
				a_constraint.whichIsInvalid("dummy", "{value} is not between {min} and {max}", {min:1, max:10})
			];
			
			
			validator.validate(17)
		});
	
		it("should interpolate the value into the message", function(){
			expect(validator.message()).toBe("17 is not between 1 and 10");
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