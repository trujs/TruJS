/**
* This factory abstracts the performance object, implementing it based on the
* platform, returning a worker object that exposes the correct now function
* @factory
*/
function _Performance(global) {
  var NS_MS = 1e-6, SEC_MS = 1e-3, func, origin;

  //set the function that will be used
  if (!!global.performance) {
    origin = PerformanceTiming.navigationStart;
    func = performance.now.bind(performance);
  }
  else if (!!global.process) {
    origin = calcNow() - (process.uptime() * SEC_MS);
    func = function now() {
      return calcNow() - origin;
    }
  }
  else {
    origin = Date.now();
    func = function now() {
      return Date.now() - origin;
    }
  }

  /**
  * Calculates the total nanoseconds for the returned hrtime array
  * @function
  */
  function calcNow() {
    var hr = process.hrtime();
    return hr[0] * SEC_MS + hr[1] * NS_MS;
  }

  /**
  * @worker
  */
  return Object.create(null, {
    "now": {
      "enumerable": true
      , "value": func
    }
    , "navigationStart": {
      "enumerable": true
      , "value": origin
    }
  });
}
