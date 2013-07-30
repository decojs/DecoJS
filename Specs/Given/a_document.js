define([], function(){
	return {
		withATitleAndBody: function(title){
			var doc = document.implementation.createHTMLDocument(title);
			doc.documentElement = doc.createElement("html");
			return doc;
		},
		withATitleAndBodyWithScriptTags: function(title){
			var doc = document.implementation.createHTMLDocument(title);
			doc.documentElement = doc.createElement("html");
			for(var i=0; i<5; i++){
				var child = doc.createElement("script");
				child.id = "script"+i;
				child.textContent = "child number "+i;
				doc.body.appendChild(child);
			}
			return doc;
		}
	}
});