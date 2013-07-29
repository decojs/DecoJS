define(["ordnung/utils", "knockout", "when", "when/callbacks"], function (utils, ko, when, callbacks) {


	function getAttributes(target){

		var viewModelName = target.getAttribute("data-viewmodel");
		var model = target.getAttribute("data-model");
		if (model && model.indexOf("{") == 0) {
			model = JSON.parse(model);
		}

		return {
			target: target,
			viewModelName: viewModelName,
			model: model
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

		domElement = domElement || document.body;

		var elementList = utils.toArray(domElement.querySelectorAll("*[data-viewmodel]"));

		var viewModelsLoaded = elementList.map(getAttributes).map(loadViewModel);

		return when.all(viewModelsLoaded).then(function(list){
			list.forEach(applyViewModel)
		});
	};
});