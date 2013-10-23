module.exports = function(grunt) {

  var jsFiles = ['lib/bootstrap/js/tooltip.js','js/src/nulib.js'];
  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    stagingServer: grunt.file.readJSON('stagingServer.json'),
    uglify: {
        js: {
          files: {
            'dist/js/sos-app.min.js': jsFiles,
            'dist/js/modernizr.min.js': 'js/vendor/modernizr/modernizr.js',
          },
        },
    },

    watch: {
        less: {
          files: 'less/**/*.less',
          tasks: ['less:development', 'autoprefixer:dist'],
        },
        js:{
          files: 'js/**/*.js',
          tasks: ['concat', 'jshint'],
        },
        images: {
          files: 'images/**/*',
          tasks: ['svgmin','imagemin']
        },
        livereload: {
          files: 'dist/**/*',
          options: {
            livereload: true,
          },
        },
    },
    less: {
      options: {
          paths: ["less/**/*"],
      },
      development: {
        files: {
          "dist/css/style.css": "less/style.less",
          "dist/css/legacy.css": "less/legacy.less",
          "dist/css/alma-styles.css": "less/alma-styles.less",
        },
      },
      production: {
        files: {
          "dist/css/style.css": "less/style.less",
          "dist/css/legacy.css": "less/legacy.less",
          "dist/css/alma-styles.css": "less/alma-styles.less",
          "dist/css/ie7.css": "less/ie7.less",
        },
        options: {
          yuicompress: true,
          report: 'min',
          strictImports: true
        },
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
        force: true,
        formatters: [
          // {id: 'junit-xml', dest: 'report/csslint_junit.xml'},
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
          import: false,
          force: true,
        },
        src: ['dist/css/**/*.css']
      }
    },
    jshint:{
      files: ['js/src/nulib.js', 'Grutfile.js'],
      options: {
        force: true,
        reporter: 'jslint',
        reporterOutput: 'report/jshint.xml',
        globals: {
          jQuery: true,
        },
      },
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 version', 'ie 8', 'ie 7']
      },
      dist: {
        expand: true,
        flatten: true,
        src: 'dist/css/*.css',
        dest: 'dist/css/'
      }
    },
    imagemin: {
      dynamic: {
        files: [{
          expand: true,                  // Enable dynamic expansion
          cwd: 'images/',                   // Src matches are relative to this path
          src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
          dest: 'dist/images'                  // Destination path prefix
        }],
      }
    },
    svgmin: {                       // Task
        options: {                  // Configuration that will be passed directly to SVGO
          plugins: [{
            removeViewBox: false
          }]
        },
        dist: {                         // Target
          files: [{                   // Dictionary of files
            expand: true,           // Enable dynamic expansion.
            cwd: 'images',         // Src matches are relative to this path.
            src: ['**/*.svg'],      // Actual pattern(s) to match.
            dest: 'dist/images',           // Destination path prefix.
          }]
        },
      },
    concat: {
      js: {
        files: {
          'dist/js/sos-app.js': jsFiles,
          'dist/js/respond.min.js': 'lib/respond/respond.min.js'
        },
      },
    },
    copy:{
      html:{
        files: [
          {src: 'static_htmls/*', dest: 'dist/'}
        ]
      },
      js:{
        files: [
          {src: 'lib/selectivizr/selectivizr.js', dest: 'dist/js/selectivizr.js'},
          {src:'js/vendor/modernizr/modernizr.js', dest: 'dist/js/modernizr.js'}
        ]


      }
    }


  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-ssh');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-svgmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');


  // Default task(s).

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('watch-less', ['watch:less']);
  grunt.registerTask('pull-staging', ['sshexec:stagingPull']);
  grunt.registerTask('deploy-staging', ['svgmin', 'imagemin', 'less:production', 'autoprefixer', 'concat', 'uglify' , 'copy', 'sftp:staging']);
};


