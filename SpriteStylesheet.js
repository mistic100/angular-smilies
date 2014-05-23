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

	var css = 
'[class*="'+ options.prefix +'"] { \
	display:inline-block; \
	background-image:url('+ options.spritePath +'); \
	background-position:100px 100px; \
	background-repeat:no-repeat; \
}';
	
	layout.images.forEach(function(image) {
		var imageName = options.nameMapping(image.path),
			className = utils.prefixString(imageName, options);

		css+=
'.'+ className +' { \
	background-position:-'+ image.x +'px -'+ image.y +'px; \
	width:'+ image.width +'px; \
	height:'+ image.height +'px; \
}';
	});

	fs.writeFile(filePath, css, callback);
};