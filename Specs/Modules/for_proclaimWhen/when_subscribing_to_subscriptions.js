describe("when subscribing to subscriptions", ["deco/proclaimWhen"], function(proclaimWhen){
  
  var when,
    spy1,
    spy2,
    firstSubscriber,
    secondSubscriber;
  
  beforeEach(function(){

    firstSubscriber = sinon.spy();
    secondSubscriber = sinon.spy();

    spy1 = sinon.spy();
    spy2 = sinon.spy();

    when = proclaimWhen.extend({
      event1: function(arg){}
    });
    
  });
  
  it("should be notified when someone subscribes", function(){
    when.event1.isSubscribedTo(spy1);
    when.event1(firstSubscriber);
    expect(spy1).toHaveBeenCalledOnce();
    expect(spy1.firstCall.args[0]).toBeA(Function);
  });
  
  describe("and calling the triggerIt method", function(){
    
    beforeEach(function(){
      when.event1.isSubscribedTo(function(triggerIt){
        triggerIt("hello");
      });
      
      when.event1(firstSubscriber);
    });
    
    it("should notify the subscriber", function(){
      expect(firstSubscriber).toHaveBeenCalledOnce();
    });
    
    it("should pass the argument to the subscriber", function(){
      expect(firstSubscriber).toHaveBeenCalledWith("hello");
    });
    
    describe("after the second subscriber has subscribed", function(){

      because(function(){
        firstSubscriber.reset();
        when.event1(secondSubscriber);
      });

      it("should not notify the first subscriber again", function(){
        expect(firstSubscriber).not.toHaveBeenCalled();
      });

      it("should notify the second subscriber", function(){
        expect(secondSubscriber).toHaveBeenCalledOnce();
        expect(secondSubscriber).toHaveBeenCalledWith("hello");
      });
    });
  });
  
  it("should not be notified when someone subscribes a second time", function(){
    when.event1.isSubscribedTo(spy1);
    when.event1(firstSubscriber);
    when.event1(firstSubscriber);
    expect(spy1).toHaveBeenCalledOnce();
  });
  
  it("should not be notified if unsubscribing from subscriptions", function(){
    when.event1.isSubscribedTo(spy1);
    when.event1.isSubscribedTo.dont(spy1);
    when.event1(firstSubscriber);
    expect(spy1).not.toHaveBeenCalled();
  });

  describe("and unsubscriptions", function(){
    because(function(){
      when.event1(firstSubscriber);
      when.event1.isUnsubscribedFrom(spy2);
      when.event1.dont(firstSubscriber);
    });
  
    it("should be notified when someone unsubscribes", function(){
      expect(spy2).toHaveBeenCalledOnce();
    });
  });

  
  it("should not be notified if unsubscribing from unsubscriptions", function(){
    when.event1(firstSubscriber);
    when.event1.isUnsubscribedFrom(spy1);
    when.event1.isUnsubscribedFrom.dont(spy1);
    when.event1.dont(firstSubscriber);
    expect(spy1).not.toHaveBeenCalled();
  });

  describe("and an unsubscribed event unsubscribes", function(){
    because(function(){

      //firstSubscriber is not subscribed to event1
      when.event1.isUnsubscribedFrom(spy2);
      when.event1.dont(firstSubscriber);
    });
  
    it("should not be notified", function(){
      expect(spy2).not.toHaveBeenCalled();
    });
  });
  
});