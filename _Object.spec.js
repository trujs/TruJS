/**[@test({ "title": "TruJS.Object.lookup: create an object and get values" })]*/
﻿function testObject1(arrange, act, assert, module) {
    var lookup, obj, name1, name2, var1, var2, name3, var3;

    arrange(function () {
      lookup = module(["TruJS._Object", []]).lookup;
      obj = {
          items: [{
              "name": 'value1'
          }, {
              "name": 'value2'
          }]
      };
      name1 = 'items[0].name';
      name2 = 'items[1].name';
      name3 = 'items[2].name';
      var1 = null;
      var2 = null;
      var3 = null;
    });

    act(function () {
      var1 = lookup(obj, name1);
      var2 = lookup(obj, name2);
      var3 = lookup(obj, name3);
    });

    assert(function (test) {
        test('The first var should be').value(var1).equals(obj.items[0].name);
        test('The second var should be').value(var2).equals(obj.items[1].name);
        test('The third var should be undefined').value(var3).isUndef();
    });
}
/**[@test({ "title": "TruJS.Object.isMatch: make some objects and see if they match" })]*/
function testObject2(arrange, act, assert, module) {
    var isMatch, obj1, obj2, obj3, res1, res2, res3;

    arrange(function () {
      isMatch = module(["TruJS._Object", []]).isMatch;
      obj1 = {
          "var1": 'test1'
          , "var2": 'test2'
      };
      obj2 = {
          "var1": 'test1'
          , "var2": 'test2'
      };
      obj3 = {
          "var1": 'test1'
          , "var2": 'test2'
          , "var3": 'test2'
      };
    });

    act(function () {
        res1 = isMatch(obj1, obj2);
        res2 = isMatch(obj1, obj3);
        res3 = isMatch(obj2, obj3);
    });

    assert(function (test) {
        test('obj1 should match obj2').value(res1).isTrue();
        test('obj1 should not match obj3').value(res2).isFalse();
        test('obj2 should not match obj3').value(res3).isFalse();
    });
}
/**[@test({ "title": "TruJS.Object.allKeys: see if prototype keys are returned" })]*/
function testObject3(arrange, act, assert, module) {
    var allKeys, base, obj, keys;

    arrange(function () {
        allKeys = module(["TruJS._Object", []]).allKeys;

        base = {
            "base1": 'base1'
            , "base2": 'base2'
        };
        obj = {
            "obj1": 'obj1'
            , "obj2": 'obj2'
        };

        Object.setPrototypeOf(obj, base);
    });

    act(function () {
        keys = allKeys(obj);
    });

    assert(function (test) {
        test('There should be 4 keys').value(keys).hasMemberCountOf(4);
        test('There should be a key "base1" in the keys array').value(keys).hasMember('base1');
    });
}
/**[@test({ "title": "TruJS.Object.copy: copy and object an ensure it''s deep" })]*/
function testObject4(arrange, assert, act, module) {
    var obj, copiedObj, copy;

    arrange(function () {
        copy = module(["TruJS._Object", []]).copy;
        obj = {
            "obj2": {
                "value21": 'value21'
                , "obj22": {
                    "value221": 'value221'
                }
            }
            , "value3": 'value3'
        };
    });

    act(function () {
        copiedObj = copy(obj);
    });

    assert(function (test) {
        test('The `obj` and `copiedObj` should not be equal').value(copiedObj).not().equals(obj);
        test('The `copiedObj` should have a member obj2.obj22.value221').value(copiedObj, 'obj2.obj22.value221').equals('value221');
    });
}
