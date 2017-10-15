/**
* This factory produces a worker object that implements a logReporter and stores
* the reports in a collection.
* @factory
* @param {timestamp} originTimestamp The timestamp recorded at initialization
* @param {object} performance The performace timing object
* @param {object} logReporter The reporter that the log will add a handler to
*/
function _Log(originTimestamp, performance, logReporter) {
  /**
  * The container for the log entries
  * @property
  */
  var log = [];

  /**
  * Adds an entry to the log array
  * @function add
  */
  function handler(msg, level) {
    log.push({
      "timestamp": (originTimestamp + performance.now()) + ''
      , "level": level
      , "message": typeof(msg) === 'string' && msg || JSON.stringify(msg)
    });
  }

  //initialization
  logReporter.addHandler(handler);

  /**
  * @worker
  */
  return Object.create(logReporter, {
    /**
    * Returns the log collection
    * @function
    */
    "entries": {
      "enumerable": true
      , "get": function () { return log; }
    }
  });
};
