module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    uglify: {
        my_target: {
          files: {
            'js/sos-app.min.js': ['js/src/bootstrap.js','js/src/nulib.js' ,'js/src/frbrdisplayimprovements.js']
          }
        }
    },
    recess: {
        dist: {
            options: {
                compile: true,
                compress: true
            },
            files: {
                'css/style.css': ['less/style.less']
            }
        }
    },
    watch: {
        files: ['less/*.less'],
        tasks: ['recess']
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // Default task(s).
  grunt.registerTask('default', ['uglify','recess']);
  grunt.registerTask('recess', ['recess']);
  grunt.registerTask('watch', ['watch']);

};
