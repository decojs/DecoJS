describe("when subscribing to a event", ["deco/proclaimWhen"], function(proclaimWhen){

  
  var when,
    proclaim,
    spyOnIt;
  
  beforeEach(function(){
    spyOnIt = sinon.stub();
    when = proclaim = proclaimWhen.extend({
      somethingHappens: function (){}
    });
    when.somethingHappens(spyOnIt);
  });
  
  afterEach(function(){
    when.somethingHappens.dont(spyOnIt);
  });
  
  it("should call the function when a event is published", function(){
    proclaim.somethingHappens();
    expect(spyOnIt.calledOnce).toBe(true);
  });

  describe("multiple times", function(){

    because(function(){
      when.somethingHappens(spyOnIt);
    });

    it("should call the function only once", function(){
      proclaim.somethingHappens();
      expect(spyOnIt.callCount).toBe(1);
    });
  });

});