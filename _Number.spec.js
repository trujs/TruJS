/**[@test({ "title": "TruJS.Number.isInteger" })]*/
function testNumber1(arrange, act, assert, module) {
    var isInteger, val1, val2, val3, val4, res1, res2, res3, res4;

    arrange(function () {
      isInteger = module(["TruJS._Number", []]).isInteger;
      val1 = '10';
      val2 = 10;
      val3 = 10.1;
      val4 = '10.1';
    });

    act(function () {
        res1 = isInteger(val1);
        res2 = isInteger(val2);
        res3 = isInteger(val3);
        res4 = isInteger(val4);
    });

    assert(function (test) {
        test('res1 should be true').value(res1).isTrue();
        test('res2 should be true').value(res2).isTrue();
        test('res3 should be false').value(res3).isFalse();
        test('res4 should be false').value(res4).isFalse();
    });
}
