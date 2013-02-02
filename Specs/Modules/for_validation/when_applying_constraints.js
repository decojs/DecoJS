require(["knockout", "ordnung/validation", "ordnung/koExtensions"], function(ko, validation){
	
	describe("when applying constraints", function(){
		
		var executable,
			constraintRules,
			setOptionsSpy,
			option;
		
		describe("to an executable with one field", function(){
			
			beforeEach(function(){
				executable = {
					parameters: {
						name: ko.observable("ordnung")
					}
				};
				
				setOptionsSpy = sinon.spy();
				
				executable.parameters.name.validator = {
					setConstraints: setOptionsSpy
				};
				
				option = {option: "NotEmpty"};
				
				constraintRules = [
					{
						name:"name",
						constraints:option
					}
				];
				
				validation.applyConstraints(executable, constraintRules);
			});
			
			it("should set the options of the field", function(){
				expect(setOptionsSpy.called).toBe(true);
				expect(setOptionsSpy.callCount).toBe(1);
			});
			
			it("should set the correct constraint", function(){
				expect(setOptionsSpy.getCall(0).args[0]).toBe(option);
			});
		});
		
		
		describe("to an executable with nested fields", function(){
		
			beforeEach(function(){
				executable = {
					parameters: {
						address: {
							street: ko.observable("street")
						},
						name: ko.observable("name")
					}
				};
				
				setOptionsSpy = sinon.spy();
				
				executable.parameters.name.validator = {
					setConstraints: setOptionsSpy
				};
				executable.parameters.address.street.validator = {
					setConstraints: setOptionsSpy
				};
				
				option = {option: "NotEmpty"};
				constraintRules = [
					{
						name:"name",
						constraints:option
					},
					{
						name:"address.street",
						constraints:option
					}
				];
				
				validation.applyConstraints(executable, constraintRules);
			});
			
			it("should set the options of the field", function(){
				expect(setOptionsSpy.called).toBe(true);
				expect(setOptionsSpy.callCount).toBe(2);
			});
			
			it("should set the correct constraint", function(){
				expect(setOptionsSpy.getCall(0).args[0]).toBe(option);
			});
		});
		
		
		describe("to an executable with nested fields inside observables", function(){
		
			beforeEach(function(){
				executable = {
					parameters: {
						address: ko.observable({
							street: ko.observable("street")
						}),
						name: ko.observable("name")
					}
				};
				
				setOptionsSpy = sinon.spy();
				
				executable.parameters.name.validator = {
					setConstraints: setOptionsSpy
				};
				executable.parameters.address().street.validator = {
					setConstraints: setOptionsSpy
				};
				
				option = {option: "NotEmpty"};
				constraintRules = [
					{
						name:"name",
						constraints:option
					},
					{
						name:"address.street",
						constraints:option
					}
				];
				
				validation.applyConstraints(executable, constraintRules);
			});
			
			it("should set the options of the field", function(){
				expect(setOptionsSpy.called).toBe(true);
				expect(setOptionsSpy.callCount).toBe(2);
			});
			
			it("should set the correct constraint", function(){
				expect(setOptionsSpy.getCall(0).args[0]).toBe(option);
			});
		});
		
		
		describe("to an executable without the field required", function(){
		
			beforeEach(function(){
				executable = {
					parameters: {
						name: ko.observable("name")
					}
				};
				
				executable.parameters.name.validator = {
					setConstraints: function(){}
				};
				
				option = {option: "NotEmpty"};
				constraintRules = [
					{
						name:"address",
						constraints:option
					}
				];
				
			});
			
			it("to trow an exception", function(){
				expect(function(){
					validation.applyConstraints(executable, constraintRules);
				}).toThrow(new Error("Error applying constraints to field: address\naddress is not a member of parameters\nparameters = `{\"name\":\"name\"}`"));
			});
		});
		
		describe("to an executable where the field is not an observable", function(){
		
			beforeEach(function(){
				executable = {
					parameters: {
						name: "name"
					}
				};
				
				option = {option: "NotEmpty"};
				constraintRules = [
					{
						name:"name",
						constraints:option
					}
				];
				
			});
			
			it("to trow an exception", function(){
				expect(function(){
					validation.applyConstraints(executable, constraintRules);
				}).toThrow(new Error("Error applying constraints to field: name\nIt is not an observable or is not extended with a validator. \nname=`\"name\"`"));
			});
		});
	});
});