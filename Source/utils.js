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
		arrayToObject: function(array, func){
			return array.reduce(function(collection, item){
				func(item, collection);
				return collection;
			}, {});
		},
		trim: function(word, character){
			while(word.charAt(0) == character) word = word.substr(1);
			while(word.charAt(word.length - 1) == character) word = word.substr(0, word.length - 1);
			return word;
		},
		popTail: function(array){
			return array.slice(0, -1);
		},
		startsWith: function(word, character){
			return word.charAt(0) === character;
		},
		endsWith: function(word, character){
			return word.charAt(word.length - 1) === character;
		},
		addEventListener: function(element, event, listener, bubble){
			if('addEventListener' in element){
				element.addEventListener(event, listener, bubble);
			}else{
				element.attachEvent("on"+event, listener);		
			}
		}
	};
});
