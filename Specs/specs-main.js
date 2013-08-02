var tests = Object.keys(window.__karma__.files).filter(function (file) {
      return /Modules\/.*js$/.test(file);
});


requirejs.config(moquire.config({
    // Karma serves files from '/base'
    baseUrl: '/base',

    paths: {
      "Mocks": "Specs/Mocks",
      "knockout": "bower_components/knockout.js/knockout",
      "ordnung": "Source"
    },

    shim: {
    }
}));

moquire.then(window.__karma__.start);