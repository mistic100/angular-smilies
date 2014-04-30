# AngularJS Smilies filter & directive

## Dependencies
 * [Angular Sanitize](https://github.com/angular/bower-angular-sanitize) (for the filter)

## Installation
 1. The module is available on Bower. Add `angular-smilies` to your `bower.json` file or install it manually:

    ```
    bower install angular-smilies
    ```
 2. Include `smilies.js` and `angular-sanitize.min.js` in your application.
 3. Include `smilies.css` or `smilies-embed.css`. The embed version contains the smilies sprite coded in base64 where the normal version relies on an external file.
 
## Usage
Add the module to your application:
```javascript
var app = angular.module('app', [/* ... */, 'angular-smilies', 'ngSanitize']);
```
### As filter
The module exposes the `smilies` filter useable with the `ngBindHtml` directive (from _angular-sanitize_):
```html
<div ng-bind-html="message | smilies"></div>
```

### As directive
The module also exposes the `smilies` directive with data binding:
```html
<div smilies="message"></div>
```

## Todo
Grunt task with configurable sprite generator.