define([
  "deco/spa/viewModelFactory",
  "deco/errorHandler",
  "knockout"
], function(
  viewModelFactory,
  errorHandler,
  ko
){
  
  function hasViewModel(node){
    return node.nodeType === 1 && node.hasAttribute("data-viewmodel") && !('@SymbolDecoViewModel' in node);
  }
  
  var originalBindingProvider = ko.bindingProvider.instance;

  ko.bindingProvider.instance = {
    nodeHasBindings: function(node){
      return hasViewModel(node) || originalBindingProvider.nodeHasBindings(node);
    },
    getBindingAccessors: function(node, context){
      if(hasViewModel(node)){
        return {
          '@SymbolDecoApplyViewModel': function(){ return null; }
        };
       }else{
         return originalBindingProvider.getBindingAccessors(node, context);
       }
    }
  };


  ko.bindingHandlers['@SymbolDecoApplyViewModel'] = {
    init: function(element, valueAccessor, allBindingsAccessor, deprecated, parentContext){
      var parentViewModel = viewModelFactory.getParentViewModelElement(element)['@SymbolDecoViewModel'];
      var whenContext = parentViewModel['@SymbolDecoWhenContext']();

      Promise.resolve(viewModelFactory.getViewModelFromAttributes(element))
      .then(function(data){
        return viewModelFactory.loadViewModel(data)
      }).then(function(data){
        return viewModelFactory.createViewModel(data, whenContext, parentViewModel);
      }).then(function(data){
        data.target['@SymbolDecoViewModel'] = data.viewModel;
        
        var childContext = parentContext.createChildContext(data.viewModel);
        ko.cleanNode(data.target);
        ko.applyBindings(childContext, data.target);
        
        ko.utils.domNodeDisposal.addDisposeCallback(data.target, function() {
          delete data.target['@SymbolDecoViewModel'];
          whenContext.destroy();
        });
      }).catch(function(error){
        errorHandler.onError(error);
      });

      return {
        controlsDescendantBindings: true
      };
    }
  };
});