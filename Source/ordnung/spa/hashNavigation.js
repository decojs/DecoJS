define([
	"ordnung/utils"
],function(
	_
){


	
	function newPath(currentPath, link, index){
		var isAbsolute = _.startsWith(link, '/');
		var isFolder = _.endsWith(link, '/');
		
		if(link === "/"){
			var path = [];
		}else if(link === ""){
			var path = [index];
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

		var isRelative = _.startsWith(path, '/') == false;
		var isFolder = _.endsWith(path, '/');

		if(isRelative || isFolder){
			var newHash = newPath(this.currentPath, path, config.index).join('/');
			document.location.replace("#/" + newHash);
		}else{
			this.currentPath = newPath(this.currentPath, path, config.index);
			onPageChanged(this.currentPath.join('/'));
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
		_.addEventListener(global, "hashchange", onHashChanged, false);

		return {
			stop: function(){
				global.removeEventListener("hashchange", onHashChanged, false);
			}
		};
	}


	return {
		start: startHashNavigation
	};

});