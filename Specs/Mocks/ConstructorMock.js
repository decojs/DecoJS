define([], function(){
  var spy = sinon.spy();

  function Constructor(){
    spy.apply(null, arguments);
  }
  
  Constructor.spy = spy;
  
  return Constructor;
});