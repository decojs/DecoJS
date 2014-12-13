define(["deco/qvc/Validator", "knockout"], function(Validator, ko){

  if (ko != null) {
    ko.bindingHandlers.validationMessageFor = {
      init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = valueAccessor();
        var validator = value.validator;
        if (validator) {
          ko.applyBindingsToNode(element, { hidden: validator.isValid, text: validator.message }, validator);
        }else{
          var attributes = Array.prototype.reduce.call(element.attributes, function(s,e){return s+" "+e.localName+"=\""+e.value+"\""}, "");
          throw new Error("Could not bind `validationMessageFor` to value on element <"+element.tagName.toLowerCase() + attributes +">");
        }
      }
    };
    
    ko.bindingHandlers.command = ko.bindingHandlers.query = {
      init: function (element, valueAccessor, allBindingAccessor, viewModel) {
        ko.applyBindingsToNode(element, { click: valueAccessor() }, viewModel);
      }
    };
  }
  

});