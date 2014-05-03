define([], function(){

  var STATE_LOADING = 'loading';
  var STATE_LOADED = 'loaded';

  function findConstraint(name, constraints) {
    for (var i = 0; i < constraints.length; i++) {
      if (constraints[i].name == name) {
        return constraints[i];
      }
    }
    return false;
  }

  function constraintsLoaded(name, fields){
    var constraint = findConstraint(name, this.constraints);
    if(constraint){
      constraint.validatables.forEach(function(validatable){
        validatable.applyConstraints(fields);
      });
      constraint.fields = fields;
      constraint.state = STATE_LOADED;
      constraint.validatables = [];
    }
  }


  function ConstraintResolver(qvc){
    this.qvc = qvc;
    this.constraints = [];
  }
  
  ConstraintResolver.prototype.applyValidationConstraints = function(name, validatable){
    var constraint = findConstraint(name, this.constraints);
    if(constraint === false){
      this.constraints.push({
        name: name,
        state: STATE_LOADING,
        validatables: [validatable]
      });
      this.qvc.loadConstraints(name, constraintsLoaded.bind(this));
    }else{
      if(constraint.state === STATE_LOADING){
        constraint.validatables.push(validatable);
      }else{
        validatable.applyConstraints(constraint.fields);
      }
    }
  };
  
  return ConstraintResolver;
});