define(["ordnung/utils", "knockout", "when", "when/callbacks"], function (utils, ko, when, callbacks) {


	function getAttributes(target){

		var viewModelName = target.getAttribute("data-viewmodel");
		var initObject = target.getAttribute("data-initObject");
		if (initObject && initObject.indexOf("{") == 0) {
			initObject = JSON.parse(initObject);
		}

		return {
			target: target,
			viewModelName: viewModelName,
			model: initObject
		};
	}

	function applyViewModel(data) {
		var viewModel = new data.ViewModel(data.model);
		ko.applyBindings(viewModel, data.target);
	};

	function loadViewModel(data){
		return callbacks.call(require, [
			data.viewModelName
		]).then(function(ViewModel){
			data.ViewModel = ViewModel;
			return data;
		});
	}



	return function (domElement) {

		var elementList = utils.toArray((domElement || document.body).querySelectorAll("*[data-viewmodel]"));

		var viewModelsLoaded = elementList.map(getAttributes).map(loadViewModel);

		return when.all(viewModelsLoaded).then(function(list){
			list.forEach(applyViewModel)
		});
	};
});