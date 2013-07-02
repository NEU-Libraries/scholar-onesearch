module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'js/src/<%= pkg.name %>.js',
        dest: 'js/build/<%= pkg.name %>.min.js'
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
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Load the plugin that provides recess to compile and lint LESS to CSS
  grunt.loadNpmTasks('grunt-recess');

  // Default task(s).
  grunt.registerTask('default', ['recess']);

};