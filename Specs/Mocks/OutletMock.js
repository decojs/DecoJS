define([], function(){

  function Outlet(){
    Outlet.constructed();
  }
  Outlet.constructed = sinon.spy();
  Outlet.prototype.indicatePageIsLoading = Outlet.indicatePageIsLoading = sinon.spy();
  Outlet.prototype.unloadCurrentPage = Outlet.unloadCurrentPage = sinon.spy();
  Outlet.prototype.setPageContent = Outlet.setPageContent = sinon.spy();
  Outlet.prototype.getPageTitle = Outlet.getPageTitle = sinon.stub();
  Outlet.prototype.setDocumentTitle = Outlet.setDocumentTitle = sinon.spy();
  Outlet.prototype.extractAndRunPageJavaScript = Outlet.extractAndRunPageJavaScript = sinon.spy();
  Outlet.prototype.pageHasLoaded = Outlet.pageHasLoaded = sinon.spy();
  Outlet.prototype.outletExists = Outlet.outletExists = sinon.stub().returns(true);
  Outlet.prototype.element;
  
  Outlet.reset = function(){
    Outlet.constructed.reset();
    Outlet.indicatePageIsLoading.reset();
    Outlet.unloadCurrentPage.reset();
    Outlet.setPageContent.reset();
    Outlet.getPageTitle.reset();
    Outlet.setDocumentTitle.reset();
    Outlet.extractAndRunPageJavaScript.reset();
    Outlet.pageHasLoaded.reset();
    Outlet.outletExists.reset();
  }

  return Outlet;
});