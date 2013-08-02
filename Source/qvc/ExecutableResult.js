define(["ordnung/utils"], function(utils){
	function ExecutableResult(result){
		
		this.success = false;
		this.valid = false;
		this.result = null;
		this.exception = null;
		this.violations = [];
	
		utils.extend(this, result);
	
	};
	
	return ExecutableResult;
});