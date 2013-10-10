define([], function(){
	

	function when(){

		function subWhen(){

		}
		subWhen.destroyChildContexts = sinon.spy();
		when.context.push(subWhen);
		return subWhen;
	}
	when.context = [];


	return when;


});