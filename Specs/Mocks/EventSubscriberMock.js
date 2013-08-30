define([], function(){
	

	function EventSubscriberMock(){
		this.subscribe = sinon.spy();
		this.subscribeForever = sinon.spy();
		this.unsubscribeAllEvents = sinon.spy();

		EventSubscriberMock.instance = this;
	}

	EventSubscriberMock.instance;


	return EventSubscriberMock;


});