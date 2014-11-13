describe("when the page loader returns a 404", {
  "deco/spa/PageLoader": "Mocks/PageLoaderMock"
},[
  "deco/spa/Templates",
  "deco/spa/PageLoader",
  "Given/a_document"
], function(
  Templates,
  PageLoader,
  a_document
){

  var templates,
    result;

  beforeEach(function(){
    PageLoader.loadPageSpy.returns(Promise.reject({error: 404, content: "oh noes!"}));
  });

  afterEach(function(){
    PageLoader.loadPageSpy.reset();
    PageLoader.abortSpy.reset();
  });

  describe("when the document contains an error404 template", function(){

    beforeEach(function(){
      templates = new Templates(a_document.withAnError404Template());
      because: {
        result = templates.getTemplate("path/to/non/existing/template");
      }
    });

    it("should return a promise", function(){
      expect(result.then).toBeDefined();
    });

    it("should call the loadPage method", function(){
      expect(PageLoader.loadPageSpy.callCount).toBe(1);
    });

    it("should abort the previous loading", function(){
      expect(PageLoader.abortSpy.callCount).toBe(1);
    });

    it("should resolve the promise to a template", function(done){
      result.then(function(template){
        expect(template).toBe("could not be found");
        done();
      });
    });
  });

  describe("when the document does not contain an error404 template", function(){

    beforeEach(function(){
      templates = new Templates(document);
      because: {
        result = templates.getTemplate("path/to/non/existing/template");
      }
    });

    it("should return a promise", function(){
      expect(result.then).toBeDefined();
    });

    it("should call the loadPage method", function(){
      expect(PageLoader.loadPageSpy.callCount).toBe(1);
    });

    it("should abort the previous loading", function(){
      expect(PageLoader.abortSpy.callCount).toBe(1);
    });

    it("should resolve the promise to a template", function(done){
      result.then(function(template){
        expect(template).toBe("oh noes!");
        done();
      });
    });

  });

  
});