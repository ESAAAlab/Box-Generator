var ee;

function triangulationError(obj) {
  if (invalid.indexOf(obj) == -1) {
    invalid.push(obj);
  }
}

(function(){
    var oldWarn = console.warn;
    console.warn = function (message) {
      // DO MESSAGE HERE.
      if (!globalParameters.debug) {
        oldWarn(message);
      }
      oldWarn.apply(console, arguments);
    };
})();

$(document).ready(function($) {
  if (!globalParameters.debug) {
    ee = new EventEmitter();
    ee.addListener('triangulation-error',triangulationError);
  }
  createGUI();
});