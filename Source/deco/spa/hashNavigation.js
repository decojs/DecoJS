define([
  "deco/utils"
],function(
  _
){


  
  function findNewPath(currentPath, link, index){
    var isRelative = _.startsWith(link, '/') === false;
    var isFolder = _.endsWith(link, '/');
    
    if(link === "/"){
      var path = [];
    }else if(link === ""){
      var path = [index];
    }else{
      var path = _.trim(link, "/").split("/");
    }

    if(isFolder){
      path.push(index);
    }
    if(isRelative){
      path = _.popTail(currentPath).concat(path);
    }

    var out = [];
    var isPretty = true;
    var segmentsToSkip = 0;

    for(var i = path.length-1; i>=0; i--){
      if(path[i] === ""){
        isPretty = false;
      }else if(path[i] === "."){
        isPretty = false;
      }else if(path[i] === "..") {
        isPretty = false;
        segmentsToSkip++;
      }else if(segmentsToSkip > 0){
        segmentsToSkip--;
      }else{
        out.unshift(path[i]);
      }
    }

    return {isAbsoluteAndPretty: !isFolder && !isRelative && isPretty, path: out};
  }

  function hashChanged(config, onPageChanged, document){
    var link = _.after(document.location.href, '#');
    var isHashBang = _.startsWith(link, '!');
    var result = findNewPath(this.currentPath, link.substr(isHashBang ? 1 : 0), config.index);
    
    if(result.isAbsoluteAndPretty && isHashBang){
      this.currentPath = result.path;
      onPageChanged(result.path.join('/'), result.path.map(decodeURIComponent));
    }else{
      document.location.replace("#!/" + result.path.join('/'));
    }

  }
  
  function startHashNavigation(config, onPageChanged, doc, global){
    doc = doc || document;
    global = global || window;

    var state = {
      currentPath: []
    };
    var onHashChanged = hashChanged.bind(state, config, onPageChanged, doc);
    onHashChanged();
    _.addEventListener(global, "hashchange", onHashChanged, false);

    return {
      stop: function(){
        global.removeEventListener("hashchange", onHashChanged, false);
      }
    };
  }


  return {
    start: startHashNavigation
  };

});