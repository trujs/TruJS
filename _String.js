/**
* Helper methods for strings
* @factory
*/
function _String(arrayOfType) {

  /**
  * @worker
  */
  return Object.create(null, {
      /**
      * Creates a new string by applying the data to the string
      * @wrench String.prototype.apply
      * @param {Object/Array} data The object that will be used as the data source when updating the string
      * @param {String/Array} [delimiter] Optional. The bounding characters that define a variable in the string
      * @param (Array) [keys] Optional. An array that will receive the keys found in the string
      */
      "apply": {
          "value": function apply(str, data, delimiter, remTag) {
              //set the default delimiter if it's not set
              delimiter = delimiter || ['{:', ':}'];
              if (isNill(remTag)) {
                  remTag = true;
              }
              //ensure the delimiter is an array
              if (!isArray(delimiter)) {
                  delimiter = [delimiter, delimiter];
              }
              //ensure the delimiter is an array of string
              if (arrayOfType(delimiter) !== 'string') {
                  throw new Error('The delimiter must ba a string.');
              }
              //create the reg ex
              var patt = new RegExp(delimiter[0] + '([$.-_A-z0-9]+)' + delimiter[1], 'g');

              //run the replace
              return str.replace(patt, function (val, grp, indx) {
                  //split the grp by .
                  var lookup = grp.split('.')
                  , cur = data
                  ;
                  //loop through the lookup
                  lookup.forEach(function (val, indx) {
                      var i, s, e;
                      //see if this is an array
                      if (val.indexOf('[') !== -1) {
                          i = val.substring(val.indexOf('[') + 1, val.indexOf(']'));
                          val = val.substring(0, val.indexOf('['))
                      }
                      //if the member is missing then set cur to null and exit
                      if (!cur || !cur.hasOwnProperty(val)) {
                          cur = null;
                          return;
                      }
                      //set cur = to the memebr
                      cur = cur[val];
                      //if there is an index from the array then
                      if (!!i) {
                          cur = cur[i];
                      }
                  });
                  //if the cur value is nill make it an empty string
                  if (isNill(cur)) {
                      if (!remTag) {
                          cur = val;
                      }
                      else {
                          cur = '';
                      }
                  }
                  if (isArray(cur) || typeof cur === 'object') {
                      cur = JSON.stringify(cur);
                  }
                  return cur;
              });
          }
      }
      /**
      *
      * @function insert
      * @param {String} val The value to insert
      * @param {Integer} indx The index of the string to insert the val
      */
      , "insert": {
          "value": function insert(str, val, indx) {
              return str.substring(0, indx) + val + str.substring(indx);
          }
      }
      /**
      * Runs the supplied function against the data that does not fall within string delimiters
      * @function String.prototype.update
      * @param {Function} func The function to be ran on the non-string segments
      */
      , "update": {
          "value": function update(str, func, delims) {
              var c, inStr, endChr, cur, newVal = [], val = [];
              //ensure we have delimiter
              delims = delims || { "'": "'", '"': '"' };
              //loop through each character
              for (c = 0; c < str.length; c++) {
                  cur = str[c];
                  //if starting string
                  if (!inStr && delims.hasOwnProperty(cur)) {
                      endChr = delims[cur];
                      inStr = true;
                      //see if there is data to process
                      if (!isEmpty(val)) {
                          //join the value array
                          val = val.join('');
                          //run the function against the value
                          val = func(val, c - val.length);
                          newVal.push(val);
                          val = [];
                      }
                      //push the string character
                      newVal.push(cur);
                  }
                      //in string ending
                  else if (!!inStr && cur === endChr) {
                      inStr = false;
                      newVal.push(cur);
                  }
                  else if (!!inStr) {
                      newVal.push(cur);
                  }
                  else {
                      val.push(cur);
                  }
                  //see if this is the end
                  if (c === str.length - 1) {
                      //see if there is data to process
                      if (!isEmpty(val)) {
                          //join the value array
                          val = val.join('');
                          //run the function against the value
                          val = func(val, c - val.length);
                          newVal.push(val);
                      }
                  }
              }
              //return the newVal
              return newVal.join('');
          }
      }
      /**
      * Splits the string and includes the splitting characters in the array
      * @function String.prototype.split2
      *
      */
      , "split": {
          "value": function split(str, delims) {
              var c, cur, vals = [], val = []
              ;
              //set delims if not set
              delims = delims || [','];
              //ensure the delims is an array
              delims = isArray(delims) && delims || [delims];
              //loop through the string
              for (c = 0; c < str.length; c++) {
                  cur = str[c];
                  if (delims.indexOf(cur) !== -1) {
                      if (!isEmpty(val)) {
                          vals.push(val.join(''));
                          val = [];
                      }
                      vals.push(cur);
                  }
                  else {
                      val.push(cur);
                  }
                  //is this the end
                  if (c === str.length - 1 && !isEmpty(val)) {
                      vals.push(val.join(''));
                  }
              }
              // return the array
              return vals;
          }
      }
      /**
      * Creates a GUID.
      * @function TruJS.newGuid
      * @param {String} isId [Optional] When true the GUID will not start with a number so it can be used as an id in the DOM.
      */
      , "newGuid": {
          "value": function newGuid(isId) {
              //*****************************************************
              //private variables
              var guid = "{0}{1}-{2}-{3}-{4}-{5}{6}{7}"
              , sec, i, b, ch
              ;
              //*****************************************************
              //private methods
              function toHex(val) {
                  return val.toString(16);
              };
              //loop through the 8 sections
              for (i = 0; i < 8; i++) {
                  sec = '';
                  for (b = 0; b < 4; b++) {
                      ch = toHex(Math.floor((Math.random() * 16)));
                      while (i === 0 && b === 0 && !!isId && /^[0-9]$/.test(ch)) {
                          ch = toHex(Math.floor((Math.random() * 16)));
                      }
                      sec += ch
                  }
                  guid = guid.replace('{' + i + '}', sec);
              }
              //return the guid
              return guid;
          }
      }
      /**
      *
      * @function
      * @param {string} val The value to trim
      * @param {string} trim A RegExp fragment that represents the trim character(s).
      * @param {string} dir The side to trim; ["start", "end", "both"]. Default is "both"
      */
      , "trim": {
        "enumerable": true
        , "value": function (val, trim, dir) {
          var pattVal, patt;
          //add the leading
          if (dir !== "end") {
              pattVal = "^(" + trim + ")+";
          }
          //add the trailing
          if (dir !== "start") {
              pattVal = pattVal && (pattVal + "|") || "";
              pattVal += "(" + trim + ")+$";
          }
          //create the reg ex pattern
          patt = new RegExp(pattVal, "g");

          return val.replace(patt, "");
        }
      }
      /**
      * Creates a character array from the input string
      * @function
      * @param {string} val The value to convert to an array
      */
      , "toArray": {
        "enumerable": true
        , "value": function (val) {
          var valArr = [];
          if (!!val) {
            for(var i = 0, l = val.length; i < l; i++){
              valArr[i] = val[i];
            }
          }
          return valArr;
        }
      }
  });
}
