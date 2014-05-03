define([], function(){
  function dataToParams(data){
    var params = []
    for(var key in data){
      var value = data[key];
      params.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    }
    return params.join("&");
  }

  function addParamToUrl(url, name, value){
    return url + (url.match(/\?/) ? (url.match(/&$/) ? "" : "&") : "?") + encodeURIComponent(name) + "=" + encodeURIComponent(value);
  }

  function addParamsToUrl(url, data){
    var params = dataToParams(data);
    return url + (url.match(/\?/) ? (url.match(/&$/) ? "" : (params.length > 0 ? "&" : "")) : "?") + params;
  }

  function addToPath(url, segment){
    return url + (url.match(/\/$/) ? "" : "/") + segment;
  }

  function cacheBust(url){
    return addParamToUrl(url, "cacheKey", Math.floor(Math.random()*Math.pow(2,53)));
  }

  function ajax(url, object, method, callback){
    var xhr = new XMLHttpRequest();
    
    var isPost = (method === "POST");
    var data = null;
    
    if(object){

      if(isPost){
        data = dataToParams(object);
      } else {
        url = addParamsToUrl(url, object);
      }
    }
    
    if(isPost){
      url = cacheBust(url);
    }

    xhr.open(method, url, true);
    
    if(isPost && data){
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    }
    
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    
    xhr.onreadystatechange = function(){
      if(xhr.readyState == 4){
        callback(xhr);
      }
    }
    
    xhr.send(data);
    return xhr;
  }

  ajax.addParamToUrl = addParamToUrl;
  ajax.addParamsToUrl = addParamsToUrl;
  ajax.addToPath = addToPath;
  ajax.cacheBust = cacheBust;


  return ajax;
})