var gulp = require('gulp');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var requirejs = require('gulp-amd-optimizer');
var uglify = require('gulp-uglify');


var minify = true;

var paths = {
    'source': [
        'Source/**/*.js'
    ],
    'specs': [
        'Specs/**/*.js'
    ],
    'dest': 'Dist'
};

var requirejsOptions = {
  baseUrl: "Source",
  
  exclude: [
    "knockout",
    "when/",
    "when"
  ]
};



gulp.task('watch', function() {
    gulp.watch(paths.source, ['build']);
});


gulp.task('default', ['build', 'minify'], function(){
    
});

gulp.task('build', function(){
  gulp.src(paths.source)
  .pipe(requirejs(requirejsOptions))
  .pipe(concat('deco.js'))
  .pipe(gulp.dest(paths.dest));
});

gulp.task('minify', function(){
  gulp.src(paths.dest+'/deco.js')
  .pipe(rename('deco.min.js'))
  .pipe(uglify({outSourceMap: true}))
  .pipe(gulp.dest(paths.dest));
});