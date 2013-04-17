define(["ListVM", "ordnung/qvc", "knockout"], function(ListVM, qvc, ko){
	function ViewModel(){
		var self = this;
		
		this.listVM = new ListVM();
		
		this.firstName = ko.observable("");
		this.lastName = ko.observable("");
		this.fullName = ko.computed(function(){
			return self.firstName() + " " + self.lastName();
		});
		
		this.addName = qvc.createCommand("AddName",
			{
				firstName: self.firstName,
				lastName: self.lastName
			},
			{
				success: function(){
					self.listVM.addName(self.firstName(), self.lastName());
					self.firstName("");
					self.lastName("");
				}
			}
		);
	}
	
	return ViewModel;
});