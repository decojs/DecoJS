describe("when making a request", [
  "deco/ajax"
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

  afterEach(function(){
    xhr.restore();
  });

  describe("to the server", function(){

    because(function(done){
      ajax("test", {}, "GET", done);
      request.respond(200);
    });

    it("should add the header ajaxRequest header", function(){
      expect(request.requestHeaders['X-Requested-With']).toBe('XMLHttpRequest');
    });
  })

  describe("where the url contains a query string", function(){

    because(function(done){
      ajax("test.html?a=5", {}, "GET", done);
      request.respond(200);
    });

    it("should not add a question mark to the end", function(){
      expect(request.url).toBe('test.html?a=5');
    });


  });

  describe("where the url contains a query string and data", function(){

    because(function(done){
      ajax("test.html?a=5", {b:3}, "GET", done);
      request.respond(200);
    });

    it("should not add a question mark to the end", function(){
      expect(request.url).toBe('test.html?a=5&b=3');
    });


  });

  describe("where the url contains a query string ending with & and data", function(){

    because(function(done){
      ajax("test.html?a=5&", {b:3}, "GET", done);
      request.respond(200);
    });

    it("should not add a question mark to the end", function(){
      expect(request.url).toBe('test.html?a=5&b=3');
    });


  });

  describe("which is a PUT", function(){

    because(function(done){
      ajax("test.html", {b:3}, "PUT", done);
      request.respond(200);
    });

    it("should be a PUT request", function(){
      expect(request.method).toBe('PUT');
    });


  });

  describe("which is a POST", function(){

    because(function(done){
      ajax("test.html", {b:3}, "POST", done);
      request.respond(200);
    });

    it("should be a POST request", function(){
      expect(request.method).toBe('POST');
    });

  });


});