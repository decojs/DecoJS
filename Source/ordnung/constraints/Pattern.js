define([], function(){
	return function(value, attributes){
		if(value == null) return false;
		return new RegExp(attributes.regexp).test(value);
	}
})