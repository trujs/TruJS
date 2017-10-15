/**[@test({ "title": "TruJS.encode.HtmlEncoder: decode some html strings" })]*/
function testHtmlEncoder1(arrange, act, assert, module) {
    var decode, str, res, check;

    arrange(function () {
      decode = module(["TruJS.encode._HtmlEncoder", []]).decode;
      check = '<div style="color:white;">This is text</div>';
      str = '&lt;div style=&quot;color:white;&quot;&gt;This is text&lt;/div&gt;';
      res = null;
    });

    act(function () {
        res = decode(str);
    });

    assert(function (test) {
        test('The decoded value should equal check').value(res).equals(check);
    });
}
/**[@test({ "title": "TruJS.encode.HtmlEncoder: encode some html" })]*/
function testHtmlEncoder2(arrange, act, assert, module) {
    var encode, str, res, check;

    arrange(function () {
      encode = module(["TruJS.encode._HtmlEncoder", []]).encode;
      check = '&lt;div style=&quot;color:white;&quot;&gt;This is text&lt;/div&gt;';
      str = '<div style="color:white;">This is text</div>';
      res = null;
    });

    act(function () {
      res = encode(str);
    });

    assert(function (test) {
      test('The encoded value should equal check').value(res).equals(check);
    });
}
