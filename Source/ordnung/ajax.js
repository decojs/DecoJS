define([], function(){
	function dataToParams(data){
		var params = []
		for(var key in data){
			var value = data[key];
			params.push(key + "=" + encodeURIComponent(value));
		}
		return params.join("&");
	}

	function addParamToUrl(url, name, value){
		return url + (url.match(/\?/) ? (url.match(/&$/) ? "" : "&") : "?") + encodeURIComponent(name) + "=" + encodeURIComponent(value);
	}

	function addToPath(url, segment){
		return url + (url.match(/\/$/) ? "" : "/") + segment;
	}


	function ajax(url, object, method, callback){
		var xhr = new XMLHttpRequest();
		
		var isPost = (method === "POST");
		var data = null;
		
		if(object){

			if(isPost){
				data = dataToParams(object);
			} else {
				url += "?" + dataToParams(object);
			}
		}
		
		if(isPost){
			url = addParamToUrl(url, "cacheKey", Math.floor(Math.random()*10000));
		}

		xhr.open(isPost ? "POST" : "GET", url, true);
		
		if(isPost && data){
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhr.setRequestHeader("Content-length", data.length);
			xhr.setRequestHeader("Connection", "close");
		}
		
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				callback(xhr);
			}
		}
		
		xhr.send(data);
		return xhr;
	}

	ajax.addParamToUrl = addParamToUrl;
	ajax.addToPath = addToPath;


	return ajax;
})