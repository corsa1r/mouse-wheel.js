# mouse-wheel.js
This is a javascript class which handles native mouse wheel events and fires an custom output event.

#how to use

```js
//create instance of the class
var myElement = document.getElementById('myElement');
var mw = new MouseWheel(myElement);

//listen for the event
mw.onRoll(function($event) {
  //Do something with $event
});
```
