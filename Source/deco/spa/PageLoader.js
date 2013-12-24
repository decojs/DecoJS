define([
	"deco/ajax"
], function(
	ajax
){

	function PageLoader(config){
		this.pathToUrl = config && config.pathToUrl || function(a){ return a; };
		this.cache = (config && 'cachePages' in config ? config.cachePages : true);
		this.currentXHR = null;
	}

	PageLoader.prototype.loadPage = function(path, resolver){

		this.abort();

		var url = this.pathToUrl(path);

		if(this.cache === false)
			url = ajax.cacheBust(url);

		this.currentXHR = ajax(url, {}, "GET", function(xhr){
			if(xhr.status === 200)
				resolver.resolve(xhr.responseText);
			else
				resolver.reject({error: xhr.status, content: xhr.responseText});
		});
	};

	PageLoader.prototype.abort = function(){
		if(this.currentXHR && this.currentXHR.readyState !== 4){
			this.currentXHR.abort();
		}
	};

	return PageLoader;
});