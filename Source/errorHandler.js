define([], function(){
	return {
		onError: function(error){
			console.error(error.stack);
		}
	};
});