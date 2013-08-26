
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
      { name: 'when', location: 'node_modules/when', main: 'when' }
  ],

  shim: {
  }
});


jazzmine.onReady(window.__karma__.start);