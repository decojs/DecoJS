define([],function(){
	function ajax(url, object, method, callback){
		ajax.spy(url, object, method, callback);
		callback({
			status:200,
			responseText: ajax.responseText
		});
	}

	ajax.responseText = "";
	ajax.spy = sinon.spy();

	return ajax;
});