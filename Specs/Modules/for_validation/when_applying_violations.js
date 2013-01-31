require(["knockout", "ordnung/validation", "ordnung/koExtensions"], function(ko, validation){
	
	describe("when applying violations", function(){
		
		var executable,
			observable,
			violations;
		
		describe("to an executable with one field", function(){
			
			beforeEach(function(){
			
				observable = function(){};
			
				executable = {
					properties: {
						name: observable
					}
				};
				
				observable.validator = {
					isValid: sinon.spy(),
					message: sinon.spy()
				};
				
				violations = [
					{
						fieldName:"name",
						message:"not ok"
					}
				];
				
				validation.applyViolations(executable, violations);
			});
			
			it("should set isValid to false", function(){
				expect(observable.validator.isValid.called).toBe(true);
				expect(observable.validator.isValid.firstCall.args[0]).toBe(false);
			});
			
			it("should set the correct message", function(){
				expect(observable.validator.message.called).toBe(true);
				expect(observable.validator.message.firstCall.args[0]).toBe("not ok");
			});
		});
		
		describe("to an executable with nested fields", function(){
			
			beforeEach(function(){
				observable = function(){}
				
				executable = {
					properties: {
						address: {
							street: observable
						}
					}
				};
				
				observable.validator = {
					isValid: sinon.spy(),
					message: sinon.spy()
				};
				
				violations = [
					{
						fieldName:"address.street",
						message:"not ok"
					}
				];
				
				validation.applyViolations(executable, violations);
			});
			
			it("should set isValid to false", function(){
				expect(observable.validator.isValid.called).toBe(true);
				expect(observable.validator.isValid.firstCall.args[0]).toBe(false);
			});
			
			it("should set the correct message", function(){
				expect(observable.validator.message.called).toBe(true);
				expect(observable.validator.message.firstCall.args[0]).toBe("not ok");
			});
		});
		
		describe("to an executable with nested observable fields", function(){
			
			beforeEach(function(){
				observable = function(){}
				
				executable = {
					properties: {
						address: ko.observable({
							street: observable
						})
					}
				};
				
				observable.validator = {
					isValid: sinon.spy(),
					message: sinon.spy()
				};
				
				violations = [
					{
						fieldName:"address.street",
						message:"not ok"
					}
				];
				
				validation.applyViolations(executable, violations);
			});
			
			it("should set isValid to false", function(){
				expect(observable.validator.isValid.called).toBe(true);
				expect(observable.validator.isValid.firstCall.args[0]).toBe(false);
			});
			
			it("should set the correct message", function(){
				expect(observable.validator.message.called).toBe(true);
				expect(observable.validator.message.firstCall.args[0]).toBe("not ok");
			});
		});
		
		describe("to an executable without the fields", function(){
			
			beforeEach(function(){
				
				executable = {
					properties: {
						name: function(){}
					}
				};
				
				violations = [
					{
						fieldName:"address",
						message:"not ok"
					}
				];
				
			});
			
			it("should throw an exception", function(){
				expect(function(){
					validation.applyViolations(executable, violations);
				}).toThrow(new Error("Error applying violation: address\naddress is not a member of properties\nproperties = `[object Object]`"));
			});
		});
		
		describe("to an executable where the field is not an observable", function(){
			
			beforeEach(function(){
				
				executable = {
					properties: {
						name: function(){}
					}
				};
				
				violations = [
					{
						fieldName:"name",
						message:"not ok"
					}
				];
				
			});
			
			it("should throw an exception", function(){
				expect(function(){
					validation.applyViolations(executable, violations);
				}).toThrow(new Error("Error applying violation\nname is not validatable\nit should be an observable"));
			});
		});
		
		describe("to the executable", function(){
			
			beforeEach(function(){
				
				executable = {
					validator: {
						isValid: sinon.spy(),
						message: sinon.spy(function(){return ""})
					}
				};
				
				violations = [
					{
						fieldName:"",
						message:"not ok"
					}
				];
				
				validation.applyViolations(executable, violations);
				
			});
			
			it("should set isValid to false", function(){
				expect(executable.validator.isValid.called).toBe(true);
				expect(executable.validator.isValid.firstCall.args[0]).toBe(false);
			});
			
			it("should set the correct message", function(){
				expect(executable.validator.message.calledTwice).toBe(true);
				expect(executable.validator.message.secondCall.args[0]).toBe("not ok");
			});
		});
	});
});