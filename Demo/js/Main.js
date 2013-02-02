
require.config({
	baseUrl: "js",
	paths: {
		"ordnung": "../../Source/ordnung",
		"knockout": "../../Source/Libs/knockout-2.1.0"
	}
});

require(["ordnung/qvc", "ordnung/loader"], function(qvc, load){
	qvc.config({
		baseUrl: "/"
	});
	
	load();
});