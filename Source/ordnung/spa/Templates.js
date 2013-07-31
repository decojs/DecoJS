define([
	"ordnung/spa/PageLoader",
	"ordnung/utils",
	"when"
], function(
	PageLoader,
	utils,
	when
){

	function findTemplatesInDocument(doc){

		var nodeList = doc.querySelectorAll("[type='text/page-template']");
		var nodes = utils.toArray(nodeList);
		var templateList = nodes.map(function(template){
			return {
				id: template.id.toLowerCase(),
				content: template.innerHTML
			};
		});

		return utils.arrayToObject(templateList, function(item, object){
			object[item.id] = item.content;
		});
	}


	function Templates(document){
		this.pageLoader = new PageLoader();

		this.templates = findTemplatesInDocument(document);
	}

	Templates.prototype.getTemplate = function(path){

		var deferred = when.defer();

		this.pageLoader.abort();

		var normalizedPath = path.toLowerCase();

		if(normalizedPath in this.templates){
			deferred.resolve(this.templates[normalizedPath]);
		}else{
			this.pageLoader.loadPage(path, deferred.resolver);
		}


		return deferred.promise;
	};

	return Templates;
});