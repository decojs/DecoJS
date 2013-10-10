define([
	
], function(
	
){

	function unsubscribe(event, reaction){
		event.dont(reaction);
	}

	function subscribe(event, reaction){
		event(reaction);
		return event.dont.bind(null, reaction);
	}


	function destroyContext(eventSubscribers, onDestroyListeners, childContexts){
		var subscriber, listener, context;
		while(subscriber = eventSubscribers.pop())
			subscriber();
		while(listener = onDestroyListeners.pop())
			listener();
		while(context = childContexts.pop())
			context.destroyContext();
	}

	function createContext(){

		var onDestroyListeners = [];
		var childContexts = [];
		var eventSubscribers = [];

		function when(){
			if(arguments.length == 0){
				var context = createContext();
				childContexts.push(context);
				return context.when;
			}else if(arguments.length == 1 && typeof arguments[0] === "function"){
				return {
					dont: unsubscribe.bind(null, arguments[0])
				}
			}else if(arguments.length == 2 && typeof arguments[1] === "function"){
				eventSubscribers.push(subscribe(arguments[0], arguments[1]));
			}
		};

		when.thisIsDestroyed = function(reaction){
			onDestroyListeners.push(reaction);
		};

		when.destroyChildContexts = function(){
			var context;
			while(context = childContexts.pop())
				context.destroyContext();
		};

		return {
			when: when,
			destroyContext: destroyContext.bind(this, eventSubscribers, onDestroyListeners, childContexts)
		};
	}

	return createContext().when;
});