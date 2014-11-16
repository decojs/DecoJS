
jazzmine.requireConfig({
  // Karma serves files from '/base'
  baseUrl: '/base',

  paths: {
    "Mocks": "Specs/Mocks",
    "Given": "Specs/Given",
    "knockout": "bower_components/knockout/dist/knockout"
  },
  packages: [
      { name: 'deco', location: 'Source/deco', main: 'deco' }
  ]
});

ES6Promise.polyfill();

jazzmine.onReady(window.__karma__.start);