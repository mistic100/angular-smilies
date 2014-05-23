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

    var css = '\n\
[class*="'+ options.prefix +'"] {\n\
    display:inline-block;\n\
    background-image:url('+ options.spritePath +');\n\
    background-position:100px 100px;\n\
    background-repeat:no-repeat;';

    if (width && height) {
        css+= '\n\
    width:'+ width +'px;\n\
    height:'+ height +'px;';
    }

    css+= '\n\
}';

    layout.images.forEach(function(image) {
        var imageName = options.nameMapping(image.path),
            className = utils.prefixString(imageName, options);

        css+= '\n\
.'+ className +' {\n\
    background-position:-'+ image.x +'px -'+ image.y +'px;';

        if (!width || !height) {
            css+= '\n\
    width:'+ image.width +'px;\n\
    height:'+ image.height +'px;';
        }

        css+= '\n\
}';
    });

   fs.writeFile(filePath, css, callback);
};