describe("when onError is called", [
	'ordnung/qvc/Executable'
], function(
	Executable
){
	
	var executable,
		loadConstraintsSpy,
		errorSpy;

	beforeEach(function(){

		loadConstraintsSpy = sinon.spy();

		errorSpy = sinon.spy();

		executable = new Executable("blabla", Executable.Command, {}, {error: errorSpy}, {loadConstraints: loadConstraintsSpy});
		
		executable.applyViolations = sinon.spy();
	});

	describe("with violations", function(){


		because(function(){
			executable.onError();
		});

		it("should set hasError to true", function(){
			expect(executable.hasError()).toBe(true);
		});

		it("should set hasError to true", function(){
			expect(errorSpy).toHaveBeenCalled();
		});

		it("should not call applyViolations", function(){
			expect(executable.applyViolations).toHaveBeenCalled();
		});

	});

	describe("without violations", function(){


		because(function(){
			executable.result.violations = null;

			executable.onError();
		});

		it("should set hasError to true", function(){
			expect(executable.hasError()).toBe(true);
		});

		it("should set hasError to true", function(){
			expect(errorSpy).toHaveBeenCalled();
		});

		it("should not call applyViolations", function(){
			expect(executable.applyViolations).not.toHaveBeenCalled();
		});

	});

});