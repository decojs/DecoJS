define([], function(){
	return {
		withAViewModel: function(name, model){

			var elm = document.createElement("div");
			var div = document.createElement("div");
			div.setAttribute("data-viewmodel", name);
			div.setAttribute("data-model", JSON.stringify(model));
			elm.appendChild(div);

			return elm;
		}
	}
});