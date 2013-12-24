define([
  'deco/qvc',
  'deco/spa'
], function(
  qvc,
  spa
){

  

  function config(config){

    config = config || {};

    var spaConfig = config.spa || {};
    var qvcConfig = config.qvc || {};

    qvc.config(qvcConfig);

    return {
      start: spa.start.bind(null, spaConfig, document)
    }
  }
  
  return {
    config: config
  };

});