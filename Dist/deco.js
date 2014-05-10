define("deco/qvc/constraints/Pattern", [], function(){
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

define("deco/qvc/constraints/NotEmpty", [], function(){
  function NotEmpty(attributes){
    
  }
  
  NotEmpty.prototype.isValid = function(value){
    if(value == null) return false;
    if(typeof value == "string" && value.length == 0) return false;
    return true;
  };
  
  return NotEmpty;
});

define("deco/proclaimWhen", [], function () {

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

define("deco/events", ['deco/proclaimWhen'], function(proclaimWhen){
  return proclaimWhen.extend({
    thePageHasChanged: function(path, segments, url){ }
  });
});

define("deco/ajax", [], function(){
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

define("deco/spa/PageLoader", [
  "deco/ajax"
], function(
  ajax
){

  function PageLoader(config){
    this.pathToUrl = config && config.pathToUrl || function(a){ return a; };
    this.cache = (config && 'cachePages' in config ? config.cachePages : true);
    this.currentXHR = null;
  }

  PageLoader.prototype.loadPage = function(path, resolver){

    this.abort();

    var url = this.pathToUrl(path);

    if(this.cache === false)
      url = ajax.cacheBust(url);

    this.currentXHR = ajax(url, {}, "GET", function(xhr){
      if(xhr.status === 200)
        resolver.resolve(xhr.responseText);
      else
        resolver.reject({error: xhr.status, content: xhr.responseText});
    });
  };

  PageLoader.prototype.abort = function(){
    if(this.currentXHR && this.currentXHR.readyState !== 4){
      this.currentXHR.abort();
    }
  };

  return PageLoader;
});

define("deco/utils", [], function(){
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
    arrayToObject: function(array, func){
      return array.reduce(function(collection, item){
        func(item, collection);
        return collection;
      }, {});
    },
    trim: function(word, character){
      while(word.charAt(0) == character) word = word.substr(1);
      while(word.charAt(word.length - 1) == character) word = word.substr(0, word.length - 1);
      return word;
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

define("deco/spa/Templates", [
  "deco/spa/PageLoader",
  "deco/utils",
  "when"
], function(
  PageLoader,
  utils,
  when
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
      return when.resolve(this.templates[normalizedPath]);
    }else{
      var deferred = when.defer();

      this.pageLoader.loadPage(path, deferred.resolver);
      
      return deferred.promise.then(function(content){
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

define("deco/spa/hashNavigation", [
  "deco/utils"
], function(
  _
){


  
  function newPath(currentPath, link, index){
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

    for(var i = path.length>>>0; i--;){
      if(path[i] === ""){
        continue;
      }else if(path[i] === "."){
        continue;
      }else if(path[i] === "..") {
        i--;
      }else{
        out.unshift(path[i]);
      }
    }

    return out;
  }

  function hashChanged(config, onPageChanged, document){

    var path = _.after(document.location.href, '#');

    var isRelative = _.startsWith(path, '/') == false;
    var isFolder = _.endsWith(path, '/');

    if(isRelative || isFolder){
      var newHash = newPath(this.currentPath, path, config.index).join('/');
      document.location.replace("#/" + newHash);
    }else{
      this.currentPath = newPath(this.currentPath, path, config.index);
      onPageChanged(this.currentPath.join('/'), this.currentPath.map(function(p){return decodeURIComponent(p);}));
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

define("deco/errorHandler", [], function(){
  return {
    onError: function(error){
      setTimeout(function(){
        throw error;
      },1);
    }
  };
});

define("deco/spa/applyViewModels", [
  "deco/utils",
  "deco/errorHandler",
  "knockout", 
  "when", 
  "when/callbacks"
], function (
  utils, 
  errorHandler,
  ko, 
  when, 
  callbacks
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

    return callbacks.call(require, [
      data.viewModelName
    ]).then(function(ViewModel){
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

    var elementList = utils.toArray(domElement.querySelectorAll("*[data-viewmodel]"));

    var viewModelsLoaded = elementList.map(getAttributes).map(loadViewModel);

    return when.all(viewModelsLoaded).then(function(list){
      list.filter(viewModelLoadedSuccessfully).forEach(applyViewModel.bind(null, subscribe))
    });
  };
});

define("deco/spa/whenContext", [
  
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

define("deco/spa/Outlet", [
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

define("deco/spa", [
  "deco/spa/Outlet",
  "deco/spa/whenContext",
  "deco/spa/applyViewModels",
  "deco/spa/hashNavigation",
  "deco/spa/Templates",
  "deco/utils",
  "deco/events"
], function(
  Outlet,
  whenContext,
  applyViewModels,
  hashNavigation,
  Templates,
  utils,
  proclaim
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
      });
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

define("deco/qvc/ConstraintResolver", [], function(){

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

define("deco/qvc/Constraint", [], function(){
  
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

define("deco/qvc/Validator", [
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

define("deco/qvc/koExtensions", ["deco/qvc/Validator", "knockout"], function(Validator, ko){

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
    
    ko.extenders.validation = function (target, options) {
      target.validator = new Validator(target, options);
      target.subscribe(function (newValue) {
        target.validator.validate(newValue);
      });
      return target;
    };
    
    ko.bindingHandlers.command = ko.bindingHandlers.query = {
      init: function (element, valueAccessor, allBindingAccessor, viewModel) {
        ko.applyBindingsToNode(element, { click: valueAccessor() }, viewModel);
      }
    };
  }
  

});

define("deco/qvc/Validatable", ["deco/utils", "deco/qvc/Validator", "knockout", "deco/qvc/koExtensions"], function(utils, Validator, ko){
  
  function recursivlyExtendParameters(parameters, validatableFields, parents) {
    for (var key in parameters) {
      var property = parameters[key];
      var path = parents.concat([key]);
      if (ko.isObservable(property)) {
        property.extend({
          validation: {
            name:key,
            path:path.join(".")
          }
        });
        validatableFields.push(property);
      }
      property = ko.utils.unwrapObservable(property);
      if (typeof property === "object") {
        recursivlyExtendParameters(property, validatableFields, path);
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



  function Validatable(name, parameters, constraintResolver){
    var self = this;
    
    this.validator = new Validator();
    this.validatableFields = [];
    this.validatableParameters = parameters;
    
    
    init: {
      recursivlyExtendParameters(self.validatableParameters, self.validatableFields, []);
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
      if (fieldName.length > 0) {
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
  
  
  
  return Validatable;
});

define("deco/qvc/ExecutableResult", ["deco/utils"], function(utils){
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

define("deco/qvc/Executable", ["deco/qvc/ExecutableResult", "deco/qvc/Validatable", "deco/utils", "knockout"], function(ExecutableResult, Validatable, utils, ko){

  function Executable(name, type, parameters, callbacks, qvc){
    var self = this;
    
    this.name;
    this.type;
    this.isBusy = ko.observable(false);
    this.hasError = ko.observable(false);
    this.result = new ExecutableResult();
    
    this.parameters = {};
    this.callbacks = {
      beforeExecute: function () {},
      canExecute: function(){return true;},
      error: function () {},
      success: function () {},
      result: function(){},
      complete: function () {}
    };
    
    
    this.execute = function () {
      if (self.onBeforeExecute() === false) {
        return;
      }
      qvc.execute(self);
    };

    this.onBeforeExecute = function () {
      
      if (self.isBusy()) {
        return false;
      }
      
      self.hasError(false);
      
      self.callbacks.beforeExecute();
      
      self.validate();
      if (!self.isValid()) {
        return false;
      }
      
      if (self.callbacks.canExecute() === false) {
        return false;
      }
      self.isBusy(true);
      
      return true;
    };
    
    
    this.onError = function () {
      self.hasError(true);
      if("violations" in self.result && self.result.violations != null)
        self.applyViolations(self.result.violations);
      self.callbacks.error(self.result);
    };

    this.onSuccess = function () {
      self.hasError(false);
      self.clearValidationMessages();
      self.callbacks.success(self.result);
      self.callbacks.result(self.result.result);
    };

    this.onComplete = function () {
      if (!self.hasError()) {
        self.callbacks.complete(self.result);
        self.clearValidationMessages();
      }
      self.isBusy(false);
    };
    
    
    init: {
      self.name = name;
      self.type = type;
      utils.extend(self.parameters, parameters);
      utils.extend(self.callbacks, callbacks);
      utils.extend(self, new Validatable(self.name, self.parameters, qvc.constraintResolver));
    }
  }
  
  Executable.Command = "command";
  Executable.Query = "query";
  
  return Executable;
});

define("deco/qvc", [
  "deco/qvc/Executable", 
  "deco/qvc/ExecutableResult", 
  "deco/utils", 
  "deco/ajax",
  "deco/qvc/ConstraintResolver",
  "deco/errorHandler",
  "knockout", 
  "deco/qvc/koExtensions"], function(
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
  if(name == null || name.length == 0)
    throw new Error(type + " is missing name\nA " + type + " must have a name!\nusage: createCommand('name', [parameters, callbacks])");

  var executable = new Executable(name, type, parameters || {}, callbacks || {}, qvc);
  var execute = executable.execute.bind(executable);
  execute.isValid = ko.computed(function(){return executable.isValid(); });
  execute.isBusy = ko.computed(function(){return executable.isBusy();});
  execute.hasError = ko.computed(function(){return executable.hasError();});
  execute.success = function(callback){
    executable.callbacks.success = callback;
    return execute;
  };
  execute.error = function(callback){
    executable.callbacks.error = callback;
    return execute;
  };
  execute.beforeExecute = function(callback){
    executable.callbacks.beforeExecute = callback;
    return execute;
  };
  execute.canExecute = function(callback){
    executable.callbacks.canExecute = callback;
    return execute;
  };
  execute.result = function(){
    if(arguments.length == 1){
      executable.callbacks.result = arguments[0];
      return execute;
    }
    return executable.result.result;
  };
  execute.complete = function(callback){
    executable.callbacks.complete = callback;
    return execute;
  };
  execute.clearValidationMessages = executable.clearValidationMessages.bind(executable);
  execute.validator = executable.validator;
  
  return execute;
}

return {
  createCommand: function(name, parameters, callbacks){
    return createExecutable(name, Executable.Command, parameters, callbacks);
  },
  createQuery: function(name, parameters, callbacks){
    return createExecutable(name, Executable.Query, parameters, callbacks);
  },
  config: function(config){
    utils.extend(qvc.config, config);
  }
}
});

define("deco/deco", [
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

//# sourceMappingURL=deco.js.map