define([
  "deco/spa/viewModelFactory",
  "deco/errorHandler",
  "knockout"
], function(
  viewModelFactory,
  errorHandler,
  ko
){
    
  var nativeBindingProviderInstance = new ko.bindingProvider();
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
      try{
      var params = getComponentParamsFromCustomElement(element, parentContext);
      }catch(e){
        console.error(e.stack);
      }
      Promise.resolve(viewModelFactory.getViewModelFromAttributes(element))
      .then(function(data){
        return viewModelFactory.loadViewModel(data)
      }).then(function(data){
        return viewModelFactory.createViewModel(data, whenContext, params);
      }).then(function(data){
        data.target['@SymbolDecoViewModel'] = data.viewModel;
        
        var childContext = parentContext.createChildContext(data.viewModel);
        ko.utils.domData.clear(data.target);
        ko.applyBindings(childContext, data.target);
        
        ko.utils.domNodeDisposal.addDisposeCallback(data.target, function() {
          delete data.target['@SymbolDecoViewModel'];
          whenContext.destroyChildContexts();
        });
      })['catch'](errorHandler.onError);

      return {
        controlsDescendantBindings: true
      };
    }
  };
  
  //this is stolen from the knockout sourcecode, and I had to copy it since it's not exposed as a public api

  function getComponentParamsFromCustomElement(elem, bindingContext) {
    var paramsAttribute = elem.getAttribute('data-params');

    if (!paramsAttribute) {
      return undefined;
    }
    
    var params = nativeBindingProviderInstance['parseBindingsString'](paramsAttribute, bindingContext, elem, { 'valueAccessors': true, 'bindingParams': true });
    var rawParamComputedValues = Object.create(null);
    for(paramName in params) {
      var paramValue = params[paramName];
      rawParamComputedValues[paramName] = ko.computed(paramValue, null, { disposeWhenNodeIsRemoved: elem });
    }
    var result = Object.create(null);
    for(paramName in rawParamComputedValues) {
      var paramValueComputed = rawParamComputedValues[paramName];
      var paramValue = paramValueComputed.peek();
      // Does the evaluation of the parameter value unwrap any observables?
      if (!paramValueComputed.isActive()) {
        // No it doesn't, so there's no need for any computed wrapper. Just pass through the supplied value directly.
        // Example: "someVal: firstName, age: 123" (whether or not firstName is an observable/computed)
        result[paramName] = paramValue;
      } else {
        // Yes it does. Supply a computed property that unwraps both the outer (binding expression)
        // level of observability, and any inner (resulting model value) level of observability.
        // This means the component doesn't have to worry about multiple unwrapping. If the value is a
        // writable observable, the computed will also be writable and pass the value on to the observable.
        result[paramName] = ko.computed({
          'read': function() {
            return ko.unwrap(paramValueComputed());
          },
          'write': ko.isWriteableObservable(paramValue) && function(value) {
            paramValueComputed()(value);
          },
          disposeWhenNodeIsRemoved: elem
        });
      }
    }
    return result;
  }
  
  function hasViewModel(node){
    return node.nodeType === 1 && node.hasAttribute("data-viewmodel") && !('@SymbolDecoViewModel' in node);
  }
});