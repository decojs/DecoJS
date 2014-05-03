describe("when applying constraints", ["knockout", "deco/qvc/Validatable", "deco/qvc/koExtensions"], function(ko, Validatable){

  var validatable,
    parameters,
    constraintRules,
    setConstraintssSpy,
    constraintss;
  
  describe("to an validatable with one field", function(){
    
    beforeEach(function(){
      parameters = {
        name: ko.observable("deco")
      }
      validatable = new Validatable("",parameters);
      
      setConstraintssSpy = sinon.spy();
      
      parameters.name.validator = {
        setConstraints: setConstraintssSpy
      };
      
      constraints = [{name: "NotEmpty", attributes:{}}];
      
      constraintRules = [
        {
          name:"name",
          constraints:constraints
        }
      ];
      
      validatable.applyConstraints(constraintRules);
    });
    
    it("should set the constraintss of the field", function(){
      expect(setConstraintssSpy.called).toBe(true);
      expect(setConstraintssSpy.callCount).toBe(1);
    });
    
    it("should set the correct constraint", function(){
      expect(setConstraintssSpy.getCall(0).args[0]).toBe(constraints);
    });
  });
  
  
  describe("to an validatable with nested fields", function(){
  
    beforeEach(function(){
      parameters = {
        address: {
          street: ko.observable("street")
        },
        name: ko.observable("name")
      };
      validatable = new Validatable("",parameters);
      
      setConstraintssSpy = sinon.spy();
      
      parameters.name.validator = {
        setConstraints: setConstraintssSpy
      };
      parameters.address.street.validator = {
        setConstraints: setConstraintssSpy
      };
      
      constraints = [{name: "NotEmpty", attributes:{}}];
      constraintRules = [
        {
          name:"name",
          constraints:constraints
        },
        {
          name:"address.street",
          constraints:constraints
        }
      ];
      
      validatable.applyConstraints(constraintRules);
    });
    
    it("should set the constraintss of the field", function(){
      expect(setConstraintssSpy.called).toBe(true);
      expect(setConstraintssSpy.callCount).toBe(2);
    });
    
    it("should set the correct constraint", function(){
      expect(setConstraintssSpy.getCall(0).args[0]).toBe(constraints);
    });
  });
  
  
  describe("to an validatable with nested fields inside observables", function(){
  
    beforeEach(function(){
      parameters = {
        address: ko.observable({
          street: ko.observable("street")
        }),
        name: ko.observable("name")
      };
      validatable = new Validatable("",parameters);
      
      setConstraintssSpy = sinon.spy();
      
      parameters.name.validator = {
        setConstraints: setConstraintssSpy
      };
      parameters.address().street.validator = {
        setConstraints: setConstraintssSpy
      };
      
      constraints = [{name: "NotEmpty", attributes:{}}];
      constraintRules = [
        {
          name:"name",
          constraints:constraints
        },
        {
          name:"address.street",
          constraints:constraints
        }
      ];
      
      validatable.applyConstraints(constraintRules);
    });
    
    it("should set the constraintss of the field", function(){
      expect(setConstraintssSpy.called).toBe(true);
      expect(setConstraintssSpy.callCount).toBe(2);
    });
    
    it("should set the correct constraint", function(){
      expect(setConstraintssSpy.getCall(0).args[0]).toBe(constraints);
    });
  });
  
  
  describe("to an validatable without the field required", function(){
  
    beforeEach(function(){
      parameters = {
        name: ko.observable("name")
      };
      validatable = new Validatable("",parameters);
      
      parameters.name.validator = {
        setConstraints: function(){}
      };
      
      constraints = [{name: "NotEmpty", attributes:{}}];
      constraintRules = [
        {
          name:"address",
          constraints:constraints
        }
      ];
      
    });
    
    it("to trow an exception", function(){
      expect(function(){
        validatable.applyConstraints(constraintRules);
      }).toThrow(new Error("Error applying constraints to field: address\naddress is not a member of parameters\nparameters = `{\"name\":\"name\"}`"));
    });
  });
  
  describe("to an validatable where the field is not an observable", function(){
  
    beforeEach(function(){
      parameters = {
        name: "name"
      };
      validatable = new Validatable("",parameters);
      
      constraints = [{name: "NotEmpty", attributes:{}}];
      constraintRules = [
        {
          name:"name",
          constraints:constraints
        }
      ];
      
    });
    
    it("to trow an exception", function(){
      expect(function(){
        validatable.applyConstraints(constraintRules);
      }).toThrow(new Error("Error applying constraints to field: name\nIt is not an observable or is not extended with a validator. \nname=`\"name\"`"));
    });
  });
  
  describe("to an validatable where the field is not an observable, but the constraint list is empty", function(){
  
    beforeEach(function(){
      parameters = {
        name: "name"
      };
      validatable = new Validatable("",parameters);
      
      constraints = [];
      constraintRules = [
        {
          name:"name",
          constraints:constraints
        }
      ];
      
    });
    
    it("to trow an exception", function(){
      expect(function(){
        validatable.applyConstraints(constraintRules);
      }).not.toThrow();
    });
  });
});