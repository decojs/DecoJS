define(function(){
  var spy = sinon.stub();
  spy.returns(Promise.resolve());
  return spy;
});