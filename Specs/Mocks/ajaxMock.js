define([], function(){
	function ajax(url, object, method, callback){
		ajax.spy(url, object, method, callback);
		if(ajax.respondImmediately){
			callback({
				status:200,
				responseText: ajax.responseText
			});
		}else{
			ajax.callback = callback;
		}

		return {
			abort: function(){
				callback({
					status: 0,
					responseText: ""
				});
			}
		}
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
	ajax.respondImmediately = true;

	return ajax;
});