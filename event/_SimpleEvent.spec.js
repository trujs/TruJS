/**[@test({ "title": "TruJS.event._SimpleEvent: unit test", "format": "browser" })]*/
function testSimpleEvent1(arrange, act, assert, module, callback) {
    var eventWorker, setTimeout, eventObj, listener1, listener2, listener3, data1, data2;

    arrange(function () {
        setTimeout = callback(function (fn) {
            fn.apply(null, Array.prototype.slice.call(arguments, 2));
        }, true);
        eventWorker = module(['TruJS.event._SimpleEvent', [, setTimeout]]);
        eventObj = {};
        listener1 = callback();
        listener2 = callback();
        listener3 = callback();
        data1 = {};
        data2 = {};
    });

    act(function () {
        eventWorker(eventObj);

        eventObj.addEventListener('change', listener1);
        eventObj.addEventListener('change', null);
        eventObj.addEventListener('stop', listener2);
        eventObj.addEventListener('stop', listener3);

        eventObj.dispatchEvent('change', data1);
        eventObj.dispatchEvent('stop', data2);

        eventObj.removeEventListener('stop', listener2);

        eventObj.dispatchEvent('stop', data2);
    });

    assert(function (test) {
        test('The listner1 callback should be called').value(listener1).hasBeenCalled(1);
        test('The listner2 callback should be called').value(listener2).hasBeenCalled(1);
        test('The listener3 callback should be called').value(listener3).hasBeenCalled(2);
    });
}
