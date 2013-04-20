define([], function () {
	var _events = {};

	function findEvent(name, event){
		if(name in _events == false)
			return null;
		var eventsWithTheSameName = _events[name];
		if(eventsWithTheSameName.length > 1){
		
			var found = eventsWithTheSameName.filter(function(e){
				return e.event === event;
			});

			if(found.length === 0){
				return null;
			}else{
				return found[0];
			}
			
		}else if(eventsWithTheSameName.length === 1){
			var found = eventsWithTheSameName[0];
			return (found.event === event) ? found : null;
		}else{
			return null;
		}
	}

	function addEvent(name, event){
		var eventsWithTheSameName = [];
		var eventObject = {
			event: event,
			subscribers: []
		};
		eventsWithTheSameName.push(eventObject);
		_events[name] = eventsWithTheSameName;
		return eventObject;
	}

	function publish(name, event, data) {
		var eventObject = findEvent(name, event);
		if(eventObject == null) return;

		eventObject.subscribers.forEach(function (item) {
			item.apply(item, data);
		});
	}

	function subscribeTo(name, event, subscriber) {
		var eventObject = findEvent(name, event);
		if(eventObject == null){
			eventObject = addEvent(name, event);
		}

		eventObject.subscribers.push(subscriber);
	}
	
	function unsubscribeTo(name, event, subscriber){
		var eventObject = findEvent(name, event);
		if(eventObject == null){
			eventObject = addEvent(name, event);
		}
		var index = eventObject.subscribers.indexOf(subscriber);
		eventObject.subscribers.splice(index, 1);
	}
	function extendEvent(name, event){
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

	return {
		extend: extend
	};
	
});
