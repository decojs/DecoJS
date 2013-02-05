define([], function(){
	return function(value, attributes){
		if(value == null) return false;
		if(typeof value == "string" && value.length == 0) return false;
		return true;
	}
});