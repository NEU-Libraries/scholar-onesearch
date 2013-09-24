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
    watch: {
        files: 'less/*.less',
        tasks: 'less:development'
    },
    less: {
      development: {
        options: {
          paths: ["less"]
        },
        files: {
          "css/style.css": "less/style.less"
        }
      },
      production: {
        options: {
          paths: ["less"],
          yuicompress: true
        },
        files: {
          "css/style.css": "less/style.less"
        }
      }
    },

  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  // Default task(s).
  grunt.registerTask('default', ['uglify','less:production']);
  grunt.registerTask('watch-less', ['watch']);
};


