define([
  "deco/utils",
  "deco/errorHandler",
  "deco/spa/viewModelFactory",
  "knockout",
  "deco/spa/extendKnockout"
], function (
  utils,
  errorHandler,
  viewModelFactory,
  ko
) {

  function applyViewModel(data) {
    data.target['@SymbolDecoViewModel'] = data.viewModel;
    ko.applyBindings(data.viewModel, data.target);
  }
  
  function promisify(t,c){
    return function(promise){
      return promise.then(t,c);
    };
  }

  return function (domElement, subscribe) {
    domElement = domElement || document.body;

    var viewModelsLoaded = utils.toArray(domElement.querySelectorAll("[data-viewmodel]"))
    .filter(function(element){
      return viewModelFactory.getParentViewModelElement(element, domElement) ? false : true;
    })
    .map(viewModelFactory.getViewModelFromAttributes)
    .map(viewModelFactory.loadViewModel)
    .map(promisify(function(data){
      return viewModelFactory.createViewModel(data, subscribe);
    }))
    .map(promisify(applyViewModel));
    
    return Promise.all(viewModelsLoaded)['catch'](errorHandler.onError);
  };
});