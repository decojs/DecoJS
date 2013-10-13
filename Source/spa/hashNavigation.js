define([
	"ordnung/utils"
],function(
	_
){


	
	function newPath(currentPath, link, index){
		var isRelative = _.startsWith(link, '/') === false;
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
		if(isRelative){
			path = _.popTail(currentPath).concat(path);
		}

		var out = [];

		for(var i = path.length>>>0; i--;){
			if(path[i] === ""){
				continue;
			}else if(path[i] === "."){
				continue;
			}else if(path[i] === "..") {
				i--;
			}else{
				out.unshift(path[i]);
			}
		}

		return out;
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
			onPageChanged(this.currentPath.join('/'), this.currentPath);
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