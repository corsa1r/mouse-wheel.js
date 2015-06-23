# mouse-wheel.js
This is a javascript class which handles native mouse wheel events and fires an custom output event.

#how to use by default

index.html
```html
<html>
  <head>
    <title>Mouse Wheel event handler</title>
    <script src="./build/MouseWheel.min.js"></script>
  </head>
  <body>
    <div id="myElement"></div>
  </body>
</html>
```

```js
//create instance of the class
var myElement = document.getElementById('myElement');
var mw = new MouseWheel(myElement);

//listen for the event
mw.on('roll', function($event) {
  //Do something with $event for both scroll directions
});
mw.on('roll.up', function($event) {
  //Do something with $event for up scroll direction only
});
mw.on('roll.down', function($event) {
  //Do something with $event for down scroll direction only
});
```

#using AngularJS
index.html
```html
<div mw-roll="onScroll" ng-repeat="item in items">
  {{item}} scroll
</div>
<div mw-roll="onScroll" mw-direction="roll.up" ng-repeat="item in items">
  {{item}} scroll up
</div>
<div mw-roll="onScroll" mw-direction="roll.down" ng-repeat="item in items">
  {{item}} scroll down
</div>
```
main.js
```js
  /**
   * This method will be called automatically when you scroll over the $target element
   * @param {Object} $event - this is OutputMouseWheel event
   * @param {Object} $target - this is target element wraped by angular.element()
   * */
  $scope.onScroll = function($event, $target) {
    //Do something with $target and $event data
  };
```

# using requireJS
```js
//main.js
define(['./build/MouseWheel', function(MouseWheel) {
  var myElement = document.getElementById('myElement');
  var mw = new MouseWheel(myElement);
  
  //listen for the event as native example
}];
```

# using browserify
```js
  var MouseWheel = require('./build/MouseWheel');
  
  var myElement = document.getElementById('myElement');
  var mw = new MouseWheel(myElement);
  
  //listen for the event as native example
```

# Explore the output event
```js
var OutputWheelEvent = {
  direction : String,// This is the scroll direction ['up', 'down']
  time      : Number,// Current timestamp of the event creation
  isNew     : Boolean,//This is true when the event is fired for the first time or scroll direction is changed
  delta     : Number// This is delta time in miliseconds between current and last output event
};
```