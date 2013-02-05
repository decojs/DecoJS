moquire({
	"ordnung/ajax":"Mocks/ajaxMock"
},["ordnung/qvc", "ordnung/ajax"], function(qvc, ajaxMock){
	
	describe("when executing", function(){
		
		var executable,
			beforeExecute,
			canExecute;
		
		beforeEach(function(){
			beforeExecute = sinon.spy();
			canExecute = sinon.spy();
			ajaxMock.responseText = "{\"parameters\": []}";
			executable = qvc.createCommand("MyCommand", {
				beforeExecute: beforeExecute,
				canExecute: canExecute
			});
			ajaxMock.spy.reset();
			ajaxMock.responseText = "{}"
			executable();
		});
		
		it("should call beforeExecute", function(){
			expect(beforeExecute.callCount).toBe(1);
		});
		
		it("should check canExecute", function(){
			expect(canExecute.callCount).toBe(1);
		});
		
		it("should AJAX the server", function(){
			expect(ajaxMock.spy.callCount).toBe(1);
			var args = ajaxMock.spy.firstCall.args;
			expect(args[0]).toMatch(/command\/MyCommand$/);
		});
	});
	
});