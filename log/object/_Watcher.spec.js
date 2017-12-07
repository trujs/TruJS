/**[@test({ "label": "watcherHelper", "type": "factory" })]*/
function setupWatcherHelper() {
    return {
        "obj": {
            "key1": 'default1'
            , "key2": 'default2'
            , "key3": {
                "key31": 'default3.1'
                , "key32": {
                    "key321": 'default3.2.1'
                }
            }
            , "key5": {
                "key51": 'default5.1'
            }
            , "key6": 'default6'
        }
    };
}
/**[@test({ "title": "TruJS.object.Watcher: unit test" })]*/
function testWatcher1(arrange, act, assert, callback, watcherHelper, module) {
    var watcherWorker, watcher, listener;

    arrange(function () {
        listener = callback();
        watcherWorker = module(['TruJS.object._Watcher', []]);
    });

    act(function () {
        watcher = watcherWorker(watcherHelper.obj, listener);
        watcher["key4"] = 'value4';
        watcher.$process();
        watcher.key1 = 'value1';
        watcher.key3.key32.key321 = "value3.2.1";
    });

    assert(function (test) {
        test('The listener should be called').value(listener).hasBeenCalled(3);
        test('The watcherHelper Obj key1 should be').value(watcherHelper, 'obj.key1').equals('value1');
        test('The watcherHelper Obj should have property').value(watcherHelper, 'obj').hasProperty('key3');
    });
}
/**[@test({ "title": "TruJS.object.Watcher: functional test" })]*/
function testWatcher2(arrange, act, assert, callback, module, watcherHelper) {
    var watcherWorker, watcher, listener, cnt, isWatcher;

    arrange(function () {
        watcherWorker = module(['TruJS.object._Watcher', []]);
        isWatcher = watcherWorker.isWatcher;
        cnt = 0;
    });

    act(function (done) {
        listener = callback(function () {
            cnt++;
            if (cnt === 6) {
                done(1);
            }
        }, true);
        watcher = watcherWorker(watcherHelper.obj, listener);
        watcher["key4"] = 'value4'; // test adding a new  key
        watcher.key1 = 'value1'; // test setting an existing key
        watcher.key3.key32.key321 = "value3.2.1"; // test setting an existing key on a child object
        watcher.key3["key33"] = "value3.3"; // test setting a new key on a child object
        watcher.$process(); // test the processing of new keys

        watcher.key5 = 'value4'; // test setting an existing object value to a non-object value
        watcher.key6 = { //test setting a non-object value to an object value
            "key61": 'value6.1'
        };
    });

    assert(function (test, getValue) {
        test('The key3 object should not be a watcher')
            .run(isWatcher, [getValue(watcherHelper, 'obj.key3')])
            .isFalse();
        test('The key3.key32 object should not be a watcher')
            .run(isWatcher, [getValue(watcherHelper, 'obj.key3.key32')])
            .isFalse();

        test('The listener callback should be called').value(listener).hasBeenCalled(6);

        test('The 1st listener callback key should be').value(listener).hasBeenCalledWithArg(0, 0, 'key1');
        test('The 1st listener callback oldValue should be').value(listener).hasBeenCalledWithArg(0, 1, 'default1');
        test('The 1st listener callback newValue should be').value(listener).hasBeenCalledWithArg(0, 2, 'value1');

        test('The 2nd listener callback key should be').value(listener).hasBeenCalledWithArg(1, 0, 'key3.key32.key321');
        test('The 2nd listener callback oldValue should be').value(listener).hasBeenCalledWithArg(1, 1, 'default3.2.1');
        test('The 2nd listener callback newValue should be').value(listener).hasBeenCalledWithArg(1, 2, 'value3.2.1');

        test('The 3rd listener callback key should be').value(listener).hasBeenCalledWithArg(2, 0, 'key4');
        test('The 3rd listener callback oldValue should be').value(listener).hasBeenCalledWithArg(2, 1, getValue(undefined));
        test('The 3rd listener callback newValue should be').value(listener).hasBeenCalledWithArg(2, 2, 'value4');

        test('The 4th listener callback key should be').value(listener).hasBeenCalledWithArg(3, 0, 'key3.key33');
        test('The 4th listener callback oldValue should be').value(listener).hasBeenCalledWithArg(3, 1, getValue(undefined));
        test('The 4th listener callback newValue should be').value(listener).hasBeenCalledWithArg(3, 2, 'value3.3');

        test('The key5 watcher value should not be a watcher object').run(isWatcher, [getValue(watcher, 'key5')]).isFalse();
        test('The key6 watcher value should be a watcher object').run(isWatcher, [getValue(watcher, 'key6')]).isTrue();
    });
}
/**[@test({ "title": "TruJS.object.Watcher: stress test" })]*/
function testWatcher3(arrange, act, module) {
    var watcherWorker, watcher, obj;

    arrange(function () {
        watcherWorker = module(['TruJS.object._Watcher', []]);
        //create a very large object chain
        obj = {};
        var cur = obj;
        for (var i = 0; i < 1000; i++) {
            cur["obj"] = {};
            cur = cur["obj"];
            for (var c = 0; c < 20; c++) {
                cur["test" + c] = "value" + c;
            }
        }
    });

    act(function () {
        watcher = watcherWorker(obj);
    });
}
/**[@test({ "title": "TruJS.object.Watcher: stress test 2" })]*/
function testWatcher4(arrange, act, assert, module, callback) {
    var watcherWorker, watcher, obj, listener, cnt;

    arrange(function () {
        watcherWorker = module(['TruJS.object._Watcher', []]);
        obj = {};
        cnt = 0;
    });

    act(function (done) {
        listener = callback(function (e) {
            cnt++;
            if (cnt === 2100) {
                done();
            }
        }, true);

        watcher = watcherWorker(obj, listener);

        var cur = watcher;
        for (var i = 0; i < 100; i++) {
            cur["obj" + i] = {};
            for (var c = 0; c < 20; c++) {
                cur["test" + i + '.' + c] = "value" + i + '.' + c;
            }
            cur.$process(); //fires the event handlers for the 1 obj and 20 values
            cur = cur["obj" + i];
        }
    });

    assert(function (test) {
        test('The cnt value should be').value(cnt).equals(2100);
    });
}
/**[@test({ "title": "TruJS.object.Watcher: prototype testing" })]*/
function testWatcher5(arrange, act, assert, callback, module) {
    var watcher, base, obj, final, baseWatcher, objWatcher, finalWatcher, baseListener, objListener, finalListener, cnt;

    arrange(function () {
        watcher = module(['TruJS.object._Watcher', []]);
        base = {
            "base1": 'base1'
            , "base2": {
                "base21": 'base2.1'
            }
            , "base3": 'base3'
            , "base4": {
                "base41": 'base4.1'
            }
            , "base5": {
                "base51": {
                    "base511": {
                        "base5111": 'base5.1.1.1'
                    }
                }
            }
        };

        obj = {
            "base3": 'obj3'
            , "base4": {
                "base41": 'obj41'
            }
        };

        Object.setPrototypeOf(obj, base);

        final = {

        };

        Object.setPrototypeOf(final, obj);

        cnt = 0;
    });

    act(function (done) {
        baseListener = callback();

        objListener = callback(function () {
            cnt++;
            if (cnt === 4) {
                done(1);
            }
        });

        finalListener = callback(function () {
            cnt++;
            if (cnt === 4) {
                done(1);
            }
        });

        baseWatcher = watcher(base, baseListener);
        objWatcher = watcher(obj, objListener);
        finalWatcher = watcher(final, finalListener);

        objWatcher.base2.base21 = 'obj2.1';
        objWatcher.base4.base41 = 'obj4.1';
        objWatcher.base5.base51.base511.base5111 = 'obj5.1.1.1';

        finalWatcher.base1 = 'final1';
    });

    assert(function (test) {
        test('The base listener should not be called').value(baseListener).hasBeenCalled(0);
        test('The obj listener should be called').value(objListener).hasBeenCalled(3);

        test('The base base2.base21 value should be').value(base, 'base2.base21').equals('base2.1');
        test('The obj base2.base21 value should be').value(obj, 'base2.base21').equals('obj2.1');

        test('The base base5.base51.base511.base5111 value should be').value(base, 'base5.base51.base511.base5111').equals('base5.1.1.1');
        test('The obj base5.base51.base511.base5111 value should be').value(obj, 'base5.base51.base511.base5111').equals('obj5.1.1.1');

        test('The base base1 value should be').value(base, 'base1').equals('base1');
        test('The final base1 value should be').value(final, 'base1').equals('final1');
    });
}
