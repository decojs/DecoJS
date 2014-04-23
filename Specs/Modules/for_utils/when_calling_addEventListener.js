describe("when calling addEventListener", [
  "deco/utils"
], function(
  utils
){

  describe("when the element has addEventListener", function(){

    var elm,
      callback;

    beforeEach(function(){
      elm = {
        addEventListener: sinon.spy()
      };
      callback = sinon.spy();

      utils.addEventListener(elm, "hashchange", callback, false);
    });

    it("should call the addEventListener on the element", function(){
      expect(elm.addEventListener.callCount).toBe(1);
    });

    it("should use the right event name", function(){
      expect(elm.addEventListener.firstCall.args[0]).toBe("hashchange");
    });

    it("should use the right listener function", function(){
      expect(elm.addEventListener.firstCall.args[1]).toBe(callback);
    });

    it("should use the right bubble", function(){
      expect(elm.addEventListener.firstCall.args[2]).toBe(false);
    });

  });

  describe("when the element has attachEvent", function(){

    var elm,
      callback;

    beforeEach(function(){
      elm = {
        attachEvent: sinon.spy()
      };
      callback = sinon.spy();

      utils.addEventListener(elm, "hashchange", callback, false);
    });

    it("should call the attachEvent on the element", function(){
      expect(elm.attachEvent.callCount).toBe(1);
    });

    it("should use the right event name", function(){
      expect(elm.attachEvent.firstCall.args[0]).toBe("onhashchange");
    });

    it("should use the right listener function", function(){
      expect(elm.attachEvent.firstCall.args[1]).toBe(callback);
    });

  });

});