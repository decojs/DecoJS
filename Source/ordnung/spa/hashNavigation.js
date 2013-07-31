define([
	"ordnung/utils"
],function(
	_
){


	
	function newPath(currentPath, link, index){
		var isAbsolute = _.startsWith(link, '/');
		var isFolder = _.endsWith(link, '/');
		
		if(link == "/"){
			var path = [];
		}else{
			var path = _.trim(link, "/").split("/");
		}
		
		if(isFolder){
			path.push(index);
		}
		if(isAbsolute){
			return path;
		}else{
			return _.popTail(currentPath).concat(path);
		}
	}

	function hashChanged(config, onPageChanged, document){

		var path = _.trim(document.location.hash, '#');

		if(_.startsWith(path, '/')){
			this.currentPath = newPath(this.currentPath, path, config.index);
			onPageChanged(this.currentPath.join('/'));
		}else{
			var newHash = newPath(this.currentPath, path, config.index).join('/');
			document.location.replace("#/" + newHash);
		}

	}
	
	function startHashNavigation(config, onPageChanged, doc, global){
		doc = doc || document;
		global = global || window;

		var state = {
			currentPath: []
		};
		var onHashChanged = hashChanged.bind(state, config, onPageChanged, doc);
		onHashChanged();
		global.addEventListener("hashchange", onHashChanged, false);

		return {
			stop: function(){
				global.removeEventListener("hashchange", onHashChanged, false);
			}
		};
	}


	return startHashNavigation;

});