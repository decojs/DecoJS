describe("when adding to the path", ["deco/ajax"], function(ajax){
  describe("when the path ends with a slash", function(){
    it("should not add a slash", function(){
      expect(ajax.addToPath("/absolute/path/to/", "something")).toBe("/absolute/path/to/something");
    });
  });
  describe("when the path does not end with a slash", function(){
    it("should add a slash", function(){
      expect(ajax.addToPath("/absolute/path/to", "something")).toBe("/absolute/path/to/something");
    });
  });
});