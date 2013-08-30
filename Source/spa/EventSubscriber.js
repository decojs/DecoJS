define([
	
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