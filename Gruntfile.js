module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bower: {
      //https://github.com/yatskevich/grunt-bower-task
      install: {
        options: {
          copy: false
        }
      }
    },
    requirejs: {
      //https://github.com/gruntjs/grunt-contrib-requirejs
      compile: {
        options: {
          baseUrl: ".",
          out: "Dist/deco.js",
          paths: {
            "knockout": "empty:",
            "when": "empty:"
          },
          packages: [
              { name: 'deco', location: 'Source/deco', main: 'deco' }
          ],
          include: [
            "deco",
            "deco/qvc/constraints/NotEmpty",
            "deco/qvc/constraints/Pattern"
          ],
          
          
          optimize: "none",
          normalizeDirDefines: "all",
          generateSourceMaps: true,
          preserveLicenseComments: false
        }
      }
    },
    uglify: {
      //https://github.com/gruntjs/grunt-contrib-uglify
      my_target: {
        options: {
          sourceMap: 'Dist/deco.min.js.map',
          sourceMapIn: 'Dist/deco.js.map', // input sourcemap from a previous compilation
        },
        files: {
          'Dist/deco.min.js': ['Dist/deco.js']
        }
      }
    },
    karma: {
      //https://github.com/karma-runner/grunt-karma
      unit: {
        configFile: 'karma.conf.js',
        autoWatch: true
      },
      continuous: {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS']
      },
    },
    bumpup: {
      //https://github.com/Darsain/grunt-bumpup
      options: {
          updateProps: {
              pkg: 'package.json'
          }
      },
      files: ['package.json', 'bower.json']
    },
    tagrelease: {
      //https://github.com/Darsain/grunt-tagrelease
      file: 'package.json',
      commit: true
    }
  });

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-bumpup');
  grunt.loadNpmTasks('grunt-tagrelease');

  // Default task(s).
  grunt.registerTask('install', ['bower']);
  grunt.registerTask('build', ['requirejs', 'uglify']);
  grunt.registerTask('test', ['karma:unit']);
  grunt.registerTask('ci-test', ['karma:continuous']);
  grunt.registerTask('default', ['bower', 'requirejs', 'uglify', 'karma:continuous']);
  grunt.registerTask('release', function (type) {
    //grunt release:major|minor|patch
    type = type ? type : 'patch';
    grunt.task.run('karma:continuous');
    grunt.task.run('requirejs');
    grunt.task.run('uglify');
    grunt.task.run('bumpup:' + type);
    grunt.task.run('tagrelease');
  });

};