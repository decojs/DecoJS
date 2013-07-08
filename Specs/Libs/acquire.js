
  (function(jasmineEnv, moquire){
    


    var execute_old = jasmineEnv.execute;
    jasmineEnv.execute = function(){
      moquire.then(execute_old.bind(this, arguments));
    }



  })(jasmine.getEnv(), moquire);