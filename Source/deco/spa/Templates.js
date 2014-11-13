define([
  "deco/spa/PageLoader",
  "deco/utils"
], function(
  PageLoader,
  utils
){

  function defaultConfig(){
    return {
      pathToUrl: function(a){ return a; }
    }
  }

  function findTemplatesInDocument(doc){

    var nodeList = doc.querySelectorAll("[type='text/page-template']");
    var nodes = utils.toArray(nodeList);
    var templateList = nodes.map(function(template){
      return {
        id: template.id.toLowerCase(),
        content: template.innerHTML
      };
    });

    return utils.arrayToObject(templateList, function(item, object){
      object[item.id] = item.content;
    });
  }


  function Templates(document, config){
    this.pageLoader = new PageLoader(config || defaultConfig());
    this.cachePages = (config && 'cachePages' in config ? config.cachePages : true)
    this.templates = findTemplatesInDocument(document);
  }

  Templates.prototype.getTemplate = function(path){

    this.pageLoader.abort();

    var normalizedPath = path.toLowerCase();

    if(normalizedPath in this.templates){
      return Promise.resolve(this.templates[normalizedPath]);
    }else{
      return this.pageLoader.loadPage(path)
      .then(function(content){
        if(this.cachePages)
          this.templates[normalizedPath] = content;
        
        return content;
      }.bind(this), function(notFound){
        var errorTemplate = "error" + notFound.error;
        if(errorTemplate in this.templates){
          return this.templates[errorTemplate];
        }else{
          return notFound.content;
        }
      }.bind(this));
    }
  };

  return Templates;
});