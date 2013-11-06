module.exports = function(grunt) {

  var jsFiles = ['lib/bootstrap/js/tooltip.js','js/src/nulib.js'];
  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    prodServer: grunt.file.readJSON('conf/prodServer.json'),
    stagingServer: grunt.file.readJSON('conf/stagingServer.json'),
    devServer: grunt.file.readJSON('conf/devServer.json'),
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
          tasks: ['less:development', 'autoprefixer:dist', 'bless:develop' ],
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
          "dist/css/ie7.css": "less/ie7.less",

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
          ieCompat: true
        },
      }
    },
    sftp: {
      prod: {
        files: {
          "./": "dist/**"
        },
        options: {
          path: '<%= prodServer.path %>',
          host: '<%= prodServer.host %>',
          username: '<%= prodServer.username %>',
          password: '<%= prodServer.password %>',
          srcBasePath: "dist/",
          ignoreErrors: true,
          createDirectories: true,
        },
      },
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
      dev: {
        files: {
          "./": "dist/**"
        },
        options: {
          path: '<%= devServer.path %>',
          host: '<%= devServer.host %>',
          username: '<%= devServer.username %>',
          password: '<%= devServer.password %>',
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
        browsers: ['last 2 version', 'ie 8', 'ie 7', 'ie 9', 'ie 10']
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
    svgmin: {
        options: {
          plugins: [{
            removeViewBox: false
          }]
        },
        dist: {
          files: [{
            expand: true,
            cwd: 'images',
            src: ['**/*.svg'],
            dest: 'dist/images',å
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
      js:{
        files: [
          {src: 'lib/selectivizr/selectivizr.js', dest: 'dist/js/selectivizr.js'},
          {src:'js/vendor/modernizr/modernizr.js', dest: 'dist/js/modernizr.js'}
        ]


      }
    },
    cssmin:{
      minify:{
          expand: true,
          cwd: 'dist/css/',
          //src: ['*.css', '!*.min.css'],
          src: ['*.css',"!*blessed*.css"],

          dest: 'dist/css/',
          // ext: '.min.css'
      }
    },
    bless:{
      files:{
          "dist/css/style.css" : "dist/css/style.css"
      },
      prod:{
        options: {
          compress: true
        }
      },
      develop:{
        options: {
          compress: false
        },
      },
    },
    jade: {
      dev:{
        options: {
          pretty: true,
          data:{
            target: '<%= devServer %>',
          }
        },
        files:[ {
          expand: true,
          flatten: true,
          src: "templates/*.jade",
          ext: ".html",
          dest: 'dist/static_htmls/'
        } ],
      },
      staging:{
        options: {
          pretty: true,
          data:{
            target: '<%= stagingServer %>',
          }
        },
        files:[ {
          expand: true,
          flatten: true,
          src: "templates/*.jade",
          ext: ".html",
          dest: 'dist/static_htmls/'
        } ],
      },
      prod:{
        options: {
          pretty: true,
          data:{
            target: '<%= prodServer %>',
          }
        },
        files:[ {
          expand: true,
          flatten: true,
          src: "templates/*.jade",
          ext: ".html",
          dest: 'dist/static_htmls/'
        } ],
      },
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
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-bless');
  grunt.loadNpmTasks('grunt-contrib-jade');


  // Default task.

  grunt.registerTask('default', ['svgmin', 'imagemin', 'less:production', 'autoprefixer', "cssmin", "bless:prod" , 'concat', 'uglify' , 'copy']);

  grunt.registerTask('deploy-prod', ['default', 'jade:prod' ,'sftp:prod']);
  grunt.registerTask('deploy-staging', ['default', 'jade:staging', 'sftp:staging']);
  grunt.registerTask('deploy-dev', ['default', 'jade:dev' ,'sftp:dev']);

};


