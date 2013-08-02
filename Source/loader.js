define(["ordnung/utils", "knockout"], function (utils, ko) {
	return function (domElement) {
		utils.toArray((domElement || document.body).querySelectorAll("*[data-viewmodel]")).forEach(function (target) {
			var viewModelName = target.getAttribute("data-viewmodel");
			var initObject = target.getAttribute("data-initObject");
			if (initObject && initObject.indexOf("{") == 0) {
				initObject = JSON.parse(initObject);
			}
			
			require([viewModelName], function (ViewModel) {
				var viewModel = new ViewModel(initObject);
				ko.applyBindings(viewModel, target);
			});
		});
	};
});