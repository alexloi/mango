module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            everything: {
                src:['Gruntfile.js', 'assets/javascripts/*.js', 'assets.javascripts/*/*.js'],
                options: {
                    'undef': true,
                    'unused': true,
                    globals: {
                        jQuery: true,
                        console: true,
                        require: true,
                        module: true
                    }
                }
            }
        },
        uglify:{
            /* Sample minifying / concat task */
            mini:{
                src:['assets/javascripts/*.js'],
                dest: 'assets/build/app.min.js'
            },
            /* 
                Add bower js files to minify / concat 
                Remember: Position is important.
            */
            bower: {
                src: ['assets/components/jquery/jquery.js',
                      'assets/components/angular/angular.js',
                      'assets/components/angular-bootstrap/ui-bootstrap.js'],
                dest: 'assets/build/bower.js'
            }
        },
        cssmin: {
            /* Sample css minification task */
            mini: {
                files: {
                    'assets/build/app.min.css':
                    ['assets/stylesheets/*.css']
                }
            }
        },
        test: {
            /* Sample testing task */
            client: {
                cmd: ''
            },
            server: {
                cmd: './node_modules/.bin/mocha --globals app --reporter spec --timeout 20000 --ui bdd --recursive'
            }
        },
        watch: {
            /* Sample javascript / linting + minifying watcher */
            javascripts: {
                files: ['Gruntfile.js', 'assets/javascripts/*.js'],
                tasks: ['jshint:everything','uglify:mini'],
                options: {
                    nospawn: true
                }
            },
            /* Sample css watcher */
            stylesheets: {
                files: ['assets/stylesheets/*.js'],
                tasks: ['cssmin:mini'],
                options: {
                    nospawn: true
                }
            }
        }
    });
 
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch'); 


    /**
     * `test` is a multi task for separating client and server tests.
     * Configuration is pretty simple as all it needs is a command to run
     * as a child process.
     */
    grunt.registerMultiTask('test', 'run tests', function() {
        var done = this.async();
        // Clear all the files we can in the require cache in case we are run from watch.
        // NB. This is required to ensure that all tests are run and that all the modules under
        // test have been reloaded and are not in some kind of cached state
        for (var key in require.cache) {
            if (require.cache[key]) {
                delete require.cache[key];
                if (require.cache[key]) {
                  console.warn('Mocha grunt task: Could not delete from require cache:\n' + key);
                }
            } else {
            console.warn('Mocha grunt task: Could not find key in require cache:\n' + key);
            }
        }
        require('child_process')
            .exec(this.data.cmd, function(err, stdout){
                grunt.log.write(stdout);
                done(err);
            });
    });
    
};