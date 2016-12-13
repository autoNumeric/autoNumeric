/**
* autoNumeric.js
* @author: Bob Knothe
* @contributors: Sokolov Yura and other Github users
* @version: 2.0 - 2016-12-01 UTC 21:00
*
* Created by Robert J. Knothe on 2009-08-09. Please report any bugs to https://github.com/BobKnothe/autoNumeric
*
* Copyright (c) 2009 Robert J. Knothe http://www.decorplanit.com/plugin/
*
* The MIT License (http://www.opensource.org/licenses/mit-license.php)
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sub license, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/

/* global module, require, define */

// Functions names for ES6 exports
let autoFormat;
let autoUnFormat;
let getDefaultConfig;
let validate;
let areSettingsValid;

// AutoNumeric default settings
/**
 * List of allowed tag on which autoNumeric can be used.
 */
const allowedTagList = [
    'b',
    'caption',
    'cite',
    'code',
    'const',
    'dd',
    'del',
    'div',
    'dfn',
    'dt',
    'em',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ins',
    'kdb',
    'label',
    'li',
    'option',
    'output',
    'p',
    'q',
    's',
    'sample',
    'span',
    'strong',
    'td',
    'th',
    'u',
];

/**
 * Defaults options are public - these can be overridden by the following:
 * - HTML5 data attributes
 * - Options passed by the 'init' or 'update' methods
 * - Use jQuery's `$.extend` method for global changes - also a great way to pass ASP.NET current culture settings
 */
const defaultSettings = {
    /* Allowed thousand separator characters
     * comma = ","
     * period "full stop" = "."
     * apostrophe is escaped = "\""
     * space = " "
     * none = ""
     * NOTE: do not use numeric characters
     */
    aSep: ',',

    /* When true => removes the thousand separator, currency symbol & suffix "focusin"
     * example if the input value "$ 1,999.88 suffix"
     * on "focusin" it becomes "1999.88" and back to "$ 1,999.88 suffix" on focus out.
     */
    nSep: false,

    /* Digital grouping for the thousand separator used in Format
     * dGroup: "2", results in 99,99,99,999 India's lakhs
     * dGroup: "2s", results in 99,999,99,99,999 India's lakhs scaled
     * dGroup: "3", results in 999,999,999 default
     * dGroup: "4", results in 9999,9999,9999 used in some Asian countries
     */
    dGroup: '3',

    /* Allowed decimal separator characters
     * period "full stop" = "."
     * comma = ","
     */
    aDec: '.',

    /* Allow to declare alternative decimal separator which is automatically replaced by aDec
     * developed for countries the use a comma "," as the decimal character
     * and have keyboards\numeric pads that have a period 'full stop' as the decimal characters (Spain is an example)
     */
    altDec: null,

    /* aSign = allowed currency symbol
     * Must be in quotes aSign: "$"
     * space to the right of the currency symbol aSign: '$ '
     * space to the left of the currency symbol aSign: ' $'
     */
    aSign: '',

    /* pSign = placement of currency sign as a p=prefix or s=suffix
     * for prefix pSign: "p" (default)
     * for suffix pSign: "s"
     */
    pSign: 'p',

    /* Placement of negative sign relative to the aSign option l=left, r=right, p=prefix & s=suffix
     * -1,234.56  => default no options required
     * -$1,234.56 => {aSign: "$"}
     * $-1,234.56 => {aSign: "$", pNeg: "r"}
     * -1,234.56$ => {aSign: "$", pSign: "s", pNeg: "p"}
     * 1,234.56-  => {pNeg: "s"}
     * $1,234.56- => {aSign: "$", pNeg: "s"}
     * 1,234.56-$ => {aSign: "$", pSign: "s"}
     * 1,234.56$- => {aSign: "$", pSign: "s", pNeg: "r"}
     */
    pNeg: 'l',

    /* Additional suffix
     * Must be in quotes aSuffix: 'gross', a space is allowed aSuffix: ' dollars'
     * Numeric characters and negative sign not allowed'
     */
    aSuffix: '',

    /* Override min max limits
     * oLimits: "ceiling" adheres to vMax and ignores vMin settings
     * oLimits: "floor" adheres to vMin and ignores vMax settings
     * oLimits: "ignore" ignores both vMin & vMax
     */
    oLimits: null,

    /* Maximum possible value
     * value must be enclosed in quotes and use the period for the decimal point
     * value must be larger than vMin
     */
    vMax: '9999999999999.99', // 9.999.999.999.999,99 ~= 10000 billions

    /* Minimum possible value
     * value must be enclosed in quotes and use the period for the decimal point
     * value must be smaller than vMax
     */
    vMin: '-9999999999999.99', // -9.999.999.999.999,99 ~= 10000 billions

    /* Maximum number of decimal places = used to override decimal places set by the vMin & vMax values
     */
    mDec: null,

    /* Expanded decimal places visible when input has focus - example:
     * {eDec: "5"} and the default 2 decimal places with focus "1,000.12345" without focus "1,000.12" the results depends on the rounding method used
     * the "get" method returns the extended decimal places
     */
    eDec: null,

    /* The next three options (scaleDivisor, scaleDecimal & scaleSymbol) handle scaling of the input when the input does not have focus
     * Please note that the non-scaled value is held in data and it is advised that you use the "aStor" option to ensure retaining the value
     * ["divisor", "decimal places", "symbol"]
     * Example: with the following options set {scaleDivisor: '1000', scaleDecimal: '1', scaleSymbol: ' K'}
     * Example: focusin value "1,111.11" focusout value "1.1 K"
     */

    /* The `scaleDivisor` decides the on focus value and places the result in the input on focusout
     * Example {scaleDivisor: '1000'} or <input data-scale-divisor="1000">
     * The divisor value - does not need to be whole number but please understand that Javascript has limited accuracy in math
     * The "get" method returns the full value, including the 'hidden' decimals.
     */
    scaleDivisor: null,

    /*
     * The `scaleDecimal` option is the number of decimal place when not in focus - for this to work, `scaledDivisor` must not be `null`.
     * This is optional ; if omitted the decimal places will be the same when the input has the focus.
     */
    scaleDecimal: null,

    /*
     * The `scaleSymbol` option is a symbol placed as a suffix when not in focus.
     * This is optional too.
     */
    scaleSymbol: null,

    /* Set to true to allow the eDec value to be saved with sessionStorage
     * if ie 6 or 7 the value will be saved as a session cookie
     */
    aStor: false,

    /* method used for rounding
     * mRound: "S", Round-Half-Up Symmetric (default)
     * mRound: "A", Round-Half-Up Asymmetric
     * mRound: "s", Round-Half-Down Symmetric (lower case s)
     * mRound: "a", Round-Half-Down Asymmetric (lower case a)
     * mRound: "B", Round-Half-Even "Bankers Rounding"
     * mRound: "U", Round Up "Round-Away-From-Zero"
     * mRound: "D", Round Down "Round-Toward-Zero" - same as truncate
     * mRound: "C", Round to Ceiling "Toward Positive Infinity"
     * mRound: "F", Round to Floor "Toward Negative Infinity"
     * mRound: "N05" Rounds to the nearest .05 => same as "CHF" used in 1.9X and still valid
     * mRound: "U05" Rounds up to next .05
     * mRound: "D05" Rounds down to next .05
     */
    mRound: 'S',

    /* Controls decimal padding
     * aPad: true - always Pad decimals with zeros
     * aPad: false - does not pad with zeros.
     * Note: setting aPad to 'false' will override the 'mDec' setting.
     *
     * thanks to Jonas Johansson for the suggestion
     */
    aPad: true,

    /* Adds brackets on negative values (ie. transforms '-$ 999.99' to '(999.99)')
     * Those brackets are visible only when the field does NOT have the focus.
     * The left and right symbols should be enclosed in quotes and separated by a comma
     * nBracket: null - (default)
     * nBracket: '(,)', nBracket: '[,]', nBracket: '<,>' or nBracket: '{,}'
     */
    nBracket: null,

    /* Displayed on empty string ""
     * wEmpty: "focus" - (default) currency sign displayed and the input receives focus
     * wEmpty: "press" - currency sign displays on any key being pressed
     * wEmpty: "always" - always displays the currency sign only
     * wEmpty: "zero" - if the input has no value on focus out displays a zero "rounded" with or without a currency sign
     */
    //TODO Add an option to display the currency sign only on hover (if the input is empty)
    wEmpty: 'focus',

    /* Controls leading zero behavior
     * lZero: "allow", - allows leading zeros to be entered. Zeros will be truncated when entering additional digits. On focusout zeros will be deleted.
     * lZero: "deny", - allows only one leading zero on values less than one
     * lZero: "keep", - allows leading zeros to be entered. on focusout zeros will be retained.
     */
    lZero: 'deny',

    /* Determine if the default value will be formatted on initialization.
     * true = automatically formats the default value on initialization
     * false = will not format the default value
     */
    aForm: true,

    /* Determine if the select all keyboard command will select
     * the complete input text or only the input numeric value
     * if the currency symbol is between the numeric value and the negative sign only the numeric value will selected
     */
    sNumber: false,

    /* Helper option for ASP.NET postback
     * should be the value of the unformatted default value
     * examples:
     * no default value="" {anDefault: ""}
     * value=1234.56 {anDefault: '1234.56'}
     */
    anDefault: null,

    /* Removes formatting on submit event
     * this output format: positive nnnn.nn, negative -nnnn.nn
     * review the 'unSet' method for other formats
     */
    unSetOnSubmit: false,

    /* Allows the output to be in the locale format via the "get", "getString" & "getArray" methods
     * null or 'string' => 'nnnn.nn' or '-nnnn.nn' as text type. This is the default behavior.
     * 'number'         => nnnn.nn or -nnnn.nn as a Number (Warning: this works only for integers inferior to Number.MAX_SAFE_INTEGER)
     * ',' or '-,'      => 'nnnn,nn' or '-nnnn,nn'
     * '.-'             => 'nnnn.nn' or 'nnnn.nn-'
     * ',-'             => 'nnnn,nn' or 'nnnn,nn-'
     */
    outputType: null,

    /* Error handling function
     * true => all errors are thrown - helpful in site development
     * false => throws errors when calling methods prior to the supported element has been initialized be autoNumeric
     */
    debug: false,
};

/**
 * Wrapper variable that hold named keyboard keys with their respective keyCode as seen in DOM events.
 */
const keyCode = {
    Backspace:      8,
    Tab:            9,
    Enter:          13,
    Shift:          16,
    Ctrl:           17,
    Alt:            18,
    PauseBreak:     19,
    CapsLock:       20,
    Esc:            27,
    Space:          32,
    PageUp:         33,
    PageDown:       34,
    End:            35,
    Home:           36,
    LeftArrow:      37,
    UpArrow:        38,
    RightArrow:     39,
    DownArrow:      40,
    Insert:         45,
    Delete:         46,
    num0:           48,
    num1:           49,
    num2:           50,
    num3:           51,
    num4:           52,
    num5:           53,
    num6:           54,
    num7:           55,
    num8:           56,
    num9:           57,
    a:              65,
    b:              66,
    c:              67,
    d:              68,
    e:              69,
    f:              70,
    g:              71,
    h:              72,
    i:              73,
    j:              74,
    k:              75,
    l:              76,
    m:              77,
    n:              78,
    o:              79,
    p:              80,
    q:              81,
    r:              82,
    s:              83,
    t:              84,
    u:              85,
    v:              86,
    w:              87,
    x:              88,
    y:              89,
    z:              90,
    Windows:        91,
    RightClick:     93,
    numpad0:        96,
    numpad1:        97,
    numpad2:        98,
    numpad3:        99,
    numpad4:        100,
    numpad5:        101,
    numpad6:        102,
    numpad7:        103,
    numpad8:        104,
    numpad9:        105,
    MultiplyNumpad: 106,
    PlusNumpad:     107,
    MinusNumpad:    109,
    DotNumpad:      110,
    SlashNumpad:    111,
    F1:             112,
    F2:             113,
    F3:             114,
    F4:             115,
    F5:             116,
    F6:             117,
    F7:             118,
    F8:             119,
    F9:             120,
    F10:            121,
    F11:            122,
    F12:            123,
    NumLock:        144,
    ScrollLock:     145,
    MyComputer:     182,
    MyCalculator:   183,
    Semicolon:      186,
    Equal:          187,
    Comma:          188,
    Hyphen:         189,
    Dot:            190,
    Slash:          191,
    Backquote:      192,
    LeftBracket:    219,
    Backslash:      220,
    RightBracket:   221,
    Quote:          222,
    Command:        224,
};


