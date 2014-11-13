describe("when getting a non existing template", {
  "deco/spa/PageLoader": "Mocks/PageLoaderMock"
},[
  "deco/spa/Templates",
  "deco/spa/PageLoader"
], function(
  Templates,
  PageLoader
){

  var templates,
    result;

  beforeEach(function(){
    PageLoader.loadPageSpy.returns(Promise.resolve());
    templates = new Templates(document);
    because: {
      result = templates.getTemplate("path/to/cached/template");
    }
  });

  afterEach(function(){
    PageLoader.loadPageSpy.reset();
    PageLoader.abortSpy.reset();
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

  describe("for the second time", function(){

    because(function(done){
      PageLoader.loadPageSpy.returns(Promise.resolve("content of page"));
      result.then(function(){
        templates.getTemplate("path/to/cached/template");
        done();
      });
    });

    it("should not call the pageLoader again", function(){
      expect(PageLoader.loadPageSpy.callCount).toBe(1);
    });

  });

  
});