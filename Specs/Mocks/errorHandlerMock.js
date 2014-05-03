define([], function(){
  return {
    onError: sinon.spy(),
    reset: function(){
      this.onError.reset();
    }
  };
});