describe("when creating a new validator", { 
	"ordnung/qvc/Constraint": "Mocks/ConstraintMock"
},["knockout", "ordnung/qvc/Validator"], function(ko, Validator){

	var validator;
	
	beforeEach(function(){
		validator = new Validator();
	});
	
	it("should be valid by default", function(){
		expect(validator.isValid()).toBe(true);
	});
	
	it("should have an empty message", function(){
		expect(validator.message()).toBe("");
	});
	
	describe("when reseting the validator", function(){
			
		beforeEach(function(){
			validator = new Validator();
			validator.isValid(false);
			validator.message("hello");
			validator.reset();
		});
	
		it("should be valid by default", function(){
			expect(validator.isValid()).toBe(true);
		});
		
		it("should have an empty message", function(){
			expect(validator.message()).toBe("");
		});
	});
	
	describe("when setting constraints", function(){
		
		var constraint = {name:"NotEmpty", attributes:{}};
		
		beforeEach(function(){
			validator = new Validator();
			validator.setConstraints([constraint]);
		});
	
		it("should add it to the list of constraints", function(){
			expect(validator.constraints.length).toBe(1);
		});
		
		it("should create a constraint object", function(){
			expect(validator.constraints[0].name).toBe(constraint.name);
			expect(validator.constraints[0].attributes).toBe(constraint.attributes);
		});
	});
});