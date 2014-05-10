var gulp = require('gulp');
//var rename = require('gulp-rename');
var concat = require('gulp-concat');
var requirejs = require('gulp-amd-optimizer');
var uglify = require('gulp-uglify');
//var onlyIf = require('gulp-if');


var minify = true;

var paths = {
    'source': [
        "Source/**/*.js"
    ],
    'specs': [
        'www_source/pages/**/*.js'
    ]
};

var requirejsOptions = {
  baseUrl: "Source",
  //packages: [
  //    { name: 'deco', location: 'Source/deco', main: 'deco' }
  //],
  
  exclude: [
    "knockout",
    "when/",
    "when"
  ]
};



gulp.task('watch', function() {
    gulp.watch(paths.source, ['build']);
});


gulp.task('default', ['build'], function(){
    
});

gulp.task('build', function(){
  gulp.src(paths.source)
  .pipe(requirejs(requirejsOptions))
  .pipe(concat('deco.js'))
  //.pipe(onlyIf(minify, uglify({outSourceMap: true})))
  .pipe(gulp.dest('Dist'));
});