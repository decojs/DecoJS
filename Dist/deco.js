define('deco/utils',[], function(){
  return {
    
    toArray: function(obj){
      var array = [];
      // iterate backwards ensuring that length is an UInt32
      for (var i = obj.length >>> 0; i--;) { 
        array[i] = obj[i];
      }
      return array;
    },
    
    extend: function(dst, src){
      src = src || {};
      dst = dst || {};
      for(var i in src){
        dst[i] = src[i];
      }
      return dst;
    },
    
    inheritsFrom: function(o){
      function F() {}
      F.prototype = o.prototype;

      return new F();
    },
    
    arrayToObject: function(array, func){
      return array.reduce(function(collection, item){
        func(item, collection);
        return collection;
      }, {});
    },
    
    trim: function(word, character){
      for(var f=0; f<word.length; f++){
        if(word.charAt(f) !== character) break;
      }
      for(var t=word.length; t>0; t--){
        if(word.charAt(t-1) !== character) break;
      }
      return word.substring(f, t);
    },
    
    after: function(word, character){
      var index = word.indexOf(character);
      if(index < 0){
        return "";
      }else{
        return word.substr(index+1);
      }
    },
    
    popTail: function(array){
      return array.slice(0, -1);
    },
    
    startsWith: function(word, character){
      return word.charAt(0) === character;
    },
    
    endsWith: function(word, character){
      return word.charAt(word.length - 1) === character;
    },
    
    addEventListener: function(element, event, listener, bubble){
      if('addEventListener' in element){
        element.addEventListener(event, listener, bubble);
      }else{
        element.attachEvent("on"+event, listener);    
      }
    }
  };
});

