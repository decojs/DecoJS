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
    },
    withNestedViewModel: function(first, second){

      var elm = document.createElement("div");
      var div = document.createElement("div");
      var child = document.createElement("div");
      div.setAttribute("data-viewmodel", first);
      child.setAttribute("data-viewmodel", second);
      div.appendChild(child);
      elm.appendChild(div);

      return elm;
    },
    withChildrenAndATitle: function(titleText){
      var elm = this.withChildren();
      var title = document.createElement("meta");
      title.setAttribute("name", "title");
      title.setAttribute("content", titleText);
      elm.appendChild(title);
      return elm;
    },
    withChildren: function(){
      var elm = document.createElement("div");
      for(var i=0; i<5; i++){
        var child = document.createElement("span");
        child.textContent = "child number "+i;
        elm.appendChild(child);
      }
      return elm;
    },
    withScriptTags: function(){
      var elm = document.createElement("div");
      for(var i=0; i<5; i++){
        elm.innerHTML += '<script type="text/javascript">child number '+i+'</script>';
      }
      return elm;
    },
    withScriptTagsWithIds: function(type){
      var elm = document.createElement("div");
      for(var i=0; i<5; i++){
        elm.innerHTML += '<script type="' + (type || 'text/javascript') + '" id="script' + i + '">child number '+i+'</script>';
      }
      return elm;
    }
  }
});