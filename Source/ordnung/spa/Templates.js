define([
	"ordnung/spa/TemplateLoader",
	"when"
], function(
	TemplateLoader,
	when
){
	function Templates(document){
		this.templateLoader = new TemplateLoader();
	}

	Templates.prototype.getTemplate = function(path){


		var deferred = when.defer();

		this.templateLoader.abort();
		this.templateLoader.loadTemplate(path, deferred.resolver);

		return deferred.promise;
	};

	return Templates;
});