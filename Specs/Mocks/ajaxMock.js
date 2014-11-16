define(["__mocked__"], function(realAjax){
  function ajax(url, object, method, callback){
    ajax.spy(url, object, method, callback);
    if(ajax.respondImmediately){
      callback({
        status:ajax.responseCode,
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
      },
      readyState: 2
    }
  }

  ajax.responseCode = 200;
  ajax.responseText = "";
  ajax.spy = sinon.spy();
  ajax.addToPath = realAjax.addToPath;
  ajax.addParamToUrl = realAjax.addParamToUrl;
  ajax.addParamsToUrl = realAjax.addParamsToUrl;
  ajax.cacheBust = realAjax.cacheBust;
  ajax.respondImmediately = true;
  ajax.reset = function(){
    ajax.spy.reset();
    ajax.responseCode = 200;
    ajax.responseText = "";
    ajax.respondImmediately = true;
  }
  return ajax;
});