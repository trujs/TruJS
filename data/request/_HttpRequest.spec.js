/**[@test({ "title": "TruJS.data.request._HttpRequest: unit test", "format": "browser" })]*/
function dataRequest(arrange, act, assert, callback, mock, xmlHttpRequest, module) {
  var xhr, sendFn, errFn, httpRequest, request, cb, err;

  arrange(function () {
    xhr = xmlHttpRequest();
    httpRequest = module("TruJS.data.request._HttpRequest")(xhr);
    request = {
        "url": 'https://host/path/file.json?name=value'
        , "timeout": 300
        , "headers": {
            "Content-Type": 'plain/text'
        }
        , "payload": {

        }
    };
    cb = callback();
    err = callback();
    xhr.send.setResponse(function (data) {
        if (xhr.send.callbackCount < 2) {
            if (xhr.send.callbackCount === 1) {
                xhr.response = '';
                xhr.status = 200;
                xhr.statusText = 'OK';
            }
            else {
                xhr.response = null;
                xhr.status = 400;
                xhr.statusText = 'BAD REQUEST';
            }
            sendFn.apply(xhr);
        }
        else {
            errFn.apply(xhr);
        }
    });
    xhr.addEventListener.setResponse(function (event, func) {
        if (event === 'load') {
            sendFn = func;
        }
        else {
            errFn = func;
        }

    });
  });

  act(function () {
    httpRequest(request, cb, err);
    httpRequest(request, cb, err);
    httpRequest(request, cb, err);
  });

  assert(function (test) {
    test('The constructor should be called').value(xhr).hasBeenCalled(3);
    test('The responseType should be set to').value(xhr, '$instance.responseType').equals('json');
    test('The timeout should be').value(xhr, '$instance.timeout').equals(300);
    test('The setRequestHeader should be called').value(xhr, 'setRequestHeader').hasBeenCalled(3);
    test('The 1st arg of the first setRequestHeader call').value(xhr, 'setRequestHeader').hasBeenCalledWithArg(0, 0, 'Content-Type');
    test('The 2nd arg of the first setRequestHeader call').value(xhr, 'setRequestHeader').hasBeenCalledWithArg(0, 1, 'plain/text');
    test('The open callback should be called').value(xhr, 'open').hasBeenCalled(3);
    test('The send callback should be called').value(xhr, 'send').hasBeenCalled(3);
    test('The 1st arg of the send callback should be').value(xhr, 'send').hasBeenCalledWithArg(0, 0, request.payload);

    test('The cb callback should be called').value(cb).hasBeenCalled(1);
    test('The err callback should be called').value(err).hasBeenCalled(2);
  });
}
