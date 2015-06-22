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
mw.onRoll(function($event) {
  //Do something with $event
});
```

# using requireJS
```js
//main.js
define(['./build/MouseWheel', function(MouseWheel) {
  var myElement = document.getElementById('myElement');
  var mw = new MouseWheel(myElement);
  
  //listen for the event
  mw.onRoll(function($event) {
    //Do something with $event
  });
}];
```

# using browserify
```js
  var MouseWheel = require('./build/MouseWheel');
  
  var myElement = document.getElementById('myElement');
  var mw = new MouseWheel(myElement);
  
  //listen for the event
  mw.onRoll(function($event) {
    //Do something with $event
  });
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

# TODO List
* Directive to AngularJS
* jQuery plugin
* Bootstrap module
