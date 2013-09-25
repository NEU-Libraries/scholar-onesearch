module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    stagingServer: grunt.file.readJSON('stagingServer.json'),
    uglify: {
        my_target: {
          files: {
            'js/sos-app.min.js': ['js/vendor/modernizr/modernizr.onsearch-build.min.js','bootstrap/dist/js/bootstrap.min.js','js/src/nulib.js' ,'js/src/frbrdisplayimprovements.js']
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
        files: {
            "./css/style.css": "./css/style.css"
        },
    },
    // sshexec: {
    //   gitPull: {
    //     command: 'cd <%= this.path %> && git pull --recurse-submodules=yes -v',
    //   }
    // }
    sshexec: {
        stagingPull: {
           command: 'cd <%= stagingServer.path %> && git pull -v',
           options: {
             host: '<%= stagingServer.host %>',
             username: '<%= stagingServer.username %>',
             password: '<%= stagingServer.password %>'
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
  grunt.registerTask('pull-staging', ['sshexec:stagingPull']);
};


