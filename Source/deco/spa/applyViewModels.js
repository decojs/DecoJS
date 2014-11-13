define([
  "deco/utils",
  "deco/errorHandler",
  "knockout", 
], function (
  utils, 
  errorHandler,
  ko
) {


  function getAttributes(target){

    var viewModelName = target.getAttribute("data-viewmodel");
    var model = target.getAttribute("data-model");
    if (model && model.indexOf("{") == 0) {
      model = JSON.parse(model);
    }

    return {
      target: target,
      viewModelName: viewModelName,
      model: model
    };
  }


  function loadViewModel(data){

    return new Promise(function(resolve, reject){
      require([data.viewModelName], resolve, reject);
    }).then(function(ViewModel){
      data.ViewModel = ViewModel;
      return data;
    }, function(error){
      errorHandler.onError(new Error("Could not load the following modules:\n"+error.requireModules.join("\n")));
      return null;
    });
  }

  function applyViewModel(subscribe, data) {
    try{
      var viewModel = new data.ViewModel(data.model || {}, subscribe);
      ko.applyBindings(viewModel, data.target);
    }catch(e){
      errorHandler.onError(e);
    }
  }

  function viewModelLoadedSuccessfully(data){
    return data != null && data.ViewModel != null;
  }

  return function (domElement, subscribe) {

    domElement = domElement || document.body;

    var viewModelsLoaded = utils.toArray(domElement.querySelectorAll("[data-viewmodel]"))
      .filter(function(element){
        while(element = element.parentNode){
          if(element === domElement) return true;
          if(element.hasAttribute("data-viewmodel")) return false;
        }
        return true;
      })
      .map(getAttributes)
      .map(loadViewModel);

    return Promise.all(viewModelsLoaded).then(function(list){
      list
        .filter(viewModelLoadedSuccessfully)
        .forEach(function(data){
          applyViewModel(subscribe, data);
        });
    });
  };
});