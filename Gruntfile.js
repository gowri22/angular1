// Generated on 2016-01-22 using generator-angular 0.15.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Automatically load required Grunt tasks
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin',
    ngtemplates: 'grunt-angular-templates',
    cdnify: 'grunt-google-cdn'
  });

  // Configurable paths for the application
  var bowerConfig =  require('./bower.json');
  var appConfig = {
    app: bowerConfig.appPath || 'app',
    dist: 'builds/' + bowerConfig.name + '-' + bowerConfig.environment + '-' + bowerConfig.version + '-' + bowerConfig.lang
  };
  appConfig.version = bowerConfig.version;

  grunt.loadNpmTasks('grunt-real-favicon');
  grunt.loadNpmTasks('grunt-ng-constant');
  grunt.loadNpmTasks('grunt-banner');

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    root: appConfig,
    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= root.app %>/components/{,*/}*.js', '<%= root.app %>/common/{,*/}*.js'],
        tasks: ['newer:jshint:all', 'newer:jscs:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'newer:jscs:test', 'karma']
      },
      compass: {
        files: ['<%= root.app %>/assets/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'postcss:server']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= root.app %>/**/*.html',
          '.tmp/assets/styles/{,*/}*.css',
          '<%= root.app %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/app/assets/libs',
                connect.static('./app/assets/libs')
              ),
              connect().use(
                '/app/assets/styles',
                connect.static('./app/assets/styles')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/app/assets/libs',
                connect.static('./app/assets/libs')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= root.dist %>'
        }
      }
    },

    // Make sure there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= root.app %>/**/*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Make sure code styles are up to par
    jscs: {
      options: {
        config: '.jscsrc',
        verbose: true
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= root.app %>/**/*.js'
        ]
      },
      test: {
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= root.dist %>/{,*/}*',
            '!<%= root.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    postcss: {
      options: {
        processors: [
          require('autoprefixer-core')({browsers: ['last 1 version']})
        ]
      },
      server: {
        options: {
          map: true
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= root.app %>/index.html'],
        ignorePath: /\.\.\//
      },
      test: {
        devDependencies: true,
        src: '<%= karma.unit.configFile %>',
        ignorePath: /\.\.\//,
        fileTypes: {
          js: {
            block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
            detect: {
              js: /'(.*\.js)'/gi
            },
            replace: {
              js: '\'{{filePath}}\','
            }
          }
        }
      },
      sass: {
        src: ['<%= root.app %>/assets/styles/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= root.app %>/assets/styles',
        cssDir: '.tmp/assets/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= root.app %>/assets/images',
        javascriptsDir: ['<%= root.app %>/components', '<%= root.app %>/common'], //kishore
        fontsDir: '<%= root.app %>/assets/styles/fonts',
        importPath: './app/assets/libs',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/assets/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= root.dist %>/assets/images/generated'
        }
      },
      server: {
        options: {
          sourcemap: true
        }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= root.dist %>/scripts/{,*/}*.js',
          '<%= root.dist %>/assets/styles/{,*/}*.css',
          '<%= root.dist %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= root.dist %>/assets/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= root.app %>/index.html',
      options: {
        dest: '<%= root.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= root.dist %>/{,*/}*.html'],
      css: ['<%= root.dist %>/assets/styles/{,*/}*.css'],
      js: ['<%= root.dist %>/scripts/{,*/}*.js'],
      options: {
        assetsDirs: [
          '<%= root.dist %>',
          '<%= root.dist %>/assets/images',
          '<%= root.dist %>/assets/styles'
        ],
        patterns: {
          js: [[/(assets\/images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']]
        }
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= root.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= root.dist %>/scripts/scripts.js': [
    //         '<%= root.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= root.app %>/assets/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= root.dist %>/assets/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= root.app %>/assets/images',
          src: '{,*/}*.svg',
          dest: '<%= root.dist %>/assets/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true
        },
        files: [{
          expand: true,
          cwd: '<%= root.dist %>',
          src: ['*.html'],
          dest: '<%= root.dist %>'
        }]
      }
    },

    ngtemplates: {
      dist: {
        options: {
          module: 'app',
          htmlmin: '<%= htmlmin.dist.options %>',
          usemin: 'scripts/scripts.js'
        },
        cwd: '<%= root.app %>',
        src: ['components/**/*.html', 'common/**/*.html', 'layout/{,*/}*.html'],
        dest: '.tmp/templateCache.js'
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= root.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= root.app %>',
          dest: '<%= root.dist %>',
          src: [
            '*.{ico,png,txt}',
            '*.html',
            'images/{,*/}*.{webp}',
            'styles/fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= root.dist %>/assets/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: '<%= root.app %>',
          src: 'assets/libs/bootstrap-sass-official/assets/fonts/bootstrap/*',
          dest: '<%= root.dist %>'
        }, {
          expand: true,
          cwd: '<%= root.app %>',
          src: 'assets/libs/font-awesome/fonts/*',
          dest: '<%= root.dist %>'
        }, {
          expand: true,
          cwd: '<%= root.app %>',
          src: 'assets/i18n/*',
          dest: '<%= root.dist %>'
        },{
          expand: true,
          cwd: '<%= root.app %>',
          src: 'assets/webfonts/*',
          dest: '<%= root.dist %>'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= root.app %>/assets/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server'
      ],
      test: [
        'compass'
      ],
      dist: [
        'compass:dist',
        'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    },

    realFavicon: {
      favicons: {
        src: '<%= root.app %>/assets/images/favicon-master.png',
        dest: '<%= root.dist %>',
        options: {
          iconsPath: '/',
          html: [ '<%= root.dist %>/index.html' ],
          design: {
            ios: {
              pictureAspect: 'noChange'
            },
            desktopBrowser: {},
            windows: {
              pictureAspect: 'noChange',
              backgroundColor: '#da532c',
              onConflict: 'override'
            },
            androidChrome: {
              pictureAspect: 'noChange',
              themeColor: '#ffffff',
              manifest: {
                name: 'Square Panda',
                display: 'browser',
                orientation: 'notSet',
                onConflict: 'override',
                declared: true
              }
            },
            safariPinnedTab: {
              pictureAspect: 'blackAndWhite',
              threshold: 75,
              themeColor: '#5bbad5'
            }
          },
          settings: {
            scalingAlgorithm: 'Mitchell',
            errorOnImageTooSmall: false
          }
        }
      }
    },

    // Adds Copyright Banner for Minified Files
    copyright: '/********************************************************************************\n' + 
               ' * Copyright (c) 2017 Square Panda Inc.                                          *\n' +
               ' * All Rights Reserved.                                                          *\n' +
               ' * Dissemination, use, or reproduction of this material is strictly forbidden    *\n' +
               ' * unless prior written permission is obtained from Square Panda Inc.            *\n' +
               ' * version <%= root.version %>                                                   *\n' +
               ' *********************************************************************************/\n',
    usebanner: {
      dist: {
        options: {
          position: 'top',
          banner: '<%= copyright %>',
          linebreak: true
        },
        files: {
          src: [ '<%= root.dist %>/{,*/}*.js', '<%= root.dist %>/assets/styles/{,*/}*.css' ]
        }
      }
    },

    //Set Environments
    ngconstant: {
        // Options for all targets
        options: {
          space: '  ',
          wrap: '"use strict";\n\n {\%= __ngModule %}',
          name: 'config',
        },
        // Environment targets
        dev: {
          options: {
            dest: '<%= root.app %>/common/env-config.js'
          },
          constants: buildConstants ('development', 'https://services-dev.squarepanda.com', 'en', 'UA-81489127-1')
        },
        devCn: {
          options: {
            dest: '<%= root.app %>/common/env-config.js'
          },
          constants: buildConstants ('development', 'https://services-dev.squarepanda.com', 'cn', '')
        },
        qa: {
          options: {
            dest: '<%= root.app %>/common/env-config.js'
          },
          constants: buildConstants ('qa', 'https://services-qa.squarepanda.com', 'en', 'UA-81489127-1')
        },
         qaCn: {
          options: {
            dest: '<%= root.app %>/common/env-config.js'
          },
          constants: buildConstants ('qa', 'https://services-qa.squarepanda.com', 'cn', '')
        },
        prod: {
          options: {
            dest: '<%= root.app %>/common/env-config.js'
          },
          constants: buildConstants ('prod', 'https://services.squarepanda.com', 'en', 'UA-81824186-1')
        }        
      }
  });

  function buildConstants (name, baseUrl, lan, gid) {
    return {
      ENV: {
            name: name,
            apiEndpoint: baseUrl,
            language: lan,
            GoogleAnalyticsId: gid,
            appVersion: bowerConfig.version
          }
    };
  }


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    if (!target) {
        target = 'devCn';
    }

    grunt.task.run([
      'clean:server',
      'ngconstant:' + target,
      'wiredep',
      'concurrent:server',
      'postcss:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });


  grunt.registerTask('test', [
    'clean:server',
    'wiredep',
    'concurrent:test',
    'postcss',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', 'GENERATE BUILD', function (env) {
      if (!env) {
        env = 'dev';
      }

      grunt.task.run([
        'clean:dist',
        'ngconstant:' + env,
        'wiredep',
        'useminPrepare',
        'concurrent:dist',
        'postcss',
        'ngtemplates',
        'concat',
        'ngAnnotate',
        'copy:dist',
        'cdnify',
        'cssmin',
        'uglify',
        'filerev',
        'usemin',
        'htmlmin',
        'realFavicon',
        'usebanner'
      ]);
  });

  grunt.registerTask('default', [
    'newer:jshint',
    'newer:jscs',
    'test',
    'build'
  ]);
};
