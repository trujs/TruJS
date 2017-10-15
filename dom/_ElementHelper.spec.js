/**[@test({ "label": "elementHelperSetup", "type": "factory", "format": "browser" })]*/
function elementHelperSetup(element, callback, module) {
    var body = element({
        "tagName": 'BODY'
    })
    , setup = {
        //create a mock function for the createElement dependency
        "cbCreate": callback(function (tag) {
            return element({
                "tagName": !!tag && tag.toUpperCase() || 'DIV'
            })();
        }, true)
        //create a mock for the getElementById
        , "cbGetById": callback(function (id) {
            if (typeof (id) === 'string') {
                return element()();
            }
            else {
                return id;
            }
        })
        //create a mocked body
        , "body": body
        //create a mock for the getElementByTagName that returns the document body
        , "cbGetByTag": callback(function (tag) {
            if (tag === 'body') {
                return [body];
            }
        }, true)
    };
    //create the helper factory
    setup.helper = module("TruJS.dom._ElementHelper")(setup.cbCreate, null, setup.cbGetById, setup.cbGetByTag, null);
    //return the setup object
    return setup;
}
/**[@test({ "title": "TruJS.dom._ElementHelper: create with innerHtml", "format": "browser" })]*/
function testElementHelper1(arrange, act, assert, elementHelperSetup) {
    var cfg, el;

    arrange(function () {
        //create the configuration for the element
        cfg = {
            "tag": 'span'
            , "target": 'body'
            , "id": '12345'
            , "attributes": {
                "attr1": 'attribute1'
                , "attr2": 'attribute2'
            }
            , "style": [
                'style1'
                , 'style2'
            ]
            , "class": [
                'class1'
                , 'class2'
            ]
            , "innerHTML": [
                '<div>First Child</div>'
                , '<span>Second Child</span>'
            ]
        };
    });

    act(function () {
        el = elementHelperSetup.helper.create(cfg);
    });

    assert(function (test) {
        test('The tag name should be span').value(el.tagName.toLowerCase()).equals('span');
        test('The el style.cssText should match the config style').value(el, 'style.cssText').equals(cfg.style.join(';'));
        test('The el className should match the config class').value(el, 'className').equals(cfg.class.join(' '));
        test('The el innerHTML should match the config innerHTML').value(el, 'innerHTML').equals(cfg.innerHTML.join(''));
        test('The el id should match the config id').value(el, 'id').equals(cfg.id);
        test('This el attribute attr1 should equal "attribute1"').value(el, 'attr1').equals('attribute1');
        test('This el attribute attr2 should equal "attribute2"').value(el, 'attr2').equals('attribute2');
        test('The parent should be the mocked body').value(el, 'parentElement').equals(elementHelperSetup.body);
    });
}
/**[@test({ "title": "TruJS.dom._ElementHelper: create with children array", "format": "browser" })]*/
function testElementHelper2(arrange, act, assert, elementHelperSetup) {
    var cfg, el;

    arrange(function () {
        //create the configuration for the element
        cfg = {
            "tag": 'div'
            , children: [{
                "tag": 'span'
                , "style": 'style1;style2;'
            }, {
                "tag": 'span'
                , "class": 'class1 class2'
            }, {
                "tag": 'hr'
                , "attributes": {
                    "data-attr1": 'attribute'
                }
            }]
        };
    });

    act(function () {
        el = elementHelperSetup.helper.create(cfg);
    });

    assert(function (test) {
        test('The el should have 3 children').value(el, 'children').hasMemberCountOf(3);
        test('The first childs cssText should be "style1;style2;"').value(el, 'children[0].style.cssText').equals('style1;style2;');
        test('The second childs class should be "class1 class2"').value(el, 'children[1].className').equals('class1 class2');
        test('The third childs "data-attr1" attribute should be "attribute"').value(el, 'children[2]["data-attr1"]').equals('attribute');
    });
}
