define([
	"ordnung/ajax"
], function(
	ajax
){

	function PageLoader(pathToUrl){
		this.pathToUrl = pathToUrl;
		this.currentXHR = null;
	}

	PageLoader.prototype.loadPage = function(path, resolver){

		this.abort();

		this.currentXHR = ajax(this.pathToUrl(path), {}, "GET", function(xhr){
			if(xhr.status === 200)
				resolver.resolve(xhr.responseText);
			else
				resolver.reject(xhr.responseText);
		});
	};

	PageLoader.prototype.abort = function(){
		if(this.currentXHR && this.currentXHR.readyState !== 4){
			this.currentXHR.abort();
		}
	};

	return PageLoader;
});