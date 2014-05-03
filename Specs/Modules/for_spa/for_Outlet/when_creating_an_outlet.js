describe("when creating an outlet", [
  "deco/spa/Outlet"
], function(
  Outlet
){

  var outlet,
    elm;

  beforeEach(function(){
    elm = document.createElement("div");

    outlet = new Outlet(elm);
  });
  
  it("should take two arguments", function(){
    expect(Outlet.length).toBe(2);
  });

  it("should have a way to unload the current page", function(){
    expect(outlet.unloadCurrentPage).toBeA(Function);
    expect(outlet.unloadCurrentPage.length).toBe(0);
  });

  it("should have a way to tell if an outlet exists", function(){
    expect(outlet.outletExists).toBeA(Function);
    expect(outlet.unloadCurrentPage.length).toBe(0);
  });

  it("should have a way to set the page content", function(){
    expect(outlet.setPageContent).toBeA(Function);
    expect(outlet.setPageContent.length).toBe(1);
  });

  it("should have a way to get the current page title", function(){
    expect(outlet.getPageTitle).toBeA(Function);
    expect(outlet.getPageTitle.length).toBe(0);
  });

  it("should have a way to set the document title", function(){
    expect(outlet.setDocumentTitle).toBeA(Function);
    expect(outlet.setDocumentTitle.length).toBe(1);
  });

  it("should have a way to extract and run the page JavaScript", function(){
    expect(outlet.extractAndRunPageJavaScript).toBeA(Function);
    expect(outlet.extractAndRunPageJavaScript.length).toBe(0);
  });

  it("should have a way to indicate that a page is loading", function(){
    expect(outlet.indicatePageIsLoading).toBeA(Function);
    expect(outlet.indicatePageIsLoading.length).toBe(0);
  });

  it("should be told when the page is done loading", function(){
    expect(outlet.pageHasLoaded).toBeA(Function);
    expect(outlet.pageHasLoaded.length).toBe(0);
  });

  it("should have an element", function(){
    expect(outlet.element).toBe(elm);
  });

});