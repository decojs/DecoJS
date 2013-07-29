describe("when extending a Validatable", ["knockout", "ordnung/Validatable", "ordnung/koExtensions"], function(ko, Validatable){

	var parameters,
		validatable,
		validatableFields;
	
	
	describe("with one field", function(){
		
		beforeEach(function(){
			parameters = {
				name: ko.observable("ordnung")
			};
			validatable = new Validatable("",parameters);
			validatableFields = validatable.validatableFields;
			
		});
		
		it("should add the field to validatableFields", function(){
			expect(validatableFields.length).toBe(1);
			expect(validatableFields[0]).toBe(parameters.name);
		});
		
		it("should extend the observable with validator", function(){
			expect(parameters.name.validator).toBeDefined();
		});
	});
	
	describe("with nested fields inside an observable", function(){
		
		beforeEach(function(){
			parameters = {
				address: ko.observable({
					street: ko.observable("street"),
					postCode: ko.observable("postcode")
				}),
				name: ko.observable("name")
			};
			validatable = new Validatable("", parameters);
			validatableFields = validatable.validatableFields;
			
		});
		
		it("should add all the field to validatableFields", function(){
			expect(validatableFields.length).toBe(4);
		});
		
		it("should extend the observable with validator", function(){
			expect(parameters.address().street.validator).toBeDefined();
			expect(parameters.address().postCode.validator).toBeDefined();
			expect(parameters.address.validator).toBeDefined();
			expect(parameters.name.validator).toBeDefined();
		});
	});
	
	describe("with nested fields", function(){
		
		beforeEach(function(){
			parameters = {
				address: {
					street: ko.observable("street"),
					postCode: ko.observable("postcode")
				},
				name: ko.observable("name")
			};
			validatable = new Validatable("",parameters);
			validatableFields = validatable.validatableFields;
			
		});
		
		it("should add all the field to validatableFields", function(){
			expect(validatableFields.length).toBe(3);
		});
		
		it("should extend the observable with validator", function(){
			expect(parameters.address.street.validator).toBeDefined();
			expect(parameters.address.postCode.validator).toBeDefined();
			expect(parameters.name.validator).toBeDefined();
		});
	});
});