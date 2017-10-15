/**
* This factory provides a worker that takes a directory path and finds all files
*   and sub directories within. If the `recurse` option is true sub directories
*   will be traversed as well. Files can be filtered using the `filter` option
*   which should be a comma delimited list of file extensions, with the dot.
*   With the filter option only files that match one of the extensions will be
*   included, all others will be left out.
*
* @factory
*/
function _Directory(nodeFs, nodePath, promise) {

  var defaults = {
    "recurse": false
  };

  /**
  * Produce the options object, adding defaults
  * @function
  */
  function configureOptions(options) {
    //when the options value is `true` create the object with recurse true
    if (options === true) {
      options = {
        "recurse": true
      };
    }
    //when the options value is a string create the object with filter:option
    if (typeof options === "string") {
      options = {
        "filter": options.split(",")
      };
    }
    //otherwise, the options value must be an object
    if (typeof options !== "object") {
      options = {};
    }
    //add the defaults
    applyIf(defaults, options);

    return options;
  }
  /**
  * Starts the
  * @function
  */
  function listDirectory(resolve, reject, dirPath, options) {
    //see if this is a directory
    getStat(dirPath, getStatCb);

    //handle the isDir callback
    function getStatCb(err, path, stat) {
      if (!!err) {
        final(err);
      }
      else if (stat.isDirectory()) {
        //read the path
        readDir(dirPath, options, final);
      }
      else {
        final(null, { "path": dirPath, "isDirectory": false });
      }
    }

    //the final callback
    function final(err, dir) {
      if (!!err) {
        if (err.errno === -4058) {
          resolve({ "path": dirPath, "missing": true });
        }
        else {
          reject(err);
        }
      }
      else {
        resolve(dir);
      }
    }

  }
  /**
  * read the path, determine the type, lookup sub dirs if recurse is true
  * @function
  */
  function readDir(dirPath, options, cb) {
    var len, results = []
    , dir = {
      "path": dirPath
      , "isDirectory": true
    };

    //start the dir read
    nodeFs.readdir(dirPath, readDirCb);

    //handler for the readDir callback
    function readDirCb(err, files) {

      //if there was an error then just run the callback
      if (!!err) {
        cb(err);
        return;
      }

      //record the # of files
      len = files.length;

      //if there are files, get the type for each
      if (len > 0) {
        dir.children = [];
        files.forEach(checkEachFile);
      }
      else {
        dir["isEmpty"] = true;
        cb(null, dir);
      }
    }

    //iterator function to check the file type
    function checkEachFile(file) {
      getStat(nodePath.join(dirPath, file), checkEachFileCb);
    }

    //handler for the file check callback
    function checkEachFileCb(err, curPath, stat) {

      //if there was an error then just run the callback
      if (!!err) {
        cb(err);
        return;
      }

      //if it's not a dir then it's a file so we'll record that
      if (!stat.isDirectory()) {
        var file = null;

        //check the filter
        if (!options.filter || options.filter.indexOf(nodePath.extname(curPath)) !== -1) {
          file = { "path": curPath, "isDirectory": false };
        }
        finished(null, file);
      }
      //if it is a dir then run the readDir, but only if recurse is true
      else if (options.recurse) {
        readDir(curPath, options, finished);
      }
      //a directory but no recurse so don't pass any args
      else {
        finished();
      }

    }

    //handler for the end of the process
    function finished(err, file) {

      //if there was an error then just run the callback
      if (!!err) {
        len = -1; //set this so non of the other callbacks will call cb
        cb(err);
        return;
      }

      //update the results
      if (!!file) {
        dir.children.push(file);
      }

      len--;
      if (len === 0) {
        cb(null, dir);
      }

    }

  }
  /**
  *
  * @function
  */
  function getStat(path, cb) {
    nodeFs.stat(path, function(err, stat) {
      if (!!err) {
        cb(err, path);
      }
      else {
        cb(null, path, stat);
      }
    });
  }

  /**
  * @worker
  */
  return function Directory(path, options) {

    //get the standard options object
    options = configureOptions(options);

    //start the directory listing process
    return new promise(function (resolve, reject) {
      listDirectory(resolve, reject, path, options);
    });

  };
}
