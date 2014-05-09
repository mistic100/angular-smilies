/*!
 * Angular Smilies 1.0.0
 * Copyright 2014 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */
(function(){

    var
    smilies = [
        'biggrin', 'confused', 'cool', 'cry', 'eek', 'evil', 'like',
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
    /* smilies parser filter */
    .filter('smilies', function() {
        return apply;
    })
    /* smilies parser attribute */
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
    })
    /* smilies selector directive */
    .directive('smiliesSelector', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            templateUrl: 'template/smilies/button.html',
            scope: {
                source: '=smiliesSelector',
                placement: '@smiliesPlacement',
                title: '@smiliesTitle'
            },
            link: function($scope, el) {
                $scope.smilies = smilies;
                
                $scope.append = function(smiley) {
                    $scope.source+= ' :'+smiley+': ';
                    
                    $timeout(function() {
                        el.children('i').trigger('click');
                    });
                };
            }
        };
    }])
    /* helper directive for input focusing */
    .directive('focusOnChange', function($timeout) {
        return {
            restrict: 'A',
            link: function($scope, el, attrs) {
                $scope.$watch(attrs.focusOnChange, function() {
                    el[0].focus();
                });
            }
        };
    })
    /* popover template */
    .run(["$templateCache", function($templateCache) {
        $templateCache.put('template/smilies/button.html',
            '<i class="smiley-smile smilies-selector" '+
                'popover-template="template/smilies/popover.html" '+
                'popover-placement="{{!placement && \'left\' || placement}}" '+
                'popover-title="{{title}}"></i>'
        );
        $templateCache.put('template/smilies/popover.html',
            '<div ng-model="smilies" class="smilies-selector-content">'+
              '<i class="smiley-{{smiley}}" ng-repeat="smiley in smilies" ng-click="append(smiley)"></i>'+
            '</div>'
        );
    }]);

}());