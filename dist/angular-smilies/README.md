# AngularJS Smilies filter & directive

## Dependencies
 * [Angular UI (jbruni version)](https://github.com/jbruni/bootstrap-bower-jbruni)
     * Angular Smilies use templatable popovers, which is not yet available in the official release of Angular UI
 * [Angular Sanitize](https://github.com/angular/bower-angular-sanitize)

## Installation
 1. The module is available on Bower. Add `angular-smilies` to your `bower.json` file or install it manually:

    ```
    bower install angular-smilies
    ```
 2. Include `smilies.js`, `angular-sanitize.min.js` and `ui-bootstrap-tpls.min.js` in your application.
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

### Smilies picker
The module includes a smiley selector based on Bootstrap Popover. It allows to display available smilies and append the corresponding code to a model.

Example with Bootstrap forms:
```html
<div class="input-group">
    <input ng-model="newMessage" focus-on-change="newMessage" class="form-control" placeholder="Message...">
    <span class="input-group-addon" smilies-selector="newMessage"></span>
</div>
```

Notice the `focusOnChange` directive which allow to focus the input when the content changes.


## Todo
Grunt task with configurable sprite generator.