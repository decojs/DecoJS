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
		}
	};
});
