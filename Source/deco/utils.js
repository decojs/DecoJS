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
    
    inheritsFrom: function(o){
      function F() {}
      F.prototype = o.prototype;

      return new F();
    },
    
    arrayToObject: function(array, func){
      return array.reduce(function(collection, item){
        func(item, collection);
        return collection;
      }, {});
    },
    
    trim: function(word, character){
      for(var f=0; f<word.length; f++){
        if(word.charAt(f) !== character) break;
      }
      for(var t=word.length; t>0; t--){
        if(word.charAt(t-1) !== character) break;
      }
      return word.substring(f, t);
    },
    
    after: function(word, character){
      var index = word.indexOf(character);
      if(index < 0){
        return "";
      }else{
        return word.substr(index+1);
      }
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
