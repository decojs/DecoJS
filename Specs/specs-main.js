var tests = Object.keys(window.__karma__.files).filter(function (file) {
      return /Modules\/.*js$/.test(file);
});


requirejs.config(moquire.config({
    // Karma serves files from '/base'
    baseUrl: '/base/Source',

    paths: {
      "Mocks": "/base/Specs/Mocks",
      "knockout": "/base/Source/Libs/knockout-2.1.0",
      "ordnung": "/base/Source/ordnung"
    },

    shim: {
    }
}));

moquire.then(window.__karma__.start);