define('deco/qvc/ExecutableResult',["deco/utils"], function(utils){
  function ExecutableResult(result){
    
    this.success = false;
    this.valid = false;
    this.result = null;
    this.exception = null;
    this.violations = [];
  
    utils.extend(this, result);
  
  };
  
  return ExecutableResult;
});
define('deco/qvc/Constraint',[], function(){
  
  function Constraint(type, attributes){    
    this.type = type;
    this.attributes = attributes;
    this.message = attributes.message;
    
    
    this.init(type);
  }
    
  Constraint.prototype.init = function(type){
    require(["deco/qvc/constraints/" + type], function(Tester){
      var tester = new Tester(this.attributes);
      this.validate = tester.isValid.bind(tester);
    }.bind(this));
  };
  
  Constraint.prototype.validate = function(value){
    return true;//real test not loaded yet
  };
  
  
  return Constraint;
});
define('deco/qvc/Validator',[
  "deco/qvc/Constraint", 
  "knockout"
], function(
  Constraint, 
  ko
){

  function interpolate(message, attributes, value, name, path){
    return message.replace(/\{([^}]+)\}/g, function(match, key){
      if(key == "value") return value;
      if(key == "this.name") return name;
      if(key == "this.path") return path;
      if(key in attributes) return attributes[key];
      return match;
    });
  }
  

  function Validator(target, options){
    var self = this;
    
    this.constraints = [];
    
    this.isValid = ko.observable(true);
    this.message = ko.observable("");

    this.name = options && options.name;
    this.path = options && options.path;
    this.executableName = options && options.executableName;
    
    if(target && ko.isObservable(target)){
      target.isValid = function(){return self.isValid();};
    }
  }
  
  Validator.prototype.setConstraints = function(constraints){
    this.constraints = constraints.map(function(constraint){
      return new Constraint(constraint.name, constraint.attributes);
    });
  };
  
  Validator.prototype.reset = function(){
    this.isValid(true);
    this.message("");
  };
  
  Validator.prototype.validate = function(value){
    if(this.constraints.length == 0){
      this.reset();
    }else if(this.constraints.every(function (constraint) {
      if(constraint.validate(value)){
        return true;
      }else{
        this.isValid(false);
        this.message(interpolate(constraint.message, constraint.attributes, value, this.name, this.path));
        return false;
      }
    }.bind(this))){
      this.isValid(true);
      this.message("");
    }
  };
  
  return Validator;
});
define('deco/qvc/koExtensions',["deco/qvc/Validator", "knockout"], function(Validator, ko){

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
define('deco/qvc/Validatable',[
  "deco/utils", 
  "deco/qvc/Validator", 
  "knockout", 
  "deco/qvc/koExtensions"
], function(
  utils, 
  Validator, 
  ko
){
  
  function Validatable(name, parameters, constraintResolver){
    var self = this;
    
    this.validator = new Validator();
    this.validatableFields = [];
    this.validatableParameters = parameters;
    
    
    init: {
      recursivlyExtendParameters(self.validatableParameters, self.validatableFields, [], name);
      if(constraintResolver)
        constraintResolver.applyValidationConstraints(name, self);
    }
  }
  
  Validatable.prototype.isValid = function () {
    return this.validatableFields.every(function(constraint){
      return constraint.validator && constraint.validator.isValid();
    }) && this.validator.isValid();
  };
    
  Validatable.prototype.applyViolations = function(violations){
    violations.forEach(function(violation){
      var message = violation.message;
      var fieldName = violation.fieldName;
      if (fieldName && fieldName.length > 0) {
        //one of the fields violates a constraint
        applyViolationMessageToField(this.validatableParameters, fieldName, message);
      } else {
        //the validatable violates a constraint
        applyViolationMessageToValidatable(this, message);
      }
    }.bind(this));
  };
  
  Validatable.prototype.applyConstraints = function(fields){
    var parameters = this.validatableParameters;
    
    fields.forEach(function(field){
      var fieldName = field.name;
      var constraints = field.constraints;

      if(constraints == null || constraints.length == 0)
        return;
      
      var object = findField(fieldName, parameters, "Error applying constraints to field");
      
      if (ko.isObservable(object) && "validator" in object) {
        object.validator.setConstraints(constraints);
      } else {
        throw new Error("Error applying constraints to field: " + fieldName + "\n" +
          "It is not an observable or is not extended with a validator. \n" +
          fieldName + "=`" + ko.toJSON(object) + "`");
      }
    });
  };
  
  Validatable.prototype.validate = function(){
    this.validator.validate(true);
    if (this.validator.isValid()) {
      this.validatableFields.forEach(function(constraint){
        var validator = constraint.validator;
        if (validator) {
          validator.validate(constraint());
        }
      });
    }
  };
  
  Validatable.prototype.clearValidationMessages = function () {
    this.validator.reset();
    this.validatableFields.forEach(function(constraint){
      var validator = constraint.validator;
      if (validator) {
        validator.reset();
      }
    });
  };
  
  
  
  function recursivlyExtendParameters(parameters, validatableFields, parents, executableName) {
    for (var key in parameters) {
      var property = parameters[key];
      var path = parents.concat([key]);
      if (ko.isObservable(property)) {        
        validatableFields.push(applyValidatorTo(property, key, path, executableName));
      }
      property = ko.utils.unwrapObservable(property);
      if (typeof property === "object") {
        recursivlyExtendParameters(property, validatableFields, path, executableName);
      }
    }
  }


  function findField(fieldPath, parameters, errorMessage){
    return fieldPath.split(".").reduce(function(object, name){
      var path = object.path;
      var field = ko.utils.unwrapObservable(object.field);
      if (name in field) {
        return {
          field: field[name],
          path: path + "." + name
        };
      } else {
        throw new Error(errorMessage + ": " + fieldPath + "\n" +
          name + " is not a member of " + path + "\n" +
          path + " = `" + ko.toJSON(field) + "`");
      }
    }, {
      field: parameters,
      path: "parameters"
    }).field;
  }



  
  function applyViolationMessageToField(parameters, fieldPath, message) {
    var object = findField(fieldPath, parameters, "Error applying violation");
    
    if (typeof message === "string" && "validator" in object) {
      object.validator.isValid(false);
      object.validator.message(message);
    }else{
      throw new Error("Error applying violation\n"+fieldPath+" is not validatable\nit should be an observable");
    }
  };

  function applyViolationMessageToValidatable(validatable, message) {
    validatable.validator.isValid(false);
    var oldMessage = validatable.validator.message();
    var newMessage = oldMessage.length == 0 ? message : oldMessage + ", " + message;
    validatable.validator.message(newMessage);
  };
  
  function applyValidatorTo(property, key, path, executableName){
    if('validator' in property && property.validator instanceof Validator){
      throw new Error("Observable `"+path+"` is parameter `"+property.validator.path+"` in "+property.validator.executableName+" and therefore cannot be a parameter in "+executableName+"!");
    }

    property.validator = new Validator(property, {
      name: key,
      path: path.join("."),
      executableName: executableName
    });

    property.subscribe(function (newValue) {
      property.validator.validate(newValue);
    });
    
    return property;
  }
  
  return Validatable;
});
define('deco/qvc/Executable',[
  "deco/qvc/ExecutableResult", 
  "deco/qvc/Validatable", 
  "deco/utils", 
  "knockout"
], function(
  ExecutableResult, 
  Validatable, 
  utils, 
  ko){

  function Executable(name, type, parameters, hooks, qvc){    
    Validatable.call(this, name, parameters, qvc.constraintResolver)
    
    this.name = name;
    this.type = type;
    this.qvc = qvc;
    this.isBusy = ko.observable(false);
    this.hasError = ko.observable(false);
    this.result = new ExecutableResult();
    
    this.parameters = Object.seal(parameters);
    this.hooks = utils.extend({
      beforeExecute: function () {},
      canExecute: function(){return true;},
      error: function () {},
      success: function () {},
      result: function(){},
      complete: function () {},
      invalid: function() {}
    }, hooks);
  }
    
  Executable.prototype = utils.inheritsFrom(Validatable);
    
  Executable.prototype.execute = function () {
    if (this.isBusy()) {
      return false;
    }

    this.hasError(false);

    this.hooks.beforeExecute();

    this.validate();
    if (!this.isValid()) {
      this.hooks.invalid();
      return false;
    }

    if (this.hooks.canExecute() === false) {
      return false;
    }
    this.isBusy(true);

    this.qvc.execute(this);
    return false;
  };

  Executable.prototype.onError = function () {
    if("violations" in this.result && this.result.violations != null && this.result.violations.length > 0){
      this.applyViolations(this.result.violations);
      this.hooks.invalid();
    }else{
      this.hasError(true);
      this.hooks.error(this.result);
    }
  };

  Executable.prototype.onSuccess = function () {
    this.hasError(false);
    this.clearValidationMessages();
    this.hooks.success(this.result);
    this.hooks.result(this.result.result);
  };

  Executable.prototype.onComplete = function () {
    this.hooks.complete();
    this.isBusy(false);
  };
  
  Executable.Command = "command";
  Executable.Query = "query";
  
  return Executable;
});
define('deco/ajax',[], function(){
  function dataToParams(data){
    var params = []
    for(var key in data){
      var value = data[key];
      params.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    }
    return params.join("&");
  }

  function addParamToUrl(url, name, value){
    return url + (url.match(/\?/) ? (url.match(/&$/) ? "" : "&") : "?") + encodeURIComponent(name) + "=" + encodeURIComponent(value);
  }

  function addParamsToUrl(url, data){
    var params = dataToParams(data);
    return url + (url.match(/\?/) ? (url.match(/&$/) ? "" : (params.length > 0 ? "&" : "")) : "?") + params;
  }

  function addToPath(url, segment){
    return url + (url.match(/\/$/) ? "" : "/") + segment;
  }

  function cacheBust(url){
    return addParamToUrl(url, "cacheKey", Math.floor(Math.random()*Math.pow(2,53)));
  }

  function ajax(url, object, method, callback){
    var xhr = new XMLHttpRequest();
    
    var isPost = (method === "POST");
    var data = null;
    
    if(object){

      if(isPost){
        data = dataToParams(object);
      } else {
        url = addParamsToUrl(url, object);
      }
    }
    
    if(isPost){
      url = cacheBust(url);
    }

    xhr.open(method, url, true);
    
    if(isPost && data){
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    }
    
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    
    xhr.onreadystatechange = function(){
      if(xhr.readyState == 4){
        callback(xhr);
      }
    }
    
    xhr.send(data);
    return xhr;
  }

  ajax.addParamToUrl = addParamToUrl;
  ajax.addParamsToUrl = addParamsToUrl;
  ajax.addToPath = addToPath;
  ajax.cacheBust = cacheBust;


  return ajax;
});
define('deco/qvc/ConstraintResolver',[], function(){

  var STATE_LOADING = 'loading';
  var STATE_LOADED = 'loaded';

  function findConstraint(name, constraints) {
    for (var i = 0; i < constraints.length; i++) {
      if (constraints[i].name == name) {
        return constraints[i];
      }
    }
    return false;
  }

  function constraintsLoaded(name, fields){
    var constraint = findConstraint(name, this.constraints);
    if(constraint){
      constraint.validatables.forEach(function(validatable){
        validatable.applyConstraints(fields);
      });
      constraint.fields = fields;
      constraint.state = STATE_LOADED;
      constraint.validatables = [];
    }
  }


  function ConstraintResolver(qvc){
    this.qvc = qvc;
    this.constraints = [];
  }
  
  ConstraintResolver.prototype.applyValidationConstraints = function(name, validatable){
    var constraint = findConstraint(name, this.constraints);
    if(constraint === false){
      this.constraints.push({
        name: name,
        state: STATE_LOADING,
        validatables: [validatable]
      });
      this.qvc.loadConstraints(name, constraintsLoaded.bind(this));
    }else{
      if(constraint.state === STATE_LOADING){
        constraint.validatables.push(validatable);
      }else{
        validatable.applyConstraints(constraint.fields);
      }
    }
  };
  
  return ConstraintResolver;
});
define('deco/errorHandler',[], function(){
  return {
    onError: function(error){
      setTimeout(function(){
        throw error;
      },1);
    }
  };
});
define('deco/qvc',[
  "deco/qvc/Executable", 
  "deco/qvc/ExecutableResult", 
  "deco/utils", 
  "deco/ajax",
  "deco/qvc/ConstraintResolver",
  "deco/errorHandler",
  "knockout", 
  "deco/qvc/koExtensions"], 
  function(
    Executable,
    ExecutableResult,
    utils,
    ajax,
    ConstraintResolver,
    errorHandler,
    ko){
  
  function QVC(){

    var qvc = this;

    this.constraintResolver = new ConstraintResolver(qvc);

    this.execute = function(executable){
      var parameters = ko.toJS(executable.parameters);
      var data = {
        parameters: JSON.stringify(parameters),
        csrfToken: qvc.config.csrf
      };
      var url = ajax.addToPath(qvc.config.baseUrl, executable.type + "/" + executable.name);
      ajax(url, data, "POST", function (xhr) {
        if (xhr.status === 200) {
          executable.result = new ExecutableResult(JSON.parse(xhr.responseText || "{}"));
          if (executable.result.success === true) {
            executable.onSuccess();
          } else {
            if(executable.result.exception && executable.result.exception.message){
              errorHandler.onError(executable.result.exception.message);
            }
            executable.onError();
          }
        } else {
          executable.result = new ExecutableResult({exception: {message: xhr.responseText, cause: xhr}});
          errorHandler.onError(executable.result.exception.message);
          executable.onError();
        }
        executable.onComplete();
      });
    
    };
    
    this.loadConstraints = function(name, callback){
      var url = ajax.addToPath(qvc.config.baseUrl, "constraints/" + name);
      ajax(url, null, "GET", function(xhr){
        if (xhr.status === 200) {
          try{
            var response = JSON.parse(xhr.responseText || "{\"parameters\":[]}");
            if("parameters" in response == false){
              response.parameters = [];
            }
            if(response.exception && response.exception.message){
              errorHandler.onError(response.exception.message);
            }
          }catch(e){
            var response = {parameters: []};
          }
          callback(name, response.parameters);
        }else{
          errorHandler.onError(xhr.responseText);
        }
      });
    };

    
    this.config = {
      baseUrl: "/",
      csrf: ""
    }
  };

  var qvc = new QVC();
  
  function createExecutable(name, type, parameters, callbacks){  
    var executable = new Executable(name, type, parameters || {}, callbacks || {}, qvc);
    var execute = executable.execute.bind(executable);
    execute.isValid = ko.computed(executable.isValid, executable);
    execute.isBusy = ko.computed(executable.isBusy, executable);
    execute.hasError = ko.computed(executable.hasError, executable);
    execute.success = function(callback){
      executable.hooks.success = callback;
      return execute;
    };
    execute.error = function(callback){
      executable.hooks.error = callback;
      return execute;
    };
    execute.invalid = function(callback){
      executable.hooks.invalid = callback;
      return execute;
    };
    execute.beforeExecute = function(callback){
      executable.hooks.beforeExecute = callback;
      return execute;
    };
    execute.canExecute = function(callback){
      executable.hooks.canExecute = callback;
      return execute;
    };
    execute.result = function(){
      if(arguments.length == 1){
        executable.hooks.result = arguments[0];
        return execute;
      }
      return executable.result.result;
    };
    execute.complete = function(callback){
      executable.hooks.complete = callback;
      return execute;
    };
    execute.clearValidationMessages = executable.clearValidationMessages.bind(executable);
    execute.validator = executable.validator;
    execute.parameters = executable.parameters;
    execute.validate = executable.validate.bind(executable);
    
    return execute;
  }
  
  return {
    createCommand: function(name, parameters, hooks){
      if(name == null || name.length == 0)
        throw new Error("Command is missing name\nA command must have a name!\nusage: createCommand('name', [parameters, hooks])");
      return createExecutable(name, Executable.Command, parameters, hooks);
    },
    createQuery: function(name, parameters, hooks){
      if(name == null || name.length == 0)
        throw new Error("Query is missing name\nA query must have a name!\nusage: createQuery('name', [parameters, hooks])");
      return createExecutable(name, Executable.Query, parameters, hooks);
    },
    config: function(config){
      utils.extend(qvc.config, config);
    }
  }
});
define('deco/spa/Outlet',[
  "knockout"
], function(
  ko
){

  function Outlet(element, document){
    this.element = element;
    this.document = document || window.document;
  }

  Outlet.prototype.outletExists = function(){
    return this.element != null;
  };

  Outlet.prototype.unloadCurrentPage = function(){
    ko.cleanNode(this.element);
    this.element.innerHTML = "";
  };

  Outlet.prototype.setPageContent = function(content){
    this.element.innerHTML = content;
  };

  Outlet.prototype.getPageTitle = function(){
    var titleMetaTag = this.element.querySelector("meta[name=title]");
    return (titleMetaTag && titleMetaTag.getAttribute("content"));
  };

  Outlet.prototype.setDocumentTitle = function(title){
    this.document.title = title;
  };

  Outlet.prototype.extractAndRunPageJavaScript = function(){
    var scripts = this.element.querySelectorAll("script[type='text/javascript']");
    for(var i=0; i<scripts.length; i++){
      scripts[i].parentNode.removeChild(scripts[i]);
      if(scripts[i].id === '') throw new Error("The script must have an id");
      if(this.document.getElementById(scripts[i].id) == null){
        var script = this.document.createElement("script");
        script.id = scripts[i].id;
        script.text = scripts[i].textContent;
        script.setAttribute('type', scripts[i].getAttribute('type'));
        this.document.body.appendChild(script);
      }
    }
  };

  Outlet.prototype.indicatePageIsLoading = function(){
    this.element.setAttribute("data-loading", "true");
  };

  Outlet.prototype.pageHasLoaded = function(){
    this.element.setAttribute("data-loading", "false");
  };

  return Outlet;

});
define('deco/spa/whenContext',[
  
], function(
  
){

  function unsubscribe(event, reaction){
    event.dont(reaction);
  }

  function subscribe(event, reaction){
    event(reaction);
    return event.dont.bind(null, reaction);
  }

  function whenSomething(){
    if(this.destroyed) throw new Error("This context has been destroyed!");

    if(arguments.length == 0){
      var childContext = createContext();
      this.childContexts.push(childContext);
      return childContext.when;
    }else if(arguments.length == 1 && typeof arguments[0] === "function"){
      return {
        dont: unsubscribe.bind(null, arguments[0])
      }
    }else if(arguments.length == 2 && typeof arguments[1] === "function"){
      this.eventSubscribers.push(subscribe(arguments[0], arguments[1]));
    }
  }

  function thisIsDestroyed(reaction){
    this.onDestroyListeners.push(reaction);
  }

  function destroyChildContexts(){
    var context;
    while(context = this.childContexts.pop())
      context.destroyContext();
  }

  function destroyContext(){
    var subscriber, listener, context;
    while(subscriber = this.eventSubscribers.pop())
      subscriber();
    while(listener = this.onDestroyListeners.pop())
      listener();
    while(context = this.childContexts.pop())
      context.destroyContext();
    this.destroyed = true;
  }

  function createContext(){
    var context = {
      destroyed: false,
      onDestroyListeners: [],
      childContexts: [],
      eventSubscribers: []
    };

    var when = whenSomething.bind(context);

    when.thisIsDestroyed = thisIsDestroyed.bind(context);

    when.destroyChildContexts = destroyChildContexts.bind(context);

    return {
      when: when,
      destroyContext: destroyContext.bind(context)
    };
  }

  return createContext().when;
});
define('deco/spa/viewModelFactory',[
  "deco/errorHandler"
], function(
  errorHandler
) {
  return {
    getViewModelFromAttributes: function(target){
      var viewModelName = target.getAttribute("data-viewmodel");
      var model = target.getAttribute("data-model");

      return {
        target: target,
        viewModelName: viewModelName,
        model: model
      };
    },
    
    getParentViewModelElement: function(element, maxAncestor){
      while(element = element.parentNode){
        if(element === maxAncestor) return null;
        if(element.hasAttribute("data-viewmodel")) return element;
      }
      return null;
    },
    
    loadViewModel: function(data){
      return new Promise(function(resolve, reject){
        require([data.viewModelName], resolve, reject);
      }).then(function(ViewModel){
        return {
          viewModelName: data.viewModelName,
          ViewModel: ViewModel,
          model: data.model,
          target: data.target
        }
      }, function(error){
        errorHandler.onError(new Error("Could not load the following modules:\n"+error.requireModules.join("\n")));
        return null;
      });
    },

    createViewModel: function(data, subscribe, params) {
      var model = (data.model && (data.model.charAt(0) == '{' || data.model.charAt(0) == '['))
        ? JSON.parse(data.model)
        : params;
      var whenContext = subscribe();
      var viewModel = new data.ViewModel(model, whenContext);
      viewModel['@SymbolDecoWhenContext'] = whenContext;
      return {
        viewModelName: data.viewModelName,
        viewModel: viewModel,
        target: data.target
      }
    }
  }
});
define('deco/spa/extendKnockout',[
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
define('deco/spa/applyViewModels',[
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

  function viewModelLoadedSuccessfully(data){
    return data != null && data.ViewModel != null;
  }

  return function (domElement, subscribe) {
    domElement = domElement || document.body;

    var viewModelsLoaded = utils.toArray(domElement.querySelectorAll("[data-viewmodel]"))
    .filter(function(element){
      return viewModelFactory.getParentViewModelElement(element, domElement) ? false : true;
    })
    .map(viewModelFactory.getViewModelFromAttributes)
    .map(viewModelFactory.loadViewModel);

    return Promise.all(viewModelsLoaded).then(function(list){
      list
        .filter(viewModelLoadedSuccessfully)
        .map(function(data){
          return viewModelFactory.createViewModel(data, subscribe);
        })
        .forEach(applyViewModel);
    })['catch'](errorHandler.onError);
  };
});
define('deco/spa/hashNavigation',[
  "deco/utils"
],function(
  _
){


  
  function findNewPath(currentPath, link, index){
    var isRelative = _.startsWith(link, '/') === false;
    var isFolder = _.endsWith(link, '/');
    
    if(link === "/"){
      var path = [];
    }else if(link === ""){
      var path = [index];
    }else{
      var path = _.trim(link, "/").split("/");
    }

    if(isFolder){
      path.push(index);
    }
    if(isRelative){
      path = _.popTail(currentPath).concat(path);
    }

    var out = [];
    var isPretty = true;
    var segmentsToSkip = 0;

    for(var i = path.length-1; i>=0; i--){
      if(path[i] === ""){
        isPretty = false;
      }else if(path[i] === "."){
        isPretty = false;
      }else if(path[i] === "..") {
        isPretty = false;
        segmentsToSkip++;
      }else if(segmentsToSkip > 0){
        segmentsToSkip--;
      }else{
        out.unshift(path[i]);
      }
    }

    return {isAbsoluteAndPretty: !isFolder && !isRelative && isPretty, path: out};
  }

  function hashChanged(config, onPageChanged, document){
    var link = _.after(document.location.href, '#');
    var isHashBang = _.startsWith(link, '!');
    var result = findNewPath(this.currentPath, link.substr(isHashBang ? 1 : 0), config.index);
    
    if(result.isAbsoluteAndPretty && isHashBang){
      this.currentPath = result.path;
      onPageChanged(result.path.join('/'), result.path.map(decodeURIComponent));
    }else{
      document.location.replace("#!/" + result.path.join('/'));
    }

  }
  
  function startHashNavigation(config, onPageChanged, doc, global){
    doc = doc || document;
    global = global || window;

    var state = {
      currentPath: []
    };
    var onHashChanged = hashChanged.bind(state, config, onPageChanged, doc);
    onHashChanged();
    _.addEventListener(global, "hashchange", onHashChanged, false);

    return {
      stop: function(){
        global.removeEventListener("hashchange", onHashChanged, false);
      }
    };
  }


  return {
    start: startHashNavigation
  };

});
define('deco/spa/PageLoader',[
  "deco/ajax"
], function(
  ajax
){

  function PageLoader(config){
    this.pathToUrl = config && config.pathToUrl || function(a){ return a; };
    this.cache = (config && 'cachePages' in config ? config.cachePages : true);
    this.currentXHR = null;
  }

  PageLoader.prototype.loadPage = function(path){

    this.abort();

    var url = this.pathToUrl(path);

    if(this.cache === false)
      url = ajax.cacheBust(url);
    
    var self = this;
    return new Promise(function(resolve, reject){
      self.currentXHR = ajax(url, {}, "GET", function(xhr){
        self.currentXHR = null;
        if(xhr.status === 200){
          resolve(xhr.responseText);
        }else{
          reject({error: xhr.status, content: xhr.responseText});
        }
      });
    });
  };

  PageLoader.prototype.abort = function(){
    if(this.currentXHR && this.currentXHR.readyState !== 4){
      this.currentXHR.abort();
    }
  };

  return PageLoader;
});
define('deco/spa/Templates',[
  "deco/spa/PageLoader",
  "deco/utils"
], function(
  PageLoader,
  utils
){

  function defaultConfig(){
    return {
      pathToUrl: function(a){ return a; }
    }
  }

  function findTemplatesInDocument(doc){

    var nodeList = doc.querySelectorAll("[type='text/page-template']");
    var nodes = utils.toArray(nodeList);
    var templateList = nodes.map(function(template){
      return {
        id: template.id.toLowerCase(),
        content: template.innerHTML
      };
    });

    return utils.arrayToObject(templateList, function(item, object){
      object[item.id] = item.content;
    });
  }


  function Templates(document, config){
    this.pageLoader = new PageLoader(config || defaultConfig());
    this.cachePages = (config && 'cachePages' in config ? config.cachePages : true)
    this.templates = findTemplatesInDocument(document);
  }

  Templates.prototype.getTemplate = function(path){

    this.pageLoader.abort();

    var normalizedPath = path.toLowerCase();

    if(normalizedPath in this.templates){
      return Promise.resolve(this.templates[normalizedPath]);
    }else{
      return this.pageLoader.loadPage(path)
      .then(function(content){
        if(this.cachePages)
          this.templates[normalizedPath] = content;
        
        return content;
      }.bind(this), function(notFound){
        var errorTemplate = "error" + notFound.error;
        if(errorTemplate in this.templates){
          return this.templates[errorTemplate];
        }else{
          return notFound.content;
        }
      }.bind(this));
    }
  };

  return Templates;
});
define('deco/proclaimWhen',[], function () {

  function publish(name, subscribers, data) {
    subscribers.forEach(function (item) {
      item.apply(item, data);
    });
  }

  function subscribeTo(name, subscribers, subscriber) {
    var index = subscribers.indexOf(subscriber);
    if(index < 0)
      subscribers.push(subscriber);
    return index < 0;
  }
  
  function unsubscribeFrom(name, subscribers, subscriber){
    var index = subscribers.indexOf(subscriber);
    if(index >= 0)
      subscribers.splice(index, 1);
    return index >= 0;
  }
  function extendEvent(name, event){
    event.subscribers = [];
    event.subscribeSubscribers = [];
    event.unsubscribeSubscribers = [];

    var extendedEvent = function(){
      if(arguments.length == 1 && typeof arguments[0] === "function"){
        if(subscribeTo(name, event.subscribers, arguments[0]))
          publish(name+".isSubscribedTo", event.subscribeSubscribers);
      }else{
        publish(name, event.subscribers, arguments);
      }
    }

    extendedEvent.dont = function(subscriber){
      if(unsubscribeFrom(name, event.subscribers, subscriber))
        publish(name+".isUnsubscribedFrom", event.unsubscribeSubscribers);
    };

    extendedEvent.isSubscribedTo = function(subscriber){
      subscribeTo(name+".isSubscribedTo", event.subscribeSubscribers, subscriber);
    };

    extendedEvent.isSubscribedTo.dont = function(subscriber){
      unsubscribeFrom(name+".isSubscribedTo", event.subscribeSubscribers, subscriber);
    };

    extendedEvent.isUnsubscribedFrom = function(subscriber){
      subscribeTo(name+".isUnsubscribedFrom", event.unsubscribeSubscribers, subscriber);
    };

    extendedEvent.isUnsubscribedFrom.dont = function(subscriber){
      unsubscribeFrom(name+".isUnsubscribedFrom", event.unsubscribeSubscribers, subscriber);
    };

    extendedEvent.toString = function(){
      return "[Event "+name+"]";
    }

    return extendedEvent;
  }
  
  function extend(events){
    for(var i in events){
      events[i] = extendEvent(i, events[i]);
    }
    return events;
  }

  function create(arg1, arg2){
    if(arg2)
      return extendEvent(arg1, arg2);
    else
      return extendEvent("anonymous event", arg1)
  }

  return {
    extend: extend,
    create: create
  };
  
});

define('deco/events',['deco/proclaimWhen'], function(proclaimWhen){
  return proclaimWhen.extend({
    thePageHasChanged: function(path, segments, url){ }
  });
});
define('deco/spa',[
  "deco/spa/Outlet",
  "deco/spa/whenContext",
  "deco/spa/applyViewModels",
  "deco/spa/hashNavigation",
  "deco/spa/Templates",
  "deco/utils",
  "deco/events",
  "deco/errorHandler"
], function(
  Outlet,
  whenContext,
  applyViewModels,
  hashNavigation,
  Templates,
  utils,
  proclaim,
  errorHandler
){

  var _config = {
      index: "index"
    },
    _document,
    _outlet,
    _originalTitle,
    _templates,
    _whenContext;

  function applyContent(content){
    _outlet.unloadCurrentPage();
    _outlet.setPageContent(content);
    _outlet.setDocumentTitle(_outlet.getPageTitle() || _originalTitle);
    _outlet.extractAndRunPageJavaScript();
    return applyViewModels(_outlet.element, _whenContext());
  }

  function pageChanged(path, segments){
    _outlet.indicatePageIsLoading();
    _whenContext.destroyChildContexts();
    return _templates.getTemplate(path)
      .then(applyContent)
      .then(function(){
        _outlet.pageHasLoaded();
        proclaim.thePageHasChanged(path, segments, document.location)
      })['catch'](errorHandler.onError);;
  }

  function start(config, document){
    _document = document || window.document;
    _config = utils.extend(_config, config);
    _outlet = new Outlet(_document.querySelector("[data-outlet]"), _document);
    _originalTitle = _document.title;
    _whenContext = whenContext();

    return applyViewModels(_document, whenContext()).then(function(){
      if(_outlet.outletExists()){
        _templates = new Templates(_document, _config);
        hashNavigation.start(_config, pageChanged, _document);
      }
    });
  }

  return {
    start: start
  };
});
define('deco/deco',[
  'deco/qvc',
  'deco/spa'
], function(
  qvc,
  spa
){

  

  function config(config){

    config = config || {};

    var spaConfig = config.spa || {};
    var qvcConfig = config.qvc || {};

    qvc.config(qvcConfig);

    return {
      start: spa.start.bind(null, spaConfig, document)
    }
  }
  
  return {
    config: config
  };

});
define('deco', ['deco/deco'], function (main) { return main; });

define('deco/qvc/constraints/NotEmpty',[], function(){
  function NotEmpty(attributes){
    
  }
  
  NotEmpty.prototype.isValid = function(value){
    if(value == null) return false;
    if(typeof value == "string" && value.length == 0) return false;
    return true;
  };
  
  return NotEmpty;
});
define('deco/qvc/constraints/Pattern',[], function(){
  function Pattern(attributes){    

    attributes.flags = attributes.flags || [];
    
    var flags = '';
    if(attributes.flags.indexOf("CASE_INSENSITIVE") >= 0) flags += 'i';
    
    this.regex = new RegExp(attributes.regexp, flags);
  }
  
  
  Pattern.prototype.isValid = function(value){
    
    if(value == null) return false;
    
    var result = this.regex.exec(value);
    
    if(result == null) return false;
    
    return result[0] == value;
  };
  
  
  return Pattern;
});

//# sourceMappingURL=deco.js.map