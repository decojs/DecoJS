define([], function(){


	function createDocument(title){
		if('createHTMLDocument' in document.implementation)
			return document.implementation.createHTMLDocument(title);
		else{
			var doc = new ActiveXObject("htmlfile");
			doc.write("<html><head><title>"+title+"</title></head><body></body></html>");
			doc.close();
			return doc;
		}
	}

	return {
		withAnOutlet: function(name){
			var doc = createDocument("hello");
			var outlet = doc.createElement("div");
			outlet.setAttribute("data-outlet","true");
			doc.body.appendChild(outlet);
			var template = doc.createElement("script");
			template.setAttribute("type","text/page-template");
			template.setAttribute("id","index");
			template.textContent='<div data-viewmodel="'+name+'"></div>';
			doc.body.appendChild(template);
			var template = doc.createElement("script");
			template.setAttribute("type","text/page-template");
			template.setAttribute("id","destroy/viewmodel/path");
			template.textContent='<div></div>';
			doc.body.appendChild(template);
			return doc;	
		},
		withATitleAndBody: function(title){
			var doc = createDocument(title);
			return doc;
		},
		withATitleAndBodyWithScriptTags: function(title){
			var doc = createDocument(title);
			for(var i=0; i<5; i++){
				var child = doc.createElement("script");
				child.id = "script"+i;
				child.textContent = "child number "+i;
				doc.body.appendChild(child);
			}
			return doc;
		},
		withPageTemplates: function(){
			var doc = {
				querySelectorAll: sinon.stub()
			};

			doc.querySelectorAll.returns([
				{
					id:"myTemplate",
					innerHTML: "<p>my template</p>"
				}
			]);

			return doc;

		},
		withAnError404Template: function(){
			var doc = {
				querySelectorAll: sinon.stub()
			};

			doc.querySelectorAll.returns([
				{
					id:"error404",
					innerHTML: "could not be found"
				}
			]);

			return doc;

		}
	}
});