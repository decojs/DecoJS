define([], function(){
  return {
    onError: function(error){
     console.error(error && error.stack || error);
    }
  };
});