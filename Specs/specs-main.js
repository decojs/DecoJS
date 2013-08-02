var tests = Object.keys(window.__karma__.files).filter(function (file) {
      return /Modules\/.*js$/.test(file);
});


requirejs.config(moquire.config({
    // Karma serves files from '/base'
    baseUrl: '/base/Source',

    paths: {
      "Mocks": "/base/Specs/Mocks",
      "knockout": "/base/bower_components/knockout.js/knockout",
      "ordnung": "/base/Source/ordnung"
    },

    shim: {
    }
}));

moquire.then(window.__karma__.start);