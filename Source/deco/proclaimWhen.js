define([], function () {

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
