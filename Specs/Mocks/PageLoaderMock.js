define([

], function(

){
  function PageLoader(){

  }

  PageLoader.prototype.loadPage = PageLoader.loadPageSpy = sinon.spy();
  PageLoader.prototype.abort = PageLoader.abortSpy = sinon.spy();


  return PageLoader;
});