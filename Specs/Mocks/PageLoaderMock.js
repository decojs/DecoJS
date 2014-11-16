define([

], function(

){
  function PageLoader(){

  }

  PageLoader.prototype.loadPage = PageLoader.loadPageSpy = sinon.stub();
  PageLoader.prototype.abort = PageLoader.abortSpy = sinon.spy();


  return PageLoader;
});