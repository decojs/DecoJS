describe("when validating all the constraints", ["deco/qvc/Validator"], function(Validator){

	var validator,
		constraintValid = {validate: sinon.spy(function(){return true}), message:"valid"};
		constraintInvalid = {validate: sinon.spy(function(){return false}), message:"invalid"};
	
	afterEach(function(){
		constraintValid.validate.reset();
		constraintInvalid.validate.reset();
	});
	
	describe("when it has no constraints", function(){
	
		beforeEach(function(){
			validator = new Validator();
			validator.constraints = [
			];
			
			
			validator.validate()
		});
	
		it("should be valid", function(){
			expect(validator.isValid()).toBe(true);
		});
		it("should not have a message", function(){
			expect(validator.message()).toBe("");
		});
	});
	
	describe("when all constraints are valid", function(){
	
		beforeEach(function(){
			validator = new Validator();
			validator.constraints = [
				constraintValid,
				constraintValid,
				constraintValid
			];
			
			
			validator.validate()
		});
	
		it("should be valid", function(){
			expect(validator.isValid()).toBe(true);
		});
		it("should not have a message", function(){
			expect(validator.message()).toBe("");
		});
	});
	
	describe("when the first constraint is invalid", function(){
	
		beforeEach(function(){
			validator = new Validator();
			validator.constraints = [
				constraintInvalid,
				constraintValid,
				constraintValid
			];
			
			
			validator.validate()
		});
	
		it("should not be valid", function(){
			expect(validator.isValid()).toBe(false);
		});
		it("should have a message", function(){
			expect(validator.message()).toBe("invalid");
		});
		it("should not validate the other constraints", function(){
			expect(constraintValid.validate.callCount).toBe(0);
		});
	});
	
	describe("when all constraints are invalid", function(){
	
		beforeEach(function(){
			validator = new Validator();
			validator.constraints = [
				constraintInvalid,
				constraintInvalid,
				constraintInvalid
			];
			
			
			validator.validate()
		});
	
		it("should not be valid", function(){
			expect(validator.isValid()).toBe(false);
		});
		it("should have a message", function(){
			expect(validator.message()).toBe("invalid");
		});
		it("should not validate the other constraints", function(){
			expect(constraintInvalid.validate.callCount).toBe(1);
		});
	});
});