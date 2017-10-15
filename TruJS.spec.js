/**[@test({ "label": "trujs", "type": "singleton" })]*/
function trujsHelperSetup(module) {
  return module("TruJS");
}
/**[@test({ "label": "customEvent", "type": "singleton" })]*/
function trujsHelperSetup2(module) {
  return module(".customEvent");
}
/**[@test({ "title": "TruJS.resolvePath: resolve various path types" })]*/
function testTruJS1(arrange, act, assert, trujs) {
    var obj, path1, res1, path2, res2, path3, res3;

    arrange(function () {
        obj = {
            "name": 'joe shmo'
            , "address": {
                "street": '12345 street drive'
            }
            , "friends": [{
                "name": 'Jane Doh'
            }]
        };

        path1 = 'name';
        path2 = 'address.street';
        path3 = 'friends[0].name';
    });

    act(function () {
        res1 = trujs.resolvePath(path1, obj);
        res2 = trujs.resolvePath(path2, obj);
        res3 = trujs.resolvePath(path3, obj);
    });

    assert(function (test) {
        test('The res1 value should be:').value(res1, 'value').equals(obj.name);
        test('The res2 value should be:').value(obj, 'address.street').equals(res2.value);
        test('The res3 value should be:').value(obj, 'friends[0].name').equals(res3.value);
    });
}
/**[@test({ "title": "apply: no defaults, not removing nulls" })]*/
function testTruJS2(arrange, act, assert, trujs) {
    //shared variables
    var obj1, obj2, obj3;

    arrange(function () {
        obj1 = { var1: "test1", var4: null };
        obj2 = { var1: "test2", var2: "test3" };
    });

    act(function () {
        //run the apply w/ no defaults
        obj3 = trujs.apply(obj1, obj2, null, false);
    });

    assert(function (test) {
        //test that var1 is unchanged
        test('Var1 should be unchanged').value(obj3.var1).equals(obj1.var1);
        //test that var4 exists since we aren't removing nulls
        test('Var4 should still exist').value(obj3).hasProperty("var4");
    });
}
/**[@test({ "title": "apply: with defaults, not removing nulls" })]*/
function testTruJS3(arrange, act, assert, trujs) {
    //shared variables
    var obj1, obj2, defaults, obj3;

    arrange(function () {
        obj1 = { var1: "test1", var4: null };
        obj2 = { var1: "test2", var2: "test3" };
        defaults = { var5: "test5", var4: "test4", var1: "noTest" };
    });

    act(function () {
        //run the apply with defaults
        obj3 = trujs.apply(obj1, obj2, defaults, false);
    });

    assert(function (test) {
        //test var1 is unchanged
        test('Var1 should be unchanged').value(obj1.var1).equals(obj3.var1);
        //test that var4 is present and has a value
        test('Var4 should still exist').value(obj3).hasProperty("var4");
        test('Var4 should not be null').value(obj3.var4).not().isNull();
        //test that var5 is present
        test('Var5 should be present').value(obj3).hasProperty("var5");
    });
}
/**[@test({ "title": "apply: no defaults, removing nulls" })]*/
function testTruJS4(arrange, act, assert, trujs) {
    //shared variables
    var obj1, obj2, obj3;

    arrange(function () {
        obj1 = { var1: "test1", var4: null };
        obj2 = { var1: "test2", var2: "test3" };
    });

    act(function () {
        //run the apply with removing nulls
        obj3 = trujs.apply(obj1, obj2, null, true);
    });

    assert(function (test) {
        //check that var4 is missing
        test('Var4 should be missing').value(obj3).not().hasProperty("var4");
    });
}
/**[@test({ "title": "applyIf: no defaults, no removing nulls" })]*/
function testTruJS5(arrange, act, assert, trujs) {
    //shared variables
    var obj1, obj2, obj3;

    arrange(function () {
        obj1 = { var1: "test1", var4: null };
        obj2 = { var1: "test2", var2: "test3" };
    });

    act(function () {
        //run the apply with removing nulls
        obj3 = trujs.applyIf(obj1, obj2, null, false);
    });

    assert(function (test) {
        //test that var1 is unchanged
        test('Var1 should be unchanged').value(obj2.var1).equals(obj3.var1);
    });
}
/**[@test({ "title": "removeNulls: create an object with a null property" })]*/
function testTruJS6(arrange, act, assert, trujs) {
    //shared variables
    var obj1;

    arrange(function () {
        //setup the object
        obj1 = { var1: "test1", var4: null };
    });

    act(function () {
        trujs.removeNulls(obj1);
    });

    assert(function (test) {
        test('Var4 should be missing').value(obj1).not().hasProperty("var4");
    });
}
/**[@test({ "title": "getType: create some types and check the return value", "format": "browser" })]*/
function testTruJS8(arrange, act, assert, customEvent, trujs) {
    var test1, test2, test3, res1, res2, res3;

    arrange(function () {
        test1 = new customEvent('event');
        test2 = ["test"];
        test3 = 4.0;
    });

    act(function () {
        res1 = trujs.getType(test1);
        res2 = trujs.getType(test2);
        res3 = trujs.getType(test3);
    });

    assert(function (test) {
        test('test1 should be').value(res1).equals('customevent');
        test('test2 should be').value(res2).equals('array');
        test('test3 should be').value(res3).equals('number');
    });
}
/**[@test({ "title": "isArray: test one array and one non-array" })]*/
function testTruJS9(arrange, act, assert, trujs) {
    //shared variables
    var ar, nonar, isar1, isar2;

    arrange(function () {
        ar = [1, 2, 3];
        nonar = { a: 1, b: 2, c: 3 };
        isar1 = null;
        isar2 = null;
    });

    act(function () {
        isar1 = trujs.isArray(ar);
        isar2 = trujs.isArray(nonar);
    });

    assert(function (test) {
        test('The ar variable is an array').value(isar1).isTrue();
        test('The nonar variable is not an array').value(isar2).isFalse();
    });
}
/**[@test({ "title": "isEmpty: an empty string, array, and object, and then a non-empty version of each" })]*/
function testTruJS10(arrange, act, assert, trujs) {
    //shared variables
    var ar, str, obj, isar, isstr, isobj;

    arrange(function () {
        ar = [];
        str = '';
        obj = {};
        isar = null;
        isstr = null;
        isobj = null;
    });

    act(function () {
        isar = trujs.isEmpty(ar);
        isstr = trujs.isEmpty(str);
        isobj = trujs.isEmpty(obj);
    });

    assert(function (test) {
        test('The ar variable is empty').value(isar).isTrue();
        test('The str variable is empty').value(isstr).isTrue();
        test('The obj variable is empty').value(isobj).isTrue();
    });
}
/**[@test({ "title": "isEmpty: a non empty string, array, and object" })]*/
function testTruJS11(arrange, act, assert, trujs) {
    //shared variables
    var ar, str, obj, isar, isstr, isobj;

    arrange(function () {
        ar = [1];
        str = '1';
        obj = {
            "a": 1
        };
        isar = null;
        isstr = null;
        isobj = null;
    });

    act(function () {
        isar = trujs.isEmpty(ar);
        isstr = trujs.isEmpty(str);
        isobj = trujs.isEmpty(obj);
    });

    assert(function (test) {
        test('The ar variable is not empty').value(isar).isFalse();
        test('The str variable is not empty').value(isstr).isFalse();
        test('The obj variable is not empty').value(isobj).isFalse();
    });
}
/**[@test({ "title": "isElement: test one element and one non-element" })]*/
function testTruJS12(arrange, act, assert, document, trujs) {
    //shared variables
    var el, nonel, isel1, isel2;

    arrange(function () {
        el = document.createElement('div');
        nonel = { 'element': 'div' };
        isel1 = null;
        isel2 = null;
    });

    act(function () {
        isel1 = trujs.isElement(el);
        isel2 = trujs.isElement(nonel);
    });

    assert(function (test) {
        test('The el variable is an element').value(isel1).isTrue();
        test('The nonel variable is not an element').value(isel2).isFalse();
    });
}
/**[@test({ "title": "isEvent: test one event and one non-event" })]*/
function testTruJS13(arrange, act, assert, customEvent, trujs) {
    //shared variables
    var evnt, nonevnt, isevnt1, isevnt2;

    arrange(function () {
        evnt = new customEvent('test');
        nonevnt = { 'event': 'test' };
        isevnt1 = null;
        isevnt2 = null;
    });

    act(function () {
        isevnt1 = trujs.isEvent(evnt);
        isevnt2 = trujs.isEvent(nonevnt);
    });

    assert(function (test) {
        test('The evnt variable is an event').value(isevnt1).isTrue();
        test('The nonevnt variable is not an event').value(isevnt2).isFalse();
    });
}
/**[@test({ "title": "isError: test one error and one non-error" })]*/
function testTruJS14(arrange, act, assert, trujs) {
    var err, noerr, errRes, noerrRes;

    arrange(function () {
        err = new Error("This is a test error");
        noerr = "This is not a test error";
        errRes = null;
        noerrRes = null;
    });

    act(function () {
        errRes = trujs.isError(err);
        noerrRes = trujs.isError(noerr);
    });

    assert(function (test) {
        test('The err value should be an Error').value(errRes).isTrue();
        test('The noerr value should not be an Error').value(noerrRes).isFalse();
    });
}
/**[@test({ "title": "isFunc: test one event and one non-event" })]*/
function testTruJS15(arrange, act, assert, trujs) {
    var func, nonfunc, isfunc1, isfunc2;

    arrange(function () {
        func = function () { };
        nonfunc = { 'func': func };
        isfunc1 = null;
        isfunc2 = null;
    });

    act(function () {
        isfunc1 = trujs.isFunc(func);
        isfunc2 = trujs.isFunc(nonfunc);
    });

    assert(function (test) {
        test('The func variable is a function').value(isfunc1).isTrue();
        test('The nonfunc variable is not a function').value(isfunc2).isFalse();
    });
}
/**[@test({ "title": "isNill: test one undefined, null, and object" })]*/
function testTruJS16(arrange, act, assert, trujs) {
    var t1, t2, t3, isn1, isn2, isn3;

    arrange(function () {
        t1 = undefined;
        t2 = null;
        t3 = {};
        isn1 = null;
        isn2 = null;
        isn3 = null;
    });

    act(function () {
        isn1 = trujs.isNill(t1);
        isn2 = trujs.isNill(t2);
        isn3 = trujs.isNill(t3);
    });

    assert(function (test) {
        test('The t1 variable is nill').value(isn1).isTrue();
        test('The t2 variable is nill').value(isn2).isTrue();
        test('The t3 variable is not nill').value(isn3).isFalse();
    });
}
/**[@test({ "title": "isRegEx: test one regex and one non-regex" })]*/
function testTruJS17(arrange, act, assert, trujs) {
    var regex, noregex, regexRes, noregexRes;

    arrange(function () {
        regex = /this is regex/g;
        noregex = "This is not regex";
        regexRes = null;
        noregexRes = null;
    });

    act(function () {
        regexRes = trujs.isRegEx(regex);
        noregexRes = trujs.isRegEx(noregex);
    });

    assert(function (test) {
        test('The regex value should be a regular expression').value(regexRes).isTrue();
        test('The noregex value should not be a regular expression').value(noregexRes).isFalse();
    });
}
/**[@test({ "title": "isArguments: test one Arguments and one non-Arguments" })]*/
function testTruJS18(arrange, act, assert, trujs) {
    var args, noargs, argsRes, noArgsRes;

    arrange(function () {
        args = arguments;
        noargs = [1];
        argsRes = null;
        noArgsRes = null;
    });

    act(function () {
        argsRes = trujs.isArguments(args);
        noArgsRes = trujs.isArguments(noargs);
    });

    assert(function (test) {
        test('The args value should be an Arguments type').value(argsRes).isTrue();
        test('The noargs value should not be an Arguments type').value(noArgsRes).isFalse();
    });
}
/**[@test({ "title": "isPrototypeKey: create a prototype chain and test keys" })]*/
function testTruJS19(arrange, act, assert, trujs) {
    var base, obj, is1, is2;

    arrange(function () {
        base = {
            "base": 'value'
        };
        obj = {
            "obj": 'value'
        };

        Object.setPrototypeOf(obj, base);
    });

    act(function () {
        is1 = trujs.isPrototypeKey(obj, 'base');
        is2 = trujs.isPrototypeKey(obj, 'obj');
    });

    assert(function (test) {
        test('The `base` key should be a prototype key').value(is1).isTrue();
        test('The `obj` key should not be a prototype key').value(is2).isFalse();
    });
}
