/**
* A module to HTML encode or decode a string
* @factory
*/
function _HtmlEncoder() {

    var decodeChars = { "&quot;": '"', "&apos;": "'", "&amp;": '&', "&lt;": '<', "&gt;": '>', "&nbsp;": '', "&iexcl;": '¡', "&cent;": '¢', "&pound;": '£', "&curren;": '¤', "&yen;": '¥', "&brvbar;": '¦', "&sect;": '§', "&uml;": '¨', "&copy;": '©', "&ordf;": 'ª', "&laquo;": '«', "&not;": '¬', "&shy;": '', "&reg;": '®', "&macr;": '¯', "&deg;": '°', "&plusmn;": '±', "&sup2;": '²', "&sup3;": '³', "&acute;": '´', "&micro;": 'µ', "&para;": '¶', "&middot;": '·', "&cedil;": '¸', "&sup1;": '¹', "&ordm;": 'º', "&raquo;": '»', "&frac14;": '¼', "&frac12;": '½', "&frac34;": '¾', "&iquest;": '¿', "&times;": '×', "&divide;": '÷', "&Agrave;": 'À', "&Aacute;": 'Á', "&Acirc;": 'Â', "&Atilde;": 'Ã', "&Auml;": 'Ä', "&Aring;": 'Å', "&AElig;": 'Æ', "&Ccedil;": 'Ç', "&Egrave;": 'È', "&Eacute;": 'É', "&Ecirc;": 'Ê', "&Euml;": 'Ë', "&Igrave;": 'Ì', "&Iacute;": 'Í', "&Icirc;": 'Î', "&Iuml;": 'Ï', "&ETH;": 'Ð', "&Ntilde;": 'Ñ', "&Ograve;": 'Ò', "&Oacute;": 'Ó', "&Ocirc;": 'Ô', "&Otilde;": 'Õ', "&Ouml;": 'Ö', "&Oslash;": 'Ø', "&Ugrave;": 'Ù', "&Uacute;": 'Ú', "&Ucirc;": 'Û', "&Uuml;": 'Ü', "&Yacute;": 'Ý', "&THORN;": 'Þ', "&szlig;": 'ß', "&agrave;": 'à', "&aacute;": 'á', "&acirc;": 'â', "&atilde;": 'ã', "&auml;": 'ä', "&aring;": 'å', "&aelig;": 'æ', "&ccedil;": 'ç', "&egrave;": 'è', "&eacute;": 'é', "&ecirc;": 'ê', "&euml;": 'ë', "&igrave;": 'ì', "&iacute;": 'í', "&icirc;": 'î', "&iuml;": 'ï', "&eth;": 'ð', "&ntilde;": 'ñ', "&ograve;": 'ò', "&oacute;": 'ó', "&ocirc;": 'ô', "&otilde;": 'õ', "&ouml;": 'ö', "&oslash;": 'ø', "&ugrave;": 'ù', "&uacute;": 'ú', "&ucirc;": 'û', "&uuml;": 'ü', "&yacute;": 'ý', "&thorn;": 'þ', "&yuml;": 'ÿ' }
    , encodeChars = { '"': '&quot;', "'": '&apos;', "&": '&amp;', "<": '&lt;', ">": '&gt;', "¡": '&iexcl;', "¢": '&cent;', "£": '&pound;', "¤": '&curren;', "¥": '&yen;', "¦": '&brvbar;', "§": '&sect;', "¨": '&uml;', "©": '&copy;', "ª": '&ordf;', "«": '&laquo;', "¬": '&not;', "®": '&reg;', "¯": '&macr;', "°": '&deg;', "±": '&plusmn;', "²": '&sup2;', "³": '&sup3;', "´": '&acute;', "µ": '&micro;', "¶": '&para;', "·": '&middot;', "¸": '&cedil;', "¹": '&sup1;', "º": '&ordm;', "»": '&raquo;', "¼": '&frac14;', "½": '&frac12;', "¾": '&frac34;', "¿": '&iquest;', "×": '&times;', "÷": '&divide;', "À": '&Agrave;', "Á": '&Aacute;', "Â": '&Acirc;', "Ã": '&Atilde;', "Ä": '&Auml;', "Å": '&Aring;', "Æ": '&AElig;', "Ç": '&Ccedil;', "È": '&Egrave;', "É": '&Eacute;', "Ê": '&Ecirc;', "Ë": '&Euml;', "Ì": '&Igrave;', "Í": '&Iacute;', "Î": '&Icirc;', "Ï": '&Iuml;', "Ð": '&ETH;', "Ñ": '&Ntilde;', "Ò": '&Ograve;', "Ó": '&Oacute;', "Ô": '&Ocirc;', "Õ": '&Otilde;', "Ö": '&Ouml;', "Ø": '&Oslash;', "Ù": '&Ugrave;', "Ú": '&Uacute;', "Û": '&Ucirc;', "Ü": '&Uuml;', "Ý": '&Yacute;', "Þ": '&THORN;', "ß": '&szlig;', "à": '&agrave;', "á": '&aacute;', "â": '&acirc;', "ã": '&atilde;', "ä": '&auml;', "å": '&aring;', "æ": '&aelig;', "ç": '&ccedil;', "è": '&egrave;', "é": '&eacute;', "ê": '&ecirc;', "ë": '&euml;', "ì": '&igrave;', "í": '&iacute;', "î": '&icirc;', "ï": '&iuml;', "ð": '&eth;', "ñ": '&ntilde;', "ò": '&ograve;', "ó": '&oacute;', "ô": '&ocirc;', "õ": '&otilde;', "ö": '&ouml;', "ø": '&oslash;', "ù": '&ugrave;', "ú": '&uacute;', "û": '&ucirc;', "ü": '&uuml;', "ý": '&yacute;', "þ": '&thorn;' }
    , DECODE_PATT = /[&][^;]+[;]/gi
    ;

    /**
    * Encodes a string that might have html reserved characters in it
    * @function encode
    * @param {string} val The string that requires decoding
    */
    function encode(val) {
        if (typeof (val) !== 'string' || val === '') {
            return '';
        }
        return val.split('').map(function (val) {
            if (encodeChars.hasOwnProperty(val)) {
                return encodeChars[val];
            }
            return val;
        }).join('');
    };
    /**
    * Decodes an html encoded string
    * @function decode
    * @param {string} val The string that requires decoding
    */
    function decode(val) {
        return val.replace(DECODE_PATT, function (val) {
            if (decodeChars.hasOwnProperty(val)) {
                return decodeChars[val];
            }
            return val;
        });
    };

    /**
    * @worker
    */
    return Object.create(null, {
        "encode": {
            "enumerable": true
            , "value": encode
        }
        , "decode": {
            "enumerable": true
            , "value": decode
        }
    });
}
