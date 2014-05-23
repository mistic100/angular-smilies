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
                spritePath: 'dist/<%= pkg.name %>.png',
                stylesheetPath: 'temp/<%= pkg.name %>.css',
                stylesheet: require('./SpriteStylesheet'),
                layout: 'horizontal',
                stylesheetOptions: {
                    prefix: 'smiley-',
                    spritePath: '<%= pkg.name %>.png'
                },
                compositor: 'gm'
            }
        },

        // encode sprite in base64
        base64: {
            'temp/<%= pkg.name %>.png.b64': 'dist/<%= pkg.name %>.png'
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
                files: [{
                    expand: true, flatten: true,
                    src: ['src/<%= pkg.name %>.js'],
                    dest: 'temp/'
                }]
            },
            css: {
                options: {
                    usePrefix: false,
                    patterns: [{
                        match: '<%= pkg.name %>.png',
                        replacement: 'data:image/png;base64,<%= grunt.file.read("temp/"+ pkg.name +".png.b64") %>'
                    }]
                },
                files: [{
                    expand: true, flatten: true,
                    src: ['dist/<%= pkg.name %>.min.css'],
                    dest: 'dist/',
                    ext: '-embed.min.css'
                }]
            }
        },

        // compress js
        uglify: {
            options: {
                banner: '<%= banner %>\n'
            },
            build: {
                src: 'temp/<%= pkg.name %>.js',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },

        // compress css
        cssmin: {
            normal: {
                options: {
                    banner: '<%= banner %>',
                    keepSpecialComments: 0
                },
                files: {
                    'dist/<%= pkg.name %>.min.css': [
                        'temp/<%= pkg.name %>.css',
                        'src/<%= pkg.name %>.css'
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

    grunt.registerTask('default', [
        'mkdir',
        'spriteGenerator',
        'base64',
        'replace',
        'uglify',
        'cssmin',
        'clean'
    ]);
};