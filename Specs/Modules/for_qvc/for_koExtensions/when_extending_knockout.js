describe("when extending knockout", {
	'knockout':function(){
		return { 
			bindingHandlers: {},
			extenders: {}
		}
	}
},[
	'ordnung/qvc/koExtensions',
	'knockout'
], function(
	koExtensions,
	ko
){

	it("should add a validationMessageFor extension", function(){
		expect(ko.bindingHandlers.validationMessageFor).toBeDefined();
	});

	describe("with validationMessageFor", function(){

		beforeEach(function(){
			ko.applyBindingsToNode = sinon.spy();
		});

		describe("on a value which has a validator", function(){

			because(function(){
				ko.bindingHandlers.validationMessageFor.init("element", function(){
					return {validator:true};
				});
			});

			it("should call applyBindingsToNode", function(){
				expect(ko.applyBindingsToNode).toHaveBeenCalledWith("element", sinon.match.any, true);
			});

		});

		describe("on a value which does not have a validator", function(){

			expect(function(){
				ko.bindingHandlers.validationMessageFor.init("element", function(){
					return {};
				});
			}).toThrow();

		});

	});

});