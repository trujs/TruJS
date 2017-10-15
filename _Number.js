/**
* Helper methods for numbers
* @factory
*/
function _Number() {

  /**
  * @worker
  */
  return Object.create(null, {
      /**
      * Tests a value if it is an integer
      * @function
      */
      "isInteger": {
          "enumerable": true
          , "value": function (val) {
              if (typeof val === 'string') {
                  return /^[0-9]+$/.test(val);
              }
              else if (typeof val === 'number') {
                  return Math.round(val) === val;
              }
              return false;
          }
      }

  });
}
