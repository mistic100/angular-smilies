var fs = require('fs'),
    _ = require('underscore'),
    utils = require('node-sprite-generator/lib/utils/stylesheet');

module.exports = function(layout, filePath, spritePath, options, callback) {
    options = _.extend({}, {
        nameMapping: utils.nameToClass,
        spritePath: utils.getRelativeSpriteDir(spritePath, filePath),
        pixelRatio: 1
    }, options);

    if (!options.prefix) {
        callback('Missing prefix');
    }

    var width = layout.images[0].width,
        height = layout.images[0].height;

    layout.images.every(function(image) {
        if (image.width != width || image.height != height) {
            width = height = false;
            return false;
        }
        return true;
    });

    var css = '\
[class*="'+ options.prefix +'"] {\
    display:inline-block;\
    background-image:url('+ options.spritePath +');\
    background-position:100px 100px;\
    background-repeat:no-repeat;';

    if (width && height) {
        css+= '\
    width:'+ width +'px;\
    height:'+ height +'px;';
    }

    css+= '\
}';

    layout.images.forEach(function(image) {
        var imageName = options.nameMapping(image.path),
            className = utils.prefixString(imageName, options);

        css+= '\
.'+ className +' {\
    background-position:-'+ image.x +'px -'+ image.y +'px;';

        if (!width || !height) {
            css+= '\
    width:'+ image.width +'px;\
    height:'+ image.height +'px;';
        }

        css+= '\
}';
    });

   fs.writeFile(filePath, css, callback);
};