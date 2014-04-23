define([], function(){
  function Pattern(attributes){    

    attributes.flags = attributes.flags || [];
    
    var flags = '';
    if(attributes.flags.indexOf("CASE_INSENSITIVE") >= 0) flags += 'i';
    
    this.regex = new RegExp(attributes.regexp, flags);
  }
  
  
  Pattern.prototype.isValid = function(value){
    
    if(value == null) return false;
    
    var result = this.regex.exec(value);
    
    if(result == null) return false;
    
    return result[0] == value;
  };
  
  
  return Pattern;
});