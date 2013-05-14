define([], function(){
	function ajax(url, object, method, callback){
		ajax.spy(url, object, method, callback);
		callback({
			status:200,
			responseText: ajax.responseText
		});
	}


	function addParamToUrl(url, name, value){
		return url + (url.match(/\?/) ? (url.match(/&$/) ? "" : "&") : "?") + encodeURIComponent(name) + "=" + encodeURIComponent(value);
	}

	function addToPath(url, segment){
		return url + (url.match(/\/$/) ? "" : "/") + segment;
	}

	ajax.responseText = "";
	ajax.spy = sinon.spy();
	ajax.addToPath = addToPath;
	ajax.addParamToUrl = addParamToUrl;

	return ajax;
});