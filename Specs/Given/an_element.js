define([], function(){
	return {
		withAViewModel: function(name, model){

			var elm = document.createElement("div");
			var div = document.createElement("div");
			div.setAttribute("data-viewmodel", name);
			if(model)
				div.setAttribute("data-model", JSON.stringify(model));
			elm.appendChild(div);

			return elm;
		}
	}
});