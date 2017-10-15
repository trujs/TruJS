/**
* This factory produces a worker object that provides methods for ioc entries
* @factory
*/
function _Entry() {

  /**
  * Tests whether a value is an entry or not
  * @function
  */
  function isEntry(value) {
    return getEntryType(value) !== 'value';
  }
  /**
  * Tests a value for and ioc entry type and returns that type. Default value is 'value' which means it is not an ioc entry
  * @function getEntryType
  * @param {object|primitive} value The value to be inspected
  */
  function getEntryType(value) {
      if (isArray(value)) {
          if (typeof (value[0]) === 'string') {
              if (isArray(value[1])) {
                  return 'factory';
              }
              else if (value.length === 1 && value[0][0] === '.') {
                  return 'name';
              }
              else if (value.length === 1 && value[0][0] === ':') {
                  return 'eval';
              }
          }
          else if (typeof (value[0]) === 'object' && value.length === 1) {
              return 'object';
          }
      }
      return 'value';
  }
  /**
  *
  * @function
  */
  function parseEntry() {

  }

  /**
  * @worker
  */
  return Object.create(null, {
    "isEntry": {
      "enumerable": true
      , "value": isEntry
    }
    , "getEntryType": {
      "enumerable": true
      , "value": getEntryType
    }
    , "parseEntry": {
      "enumerable": true
      , "value": parseEntry
    }
  });
}
