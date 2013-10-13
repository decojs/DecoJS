define([], function(){

	var _listener;

	return {
		start: function(config, listener, doc){
			_listener = listener;
		},
		navigateToPage: function(path){
			return _listener(path, path.split("/"));
		}
	}
});