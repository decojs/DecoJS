define([
	"deco/proclaimWhen"
], function(
	proclaimWhen
){
	return {
		withNoParams: function(){
			return proclaimWhen.create("withNoParams", function(){});
		}
	}
});