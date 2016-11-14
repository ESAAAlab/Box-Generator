var gui, ee;

var DEBUG = true;

function triangulationError(obj) {
  if (invalid.indexOf(obj) == -1) {
    invalid.push(obj);
  }
}

(function(){
    var oldWarn = console.warn;
    console.warn = function (message) {
      // DO MESSAGE HERE.
      if (!DEBUG) {
        oldWarn(message);
      }
      oldWarn.apply(console, arguments);
    };
})();


$(document).ready(function($) {
  if (!DEBUG) {
    ee = new EventEmitter();
    ee.addListener('triangulation-error',triangulationError);
  }
  gui = new dat.GUI();
  gui.open();
  initMaterials();
});