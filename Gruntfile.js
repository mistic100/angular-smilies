module.exports = function (grunt) {
    'use strict';

    grunt.util.linefeed = '\n';

    require('time-grunt')(grunt);
    require('jit-grunt')(grunt, {
        spriteGenerator: 'node-sprite-generator'
    });

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: grunt.file.readJSON('src/smilies/config.json'),

        banner: '/*!\n' +
        ' * Angular Smilies <%= pkg.version %>\n' +
        ' * Copyright 2014-<%= grunt.template.today("yyyy") %> Damien "Mistic" Sorel (http://www.strangeplanet.fr)\n' +
        ' * Licensed under MIT (http://opensource.org/licenses/MIT)\n' +
        ' */',

        spriteGenerator: {
            // generate sprite
            sprite: {
                src: ['src/smilies/*.png'],
                spritePath: 'dist/angular-smilies.png',
                stylesheetPath: 'dist/angular-smilies.css',
                stylesheet: 'prefixed-css',
                layout: 'horizontal',
                stylesheetOptions: {
                    prefix: 'smiley-',
                    spritePath: 'angular-smilies.png'
                },
                compositor: 'jimp'
            }
        },

        base64: {
            // encode sprite in base64
            sprite: {
                src: 'dist/angular-smilies.png',
                dest: 'dist/angular-smilies.png.b64'
            }
        },

        replace: {
            // inject smilies config in js file
            js: {
                options: {
                    usePrefix: false,
                    patterns: [{
                        match: "smiliesConfig.main",
                        replacement: '"<%= config.main %>"'
                    }, {
                        match: "smiliesConfig.emojis",
                        replacement: '<%= config.emojis %>'
                    }, {
                        match: "smiliesConfig.smilies",
                        replacement: grunt.file.expandMapping('src/smilies/*.png', '', { flatten: true, ext: '' })
                            .map(function (file) {
                                return file.dest;
                            })
                    }]
                },
                src: 'src/angular-smilies.js',
                dest: 'dist/angular-smilies.js'
            },
            // generate CSS file with base64
            css: {
                options: {
                    usePrefix: false,
                    patterns: [{
                        match: 'angular-smilies.png',
                        replacement: 'data:image/png;base64,<%= grunt.file.read("dist/angular-smilies.png.b64") %>'
                    }]
                },
                src: 'dist/angular-smilies.css',
                dest: 'dist/angular-smilies-embed.css'
            }
        },

        concat: {
            options: {
                banner: '<%= banner %>\n',
                stripBanners: {
                    block: true
                }
            },
            // add banner to JS files
            js: {
                src: 'dist/angular-smilies.js',
                dest: 'dist/angular-smilies.js'
            },
            // concat CSS files and add banner
            css: {
                files: {
                    'dist/angular-smilies.css': [
                        'src/angular-smilies.css',
                        'dist/angular-smilies.css'
                    ],
                    'dist/angular-smilies-embed.css': [
                        'src/angular-smilies.css',
                        'dist/angular-smilies-embed.css'
                    ]
                }
            },
            // add banner to minified CSS
            cssmin: {
                files: [{
                    expand: true,
                    src: ['dist/*.min.css'],
                    dest: ''
                }]
            }
        },

        ngAnnotate: {
            // add safe angular injections
            app: {
                src: 'dist/angular-smilies.js',
                dest: 'dist/angular-smilies.js'
            }
        },

        uglify: {
            // compress js
            options: {
                banner: '<%= banner %>\n'
            },
            build: {
                src: 'dist/angular-smilies.js',
                dest: 'dist/angular-smilies.min.js'
            }
        },

        cssmin: {
            // compress css
            dist: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['dist/*.css', '!dist/*.min.css'],
                    dest: 'dist',
                    ext: '.min.css',
                    extDot: 'last'
                }]
            }
        },

        clean: {
            // remove base64 file
            base64: ['dist/angular-smilies.png.b64']
        },

        jshint: {
            // js tests
            lib: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: ['src/angular-smilies.js', 'Gruntfile.js']
            }
        }
    });

    grunt.registerTask('build_js', [
        'replace:js',
        'concat:js',
        'ngAnnotate',
        'uglify'
    ]);

    grunt.registerTask('build_css', [
        'spriteGenerator',
        'base64:sprite',
        'replace:css',
        'concat:css',
        'cssmin',
        'concat:cssmin',
        'clean:base64'
    ]);

    grunt.registerTask('test', [
        'jshint'
    ]);

    grunt.registerTask('build', [
        'build_js',
        'build_css'
    ]);

    grunt.registerTask('default', [
        'test',
        'build'
    ]);
};