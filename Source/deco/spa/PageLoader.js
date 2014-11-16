define([
  "deco/ajax"
], function(
  ajax
){

  function PageLoader(config){
    this.pathToUrl = config && config.pathToUrl || function(a){ return a; };
    this.cache = (config && 'cachePages' in config ? config.cachePages : true);
    this.currentXHR = null;
  }

  PageLoader.prototype.loadPage = function(path){

    this.abort();

    var url = this.pathToUrl(path);

    if(this.cache === false)
      url = ajax.cacheBust(url);
    
    var self = this;
    return new Promise(function(resolve, reject){
      self.currentXHR = ajax(url, {}, "GET", function(xhr){
        self.currentXHR = null;
        if(xhr.status === 200){
          resolve(xhr.responseText);
        }else{
          reject({error: xhr.status, content: xhr.responseText});
        }
      });
    });
  };

  PageLoader.prototype.abort = function(){
    if(this.currentXHR && this.currentXHR.readyState !== 4){
      this.currentXHR.abort();
    }
  };

  return PageLoader;
});