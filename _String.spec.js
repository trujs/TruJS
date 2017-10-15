/**[@test({ "title": "TruJS.String.apply: create a template string and then apply some data" })]*/
function testString1(arrange, act, assert, module) {
    var apply, str1, obj, str2, res;

    arrange(function () {
      apply = module(["TruJS._String", []]).apply;
      str1 = 'This is a {:test:} of how the reg-ex lookup should work {:when:} there are multiple instances of a {:var:}';
      obj = { "test": 'beagle', "when": 'bugger', "var": 'cat' };
      str2 = null;
      res = 'This is a beagle of how the reg-ex lookup should work bugger there are multiple instances of a cat';
    });

    act(function () {
        //apply the data
        str2 = apply(str1, obj);
    });

    assert(function (test) {
        test('The str2 value should match the res value').value(str2).equals(res);
    });
}
/**[@test({ "title": "TruJS.String.apply: test with null and undefined values" })]*/
function testString2(arrange, act, assert, module) {
    var apply, str1, obj, str2, res;

    arrange(function () {
      apply = module(["TruJS._String", []]).apply;
      str1 = 'This is a {:test:} of how the reg-ex lookup should work {:when:} there are multiple instances of a {:var:}';
      obj = { "test": 'beagle', "when": null, "var": undefined };
      str2 = null;
      res = 'This is a beagle of how the reg-ex lookup should work  there are multiple instances of a ';
    });

    act(function () {
        //apply the data
        str2 = apply(str1,obj);
    });

    assert(function (test) {
        test('The str2 value should match the res value').value(str2).equals(res);
    });
}
/**[@test({ "title": "TruJS.String.apply: test with nested values" })]*/
function testString3(arrange, act, assert, module) {
    var apply, str1, obj, str2, res;

    arrange(function () {
      apply = module(["TruJS._String", []]).apply;
      str1 = 'This is a {:test.val1:} of how the reg-ex lookup should work {:when.then.now:} there are multiple instances of a {:var:}';
      obj = { "test": { "val1": 'beagle' }, "when": { "then": { "now": 'bugger' } }, "var": 'cat' };
      str2 = null;
      res = 'This is a beagle of how the reg-ex lookup should work bugger there are multiple instances of a cat';
    });

    act(function () {
        //apply the data
        str2 = apply(str1, obj);
    });

    assert(function (test) {
        test('The str2 value should match the res value').value(str2).equals(res);
    });
}
/**[@test({ "title": "TruJS.String.apply: test with different delimiter" })]*/
function testString4(arrange, act, assert, module) {
    var apply, str1, obj, str2, res;

    arrange(function () {
      apply = module(["TruJS._String", []]).apply;
      str1 = 'This is a "test" of how the reg-ex lookup should work "when" there are multiple instances of a "var"';
      obj = { "test": 'beagle', "when": 'bugger', "var": 'cat' };
      str2 = null;
      res = 'This is a beagle of how the reg-ex lookup should work bugger there are multiple instances of a cat';
    });

    act(function () {
      //apply the data
      str2 = apply(str1, obj, '"');
    });

    assert(function (test) {
      test('The str2 value should match the res value').value(str2).equals(res);
    });
}
/**[@test({ "title": "TruJS.String.insert: perform multiple inserts" })]*/
function testString5(arrange, act, assert, module) {
    var insert, val, str1, str2, str3, res;

    arrange(function () {
      insert = module(["TruJS._String", []]).insert;
      val = 'abcdefgijkmnop';
      str1 = 'h';
      str2 = 'l';
      str3 = null;
      res = 'abcdefghijklmnop';
    });

    act(function () {
        str3 = insert(val, str1, 7);
        str3 = insert(str3, str2, 11);
    });

    assert(function (test) {
        test('The result from the inserts should match the res variable').value(str3).equals(res);
    });
}
/**[@test({ "title": "TruJS.String.update: using default delims" })]*/
function testString6(arrange, act, assert, callback, module) {
    var update, str, func, res, val;

    arrange(function () {
      update = module(["TruJS._String", []]).update;
      str = 'This is a "string" and this is also a \'STRING\'';
      func = callback();
      res = '"string"\'STRING\'';
      val = null;
    });

    act(function () {
      //run the update
      val = update(str, func);
    });

    assert(function (test) {
      test('The val variable should match the res').value(val).equals(res);
      test('The function should have been called twice').value(func).hasBeenCalled(2);
    });
}
/**[@test({ "title": "TruJS.String.update: using special delims" })]*/
function testString7(arrange, act, assert, callback, module) {
    var update, str, func, res, delims, val;

    arrange(function () {
      update = module(["TruJS._String", []]).update;
      str = 'This is a {string} and this is also a [STRING]';
      func = callback();
      delims = { '[': ']', '{': '}' };
      res = '{string}[STRING]';
      val = null;
    });

    act(function () {
        //run the update
        val = update(str, func, delims);
    });

    assert(function (test) {
        test('The val variable should match the res').value(val).equals(res);
        test('The function should have been called twice').value(func).hasBeenCalled(2);
    });
}
/**[@test({ "title": "TruJS.String.split: create a string and split it" })]*/
function testString8(arrange, act, assert, module) {
    var split, delims, str, res, val;

    arrange(function () {
      split = module(["TruJS._String", []]).split;
      delims = [',', '.', ';', ' ', '[', ']', '{', '}', '(', ')', '\r', '\n'];
      str = 'This is a, test; for checking delims. [this]\n{that}\r(other)';
      res = ['This', ' ', 'is', ' ', 'a', ',', ' ', 'test', ';', ' ', 'for', ' ', 'checking', ' ', 'delims', '.', ' ', '[', 'this', ']', '↵', '{', 'that', '}', ' ', '(', 'other', ')'];
      val = null;
    });

    act(function () {
        val = split(str, delims);
    });

    assert(function (test) {
        test('The val should match res').value(val[12]).equals(res[12]);
    });
}
/**[@test({ "title": "TruJS.String.newGuid: create 1000 guids, test for uniqueness" })]*/
function testString9(arrange, act, assert, module) {
    var newGuid, guids, i;

    arrange(function () {
      newGuid = module(["TruJS._String", []]).newGuid;
      guids = [];
    });

    act(function () {
        //create 1000 guids and ensure uniqueness
        for (i = 0; i < 1000; i++) {
            guids.push(newGuid());
        }
    });

    assert(function (test) {
        test('All generated guids are unique').value(guids).isUnique();
    });
}
/**[@test({ "title": "TruJS.String.trim: "})]*/
function testString10(arrange, act, assert, module) {
    var delim, trim, text, res;

    arrange(function () {
      trim = module(["TruJS._String", []]).trim;
      text = "/test/test/";
      res = [];
      delim = "[/]";
    });

    act(function () {
        res[0] = trim(text, delim, "end");
        res[1] = trim(text, delim, "start");
        res[2] = trim(text, delim);
    });

    assert(function (test) {
        test("res[0] should be")
        .value(res[0])
        .equals("/test/test");

        test("res[1] should be")
        .value(res[1])
        .equals("test/test/");

        test("res[2] should be")
        .value(res[2])
        .equals("test/test");
    });
}
