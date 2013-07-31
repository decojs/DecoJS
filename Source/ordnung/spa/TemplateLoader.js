define([
	"ordnung/ajax"
], function(
	ajax
){

	function TemplateLoader(){
		this.currentXHR = null;
	}

	TemplateLoader.prototype.loadTemplate = function(path, resolver){

		this.abort();

		this.currentXHR = ajax(path, {}, "GET", function(xhr){
			if(xhr.status === 200)
				resolver.resolve(xhr.responseText);
			else
				resolver.reject(xhr.responseText);
		});
	};

	TemplateLoader.prototype.abort = function(){
		if(this.currentXHR && this.currentXHR.readyState !== 4){
			this.currentXHR.abort();
		}
	};

	return TemplateLoader;
});