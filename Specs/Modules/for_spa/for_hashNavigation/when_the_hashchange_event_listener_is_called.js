describe("when the hashchange event listener is called", [
  "deco/spa/hashNavigation"
], function(
  hashNavigation
){

  var onPageChangedSpy,
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
        href: "http://example.com/#/myPath/home",
        replace: replaceSpy
      }
    };

    global = {
      addEventListener: function(event, listener){
        onHashChange = listener;
      }
    };

    hashNavigation.start(config, onPageChangedSpy, doc, global);
  });

  describe("with a path starting with /", function(){

    because(function(){
      onPageChangedSpy.reset();
      doc.location.href = "http://example.com/#/newPath";
      onHashChange();
    });

    it("should call onPageChanged with the new path", function(){
      expect(onPageChangedSpy.callCount).toBe(1);
      expect(onPageChangedSpy.firstCall.args[0]).toBe("newPath");
      expect(onPageChangedSpy.firstCall.args[1]).toEqual(["newPath"]);
    });
  });

  describe("with a path that is absolute and contains ..", function(){

    because(function(){
      replaceSpy.reset();
      doc.location.href = "http://example.com/#/../newPath";
      onHashChange();
    });

    it("should call document.location.replace with the new path", function(){
      expect(replaceSpy.callCount).toBe(1);
      expect(replaceSpy.firstCall.args[0]).toBe("#/newPath");
    });
  });
  
  describe("with a path that is absolute and contains .", function(){

    because(function(){
      replaceSpy.reset();
      doc.location.href = "http://example.com/#/./newPath";
      onHashChange();
    });

    it("should call document.location.replace with the new path", function(){
      expect(replaceSpy.callCount).toBe(1);
      expect(replaceSpy.firstCall.args[0]).toBe("#/newPath");
    });
  });

  describe("with a path not starting with /", function(){

    because(function(){
      replaceSpy.reset();
      doc.location.href = "http://example.com/#newPath";
      onHashChange();
    });

    it("should call document.location.replace with the new path", function(){
      expect(replaceSpy.callCount).toBe(1);
      expect(replaceSpy.firstCall.args[0]).toBe("#/myPath/newPath");
    });
  });

  describe("with a path ends with /", function(){

    because(function(){
      replaceSpy.reset();
      doc.location.href = "http://example.com/#/newPath/";
      onHashChange();
    });

    it("should call document.location.replace with the new path, ending with index", function(){
      expect(replaceSpy.callCount).toBe(1);
      expect(replaceSpy.firstCall.args[0]).toBe("#/newPath/home");
    });
  });

  describe("with a path starting with ..", function(){

    because(function(){
      replaceSpy.reset();
      doc.location.href = "http://example.com/#../home";
      onHashChange();
    });

    it("should call document.location.replace with the new path, which is home", function(){
      expect(replaceSpy.callCount).toBe(1);
      expect(replaceSpy.firstCall.args[0]).toBe("#/home");
    });
  });

  describe("with a path with too many ..", function(){

    because(function(){
      replaceSpy.reset();
      doc.location.href = "http://example.com/#../../home";
      onHashChange();
    });

    it("should call document.location.replace with the new path, which is home", function(){
      expect(replaceSpy.callCount).toBe(1);
      expect(replaceSpy.firstCall.args[0]).toBe("#/home");
    });
  });

  describe("with a path containing two consecutive slashes", function(){

    because(function(){
      onPageChangedSpy.reset();
      doc.location.href = "http://example.com/#/newPath//home";
      onHashChange();
    });

    it("should call document.location.replace with the new pretty path, ending with home", function(){
      expect(replaceSpy.callCount).toBe(1);
      expect(replaceSpy.firstCall.args[0]).toBe("#/newPath/home");
    });
  });

  describe("with a path starting with .", function(){

    because(function(){
      replaceSpy.reset();
      doc.location.href = "http://example.com/#./home";
      onHashChange();
    });

    it("should call document.location.replace with the new path, ending with home", function(){
      expect(replaceSpy.callCount).toBe(1);
      expect(replaceSpy.firstCall.args[0]).toBe("#/myPath/home");
    });
  });

  describe("with a path starting with .", function(){

    because(function(){
      replaceSpy.reset();
      doc.location.href = "http://example.com/#./home";
      onHashChange();
    });

    it("should call document.location.replace with the new path, ending with home", function(){
      expect(replaceSpy.callCount).toBe(1);
      expect(replaceSpy.firstCall.args[0]).toBe("#/myPath/home");
    });
  });

  describe("with a path containing url encoded data", function(){

    because(function(){
      onPageChangedSpy.reset();
      doc.location.href = "http://example.com/#/%3A%2F%2F/%C3%BC";
      onHashChange();
    });

    it("should call onPageChanged with the new path, with the url decoded sement", function(){
      expect(onPageChangedSpy.callCount).toBe(1);
      expect(onPageChangedSpy.firstCall.args[0]).toBe("%3A%2F%2F/%C3%BC");
      expect(onPageChangedSpy.firstCall.args[1]).toEqual(["://", "ü"]);
    });
  });
  
  
  describe("when the current path only has one segment", function(){    
    beforeEach(function(){
      doc.location.href = "http://example.com/#/index";
      hashNavigation.start(config, onPageChangedSpy, doc, global);
    });

    describe("with a simple path", function(){

      because(function(){
        replaceSpy.reset();
        doc.location.href = "http://example.com/#home";
        onHashChange();
      });

      it("should call document.location.replace with the new path, which is home", function(){
        expect(replaceSpy.callCount).toBe(1);
        expect(replaceSpy.firstCall.args[0]).toBe("#/home");
      });
    });

    describe("with a path with too many ..", function(){

      because(function(){
        replaceSpy.reset();
        doc.location.href = "http://example.com/#../home";
        onHashChange();
      });

      it("should call document.location.replace with the new path, which is home", function(){
        expect(replaceSpy.callCount).toBe(1);
        expect(replaceSpy.firstCall.args[0]).toBe("#/home");
      });
    });
  });
  
  describe("when the current path has three segment", function(){    
    beforeEach(function(){
      doc.location.href = "http://example.com/#/path/to/page";
      hashNavigation.start(config, onPageChangedSpy, doc, global);
    });

    describe("with a simple path", function(){

      because(function(){
        replaceSpy.reset();
        doc.location.href = "http://example.com/#home";
        onHashChange();
      });

      it("should call document.location.replace with the new path, which is path/to/home", function(){
        expect(replaceSpy.callCount).toBe(1);
        expect(replaceSpy.firstCall.args[0]).toBe("#/path/to/home");
      });
    });

    describe("with a path with two .. in a row", function(){

      because(function(){
        replaceSpy.reset();
        doc.location.href = "http://example.com/#../../home";
        onHashChange();
      });

      it("should call document.location.replace with the new path, which is home", function(){
        expect(replaceSpy.callCount).toBe(1);
        expect(replaceSpy.firstCall.args[0]).toBe("#/home");
      });
    });
  });
});