define([], function () {
	var funcNameRegex = /function\s+(.+)\s*\(([^)]*)\)/;
	var argumentSplitRegex = /\s*,\s*/;
	var subscribers = {};

	function getPublishedEventType(event){
		if ("name" in event.constructor) {
			if(event.constructor === Object || event.constructor === Function || event.constructor.name === ""){
				throw new Error("Cannot publish event " + event + " because it is not an object with a named constructor.\n");
			}else{
				return event.constructor.name;
			}
		} else {
			var regexResult = funcNameRegex.exec(event.constructor);
			if (regexResult && regexResult.length > 1) {
				return regexResult[1];
			} else {
				throw new Error("Cannot publish event " + event + " because it is not an object with a named constructor.\n");
			}
		}
	}
	
	function getSubscribableEventType(event){
		if(typeof event === "undefined"){
			throw new Error("cannot subscribe to undefined event");
		}else if(typeof event === "string") {
			return {
				name: event,
				arguments: []
			};
		}else{
			var regexResult = funcNameRegex.exec(event);
			if (regexResult && regexResult.length == 3) {
				return {
					name: regexResult[1],
					arguments: regexResult[2].split(argumentSplitRegex)
				};
			} else {
				throw new Error("Cannot subscribe to event " + event + " because it is not an object with a named constructor.\n");
			}
		}
	}

	function publish(event) {
		var eventType = getPublishedEventType(event);
		if (eventType in subscribers) {
			subscribers[eventType].forEach(function (item) {
				var eventProperties = item.arguments.map(function(argument){
					return event[argument];
				});
				item.callback.apply(item.self, eventProperties);
			});
		}
	}

	function subscribeTo(event, subscriber, that) {
		if(typeof subscriber === "undefined")
			throw new Error("Cannot subscribe to event " + event + " because subscriber is undefined");
		var eventType = getSubscribableEventType(event);

		if (eventType.name in subscribers === false) {
			subscribers[eventType.name] = [];
		}
		subscribers[eventType.name].push({callback:subscriber, self: that, arguments: eventType.arguments});
	}
	
	function unsubscribeTo(event, subscriber, that){
		var eventType = getSubscribableEventType(event).name;
		if(eventType in subscribers){
			subscribers[eventType] = subscribers[eventType].filter(function( item){
				return (item.callback !== subscriber || item.self !== that);
			});
		}
	}
	function extendEvent(event){
		event.subscribeTo = function(subscriber, self){
			subscribeTo(event, subscriber, self);
		};
		
		event.unsubscribeTo = function(subscriber, self){
			unsubscribeTo(event, subscriber, self);
		};
		
		event.prototype.publish = function(){
			publish(this);
		};

		return event;
	}
	
	function extend(events){
		if(events.length > 0){//TODO: isArray
			return events.reduce(function(object, event){
				var name = getSubscribableEventType(event).name;
				object[name] = extendEvent(event);
				return object;
			}, {});
		}else{
			for(var i in events){
				extendEvent(events[i]);
			}
			return events;
		}
	}

	return {
		publish: publish,
		subscribeTo: subscribeTo,
		unsubscribeTo: unsubscribeTo,
		extend: extend
	};
	
});
