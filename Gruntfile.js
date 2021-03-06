/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;' +
      ' Licensed <%= pkg.license %> */\n',
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: '<%= Path.js.dist + "/" + pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
        devel: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: false,
        boss: true,
        eqnull: true,
        browser: true,
        esnext: true,
        globals: {
          require: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      dev_test: {
        src: [ 'js/**/*.js' ]
      },
      dist_test: {
        src: [ 'js/**/*.min.js']
      }
    },
    babel: {
      options: {
        plugins: ['transform-react-jsx'],
        presets: ['es2015', 'react']
      },
      jsx: {
        files: [{
          expand: true,
          cwd: 'js', // Custom folder
          src: ['**/*.{jsx,js}'],
          dest: 'dist/js/', // Custom folder
          ext: '.js'
        }]
      }
    },
    browserify: {
      all: {
        src: 'dist/js/configbuilder/**/*.js',
        dest: 'dist/js/bundle.js'
      }
    },
    sass: {
      configbuilder: {
        options: {
          style: 'expanded'
        },
        files: [{
          expand: true,
          cwd: 'scss',
          src: '**/*.scss',
          dest: 'dist/css/buildconfig',
          ext: '.css'
        }]
      }
    },
    postcss: {
      options: {
          proseccors: [require('autoprefixer')({browsers: 'last 2 versions'})]
        },
        dist: {
          src: 'dist/css/**/*.css'
        }
    },
    watch: {
      options: {
        livereload: true
      },
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      js: {
        files: ['js/**/*.js'],
        tasks: ['jshint']
      },
      jsx: {
        files: ['js/**/*.jsx'],
        tasks: ['babel']
      },
      bundle: {
        files: 'dist/js/configbuilder/**/*.js',
        tasks: ['browserify']
      },
      html: {
        files: ['**/*.html']
      },
      css: {
        files: ['*.css']
      },
      scss: {
        files: 'scss/**/*.scss',
        tasks: ['sass', 'postcss']
      }
    }
  });

  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt);

  // Default task.
  grunt.registerTask('default', ['jshint', 'sass', 'postcss', 'babel', 'browserify']);

};
