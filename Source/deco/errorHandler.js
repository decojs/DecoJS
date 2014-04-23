define([], function(){
  return {
    onError: function(error){
      setTimeout(function(){
        throw error;
      },1);
    }
  };
});