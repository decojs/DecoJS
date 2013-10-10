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


	function destroyContext(){
		var subscriber, listener, context;
		while(subscriber = this.eventSubscribers.pop())
			subscriber();
		while(listener = this.onDestroyListeners.pop())
			listener();
		while(context = this.childContexts.pop())
			context.destroyContext();
	}

	function whenSomething(){
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

	function createContext(){
		var context = {
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