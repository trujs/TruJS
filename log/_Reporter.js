/**
* This factory produces a worker object that is used to add handlers and to
* report progress in the process
*
* @factory
*/
function _Reporter(isInteger) {
  /**
  * Represents the public object for reference instead of `this`
  * @property
  */
  var self
  /**
  * Stores the report handlers
  * @property
  */
  , handlers = []
  /**
  * The levels that will fire the handlers
  * @property
  */
  , levels = ["info","error","stack"]
  ;

  /**
  * @worker
  */
  return self = Object.create(null, {
    "addHandler": {
      "enumerable": true
      , "value": function addHandler(handler) {
        handlers.push(handler);
      }
    }
    , "setLevels": {
      "enumerable": true
      , "value": function setLevel(value) {
        if (!isArray(value)) {
            value = value.split(",");
        }
        levels = value;
      }
    }
    , "report": {
      "enumerable": true
      , "value": function report(level, msg) {
        //test to see if we are reporting this level
        if (levels.indexOf(level) === -1 && levels.indexOf("all") === -1) {
          return;
        }
        //loop through each handler and execute each one
        handlers.forEach(function forEachHandler(handler) {
          handler(msg, level);
        });
      }
    }
    , "info": {
      "enumerable": true
      , "value": function info(msg) {
        self.report("info", msg);
      }
    }
    , "extended": {
      "enumerable": true
      , "value": function extended(msg) {
        self.report("extended", msg);
      }
    }
    , "metric": {
      "enumerable": true
      , "value": function metric(msg) {
        self.report("metric", msg);
      }
    }
    , "warning": {
      "enumerable": true
      , "value": function warning(msg) {
        self.report("warning", msg);
      }
    }
    , "error": {
      "enumerable": true
      , "value": function error(err) {
        if (!!err.message) {
          self.report("error", err.message);
          self.report("stack", err.stack);
        }
        else {
          self.report("error", err);
        }
      }
    }
  });
}
