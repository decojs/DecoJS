
jazzmine.requireConfig({
  // Karma serves files from '/base'
  baseUrl: '/base',

  paths: {
    "Mocks": "Specs/Mocks",
    "Given": "Specs/Given",
    "knockout": "bower_components/knockout.js/knockout",
    "ordnung": "Source"
  },
  packages: [
      { name: 'when', location: 'bower_components/when', main: 'when' }
  ],

  shim: {
  }
});


jazzmine.onReady(window.__karma__.start);