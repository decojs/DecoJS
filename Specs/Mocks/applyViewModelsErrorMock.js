define(function(){
  var spy = sinon.stub();
  spy.throws("Mock Error");
  return spy;
});