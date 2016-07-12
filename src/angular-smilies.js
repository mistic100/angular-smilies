(function (angular) {
    'use strict';

    var module = angular.module('angular-smilies', []);

    /**
     * Smilies and Emojis parser
     * @param config
     * @constructor
     */
    function SmiliesParser (config) {
        this.config = config;
    }

    /**
     * Returns the config
     * @returns {object}
     */
    SmiliesParser.prototype.getConfig = function () {
        return this.config;
    };

    /**
     * Parse a string
     * @param {string} input
     * @returns {string}
     */
    SmiliesParser.prototype.parse = function (input) {
        if (!input) {
            return input;
        }

        // parse smileys names
        var output = this.replaceSmileys(input);

        // parse emojis
        for (var emoji in this.config.emojis) {
            if (this.config.emojis.hasOwnProperty(emoji)) {
                output = this.replaceEmoji(output, emoji);
            }
        }

        return output;
    };

    /**
     * Replace all smilies
     * @param {string} input
     * @returns {string}
     */
    SmiliesParser.prototype.replaceSmileys = function (input) {
        var regex = new RegExp(':(' + this.config.smilies.join('|') + '):', 'g');
        return input.replace(regex, this.config.template);
    };

    /**
     * Replace a particular emoji
     * @param {string} input
     * @param {string} emoji
     * @returns {string}
     */
    SmiliesParser.prototype.replaceEmoji = function (input, emoji) {
        // create a suitable template
        var template = this.config.template.replace(/\$1/g, this.config.emojis[emoji]);

        // escape the emoji for regex usage
        emoji = emoji.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");

        var regex;
        if (/^[a-z]+$/i.test(emoji)) {
            // always use word boundaries if emoji is letters only
            regex = new RegExp('\\b' + emoji + '\\b', 'gi');
        }
        else if (this.config.alwaysUseBoundaries) {
            // word boundaries are not useable with special characters (not words)
            // use a look ahead to not consume the possible space between two consecutive emojis
            regex = new RegExp('(?:^|\\W)' + emoji + '(?=$|\\W)', 'gi');
        }
        else {
            regex = new RegExp(emoji, 'gi');
        }

        return input.replace(regex, template);
    };

    /**
     * @ngdoc provider
     * @name smiliesParser
     * @memberof angular-smilies
     * @description Smilies parser service
     */
    module.provider('smiliesParser', function () {
        var config = {
            main: smiliesConfig.main,
            smilies: smiliesConfig.smilies,
            emojis: smiliesConfig.emojis,
            template: '<i class="smiley-$1" title="$1"></i>',
            alwaysUseBoundaries: false
        };

        /**
         * Ensure that all smileys used by emojis exists
         */
        function checkEmojis () {
            var smiliesMap = {};
            config.smilies.forEach(function (smilies) {
                smiliesMap[smilies] = true;
            });

            for (var emoji in config.emojis) {
                if (config.emojis.hasOwnProperty(emoji) && !smiliesMap[config.emojis[emoji]]) {
                    delete config.emojis[emoji];
                }
            }
        }

        /**
         * Change the main smiley
         * @param {string} main
         */
        this.setMainSmiley = function (main) {
            config.main = main;
        };

        /**
         * Replace the list of smileys
         * @param {string[]} smilies
         */
        this.setSmilies = function (smilies) {
            config.smilies = smilies;
            checkEmojis();
        };

        /**
         * Add a new smiley
         * @param {string} smiley
         */
        this.addSmiley = function (smiley) {
            var idx = config.smilies.indexOf(smiley);
            if (idx === -1) {
                config.smilies.push(smiley);
            }
        };

        /**
         * Remove an existing smiley
         * @param {string} smiley
         */
        this.removeSmiley = function (smiley) {
            var idx = config.smilies.indexOf(smiley);
            if (idx !== -1) {
                config.smilies.splice(idx, 1);
                checkEmojis();
            }
        };

        /**
         * Replace the map of emojis
         * @param {{string: string}} emojis
         */
        this.setEmojis = function (emojis) {
            config.emojis = emojis;
            checkEmojis();
        };

        /**
         * Add a new emoji
         * @param {string} emoji
         * @param {string} smiley
         */
        this.addEmoji = function (emoji, smiley) {
            config.emojis[emoji] = smiley;
            checkEmojis();
        };

        /**
         * Remove and existing emoji
         * @param {string} emoji
         */
        this.removeEmoji = function (emoji) {
            delete config.emojis[emoji];
        };

        /**
         * Set the HTML template
         * @param {string} template
         */
        this.setTemplate = function (template) {
            config.template = template;
        };

        /**
         * Set if the parser must always use word boundaries
         * @param {boolean} use
         */
        this.alwaysUseBoundaries = function (use) {
            config.alwaysUseBoundaries = use;
        };

        /**
         * Returns the service
         * @returns {SmiliesParser}
         */
        this.$get = function () {
            return new SmiliesParser(config);
        };
    });

    /**
     * @ngdoc filter
     * @name smilies
     * @memberof angular-smilies
     * @description Smilies parser filter
     */
    module.filter('smilies', function (smiliesParser) {
        return function (input) {
            return smiliesParser.parse(input);
        };
    });

    /**
     * @ngdoc directive
     * @name smilies
     * @memberof angular-smilies
     * @description Smilies parser directive
     */
    module.directive('smilies', function (smiliesParser) {
        return {
            restrict: 'A',
            scope: {
                source: '=smilies'
            },
            link: function ($scope, el) {
                el.html(smiliesParser.parse($scope.source));
            }
        };
    });

    /**
     * @ngdoc directive
     * @name smiliesSelector
     * @memberof angular-smilies
     * @description Smilies selector directive
     */
    module.directive('smiliesSelector', function ($timeout, smiliesParser) {
        var templateUrl;
        try {
            angular.module('ui.bootstrap.popover');
            templateUrl = 'template/smilies/button-uib.html';
        }
        catch (e) {
            try {
                angular.module('mgcrea.ngStrap.popover');
                templateUrl = 'template/smilies/button-strap.html';
            }
            catch (e) {
                console.error('No Popover module found');
                return {};
            }
        }

        return {
            restrict: 'A',
            templateUrl: templateUrl,
            scope: {
                source: '=smiliesSelector',
                placement: '@smiliesPlacement',
                title: '@smiliesTitle',
                keepOpen: '@smiliesKeepOpen'
            },
            link: function ($scope, el) {
                $scope.config = smiliesParser.getConfig();

                $scope.append = function (smiley) {
                    $scope.source += ' :' + smiley + ':';

                    if (!$scope.placement) {
                        $scope.placement = 'left';
                    }

                    if ($scope.keepOpen === undefined) {
                        $timeout(function () {
                            el.children('i').triggerHandler('click'); // close the popover
                        });
                    }
                };
            }
        };

    });

    /**
     * @ngdoc directive
     * @name focusOnChange
     * @memberof angular-smilies
     * @description Helper directive for input focusing
     */
    module.directive('focusOnChange', function () {
        return {
            restrict: 'A',
            link: function ($scope, el, attrs) {
                $scope.$watch(attrs.focusOnChange, function () {
                    el[0].focus();
                });
            }
        };
    });

    /* register popover templates */
    module.run(function ($templateCache) {
        $templateCache.put('template/smilies/button-uib.html',
            '<i class="smiley-{{config.main}} smilies-selector" ' +
            'uib-popover-template="\'template/smilies/popover-uib.html\'" ' +
            'popover-placement="{{placement}}" ' +
            'popover-trigger="outsideClick" ' +
            'popover-title="{{title}}"></i>'
        );
        $templateCache.put('template/smilies/popover-uib.html',
            '<div ng-model="config.smilies" class="smilies-selector-content">' +
            '<i class="smiley-{{smiley}}" ng-repeat="smiley in config.smilies" ng-click="append(smiley)"></i>' +
            '</div>'
        );
        $templateCache.put('template/smilies/button-strap.html',
            '<i class="smiley-{{config.main}} smilies-selector" bs-popover ' +
            'data-template="template/smilies/popover-strap.html" ' +
            'data-placement="{{placement}}" ' +
            'title="{{title}}"></i>'
        );
        $templateCache.put('template/smilies/popover-strap.html',
            '<div class="popover" tabindex="-1">' +
            '<div class="arrow"></div>' +
            '<h3 class="popover-title" ng-bind="title" ng-show="title"></h3>' +
            '<div class="popover-content">' +
            $templateCache.get('template/smilies/popover-uib.html') +
            '</div>' +
            '</div>'
        );
    });

}(angular));
