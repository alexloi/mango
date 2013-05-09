module.exports = function(grunt) {
    grunt.initConfig({
        uglify:{
            mini:{
                src:['assets/javascripts/*.js'],
                dest: 'assets/build/app.min.js'
            },
            /* Add bower js files to minify / concat 
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
            mini: {
                files: {
                    'assets/build/app.min.css':
                    ['assets/stylesheets/*.css']
                }
            }
        },
        watch: {
            javascripts: {
                files: ['assets/javascripts/*.js'],
                tasks: ['uglify:mini'],
                options: {
                    nospawn: true
                }
            },
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
    grunt.loadNpmTasks('grunt-contrib-watch'); 
};