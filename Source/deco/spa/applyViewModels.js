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
    .map(viewModelFactory.getViewModelFromAttributes)
    .map(viewModelFactory.loadViewModel)
    .map(promisify(function(data){
      if(viewModelFactory.getParentViewModelElement(data.target, domElement) ? false : true){
        return data;
      }
    }))
    .map(promisify(function(data){
      if(data){
        return viewModelFactory.createViewModel(data, subscribe);
      }
    }))
    .map(promisify(function(data){
      if(data){
        applyViewModel(data);
      }
    }));
    
    return Promise.all(viewModelsLoaded)['catch'](errorHandler.onError);
  };
});