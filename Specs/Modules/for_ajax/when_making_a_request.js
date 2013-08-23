describe("when making a request", [
	"ordnung/ajax"
], function(
	ajax
){

	var xhr,
		request;


	beforeEach(function(){
		xhr = sinon.useFakeXMLHttpRequest();
		xhr.onCreate = function(req){
			request = req;
		};
	});

	because(function(done){
		ajax("test", {}, "GET", function(){
			done();
		});
		request.respond(200);
	});

	afterEach(function(){
		xhr.restore();
	});


	it("should add the header ajaxRequest header", function(){
		expect(request.requestHeaders['X-Requested-With']).toBe('XMLHttpRequest');
	});


});