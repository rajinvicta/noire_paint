module.exports = (grunt) => {
  grunt.initConfig({
    uglify: {
      options: {
        mangle: true,
        sourceMap: true,
        sourceMapIn: 'js/gzp_paint.js.map'
      },
      js: {
        files: {
          'js/gzp_paint.min.js': ['js/gzp_paint.js']
        }
      }
    },
    browserify: {
      dist: {
        options: {
           transform: [
             ['babelify', {
               plugins: [["@babel/plugin-proposal-class-properties"], ["minify-mangle-names", {eval: true}]],
               presets: [["@babel/preset-env"] ]
               //presets: [["minify", {builtIns: false, evaluate: true, mangle: true}]]
                          }
             ]
           ],
           cacheFile: 'cache.db',
           exclude: ['@hapi/hapi'],
           browserifyOptions: {
            debug: true
          }
        },
        src: ['src/paint.js'],
        dest: 'js/gzp_paint.js',
      }
    },
    connect: {
      server: {
        options: {
          port: 3000,
          hostname: '*',
          onCreateServer: function(server, connect, options) {
            console.log("Listening on port 3000...");
          }
        }
      }
    },
    exorcise: {
      app: {
        options: {},
        files: {
          'js/gzp_paint.js.map':['js/gzp_paint.js'],
        }
      }
    },
    watch: {
      js: {
        files: ['src/**/*.js'],
        //tasks: ['browserify', 'exorcise', 'uglify'],
        tasks: ['browserify', 'exorcise'],
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-exorcise');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-notify');



  //grunt.registerTask('default', ['connect', 'browserify', 'exorcise', 'uglify', 'watch']);
  grunt.registerTask('default', ['connect', 'browserify', 'exorcise', 'watch']);
}
