define([], function () {
	var events = [];

	function findEvent(event){
		var found = events.filter(function(e){
			return e.event === event;
		});

		if(found.length === 0){
			return null;
		}else{
			return found[0];
		}
	}

	function addEvent(event){
		var eventObject = {
			event: event,
			subscribers: []
		};
		events.push(eventObject);
		return eventObject;
	}

	function publish(event, data) {
		var eventObject = findEvent(event);
		if(eventObject == null) return;

		eventObject.subscribers.forEach(function (item) {
			item.apply(item, data);
		});
	}

	function subscribeTo(event, subscriber) {
		var eventObject = findEvent(event);
		if(eventObject == null){
			eventObject = addEvent(event);
		}

		eventObject.subscribers.push(subscriber);
	}
	
	function unsubscribeTo(event, subscriber){
		var eventObject = findEvent(event);
		if(eventObject == null){
			eventObject = addEvent(event);
		}
		var index = eventObject.subscribers.indexOf(subscriber);
		eventObject.subscribers.splice(index, 1);
	}
	function extendEvent(event){
		var extendedEvent = function(){
			if(arguments.length == 1 && typeof arguments[0] === "function"){
				subscribeTo(event, arguments[0]);
			}else{
				publish(event, arguments);
			}
		}

		extendedEvent.dont = function(subscriber){
			unsubscribeTo(event, subscriber);
		};

		return extendedEvent;
	}
	
	function extend(events){
		for(var i in events){
			events[i] = extendEvent(events[i]);
		}
		return events;
	}

	return {
		extend: extend
	};
	
});
