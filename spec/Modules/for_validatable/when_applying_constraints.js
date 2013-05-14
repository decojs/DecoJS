require(["knockout", "ordnung/Validatable", "ordnung/koExtensions"], function(ko, Validatable){
	
	describe("when applying constraints", function(){
		
		var validatable,
			parameters,
			constraintRules,
			setOptionsSpy,
			option;
		
		describe("to an validatable with one field", function(){
			
			beforeEach(function(){
				parameters = {
					name: ko.observable("ordnung")
				}
				validatable = new Validatable("",parameters);
				
				setOptionsSpy = sinon.spy();
				
				parameters.name.validator = {
					setConstraints: setOptionsSpy
				};
				
				option = {option: "NotEmpty"};
				
				constraintRules = [
					{
						name:"name",
						constraints:option
					}
				];
				
				validatable.applyConstraints(constraintRules);
			});
			
			it("should set the options of the field", function(){
				expect(setOptionsSpy.called).toBe(true);
				expect(setOptionsSpy.callCount).toBe(1);
			});
			
			it("should set the correct constraint", function(){
				expect(setOptionsSpy.getCall(0).args[0]).toBe(option);
			});
		});
		
		
		describe("to an validatable with nested fields", function(){
		
			beforeEach(function(){
				parameters = {
					address: {
						street: ko.observable("street")
					},
					name: ko.observable("name")
				};
				validatable = new Validatable("",parameters);
				
				setOptionsSpy = sinon.spy();
				
				parameters.name.validator = {
					setConstraints: setOptionsSpy
				};
				parameters.address.street.validator = {
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
				
				validatable.applyConstraints(constraintRules);
			});
			
			it("should set the options of the field", function(){
				expect(setOptionsSpy.called).toBe(true);
				expect(setOptionsSpy.callCount).toBe(2);
			});
			
			it("should set the correct constraint", function(){
				expect(setOptionsSpy.getCall(0).args[0]).toBe(option);
			});
		});
		
		
		describe("to an validatable with nested fields inside observables", function(){
		
			beforeEach(function(){
				parameters = {
					address: ko.observable({
						street: ko.observable("street")
					}),
					name: ko.observable("name")
				};
				validatable = new Validatable("",parameters);
				
				setOptionsSpy = sinon.spy();
				
				parameters.name.validator = {
					setConstraints: setOptionsSpy
				};
				parameters.address().street.validator = {
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
				
				validatable.applyConstraints(constraintRules);
			});
			
			it("should set the options of the field", function(){
				expect(setOptionsSpy.called).toBe(true);
				expect(setOptionsSpy.callCount).toBe(2);
			});
			
			it("should set the correct constraint", function(){
				expect(setOptionsSpy.getCall(0).args[0]).toBe(option);
			});
		});
		
		
		describe("to an validatable without the field required", function(){
		
			beforeEach(function(){
				parameters = {
					name: ko.observable("name")
				};
				validatable = new Validatable("",parameters);
				
				parameters.name.validator = {
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
					validatable.applyConstraints(constraintRules);
				}).toThrow(new Error("Error applying constraints to field: address\naddress is not a member of parameters\nparameters = `{\"name\":\"name\"}`"));
			});
		});
		
		describe("to an validatable where the field is not an observable", function(){
		
			beforeEach(function(){
				parameters = {
					name: "name"
				};
				validatable = new Validatable("",parameters);
				
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
					validatable.applyConstraints(constraintRules);
				}).toThrow(new Error("Error applying constraints to field: name\nIt is not an observable or is not extended with a validator. \nname=`\"name\"`"));
			});
		});
	});
});