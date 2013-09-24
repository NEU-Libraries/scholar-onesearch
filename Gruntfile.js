module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    stagingServer: grunt.file.readJSON('stagingServer.json'),
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
          paths: ["less"],
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
    sftp: {
        stagingServer:{
            files: {
                "./css/style.css": "./css/style.css"
                },
            options: {
                path: '<%= stagingServer.path %>',
                host: '<%= stagingServer.host %>',
                //password: '<%= stagingServer.password %>',
                username: '<%= stagingServer.username %>',

            }
        }
    },
    sshexec: {
      stagingServer: {
        command: 'cd <%= stagingServer.path %> && git pull',
        options: {
          host: '<%= stagingServer.host %>',
          username: '<%= stagingServer.username %>',
          //password: '<%= stagingServer.password %>'
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-ssh');

  // Default task(s).
  grunt.registerTask('default', ['uglify','less:production']);
  grunt.registerTask('watch-less', ['watch']);
};


