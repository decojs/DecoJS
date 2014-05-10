var gulp = require('gulp');
var rename = require('gulp-rename');
var concat = require('gulp-concat-sourcemap');
var requirejs = require('gulp-amd-optimizer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');


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


gulp.task('default', ['build'], function(){
    
});

gulp.task('build', function(){
  gulp.src(paths.source)
  .pipe(sourcemaps.init())
    .pipe(requirejs(requirejsOptions))
    .pipe(concat('deco.js', {
      sourcesContent: true,
      prefix: 1
    }))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(paths.dest));
});


//does not work yet, for unknown reasons
gulp.task('minify', function(){
  gulp.src(paths.source)
  .pipe(sourcemaps.init())
    .pipe(requirejs(requirejsOptions))
    .pipe(concat('deco.min.js', {
      sourcesContent: true,
      prefix: 1
    }))
    .pipe(uglify())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(paths.dest));
});