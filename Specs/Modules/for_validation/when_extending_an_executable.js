require(["knockout", "ordnung/validation", "ordnung/koExtensions"], function(ko, validation){
	
	describe("when extending an executable", function(){
		
		var executable,
			validatableFields;
		
		
		describe("when extending an executable with one field", function(){
			
			beforeEach(function(){
				executable = {
					properties: {
						name: ko.observable("ordnung")
					}
				};
				validatableFields = [];
				
				validation.extendExecutable(executable, validatableFields);
			});
			
			it("should add the field to validatableFields", function(){
				expect(validatableFields.length).toBe(1);
				expect(validatableFields[0]).toBe(executable.properties.name);
			});
			
			it("should extend the observable with validator", function(){
				expect(executable.properties.name.validator).toBeDefined();
			});
		});
		
		describe("with nested fields inside an observable", function(){
			
			beforeEach(function(){
				executable = {
					properties: {
						address: ko.observable({
							street: ko.observable("street"),
							postCode: ko.observable("postcode")
						}),
						name: ko.observable("name")
					}
				};
				validatableFields = [];
				
				validation.extendExecutable(executable, validatableFields);
			});
			
			it("should add all the field to validatableFields", function(){
				expect(validatableFields.length).toBe(4);
			});
			
			it("should extend the observable with validator", function(){
				expect(executable.properties.address().street.validator).toBeDefined();
				expect(executable.properties.address().postCode.validator).toBeDefined();
				expect(executable.properties.address.validator).toBeDefined();
				expect(executable.properties.name.validator).toBeDefined();
			});
		});
		
		describe("with nested fields", function(){
			
			beforeEach(function(){
				executable = {
					properties: {
						address: {
							street: ko.observable("street"),
							postCode: ko.observable("postcode")
						},
						name: ko.observable("name")
					}
				};
				validatableFields = [];
				
				validation.extendExecutable(executable, validatableFields);
			});
			
			it("should add all the field to validatableFields", function(){
				expect(validatableFields.length).toBe(3);
			});
			
			it("should extend the observable with validator", function(){
				expect(executable.properties.address.street.validator).toBeDefined();
				expect(executable.properties.address.postCode.validator).toBeDefined();
				expect(executable.properties.name.validator).toBeDefined();
			});
		});
	
	
	});
});