describe("when applying violations", {
	"ordnung/Validator": "Mocks/ValidatorMock"
},["knockout", "ordnung/Validatable", "ordnung/Validator"], function(ko, Validatable, Validator){

	var validatable,
		observable,
		violations;
	
	describe("to an validatable with one field", function(){
		
		beforeEach(function(){
		
			observable = ko.observable();
		
			validatable = new Validatable("",{
				name: observable
			});
			
			
			violations = [
				{
					fieldName:"name",
					message:"not ok"
				}
			];
			
			validatable.applyViolations(violations);
		});
		
		it("should set isValid to false", function(){
			expect(Validator.latest.isValid.called).toBe(true);
			expect(Validator.latest.isValid.firstCall.args[0]).toBe(false);
		});
		
		it("should set the correct message", function(){
			expect(Validator.latest.message.called).toBe(true);
			expect(Validator.latest.message.firstCall.args[0]).toBe("not ok");
		});
	});
	
	describe("to an validatable with nested fields", function(){
		
		beforeEach(function(){
			observable = function(){}
			
			validatable = new Validatable("", {
				address: {
					street: observable
				}
			});
			
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
			
			validatable.applyViolations(violations);
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
	
	describe("to an validatable with nested observable fields", function(){
		
		beforeEach(function(){
			observable = function(){}
			
			validatable = new Validatable("",{
				address: ko.observable({
					street: observable
				})
			});
			
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
			
			validatable.applyViolations(violations);
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
	
	describe("to an validatable without the fields", function(){
		
		beforeEach(function(){
			
			validatable = new Validatable("",{
				name: function(){}
			});
			
			violations = [
				{
					fieldName:"address",
					message:"not ok"
				}
			];
			
		});
		
		it("should throw an exception", function(){
			expect(function(){
				validatable.applyViolations(violations);
			}).toThrow(new Error("Error applying violation: address\naddress is not a member of parameters\nparameters = `{}`"));
		});
	});
	
	describe("to an validatable where the field is not an observable", function(){
		
		beforeEach(function(){
			
			validatable = new Validatable("",{
				name: function(){}
			});
			
			violations = [
				{
					fieldName:"name",
					message:"not ok"
				}
			];
			
		});
		
		it("should throw an exception", function(){
			expect(function(){
				validatable.applyViolations(violations);
			}).toThrow(new Error("Error applying violation\nname is not validatable\nit should be an observable"));
		});
	});
	
	describe("to the validatable", function(){
		
		beforeEach(function(){
			
			validatable = new Validatable("",{});
			
			violations = [
				{
					fieldName:"",
					message:"not ok"
				}
			];
			
			validatable.applyViolations(violations);
			
		});
		
		it("should set isValid to false", function(){
			expect(validatable.validator.isValid.called).toBe(true);
			expect(validatable.validator.isValid.firstCall.args[0]).toBe(false);
		});
		
		it("should set the correct message", function(){
			expect(validatable.validator.message.calledTwice).toBe(true);
			expect(validatable.validator.message.secondCall.args[0]).toBe("not ok");
		});
	});
});