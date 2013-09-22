define(["when"], function(when){
	var spy = sinon.stub();
	spy.throws("Mock Error");
	return spy;
});