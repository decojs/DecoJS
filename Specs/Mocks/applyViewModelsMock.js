define(["when"], function(when){
	var spy = sinon.stub();
	spy.returns(when.resolve());
	return spy;
});