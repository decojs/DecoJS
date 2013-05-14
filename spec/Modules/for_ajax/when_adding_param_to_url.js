require(["ordnung/ajax"], function(ajax){
	buster.testCase("when adding param to url", {
		"should escape the name and value" : function(){
			assert.equals(ajax.addParamToUrl("/path", "new value", "100%"), "/path?new%20value=100%25");
		};
	});

});