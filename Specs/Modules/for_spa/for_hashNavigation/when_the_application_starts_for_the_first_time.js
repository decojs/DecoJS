describe("when the application starts for the first time", [
  "deco/spa/hashNavigation"
], function(
  hashNavigation
){

  var result,
    onPageChangedSpy,
    replaceSpy,
    doc,
    onHashChange;

  beforeEach(function(){

    onPageChangedSpy = sinon.spy();
    replaceSpy = sinon.spy();

    config = {
      index: "home"
    };

    doc = {
      location: {
        hash: "",
        replace: replaceSpy
      }
    };

    global = {
      addEventListener: function(event, listener){
        onHashChange = listener;
      }
    };
  });

  describe("with an empty hash", function(){

    because(function(){
      doc.location.href = "http://example.com/";
      result = hashNavigation.start(config, onPageChangedSpy, doc, global);
    });

    it("should add the correct index value to the end", function(){
      expect(replaceSpy.callCount).toBe(1);
      expect(replaceSpy.firstCall.args[0]).toBe("#/home");
    });
  });

  describe("with an empty hash", function(){

    because(function(){
      doc.location.href = "http://example.com/#/";
      result = hashNavigation.start(config, onPageChangedSpy, doc, global);
    });

    it("should add the correct index value to the end", function(){
      expect(replaceSpy.callCount).toBe(1);
      expect(replaceSpy.firstCall.args[0]).toBe("#/home");
    });
  });
});