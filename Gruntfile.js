module.exports = function(grunt) {

  var jsFiles = ['js/vendor/modernizr/modernizr.onsearch-build.min.js','bootstrap/dist/js/bootstrap.min.js','js/src/nulib.js' ,'js/src/frbrdisplayimprovements.js'];
  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    stagingServer: grunt.file.readJSON('stagingServer.json'),
    uglify: {
        my_target: {
          files: {
            'dist/js/sos-app.min.js': jsFiles,
          },
        }
    },

    watch: {
        less: {
          files: 'less/**/*.less',
          tasks: 'less:development',
        },
        livereload: {
          files: 'dist/**/*',
          options: {
            livereload: true,
          },
        },
        js:{
          files: 'js/**/*.js',
          tasks: ['uglify', 'jshint']
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
          yuicompress: true,
          report: 'gzip',
          strictImports: true
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
    },

    csslint: {
      options: {
        csslintrc: '.csslintrc',
        formatters: [
          {id: 'junit-xml', dest: 'report/csslint_junit.xml'},
          {id: 'csslint-xml', dest: 'report/csslint.xml'}
        ],
      },
      strict: {
        options: {
          import: 2
        },
        src: ['dist/css/**/*.css']
      },
      lax: {
        options: {
          import: false
        },
        src: ['dist/css/**/*.css']
      }
    },
    jshint:{
      files: ['js/src/nulib.js' ,'js/src/frbrdisplayimprovements.js', 'Grutfile.js'],
      options: {
        force: true,
        reporter: 'jslint',
        reporterOutput: 'report/jshint.xml',
        globals: {
          jQuery: true,
        },
      },
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-ssh');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  // Default task(s).

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('watch-less', ['watch:less']);
  grunt.registerTask('pull-staging', ['sshexec:stagingPull']);
};


