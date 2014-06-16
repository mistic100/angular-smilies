module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: grunt.file.readJSON('src/smilies/config.json'),

        banner:
            '/*!\n'+
            ' * Angular Smilies <%= pkg.version %>\n'+
            ' * Copyright <%= grunt.template.today("yyyy") %> Damien "Mistic" Sorel (http://www.strangeplanet.fr)\n'+
            ' * Licensed under MIT (http://opensource.org/licenses/MIT)\n'+
            ' */',

        // create output dirs
        mkdir: {
            all: {
                options: {
                    create: ['temp', 'dist']
                }
            }
        },

        // generate sprite
        spriteGenerator: {
            sprite: {
                src: ['src/smilies/*.png'],
                spritePath: 'dist/angular-smilies.png',
                stylesheetPath: 'temp/smilies-sprite.css',
                stylesheet: 'prefixed-css',
                layout: 'horizontal',
                stylesheetOptions: {
                    prefix: 'smiley-',
                    spritePath: 'angular-smilies.png'
                },
                compositor: 'gm'
            }
        },

        // encode sprite in base64
        base64: {
            sprite: {
                files: {
                    'temp/angular-smilies.png.b64': [
                        'dist/angular-smilies.png'
                    ]
                }
            }
        },

        // inject smilies config in js file
        replace: {
            js: {
                options: {
                    usePrefix: false,
                    patterns: [{
                        match: "smiliesConfig.main",
                        replacement: '"<%= config.main %>"'
                    }, {
                        match: "smiliesConfig.shorts",
                        replacement: '<%= config.shorts %>'
                    }, {
                        match: "smiliesConfig.smilies",
                        replacement:
                            grunt.file.expandMapping('src/smilies/*.png', '', {
                                flatten: true, ext: ''
                            })
                            .map(function(file) {
                                return file.dest;
                            })
                    }]
                },
                files: {
                    'temp/angular-smilies.js': [
                        'src/angular-smilies.js'
                    ]
                }
            },
            css: {
                options: {
                    usePrefix: false,
                    patterns: [{
                        match: 'angular-smilies.png',
                        replacement: 'data:image/png;base64,<%= grunt.file.read("temp/angular-smilies.png.b64") %>'
                    }]
                },
                files: {
                    'temp/smilies-sprite-embed.css': [
                        'temp/smilies-sprite.css'
                    ],
                }
            }
        },

        // concat/copy files
        concat: {
            options: {
                banner: '<%= banner %>\n',
                stripBanners: {
                    block: true
                }
            },
            src: {
                files: {
                    'dist/angular-smilies.css': [
                        'src/angular-smilies.css',
                        'temp/smilies-sprite.css'
                    ],
                    'dist/angular-smilies-embed.css': [
                        'src/angular-smilies.css',
                        'temp/smilies-sprite-embed.css'
                    ],
                    'dist/angular-smilies.js': [
                        'temp/angular-smilies.js'
                    ]
                }
            }
        },

        // compress js
        uglify: {
            options: {
                banner: '<%= banner %>\n'
            },
            build: {
                src: 'dist/angular-smilies.js',
                dest: 'dist/angular-smilies.min.js'
            }
        },

        // compress css
        cssmin: {
            options: {
                banner: '<%= banner %>',
                keepSpecialComments: 0
            },
            dist: {
                files: {
                    'dist/angular-smilies.min.css': [
                        'dist/angular-smilies.css'
                    ],
                    'dist/angular-smilies-embed.min.css': [
                        'dist/angular-smilies-embed.css'
                    ]
                }
            }
        },

        // remove temp dir
        clean: {
            temp: ['temp']
        }
    });

    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('node-sprite-generator');
    grunt.loadNpmTasks('grunt-base64');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', [
        'mkdir',
        'spriteGenerator',
        'base64',
        'replace',
        'concat',
        'uglify',
        'cssmin',
        'clean'
    ]);
};