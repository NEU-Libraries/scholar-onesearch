module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    stagingServer: grunt.file.readJSON('stagingServer.json'),
    uglify: {
        my_target: {
          files: {
            'dist/js/sos-app.min.js': ['js/vendor/modernizr/modernizr.onsearch-build.min.js','bootstrap/dist/js/bootstrap.min.js','js/src/nulib.js' ,'js/src/frbrdisplayimprovements.js']
          }
        }
    },

    watch: {
        less: {
          files: 'less/*.less',
          tasks: 'less:development',
        },
        livereload: {
          files: 'dist/css/**',
          options: {
            livereload: true,
          },

        }
    },
    less: {
      development: {
        options: {
          paths: ["less"],

        },
        files: {
          "dist/css/style.css": "less/style.less"
        }
      },
      production: {
        options: {
          paths: ["less"],
          yuicompress: true
        },
        files: {
          "dist/css/style.css": "less/style.less"
        }
      }
    },
    sshexec: {
        stagingPull: {
           command: 'cd <%= stagingServer.path %> && git pull -v',
           options: {
             host: '<%= stagingServer.host %>',
             username: '<%= stagingServer.username %>',
             password: '<%= stagingServer.password %>'
           }
         }
       },
    sftp: {
      staging: {
        files: {
          "./": "dist/**"
        },
        options: {
          path: '<%= stagingServer.path %>',
          host: '<%= stagingServer.host %>',
          username: '<%= stagingServer.username %>',
          password: '<%= stagingServer.password %>',
          srcBasePath: "dist/",
          ignoreErrors: true,
          createDirectories: true,
        },
      },
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
  grunt.registerTask('watch-less', ['watch:less']);
  grunt.registerTask('pull-staging', ['sshexec:stagingPull']);
};