(function(factory) {
    //TODO This surely can be improved by letting webpack take care of generating this UMD part
if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
} else if (typeof module === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
} else {
    // Browser globals
    factory(window.jQuery);
}
}($ => {
    // Helper functions

    /**
     * Return TRUE if the `value` is null
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     */
    function isNull(value) {
        return value === null;
    }

    /**
     * Return TRUE if the `value` is undefined
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     */
    function isUndefined(value) {
        return value === void(0);
    }

    /**
     * Return TRUE if the `value` is undefined, null or empty
     *
     * @param {*} value
     * @returns {boolean}
     */
    function isUndefinedOrNullOrEmpty(value) {
        return value === null || value === void(0) || '' === value;
    }

    /**
     * Return TRUE if the given parameter is a String
     *
     * @param {*} str
     * @returns {boolean}
     */
    function isString(str) {
        return (typeof str === 'string' || str instanceof String);
    }

    /**
     * Return TRUE if the parameter is a boolean
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     */
    function isBoolean(value) {
        return typeof(value) === 'boolean';
    }

    /**
     * Return TRUE if the parameter is a string 'true' or 'false'
     *
     * This function accepts any cases for those strings.
     * @param value
     * @returns {boolean}
     */
    function isTrueOrFalseString(value) {
        const lowercaseValue = String(value).toLowerCase();
        return lowercaseValue === 'true' || lowercaseValue === 'false';
    }

    /**
     * Return TRUE if the parameter is an object
     *
     * @param {*} reference
     * @returns {boolean}
     */
    function isObject(reference) {
        return typeof reference === 'object' && reference !== null && !Array.isArray(reference);
    }

    /**
     * Return TRUE if the given object is empty
     * cf. http://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object and http://jsperf.com/empty-object-test
     *
     * @param {object} obj
     * @returns {boolean}
     */
    function isEmptyObj(obj) {
        for (const prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Return TRUE if the parameter is a number (or a number written as a string).
     *
     * @param {*} n
     * @returns {boolean}
     */
    function isNumber(n) {
        return !isArray(n) && !isNaN(parseFloat(n)) && isFinite(n);
    }

    /**
     * Return TRUE if the parameter is an integer (and not a float).
     *
     * @param {*} n
     * @returns {boolean}
     */
    function isInt(n) {
        return typeof n === 'number' && parseFloat(n) === parseInt(n, 10) && !isNaN(n);
    }

    /**
     * Return TRUE if the text given as a parameter is valid.
     *
     * @param text
     * @returns {boolean}
     */
    function isValidPasteText(text) {
        return text !== '' && !isNaN(text);
    }

    /**
     * Return the pasted text that will be used.
     *
     * @param text
     * @param holder
     * @returns {string|void|XML|*}
     */
    function preparePastedText(text, holder) {
        return autoStrip(text, holder.settingsClone).replace(holder.settingsClone.aDec, '.');
    }

    /**
     * Return TRUE is the string `str` contains the string `needle`
     * Note: this function does not coerce the parameters types
     *
     * @param {string} str
     * @param {string} needle
     * @returns {boolean}
     */
    function contains(str, needle) {
        if (!isString(str) || !isString(needle) || str === '' || needle === '') {
            return false;
        }

        return str.indexOf(needle) !== -1;
    }

    /**
     * Return TRUE if the `needle` is in the array
     *
     * @param {Array} array
     * @param {*} needle
     * @returns {boolean}
     */
    function isInArray(needle, array) {
        if (!isArray(array) || array === [] || isUndefined(needle)) {
            return false;
        }

        return array.indexOf(needle) !== -1;
    }

    /**
     * Return TRUE if the parameter is an Array
     *
     * @param {*} arr
     * @throws Error
     * @returns {*|boolean}
     */
    function isArray(arr) {
        if (Object.prototype.toString.call([]) === '[object Array]') { // Make sure an array has a class attribute of [object Array]
            // Test passed, now check if is an Array
            return Array.isArray(arr) || (typeof arr === 'object' && Object.prototype.toString.call(arr) === '[object Array]');
        }
        else {
            throw new Error('toString message changed for Object Array'); // Verify that the string returned by `toString` does not change in the future (cf. http://stackoverflow.com/a/8365215)
        }
    }

    /**
     * Return TRUE if the parameter is a string that represents a float number, and that number has a decimal part
     *
     * @param {string} str
     * @returns {boolean}
     */
    function hasDecimals(str) {
        const [, decimalPart] = str.split('.');
        return !isUndefined(decimalPart);
    }

    /**
     * Return the number of decimal places if the parameter is a string that represents a float number, and that number has a decimal part.
     *
     * @param {string} str
     * @returns {int}
     */
    function decimalPlaces(str) {
        const [, decimalPart] = str.split('.');
        if (!isUndefined(decimalPart)) {
            return decimalPart.length;
        }

        return 0;
    }

    /**
     * Cross browser routine for getting selected range/cursor position
     */
    function getElementSelection(that) {
        const position = {};
        if (isUndefined(that.selectionStart)) {
            that.focus();
            const select = document.selection.createRange();
            position.length = select.text.length;
            select.moveStart('character', -that.value.length);
            position.end = select.text.length;
            position.start = position.end - position.length;
        } else {
            position.start = that.selectionStart;
            position.end = that.selectionEnd;
            position.length = position.end - position.start;
        }

        return position;
    }

    /**
     * Cross browser routine for setting selected range/cursor position
     */
    function setElementSelection(that, start, end) {
        if (isUndefined(that.selectionStart)) {
            that.focus();
            const range = that.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        } else {
            that.selectionStart = start;
            that.selectionEnd = end;
        }
    }

    /**
     * Function that throw error messages
     *
     * @param {string} message
     */
    function throwError(message) {
        throw new Error(message);
    }

    /**
     * Function that display a warning messages, according to the debug level.
     *
     * @param {string} message
     * @param {boolean} suppressWarnings If TRUE, then the warning message is not displayed
     */
    function warning(message, suppressWarnings = false) {
        if (suppressWarnings) {
            /* eslint no-console: 0 */
            console.warn(`Warning: ${message}`);
        }
    }

    // autoNumeric-specific functions

    /**
     * Run any callbacks found in the settings object.
     * Any parameter could be a callback:
     * - a function, which invoked with jQuery element, parameters and this parameter name and returns parameter value
     * - a name of function, attached to $(selector).autoNumeric.functionName(){} - which was called previously
     * @param $this
     * @param {object} settings
     */
    function runCallbacksFoundInTheSettingsObject($this, settings) {
        // Loops through the settings object (option array) to find the following
        $.each(settings, (k, val) => {
            if (typeof val === 'function') {
                settings[k] = val($this, settings, k);
            } else if (typeof $this.autoNumeric[val] === 'function') {
                // Calls the attached function from the html5 data example: data-a-sign="functionName"
                settings[k] = $this.autoNumeric[val]($this, settings, k);
            }
        });
    }

    /**
     * Determine the maximum decimal length from the vMin and vMax settings
     */
    function maximumVMinAndVMaxDecimalLength(vMin, vMax) {
        return Math.max(decimalPlaces(vMin), decimalPlaces(vMax));
    }

    /**
     * Strip all unwanted characters and leave only a number alert
     *
     * @param {string} s
     * @param {object} settings
     * @returns {string|*}
     */
    function autoStrip(s, settings) {
        if (settings.aSign !== '') {
            // Remove currency sign
            s = s.replace(settings.aSign, '');
        }
        if (settings.aSuffix) {
            // Remove suffix
            while (contains(s, settings.aSuffix)) {
                s = s.replace(settings.aSuffix, '');
            }
        }

        // First replace anything before digits
        s = s.replace(settings.skipFirstAutoStrip, '$1$2');

        if ((settings.pNeg === 's' || (settings.pSign === 's' && settings.pNeg !== 'p')) && contains(s, '-') && s !== '') {
            settings.trailingNegative = true;
        }

        // Then replace anything after digits
        s = s.replace(settings.skipLastAutoStrip, '$1');

        // Then remove any uninteresting characters
        s = s.replace(settings.allowedAutoStrip, '');
        if (settings.altDec) {
            s = s.replace(settings.altDec, settings.aDec);
        }

        // Get only number string
        const m = s.match(settings.numRegAutoStrip);
        s = m ? [m[1], m[2], m[3]].join('') : '';

        if (settings.lZero === 'allow' || settings.lZero === 'keep') {
            let nSign = '';
            const [integerPart, decimalPart] = s.split(settings.aDec);
            let modifiedIntegerPart = integerPart;
            if (contains(modifiedIntegerPart, settings.aNeg)) {
                nSign = settings.aNeg;
                modifiedIntegerPart = modifiedIntegerPart.replace(settings.aNeg, '');
            }

            // Strip leading zero on positive value if need
            if (nSign === '' && modifiedIntegerPart.length > settings.mIntPos && modifiedIntegerPart.charAt(0) === '0') {
                modifiedIntegerPart = modifiedIntegerPart.slice(1);
            }

            // Strip leading zero on negative value if need
            if (nSign !== '' && modifiedIntegerPart.length > settings.mIntNeg && modifiedIntegerPart.charAt(0) === '0') {
                modifiedIntegerPart = modifiedIntegerPart.slice(1);
            }

            s = `${nSign}${modifiedIntegerPart}${isUndefined(decimalPart)?'':settings.aDec + decimalPart}`;
        }

        if ((settings.onOff && settings.lZero === 'deny') ||
            (!settings.onOff && settings.lZero === 'allow')) {
            s = s.replace(settings.stripReg, '$1$2');
        }

        return s;
    }

    /**
     * Places or removes brackets on negative values
     *
     * @param {string} s
     * @param {object} settings
     * @returns {*}
     */
    function negativeBracket(s, settings) {
        if ((settings.pSign === 'p' && settings.pNeg === 'l') || (settings.pSign === 's' && settings.pNeg === 'p')) {
            const [firstBracket, lastBracket] = settings.nBracket.split(',');
            if (!settings.onOff) {
                s = s.replace(settings.aNeg, '');
                s = firstBracket + s + lastBracket;
            } else if (settings.onOff && s.charAt(0) === firstBracket) {
                s = s.replace(firstBracket, settings.aNeg);
                s = s.replace(lastBracket, '');
            }
        }

        return s;
    }

    /**
     * convert locale format to Javascript numeric string
     * allows locale decimal separator to be a period or comma - no thousand separator allowed of currency signs allowed
     * '1234.56'    OK
     * '-1234.56'   OK
     * '1234.56-'   OK
     * '1234,56'    OK
     * '-1234,56'   OK
     * '1234,56-'   OK
     */
    function fromLocale(s) {
        s = s.replace(',', '.');
        if (contains(s, '-') && s.lastIndexOf('-') === s.length - 1) {
            s = s.replace('-', '');
            s = '-' + s;
        }

        return s;
    }

    /**
     * Converts the ISO numeric string to the locale decimal and minus sign placement.
     * See the "outputType" option definition for more details.
     */
    function toLocale(value, locale) {
        if (isNull(locale) || locale === 'string') {
            return value;
        }

        let result;
        switch (locale) {
            case 'number':
                result = Number(value);
                break;
            case '.-':
                result = contains(value, '-') ? value.replace('-', '') + '-' : value;
                break;
            case ',':
            case '-,':
                result = value.replace('.', ',');
                break;
            case ',-':
                result = value.replace('.', ',');
                result = contains(result, '-') ? result.replace('-', '') + '-' : result;
                break;
            // The default case
            case '.':
            case '-.':
                result = value;
                break;
            default :
                throwError(`The given outputType [${locale}] option is not recognized.`);
        }

        return result;
    }

    /**
     * Prepare number string to be converted to real number
     *
     * @param {string} s
     * @param {object} settings
     * @returns {*}
     */
    function fixNumber(s, settings) {
        if (settings.aDec !== '.') {
            s = s.replace(settings.aDec, '.');
        }
        if (settings.aNeg !== '-' && settings.aNeg !== '') {
            s = s.replace(settings.aNeg, '-');
        }
        if (!s.match(/\d/)) {
            // The default value returned by `get` is formatted with decimals
            s += '0.00';
        }

        return s;
    }

    /**
     * Prepare real number to be converted to our format
     *
     * @param {string} s
     * @param {object} settings
     * @returns {*}
     */
    function presentNumber(s, settings) {
        if (settings.aNeg !== '-' && settings.aNeg !== '') {
            s = s.replace('-', settings.aNeg);
        }
        if (settings.aDec !== '.') {
            s = s.replace('.', settings.aDec);
        }

        return s;
    }

    /**
     * Private function to check for empty value
     *
     * @param {string} inputValue
     * @param {object} settings
     * @param {boolean} signOnEmpty
     * @returns {*}
     */
    function checkEmpty(inputValue, settings, signOnEmpty) {
        if (inputValue === '' || inputValue === settings.aNeg) {
            if (settings.wEmpty === 'always' || signOnEmpty) {
                return (settings.pNeg === 'l') ? inputValue + settings.aSign + settings.aSuffix : settings.aSign + inputValue + settings.aSuffix;
            }

            return inputValue;
        }

        return null;
    }

    /**
     * Private function that formats our number
     *
     * @param {string} inputValue
     * @param {object} settings
     * @returns {*}
     */
    function autoGroup(inputValue, settings) {
        if (settings.strip) {
            inputValue = autoStrip(inputValue, settings);
        }

        if (settings.trailingNegative && !contains(inputValue, '-')) {
            inputValue = '-' + inputValue;
        }

        const empty = checkEmpty(inputValue, settings, true);
        const isNegative = contains(inputValue, '-');
        if (isNegative) {
            inputValue = inputValue.replace('-', '');
        }

        if (!isNull(empty)) {
            return empty;
        }

        settings.dGroup = settings.dGroup.toString();
        let digitalGroup;
        switch (settings.dGroup) {
            case '2':
                digitalGroup = /(\d)((\d)(\d{2}?)+)$/;
                break;
            case '2s':
                digitalGroup = /(\d)((?:\d{2}){0,2}\d{3}(?:(?:\d{2}){2}\d{3})*?)$/;
                break;
            case '4':
                digitalGroup = /(\d)((\d{4}?)+)$/;
                break;
            default :
                digitalGroup = /(\d)((\d{3}?)+)$/;
        }

        // Splits the string at the decimal string
        let [integerPart, decimalPart] = inputValue.split(settings.aDec);
        if (settings.altDec && isUndefined(decimalPart)) {
            [integerPart, decimalPart] = inputValue.split(settings.altDec);
        }

        if (settings.aSep !== '') {
            // Re-inserts the thousand separator via a regular expression
            while (digitalGroup.test(integerPart)) {
                integerPart = integerPart.replace(digitalGroup, `$1${settings.aSep}$2`);
            }
        }

        if (settings.mDec !== 0 && !isUndefined(decimalPart)) {
            if (decimalPart.length > settings.mDec) {
                decimalPart = decimalPart.substring(0, settings.mDec);
            }

            // Joins the whole number with the decimal value
            inputValue = integerPart + settings.aDec + decimalPart;
        } else {
            // Otherwise if it's an integer
            inputValue = integerPart;
        }

        if (settings.pSign === 'p') {
            if (isNegative) {
                switch (settings.pNeg) {
                    case 'l':
                        inputValue = settings.aNeg + settings.aSign + inputValue;
                        break;
                    case 'r':
                        inputValue = settings.aSign + settings.aNeg + inputValue;
                        break;
                    case 's':
                        inputValue = settings.aSign + inputValue + settings.aNeg;
                        break;
                    default :
                        //
                }
            } else {
                inputValue = settings.aSign + inputValue;
            }
        }

        if (settings.pSign === 's') {
            if (isNegative) {
                switch (settings.pNeg) {
                    case 'r':
                        inputValue = inputValue + settings.aSign + settings.aNeg;
                        break;
                    case 'l':
                        inputValue = inputValue + settings.aNeg + settings.aSign;
                        break;
                    case 'p':
                        inputValue = settings.aNeg + inputValue + settings.aSign;
                        break;
                    default :
                    //
                }
            } else {
                inputValue = inputValue + settings.aSign;
            }
        }

        // Removes the negative sign and places brackets
        if (settings.nBracket !== null && (settings.rawValue < 0 || inputValue.charAt(0) === '-')) {
            inputValue = negativeBracket(inputValue, settings);
        }
        settings.trailingNegative = false;

        return inputValue + settings.aSuffix;
    }

    /**
     * Truncate not needed zeros
     *
     * @param {string} roundedInputValue
     * @param rDec
     * @returns {void|XML|string|*}
     */
    function truncateZeros(roundedInputValue, rDec) {
        let regex;
        switch (rDec) {
            case 0:
                // Prevents padding - removes trailing zeros until the first significant digit is encountered
                regex = /(\.(?:\d*[1-9])?)0*$/;
                break;
            case 1:
                // Allows padding when mDec equals one - leaves one zero trailing the decimal character
                regex = /(\.\d(?:\d*[1-9])?)0*$/;
                break;
            default :
                // Removes access zeros to the mDec length when aPad is set to true
                regex = new RegExp(`(\\.\\d{${rDec}}(?:\\d*[1-9])?)0*`);
        }

        // If there are no decimal places, we don't need a decimal point at the end
        roundedInputValue = roundedInputValue.replace(regex, '$1');
        if (rDec === 0) {
            roundedInputValue = roundedInputValue.replace(/\.$/, '');
        }

        return roundedInputValue;
    }

    /**
     * round number after setting by pasting or $().autoNumericSet()
     * private function for round the number
     * please note this handled as text - JavaScript math function can return inaccurate values
     * also this offers multiple rounding methods that are not easily accomplished in JavaScript
     *
     * @param {string} inputValue
     * @param {object} settings
     * @returns {*}
     */
    function autoRound(inputValue, settings) { // value to string
        inputValue = (inputValue === '') ? '0' : inputValue.toString();
        if (settings.mRound === 'N05' || settings.mRound === 'CHF' || settings.mRound === 'U05' || settings.mRound === 'D05') {
            switch (settings.mRound) {
                case 'N05':
                    inputValue = (Math.round(inputValue * 20) / 20).toString();
                    break;
                case 'U05':
                    inputValue = (Math.ceil(inputValue * 20) / 20).toString();
                    break;
                default :
                    inputValue = (Math.floor(inputValue * 20) / 20).toString();
            }

            let result;
            if (!contains(inputValue, '.')) {
                result = inputValue + '.00';
            } else if (inputValue.length - inputValue.indexOf('.') < 3) {
                result = inputValue + '0';
            } else {
                result = inputValue;
            }
            return result;
        }

        let ivRounded = '';
        let i = 0;
        let nSign = '';
        let rDec;

        // sets the truncate zero method
        if (settings.aPad) {
            rDec = settings.mDec;
        } else {
            rDec = 0;
        }

        // Checks if the inputValue (input Value) is a negative value
        if (inputValue.charAt(0) === '-') {
            nSign = '-';

            // Removes the negative sign that will be added back later if required
            inputValue = inputValue.replace('-', '');
        }

        // Append a zero if the first character is not a digit (then it is likely to be a dot)
        if (!inputValue.match(/^\d/)) {
            inputValue = '0' + inputValue;
        }

        // Determines if the value is equal to zero. If it is, remove the negative sign
        if (nSign === '-' && Number(inputValue) === 0) {
            nSign = '';
        }

        // Trims leading zero's as needed
        if ((Number(inputValue) > 0 && settings.lZero !== 'keep') || (inputValue.length > 0 && settings.lZero === 'allow')) {
            inputValue = inputValue.replace(/^0*(\d)/, '$1');
        }

        const dPos = inputValue.lastIndexOf('.');
        const inputValueHasADot = dPos === -1;

        // Virtual decimal position
        const vdPos = inputValueHasADot ? inputValue.length - 1 : dPos;

        // Checks decimal places to determine if rounding is required :
        // Check if no rounding is required
        let cDec = (inputValue.length - 1) - vdPos;

        if (cDec <= settings.mDec) {
            // Check if we need to pad with zeros
            ivRounded = inputValue;
            if (cDec < rDec) {
                if (inputValueHasADot) {
                    ivRounded += settings.aDec;
                }

                let zeros = '000000';
                while (cDec < rDec) {
                    zeros = zeros.substring(0, rDec - cDec);
                    ivRounded += zeros;
                    cDec += zeros.length;
                }
            } else if (cDec > rDec) {
                ivRounded = truncateZeros(ivRounded, rDec);
            } else if (cDec === 0 && rDec === 0) {
                ivRounded = ivRounded.replace(/\.$/, '');
            }

            return (Number(ivRounded) === 0) ? ivRounded : nSign + ivRounded;
        }

        // Rounded length of the string after rounding
        let rLength;
        if (inputValueHasADot) {
            rLength = settings.mDec - 1;
        } else {
            rLength = settings.mDec + dPos;
        }

        const tRound = Number(inputValue.charAt(rLength + 1));
        const odd = (inputValue.charAt(rLength) === '.') ? (inputValue.charAt(rLength - 1) % 2) : (inputValue.charAt(rLength) % 2);
        let ivArray = inputValue.substring(0, rLength + 1).split('');

        if ((tRound > 4 && settings.mRound === 'S')                  || // Round half up symmetric
            (tRound > 4 && settings.mRound === 'A' && nSign === '')  || // Round half up asymmetric positive values
            (tRound > 5 && settings.mRound === 'A' && nSign === '-') || // Round half up asymmetric negative values
            (tRound > 5 && settings.mRound === 's')                  || // Round half down symmetric
            (tRound > 5 && settings.mRound === 'a' && nSign === '')  || // Round half down asymmetric positive values
            (tRound > 4 && settings.mRound === 'a' && nSign === '-') || // Round half down asymmetric negative values
            (tRound > 5 && settings.mRound === 'B')                  || // Round half even "Banker's Rounding"
            (tRound === 5 && settings.mRound === 'B' && odd === 1)   || // Round half even "Banker's Rounding"
            (tRound > 0 && settings.mRound === 'C' && nSign === '')  || // Round to ceiling toward positive infinite
            (tRound > 0 && settings.mRound === 'F' && nSign === '-') || // Round to floor toward negative infinite
            (tRound > 0 && settings.mRound === 'U')) {                  // Round up away from zero
            // Round up the last digit if required, and continue until no more 9's are found
            for (i = (ivArray.length - 1); i >= 0; i -= 1) {
                if (ivArray[i] !== '.') {
                    ivArray[i] = +ivArray[i] + 1;
                    if (ivArray[i] < 10) {
                        break;
                    }

                    if (i > 0) {
                        ivArray[i] = '0';
                    }
                }
            }
        }

        // Reconstruct the string, converting any 10's to 0's
        ivArray = ivArray.slice(0, rLength + 1);

        // Return the rounded value
        ivRounded = truncateZeros(ivArray.join(''), rDec);

        return (Number(ivRounded) === 0) ? ivRounded : nSign + ivRounded;
    }

    /**
     * Truncates the decimal part of a number
     *
     * @param {string} s
     * @param {object} settings
     * @param {string} paste
     * @returns {*}
     */
    function truncateDecimal(s, settings, paste) {
        const aDec = settings.aDec;
        const mDec = settings.mDec;
        s = (paste === 'paste') ? autoRound(s, settings) : s;

        if (aDec && mDec) {
            const [integerPart, decimalPart] = s.split(aDec);

            // truncate decimal part to satisfying length since we would round it anyway
            if (decimalPart && decimalPart.length > mDec) {
                if (mDec > 0) {
                    const modifiedDecimalPart = decimalPart.substring(0, mDec);
                    s = `${integerPart}${aDec}${modifiedDecimalPart}`;
                } else {
                    s = integerPart;
                }
            }
        }

        return s;
    }

    /**
     * Function to parse vMin, vMax & the input value to prepare for testing to determine if the value falls within the min / max range
     * Return an object example: vMin: "999999999999999.99" returns the following "{s: -1, e: 12, c: Array[15]}"
     * This function is adapted from Big.js https://github.com/MikeMcl/big.js/
     * Many thanks to Mike
     */
    function parseStr(n) {
        const x = {};
        let e;
        let i;
        let nL;
        let j;

        // Minus zero?
        if (n === 0 && 1 / n < 0) {
            n = '-0';
        }

        // Determine sign. 1 positive, -1 negative
        n = n.toString();
        if (n.charAt(0) === '-') {
            n = n.slice(1);
            x.s = -1;
        } else {
            x.s = 1;
        }

        // Decimal point?
        e = n.indexOf('.');
        if (e > -1) {
            n = n.replace('.', '');
        }

        // length of string if no decimal character
        if (e < 0) {
            // Integer
            e = n.length;
        }

        // Determine leading zeros
        i = (n.search(/[1-9]/i) === -1) ? n.length : n.search(/[1-9]/i);
        nL = n.length;
        if (i === nL) {
            // Zero
            x.e = 0;
            x.c = [0];
        } else {
            // Determine trailing zeros
            for (j = nL - 1; n.charAt(j) === '0'; j -= 1) {
                nL -= 1;
            }
            nL -= 1;

            // Decimal location
            x.e = e - i - 1;
            x.c = [];

            // Convert string to array of digits without leading/trailing zeros
            for (e = 0; i <= nL; i += 1) {
                x.c[e] = +n.charAt(i);
                e += 1;
            }
        }

        return x;
    }

    /**
     * Function to test if the input value falls with the Min / Max settings
     * This uses the parsed strings for the above parseStr function
     * This function is adapted from Big.js https://github.com/MikeMcl/big.js/
     * Many thanks to Mike
     */
    function testMinMax(y, x) {
        const xc = x.c;
        const yc = y.c;
        let i = x.s;
        let j = y.s;
        let k = x.e;
        let l = y.e;

        // Either zero?
        if (!xc[0] || !yc[0]) {
            let result;
            if (!xc[0]) {
                result = !yc[0]?0:-j;
            } else {
                result = i;
            }
            return result;
        }

        // Signs differ?
        if (i !== j) {
            return i;
        }
        const xNeg = i < 0;

        // Compare exponents
        if (k !== l) {
            return (k > l ^ xNeg)?1:-1;
        }
        i = -1;
        k = xc.length;
        l = yc.length;
        j = (k < l) ? k : l;

        // Compare digit by digit
        for (i += 1; i < j; i += 1) {
            if (xc[i] !== yc[i]) {
                return (xc[i] > yc[i] ^ xNeg)?1:-1;
            }
        }

        // Compare lengths
        let result;
        if (k === l) {
            result = 0;
        } else {
            result = (k > l ^ xNeg)?1:-1;
        }

        return result;
    }

    /**
     * Check that the number satisfy the format conditions
     * and lays between settings.vMin and settings.vMax
     * and the string length does not exceed the digits in settings.vMin and settings.vMax
     *
     * @param {string} s
     * @param {object} settings
     * @returns {*}
     */
    function autoCheck(s, settings) {
        s = s.toString();
        s = s.replace(',', '.');
        const minParse = parseStr(settings.vMin);
        const maxParse = parseStr(settings.vMax);
        const valParse = parseStr(s);

        let result;
        switch (settings.oLimits) {
            case 'floor':
                result = [testMinMax(minParse, valParse) > -1, true];
                break;
            case 'ceiling':
                result = [true, testMinMax(maxParse, valParse) < 1];
                break;
            case 'ignore':
                result = [true, true];
                break;
            default:
                result = [testMinMax(minParse, valParse) > -1, testMinMax(maxParse, valParse) < 1];
        }

        return result;
    }

    /**
     * thanks to Anthony & Evan C
     */
    function autoGet(obj) {
        /*
         * If the parameter is a string (and therefore is a CSS selector), then we need to modify this string in order
         * for jQuery to be able to parse the selector correctly.
         * cf. http://learn.jquery.com/using-jquery-core/faq/how-do-i-select-an-element-by-an-id-that-has-characters-used-in-css-notation/
         */
        if (isString(obj)) {
            //TODO This block is apparently never entered. We should remove it after making sure that's 100% the case
            obj = `#${obj.replace(/(:|\.|\[|]|,|=)/g, '\\$1')}`;
        }

        return $(obj);
    }

    /**
     * Function that attach the autoNumeric field properties to the DOM element via an AutoNumericHolder object.
     *
     * @param $that
     * @param {object} settings
     * @param {boolean} update
     * @returns {*}
     */
    function getHolder($that, settings, update = false) {
        let data = $that.data('autoNumeric');
        if (!data) {
            data = {};
            $that.data('autoNumeric', data);
        }

        let holder = data.holder;
        if (update || (isUndefined(holder) && settings)) {
            holder = new AutoNumericHolder($that.get(0), settings);
            data.holder = holder;
        }

        return holder;
    }

    /**
     * Original settings saved for use when eDec & nSep options are being used.
     * Those original settings are used exclusively in the `focusin` and `focusout` event handlers.
     *
     * @param {object} settings
     */
    function keepAnOriginalSettingsCopy(settings) {
        settings.oDec     = settings.mDec;
        settings.oPad     = settings.aPad;
        settings.oBracket = settings.nBracket;
        settings.oSep     = settings.aSep;
        settings.oSign    = settings.aSign;
        settings.oSuffix  = settings.aSuffix;
    }

    /**
     * original settings saved for use when eDec & nSep options are being used
     * taken from Quirksmode
     */
    function readCookie(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        let c = '';
        for (let i = 0; i < ca.length; i += 1) {
            c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }

        return null;
    }

    /**
     * Test if sessionStorage is supported - taken from modernizr
     */
    function storageTest() {
        const mod = 'modernizr';
        try {
            sessionStorage.setItem(mod, mod);
            sessionStorage.removeItem(mod);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * creates or removes sessionStorage or cookie depending on browser support
     */
    function autoSave(element, settings, toDo) {
        if (settings.aStor) {
            const storedName = (element.name !== '' && !isUndefined(element.name)) ?`AUTO_${decodeURIComponent(element.name)}` :`AUTO_${element.id}`;
            let date;
            let expires;

            // sets cookie for browser that do not support sessionStorage IE 6 & IE 7
            if (storageTest() === false) {
                switch (toDo) {
                    case 'set':
                        document.cookie = `${storedName}=${settings.rawValue}; expires= ; path=/`;
                        break;
                    case 'wipe':
                        date = new Date();
                        date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));
                        expires = '; expires=' + date.toUTCString(); // Note : `toGMTString()` has been deprecated (cf. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toGMTString)
                        document.cookie = `${storedName}='' ;${expires}; path=/`;
                        break;
                    case 'get':
                        return readCookie(storedName);
                }
            } else {
                switch (toDo) {
                    case 'set':
                        sessionStorage.setItem(storedName, settings.rawValue);
                        break;
                    case 'wipe':
                        sessionStorage.removeItem(storedName);
                        break;
                    case 'get':
                        return sessionStorage.getItem(storedName);
                }
            }
        }
    }

    /**
     * Holder object for field properties
     */
    class AutoNumericHolder {
        /**
         * Class constructor
         *
         * @param {HTMLElement} that - A reference to the current DOM element
         * @param {object} settings
         */
        constructor(that, settings) {
            this.settings = settings;
            this.that = that;
            this.$that = $(that);
            this.formatted = false;
            this.settingsClone = settings;
            this.value = that.value;
        }

        _updateFieldProperties(e) {
            this.value = this.that.value;
            this.ctrlKey = e.ctrlKey;
            this.cmdKey = e.metaKey;
            this.shiftKey = e.shiftKey;

            // keypress event overwrites meaningful value of e.keyCode
            this.selection = getElementSelection(this.that);
            if (e.type === 'keydown' || e.type === 'keyup') {
                this.kdCode = e.keyCode;
            }
            this.which = e.which;
        }

        _setSelection(start, end, setReal) {
            start = Math.max(start, 0);
            end = Math.min(end, this.that.value.length);
            this.selection = {
                start,
                end,
                length: end - start,
            };
            if (isUndefined(setReal) || setReal) {
                setElementSelection(this.that, start, end);
            }
        }

        _setPosition(pos, setReal) {
            this._setSelection(pos, pos, setReal);
        }

        _getBeforeAfter() {
            const value = this.value;
            //FIXME `this.selection` can sometimes be undefined, found why and fix it
            const left = value.substring(0, this.selection.start);
            const right = value.substring(this.selection.end, value.length);

            return [left, right];
        }

        _getBeforeAfterStripped() {
            const settingsClone = this.settingsClone;
            let [left, right] = this._getBeforeAfter();
            left = autoStrip(left, this.settingsClone);
            right = autoStrip(right, this.settingsClone);

            if (settingsClone.trailingNegative && !contains(left, '-')) {
                left = '-' + left;
                right = (right === '-') ? '' : right;
            }

            settingsClone.trailingNegative = false;

            return [left, right];
        }

        /**
         * strip parts from excess characters and leading zeroes
         */
        _normalizeParts(left, right) {
            const settingsClone = this.settingsClone;

            // prevents multiple leading zeros from being entered
            left = autoStrip(left, settingsClone);

            // if right is not empty and first character is not aDec,
            right = autoStrip(right, settingsClone);
            if (settingsClone.trailingNegative && !contains(left, '-')) {
                left = '-' + left;
                settingsClone.trailingNegative = false;
            }
            if ((left === '' || left === settingsClone.aNeg) && settingsClone.lZero === 'deny') {
                if (right > '') {
                    right = right.replace(/^0*(\d)/, '$1');
                }
            }

            // insert zero if has leading dot
            this.newValue = left + right;
            if (settingsClone.aDec) {
                const m = this.newValue.match(new RegExp(`^${settingsClone.aNegRegAutoStrip}\\${settingsClone.aDec}`));
                if (m) {
                    left = left.replace(m[1], m[1] + '0');
                    this.newValue = left + right;
                }
            }

            return [left, right];
        }

        /**
         * Set part of number to value while keeping the cursor position
         */
        _setValueParts(left, right, advent) {
            const settingsClone = this.settingsClone;
            const parts = this._normalizeParts(left, right);
            const [minTest, maxTest] = autoCheck(this.newValue, settingsClone);
            let position = parts[0].length;
            this.newValue = parts.join('');

            if (minTest && maxTest) {
                this.newValue = truncateDecimal(this.newValue, settingsClone, advent);
                const testValue = (contains(this.newValue, ',')) ? this.newValue.replace(',', '.') : this.newValue;
                if (testValue === '' || testValue === settingsClone.aNeg) {
                    settingsClone.rawValue = '';
                } else {
                    settingsClone.rawValue = testValue;
                }

                if (position > this.newValue.length) {
                    position = this.newValue.length;
                }

                // Make sure when the user enter a '0' on the far left with a leading zero option set to 'deny', that the caret does not moves since the input is dropped (fix issue #283)
                if (position === 1 && parts[0] === '0' && settingsClone.lZero === 'deny') {
                    position = 0;
                }

                this.value = this.newValue;
                this._setPosition(position, false);

                return true;
            }

            if (!minTest) {
                this.$that.trigger('autoNumeric:minExceeded');
            } else if (!maxTest) {
                this.$that.trigger('autoNumeric:maxExceeded');
            }

            return false;
        }

        /**
         * helper function for _expandSelectionOnSign
         * returns sign position of a formatted value
         */
        _signPosition() {
            const settingsClone = this.settingsClone;
            const aSign = settingsClone.aSign;
            const that = this.that;

            if (aSign) {
                const aSignLen = aSign.length;
                if (settingsClone.pSign === 'p') {
                    const hasNeg = settingsClone.aNeg && that.value && that.value.charAt(0) === settingsClone.aNeg;
                    return hasNeg ? [1, aSignLen + 1] : [0, aSignLen];
                }
                const valueLen = that.value.length;
                return [valueLen - aSignLen, valueLen];
            }

            return [1000, -1];
        }

        /**
         * Expands selection to cover whole sign
         * Prevents partial deletion/copying/overwriting of a sign
         */
        _expandSelectionOnSign(setReal) {
            const signPosition = this._signPosition();
            const selection = this.selection;

            // If selection catches something except sign and catches only space from sign
            if (selection.start < signPosition[1] && selection.end > signPosition[0]) {
                // Then select without empty space
                if ((selection.start < signPosition[0] || selection.end > signPosition[1]) && this.value.substring(Math.max(selection.start, signPosition[0]), Math.min(selection.end, signPosition[1])).match(/^\s*$/)) {
                    if (selection.start < signPosition[0]) {
                        this._setSelection(selection.start, signPosition[0], setReal);
                    } else {
                        this._setSelection(signPosition[1], selection.end, setReal);
                    }
                } else {
                    // Else select with whole sign
                    this._setSelection(Math.min(selection.start, signPosition[0]), Math.max(selection.end, signPosition[1]), setReal);
                }
            }
        }

        /**
         * try to strip pasted value to digits
         */
        _checkPaste() {
            if (!isUndefined(this.valuePartsBeforePaste)) {
                const oldParts = this.valuePartsBeforePaste;
                const [left, right] = this._getBeforeAfter();

                // try to strip pasted value first
                delete this.valuePartsBeforePaste;
                const modifiedLeftPart = left.substr(0, oldParts[0].length) + autoStrip(left.substr(oldParts[0].length), this.settingsClone);
                if (!this._setValueParts(modifiedLeftPart, right, 'paste')) {
                    this.value = oldParts.join('');
                    this._setPosition(oldParts[0].length, false);
                }
            }
        }

        /**
         * Process pasting, cursor moving and skipping of not interesting keys
         * If returns true, further processing is not performed
         */
        _skipAlways(e) {
            const kdCode = this.kdCode;
            const which = this.which;
            const ctrlKey = this.ctrlKey;
            const cmdKey = this.cmdKey;

            // catch the ctrl up on ctrl-v
            const shiftKey = this.shiftKey;
            if (((ctrlKey || cmdKey) && e.type === 'keyup' && !isUndefined(this.valuePartsBeforePaste)) || (shiftKey && kdCode === keyCode.Insert)) {
                this._checkPaste();
                return false;
            }

            // skip Fx keys, windows keys, other special keys
            if ((kdCode >= keyCode.F1 && kdCode <= keyCode.F12) ||
                (kdCode >= keyCode.Windows && kdCode <= keyCode.RightClick) ||
                (kdCode >= keyCode.Tab && kdCode < keyCode.Space) ||
                (kdCode < keyCode.Backspace &&
                (which === 0 || which === kdCode)) ||
                kdCode === keyCode.NumLock ||
                kdCode === keyCode.ScrollLock ||
                kdCode === keyCode.Insert ||
                kdCode === keyCode.Command) {
                return true;
            }

            // if select all (a)
            if ((ctrlKey || cmdKey) && kdCode === keyCode.a) {
                if (this.settings.sNumber) {
                    // preventDefault is used here to prevent the browser to first select all the input text (including the currency sign), otherwise we would see that whole selection first in a flash, then the selection with only the number part without the currency sign.
                    e.preventDefault();
                    const valueLen = this.that.value.length;
                    const aSignLen = this.settings.aSign.length;
                    const negLen = (!contains(this.that.value, '-'))?0:1;
                    const aSuffixLen = this.settings.aSuffix.length;
                    const pSign = this.settings.pSign;
                    const pNeg = this.settings.pNeg;

                    let start;
                    if (pSign === 's') {
                        start = 0;
                    } else {
                        start = (pNeg === 'l' && negLen === 1 && aSignLen > 0)?aSignLen + 1:aSignLen;
                    }

                    let end;
                    if (pSign === 'p') {
                        end = valueLen - aSuffixLen;
                    } else {
                        switch (pNeg) {
                            case 'l':
                                end = valueLen - (aSuffixLen + aSignLen);
                                break;
                            case 'r':
                                end = (aSignLen > 0)?valueLen - (aSignLen + negLen + aSuffixLen):valueLen - (aSignLen + aSuffixLen);
                                break;
                            default :
                                end = valueLen - (aSignLen + aSuffixLen);
                        }
                    }

                    setElementSelection(this.that, start, end);
                }

                return true;
            }

            // if copy (c)
            if ((ctrlKey || cmdKey) && (kdCode === keyCode.c || kdCode === keyCode.v || kdCode === keyCode.x)) {
                if (e.type === 'keydown') {
                    this._expandSelectionOnSign();
                }

                // try to prevent wrong paste
                if (kdCode === keyCode.v || kdCode === keyCode.Insert) {
                    if (e.type === 'keydown' || e.type === 'keypress') {
                        if (isUndefined(this.valuePartsBeforePaste)) {
                            this.valuePartsBeforePaste = this._getBeforeAfter();
                        }
                    } else {
                        this._checkPaste();
                    }
                }

                return e.type === 'keydown' || e.type === 'keypress' || kdCode === keyCode.c;
            }

            if (ctrlKey || cmdKey) {
                return true;
            }

            // jump over thousand separator
            if (kdCode === keyCode.LeftArrow || kdCode === keyCode.RightArrow) {
                const aSep = this.settingsClone.aSep;
                const aDec = this.settingsClone.aDec;
                const startJump = this.selection.start;
                const value = this.that.value;
                if (e.type === 'keydown' && !this.shiftKey) {
                    if (kdCode === keyCode.LeftArrow && (value.charAt(startJump - 2) === aSep || value.charAt(startJump - 2) === aDec)) {
                        this._setPosition(startJump - 1);
                    } else if (kdCode === keyCode.RightArrow && (value.charAt(startJump + 1) === aSep || value.charAt(startJump + 1) === aDec)) {
                        this._setPosition(startJump + 1);
                    }
                }
                return true;
            }

            return kdCode >= keyCode.PageDown && kdCode <= keyCode.DownArrow;
        }

        /**
         * process deletion of characters when the minus sign is to the right of the numeric characters
         */
        _processTrailing([left, right]) {
            const settingsClone = this.settingsClone;
            if (settingsClone.pSign === 'p' && settingsClone.pNeg === 's') {
                if (this.kdCode === 8) {
                    settingsClone.caretFix = (this.selection.start >= this.value.indexOf(settingsClone.aSuffix) && settingsClone.aSuffix !== '');
                    if (this.value.charAt(this.selection.start - 1) === '-') {
                        left = left.substring(1);
                    } else if (this.selection.start <= this.value.length - settingsClone.aSuffix.length) {
                        left = left.substring(0, left.length - 1);
                    }
                } else {
                    settingsClone.caretFix = (this.selection.start >= this.value.indexOf(settingsClone.aSuffix) && settingsClone.aSuffix !== '');
                    if (this.selection.start >= this.value.indexOf(settingsClone.aSign) + settingsClone.aSign.length) {
                        right = right.substring(1, right.length);
                    }
                    if (contains(left, '-') && this.value.charAt(this.selection.start) === '-') {
                        left = left.substring(1);
                    }
                }
            }

            if (settingsClone.pSign === 's' && settingsClone.pNeg === 'l') {
                settingsClone.caretFix = (this.selection.start >= this.value.indexOf(settingsClone.aNeg) + settingsClone.aNeg.length);
                if (this.kdCode === 8) {
                    if (this.selection.start === (this.value.indexOf(settingsClone.aNeg) + settingsClone.aNeg.length) && contains(this.value, settingsClone.aNeg)) {
                        left = left.substring(1);
                    } else if (left !== '-' && ((this.selection.start <= this.value.indexOf(settingsClone.aNeg)) || !contains(this.value, settingsClone.aNeg))) {
                        left = left.substring(0, left.length - 1);
                    }
                } else {
                    if (left[0] === '-') {
                        right = right.substring(1);
                    }
                    if (this.selection.start === this.value.indexOf(settingsClone.aNeg) && contains(this.value, settingsClone.aNeg)) {
                        left = left.substring(1);
                    }
                }
            }

            if (settingsClone.pSign === 's' && settingsClone.pNeg === 'r') {
                settingsClone.caretFix = (this.selection.start >= this.value.indexOf(settingsClone.aNeg) + settingsClone.aNeg.length);
                if (this.kdCode === 8) {
                    if (this.selection.start === (this.value.indexOf(settingsClone.aNeg) + settingsClone.aNeg.length)) {
                        left = left.substring(1);
                    } else if (left !== '-' && this.selection.start <= (this.value.indexOf(settingsClone.aNeg) - settingsClone.aSign.length)) {
                        left = left.substring(0, left.length - 1);
                    } else if (left !== '' && !contains(this.value, settingsClone.aNeg)) {
                        left = left.substring(0, left.length - 1);
                    }
                } else {
                    settingsClone.caretFix = (this.selection.start >= this.value.indexOf(settingsClone.aSign) && settingsClone.aSign !== '');
                    if (this.selection.start === this.value.indexOf(settingsClone.aNeg)) {
                        left = left.substring(1);
                    }
                    right = right.substring(1);
                }
            }

            return [left, right];
        }

        /**
         * Process the deletion of characters.
         */
        _processCharacterDeletion() {
            const settingsClone = this.settingsClone;
            
            let left;
            let right;

            if (!this.selection.length) {
                [left, right] = this._getBeforeAfterStripped();
                if (left === '' && right === '') {
                    settingsClone.throwInput = false;
                }

                if (((settingsClone.pSign === 'p' && settingsClone.pNeg === 's') ||
                     (settingsClone.pSign === 's' && (settingsClone.pNeg === 'l' || settingsClone.pNeg === 'r'))) &&
                     contains(this.value, '-')) {
                    [left, right] = this._processTrailing([left, right]);
                } else {
                    if (this.kdCode === keyCode.Backspace) {
                        left = left.substring(0, left.length - 1);
                    } else {
                        right = right.substring(1, right.length);
                    }
                }
            } else {
                this._expandSelectionOnSign(false);
                [left, right] = this._getBeforeAfterStripped();
            }

            this._setValueParts(left, right);
        }

        /**
         * This function decides if the key pressed should be dropped or accepted, and modify the value 'on-the-fly' accordingly.
         * Returns TRUE if a processing is performed.
         *
         * @returns {boolean} //FIXME This always returns TRUE
         */
        _processCharacterInsertion() {
            const settingsClone = this.settingsClone;
            const cCode = String.fromCharCode(this.which);
            let [left, right] = this._getBeforeAfterStripped();
            settingsClone.throwInput = true;

            // Start rules when the decimal character key is pressed always use numeric pad dot to insert decimal separator
            // Do not allow decimal character if no decimal part allowed
            if (cCode === settingsClone.aDec ||
                (settingsClone.altDec && cCode === settingsClone.altDec) ||
                ((cCode === '.' || cCode === ',') && this.kdCode === keyCode.DotNumpad)) {
                if (!settingsClone.mDec || !settingsClone.aDec) {
                    return true;
                }

                // Do not allow decimal character before aNeg character
                if (settingsClone.aNeg && contains(right, settingsClone.aNeg)) {
                    return true;
                }

                // Do not allow decimal character if other decimal character present
                if (contains(left, settingsClone.aDec)) {
                    return true;
                }

                if (right.indexOf(settingsClone.aDec) > 0) {
                    return true;
                }

                if (right.indexOf(settingsClone.aDec) === 0) {
                    right = right.substr(1);
                }

                this._setValueParts(left + settingsClone.aDec, right, null);

                return true;
            }

            // Prevent minus if not allowed
            if ((cCode === '-' || cCode === '+') && settingsClone.aNeg === '-') {
                if (!settingsClone) {
                    return true;
                }

                // Caret is always after minus
                if ((settingsClone.pSign === 'p' && settingsClone.pNeg === 's') || (settingsClone.pSign === 's' && settingsClone.pNeg !== 'p')) {
                    if (left === '' && contains(right, settingsClone.aNeg)) {
                        left = settingsClone.aNeg;
                        right = right.substring(1, right.length);
                    }

                    // Change number sign, remove part if should
                    if (left.charAt(0) === '-' || contains(left, settingsClone.aNeg)) {
                        left = left.substring(1, left.length);
                    } else {
                        left = (cCode === '-') ? settingsClone.aNeg + left : left;
                    }
                } else {
                    if (left === '' && contains(right, settingsClone.aNeg)) {
                        left = settingsClone.aNeg;
                        right = right.substring(1, right.length);
                    }

                    // Change number sign, remove part if should
                    if (left.charAt(0) === settingsClone.aNeg) {
                        left = left.substring(1, left.length);
                    } else {
                        left = (cCode === '-') ? settingsClone.aNeg + left : left;
                    }
                }

                this._setValueParts(left, right, null);

                return true;
            }

            // If try to insert digit before minus
            if (cCode >= '0' && cCode <= '9') {
                if (settingsClone.aNeg && left === '' && contains(right, settingsClone.aNeg)) {
                    left = settingsClone.aNeg;
                    right = right.substring(1, right.length);
                }

                if (settingsClone.vMax <= 0 && settingsClone.vMin < settingsClone.vMax && !contains(this.value, settingsClone.aNeg) && cCode !== '0') {
                    left = settingsClone.aNeg + left;
                }

                this._setValueParts(left + cCode, right, null);

                return true;
            }

            // Prevent any other character
            settingsClone.throwInput = false;

            return true;
        }

        /**
         * Formatting of just processed value while keeping the cursor position
         */
        _formatQuick(e) {
            const settingsClone = this.settingsClone;
            const leftLength = this.value;
            const kuCode = e.keyCode;
            let [left] = this._getBeforeAfterStripped();

            // No grouping separator and no currency sign
            if ((settingsClone.aSep  === '' || (settingsClone.aSep !== ''  && !contains(leftLength, settingsClone.aSep))) &&
                (settingsClone.aSign === '' || (settingsClone.aSign !== '' && !contains(leftLength, settingsClone.aSign)))) {
                let [subParts] = leftLength.split(settingsClone.aDec);
                let nSign = '';
                if (contains(subParts, '-')) {
                    nSign = '-';
                    subParts = subParts.replace('-', '');
                    left = left.replace('-', '');
                }

                // Strip leading zero on positive value if needed
                if (nSign === '' && subParts.length > settingsClone.mIntPos && left.charAt(0) === '0') {
                    left = left.slice(1);
                }

                // Strip leading zero on negative value if needed
                if (nSign === '-' && subParts.length > settingsClone.mIntNeg && left.charAt(0) === '0') {
                    left = left.slice(1);
                }

                left = nSign + left;
            }

            const value = autoGroup(this.value, this.settingsClone);
            let position = value.length;
            if (value) {
                // Prepare regexp which searches for cursor position from unformatted left part
                const leftAr = left.split('');

                // Fixes caret position with trailing minus sign
                if ((settingsClone.pNeg === 's' || (settingsClone.pSign === 's' && settingsClone.pNeg !== 'p')) &&
                    leftAr[0] === '-' && settingsClone.aNeg !== '') {
                    leftAr.shift();
                    if (settingsClone.pSign === 's' && settingsClone.pNeg === 'l' && (kuCode === keyCode.Backspace || this.kdCode === keyCode.Backspace || kuCode === keyCode.Delete || this.kdCode === keyCode.Delete) && settingsClone.caretFix) {
                        leftAr.push('-');
                        settingsClone.caretFix = e.type === 'keydown';
                    }
                    if (settingsClone.pSign === 'p' && settingsClone.pNeg === 's' && (kuCode === keyCode.Backspace || this.kdCode === keyCode.Backspace || kuCode === keyCode.Delete || this.kdCode === keyCode.Delete) && settingsClone.caretFix) {
                        leftAr.push('-');
                        settingsClone.caretFix = e.type === 'keydown';
                    }
                    if (settingsClone.pSign === 's' && settingsClone.pNeg === 'r' && (kuCode === keyCode.Backspace || this.kdCode === keyCode.Backspace || kuCode === keyCode.Delete || this.kdCode === keyCode.Delete) && settingsClone.caretFix) {
                        const signParts = settingsClone.aSign.split('');
                        const escapeChr = ['\\', '^', '$', '.', '|', '?', '*', '+', '(', ')', '['];
                        const escapedParts = [];
                        $.each(signParts, (i, miniParts) => {
                            miniParts = signParts[i];
                            if (isInArray(miniParts, escapeChr)) {
                                escapedParts.push('\\' + miniParts);
                            } else {
                                escapedParts.push(miniParts);
                            }
                        });
                        if (kuCode === keyCode.Backspace || this.kdCode === keyCode.Backspace) {
                            escapedParts.push('-');
                        }

                        // Pushing the escaped sign
                        leftAr.push(escapedParts.join(''));
                        settingsClone.caretFix = e.type === 'keydown';
                    }
                }

                for (let i = 0; i < leftAr.length; i++) {
                    if (!leftAr[i].match('\\d')) {
                        leftAr[i] = '\\' + leftAr[i];
                    }
                }

                const leftReg = new RegExp('^.*?' + leftAr.join('.*?'));

                // Search cursor position in formatted value
                const newLeft = value.match(leftReg);
                if (newLeft) {
                    position = newLeft[0].length;

                    // If we are just before the sign which is in prefix position
                    if (((position === 0 && value.charAt(0) !== settingsClone.aNeg) || (position === 1 && value.charAt(0) === settingsClone.aNeg)) && settingsClone.aSign && settingsClone.pSign === 'p') {
                        // Place caret after prefix sign
                        position = this.settingsClone.aSign.length + (value.charAt(0) === '-' ? 1 : 0);
                    }
                } else {
                    if (settingsClone.aSign && settingsClone.pSign === 's') {
                        // If we could not find a place for cursor and have a sign as a suffix
                        // Place caret before suffix currency sign
                        position -= settingsClone.aSign.length;
                    }

                    if (settingsClone.aSuffix) {
                        // If we could not find a place for cursor and have a suffix
                        // Place caret before suffix
                        position -= settingsClone.aSuffix.length;
                    }
                }
            }

            this.that.value = value;
            this._setPosition(position);
            this.formatted = true;
        }
    }

    /**
     * This function factorise the `getString()` and `getArray()` functions since they share quite a lot of code.
     *
     * The "getString" method uses jQuery's .serialize() method that creates a text string in standard URL-encoded notation.
     * The "getArray" method on the other hand uses jQuery's .serializeArray() method that creates array or objects that can be encoded as a JSON string.
     *
     * It then loops through the string and un-formats the inputs with autoNumeric.
     * By defaults values returned as ISO numeric string "1234.56" or "-1234.56" where the decimal character is a period
     * Locale formats are supported "1234.56-" or "1234,56" or "-1234,56 or "1234,56-", or even plain numbers => please see option "outputType" for more details
     *
     * @param {boolean} getArrayBehavior - If set to TRUE, then this function behave like `getArray()`, otherwise if set to FALSE, it behave like `getString()`
     * @param that - A reference to the current DOM element
     * @returns {*}
     * @private
     */
    function _getStringOrArray(getArrayBehavior = true, that) {
        const $this = autoGet(that);
        const formIndex = $('form').index($this);
        const allFormElements = $(`form:eq(${formIndex})`)[0];
        const aiIndex = [];

        // all input index
        const scIndex = [];

        // successful control index
        const rSubmitterTypes = /^(?:submit|button|image|reset|file)$/i;

        // from jQuery serialize method
        const rSubmittable = /^(?:input|select|textarea|keygen)/i;

        // from jQuery serialize method
        const rCheckableType = /^(?:checkbox|radio)$/i;
        const rNonAutoNumericTypes = /^(?:button|checkbox|color|date|datetime|datetime-local|email|file|image|month|number|password|radio|range|reset|search|submit|time|url|week)/i;

        let count = 0;

        // index of successful elements
        $.each(allFormElements, (i, field) => {
            if (field.name !== '' && rSubmittable.test(field.localName) && !rSubmitterTypes.test(field.type) && !field.disabled && (field.checked || !rCheckableType.test(field.type))) {
                scIndex.push(count);
                count++;
            } else {
                scIndex.push(-1);
            }
        });

        // index of all inputs tags except checkbox
        count = 0;
        $.each(allFormElements, (i, field) => {
            if (field.localName === 'input' && (field.type === '' || field.type === 'text' || field.type === 'hidden' || field.type === 'tel')) {
                aiIndex.push(count);
                count++;
            } else {
                aiIndex.push(-1);
                if (field.localName === 'input' && rNonAutoNumericTypes.test(field.type)) {
                    count++;
                }
            }
        });

        if (getArrayBehavior) {
            const formFields = $this.serializeArray();

            $.each(formFields, (i, field) => {
                const scElement = $.inArray(i, scIndex);

                if (scElement > -1 && aiIndex[scElement] > -1) {
                    const testInput = $(`form:eq(${formIndex}) input:eq(${aiIndex[scElement]})`);
                    const settings = testInput.data('autoNumeric');

                    if (typeof settings === 'object') {
                        field.value = testInput.autoNumeric('getLocalized').toString();
                    }
                }
            });

            return formFields;
        }
        else {
            // getString() behavior
            const formFields = $this.serialize();
            const formParts = formFields.split('&');

            $.each(formParts, i => {
                const [inputName, inputValue] = formParts[i].split('=');
                const scElement = $.inArray(i, scIndex);

                // If the current element is a valid element
                if (scElement > -1 && aiIndex[scElement] > -1) {
                    const testInput = $(`form:eq(${formIndex}) input:eq(${aiIndex[scElement]})`);
                    const settings = testInput.data('autoNumeric');

                    if (typeof settings === 'object') {
                        if (inputValue !== null) {
                            const modifiedInputValue = testInput.autoNumeric('getLocalized').toString();
                            formParts[i] = `${inputName}=${modifiedInputValue}`;
                        }
                    }
                }
            });

            return formParts.join('&');
        }
    }

    /**
     * Handler for 'focusin' events
     *
     * @param $this
     * @param {AutoNumericHolder} holder
     * @returns {*}
     */
    function onFocusInAndMouseEnter($this, holder) {
        $this.on('focusin.autoNumeric mouseenter.autoNumeric', e => {
            holder = getHolder($this);
            const $settings = holder.settingsClone;
            if (e.type === 'focusin' || e.type === 'mouseenter' && !$this.is(':focus') && $settings.wEmpty === 'focus') {
                $settings.onOff = true;

                if ($settings.nBracket !== null && $settings.aNeg !== '') {
                    $this.val(negativeBracket($this.val(), $settings));
                }

                let result;
                if ($settings.eDec) {
                    $settings.mDec = $settings.eDec;
                    $this.autoNumeric('set', $settings.rawValue);
                } else if ($settings.scaleDivisor) {
                    $settings.mDec = $settings.oDec;
                    $this.autoNumeric('set', $settings.rawValue);
                } else if ($settings.nSep) {
                    $settings.aSep = '';
                    $settings.aSign = '';
                    $settings.aSuffix = '';
                    $this.autoNumeric('set', $settings.rawValue);
                } else if ((result = autoStrip($this.val(), $settings)) !== $settings.rawValue) {
                    $this.autoNumeric('set', result);
                }

                holder.inVal = $this.val();
                holder.lastVal = holder.inVal;
                const onEmpty = checkEmpty(holder.inVal, $settings, true);
                if ((onEmpty !== null && onEmpty !== '') && $settings.wEmpty === 'focus') {
                    $this.val(onEmpty);
                }
            }
        });

        return holder;
    }

    /**
     * Handler for 'keydown' events.
     * The user just started pushing any key, hence one event is sent.
     *
     * @param $this
     * @param {AutoNumericHolder} holder
     * @returns {*}
     */
    function onKeydown($this, holder) {
        $this.on('keydown.autoNumeric', e => {
            holder = getHolder($this);
            if (holder.that.readOnly) {
                holder.processed = true;

                return true;
            }
            /* // The code below allows the "enter" keydown to throw a change() event
             if (e.keyCode === keyCode.Enter && holder.inVal !== $this.val()) {
             $this.change();
             holder.inVal = $this.val();
             } */
            holder._updateFieldProperties(e); //FIXME This is called 2 to 3 times
            holder.processed = false;
            holder.formatted = false;

            if (holder._skipAlways(e)) {
                holder.processed = true;

                return true;
            }

            if (holder._processCharacterDeletion()) {
                holder.processed = true;
                holder._formatQuick(e);
                const currentValue = $this.val();
                if ((currentValue !== holder.lastVal) && holder.settingsClone.throwInput) {
                    // throws input event in deletion character
                    $this.trigger('input');
                }
                holder.lastVal = currentValue;
                holder.settingsClone.throwInput = true;
                e.preventDefault();

                return false;
            }
            holder.formatted = false;

            return true;
        });

        return holder;
    }

    /**
     * Handler for 'keypress' events.
     * The user is still pressing the key, which will output a character (ie. '2') continuously until it releases the key.
     * Note: 'keypress' events are not sent for delete keys like Backspace/Delete.
     *
     * @param $this
     * @param {AutoNumericHolder} holder
     * @returns {*}
     */
    function onKeypress($this, holder) {
        $this.on('keypress.autoNumeric', e => {
            // Firefox fix for Shift && insert paste event
            if (e.shiftKey && e.keyCode === keyCode.Insert) {
                return;
            }
            holder = getHolder($this);
            const processed = holder.processed;
            holder._updateFieldProperties(e); //FIXME This is called 2 to 3 times
            holder.processed = false;
            holder.formatted = false;

            if (holder._skipAlways(e)) {
                return true;
            }

            if (processed) {
                e.preventDefault();

                return false;
            }

            if (holder._processCharacterInsertion()) {
                holder._formatQuick(e);
                const currentValue = $this.val();
                if ((currentValue !== holder.lastVal) && holder.settingsClone.throwInput) {
                    // throws input event on adding character
                    $this.trigger('input');
                }
                holder.lastVal = currentValue;
                holder.settingsClone.throwInput = true;
                e.preventDefault();

                return;
            }
            holder.formatted = false;
        });

        return holder;
    }

    /**
     * Handler for 'keyup' events.
     * The user just released any key, hence one event is sent.
     *
     * @param $this
     * @param {AutoNumericHolder} holder
     * @param {object} settings
     * @returns {*}
     */
    function onKeyup($this, holder, settings) {
        $this.on('keyup.autoNumeric', function(e) {
            holder = getHolder($this);
            holder._updateFieldProperties(e); //FIXME This is called 2 to 3 times
            holder.processed = false;
            holder.formatted = false;

            const skip = holder._skipAlways(e);
            const tab = holder.kdCode;
            holder.kdCode = 0;
            delete holder.valuePartsBeforePaste;

            // Added to properly place the caret when only the currency sign is present
            if ($this[0].value === holder.settingsClone.aSign) {
                if (holder.settingsClone.pSign === 's') {
                    setElementSelection(this, 0, 0);
                } else {
                    setElementSelection(this, holder.settingsClone.aSign.length, holder.settingsClone.aSign.length);
                }
            } else if (tab === keyCode.Tab) {
                setElementSelection(this, 0, $this.val().length);
            }

            if ($this[0].value === holder.settingsClone.aSuffix) {
                setElementSelection(this, 0, 0);
            }

            if (holder.settingsClone.rawValue === '' && holder.settingsClone.aSign !== '' && holder.settingsClone.aSuffix !== '') {
                setElementSelection(this, 0, 0);
            }

            // Saves the extended decimal to preserve the data when navigating away from the page
            if (holder.settingsClone.eDec !== null && holder.settingsClone.aStor) {
                autoSave(e.target, settings, 'set');
            }
            if (skip) {
                return true;
            }
            if (this.value === '') {
                return true;
            }
            if (!holder.formatted) {
                holder._formatQuick(e);
            }
        });
        return holder;
    }

    /**
     * Handler for 'focusout' events
     *
     * @param $this
     * @param {AutoNumericHolder} holder
     * @returns {*}
     */
    function onFocusOutAndMouseLeave($this, holder) {
        $this.on('focusout.autoNumeric mouseleave.autoNumeric', (e) => {
            if (!$this.is(':focus')) {
                holder = getHolder($this);
                let value = $this.val();
                const origValue = value;
                const settings = holder.settingsClone;
                settings.onOff = false;
                if (settings.aStor) {
                    autoSave(e.target, settings, 'set');
                }

                if (settings.nSep === true) {
                    settings.aSep = settings.oSep;
                    settings.aSign = settings.oSign;
                    settings.aSuffix = settings.oSuffix;
                }

                if (settings.eDec !== null) {
                    settings.mDec = settings.oDec;
                    settings.aPad = settings.oPad;
                    settings.nBracket = settings.oBracket;
                }

                value = autoStrip(value, settings);
                if (value !== '') {
                    if (settings.trailingNegative) {
                        value = '-' + value;
                        settings.trailingNegative = false;
                    }

                    const [minTest, maxTest] = autoCheck(value, settings);
                    if (checkEmpty(value, settings, false) === null && minTest && maxTest) {
                        value = fixNumber(value, settings);
                        settings.rawValue = value;

                        if (settings.scaleDivisor) {
                            value = value / settings.scaleDivisor;
                            value = value.toString();
                        }

                        settings.mDec = (settings.scaleDivisor && settings.scaleDecimal) ? +settings.scaleDecimal : settings.mDec;
                        value = autoRound(value, settings);
                        value = presentNumber(value, settings);
                    } else {
                        if (!minTest) {
                            $this.trigger('autoNumeric:minExceeded');
                        }
                        if (!maxTest) {
                            $this.trigger('autoNumeric:maxExceeded');
                        }

                        value = settings.rawValue;
                    }
                } else {
                    if (settings.wEmpty === 'zero') {
                        settings.rawValue = '0';
                        value = autoRound('0', settings);
                    } else {
                        settings.rawValue = '';
                    }
                }

                let groupedValue = checkEmpty(value, settings, false);
                if (groupedValue === null) {
                    groupedValue = autoGroup(value, settings);
                }

                if (groupedValue !== origValue) {
                    groupedValue = (settings.scaleSymbol) ? groupedValue + settings.scaleSymbol : groupedValue;
                    $this.val(groupedValue);
                }

                if (groupedValue !== holder.inVal) {
                    $this.change();
                    delete holder.inVal;
                }
            }
        });

        return holder;
    }

    /**
     * Handler for 'paste' events
     *
     * @param $this
     * @param {AutoNumericHolder} holder
     * @returns {*}
     */
    function onPaste($this, holder) {
        $this.on('paste', function(e) {
            //FIXME After a paste, the caret is put on the far right of the input, it should be set to something like `newCaretPosition = oldCaretPosition + pasteText.length;`, while taking into account the thousand separators and the decimal character
            e.preventDefault();
            holder = getHolder($this);

            const oldRawValue = $this.autoNumeric('get');
            const currentValue = this.value || '';
            const selectionStart = this.selectionStart || 0;
            const selectionEnd = this.selectionEnd || 0;
            const prefix = currentValue.substring(0, selectionStart);
            const suffix = currentValue.substring(selectionEnd, currentValue.length);
            const pastedText = preparePastedText(e.originalEvent.clipboardData.getData('text/plain'), holder);

            if (isValidPasteText(pastedText)) {
                const newValue = preparePastedText(prefix + Number(pastedText).valueOf() + suffix, holder);

                if (isValidPasteText(newValue) && Number(oldRawValue).valueOf() !== Number(newValue).valueOf()) {
                    $this.autoNumeric('set', newValue);
                    $this.trigger('input');
                }
            } else {
                this.selectionStart = selectionEnd;
            }
        });

        return holder;
    }

    /**
     * Handler for 'submit' events
     *
     * @param $this
     * @param {AutoNumericHolder} holder
     * @returns {*}
     */
    function onSubmit($this, holder) {
        $this.closest('form').on('submit.autoNumeric', () => {
            holder = getHolder($this);

            if (holder) {
                const $settings = holder.settingsClone;

                if ($settings.unSetOnSubmit) {
                    $this.val($settings.rawValue);
                }
            }
        });

        return holder;
    }

    /**
     * Return the jQuery selected input if the tag and type are supported by autoNumeric.
     *
     * @param $this
     * @returns {boolean|*}
     */
    function getInputIfSupportedTagAndType($this) {
        // Supported input type
        const $input = $this.is('input[type=text], input[type=hidden], input[type=tel], input:not([type])');

        // Checks for non-supported input types
        if (!$input && $this.prop('tagName').toLowerCase() === 'input') {
            throwError(`The input type "${$this.prop('type')}" is not supported by autoNumeric`);
        }

        // Checks for non-supported tags
        const currentElementTag = $this.prop('tagName').toLowerCase();
        if (currentElementTag !== 'input' && !isInArray(currentElementTag, allowedTagList)) {
            throwError(`The <${currentElementTag}> tag is not supported by autoNumeric`);
        }

        return $input;
    }

    /**
     * Routine to format the default value on page load
     *
     * @param settings
     * @param $input
     * @param $this
     */
    function formatDefaultValueOnPageLoad(settings, $input, $this) {
        let setValue = true;

        if ($input) {
            const currentValue = $this.val();
            /*
             * If the input value has been set by the dev, but not directly as an attribute in the html, then it takes
             * precedence and should get formatted on init (if this input value is a valid number and that the
             * developer wants it formatted on init (cf. `settings.aForm`)).
             * Note; this is true whatever the developer has set for `data-an-default` in the html (asp.net users).
             *
             * In other words : if `anDefault` is not null, it means the developer is trying to prevent postback problems.
             * But if `input.value` is set to a number, and `$this.attr('value')` is not set, then it means the dev has
             * changed the input value, and then it means we should not overwrite his own decision to do so.
             * Hence, if `anDefault` is not null, but `input.value` is a number and `$this.attr('value')` is not set,
             * we should ignore `anDefault` altogether.
             */
            if (settings.aForm && currentValue !== '' && isUndefinedOrNullOrEmpty($this.attr('value'))) {
                // Check if the `value` is valid or not
                const testedCurrentValue = parseFloat(currentValue.replace(',', '.'));
                //TODO Replace whatever locale character is used by a '.', and not only the comma ','
                if (!isNaN(testedCurrentValue) && Infinity !== testedCurrentValue) {
                    $this.autoNumeric('set', testedCurrentValue);
                    setValue = false;
                } else {
                    // If not, inform the developer that nothing usable has been provided
                    throwError(`The value [${currentValue}] used in the input is not a valid value autoNumeric can work with.`);
                }
            } else {
                /* Checks for :
                 * - page reload from back button, and
                 * - ASP.net form post back
                 *      The following HTML data attribute is REQUIRED (data-an-default="same value as the value attribute")
                 *      example: <asp:TextBox runat="server" id="someID" text="1234.56" data-an-default="1234.56">
                 */
                //TODO Replace whatever locale character is used by a '.', and not only the comma ',', based on the locale used by the user
                if ((settings.anDefault !== null && settings.anDefault.toString() !== currentValue) ||
                    (settings.anDefault === null && currentValue !== '' && currentValue !== $this.attr('value')) ||
                    (currentValue !== '' && $this.attr('type') === 'hidden' && !$.isNumeric(currentValue.replace(',', '.')))) {
                    if ((settings.eDec !== null && settings.aStor) ||
                        (settings.scaleDivisor && settings.aStor)) {
                        settings.rawValue = autoSave($this[0], settings, 'get');
                    }

                    // If the eDec value should NOT be saved in sessionStorage
                    if (!settings.aStor) {
                        let toStrip;

                        if (settings.nBracket !== null && settings.aNeg !== '') {
                            settings.onOff = true;
                            toStrip = negativeBracket(currentValue, settings);
                        } else {
                            toStrip = currentValue;
                        }

                        settings.rawValue = ((settings.pNeg === 's' || (settings.pSign === 's' && settings.pNeg !== 'p')) && settings.aNeg !== '' && contains(currentValue, '-'))?'-' + autoStrip(toStrip, settings):autoStrip(toStrip, settings);
                    }

                    setValue = false;
                }
            }

            if (currentValue === '') {
                switch (settings.wEmpty) {
                    case 'focus':
                        setValue = false;
                        break;
                    case 'always':
                        $this.val(settings.aSign);
                        setValue = false;
                        break;
                    case 'zero':
                        $this.autoNumeric('set', '0');
                        setValue = false;
                        break;
                    default :
                    //
                }
            } else if (setValue && currentValue === $this.attr('value')) {
                $this.autoNumeric('set', currentValue);
            }
        }

        if (isInArray($this.prop('tagName').toLowerCase(), settings.tagList) && $this.text() !== '') {
            if (settings.anDefault !== null) {
                if (settings.anDefault === $this.text()) {
                    $this.autoNumeric('set', $this.text());
                }
            } else {
                $this.autoNumeric('set', $this.text());
            }
        }
    }

    /**
     * Enhance the user experience by modifying the default `pNeg` option depending on `aSign` and `pSign`.
     *
     * If the user has not set the placement of the negative sign (`pNeg`), but has set a currency symbol (`aSign`),
     * then we modify the default value of `pNeg` in order to keep the resulting output logical by default :
     * - "$-1,234.56" instead of "-$1,234.56" ({aSign: "$", pNeg: "r"})
     * - "-1,234.56$" instead of "1,234.56-$" ({aSign: "$", pSign: "s", pNeg: "p"})
     *
     * @param {object} options
     * @param {object} settings
     */
    function correctPNegOption(options, settings) {
        if (!isUndefined(options) && isUndefinedOrNullOrEmpty(options.pNeg) && options.aSign !== '') {
            switch (settings.pSign) {
                case 's':
                    settings.pNeg = 'p';
                    break;
                case 'p':
                    settings.pNeg = 'r';
                    break;
                default :
                //
            }
        }
    }

    /**
     * Analyze and save the vMin and vMax integer size for later uses
     *
     * @param {object} settings
     * @returns {{vMax: Array, vMin: Array}}
     */
    function calculateVMinAndVMaxIntegerSizes(settings) {
        let [vMaxIntegerPart] = settings.vMax.toString().split('.');
        let [vMinIntegerPart] = (!settings.vMin && settings.vMin !== 0)?[]:settings.vMin.toString().split('.');
        vMaxIntegerPart = vMaxIntegerPart.replace('-', '');
        vMinIntegerPart = vMinIntegerPart.replace('-', '');

        settings.mIntPos = Math.max(vMaxIntegerPart.length, 1);
        settings.mIntNeg = Math.max(vMinIntegerPart.length, 1);
    }

    /**
     * Modify `mDec` as needed
     *
     * @param {object} settings
     */
    function correctMDecOption(settings) {
        if (!isNull(settings.scaleDivisor) && !isNull(settings.scaleDecimal)) {
            // Override the maximum number of decimal places with the one defined with the number of decimals to show when not in focus, if set
            settings.mDec = settings.scaleDecimal;
        }
        else if (isNull(settings.mDec)) {
            settings.mDec = maximumVMinAndVMaxDecimalLength(settings.vMin, settings.vMax);
            settings.oDec = String(settings.mDec);
        }

        // Most calculus assume `mDec` is an integer, the following statement makes it clear (otherwise having it as a string leads to problems in rounding for instance)
        settings.mDec = Number(settings.mDec);
    }

    /**
     * Sets the alternative decimal separator key.
     *
     * @param {object} settings
     */
    function setsAlternativeDecimalSeparatorCharacter(settings) {
        if (isNull(settings.altDec) && Number(settings.mDec) > 0) {
            if (settings.aDec === '.' && settings.aSep !== ',') {
                settings.altDec = ',';
            } else if (settings.aDec === ',' && settings.aSep !== '.') {
                settings.altDec = '.';
            }
        }
    }

    /**
     * Caches regular expressions for autoStrip
     *
     * @param {object} settings
     */
    function cachesUsualRegularExpressions(settings) {
        const aNegReg = settings.aNeg?`([-\\${settings.aNeg}]?)`:'(-?)';
        settings.aNegRegAutoStrip = aNegReg;
        settings.skipFirstAutoStrip = new RegExp(`${aNegReg}[^-${(settings.aNeg?`\\${settings.aNeg}`:'')}\\${settings.aDec}\\d].*?(\\d|\\${settings.aDec}\\d)`);
        settings.skipLastAutoStrip = new RegExp(`(\\d\\${settings.aDec}?)[^\\${settings.aDec}\\d]\\D*$`);

        const allowed = `-0123456789\\${settings.aDec}`;
        settings.allowedAutoStrip = new RegExp(`[^${allowed}]`, 'gi');
        settings.numRegAutoStrip = new RegExp(`${aNegReg}(?:\\${settings.aDec}?(\\d+\\${settings.aDec}\\d+)|(\\d*(?:\\${settings.aDec}\\d*)?))`);

        // Using this regex version `^${settings.aNegRegAutoStrip}0*(\\d|$)` entirely clear the input on blur
        settings.stripReg = new RegExp(`^${settings.aNegRegAutoStrip}0*(\\d)`);
    }

    /**
     * Modify the user settings to make them 'exploitable' later.
     *
     * @param {object} settings
     */
    function transformOptionsValuesToDefaultTypes(settings) {
        $.each(settings, (key, value) => {
            // Convert the string 'true' and 'false' to real Boolean
            if (value === 'true' || value === 'false') {
                settings[key] = value === 'true';
            }

            // Convert numbers in options to strings
            //TODO if a value is already of type 'Number', shouldn't we keep it as a number for further manipulation, instead of using a string?
            if (typeof value === 'number' && key !== 'aScale') {
                settings[key] = value.toString();
            }
        });
    }

    /**
     * Analyse the settings/options passed by the user, validate and clean them, then return them.
     * Note: This returns `null` if somehow the settings returned by jQuery is not an object.
     *
     * @param {object} options
     * @param $this
     * @param {boolean} update - If TRUE, then the settings already exists and this function only updates them instead of recreating them from scratch
     * @returns {object|null}
     */
    function getInitialSettings(options, $this, update = false) {
        // Attempt to grab "autoNumeric" settings. If they do not exist, it returns "undefined".
        let settings = $this.data('autoNumeric');

        // If we couldn't grab any settings, create them from the default ones and combine them with the options passed
        if (update || isUndefined(settings)) {
            if (update) {
                // The settings are updated
                settings = $.extend(settings, options);
            } else {
                // The settings are generated for the first time
                // Attempt to grab HTML5 data, if it doesn't exist, we'll get "undefined"
                const tagData = $this.data();
                settings = $.extend({}, defaultSettings, tagData, options, {
                    onOff           : false,
                    runOnce         : false,
                    rawValue        : '',
                    trailingNegative: false,
                    caretFix        : false,
                    throwInput      : true, // Throw input event
                    strip           : true,
                    tagList         : allowedTagList,
                });
            }

            // Modify the user settings to make them 'exploitable'
            transformOptionsValuesToDefaultTypes(settings);

            // Improve the `pNeg` option if needed
            correctPNegOption(options, settings);

            // Set the negative sign if needed
            settings.aNeg = settings.vMin < 0 ? '-' : '';

            // Additional changes to the settings object (from the original autoCode() function)
            runCallbacksFoundInTheSettingsObject($this, settings);
            calculateVMinAndVMaxIntegerSizes(settings);
            correctMDecOption(settings);
            setsAlternativeDecimalSeparatorCharacter(settings);
            cachesUsualRegularExpressions(settings);

            // Validate the settings
            validate(settings, false); // Throws if necessary

            // Original settings saved for use when eDec, scaleDivisor & nSep options are being used
            keepAnOriginalSettingsCopy(settings);

            // Save our new settings
            $this.data('autoNumeric', settings);

            return settings;
        } else {
            return null;
        }
    }

    /**
     * Methods supported by autoNumeric
     */
    const methods = {
        /**
         * Method to initiate autoNumeric and attach the settings (options can be passed as a parameter)
         * The options passed as a parameter is an object that contains the settings (ie. {aSep: ".", aDec: ",", aSign: '€ '})
         *
         * @example
         * $(someSelector).autoNumeric('init');            // initiate autoNumeric with defaults
         * $(someSelector).autoNumeric();                  // initiate autoNumeric with defaults
         * $(someSelector).autoNumeric('init', {options}); // initiate autoNumeric with options
         * $(someSelector).autoNumeric({options});         // initiate autoNumeric with options
         */
        init(options) {
            return this.each(function() {
                const $this = $(this);
                const $input = getInputIfSupportedTagAndType($this);

                const settings = getInitialSettings(options, $this, false);
                if (isNull(settings)) {
                    return this;
                }

                // Create the AutoNumericHolder object that store the field properties
                let holder = getHolder($this, settings, false);

                if (!settings.runOnce && settings.aForm) {
                    formatDefaultValueOnPageLoad(settings, $input, $this);
                }

                settings.runOnce = true;

                // Add the events listeners to supported input types ("text", "hidden", "tel" and no type)
                if ($input) {
                    holder = onFocusInAndMouseEnter($this, holder);
                    holder = onFocusOutAndMouseLeave($this, holder);
                    holder = onKeydown($this, holder);
                    holder = onKeypress($this, holder);
                    holder = onKeyup($this, holder, settings);
                    holder = onPaste($this, holder);
                    onSubmit($this, holder);
                }
            });
        },

        /**
         * method to remove settings and stop autoNumeric() - does not remove the formatting
         * $(someSelector).autoNumeric("destroy"); // destroys autoNumeric
         * no parameters accepted
         */
        destroy() {
            return $(this).each(function() {
                const $this = autoGet(this);
                const settings = $this.data('autoNumeric');
                if (typeof settings === 'object') {
                    $this.val('');
                    autoSave($this[0], settings, 'wipe');
                    $this.removeData('autoNumeric');
                    $this.off('.autoNumeric');
                }
            });
        },

        /**
         * method to clear the value and sessionStorage or cookie depending on browser supports
         * $(someSelector).autoNumeric("wipe"); // removes session storage and cookies from memory
         * no parameters accepted
         */
        wipe() {
            return $(this).each(function() {
                const $this = autoGet(this);
                const settings = $this.data('autoNumeric');
                if (typeof settings === 'object') {
                    $this.val('');
                    settings.rawValue = '';
                    autoSave($this[0], settings, 'wipe');
                }
            });
        },

        /**
         * Method that updates the autoNumeric settings.
         * It can be called multiple times if needed.
         * The options passed as a parameter is an object that contains the settings (ie. {aSep: ".", aDec: ",", aSign: '€ '}).
         *
         * @usage $(someSelector).autoNumeric("update", {options}); // updates the settings
         */
        update(options) {
            return $(this).each(function() {
                const $this = autoGet(this);
                const strip = $this.autoNumeric('get');
                const settings = getInitialSettings(options, $this, true);

                // Update the AutoNumericHolder object that store the field properties
                getHolder($this, settings, true);

                if ($this.val() !== '' || $this.text() !== '') {
                    return $this.autoNumeric('set', strip);
                }
            });
        },

        /**
         * Method to format the value passed as a parameter.
         * $(someSelector).autoNumeric('set', 'value'); // formats the value being passed as the second parameter
         * If the value is passed as a string, it can be an integer '1234' or a double '1234.56789'
         * and must contain only numbers and one decimal (period) character
         *
         * @param {*} newValue
         * @returns {*|jQuery}
         */
        set(newValue) {
            return $(this).each(function() {
                if (newValue === null || isUndefined(newValue)) {
                    return;
                }

                //TODO This looks a lot like `getInputIfSupportedTagAndType()`. Is that necessary? Can the input element be changed since autoNumeric has been initialized?
                const $this = autoGet(this);
                const settings = $this.data('autoNumeric');
                const $input = $this.is('input[type=text], input[type=hidden], input[type=tel], input:not([type])');
                let value = newValue.toString();
                if (typeof settings !== 'object') {
                    throwError(`Initializing autoNumeric is required prior to calling the "set" method`);
                }

                // allows locale decimal separator to be a comma - no thousand separator allowed
                value = fromLocale(value);

                // Throws an error if the value being set is not numeric
                if (!$.isNumeric(Number(value))) {
                    warning(`The value "${value}" being "set" is not numeric and therefore cannot be used appropriately.`);
                    return $this.val('');
                }

                if (value !== '') {
                    const [minTest, maxTest] = autoCheck(value, settings);
                    if (minTest && maxTest) {
                        if ($input && (settings.eDec || settings.scaleDivisor)) {
                            settings.rawValue = value;
                        }

                        // checks if the value falls within the min max range
                        if ($input || isInArray($this.prop('tagName').toLowerCase(), settings.tagList)) {
                            if (settings.scaleDivisor && !settings.onOff) {
                                value = value / settings.scaleDivisor;
                                value = value.toString();
                                settings.mDec = (settings.scaleDecimal) ? settings.scaleDecimal : settings.mDec;
                            }

                            value = autoRound(value, settings);
                            if (settings.eDec === null && settings.scaleDivisor === null) {
                                settings.rawValue = value;
                            }

                            value = presentNumber(value, settings);
                            value = autoGroup(value, settings);
                        }

                        if (settings.aStor && (settings.eDec || settings.scaleDivisor)) {
                            autoSave($this[0], settings, 'set');
                        }
                    } else {
                        settings.rawValue = '';
                        autoSave($this[0], settings, 'wipe');
                        const attemptedValue = value;
                        value = '';
                        if (!minTest) {
                            $this.trigger('autoNumeric:minExceeded');
                        }

                        if (!maxTest) {
                            $this.trigger('autoNumeric:maxExceeded');
                        }

                        throwError(`The value [${attemptedValue}] being set falls outside of the vMin [${settings.vMin}] and vMax [${settings.vMax}] range set for this element`);

                        return $this.val('');
                    }
                } else {
                    return $this.val('');
                }

                if (!settings.onOff && settings.scaleSymbol) {
                    value = value + settings.scaleSymbol;
                }

                if ($input) {
                    return $this.val(value);
                }

                if (isInArray($this.prop('tagName').toLowerCase(), settings.tagList)) {
                    return $this.text(value);
                }

                return false;
            });
        },

        /**
         * method to un-format inputs - handy to use right before form submission
         * $(someSelector).autoNumeric('unSet'); // no parameter accepted
         * by defaults values returned as ISO numeric string "1234.56" or "-1234.56" where the decimal character is a period
         * Locale formats are supported "1234.56-" or "1234,56" or "-1234,56 or "1234,56-", or even plain numbers => please see option "outputType" for more details
         */
        unSet() {
            return $(this).each(function() {
                const $this = autoGet(this);
                const settings = $this.data('autoNumeric');
                if (typeof settings === 'object') {
                    settings.onOff = true;
                    $this.val($this.autoNumeric('getLocalized'));
                }
            });
        },

        /**
         * method to re-format inputs - handy to use right after form submission
         * $(someSelector).autoNumeric('reSet'); // no parameters accepted
         * this is called after the 'unSet' method to reformat the input
         */
        reSet() {
            return $(this).each(function() {
                const $this = autoGet(this);
                const settings = $this.data('autoNumeric');
                if (typeof settings === 'object') {
                    $this.autoNumeric('set', $this.val());
                }
            });
        },

        /**
         * Return the unformatted value as a string.
         *
         * @usage $(someSelector).autoNumeric('get');
         *
         * @returns {string}
         */
        get() {
            //TODO Why would we need to get a new reference to $this since it has been done in `init()`?
            const $this = autoGet(this);
            //TODO This looks a lot like `getInputIfSupportedTagAndType()`. Is that necessary? Can the input element be changed since autoNumeric has been initialized?
            const $input = $this.is('input[type=text], input[type=hidden], input[type=tel], input:not([type])');
            const settings = $this.data('autoNumeric');
            if (typeof settings !== 'object') {
                throwError(`Initializing autoNumeric is required prior to calling the "get" method`);
            }

            // determine the element type then use .eq(0) selector to grab the value of the first element in selector
            let value = '';
            if ($input) {
                value = $this.eq(0).val();
            } else if (isInArray($this.prop('tagName').toLowerCase(), settings.tagList)) {
                value = $this.eq(0).text();
            } else {
                throwError(`The "<${$this.prop('tagName').toLowerCase()}>" tag is not supported by autoNumeric`);
            }

            if (settings.eDec || settings.scaleDivisor) {
                value = settings.rawValue;
            } else {
                if (!((/\d/).test(value) || Number(value) === 0) && settings.wEmpty === 'focus') {
                    return '';
                }

                if (value !== '' && settings.nBracket !== null) {
                    settings.onOff = true;
                    value = negativeBracket(value, settings);
                }

                if (settings.runOnce || settings.aForm === false) {
                    value = autoStrip(value, settings);
                }

                value = fixNumber(value, settings);
            }

            // Always return a numeric string
            return value;
        },

        /**
         * Returns the unformatted value, but following the `outputType` setting, which means the output can either be :
         * - a string (that could or could not represent a number (ie. "12345,67-")), or
         * - a plain number (if the setting 'number' is used).
         *
         * By default the returned values are an ISO numeric string "1234.56" or "-1234.56" where the decimal character is a period.
         * Check the "outputType" option definition for more details.
         *
         * @returns {*}
         */
        getLocalized() {
            const $this = autoGet(this);
            let value = $this.autoNumeric('get');
            const settings = $this.data('autoNumeric');

            if (Number(value) === 0 && settings.lZero !== 'keep') {
                value = '0';
            }

            return toLocale(value, settings.outputType);
        },

        /**
         * Return the current formatted value of the autoNumeric element.
         * @usage aNInput.autoNumeric('getFormatted'))
         *
         * @returns {string}
         */
        getFormatted() {
            // Make sure `this[0]` exists as well as `.value` before trying to access that property
            if (!this.hasOwnProperty('0') || !('value' in this[0])) {
                throwError('Unable to get the formatted string from the element.');
            }

            return this[0].value;
        },

        /**
         * The "getString" method uses jQuery's .serialize() method that creates a text string in standard URL-encoded notation.
         *
         * It then loops through the string and un-formats the inputs with autoNumeric.
         * By defaults values returned as ISO numeric string "1234.56" or "-1234.56" where the decimal character is a period
         * Locale formats are supported "1234.56-" or "1234,56" or "-1234,56 or "1234,56-" or plain numbers => please see option "outputType" for details
         */
        getString() {
            return _getStringOrArray(false, this);
        },

        /**
         * The "getArray" method on the other hand uses jQuery's .serializeArray() method that creates array or objects that can be encoded as a JSON string.
         *
         * It then loops through the string and un-formats the inputs with autoNumeric.
         * By defaults values returned as ISO numeric string "1234.56" or "-1234.56" where the decimal character is a period
         * Locale formats are supported "1234.56-" or "1234,56" or "-1234,56 or "1234,56-" or plain numbers => please see option "outputType" for details
         */
        getArray() {
            return _getStringOrArray(true, this);
        },

        /**
         * The 'getSettings' function returns the object with autoNumeric settings for those who need to look under the hood
         * $(someSelector).autoNumeric('getSettings'); // no parameters accepted
         * $(someSelector).autoNumeric('getSettings').aDec; // return the aDec setting as a string - ant valid setting can be used
         */
        getSettings() {
            return this.data('autoNumeric');
        },
    };

    /**
     * The autoNumeric function accepts methods names (in string format) and those method parameters if needed.
     * It initialize autoNumeric on the given element.
     */
    $.fn.autoNumeric = function(method, ...args) {
        if (methods[method]) {
            return methods[method].apply(this, args);
        }

        if (typeof method === 'object' || !method) {
            // The options have been passed directly, without using a named method
            return methods.init.apply(this, [method]);
        }

        throwError(`Method "${method}" is not supported by autoNumeric`);
    };

    /**
     * Return the default autoNumeric settings.
     *
     * @return {object}
     */
    getDefaultConfig = () => defaultSettings;

    $.fn.autoNumeric.defaults = defaultSettings; // Make those settings public via jQuery too.

    /**
     * Public function that allows formatting without an element trigger
     */
    autoFormat = (value, options) => {
        if (isUndefined(value) || value === null) {
            return null;
        }

        // Check the validity of the `value` parameter
        if (!isNumber(value)) {
            throwError(`A number is needed to be able to format it, [${value}] given.`);
        }

        // Initiate a very basic settings object
        const settings = $.extend({}, defaultSettings, { strip: false }, options);
        value = value.toString();
        value = fromLocale(value);
        if (Number(value) < 0) {
            settings.aNeg = '-';
        }

        if (isNull(settings.mDec)) {
            settings.mDec = maximumVMinAndVMaxDecimalLength(settings.vMin, settings.vMax);
        }

        // Basic tests to check if the given value is valid
        const [minTest, maxTest] = autoCheck(value, settings);
        if (!minTest || !maxTest) {
            // Throw a custom event
            sendCustomEvent('autoFormat.autoNumeric', `Range test failed`);
            throwError(`The value [${value}] being set falls outside of the vMin [${settings.vMin}] and vMax [${settings.vMax}] range set for this element`);
        }

        // Everything is ok, proceed to rounding, formatting and grouping
        value = autoRound(value, settings);
        value = presentNumber(value, settings);
        value = autoGroup(value, settings);

        return value;
    };

    $.fn.autoFormat = autoFormat; // The jQuery export

    /**
     * Public function that allows unformatting without an element
     */
    autoUnFormat = (value, options) => {
        if (isUndefined(value) || value === null) {
            return null;
        }

        // Giving an unformatted value should return the same unformatted value, whatever the options passed as a parameter
        if (isNumber(value)) {
            return Number(value);
        }

        if (isArray(value) || isObject(value)) { //TODO Complete the test to throw when given a wrongly formatted number (ie. 'foobar')
            // Check the validity of the `value` parameter
            throwError(`A number or a string representing a number is needed to be able to unformat it, [${value}] given.`);
        }

        const settings = $.extend({}, defaultSettings, { strip: false }, options);
        const allowed = `-0123456789\\${settings.aDec}`;
        const autoStrip = new RegExp(`[^${allowed}]`, 'gi');
        value = value.toString();

        if (value.charAt(0) === '-') {
            settings.aNeg = '-';
        } else if (settings.nBracket && settings.nBracket.split(',')[0] === value.charAt(0)) {
            settings.aNeg = '-';
            settings.onOff = true;
            value = negativeBracket(value, settings);
        }

        value = value.replace(autoStrip, '');
        value = value.replace(',', '.');
        value = toLocale(value, settings.outputType);

        return value;
    };

    $.fn.autoUnformat = autoUnFormat; // The jQuery export

    /**
     * Validate the given option object.
     * If the options are valid, this function returns nothing, otherwise if the options are invalid, this function throws an error.
     *
     * This tests if the options are not conflicting and are well formatted.
     * This function is lenient since it only tests the settings properties ; it ignores any other properties the options object could have.
     *
     * @param {*} userOptions
     * @param {Boolean} shouldExtendDefaultOptions If TRUE, then this function will extends the `userOptions` passed by the user, with the default options.
     * @throws Error
     */
    validate = (userOptions, shouldExtendDefaultOptions = true) => {
        const debug = true; // The error here must always be thrown, since a badly configured options object will lead to wrong results, if any.

        if (isUndefinedOrNullOrEmpty(userOptions) || !isObject(userOptions) || isEmptyObj(userOptions)) {
            throwError(`The userOptions are invalid ; it should be a valid object, [${userOptions}] given.`);
        }

        // The user can choose if the `userOptions` has already been extended with the default options, or not
        let options;
        if (shouldExtendDefaultOptions) {
            options = $.extend({}, defaultSettings, userOptions);
        } else {
            options = userOptions;
        }

        const testPositiveInteger = /^[0-9]+$/;
        const testNumericalCharacters = /[0-9]+/;
        // const testFloatAndPossibleNegativeSign = /^-?[0-9]+(\.?[0-9]+)$/;
        const testFloatOrIntegerAndPossibleNegativeSign = /^-?[0-9]+(\.?[0-9]+)?$/;
        const testPositiveFloatOrInteger = /^[0-9]+(\.?[0-9]+)?$/;

        // Then tests the options individually
        if (!isInArray(options.aSep, [',', '.', ' ', ''])) {
            throwError(`The thousand separator character option 'aSep' is invalid ; it should be ',', '.', ' ' or empty (''), [${options.aSep}] given.`);
        }

        if (!isTrueOrFalseString(options.nSep) && !isBoolean(options.nSep)) {
            throwError(`The 'nSep' option is invalid ; it should be either 'false' or 'true', [${options.nSep}] given.`);
        }

        if (!testPositiveInteger.test(options.dGroup)) { // isNaN(parseInt(options.dGroup)) //DEBUG
            throwError(`The digital grouping for thousand separator option 'dGroup' is invalid ; it should be a positive integer, [${options.dGroup}] given.`);
        }

        if (!isInArray(options.aDec, [',', '.'])) {
            throwError(`The decimal separator character option 'aDec' is invalid ; it should be '.' or ',', [${options.aDec}] given.`);
        }

        // Checks if the decimal and thousand characters are the same
        if (options.aDec === options.aSep) {
            throwError(`autoNumeric will not function properly when the decimal character 'aDec' [${options.aDec}] and the thousand separator 'aSep' [${options.aSep}] are the same character.`);
        }

        if (!isNull(options.altDec) && !isString(options.altDec)) {
            throwError(`The alternate decimal separator character option 'altDec' is invalid ; it should be a string, [${options.altDec}] given.`);
        }

        if (options.aSign !== '' && !isString(options.aSign)) {
            throwError(`The currency symbol option 'aSign' is invalid ; it should be a string, [${options.aSign}] given.`);
        }

        if (!isInArray(options.pSign, ['p', 's'])) {
            throwError(`The placement of the currency sign option 'pSign' is invalid ; it should either be 'p' (prefix) or 's' (suffix), [${options.pSign}] given.`);
        }

        if (!isInArray(options.pNeg, ['p', 's', 'l', 'r'])) {
            throwError(`The placement of the negative sign option 'pNeg' is invalid ; it should either be 'p' (prefix), 's' (suffix), 'l' (left) or 'r' (right), [${options.pNeg}] given.`);
        }

        if (!isString(options.aSuffix) || (options.aSuffix !== '' && (contains(options.aSuffix, '-') || testNumericalCharacters.test(options.aSuffix)))) {
            throwError(`The additional suffix option 'aSuffix' is invalid ; it should not contains the negative sign '-' nor any numerical characters, [${options.aSuffix}] given.`);
        }

        if (!isNull(options.oLimits) && !isInArray(options.oLimits, ['ceiling', 'floor', 'ignore'])) {
            throwError(`The override min & max limits option 'oLimits' is invalid ; it should either be 'ceiling', 'floor' or 'ignore', [${options.oLimits}] given.`);
        }

        if (!isString(options.vMax) || !testFloatOrIntegerAndPossibleNegativeSign.test(options.vMax)) {
            throwError(`The maximum possible value option 'vMax' is invalid ; it should be a string that represents a positive or negative number, [${options.vMax}] given.`);
        }

        if (!isString(options.vMin) || !testFloatOrIntegerAndPossibleNegativeSign.test(options.vMin)) {
            throwError(`The minimum possible value option 'vMin' is invalid ; it should be a string that represents a positive or negative number, [${options.vMin}] given.`);
        }

        if (parseFloat(options.vMin) > parseFloat(options.vMax)) {
            throwError(`The minimum possible value option is greater than the maximum possible value option ; 'vMin' [${options.vMin}] should be smaller than 'vMax' [${options.vMax}].`);
        }

        if (!(isNull(options.mDec) ||
            (isInt(options.mDec) && options.mDec >= 0) || // If integer option
            (isString(options.mDec) && testPositiveInteger.test(options.mDec)))  // If string option
        ) {
            throwError(`The maximum number of decimal places option 'mDec' is invalid ; it should be a positive integer, [${options.mDec}] given.`);
        }

        // Write a warning message in the console if the number of decimal in vMin/vMax is overridden by mDec (and not if mDec is equal to the number of decimal used in vMin/vMax)
        const vMinMaxDecimalPlaces = maximumVMinAndVMaxDecimalLength(options.vMin, options.vMax);
        if (!isNull(options.mDec) &&
            ((hasDecimals(options.vMin) || hasDecimals(options.vMax)) && vMinMaxDecimalPlaces !== Number(options.mDec))) {
            warning(`Setting 'mDec' to [${options.mDec}] will override the decimals declared in 'vMin' [${options.vMin}] and 'vMax' [${options.vMax}].`, debug);
        }

        if (!isNull(options.eDec) && (!isString(options.eDec) || !testPositiveInteger.test(options.eDec))) {
            throwError(`The number of expanded decimal places option 'eDec' is invalid ; it should be a positive integer, [${options.eDec}] given.`);
        }

        // Checks if the extended decimal places "eDec" is greater than the normal decimal places "mDec"
        if (!isNull(options.eDec) && !isNull(options.mDec) && Number(options.mDec) < Number(options.eDec)) {
            throwError(`autoNumeric will not function properly when the extended decimal places 'eDec' [${options.eDec}] is greater than the 'mDec' [${options.mDec}] value.`);
        }

        if (!isNull(options.scaleDivisor) && !testPositiveFloatOrInteger.test(options.scaleDivisor)) {
            throwError(`The scale divisor option 'scaleDivisor' is invalid ; it should be a positive number, preferably an integer, [${options.scaleDivisor}] given.`);
        }

        if (!isNull(options.scaleDecimal) && !testPositiveInteger.test(options.scaleDecimal)) {
            throwError(`The scale number of decimals option 'scaleDecimal' is invalid ; it should be a positive integer, [${options.scaleDecimal}] given.`);
        }

        if (!isNull(options.scaleSymbol) && !isString(options.scaleSymbol)) {
            throwError(`The scale symbol option 'scaleSymbol' is invalid ; it should be a string, [${options.scaleSymbol}] given.`);
        }

        if (!isTrueOrFalseString(options.aStor) && !isBoolean(options.aStor)) {
            throwError(`The save to session storage option 'aStor' is invalid ; it should be either 'false' or 'true', [${options.aStor}] given.`);
        }

        if (!isInArray(options.mRound, [
            'S',
            'A',
            's',
            'a',
            'B',
            'U',
            'D',
            'C',
            'F',
            'N05',
            'CHF',
            'U05',
            'D05',
        ])) {
            throwError(`The rounding method option 'mRound' is invalid ; it should either be 'S', 'A', 's', 'a', 'B', 'U', 'D', 'C', 'F', 'N05', 'CHF', 'U05' or 'D05' (cf. documentation), [${options.mRound}] given.`);
        }

        if (!isTrueOrFalseString(options.aPad) && !isBoolean(options.aPad)) {
            throwError(`The control decimal padding option 'aPad' is invalid ; it should be either 'false' or 'true', [${options.aPad}] given.`);
        }

        if (!isNull(options.nBracket) && !isInArray(options.nBracket, ['(,)', '[,]', '<,>', '{,}'])) {
            throwError(`The brackets for negative values option 'nBracket' is invalid ; it should either be '(,)', '[,]', '<,>' or '{,}', [${options.nBracket}] given.`);
        }

        if (!isInArray(options.wEmpty, ['focus', 'press', 'always', 'zero'])) {
            throwError(`The display on empty string option 'wEmpty' is invalid ; it should either be 'focus', 'press', 'always' or 'zero', [${options.wEmpty}] given.`);
        }

        if (!isInArray(options.lZero, ['allow', 'deny', 'keep'])) {
            throwError(`The leading zero behavior option 'lZero' is invalid ; it should either be 'allow', 'deny' or 'keep', [${options.lZero}] given.`);
        }

        if (!isTrueOrFalseString(options.aForm) && !isBoolean(options.aForm)) {
            throwError(`The format on initialization option 'aForm' is invalid ; it should be either 'false' or 'true', [${options.aForm}] given.`);
        }

        if (!isTrueOrFalseString(options.sNumber) && !isBoolean(options.sNumber)) {
            throwError(`The select number only option 'sNumber' is invalid ; it should be either 'false' or 'true', [${options.sNumber}] given.`);
        }

        if (!isNull(options.anDefault) && (options.anDefault !== '' && !testFloatOrIntegerAndPossibleNegativeSign.test(options.anDefault))) {
            throwError(`The unformatted default value option 'anDefault' is invalid ; it should be a string that represents a positive or negative number, [${options.anDefault}] given.`);
        }

        if (!isTrueOrFalseString(options.unSetOnSubmit) && !isBoolean(options.unSetOnSubmit)) {
            throwError(`The remove formatting on submit option 'unSetOnSubmit' is invalid ; it should be either 'false' or 'true', [${options.unSetOnSubmit}] given.`);
        }

        if (!isNull(options.outputType) && !isInArray(options.outputType, [
            'string',
            'number',
            '.',
            '-.',
            ',',
            '-,',
            '.-',
            ',-',
        ])) {
            throwError(`The custom locale format option 'outputType' is invalid ; it should either be null, 'string', 'number', '.', '-.', ',', '-,', '.-' or ',-', [${options.outputType}] given.`);
        }

        if (!isTrueOrFalseString(options.debug) && !isBoolean(options.debug)) {
            throwError(`The debug option 'debug' is invalid ; it should be either 'false' or 'true', [${options.debug}] given.`);
        }
    };

    $.fn.validate = validate;

    /**
     * Return TRUE is the settings/options are valid, FALSE otherwise.
     *
     * @param {object} options
     * @returns {boolean}
     */
    areSettingsValid = function(options) {
        let isValid = true;
        try {
            validate(options);
        }
        catch (error) {
            isValid = false;
        }

        return isValid;
    };

    /**
     * Create a custom event.
     * cf. https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
     *
     * @param eventName string
     * @param detail
     * @returns {CustomEvent}
     */
    function createCustomEvent(eventName, detail) {
        return new CustomEvent(eventName, { detail, bubbles: false, cancelable: false }); // This is not supported by default by IE ; We use the polyfill for IE9 and later.
    }

    /**
     * Create a custom event and immediately broadcast it.
     *
     * @param eventName string
     * @param detail
     * @returns {boolean}
     */
    function sendCustomEvent(eventName, detail = null) {
        return document.dispatchEvent(createCustomEvent(eventName, detail));
    }

    /**
     * Polyfill from https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent for obsolete browsers (IE)
     */
    (function() {
        if (typeof window.CustomEvent === 'function') {
            return false;
        }

        function CustomEvent(event, params) {
            params = params || { bubbles: false, cancelable: false, detail: void(0) };
            const evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        }

        CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent = CustomEvent;
    })();
}));

/**
 * This exports the interface for the autoNumeric object
 */
export default {
    format  : autoFormat,
    unFormat: autoUnFormat,
    getDefaultConfig,
    validate, // an.validate(options) : throws if necessary
    areSettingsValid, //an.areSettingsValid(options) : return true or false //TODO Is this redundant? Should we let the developers wrap each autoNumeric.validate() calls in try/catch block? Or should we just facilitate their life by doing it already?

    //TODO Complete the interface with functions having the following signatures :
    //init         : an.init(options, input)
    //get          : an.get(input)
    //set          : an.set(value, input)
    //formString   : an.formString(form)
    //formArray    : an.formArray(form)
    //getFormatted : an.getFormatted(input)
    //unset        : an.unset(input) //to rename to 'unformat'? (and merge with autoUnFormat/unFormat?)
    //reformat     : an.reformat(input) // 'reSet' is very to close to 'reset' and therefore should be renamed. We could still expose 'reSet', but add a @deprecated tag on its declaration.
    //settings     : an.settings(input)
    //update       : an.update(options, input)
    //wipe         : an.wipe(input)
    //destroy      : an.destroy(input)
};
