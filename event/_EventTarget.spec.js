/**[@test({ "title": "TruJS.event._EventTarget: create an object, add event target, dispatch standard event", "format": "browser" })]*/
function testEventTarget1(arrange, act, assert, callback, mock, module) {
    var _EventTarget, cfg, cnt, mockEvent, mockMouseConst, eventTarget, obj, handler, opts, data;

    arrange(function () {
      _EventTarget = module("TruJS.event._EventTarget");
      //create a mock event
      mockEvent = mock(new MouseEvent('click'))();
      //create a mock mouse event constructor
      mockMouseConst = mockEvent;
      //create the config for the event target
      cfg = {
          "customEvent": callback(mockEvent)
          , "resolver": callback({ "value": mockMouseConst })
      };
      //create the event target
      eventTarget = _EventTarget(cfg.customEvent, cfg.resolver);
      //create each object with the event handler
      obj = Object.create(eventTarget());
      cnt = 0;
      opts = {};
    });

    act(function (done) {
      //create an event handler
      handler = callback(function () {
          cnt++;
          if (cnt > 0) {
              done();
          }
      }, true);

      obj.addEventListener('click', handler, opts);
      obj.dispatchEvent('click', 1);
    });

    assert(function (test) {
      test('The mockMouseConst callback should have been called once').value(mockMouseConst).hasBeenCalled(1);
      test('The mockMouseConst callback first arg should be "click"').value(mockMouseConst).hasBeenCalledWithArg(0, 0, 'click');
      test('The resolver callback should have been called once').value(cfg, 'resolver').hasBeenCalled(1);
      test('The customEvent callback should not have been called').value(cfg, 'customEvent').not().hasBeenCalled();
      test('The handler should have been called only once').value(handler).hasBeenCalled(1);
      test('The handlers first arg should be the mocked event').value(handler).hasBeenCalledWithArg(0, 0, mockEvent.$instance);
    });
}
/**[@test({ "title": "TruJS.event._EventTarget: create an object, add event target, dispatch non-standard event", "format": "browser" })]*/
function testEventTarget2(arrange, act, assert, callback, mock, module) {
    var _EventTarget, cfg, cnt, mockEvent, mockMouseConst, eventTarget, obj, handler, opts, data;

    arrange(function () {
      _EventTarget = module("TruJS.event._EventTarget");
      //create a mock event
      mockEvent = mock(new MouseEvent('bling'))();
      //create a mock mouse event constructor
      mockMouseConst = callback(mockEvent);
      //create the config for the event target
      cfg = {
          "customEvent": callback(mockEvent, false)
          , "resolver": callback(mockMouseConst, false)
      };
      //create the event target
      eventTarget = _EventTarget(cfg.customEvent, cfg.resolver);
      //create each object with the event handler
      obj = Object.create(eventTarget());
      cnt = 0;
      opts = {};
    });

    act(function (done) {
      //create an event handler
      handler = callback(function () {
          cnt++;
          if (cnt > 0) {
              done();
          }
      }, true);
      obj.addEventListener('bling', handler, opts);
      obj.dispatchEvent('bling', 1);
    });

    assert(function (test) {
      test('The mockMouseConst callback should not have been called').value(mockMouseConst).not().hasBeenCalled();
      test('The resolver callback should not have been called').value(cfg, 'resolver').not().hasBeenCalled();
      test('The customEvent callback should have been called once').value(cfg, 'customEvent').hasBeenCalled(1);
      test('The handler should have been called only once').value(handler).hasBeenCalled(1);
      test('The handlers first arg should be the mocked event').value(handler).hasBeenCalledWithArg(0, 0, mockEvent);
    });
}
