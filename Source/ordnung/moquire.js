var moquire = (function(){

	var contextCounter = 0;
	function createContextName(){
		return "context" + (contextCounter++);
	}
	
	var moduleCounter = 0;
	function createModuleName(){
		return "module" + (moduleCounter++);
	}
	
	function typeOf(obj) {
		return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
	}
	
	function typeOfArray(array){
		return Array.prototype.map.call(array, typeOf);
	}
	
	function testArguments(arguments, expectedTypes){
		if(arguments.length != expectedTypes.length){
			return false;
		}
		var givenTypes = typeOfArray(arguments);
		
		return expectedTypes.every(function(expectedType, i){
			return expectedType == givenTypes[i];
		});
	}
	
	function extendConfig(source, name, map){
		var target = {
			context: name,
			map:{
				'*': map
			}
		};
	
		for(var p in source){
			target[p] = source[p];
		}
		return target;
	}
	
	function createModule(name, factory){
		define(name, [], factory);
	}
	
	function createMap(map){
		for(var key in map){
			var val = map[key];
			if(typeof val === "function"){
				map[key] = createModuleName();
				createModule(map[key], val);
			}
		}
		return map;
	}
	
	function requireWithMap(map, dependencies, factory){
		var config = extendConfig(requireConfig, createContextName(), createMap(map));

		var mappedRequire = require.config(config);
		mappedRequire(dependencies, factory);
	}
	
	function requireWithoutMap(dependencies, factory){
		require(dependencies, factory);
	}
	
	return function moquire(arg0, arg1, arg2){
		
		if(testArguments(arguments, ["array", "function"])){
			requireWithoutMap(arg0, arg1);
		}else if(testArguments(arguments, ["object", "array", "function"])){
			requireWithMap(arg0, arg1, arg2);
		}else{
			throw new Error("could not moquire\n" + 
			"Invalid argument types (" + typeOfArray(arguments).join(", ") + ")\n" + 
			"expected (array, function) or (object, array, function)");
		}
	}

})();