/*!
 * Angular Smilies 1.0.0-SNAPSHOT
 * Copyright 2014 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */
(function(){

    var
    smilies = [
        'biggrin', 'confused.', 'cool', 'cry', 'eek', 'evil', 'like',
        'lol', 'love', 'mad', 'mrgreen', 'neutral', 'question', 'razz',
        'redface', 'rolleyes', 'sad', 'smile', 'surprised', 'thumbdown',
        'thumbup', 'twisted', 'wink'
    ],

    shorts = {
        ':D': 'biggrin', ':-D': 'biggrin', ':S': 'confused', ':-S': 'confused',
        ';(': 'cry', ';-(': 'cry', 'OO': 'eek', '<3': 'like', '^^': 'lol',
        ':|': 'neutral', ':-|': 'neutral', ':P': 'razz', ':-P': 'razz',
        ':(': 'sad', ':-(': 'sad', ':)': 'smile', ':-)': 'smile',
        ':O': 'surprised', ':-O': 'surprised', ';)': 'wink', ';-)': 'wink'
    },

    regex = new RegExp(':(' + smilies.join('|') + '):', 'g'),
    template = '<i class="smiley-$1" title="$1"></i>',

    escapeRegExp = function(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    },
    
    regExpForShort = function(str) {
        if (str == 'OO') {
            return /\bOO\b/gi; // lol boobs
        }
        else {
            return new RegExp(escapeRegExp(str), 'gi');
        }
    },

    templateForSmiley = function(str) {
        return template.replace('$1', str);
    },

    apply = function(input) {
        var output = input.replace(regex, template);

        for (var sm in shorts) {
            if (shorts.hasOwnProperty(sm)) {
                output = output.replace(regExpForShort(sm), templateForSmiley(shorts[sm]));
            }
        }

        return output;
    };


    angular.module('angular-smilies', [])
    .filter('smilies', function() {
        return apply;
    })
    .directive('smilies', function() {
        return {
            restrict: 'A',
            scope: {
                source: '=smilies'
            },
            link: function($scope, el, attrs) {
                el.html(apply($scope.source));
            }
        };
    });

}());