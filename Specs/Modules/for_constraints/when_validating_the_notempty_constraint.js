require(["ordnung/Constraint"], function(Constraint){
	describe("when validating the NotEmpty constraint", function(){

		var constraint;
		new Async(this).beforeEach(function(done){
			constraint = new Constraint("NotEmpty", {message: "hello"});
			setTimeout(done, 100);
		});

		it("should have a name", function(){
			expect(constraint.name).toBe("NotEmpty");
		});

		it("should have a message", function(){
			expect(constraint.message).toBe("hello");
		});

		it("should have a test method", function(){
			expect(constraint.test).toBeDefined();
		});

		describe("with undefined", function(){

			it("should be invalid", function(){
				expect(constraint.validate()).toBe(false);
			});
		});

		describe("with null", function(){

			it("should be invalid", function(){
				expect(constraint.validate(null)).toBe(false);
			});
		});
		
		describe("with an empty string", function(){

			it("should be invalid", function(){
				expect(constraint.validate("")).toBe(false);
			});
		});
		
		describe("with a number", function(){

			it("should be valid", function(){
				expect(constraint.validate(0)).toBe(true);
			});
		});
		
		describe("with a string", function(){

			it("should be valid", function(){
				expect(constraint.validate("hello")).toBe(true);
			});
		});

	});
});