/**[@test({ "title": "TruJS.dom._AttributeHelper: update attribute" })]*/
function testAttributeHelper1(arrange, act, assert, module) {
    var attributeHelper, createElement, element, attr1;

    arrange(function () {
        createElement = module(".createElement");
        attributeHelper = module(["TruJS.dom._AttributeHelper", []]);
        element = createElement("div");
        element.setAttribute("attr2", "attr2");
        attr1 = {};
    });

    act(function () {
        attributeHelper.update(element, { "attr1": attr1, "attr3": "attr3" });
        attributeHelper.update(element, "attr3", "update3");
    });

    assert(function (test) {
        test("attr1 node should be")
        .value(element)
        .getAttribute("attr1")
        .equals("$value");

        test("attr1 node $value should be")
        .value(element)
        .getAttributeNode("attr1")
        .value("{value}", "$value")
        .equals(attr1);

        test("attr2 node should be")
        .value(element)
        .getAttribute("attr2")
        .equals("attr2");

        test("attr3 node should be")
        .value(element)
        .getAttribute("attr3")
        .equals("update3");

    });
}

/**[@test({ "title": "TruJS.dom._AttributeHelper: toggle attribute" })]*/
function testAttributeHelper2(arrange, act, assert, module) {
    var attributeHelper, createElement, element;

    arrange(function () {
        createElement = module(".createElement");
        attributeHelper = module(["TruJS.dom._AttributeHelper", []]);
        element = createElement("div");
        element.setAttribute("attr2", "attr2");
    });

    act(function () {
        attributeHelper.toggle(element, ["attr1","attr2"]);
    });

    assert(function (test) {
        test("attr1 node should be")
        .value(element)
        .hasAttribute("attr1")
        .isTrue();

        test("attr2 node should be")
        .value(element)
        .hasAttribute("attr2")
        .isFalse();

    });
}

/**[@test({ "title": "TruJS.dom._AttributeHelper: remove attribute" })]*/
function testAttributeHelper3(arrange, act, assert, module) {
    var attributeHelper, createElement, element;

    arrange(function () {
        createElement = module(".createElement");
        attributeHelper = module(["TruJS.dom._AttributeHelper", []]);
        element = createElement("div");
        element.setAttribute("attr2", "attr2");
    });

    act(function () {
        attributeHelper.remove(element, ["attr1","attr2"]);
    });

    assert(function (test) {
        test("attr1 node should be")
        .value(element)
        .hasAttribute("attr1")
        .isFalse();

        test("attr2 node should be")
        .value(element)
        .hasAttribute("attr2")
        .isFalse();

    });
}

/**[@test({ "title": "TruJS.dom._AttributeHelper: has attribute" })]*/
function testAttributeHelper4(arrange, act, assert, module) {
    var attributeHelper, createElement, element, attr1, attrAll;

    arrange(function () {
        createElement = module(".createElement");
        attributeHelper = module(["TruJS.dom._AttributeHelper", []]);
        element = createElement("div");
        element.setAttribute("attr2", "attr2");
    });

    act(function () {
        attr1 = attributeHelper.has(element, "attr2");
        attrAll = attributeHelper.has(element, ["attr1","attr2"]);
    });

    assert(function (test) {
        test("attr1 node should be")
        .value(attr1)
        .isTrue();

        test("attrAll node should be")
        .value(attrAll)
        .isFalse();

    });
}