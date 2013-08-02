define([], function () {

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

	return {
		extend: extend
	};
	
});
