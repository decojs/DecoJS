describe("when adding param to url", ["deco/ajax"], function(ajax){
  describe("when the url contains a question mark", function(){
    describe("when it ends without an &", function(){
      it("should add a &", function(){
        expect(ajax.addParamToUrl("/path?old=3", "new", "something")).toBe("/path?old=3&new=something");
      });
    });
    describe("when it ends with an &", function(){
      it("should keep the &", function(){
        expect(ajax.addParamToUrl("/path?old=3&", "new", "something")).toBe("/path?old=3&new=something");
      });
    });
  });
  describe("when the url does not contain a question mark", function(){
    it("should add a question mark", function(){
      expect(ajax.addParamToUrl("/path", "new", "something")).toBe("/path?new=something");
    });
  });
  it("should escape the name and value", function(){
    expect(ajax.addParamToUrl("/path", "new value", "100%")).toBe("/path?new%20value=100%25");
  });
});