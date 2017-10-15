/**
* Helper methods for objects
* @factory
*/
function _Object() {

  /**
  * @worker
  */
  return Object.create(null, {
      /**
      * Gets a property value of the `obj` using the dot notation path `name`
      * @function lookup
      * @param {object} obj
      * @param {string} name
      * @returns {object} The object that was found or null
      */
      "lookup": {
          "enumerable": true
          , "value": function (obj, name) {
              //get the property reference
              var ref = resolvePath(name, obj);
              //return the value of the reference
              return ref.value;
          }
      }
      /**
      * Checks two objects to see if their members match
      * @function isMatch
      * @param {object} obj1 The first object
      * @param {object} obj2 The second object
      */
      , "isMatch": {
          "enumerable": true
          , "value": function (obj1, obj2) {
              //check the keys
              var keys1 = Object.keys(obj1)
              , keys2 = Object.keys(obj2)
              , key
              ;
              //if the number of keys is unequal then
              if (keys1.length !== keys2.length) {
                  return false;
              }
              //check each key and value
              for (var i = 0; i < keys1.length; i++) {
                  key = keys1[i];
                  //if the keys2 doesn't have the keys1 value
                  if (keys2.indexOf(key) === -1) {
                      return false;
                  }
                  //check the value
                  if (obj1[key] !== obj2[key]) {
                      return false;
                  }
              }
              //if we made it here
              return true;
          }
      }
      /**
      * Runs a for ... in to get all keys, even those on the prototype
      * @function
      */
      , "allKeys": {
          "enumerable": true
          , "value": function (obj) {
              var keys = [];
              for (var key in obj) {
                  keys.push(key);
              }
              return keys;
          }
      }
      /**
      * Creates a deep copy of the `obj`
      * @function
      */
      , "copy": {
          "enumerable": true
          , "value": function (obj) {
              var jsonObj = JSON.stringify(obj);
              return JSON.parse(jsonObj);
          }
      }
  });
}
