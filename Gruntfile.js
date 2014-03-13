// Generated on 2014-03-11 using generator-webapp 0.4.3
'use strict';

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);

  // load tasks on demand (speeds up dev)
  require('jit-grunt')(grunt, {
  });

  grunt.initConfig({
    yeoman: {
      src: 'src',
      app: 'app',
      dist: 'dist',
      pkg: grunt.file.readJSON('package.json')
    },
    watch: {
      /*bdd: {
        files: [
          '<%= yeoman.src %>/rectitle.js',
          'test/spec/test.js'
        ],
        tasks: ['mocha']
      },*/
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/index.html',
          '<%= yeoman.app %>/styles/main.css',
          '<%= yeoman.src %>/rectitle.js',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // change this to '0.0.0.0' to access the server from outside
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          open: true,
          base: [
            '<%= yeoman.app %>'
          ]
        }
      },
      test: {
        options: {
          base: [
            'test',
            '<%= yeoman.app %>'
          ]
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '<%= yeoman.app %>/scripts/**'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.src %>/{,*/}*.js',
        '!<%= yeoman.app %>/scripts/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    },
    mocha: {
      all: {
        options: {
          run: true
        },
        src: ['test/index.html']
      }
    },
    copy: {
      app: {
        src: '<%= yeoman.src %>/rectitle.js',
        dest: '<%= yeoman.app %>/scripts/rectitle.js'
      }
    },
    modernizr: {
      devFile: '<%= yeoman.app %>/bower_components/modernizr/modernizr.js',
      outputFile: '<%= yeoman.app %>/scripts/vendor/modernizr/modernizr.js',
      files: [
        '<%= yeoman.src %>/{,*/}*.js',
        '<%= yeoman.app %>/styles/{,*/}*.css'
      ],
      uglify: true
    },
    concurrent: {
      server: {
        tasks: [
          'copy:app',
          //'modernizr'
        ]
      },
      qa: {
        tasks: [
          'jshint',
          'mocha'
        ]
      },
      build: {
        tasks: [
          'copy:app',
          'uglify'
        ]
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/rectitle.min.js': 'src/rectitle.js'
        }
      }
    }
  });

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }
    else if (target === 'bdd') {
      return grunt.task.run(['watch:bdd']);
    }
    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('test', ['mocha']);
  grunt.registerTask('qa', ['concurrent:qa']);

  grunt.registerTask('build', [
    'clean:dist',
    'concurrent:build'
  ]);

  grunt.registerTask('default', ['build']);

  grunt.registerTask('travis', ['concurrent:qa']);
};
