define(["testModule"], function(mod) {
    buster.testCase("some test", {
	"test that fails" : function() {
	    assert.match(mod, {name: "wrong name"});
	},
	"test that succeeds" : function() {
	    assert.match(mod, {name: "module"});
	}
    });
});