define([], function(){
	

	function when(){

		function subWhen(){
			return when();
		}
		subWhen.destroyChildContexts = sinon.spy();
		when.context.push(subWhen);
		return subWhen;
	}
	when.context = [];

	when.reset = function(){
		when.context = [];
	}

	return when;


});