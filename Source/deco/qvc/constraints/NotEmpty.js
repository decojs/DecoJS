define([], function(){
  function NotEmpty(attributes){
    
  }
  
  NotEmpty.prototype.isValid = function(value){
    if(value == null) return false;
    if(typeof value == "string" && value.length == 0) return false;
    return true;
  };
  
  return NotEmpty;
});