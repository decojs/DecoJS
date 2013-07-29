moquire(["ordnung/constraints/Pattern"], function(Pattern){
	describe("when validating the Pattern constraint", function(){

		var constraint;
		beforeEach(function(){
			constraint = new Pattern({message: "hello", regexp: "something"});
		});

		it("should have an isValid method", function(){
			expect(constraint.isValid).toBeDefined();
		});

		describe("with undefined", function(){

			it("should be invalid", function(){
				expect(constraint.isValid()).toBe(false);
			});
		});

		describe("with null", function(){

			it("should be invalid", function(){
				expect(constraint.isValid(null)).toBe(false);
			});
		});
		
		describe("with an empty string", function(){

			it("should be invalid", function(){
				expect(constraint.isValid("")).toBe(false);
			});
		});
		
		describe("with a string containing the regexp", function(){

			it("should be valid", function(){
				expect(constraint.isValid("this is something more")).toBe(false);
			});
		});
		
		describe("with a string exactly like the regexp", function(){

			it("should be valid", function(){
				expect(constraint.isValid("something")).toBe(true);
			});
		});
		
		describe("with an case insensitive flag", function(){


			beforeEach(function(){
				constraint = new Pattern({message: "hello", regexp: "something", flags:["CASE_INSENSITIVE"]});
			});

			describe("with an incorrect case", function(){

				it("should be valid", function(){
					expect(constraint.isValid("SomethING")).toBe(true);
				});
			});

			describe("with a correct case", function(){

				it("should be invalid", function(){
					expect(constraint.isValid("something")).toBe(true);
				});
			});
		});
	});
});