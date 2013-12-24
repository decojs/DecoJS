
jazzmine.requireConfig({
  // Karma serves files from '/base'
  baseUrl: '/base',

  paths: {
    "Mocks": "Specs/Mocks",
    "Given": "Specs/Given",
    "knockout": "bower_components/knockout.js/knockout"
  },
  packages: [
      { name: 'when', location: 'bower_components/when', main: 'when' },
      { name: 'deco', location: 'Source/deco', main: 'deco' }
  ]
});


jazzmine.onReady(window.__karma__.start);