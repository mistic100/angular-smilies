# AngularJS Smilies filter & directive

[![Bower version](https://badge.fury.io/bo/angular-smilies.svg)](http://badge.fury.io/bo/angular-smilies)

## Documentation
http://mistic100.github.io/angular-smilies

## Building
Uses Grunt to build the source. You will need ImageMagick and GraphicsMagick.

```
apt-get install imagemagick
apt-get install graphicsmagick

npm install
grunt
```

The Grunt tasks are:

+ build CSS sprite
+ encode sprite in Base64
+ inject smilies configuration in JS file
+ inject base64 image in CSS file
+ minify CSS and JS files

You can easily change smilies by placing them in the `src/smilies` directory. Currently, only PNG files are supported.

The `config.json` file must be provided, it configure the smiley used for picker button (`main` parameter) and list of custom replacement (`shorts` parameter, can be empty).
