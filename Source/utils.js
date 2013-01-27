define([], function(){
	return {
		toArray: function(obj){
			var array = [];
			// iterate backwards ensuring that length is an UInt32
			for (var i = obj.length >>> 0; i--;) { 
				array[i] = obj[i];
			}
			return array;
		},
		extend: function(dst, src){
			src = src || {};
			dst = dst || {};
			for(var i in src){
				dst[i] = src[i];
			}
			return dst;
		},
		ajax: function(url, parameters, method, callback){
			var xhr = new XMLHttpRequest();
			
			var isPost = (method === "POST");
			var data = null;
			
			if(parameters){
				if(isPost){
					data = "parameters=" + parameters;
				} else {
					url += "?parameters=" + encodeURIComponent(parameters);
				}
			}
			
			url += (url.match(/\?/) ? "&" : "?") + Math.floor(Math.random()*10000);
			
			xhr.open(isPost ? "POST" : "GET", url, true);
			
			if(isPost && parameters){
				xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xhr.setRequestHeader("Content-length", data.length);
				//xhr.setRequestHeader("Connection", "close");
			}
			
			xhr.onloadend = function(){
				callback(xhr);
			};
			
			xhr.send(data);
			return xhr;
		}
	
	};
});
