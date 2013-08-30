
define('ordnung/utils',[], function(){
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

define('ordnung/qvc/ExecutableResult',["ordnung/utils"], function(utils){
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
define('ordnung/qvc/Constraint',[], function(){
	
	function Constraint(name, attributes){		
		this.name = name;
		this.attributes = attributes;
		this.message = attributes.message;
		
		
		this.init(name);
	}
		
	Constraint.prototype.init = function(name){
		require(["ordnung/qvc/constraints/" + name], function(Tester){
			var tester = new Tester(this.attributes);
			this.validate = tester.isValid.bind(tester);
		}.bind(this));
	};
	
	Constraint.prototype.validate = function(value){
		return true;//real test not loaded yet
	};
	
	
	return Constraint;
});
define('ordnung/qvc/Validator',["ordnung/qvc/Constraint", "knockout"], function(Constraint, ko){
	function Validator(){
		var self = this;
		
		this.constraints = [];
		
		this.isValid = ko.observable(true);
		this.message = ko.observable("");
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
				this.message(constraint.message);
				return false;
			}
		}.bind(this))){
			this.isValid(true);
			this.message("");
		}
	};
	
	return Validator;
});
define('ordnung/qvc/koExtensions',["ordnung/qvc/Validator", "knockout"], function(Validator, ko){

	if (ko != null) {
		ko.bindingHandlers.validationMessageFor = {
			init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
				var value = valueAccessor();
				var validator = value.validator;
				if (validator) {
					ko.applyBindingsToNode(element, { hidden: validator.isValid, text: validator.message }, validator);
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
define('ordnung/qvc/Validatable',["ordnung/utils", "ordnung/qvc/Validator", "knockout", "ordnung/qvc/koExtensions"],function(utils, Validator, ko){
	
	function recursivlyExtendParameters(parameters, validatableFields) {
		for (var key in parameters) {
			var property = parameters[key];
			if (ko.isObservable(property)) {
				property.extend({ validation: {} });
				validatableFields.push(property);
			}
			property = ko.utils.unwrapObservable(property);
			if (typeof property === "object") {
				recursivlyExtendParameters(property, validatableFields);
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
			recursivlyExtendParameters(self.validatableParameters, self.validatableFields);
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
define('ordnung/qvc/Executable',["ordnung/qvc/ExecutableResult", "ordnung/qvc/Validatable", "ordnung/utils", "knockout"], function(ExecutableResult, Validatable, utils, ko){

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
			if("violations" in self.result)
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
define('ordnung/ajax',[], function(){
	function dataToParams(data){
		var params = []
		for(var key in data){
			var value = data[key];
			params.push(key + "=" + encodeURIComponent(value));
		}
		return params.join("&");
	}

	function addParamToUrl(url, name, value){
		return url + (url.match(/\?/) ? (url.match(/&$/) ? "" : "&") : "?") + encodeURIComponent(name) + "=" + encodeURIComponent(value);
	}

	function addToPath(url, segment){
		return url + (url.match(/\/$/) ? "" : "/") + segment;
	}


	function ajax(url, object, method, callback){
		var xhr = new XMLHttpRequest();
		
		var isPost = (method === "POST");
		var data = null;
		
		if(object){

			if(isPost){
				data = dataToParams(object);
			} else {
				url += "?" + dataToParams(object);
			}
		}
		
		if(isPost){
			url = addParamToUrl(url, "cacheKey", Math.floor(Math.random()*10000));
		}

		xhr.open(isPost ? "POST" : "GET", url, true);
		
		if(isPost && data){
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhr.setRequestHeader("Content-length", data.length);
			xhr.setRequestHeader("Connection", "close");
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
	ajax.addToPath = addToPath;


	return ajax;
});
define('ordnung/qvc/ConstraintResolver',[], function(){


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
			constraint.state = "loaded";
		}
	}


	function ConstraintResolver(qvc){
		this.qvc = qvc;
		this.constraints = [];
	}
	
	ConstraintResolver.prototype.applyValidationConstraints = function(name, validatable){
		var constraint = findConstraint(name, this.constraints);
		if(constraint == false){
			this.constraints.push({
				name: name,
				state: "loading",
				validatables: [validatable]
			});
			this.qvc.loadConstraints(name, constraintsLoaded.bind(this));
		}else{
			if(constraint.state === "loading"){
				constraint.validatables.push(validatable);
			}else{
				validatable.applyConstraints(constraint.fields);
			}
		}
	};
	
	return ConstraintResolver;
});
define('ordnung/qvc',[
	"ordnung/qvc/Executable", 
	"ordnung/qvc/ExecutableResult", 
	"ordnung/utils", 
	"ordnung/ajax",
	"ordnung/qvc/ConstraintResolver",
	"knockout", 
	"ordnung/qvc/koExtensions"], 
	function(
		Executable,
		ExecutableResult,
		utils,
		ajax,
		ConstraintResolver,
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
						executable.onError();
					}
				} else {
					executable.result = new ExecutableResult({exception: {message: xhr.responseText, cause: xhr}});
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
					}catch(e){
						var response = {parameters: []};
					}
					callback(name, response.parameters);
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
define('ordnung/spa/Outlet',[
	"knockout"
], function(
	ko
){

	function Outlet(element, document){
		this.element = element;
		this.document = document || window.document;
	}

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
		var scripts = this.element.querySelectorAll("script");
		for(var i=0; i<scripts.length; i++){
			scripts[i].parentNode.removeChild(scripts[i]);
			if(scripts[i].id === '') throw new Error("The script must have an id");
			if(this.document.getElementById(scripts[i].id) == null){
				var script = this.document.createElement("script");
				script.id = scripts[i].id;
				script.text = scripts[i].textContent;
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
define('ordnung/spa/EventSubscriber',[
	
], function(
	
){
	

	function EventSubscriber(){
		var _currentPageEventSubscribers = [];

		this.unsubscribeAllEvents = function(){
			var stopSubscription;
			while(stopSubscription = _currentPageEventSubscribers.pop()){
				stopSubscription();
			}
		}

		this.subscribe = function(event, reaction){
			_currentPageEventSubscribers.push(function(){
				event.dont(reaction);
			});
			event(reaction);
		}

		this.subscribeForever = function(event, reaction){
			event(reaction);
		}
	}

	return EventSubscriber
});
/** @license MIT License (c) copyright 2011-2013 original author or authors */

/**
 * A lightweight CommonJS Promises/A and when() implementation
 * when is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @author Brian Cavalier
 * @author John Hann
 * @version 2.3.0
 */
(function(define, global) { 
define('when/when',[],function () {

	// Public API

	when.promise   = promise;    // Create a pending promise
	when.resolve   = resolve;    // Create a resolved promise
	when.reject    = reject;     // Create a rejected promise
	when.defer     = defer;      // Create a {promise, resolver} pair

	when.join      = join;       // Join 2 or more promises

	when.all       = all;        // Resolve a list of promises
	when.map       = map;        // Array.map() for promises
	when.reduce    = reduce;     // Array.reduce() for promises
	when.settle    = settle;     // Settle a list of promises

	when.any       = any;        // One-winner race
	when.some      = some;       // Multi-winner race

	when.isPromise = isPromise;  // Determine if a thing is a promise

	/**
	 * Register an observer for a promise or immediate value.
	 *
	 * @param {*} promiseOrValue
	 * @param {function?} [onFulfilled] callback to be called when promiseOrValue is
	 *   successfully fulfilled.  If promiseOrValue is an immediate value, callback
	 *   will be invoked immediately.
	 * @param {function?} [onRejected] callback to be called when promiseOrValue is
	 *   rejected.
	 * @param {function?} [onProgress] callback to be called when progress updates
	 *   are issued for promiseOrValue.
	 * @returns {Promise} a new {@link Promise} that will complete with the return
	 *   value of callback or errback or the completion value of promiseOrValue if
	 *   callback and/or errback is not supplied.
	 */
	function when(promiseOrValue, onFulfilled, onRejected, onProgress) {
		// Get a trusted promise for the input promiseOrValue, and then
		// register promise handlers
		return resolve(promiseOrValue).then(onFulfilled, onRejected, onProgress);
	}

	/**
	 * Trusted Promise constructor.  A Promise created from this constructor is
	 * a trusted when.js promise.  Any other duck-typed promise is considered
	 * untrusted.
	 * @constructor
	 * @param {function} sendMessage function to deliver messages to the promise's handler
	 * @param {function?} inspect function that reports the promise's state
	 * @name Promise
	 */
	function Promise(sendMessage, inspect) {
		this._message = sendMessage;
		this.inspect = inspect;
	}

	Promise.prototype = {
		/**
		 * Register a rejection handler.  Shortcut for .then(undefined, onRejected)
		 * @param {function?} onRejected
		 * @return {Promise}
		 */
		otherwise: function(onRejected) {
			return this.then(undef, onRejected);
		},

		/**
		 * Ensures that onFulfilledOrRejected will be called regardless of whether
		 * this promise is fulfilled or rejected.  onFulfilledOrRejected WILL NOT
		 * receive the promises' value or reason.  Any returned value will be disregarded.
		 * onFulfilledOrRejected may throw or return a rejected promise to signal
		 * an additional error.
		 * @param {function} onFulfilledOrRejected handler to be called regardless of
		 *  fulfillment or rejection
		 * @returns {Promise}
		 */
		ensure: function(onFulfilledOrRejected) {
			return this.then(injectHandler, injectHandler)['yield'](this);

			function injectHandler() {
				return resolve(onFulfilledOrRejected());
			}
		},

		/**
		 * Shortcut for .then(function() { return value; })
		 * @param  {*} value
		 * @return {Promise} a promise that:
		 *  - is fulfilled if value is not a promise, or
		 *  - if value is a promise, will fulfill with its value, or reject
		 *    with its reason.
		 */
		'yield': function(value) {
			return this.then(function() {
				return value;
			});
		},

		/**
		 * Runs a side effect when this promise fulfills, without changing the
		 * fulfillment value.
		 * @param {function} onFulfilledSideEffect
		 * @returns {Promise}
		 */
		tap: function(onFulfilledSideEffect) {
			return this.then(onFulfilledSideEffect)['yield'](this);
		},

		/**
		 * Assumes that this promise will fulfill with an array, and arranges
		 * for the onFulfilled to be called with the array as its argument list
		 * i.e. onFulfilled.apply(undefined, array).
		 * @param {function} onFulfilled function to receive spread arguments
		 * @return {Promise}
		 */
		spread: function(onFulfilled) {
			return this.then(function(array) {
				// array may contain promises, so resolve its contents.
				return all(array, function(array) {
					return onFulfilled.apply(undef, array);
				});
			});
		},

		/**
		 * Shortcut for .then(onFulfilledOrRejected, onFulfilledOrRejected)
		 * @deprecated
		 */
		always: function(onFulfilledOrRejected, onProgress) {
			return this.then(onFulfilledOrRejected, onFulfilledOrRejected, onProgress);
		}
	};

	/**
	 * Returns a resolved promise. The returned promise will be
	 *  - fulfilled with promiseOrValue if it is a value, or
	 *  - if promiseOrValue is a promise
	 *    - fulfilled with promiseOrValue's value after it is fulfilled
	 *    - rejected with promiseOrValue's reason after it is rejected
	 * @param  {*} value
	 * @return {Promise}
	 */
	function resolve(value) {
		return promise(function(resolve) {
			resolve(value);
		});
	}

	/**
	 * Returns a rejected promise for the supplied promiseOrValue.  The returned
	 * promise will be rejected with:
	 * - promiseOrValue, if it is a value, or
	 * - if promiseOrValue is a promise
	 *   - promiseOrValue's value after it is fulfilled
	 *   - promiseOrValue's reason after it is rejected
	 * @param {*} promiseOrValue the rejected value of the returned {@link Promise}
	 * @return {Promise} rejected {@link Promise}
	 */
	function reject(promiseOrValue) {
		return when(promiseOrValue, rejected);
	}

	/**
	 * Creates a {promise, resolver} pair, either or both of which
	 * may be given out safely to consumers.
	 * The resolver has resolve, reject, and progress.  The promise
	 * has then plus extended promise API.
	 *
	 * @return {{
	 * promise: Promise,
	 * resolve: function:Promise,
	 * reject: function:Promise,
	 * notify: function:Promise
	 * resolver: {
	 *	resolve: function:Promise,
	 *	reject: function:Promise,
	 *	notify: function:Promise
	 * }}}
	 */
	function defer() {
		var deferred, pending, resolved;

		// Optimize object shape
		deferred = {
			promise: undef, resolve: undef, reject: undef, notify: undef,
			resolver: { resolve: undef, reject: undef, notify: undef }
		};

		deferred.promise = pending = promise(makeDeferred);

		return deferred;

		function makeDeferred(resolvePending, rejectPending, notifyPending) {
			deferred.resolve = deferred.resolver.resolve = function(value) {
				if(resolved) {
					return resolve(value);
				}
				resolved = true;
				resolvePending(value);
				return pending;
			};

			deferred.reject  = deferred.resolver.reject  = function(reason) {
				if(resolved) {
					return resolve(rejected(reason));
				}
				resolved = true;
				rejectPending(reason);
				return pending;
			};

			deferred.notify  = deferred.resolver.notify  = function(update) {
				notifyPending(update);
				return update;
			};
		}
	}

	/**
	 * Creates a new promise whose fate is determined by resolver.
	 * @param {function} resolver function(resolve, reject, notify)
	 * @returns {Promise} promise whose fate is determine by resolver
	 */
	function promise(resolver) {
		return _promise(resolver, monitorApi.PromiseStatus && monitorApi.PromiseStatus());
	}

	/**
	 * Creates a new promise, linked to parent, whose fate is determined
	 * by resolver.
	 * @param {function} resolver function(resolve, reject, notify)
	 * @param {Promise?} status promise from which the new promise is begotten
	 * @returns {Promise} promise whose fate is determine by resolver
	 * @private
	 */
	function _promise(resolver, status) {
		var self, value, consumers = [];

		self = new Promise(_message, inspect);
		self.then = then;

		// Call the provider resolver to seal the promise's fate
		try {
			resolver(promiseResolve, promiseReject, promiseNotify);
		} catch(e) {
			promiseReject(e);
		}

		// Return the promise
		return self;

		function _message(type, args, resolve, notify) {
			consumers ? consumers.push(deliver) : enqueue(function() { deliver(value); });

			function deliver(p) {
				p._message(type, args, resolve, notify);
			}
		}

		/**
		 * Returns a snapshot of the promise's state at the instant inspect()
		 * is called. The returned object is not live and will not update as
		 * the promise's state changes.
		 * @returns {{ state:String, value?:*, reason?:* }} status snapshot
		 *  of the promise.
		 */
		function inspect() {
			return value ? value.inspect() : toPendingState();
		}

		/**
		 * Register handlers for this promise.
		 * @param [onFulfilled] {Function} fulfillment handler
		 * @param [onRejected] {Function} rejection handler
		 * @param [onProgress] {Function} progress handler
		 * @return {Promise} new Promise
		 */
		function then(onFulfilled, onRejected, onProgress) {
			/*jshint unused:false*/
			var args = arguments;
			return _promise(function(resolve, reject, notify) {
				_message('when', args, resolve, notify);
			}, status && status.observed());
		}

		/**
		 * Transition from pre-resolution state to post-resolution state, notifying
		 * all listeners of the ultimate fulfillment or rejection
		 * @param {*|Promise} val resolution value
		 */
		function promiseResolve(val) {
			if(!consumers) {
				return;
			}

			value = coerce(val);
			scheduleConsumers(consumers, value);
			consumers = undef;

			if(status) {
				updateStatus(value, status);
			}
		}

		/**
		 * Reject this promise with the supplied reason, which will be used verbatim.
		 * @param {*} reason reason for the rejection
		 */
		function promiseReject(reason) {
			promiseResolve(rejected(reason));
		}

		/**
		 * Issue a progress event, notifying all progress listeners
		 * @param {*} update progress event payload to pass to all listeners
		 */
		function promiseNotify(update) {
			if(consumers) {
				scheduleConsumers(consumers, progressed(update));
			}
		}
	}

	/**
	 * Creates a fulfilled, local promise as a proxy for a value
	 * NOTE: must never be exposed
	 * @param {*} value fulfillment value
	 * @returns {Promise}
	 */
	function fulfilled(value) {
		return near(
			new NearFulfilledProxy(value),
			function() { return toFulfilledState(value); }
		);
	}

	/**
	 * Creates a rejected, local promise with the supplied reason
	 * NOTE: must never be exposed
	 * @param {*} reason rejection reason
	 * @returns {Promise}
	 */
	function rejected(reason) {
		return near(
			new NearRejectedProxy(reason),
			function() { return toRejectedState(reason); }
		);
	}

	/**
	 * Creates a near promise using the provided proxy
	 * NOTE: must never be exposed
	 * @param {object} proxy proxy for the promise's ultimate value or reason
	 * @param {function} inspect function that returns a snapshot of the
	 *  returned near promise's state
	 * @returns {Promise}
	 */
	function near(proxy, inspect) {
		return new Promise(function(type, args, resolve) {
			try {
				resolve(proxy[type].apply(proxy, args));
			} catch(e) {
				resolve(rejected(e));
			}
		}, inspect);
	}

	/**
	 * Create a progress promise with the supplied update.
	 * @private
	 * @param {*} update
	 * @return {Promise} progress promise
	 */
	function progressed(update) {
		return new Promise(function (type, args, _, notify) {
			var onProgress = args[2];
			try {
				notify(typeof onProgress === 'function' ? onProgress(update) : update);
			} catch(e) {
				notify(e);
			}
		});
	}

	/**
	 * Coerces x to a trusted Promise
	 *
	 * @private
	 * @param {*} x thing to coerce
	 * @returns {*} Guaranteed to return a trusted Promise.  If x
	 *   is trusted, returns x, otherwise, returns a new, trusted, already-resolved
	 *   Promise whose resolution value is:
	 *   * the resolution value of x if it's a foreign promise, or
	 *   * x if it's a value
	 */
	function coerce(x) {
		if(x instanceof Promise) {
			return x;
		}

		if (!(x === Object(x) && 'then' in x)) {
			return fulfilled(x);
		}

		return promise(function(resolve, reject, notify) {
			enqueue(function() {
				try {
					// We must check and assimilate in the same tick, but not the
					// current tick, careful only to access promiseOrValue.then once.
					var untrustedThen = x.then;

					if(typeof untrustedThen === 'function') {
						fcall(untrustedThen, x, resolve, reject, notify);
					} else {
						// It's a value, create a fulfilled wrapper
						resolve(fulfilled(x));
					}

				} catch(e) {
					// Something went wrong, reject
					reject(e);
				}
			});
		});
	}

	/**
	 * Proxy for a near, fulfilled value
	 * @param {*} value
	 * @constructor
	 */
	function NearFulfilledProxy(value) {
		this.value = value;
	}

	NearFulfilledProxy.prototype.when = function(onResult) {
		return typeof onResult === 'function' ? onResult(this.value) : this.value;
	};

	/**
	 * Proxy for a near rejection
	 * @param {*} value
	 * @constructor
	 */
	function NearRejectedProxy(reason) {
		this.reason = reason;
	}

	NearRejectedProxy.prototype.when = function(_, onError) {
		if(typeof onError === 'function') {
			return onError(this.reason);
		} else {
			throw this.reason;
		}
	};

	/**
	 * Schedule a task that will process a list of handlers
	 * in the next queue drain run.
	 * @private
	 * @param {Array} handlers queue of handlers to execute
	 * @param {*} value passed as the only arg to each handler
	 */
	function scheduleConsumers(handlers, value) {
		enqueue(function() {
			var handler, i = 0;
			while (handler = handlers[i++]) {
				handler(value);
			}
		});
	}

	function updateStatus(value, status) {
		value._message('when', [
			function ()  { status.fulfilled(); },
			function (r) { status.rejected(r); }
		], identity, identity);
	}

	/**
	 * Determines if promiseOrValue is a promise or not
	 *
	 * @param {*} promiseOrValue anything
	 * @returns {boolean} true if promiseOrValue is a {@link Promise}
	 */
	function isPromise(promiseOrValue) {
		return promiseOrValue && typeof promiseOrValue.then === 'function';
	}

	/**
	 * Initiates a competitive race, returning a promise that will resolve when
	 * howMany of the supplied promisesOrValues have resolved, or will reject when
	 * it becomes impossible for howMany to resolve, for example, when
	 * (promisesOrValues.length - howMany) + 1 input promises reject.
	 *
	 * @param {Array} promisesOrValues array of anything, may contain a mix
	 *      of promises and values
	 * @param howMany {number} number of promisesOrValues to resolve
	 * @param {function?} [onFulfilled] DEPRECATED, use returnedPromise.then()
	 * @param {function?} [onRejected] DEPRECATED, use returnedPromise.then()
	 * @param {function?} [onProgress] DEPRECATED, use returnedPromise.then()
	 * @returns {Promise} promise that will resolve to an array of howMany values that
	 *  resolved first, or will reject with an array of
	 *  (promisesOrValues.length - howMany) + 1 rejection reasons.
	 */
	function some(promisesOrValues, howMany, onFulfilled, onRejected, onProgress) {

		return when(promisesOrValues, function(promisesOrValues) {

			return promise(resolveSome).then(onFulfilled, onRejected, onProgress);

			function resolveSome(resolve, reject, notify) {
				var toResolve, toReject, values, reasons, fulfillOne, rejectOne, len, i;

				len = promisesOrValues.length >>> 0;

				toResolve = Math.max(0, Math.min(howMany, len));
				values = [];

				toReject = (len - toResolve) + 1;
				reasons = [];

				// No items in the input, resolve immediately
				if (!toResolve) {
					resolve(values);

				} else {
					rejectOne = function(reason) {
						reasons.push(reason);
						if(!--toReject) {
							fulfillOne = rejectOne = identity;
							reject(reasons);
						}
					};

					fulfillOne = function(val) {
						// This orders the values based on promise resolution order
						values.push(val);
						if (!--toResolve) {
							fulfillOne = rejectOne = identity;
							resolve(values);
						}
					};

					for(i = 0; i < len; ++i) {
						if(i in promisesOrValues) {
							when(promisesOrValues[i], fulfiller, rejecter, notify);
						}
					}
				}

				function rejecter(reason) {
					rejectOne(reason);
				}

				function fulfiller(val) {
					fulfillOne(val);
				}
			}
		});
	}

	/**
	 * Initiates a competitive race, returning a promise that will resolve when
	 * any one of the supplied promisesOrValues has resolved or will reject when
	 * *all* promisesOrValues have rejected.
	 *
	 * @param {Array|Promise} promisesOrValues array of anything, may contain a mix
	 *      of {@link Promise}s and values
	 * @param {function?} [onFulfilled] DEPRECATED, use returnedPromise.then()
	 * @param {function?} [onRejected] DEPRECATED, use returnedPromise.then()
	 * @param {function?} [onProgress] DEPRECATED, use returnedPromise.then()
	 * @returns {Promise} promise that will resolve to the value that resolved first, or
	 * will reject with an array of all rejected inputs.
	 */
	function any(promisesOrValues, onFulfilled, onRejected, onProgress) {

		function unwrapSingleResult(val) {
			return onFulfilled ? onFulfilled(val[0]) : val[0];
		}

		return some(promisesOrValues, 1, unwrapSingleResult, onRejected, onProgress);
	}

	/**
	 * Return a promise that will resolve only once all the supplied promisesOrValues
	 * have resolved. The resolution value of the returned promise will be an array
	 * containing the resolution values of each of the promisesOrValues.
	 * @memberOf when
	 *
	 * @param {Array|Promise} promisesOrValues array of anything, may contain a mix
	 *      of {@link Promise}s and values
	 * @param {function?} [onFulfilled] DEPRECATED, use returnedPromise.then()
	 * @param {function?} [onRejected] DEPRECATED, use returnedPromise.then()
	 * @param {function?} [onProgress] DEPRECATED, use returnedPromise.then()
	 * @returns {Promise}
	 */
	function all(promisesOrValues, onFulfilled, onRejected, onProgress) {
		return _map(promisesOrValues, identity).then(onFulfilled, onRejected, onProgress);
	}

	/**
	 * Joins multiple promises into a single returned promise.
	 * @return {Promise} a promise that will fulfill when *all* the input promises
	 * have fulfilled, or will reject when *any one* of the input promises rejects.
	 */
	function join(/* ...promises */) {
		return _map(arguments, identity);
	}

	/**
	 * Settles all input promises such that they are guaranteed not to
	 * be pending once the returned promise fulfills. The returned promise
	 * will always fulfill, except in the case where `array` is a promise
	 * that rejects.
	 * @param {Array|Promise} array or promise for array of promises to settle
	 * @returns {Promise} promise that always fulfills with an array of
	 *  outcome snapshots for each input promise.
	 */
	function settle(array) {
		return _map(array, toFulfilledState, toRejectedState);
	}

	/**
	 * Promise-aware array map function, similar to `Array.prototype.map()`,
	 * but input array may contain promises or values.
	 * @param {Array|Promise} array array of anything, may contain promises and values
	 * @param {function} mapFunc map function which may return a promise or value
	 * @returns {Promise} promise that will fulfill with an array of mapped values
	 *  or reject if any input promise rejects.
	 */
	function map(array, mapFunc) {
		return _map(array, mapFunc);
	}

	/**
	 * Internal map that allows a fallback to handle rejections
	 * @param {Array|Promise} array array of anything, may contain promises and values
	 * @param {function} mapFunc map function which may return a promise or value
	 * @param {function?} fallback function to handle rejected promises
	 * @returns {Promise} promise that will fulfill with an array of mapped values
	 *  or reject if any input promise rejects.
	 */
	function _map(array, mapFunc, fallback) {
		return when(array, function(array) {

			return promise(resolveMap);

			function resolveMap(resolve, reject, notify) {
				var results, len, toResolve, i;

				// Since we know the resulting length, we can preallocate the results
				// array to avoid array expansions.
				toResolve = len = array.length >>> 0;
				results = [];

				if(!toResolve) {
					resolve(results);
					return;
				}

				// Since mapFunc may be async, get all invocations of it into flight
				for(i = 0; i < len; i++) {
					if(i in array) {
						resolveOne(array[i], i);
					} else {
						--toResolve;
					}
				}

				function resolveOne(item, i) {
					when(item, mapFunc, fallback).then(function(mapped) {
						results[i] = mapped;
						notify(mapped);

						if(!--toResolve) {
							resolve(results);
						}
					}, reject);
				}
			}
		});
	}

	/**
	 * Traditional reduce function, similar to `Array.prototype.reduce()`, but
	 * input may contain promises and/or values, and reduceFunc
	 * may return either a value or a promise, *and* initialValue may
	 * be a promise for the starting value.
	 *
	 * @param {Array|Promise} promise array or promise for an array of anything,
	 *      may contain a mix of promises and values.
	 * @param {function} reduceFunc reduce function reduce(currentValue, nextValue, index, total),
	 *      where total is the total number of items being reduced, and will be the same
	 *      in each call to reduceFunc.
	 * @returns {Promise} that will resolve to the final reduced value
	 */
	function reduce(promise, reduceFunc /*, initialValue */) {
		var args = fcall(slice, arguments, 1);

		return when(promise, function(array) {
			var total;

			total = array.length;

			// Wrap the supplied reduceFunc with one that handles promises and then
			// delegates to the supplied.
			args[0] = function (current, val, i) {
				return when(current, function (c) {
					return when(val, function (value) {
						return reduceFunc(c, value, i, total);
					});
				});
			};

			return reduceArray.apply(array, args);
		});
	}

	// Snapshot states

	/**
	 * Creates a fulfilled state snapshot
	 * @private
	 * @param {*} x any value
	 * @returns {{state:'fulfilled',value:*}}
	 */
	function toFulfilledState(x) {
		return { state: 'fulfilled', value: x };
	}

	/**
	 * Creates a rejected state snapshot
	 * @private
	 * @param {*} x any reason
	 * @returns {{state:'rejected',reason:*}}
	 */
	function toRejectedState(x) {
		return { state: 'rejected', reason: x };
	}

	/**
	 * Creates a pending state snapshot
	 * @private
	 * @returns {{state:'pending'}}
	 */
	function toPendingState() {
		return { state: 'pending' };
	}

	//
	// Internals, utilities, etc.
	//

	var reduceArray, slice, fcall, nextTick, handlerQueue,
		setTimeout, funcProto, call, arrayProto, monitorApi, undef;

	//
	// Shared handler queue processing
	//
	// Credit to Twisol (https://github.com/Twisol) for suggesting
	// this type of extensible queue + trampoline approach for
	// next-tick conflation.

	handlerQueue = [];

	/**
	 * Enqueue a task. If the queue is not currently scheduled to be
	 * drained, schedule it.
	 * @param {function} task
	 */
	function enqueue(task) {
		if(handlerQueue.push(task) === 1) {
			nextTick(drainQueue);
		}
	}

	/**
	 * Drain the handler queue entirely, being careful to allow the
	 * queue to be extended while it is being processed, and to continue
	 * processing until it is truly empty.
	 */
	function drainQueue() {
		var task, i = 0;

		while(task = handlerQueue[i++]) {
			task();
		}

		handlerQueue = [];
	}

	// capture setTimeout to avoid being caught by fake timers
	// used in time based tests
	setTimeout = global.setTimeout;

	// Allow attaching the monitor to when() if env has no console
	monitorApi = typeof console != 'undefined' ? console : when;

	// Prefer setImmediate or MessageChannel, cascade to node,
	// vertx and finally setTimeout
	/*global setImmediate,MessageChannel,process,vertx*/
	if (typeof setImmediate === 'function') {
		nextTick = setImmediate.bind(global);
	} else if(typeof MessageChannel !== 'undefined') {
		var channel = new MessageChannel();
		channel.port1.onmessage = drainQueue;
		nextTick = function() { channel.port2.postMessage(0); };
	} else if (typeof process === 'object' && process.nextTick) {
		nextTick = process.nextTick;
	} else if (typeof vertx === 'object') {
		nextTick = vertx.runOnLoop;
	} else {
		nextTick = function(t) { setTimeout(t, 0); };
	}

	//
	// Capture/polyfill function and array utils
	//

	// Safe function calls
	funcProto = Function.prototype;
	call = funcProto.call;
	fcall = funcProto.bind
		? call.bind(call)
		: function(f, context) {
			return f.apply(context, slice.call(arguments, 2));
		};

	// Safe array ops
	arrayProto = [];
	slice = arrayProto.slice;

	// ES5 reduce implementation if native not available
	// See: http://es5.github.com/#x15.4.4.21 as there are many
	// specifics and edge cases.  ES5 dictates that reduce.length === 1
	// This implementation deviates from ES5 spec in the following ways:
	// 1. It does not check if reduceFunc is a Callable
	reduceArray = arrayProto.reduce ||
		function(reduceFunc /*, initialValue */) {
			/*jshint maxcomplexity: 7*/
			var arr, args, reduced, len, i;

			i = 0;
			arr = Object(this);
			len = arr.length >>> 0;
			args = arguments;

			// If no initialValue, use first item of array (we know length !== 0 here)
			// and adjust i to start at second item
			if(args.length <= 1) {
				// Skip to the first real element in the array
				for(;;) {
					if(i in arr) {
						reduced = arr[i++];
						break;
					}

					// If we reached the end of the array without finding any real
					// elements, it's a TypeError
					if(++i >= len) {
						throw new TypeError();
					}
				}
			} else {
				// If initialValue provided, use it
				reduced = args[1];
			}

			// Do the actual reduce
			for(;i < len; ++i) {
				if(i in arr) {
					reduced = reduceFunc(reduced, arr[i], i, arr);
				}
			}

			return reduced;
		};

	function identity(x) {
		return x;
	}

	return when;
});
})(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(); }, this);

define('when', ['when/when'], function (main) { return main; });

/** @license MIT License (c) copyright 2013 original author or authors */

/**
 * callbacks.js
 *
 * Collection of helper functions for interacting with 'traditional',
 * callback-taking functions using a promise interface.
 *
 * @author Renato Zannon <renato.riccieri@gmail.com>
 * @contributor Brian Cavalier
 */

(function(define) {
define('when/callbacks',['require','./when'],function(require) {

	var when, promise, slice;

	when = require('./when');
	promise = when.promise;
	slice = [].slice;

	return {
		apply: apply,
		call: call,
		lift: lift,
		bind: lift, // DEPRECATED alias for lift
		promisify: promisify
	};

	/**
	 * Takes a `traditional` callback-taking function and returns a promise for its
	 * result, accepting an optional array of arguments (that might be values or
	 * promises). It assumes that the function takes its callback and errback as
	 * the last two arguments. The resolution of the promise depends on whether the
	 * function will call its callback or its errback.
	 *
	 * @example
	 *    var domIsLoaded = callbacks.apply($);
	 *    domIsLoaded.then(function() {
	 *		doMyDomStuff();
	 *	});
	 *
	 * @example
	 *    function existingAjaxyFunction(url, callback, errback) {
	 *		// Complex logic you'd rather not change
	 *	}
	 *
	 *    var promise = callbacks.apply(existingAjaxyFunction, ["/movies.json"]);
	 *
	 *    promise.then(function(movies) {
	 *		// Work with movies
	 *	}, function(reason) {
	 *		// Handle error
	 *	});
	 *
	 * @param {function} asyncFunction function to be called
	 * @param {Array} [extraAsyncArgs] array of arguments to asyncFunction
	 * @returns {Promise} promise for the callback value of asyncFunction
	 */
	function apply(asyncFunction, extraAsyncArgs) {
		return _apply(asyncFunction, this, extraAsyncArgs);
	}

	/**
	 * Apply helper that allows specifying thisArg
	 * @private
	 */
	function _apply(asyncFunction, thisArg, extraAsyncArgs) {
		return when.all(extraAsyncArgs || []).then(function(args) {
			return promise(function(resolve, reject) {
				var asyncArgs = args.concat(
					alwaysUnary(resolve),
					alwaysUnary(reject)
				);

				asyncFunction.apply(thisArg, asyncArgs);
			});
		});
	}

	/**
	 * Works as `callbacks.apply` does, with the difference that the arguments to
	 * the function are passed individually, instead of as an array.
	 *
	 * @example
	 *    function sumInFiveSeconds(a, b, callback) {
	 *		setTimeout(function() {
	 *			callback(a + b);
	 *		}, 5000);
	 *	}
	 *
	 *    var sumPromise = callbacks.call(sumInFiveSeconds, 5, 10);
	 *
	 *    // Logs '15' 5 seconds later
	 *    sumPromise.then(console.log);
	 *
	 * @param {function} asyncFunction function to be called
	 * @param {...*} args arguments that will be forwarded to the function
	 * @returns {Promise} promise for the callback value of asyncFunction
	 */
	function call(asyncFunction/*, arg1, arg2...*/) {
		return _apply(asyncFunction, this, slice.call(arguments, 1));
	}

	/**
	 * Takes a 'traditional' callback/errback-taking function and returns a function
	 * that returns a promise instead. The resolution/rejection of the promise
	 * depends on whether the original function will call its callback or its
	 * errback.
	 *
	 * If additional arguments are passed to the `bind` call, they will be prepended
	 * on the calls to the original function, much like `Function.prototype.bind`.
	 *
	 * The resulting function is also "promise-aware", in the sense that, if given
	 * promises as arguments, it will wait for their resolution before executing.
	 *
	 * @example
	 *    function traditionalAjax(method, url, callback, errback) {
	 *		var xhr = new XMLHttpRequest();
	 *		xhr.open(method, url);
	 *
	 *		xhr.onload = callback;
	 *		xhr.onerror = errback;
	 *
	 *		xhr.send();
	 *	}
	 *
	 *    var promiseAjax = callbacks.bind(traditionalAjax);
	 *    promiseAjax("GET", "/movies.json").then(console.log, console.error);
	 *
	 *    var promiseAjaxGet = callbacks.bind(traditionalAjax, "GET");
	 *    promiseAjaxGet("/movies.json").then(console.log, console.error);
	 *
	 * @param {Function} f traditional async function to be decorated
	 * @param {...*} [args] arguments to be prepended for the new function
	 * @returns {Function} a promise-returning function
	 */
	function lift(f/*, args...*/) {
		var args = slice.call(arguments, 1);
		return function() {
			return _apply(f, this, args.concat(slice.call(arguments)));
		};
	}

	/**
	 * `promisify` is a version of `bind` that allows fine-grained control over the
	 * arguments that passed to the underlying function. It is intended to handle
	 * functions that don't follow the common callback and errback positions.
	 *
	 * The control is done by passing an object whose 'callback' and/or 'errback'
	 * keys, whose values are the corresponding 0-based indexes of the arguments on
	 * the function. Negative values are interpreted as being relative to the end
	 * of the arguments array.
	 *
	 * If arguments are given on the call to the 'promisified' function, they are
	 * intermingled with the callback and errback. If a promise is given among them,
	 * the execution of the function will only occur after its resolution.
	 *
	 * @example
	 *    var delay = callbacks.promisify(setTimeout, {
	 *		callback: 0
	 *	});
	 *
	 *    delay(100).then(function() {
	 *		console.log("This happens 100ms afterwards");
	 *	});
	 *
	 * @example
	 *    function callbackAsLast(errback, followsStandards, callback) {
	 *		if(followsStandards) {
	 *			callback("well done!");
	 *		} else {
	 *			errback("some programmers just want to watch the world burn");
	 *		}
	 *	}
	 *
	 *    var promisified = callbacks.promisify(callbackAsLast, {
	 *		callback: -1,
	 *		errback:   0,
	 *	});
	 *
	 *    promisified(true).then(console.log, console.error);
	 *    promisified(false).then(console.log, console.error);
	 *
	 * @param {Function} asyncFunction traditional function to be decorated
	 * @param {object} positions
	 * @param {number} [positions.callback] index at which asyncFunction expects to
	 *  receive a success callback
	 * @param {number} [positions.errback] index at which asyncFunction expects to
	 *  receive an error callback
	 *  @returns {function} promisified function that accepts
	 */
	function promisify(asyncFunction, positions) {

		return function() {
			var thisArg = this;
			return when.all(arguments).then(function(args) {
				return promise(applyPromisified);

				function applyPromisified(resolve, reject) {
					var callbackPos, errbackPos;

					if('callback' in positions) {
						callbackPos = normalizePosition(args, positions.callback);
					}

					if('errback' in positions) {
						errbackPos = normalizePosition(args, positions.errback);
					}

					if(errbackPos < callbackPos) {
						insertCallback(args, errbackPos, reject);
						insertCallback(args, callbackPos, resolve);
					} else {
						insertCallback(args, callbackPos, resolve);
						insertCallback(args, errbackPos, reject);
					}

					asyncFunction.apply(thisArg, args);
				}

			});
		};
	}

	function normalizePosition(args, pos) {
		return pos < 0 ? (args.length + pos + 2) : pos;
	}

	function insertCallback(args, pos, callback) {
		if(pos != null) {
			callback = alwaysUnary(callback);
			if(pos < 0) {
				pos = args.length + pos + 2;
			}
			args.splice(pos, 0, callback);
		}

	}

	function alwaysUnary(fn) {
		return function() {
			if(arguments.length <= 1) {
				fn.apply(this, arguments);
			} else {
				fn.call(this, slice.call(arguments));
			}
		};
	}
});
})(
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
	// Boilerplate for AMD and Node
);

define('ordnung/spa/applyViewModels',["ordnung/utils", "knockout", "when", "when/callbacks"], function (utils, ko, when, callbacks) {


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
		});
	}

	function applyViewModel(subscribe, data) {
		var viewModel = new data.ViewModel(data.model, subscribe);
		ko.applyBindings(viewModel, data.target);
	};

	return function (domElement, subscribe) {

		domElement = domElement || document.body;

		var elementList = utils.toArray(domElement.querySelectorAll("*[data-viewmodel]"));

		var viewModelsLoaded = elementList.map(getAttributes).map(loadViewModel);

		return when.all(viewModelsLoaded).then(function(list){
			list.forEach(applyViewModel.bind(null, subscribe))
		});
	};
});
define('ordnung/spa/hashNavigation',[
	"ordnung/utils"
],function(
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

		var path = _.trim(document.location.hash, '#');

		var isRelative = _.startsWith(path, '/') == false;
		var isFolder = _.endsWith(path, '/');

		if(isRelative || isFolder){
			var newHash = newPath(this.currentPath, path, config.index).join('/');
			document.location.replace("#/" + newHash);
		}else{
			this.currentPath = newPath(this.currentPath, path, config.index);
			onPageChanged(this.currentPath.join('/'));
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
define('ordnung/spa/PageLoader',[
	"ordnung/ajax"
], function(
	ajax
){

	function PageLoader(pathToUrl){
		this.pathToUrl = pathToUrl;
		this.currentXHR = null;
	}

	PageLoader.prototype.loadPage = function(path, resolver){

		this.abort();

		this.currentXHR = ajax(this.pathToUrl(path), {}, "GET", function(xhr){
			if(xhr.status === 200)
				resolver.resolve(xhr.responseText);
			else
				resolver.reject(xhr.responseText);
		});
	};

	PageLoader.prototype.abort = function(){
		if(this.currentXHR && this.currentXHR.readyState !== 4){
			this.currentXHR.abort();
		}
	};

	return PageLoader;
});
define('ordnung/spa/Templates',[
	"ordnung/spa/PageLoader",
	"ordnung/utils",
	"when"
], function(
	PageLoader,
	utils,
	when
){

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
		this.pageLoader = new PageLoader(config && config.pathToUrl || function(a){ return a; });

		this.templates = findTemplatesInDocument(document);
	}

	Templates.prototype.getTemplate = function(path){

		var deferred = when.defer();

		this.pageLoader.abort();

		var normalizedPath = path.toLowerCase();

		if(normalizedPath in this.templates){
			deferred.resolve(this.templates[normalizedPath]);
		}else{
			this.pageLoader.loadPage(path, deferred.resolver);
		}


		return deferred.promise;
	};

	return Templates;
});
define('ordnung/spa',[
	"ordnung/spa/Outlet",
	"ordnung/spa/EventSubscriber",
	"ordnung/spa/applyViewModels",
	"ordnung/spa/hashNavigation",
	"ordnung/spa/Templates",
	"ordnung/utils"
], function(
	Outlet,
	EventSubscriber,
	applyViewModels,
	hashNavigation,
	Templates,
	utils
){

	var _config = {
			index: "index"
		},
		_document,
		_outlet,
		_originalTitle,
		_templates,
		_currentPageEventSubscriber;

	function applyContent(content){
		_outlet.unloadCurrentPage();
		_outlet.setPageContent(content);
		_outlet.setDocumentTitle(_outlet.getPageTitle() || _originalTitle);
		_outlet.extractAndRunPageJavaScript();
		return applyViewModels(_outlet.element, _currentPageEventSubscriber.subscribe);
	}

	function pageChanged(path){
		_outlet.indicatePageIsLoading();
		_currentPageEventSubscriber.unsubscribeAllEvents();
		return _templates.getTemplate(path)
			.then(applyContent)
			.then(function(){
				_outlet.pageHasLoaded();
			});
	}

	function start(config, document){
		_document = document || window.document;
		_config = utils.extend(_config, config);
		_outlet = new Outlet(_document.querySelector("[data-outlet]"), _document);
		_originalTitle = document.title;
		_templates = new Templates(_document, _config);
		_currentPageEventSubscriber = new EventSubscriber();

		return applyViewModels(_document, _currentPageEventSubscriber.subscribeForever).then(function(){
			hashNavigation.start(_config, pageChanged, _document);
		});
	}

	return {
		start: start
	};
});
define('ordnung/proclaimWhen',[], function () {

	function publish(name, event, data) {
		event.subscribers.forEach(function (item) {
			item.apply(item, data);
		});
	}

	function subscribeTo(name, event, subscriber) {
		event.subscribers.push(subscriber);
	}
	
	function unsubscribeTo(name, event, subscriber){
		var index = event.subscribers.indexOf(subscriber);
		event.subscribers.splice(index, 1);
	}
	function extendEvent(name, event){
		event.subscribers = [];

		var extendedEvent = function(){
			if(arguments.length == 1 && typeof arguments[0] === "function"){
				subscribeTo(name, event, arguments[0]);
			}else{
				publish(name, event, arguments);
			}
		}

		extendedEvent.dont = function(subscriber){
			unsubscribeTo(name, event, subscriber);
		};

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

define('ordnung/qvc/constraints/NotEmpty',[], function(){
	function NotEmpty(attributes){
		
	}
	
	NotEmpty.prototype.isValid = function(value){
		if(value == null) return false;
		if(typeof value == "string" && value.length == 0) return false;
		return true;
	};
	
	return NotEmpty;
});
define('ordnung/qvc/constraints/Pattern',[], function(){
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
//# sourceMappingURL=ordnung.js.map