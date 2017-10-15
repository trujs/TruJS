/**[@test({ "title": "TruJS.Array.union: create 2 arrays, union them, test for duplicates" })]*/
function testArray1(arrange, act, assert, module) {
    var union, ar1, ar2, ar3;

    arrange(function () {
      union = module(["TruJS._Array", []]).union;
      ar1 = ['test1', 'test2'];
      ar2 = ['test2', 'test3'];
      ar3 = null;
    });

    act(function () {
      //union the objects
      ar3 = union(ar1, ar2);
    });

    assert(function (test) {
      //test for duplicates
      test('The resulting array should have unique values.').value(ar3).isUnique();
    });
}
/**[@test({ "title": "TruJS.Array.union: create 1 array and 1 object, union them, capture error" })]*/
function testArray2(arrange, act, assert, module) {
    var union, ar1, ar2, ar3, exception;

    arrange(function () {
      union = module(["TruJS._Array", []]).union;
      ar1 = { 'test1': 1, 'test2': 2 };
      ar2 = ['test2', 'test3'];
      ar3 = null;
      exception = null;
    });

    act(function () {
      try {
          //union the objects
          ar3 = union(ar1, ar2);
      }
      catch (ex) {
          exception = ex;
      }
    });

    assert(function (test) {
      test('The exception should not be nill').value(exception).not().isNill();
    });
}
/**[@test({ "title": "TruJS.Array.ofType: Create a string, number, and object arrays" })]*/
function testArray3(arrange, act, assert, module) {
    var ofType, strAr, numAr, objAr, strArType, numArType, objArType;

    arrange(function () {
      ofType = module(["TruJS._Array", []]).ofType;
      strAr = ['value', 'another', 'value'];
      numAr = [0, 100, -12];
      objAr = [{}, {}, {}];
      strArType = null;
      numArType = null;
      objArType = null;
    });

    act(function () {
      strArType = ofType(strAr);
      numArType = ofType(numAr);
      objArType = ofType(objAr);
    });

    assert(function (test) {
      test('The strAr type should be "string"').value(strArType).equals('string');
      test('The numAr type should be "number"').value(numArType).equals('number');
      test('The objAr type should be "string"').value(objArType).equals('object');
    });
}
/**[@test({ "title": "TruJS.Array.ofType: create 3 mixed arrays" })]*/
function testArray4(arrange, act, assert, module) {
    var ofType, ar1, ar1Type, ar2, ar2Type, ar3, ar3Type;

    arrange(function () {
      ofType = module(["TruJS._Array", []]).ofType;
      ar1 = ["string", "string", "string", {}];
      ar2 = [100, "string", 1000, 9];
      ar3 = ["string", {}, {}, {}];
    });

    act(function () {
      ar1Type = ofType(ar1);
      ar2Type = ofType(ar2);
      ar3Type = ofType(ar3);
    });

    assert(function (test) {
      test('The ar1 type should be null').value(ar1Type).isNull();
      test('The ar2 type should be null').value(ar2Type).isNull();
      test('The ar3 type should be null').value(ar3Type).isNull();
    });
}
/**[@test({ "title": "TruJS.Array.ofElements: create some objects and test" })]*/
function testArray5(arrange, act, assert, element, module) {
    var ofElements, test1, test2, test3, test4, res1, res2, res3, res4;

    arrange(function () {
      ofElements = module(["TruJS._Array", []]).ofElements;
      var div = element({ "tagName": 'div' });
      var span = element({ "tagName": 'span' });
      test1 = [span(), 'string', 10];
      test2 = [div(), div(), span()];
      test3 = 'string';
      test4 = [];
    });

    act(function () {
      res1 = ofElements(test1);
      res2 = ofElements(test2);
      res3 = ofElements(test3);
      res4 = ofElements(test4);
    });

    assert(function (test) {
      test('test1 should be false').value(res1).isFalse();
      test('test2 should be true').value(res2).isTrue();
      test('test3 should be false').value(res3).isFalse();
      test('test4 should be false').value(res4).isFalse();
    });
}
/**[@test({ "title": "TruJS.Array.minus: create 2 arrays and minus them" })]*/
function testArray6(arrange, act, assert, module) {
    var minus, ar1, ar2, res;

    arrange(function () {
      minus = module(["TruJS._Array", []]).minus;
      ar1 = ["test", "test2", "test4", "test5"];
      ar2 = ["test", "test6", "test", "test7", "test2", "test21"];
    });

    act(function () {
      res = minus(ar1, ar2);
    });

    assert(function (test) {
      test('There should be 5 members').value(res).hasMemberCountOf(5);
      test('There should not be a member "test"').value(res).not().hasMember('test');
      test('There should be a member "test21"').value(res).hasMember('test21');
    });
}
/**[@test({ "title": "TruJS.Array.contains: create 3 arrays and test them" })]*/
function testArray7(arrange, act, assert, module) {
    var contains, ar1, ar2, ar3, res1, res2;

    arrange(function () {
      contains = module(["TruJS._Array", []]).contains;
      ar1 = ["test", "test2", "test4", "test5"];
      ar2 = ["test", "test6", "test", "test7", "test2", "test21"];
      ar3 = ["foo", "bar", "test23", "test2.0"];
    });

    act(function () {
      res1 = contains(ar1, ar2);
      res2 = contains(ar1, ar3);
    });

    assert(function (test) {
      test('There should be a common member in ar1 and ar2').value(res1).isTrue();
      test('There should not be a common member in ar1 and ar3').value(res2).isFalse();
    });
}
/**[@test({ "title": "TruJS.Array.containsAll: create 3 arrays and test them" })]*/
function testArray8(arrange, act, assert, module) {
    var containsAll, ar1, ar2, ar3, res1, res2;

    arrange(function () {
      containsAll = module(["TruJS._Array", []]).containsAll;
      ar1 = ["test", "test1", "test2", "test3", "test4", "test5"];
      ar2 = ["test", "test6", "test", "test7", "test2", "test21"];
      ar3 = ["test2", "test3", "test4", "test2"];
    });

    act(function () {
      res1 = containsAll(ar1, ar2);
      res2 = containsAll(ar1, ar3);
    });

    assert(function (test) {
      test('ar1 does not contain all ar2 members').value(res1).isFalse();
      test('ar1 does contain all ar3 members').value(res2).isTrue();
    });
}
