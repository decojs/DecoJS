define(["/base/Source/ajax.js"], function(realAjax){
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


	ajax.responseText = "";
	ajax.spy = sinon.spy();
	ajax.addToPath = realAjax.addToPath;
	ajax.addParamToUrl = realAjax.addParamToUrl;
	ajax.addParamsToUrl = realAjax.addParamsToUrl;
	ajax.cacheBust = realAjax.cacheBust;
	ajax.respondImmediately = true;

	return ajax;
});