module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bower: {
      install: {
        options: {
          copy: false
        }
      }
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: ".",
          out: "Dist/ordnung.js",
          paths: {
            "knockout": "empty:",
            "ordnung": "Source"
          },
          packages: [
              { name: 'when', location: 'node_modules/when', main: 'when' }
          ],
          include: [
            "ordnung/qvc",
            "ordnung/spa",
            "ordnung/proclaimWhen",
            "ordnung/utils",
            "ordnung/ajax"
          ],
          
          
          optimize: "none",
          generateSourceMaps: true,
          preserveLicenseComments: false
        }
      }
    },
    uglify: {
      my_target: {
        options: {
          sourceMap: 'Dist/ordnung.min.js.map',
          sourceMapIn: 'Dist/ordnung.js.map', // input sourcemap from a previous compilation
        },
        files: {
          'Dist/ordnung.min.js': ['Dist/ordnung.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['bower', 'requirejs', 'uglify']);

};