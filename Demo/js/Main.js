define("Main", ["ordnung/qvc", "knockout"], function(qvc, ko){
	function ViewModel(){
		var self = this;
		
		this.name = ko.observable("");
		
		this.setName = qvc.createCommand({
			name: "SetValue",
			success: function(){
				self.name("");
			},
			parameters: {
				key: "name",
				value: self.name
			}
		});
		
		this.getName = qvc.createQuery({
			name: "GetValue",
			result: self.name,
			parameters: {
				key: "name"
			}
		});
	}
	
	return ViewModel;
});