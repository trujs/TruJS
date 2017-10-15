/**
* Helper methods for arrays
* @factory
*/
function _Array() {

  /**
  * @worker
  */
  return Object.create(null, {
      /**
      * Checks the type of every member of the array and return the common type if there is one
      * @method ofType
      * @param {Array} ar The array to be inspected
      * @returns {string|null} The common type or null
      */
      "ofType": {
          "enumerable": true
          , "value": function ofType(ar) {
              //return null if the array is empty
              if (isEmpty(ar)) {
                  return null;
              }
              //start the type with the first item's type
              var type = getType(ar[0]);
              //inspect each member, return null if we find one that doen't match
              ar.forEach(function (val, indx) {
                  if (getType(ar[indx]) !== type) {
                      type = null;
                  }
              });
              return type;
          }
      }
      /**
      * Returns true if the obj is an array of elements
      * @function
      * @param {Object} obj The object to test
      * @returns {Boolean} True if the object is an array of elements
      */
      , "ofElements": {
          "enumerable": true
          , "value": function ofElements(o) {
              if ((isArray(o) || isCollection(o)) && o.length > 0) {
                  for (var i = 0; i < o.length; i++) {
                      if (!isElement(o[i])) {
                          return false;
                      }
                  }
                  return true;
              }
              return false;
          }
      }

      /**
      * Adds an array's contents to another array without creating a new array
      * @function
      * @param {array} ar The array who's contents will be added to the `target`
      * @param {array} target The target array
      */
      , "addRange": {
          "enumerable": true
          , "value": function addRange(ar, target) {
              if (!!ar) {
                  if (!isArray(ar)) {
                      ar = [ar];
                  }
                  ar.forEach(function arForEach(val) {
                      target.push(val);
                  });
              }
              return target;
          }
      }
      /**
      * Converts an arguments object to an array
      * @function
      * @param {arguments} args The arguments object
      * @param {number} [start] Optional. The starting index
      * @param {number} [end] Optional
      */
      , "fromArguments": {
          "enumerable": true
          , "value": function fromArguments(args, start, end) {
              return Array.prototype.slice.apply(args, [start, end]);
          }
      }
      /**
      * Combines 2 arrays, ensuring not to duplicate any values. A non-array value in either parameter will result in an exception being thrown
      * @method union
      * @param {Array} ar1 The first array to be unionized.
      * @param {Array} ar2 The second array to be unionized.
      */
      , "union": {
          "enumerable": true
          , "value": function union(ar1, ar2) {
              //ensure we are working with arrays
              if (!isArray(ar1) || !isArray(ar2)) {
                  throw new Error('The parameters must be of type array to union them.');
              }
              //deep copy the ar1
              ar1 = ar1.slice();
              //if ar2 is empty then return the deep copy
              if (!ar2) {
                  return ar1;
              }
              //loop through ar2
              for (var i = 0; i < ar2.length; i++) {
                  //see if the value in ar2[i] is alreay a member of ar1
                  if (ar1.indexOf(ar2[i]) === -1) {
                      ar1.push(ar2[i]);
                  }
              }
              return ar1;
          }
      }
      /**
      * Executes a minus operation between 2 arrays
      * @method minus
      * @param {Array} ar1 The first array to be minusized.
      * @param {Array} ar2 The second array to be minusized.
      */
      , "minus": {
          "enumerable": true
          , "value": function minus(ar1, ar2) {
              //get everything from ar1 that's not in ar2
              var ar3 = ar1.filter(function (val) {
                  return ar2.indexOf(val) === -1;
              })
              , ar4 = ar2.filter(function (val) {
                  return ar1.indexOf(val) === -1;
              })
              ;
              //now combine the arrays
              return ar3.concat(ar4);
          }
      }
      /**
      * Tests the contents of 2 arrays to see if they have at least one shared member
      * @method contains
      * @param {Array} ar1 The first array to be checked.
      * @param {Array} ar2 The second array to be checked.
      */
      , "contains": {
          "enumerable": true
          , "value": function contains(ar1, ar2) {
              for (var i = 0; i < ar1.length; i++) {
                  if (ar2.indexOf(ar1[i]) !== -1) {
                      return true;
                  }
              }
              return false;
          }
      }
      /**
      * Tests the contents of `ar2` to see if all of it's member appear in `ar2`
      * @method containsAll
      * @param {Array} ar1 The first array to be checked.
      * @param {Array} ar2 The second array to be checked.
      */
      , "containsAll": {
          "enumerable": true
          , "value": function containsAll(ar1, ar2) {
              //loop through ar2 and check each member
              for (var i = 0; i < ar2.length; i++) {
                  if (ar1.indexOf(ar2[i]) === -1) {
                      return false;
                  }
              }
              //if we made it here then they all match
              return true;
          }
      }
      /**
      *
      * @function
      * @param {Array} ar The array to inspect
      * @param {value} [pruneVal] Optional. The value to prune from the array. Defaults to undefined
      */
      , "prune": {
          "enumerable": true
          , "value": function prune(ar, pruneVal) {
              return ar.filter(function arFilter(val) {
                  return pruneVal !== val;
              });
          }
      }
  });
}
