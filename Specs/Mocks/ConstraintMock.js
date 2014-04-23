define([], function(){
  function Constraint(name, attributes){
    this.name = name;
    this.attributes = attributes;
  }
  
  return Constraint;
});