/**
 * autoNumeric.js
 * @version      2.0-beta.10
 * @date         2016-12-21 UTC 06:00
 *
 * @author       Bob Knothe
 * @contributors Sokolov Yura and other Github users, cf. AUTHORS.md.
 * @copyright    2009 Robert J. Knothe http://www.decorplanit.com/plugin/
 * @since        2009-08-09
 *
 * @summary      autoNumeric is a jQuery plugin that automatically formats currency
 * (money) and numbers as-you-type in a form inputs. It supports most
 * international numeric formats and currency signs including those used in
 * Europe, North and South America, Asia, as well as India's' lakhs.
 *
 *               Note : Some functions are borrowed from big.js
 * @link         https://github.com/MikeMcl/big.js/
 *
 * Please report any bugs to https://github.com/BobKnothe/autoNumeric
 *
 * @license      Released under the MIT License
 * @link         http://www.opensource.org/licenses/mit-license.php
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
     * Deprecated older option name : aSep
     */
    digitGroupSeparator: ',',

    /* When true => removes the thousand separator, currency symbol & suffix "focusin"
     * example if the input value "$ 1,999.88 suffix"
     * on "focusin" it becomes "1999.88" and back to "$ 1,999.88 suffix" on focus out.
     * Deprecated older option name : nSep
     */
    noSeparatorOnFocus: false,

    /* Digital grouping for the thousand separator used in Format
     * digitalGroupSpacing: "2", results in 99,99,99,999 India's lakhs
     * digitalGroupSpacing: "2s", results in 99,999,99,99,999 India's lakhs scaled
     * digitalGroupSpacing: "3", results in 999,999,999 default
     * digitalGroupSpacing: "4", results in 9999,9999,9999 used in some Asian countries
     * Deprecated older option name : dGroup
     */
    digitalGroupSpacing: '3',

    /* Allowed decimal separator characters
     * period "full stop" = "."
     * comma = ","
     * Deprecated older option name : aDec
     */
    decimalCharacter: '.',

    /* Allow to declare alternative decimal separator which is automatically replaced by decimalCharacter
     * developed for countries the use a comma "," as the decimal character
     * and have keyboards\numeric pads that have a period 'full stop' as the decimal characters (Spain is an example)
     * Deprecated older option name : altDec
     */
    decimalCharacterAlternative: null,

    /* currencySymbol = allowed currency symbol
     * Must be in quotes currencySymbol: "$"
     * space to the right of the currency symbol currencySymbol: '$ '
     * space to the left of the currency symbol currencySymbol: ' $'
     * Deprecated older option name : aSign
     */
    currencySymbol: '',

    /* currencySymbolPlacement = placement of currency sign as a p=prefix or s=suffix
     * for prefix currencySymbolPlacement: "p" (default)
     * for suffix currencySymbolPlacement: "s"
     * Deprecated older option name : pSign
     */
    currencySymbolPlacement: 'p',

    /* Placement of negative sign relative to the currencySymbol option l=left, r=right, p=prefix & s=suffix
     * -1,234.56  => default no options required
     * -$1,234.56 => {currencySymbol: "$"}
     * $-1,234.56 => {currencySymbol: "$", negativePositiveSignPlacement: "r"}
     * -1,234.56$ => {currencySymbol: "$", currencySymbolPlacement: "s", negativePositiveSignPlacement: "p"}
     * 1,234.56-  => {negativePositiveSignPlacement: "s"}
     * $1,234.56- => {currencySymbol: "$", negativePositiveSignPlacement: "s"}
     * 1,234.56-$ => {currencySymbol: "$", currencySymbolPlacement: "s"}
     * 1,234.56$- => {currencySymbol: "$", currencySymbolPlacement: "s", negativePositiveSignPlacement: "r"}
     * Deprecated older option name : pNeg
     */
    negativePositiveSignPlacement: 'l',

    /* Additional suffix
     * Must be in quotes suffixText: 'gross', a space is allowed suffixText: ' dollars'
     * Numeric characters and negative sign not allowed'
     * Deprecated older option name : aSuffix
     */
    suffixText: '',

    /* Override min max limits
     * overrideMinMaxLimits: "ceiling" adheres to maximumValue and ignores minimumValue settings
     * overrideMinMaxLimits: "floor" adheres to minimumValue and ignores maximumValue settings
     * overrideMinMaxLimits: "ignore" ignores both minimumValue & maximumValue
     * Deprecated older option name : oLimits
     */
    overrideMinMaxLimits: null,

    /* Maximum possible value
     * value must be enclosed in quotes and use the period for the decimal point
     * value must be larger than minimumValue
     * Deprecated older option name : vMax
     */
    maximumValue: '9999999999999.99', // 9.999.999.999.999,99 ~= 10000 billions

    /* Minimum possible value
     * value must be enclosed in quotes and use the period for the decimal point
     * value must be smaller than maximumValue
     * Deprecated older option name : vMin
     */
    minimumValue: '-9999999999999.99', // -9.999.999.999.999,99 ~= 10000 billions

    /* Maximum number of decimal places = used to override decimal places set by the minimumValue & maximumValue values
     * Deprecated older option name : mDec
     */
    decimalPlacesOverride: null,

    /* Expanded decimal places visible when input has focus - example:
     * {decimalPlacesShownOnFocus: "5"} and the default 2 decimal places with focus "1,000.12345" without focus "1,000.12" the results depends on the rounding method used
     * the "get" method returns the extended decimal places
     * Deprecated older option name : eDec
     */
    decimalPlacesShownOnFocus: null,

    /* The next three options (scaleDivisor, scaleDecimalPlaces & scaleSymbol) handle scaling of the input when the input does not have focus
     * Please note that the non-scaled value is held in data and it is advised that you use the "saveValueToSessionStorage" option to ensure retaining the value
     * ["divisor", "decimal places", "symbol"]
     * Example: with the following options set {scaleDivisor: '1000', scaleDecimalPlaces: '1', scaleSymbol: ' K'}
     * Example: focusin value "1,111.11" focusout value "1.1 K"
     */

    /* The `scaleDivisor` decides the on focus value and places the result in the input on focusout
     * Example {scaleDivisor: '1000'} or <input data-scale-divisor="1000">
     * The divisor value - does not need to be whole number but please understand that Javascript has limited accuracy in math
     * The "get" method returns the full value, including the 'hidden' decimals.
     */
    scaleDivisor: null,

    /*
     * The `scaleDecimalPlaces` option is the number of decimal place when not in focus - for this to work, `scaledDivisor` must not be `null`.
     * This is optional ; if omitted the decimal places will be the same when the input has the focus.
     * Deprecated older option name : scaleDecimal
     */
    scaleDecimalPlaces: null,

    /*
     * The `scaleSymbol` option is a symbol placed as a suffix when not in focus.
     * This is optional too.
     */
    scaleSymbol: null,

    /* Set to true to allow the decimalPlacesShownOnFocus value to be saved with sessionStorage
     * if ie 6 or 7 the value will be saved as a session cookie
     * Deprecated older option name : aStor
     */
    saveValueToSessionStorage: false,

    /*
     * Manage how autoNumeric react when the user tries to paste an invalid number.
     * - 'error'    : (This is the default behavior) The input value is not changed and an error is output in the console.
     * - 'ignore'   : idem than 'error', but fail silently without outputting any error/warning in the console.
     * - 'clamp'    : if the pasted value is either too small or too big regarding the minimumValue and maximumValue range, then the result is clamped to those limits.
     * - 'truncate' : autoNumeric will insert as many pasted numbers it can at the initial caret/selection, until everything is pasted, or the range limit is hit.
     *                The non-pasted numbers are dropped and therefore not used at all.
     * - 'replace'  : autoNumeric will first insert as many pasted numbers it can at the initial caret/selection, then if the range limit is hit, it will try
     *                to replace one by one the remaining initial numbers (on the right side of the caret) with the rest of the pasted numbers.
     *
     * Note 1 : A paste content starting with a negative sign '-' will be accepted anywhere in the input, and will set the resulting value as a negative number
     * Note 2 : A paste content starting with a number will be accepted, even if the rest is gibberish (ie. '123foobar456').
     *          Only the first number will be used (here '123').
     * Note 3 : The paste event works with the `decimalPlacesShownOnFocus` option too.
     */
    //TODO Shouldn't we use `truncate` as the default value?
    onInvalidPaste: 'error',

    /* method used for rounding
     * roundingMethod: "S", Round-Half-Up Symmetric (default)
     * roundingMethod: "A", Round-Half-Up Asymmetric
     * roundingMethod: "s", Round-Half-Down Symmetric (lower case s)
     * roundingMethod: "a", Round-Half-Down Asymmetric (lower case a)
     * roundingMethod: "B", Round-Half-Even "Bankers Rounding"
     * roundingMethod: "U", Round Up "Round-Away-From-Zero"
     * roundingMethod: "D", Round Down "Round-Toward-Zero" - same as truncate
     * roundingMethod: "C", Round to Ceiling "Toward Positive Infinity"
     * roundingMethod: "F", Round to Floor "Toward Negative Infinity"
     * roundingMethod: "N05" Rounds to the nearest .05 => same as "CHF" used in 1.9X and still valid
     * roundingMethod: "U05" Rounds up to next .05
     * roundingMethod: "D05" Rounds down to next .05
     * Deprecated older option name : mRound
     */
    roundingMethod: 'S',

    /* Controls decimal padding
     * allowDecimalPadding: true - always Pad decimals with zeros
     * allowDecimalPadding: false - does not pad with zeros.
     * Note: setting allowDecimalPadding to 'false' will override the 'decimalPlacesOverride' setting.
     *
     * thanks to Jonas Johansson for the suggestion
     * Deprecated older option name : aPad
     */
    allowDecimalPadding: true,

    /* Adds brackets on negative values (ie. transforms '-$ 999.99' to '(999.99)')
     * Those brackets are visible only when the field does NOT have the focus.
     * The left and right symbols should be enclosed in quotes and separated by a comma
     * negativeBracketsTypeOnBlur: null - (default)
     * negativeBracketsTypeOnBlur: '(,)', negativeBracketsTypeOnBlur: '[,]', negativeBracketsTypeOnBlur: '<,>' or negativeBracketsTypeOnBlur: '{,}'
     * Deprecated older option name : nBracket
     */
    negativeBracketsTypeOnBlur: null,

    /* Displayed on empty string ""
     * emptyInputBehavior: "focus" - (default) currency sign displayed and the input receives focus
     * emptyInputBehavior: "press" - currency sign displays on any key being pressed
     * emptyInputBehavior: "always" - always displays the currency sign only
     * emptyInputBehavior: "zero" - if the input has no value on focus out displays a zero "rounded" with or without a currency sign
     * Deprecated older option name : wEmpty
     */
    emptyInputBehavior: 'focus',

    /* Controls leading zero behavior
     * leadingZero: "allow", - allows leading zeros to be entered. Zeros will be truncated when entering additional digits. On focusout zeros will be deleted.
     * leadingZero: "deny", - allows only one leading zero on values less than one
     * leadingZero: "keep", - allows leading zeros to be entered. on focusout zeros will be retained.
     * Deprecated older option name : lZero
     */
    leadingZero: 'deny',

    /* Determine if the default value will be formatted on initialization.
     * true = automatically formats the default value on initialization
     * false = will not format the default value on initialization
     * Deprecated older option name : aForm
     */
    formatOnPageLoad: true,

    /* Determine if the select all keyboard command will select the complete input text, or only the input numeric value
     * Note : If the currency symbol is between the numeric value and the negative sign, only the numeric value will selected
     * Deprecated older option name : sNumber
     */
    selectNumberOnly: false,

    /* Helper option for ASP.NET postback
     * should be the value of the unformatted default value
     * examples:
     * no default value="" {defaultValueOverride: ""}
     * value=1234.56 {defaultValueOverride: '1234.56'}
     * Deprecated older option name : anDefault
     */
    defaultValueOverride: null,

    /* Removes formatting on submit event
     * this output format: positive nnnn.nn, negative -nnnn.nn
     * review the 'unSet' method for other formats
     * Deprecated older option name : unSetOnSubmit
     */
    unformatOnSubmit: false,

    /* Allows the output to be in the locale format via the "get", "getString" & "getArray" methods
     * null or 'string' => 'nnnn.nn' or '-nnnn.nn' as text type. This is the default behavior.
     * 'number'         => nnnn.nn or -nnnn.nn as a Number (Warning: this works only for integers inferior to Number.MAX_SAFE_INTEGER)
     * ',' or '-,'      => 'nnnn,nn' or '-nnnn,nn'
     * '.-'             => 'nnnn.nn' or 'nnnn.nn-'
     * ',-'             => 'nnnn,nn' or 'nnnn,nn-'
     * Deprecated older option name : outputType
     */
    outputFormat: null,

    /* Error handling function
     * true => all warning are shown
     * false => no warnings are shown, only the thrown errors
     * Deprecated older option name : debug
     */
    showWarnings: true,

    /*
     * This option is the 'strict mode' (aka 'debug' mode), which allows autoNumeric to strictly analyse the options passed, and fails if an unknown options is used in the settings object.
     * You should set that to 'TRUE' if you want to make sure you are only using 'pure' autoNumeric settings objects in your code.
     * If you see uncaught errors in the console and your code starts to fail, this means somehow those options gets corrupted by another program.
     */
    failOnUnknownOption: false,
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
     * Return the pasted text that will be used.
     *
     * @param text
     * @param holder
     * @returns {string|void|XML|*}
     */
    function preparePastedText(text, holder) {
        return stripAllNonNumberCharacters(text, holder.settingsClone).replace(holder.settingsClone.decimalCharacter, '.');
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
    // function hasDecimals(str) {
    //     const [, decimalPart] = str.split('.');
    //     return !isUndefined(decimalPart);
    // }

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
     * Return the code for the key used to generate the given event.
     *
     * @param event
     * @returns {string|Number}
     */
    function key(event) {
        return (typeof event.which === 'undefined')?event.keyCode:event.which;
    }

    /**
     * Return TRUE if the given value (a number as a string) is within the range set in the settings `minimumValue` and `maximumValue`, FALSE otherwise.
     *
     * @param {string} value
     * @param {object} parsedMinValue Parsed via the `parseStr()` function
     * @param {object} parsedMaxValue Parsed via the `parseStr()` function
     * @returns {boolean}
     */
    function checkIfInRange(value, parsedMinValue, parsedMaxValue) {
        const parsedValue = parseStr(value);
        return testMinMax(parsedMinValue, parsedValue) > -1 && testMinMax(parsedMaxValue, parsedValue) < 1;
    }

    /**
     * Return TRUE if the given string contains a negative sign on the first character.
     *
     * @param {string} string A number represented by a string
     * @returns {boolean}
     */
    function isNegative(string) {
        return string.charAt(0) === '-';
    }

    /**
     * Return the negative version of the value (represented as a string) given as a parameter.
     *
     * @param {string} value
     * @returns {*}
     */
    function setRawNegativeSign(value) {
        if (!isNegative(value)) {
            return `-${value}`;
        }

        return value;
    }

    /**
     * Insert a character or a string at the index given (0 being the far left side).
     *
     * @param str {String}
     * @param char {String}
     * @param caretPosition {int}
     * @returns {string}
     */
    function insertCharAtPosition(str, char, caretPosition) {
        return `${str.slice(0, caretPosition)}${char}${str.slice(caretPosition)}`;
    }

    /**
     * Replace the character at the position `index` in the string `string` by the character(s) `newCharacter`.
     *
     * @param {string} string
     * @param {int} index
     * @param {string} newCharacter
     * @returns {string}
     */
    function replaceCharAt(string, index, newCharacter) {
        return `${string.substr(0, index)}${newCharacter}${string.substr(index + newCharacter.length)}`;
    }

    /**
     * Return the value clamped to the nearest minimum/maximum value, as defined in the settings.
     *
     * @param {string|number} value
     * @param {object} settings
     * @returns {number}
     */
    function clampToRangeLimits(value, settings) {
        //XXX This function always assume `settings.minimumValue` is lower than `settings.maximumValue`
        return Math.max(settings.minimumValue, Math.min(settings.maximumValue, value));
    }

    /**
     * Return the number of number or dot characters on the left side of the caret, in a formatted number.
     *
     * @param {string} formattedNumberString
     * @param {int} caretPosition This must be a positive integer
     * @param {string} decimalCharacter
     * @returns {number}
     */
    function countNumberCharactersOnTheCaretLeftSide(formattedNumberString, caretPosition, decimalCharacter) {
        // Here we count the dot and report it as a number character too, since it will 'stay' in the Javascript number when unformatted
        const numberDotOrNegativeSign = new RegExp(`[0-9${decimalCharacter}-]`); // No need to escape the decimal character here, since it's in `[]`

        let numberDotAndNegativeSignCount = 0;
        for (let i = 0; i < caretPosition; i++) {
            // Test if the character is a number, a dot or an hyphen. If it is, count it, otherwise ignore it
            if (numberDotOrNegativeSign.test(formattedNumberString[i])) {
                numberDotAndNegativeSignCount++;
            }
        }

        return numberDotAndNegativeSignCount;
    }

    /**
     * Walk the `formattedNumberString` from left to right, one char by one, counting the `formattedNumberStringIndex`.
     * If the char is in the `rawNumberString` (starting at index 0), then `rawNumberStringIndex++`, and continue until
     * there is no more characters in `rawNumberString`) or that `rawNumberStringIndex === caretPositionInRawValue`.
     * When you stop, the `formattedNumberStringIndex` is the position where the caret should be set.
     *
     * @example
     * 1234567|89.01   : position 7 (rawNumberString)
     * 123.456.7|89,01 : position 9 (formattedNumberString)
     *
     * @param {string} rawNumberString
     * @param {int} caretPositionInRawValue
     * @param {string} formattedNumberString
     * @param {string} decimalCharacter
     * @returns {*}
     */
    function findCaretPositionInFormattedNumber(rawNumberString, caretPositionInRawValue, formattedNumberString, decimalCharacter) {
        const formattedNumberStringSize = formattedNumberString.length;
        const rawNumberStringSize = rawNumberString.length;

        let formattedNumberStringIndex;
        let rawNumberStringIndex = 0;
        for (formattedNumberStringIndex = 0;
             formattedNumberStringIndex < formattedNumberStringSize &&
             rawNumberStringIndex < rawNumberStringSize &&
             rawNumberStringIndex < caretPositionInRawValue;
             formattedNumberStringIndex++) {
            if (rawNumberString[rawNumberStringIndex] === formattedNumberString[formattedNumberStringIndex] ||
                (rawNumberString[rawNumberStringIndex] === '.' && formattedNumberString[formattedNumberStringIndex] === decimalCharacter)) {
                rawNumberStringIndex++;
            }
        }

        return formattedNumberStringIndex;
    }

    /**
     * Return the number of dot '.' in the given text.
     *
     * @param {string} text
     * @returns {number}
     */
    function countDotsInText(text) {
        return countCharInText('.', text);
    }

    /**
     * Count the number of occurrence of the given character, in the given text.
     *
     * @param {string} character
     * @param {string} text
     * @returns {number}
     */
    function countCharInText(character, text) {
        let charCounter = 0;
        for (let i = 0; i < text.length; i++) {
            if (text[i] === character) {
                charCounter++;
            }
        }

        return charCounter;
    }

    /**
     * Return the index that can be used to set the caret position.
     * This takes into account that the position is starting at '0', not 1.
     *
     * @param characterCount
     * @returns {number}
     */
    function convertCharacterCountToIndexPosition(characterCount) {
        return Math.max(characterCount, characterCount - 1);
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
    function setElementSelection(that, start, end = null) {
        if (isUndefinedOrNullOrEmpty(end)) {
            end = start;
        }

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
     * @param {boolean} showWarning If FALSE, then the warning message is not displayed
     */
    function warning(message, showWarning = true) {
        if (showWarning) {
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
     * Determine the maximum decimal length from the minimumValue and maximumValue settings
     */
    function maximumVMinAndVMaxDecimalLength(minimumValue, maximumValue) {
        return Math.max(decimalPlaces(minimumValue), decimalPlaces(maximumValue));
    }

    /**
     * Strip all unwanted characters and leave only a number alert
     *
     * @param {string} s
     * @param {object} settings
     * @returns {string|*}
     */
    function stripAllNonNumberCharacters(s, settings) {
        if (settings.currencySymbol !== '') {
            // Remove currency sign
            s = s.replace(settings.currencySymbol, '');
        }
        if (settings.suffixText) {
            // Remove suffix
            while (contains(s, settings.suffixText)) {
                s = s.replace(settings.suffixText, '');
            }
        }

        // First replace anything before digits
        s = s.replace(settings.skipFirstAutoStrip, '$1$2');

        if ((settings.negativePositiveSignPlacement === 's' || (settings.currencySymbolPlacement === 's' && settings.negativePositiveSignPlacement !== 'p')) && contains(s, '-') && s !== '') {
            settings.trailingNegative = true;
        }

        // Then replace anything after digits
        s = s.replace(settings.skipLastAutoStrip, '$1');

        // Then remove any uninteresting characters
        s = s.replace(settings.allowedAutoStrip, '');
        if (settings.decimalCharacterAlternative) {
            s = s.replace(settings.decimalCharacterAlternative, settings.decimalCharacter);
        }

        // Get only number string
        const m = s.match(settings.numRegAutoStrip);
        s = m ? [m[1], m[2], m[3]].join('') : '';

        if (settings.leadingZero === 'allow' || settings.leadingZero === 'keep') {
            let nSign = '';
            const [integerPart, decimalPart] = s.split(settings.decimalCharacter);
            let modifiedIntegerPart = integerPart;
            if (contains(modifiedIntegerPart, settings.negativeSignCharacter)) {
                nSign = settings.negativeSignCharacter;
                modifiedIntegerPart = modifiedIntegerPart.replace(settings.negativeSignCharacter, '');
            }

            // Strip leading zero on positive value if need
            if (nSign === '' && modifiedIntegerPart.length > settings.mIntPos && modifiedIntegerPart.charAt(0) === '0') {
                modifiedIntegerPart = modifiedIntegerPart.slice(1);
            }

            // Strip leading zero on negative value if need
            if (nSign !== '' && modifiedIntegerPart.length > settings.mIntNeg && modifiedIntegerPart.charAt(0) === '0') {
                modifiedIntegerPart = modifiedIntegerPart.slice(1);
            }

            s = `${nSign}${modifiedIntegerPart}${isUndefined(decimalPart)?'':settings.decimalCharacter + decimalPart}`;
        }

        if ((settings.onOff && settings.leadingZero === 'deny') ||
            (!settings.onOff && settings.leadingZero === 'allow')) {
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
        if ((settings.currencySymbolPlacement === 'p' && settings.negativePositiveSignPlacement === 'l') || (settings.currencySymbolPlacement === 's' && settings.negativePositiveSignPlacement === 'p')) {
            const [firstBracket, lastBracket] = settings.negativeBracketsTypeOnBlur.split(',');
            if (!settings.onOff) {
                s = s.replace(settings.negativeSignCharacter, '');
                s = firstBracket + s + lastBracket;
            } else if (settings.onOff && s.charAt(0) === firstBracket) {
                s = s.replace(firstBracket, settings.negativeSignCharacter);
                s = s.replace(lastBracket, '');
            }
        }

        return s;
    }

    /**
     * Convert locale format to Javascript numeric string
     * Allows locale decimal separator to be a period or a comma - no thousand separator allowed of currency signs allowed
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
     * See the "outputFormat" option definition for more details.
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
                throwError(`The given outputFormat [${locale}] option is not recognized.`);
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
        if (settings.decimalCharacter !== '.') {
            s = s.replace(settings.decimalCharacter, '.');
        }
        if (settings.negativeSignCharacter !== '-' && settings.negativeSignCharacter !== '') {
            s = s.replace(settings.negativeSignCharacter, '-');
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
        if (settings.negativeSignCharacter !== '-' && settings.negativeSignCharacter !== '') {
            s = s.replace('-', settings.negativeSignCharacter);
        }
        if (settings.decimalCharacter !== '.') {
            s = s.replace('.', settings.decimalCharacter);
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
        if (inputValue === '' || inputValue === settings.negativeSignCharacter) {
            if (settings.emptyInputBehavior === 'always' || signOnEmpty) {
                return (settings.negativePositiveSignPlacement === 'l') ? inputValue + settings.currencySymbol + settings.suffixText : settings.currencySymbol + inputValue + settings.suffixText;
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
            inputValue = stripAllNonNumberCharacters(inputValue, settings);
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

        settings.digitalGroupSpacing = settings.digitalGroupSpacing.toString();
        let digitalGroup;
        switch (settings.digitalGroupSpacing) {
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
        let [integerPart, decimalPart] = inputValue.split(settings.decimalCharacter);
        if (settings.decimalCharacterAlternative && isUndefined(decimalPart)) {
            [integerPart, decimalPart] = inputValue.split(settings.decimalCharacterAlternative);
        }

        if (settings.digitGroupSeparator !== '') {
            // Re-inserts the thousand separator via a regular expression
            while (digitalGroup.test(integerPart)) {
                integerPart = integerPart.replace(digitalGroup, `$1${settings.digitGroupSeparator}$2`);
            }
        }

        if (settings.decimalPlacesOverride !== 0 && !isUndefined(decimalPart)) {
            if (decimalPart.length > settings.decimalPlacesOverride) {
                decimalPart = decimalPart.substring(0, settings.decimalPlacesOverride);
            }

            // Joins the whole number with the decimal value
            inputValue = integerPart + settings.decimalCharacter + decimalPart;
        } else {
            // Otherwise if it's an integer
            inputValue = integerPart;
        }

        if (settings.currencySymbolPlacement === 'p') {
            if (isNegative) {
                switch (settings.negativePositiveSignPlacement) {
                    case 'l':
                        inputValue = settings.negativeSignCharacter + settings.currencySymbol + inputValue;
                        break;
                    case 'r':
                        inputValue = settings.currencySymbol + settings.negativeSignCharacter + inputValue;
                        break;
                    case 's':
                        inputValue = settings.currencySymbol + inputValue + settings.negativeSignCharacter;
                        break;
                    default :
                        //
                }
            } else {
                inputValue = settings.currencySymbol + inputValue;
            }
        }

        if (settings.currencySymbolPlacement === 's') {
            if (isNegative) {
                switch (settings.negativePositiveSignPlacement) {
                    case 'r':
                        inputValue = inputValue + settings.currencySymbol + settings.negativeSignCharacter;
                        break;
                    case 'l':
                        inputValue = inputValue + settings.negativeSignCharacter + settings.currencySymbol;
                        break;
                    case 'p':
                        inputValue = settings.negativeSignCharacter + inputValue + settings.currencySymbol;
                        break;
                    default :
                    //
                }
            } else {
                inputValue = inputValue + settings.currencySymbol;
            }
        }

        // Removes the negative sign and places brackets
        if (settings.negativeBracketsTypeOnBlur !== null && (settings.rawValue < 0 || inputValue.charAt(0) === '-')) {
            inputValue = negativeBracket(inputValue, settings);
        }
        settings.trailingNegative = false;

        return inputValue + settings.suffixText;
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
                // Allows padding when decimalPlacesOverride equals one - leaves one zero trailing the decimal character
                regex = /(\.\d(?:\d*[1-9])?)0*$/;
                break;
            default :
                // Removes access zeros to the decimalPlacesOverride length when allowDecimalPadding is set to true
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
        if (settings.roundingMethod === 'N05' || settings.roundingMethod === 'CHF' || settings.roundingMethod === 'U05' || settings.roundingMethod === 'D05') {
            switch (settings.roundingMethod) {
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
        if (settings.allowDecimalPadding) {
            rDec = settings.decimalPlacesOverride;
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
        if ((Number(inputValue) > 0 && settings.leadingZero !== 'keep') || (inputValue.length > 0 && settings.leadingZero === 'allow')) {
            inputValue = inputValue.replace(/^0*(\d)/, '$1');
        }

        const dPos = inputValue.lastIndexOf('.');
        const inputValueHasADot = dPos === -1;

        // Virtual decimal position
        const vdPos = inputValueHasADot ? inputValue.length - 1 : dPos;

        // Checks decimal places to determine if rounding is required :
        // Check if no rounding is required
        let cDec = (inputValue.length - 1) - vdPos;

        if (cDec <= settings.decimalPlacesOverride) {
            // Check if we need to pad with zeros
            ivRounded = inputValue;
            if (cDec < rDec) {
                if (inputValueHasADot) {
                    ivRounded += settings.decimalCharacter;
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
            rLength = settings.decimalPlacesOverride - 1;
        } else {
            rLength = settings.decimalPlacesOverride + dPos;
        }

        const tRound = Number(inputValue.charAt(rLength + 1));
        const odd = (inputValue.charAt(rLength) === '.') ? (inputValue.charAt(rLength - 1) % 2) : (inputValue.charAt(rLength) % 2);
        let ivArray = inputValue.substring(0, rLength + 1).split('');

        if ((tRound > 4 && settings.roundingMethod === 'S')                  || // Round half up symmetric
            (tRound > 4 && settings.roundingMethod === 'A' && nSign === '')  || // Round half up asymmetric positive values
            (tRound > 5 && settings.roundingMethod === 'A' && nSign === '-') || // Round half up asymmetric negative values
            (tRound > 5 && settings.roundingMethod === 's')                  || // Round half down symmetric
            (tRound > 5 && settings.roundingMethod === 'a' && nSign === '')  || // Round half down asymmetric positive values
            (tRound > 4 && settings.roundingMethod === 'a' && nSign === '-') || // Round half down asymmetric negative values
            (tRound > 5 && settings.roundingMethod === 'B')                  || // Round half even "Banker's Rounding"
            (tRound === 5 && settings.roundingMethod === 'B' && odd === 1)   || // Round half even "Banker's Rounding"
            (tRound > 0 && settings.roundingMethod === 'C' && nSign === '')  || // Round to ceiling toward positive infinite
            (tRound > 0 && settings.roundingMethod === 'F' && nSign === '-') || // Round to floor toward negative infinite
            (tRound > 0 && settings.roundingMethod === 'U')) {                  // Round up away from zero
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
        const decimalCharacter = settings.decimalCharacter;
        const decimalPlacesOverride = settings.decimalPlacesOverride;
        s = (paste === 'paste') ? autoRound(s, settings) : s;

        if (decimalCharacter && decimalPlacesOverride) {
            const [integerPart, decimalPart] = s.split(decimalCharacter);

            // truncate decimal part to satisfying length since we would round it anyway
            if (decimalPart && decimalPart.length > decimalPlacesOverride) {
                if (decimalPlacesOverride > 0) {
                    const modifiedDecimalPart = decimalPart.substring(0, decimalPlacesOverride);
                    s = `${integerPart}${decimalCharacter}${modifiedDecimalPart}`;
                } else {
                    s = integerPart;
                }
            }
        }

        return s;
    }

    /**
     * Function to parse minimumValue, maximumValue & the input value to prepare for testing to determine if the value falls within the min / max range
     * Return an object example: minimumValue: "999999999999999.99" returns the following "{s: -1, e: 12, c: Array[15]}"
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
     * and lays between settings.minimumValue and settings.maximumValue
     * and the string length does not exceed the digits in settings.minimumValue and settings.maximumValue
     *
     * @param {string} s
     * @param {object} settings
     * @returns {*}
     */
    function autoCheck(s, settings) {
        s = s.toString();
        s = s.replace(',', '.');
        const minParse = parseStr(settings.minimumValue);
        const maxParse = parseStr(settings.maximumValue);
        const valParse = parseStr(s);

        let result;
        switch (settings.overrideMinMaxLimits) {
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
     * Original settings saved for use when decimalPlacesShownOnFocus & noSeparatorOnFocus options are being used.
     * Those original settings are used exclusively in the `focusin` and `focusout` event handlers.
     *
     * @param {object} settings
     */
    function keepAnOriginalSettingsCopy(settings) {
        //TODO Rename the old option names to the new ones
        settings.oDec     = settings.decimalPlacesOverride;
        settings.oPad     = settings.allowDecimalPadding;
        settings.oBracket = settings.negativeBracketsTypeOnBlur;
        settings.oSep     = settings.digitGroupSeparator;
        settings.oSign    = settings.currencySymbol;
        settings.oSuffix  = settings.suffixText;
    }

    /**
     * original settings saved for use when decimalPlacesShownOnFocus & noSeparatorOnFocus options are being used
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
        if (settings.saveValueToSessionStorage) {
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
            left = stripAllNonNumberCharacters(left, this.settingsClone);
            right = stripAllNonNumberCharacters(right, this.settingsClone);

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
            left = stripAllNonNumberCharacters(left, settingsClone);

            // if right is not empty and first character is not decimalCharacter,
            right = stripAllNonNumberCharacters(right, settingsClone);
            if (settingsClone.trailingNegative && !contains(left, '-')) {
                left = '-' + left;
                settingsClone.trailingNegative = false;
            }
            if ((left === '' || left === settingsClone.negativeSignCharacter) && settingsClone.leadingZero === 'deny') {
                if (right > '') {
                    right = right.replace(/^0*(\d)/, '$1');
                }
            }

            // insert zero if has leading dot
            this.newValue = left + right;
            if (settingsClone.decimalCharacter) {
                const m = this.newValue.match(new RegExp(`^${settingsClone.aNegRegAutoStrip}\\${settingsClone.decimalCharacter}`));
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
                if (testValue === '' || testValue === settingsClone.negativeSignCharacter) {
                    settingsClone.rawValue = '';
                } else {
                    settingsClone.rawValue = testValue;
                }

                if (position > this.newValue.length) {
                    position = this.newValue.length;
                }

                // Make sure when the user enter a '0' on the far left with a leading zero option set to 'deny', that the caret does not moves since the input is dropped (fix issue #283)
                if (position === 1 && parts[0] === '0' && settingsClone.leadingZero === 'deny') {
                    // If the user enter `0`, then the caret is put on the right side of it (Fix issue #299)
                    if (parts[1] === '') {
                        position = 1;
                    } else {
                        position = 0;
                    }
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
            const currencySymbol = settingsClone.currencySymbol;
            const that = this.that;

            if (currencySymbol) {
                const currencySymbolLen = currencySymbol.length;
                if (settingsClone.currencySymbolPlacement === 'p') {
                    const hasNeg = settingsClone.negativeSignCharacter && that.value && that.value.charAt(0) === settingsClone.negativeSignCharacter;
                    return hasNeg ? [1, currencySymbolLen + 1] : [0, currencySymbolLen];
                }
                const valueLen = that.value.length;
                return [valueLen - currencySymbolLen, valueLen];
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
                const modifiedLeftPart = left.substr(0, oldParts[0].length) + stripAllNonNumberCharacters(left.substr(oldParts[0].length), this.settingsClone);
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
                if (this.settings.selectNumberOnly) {
                    // preventDefault is used here to prevent the browser to first select all the input text (including the currency sign), otherwise we would see that whole selection first in a flash, then the selection with only the number part without the currency sign.
                    e.preventDefault();
                    const valueLen = this.that.value.length;
                    const currencySymbolLen = this.settings.currencySymbol.length;
                    const negLen = (!contains(this.that.value, '-'))?0:1;
                    const suffixTextLen = this.settings.suffixText.length;
                    const currencySymbolPlacement = this.settings.currencySymbolPlacement;
                    const negativePositiveSignPlacement = this.settings.negativePositiveSignPlacement;

                    let start;
                    if (currencySymbolPlacement === 's') {
                        start = 0;
                    } else {
                        start = (negativePositiveSignPlacement === 'l' && negLen === 1 && currencySymbolLen > 0)?currencySymbolLen + 1:currencySymbolLen;
                    }

                    let end;
                    if (currencySymbolPlacement === 'p') {
                        end = valueLen - suffixTextLen;
                    } else {
                        switch (negativePositiveSignPlacement) {
                            case 'l':
                                end = valueLen - (suffixTextLen + currencySymbolLen);
                                break;
                            case 'r':
                                end = (currencySymbolLen > 0)?valueLen - (currencySymbolLen + negLen + suffixTextLen):valueLen - (currencySymbolLen + suffixTextLen);
                                break;
                            default :
                                end = valueLen - (currencySymbolLen + suffixTextLen);
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
                const digitGroupSeparator = this.settingsClone.digitGroupSeparator;
                const decimalCharacter = this.settingsClone.decimalCharacter;
                const startJump = this.selection.start;
                const value = this.that.value;
                if (e.type === 'keydown' && !this.shiftKey) {
                    if (kdCode === keyCode.LeftArrow && (value.charAt(startJump - 2) === digitGroupSeparator || value.charAt(startJump - 2) === decimalCharacter)) {
                        this._setPosition(startJump - 1);
                    } else if (kdCode === keyCode.RightArrow && (value.charAt(startJump + 1) === digitGroupSeparator || value.charAt(startJump + 1) === decimalCharacter)) {
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
            if (settingsClone.currencySymbolPlacement === 'p' && settingsClone.negativePositiveSignPlacement === 's') {
                if (this.kdCode === 8) {
                    settingsClone.caretFix = (this.selection.start >= this.value.indexOf(settingsClone.suffixText) && settingsClone.suffixText !== '');
                    if (this.value.charAt(this.selection.start - 1) === '-') {
                        left = left.substring(1);
                    } else if (this.selection.start <= this.value.length - settingsClone.suffixText.length) {
                        left = left.substring(0, left.length - 1);
                    }
                } else {
                    settingsClone.caretFix = (this.selection.start >= this.value.indexOf(settingsClone.suffixText) && settingsClone.suffixText !== '');
                    if (this.selection.start >= this.value.indexOf(settingsClone.currencySymbol) + settingsClone.currencySymbol.length) {
                        right = right.substring(1, right.length);
                    }
                    if (contains(left, '-') && this.value.charAt(this.selection.start) === '-') {
                        left = left.substring(1);
                    }
                }
            }

            if (settingsClone.currencySymbolPlacement === 's' && settingsClone.negativePositiveSignPlacement === 'l') {
                settingsClone.caretFix = (this.selection.start >= this.value.indexOf(settingsClone.negativeSignCharacter) + settingsClone.negativeSignCharacter.length);
                if (this.kdCode === 8) {
                    if (this.selection.start === (this.value.indexOf(settingsClone.negativeSignCharacter) + settingsClone.negativeSignCharacter.length) && contains(this.value, settingsClone.negativeSignCharacter)) {
                        left = left.substring(1);
                    } else if (left !== '-' && ((this.selection.start <= this.value.indexOf(settingsClone.negativeSignCharacter)) || !contains(this.value, settingsClone.negativeSignCharacter))) {
                        left = left.substring(0, left.length - 1);
                    }
                } else {
                    if (left[0] === '-') {
                        right = right.substring(1);
                    }
                    if (this.selection.start === this.value.indexOf(settingsClone.negativeSignCharacter) && contains(this.value, settingsClone.negativeSignCharacter)) {
                        left = left.substring(1);
                    }
                }
            }

            if (settingsClone.currencySymbolPlacement === 's' && settingsClone.negativePositiveSignPlacement === 'r') {
                settingsClone.caretFix = (this.selection.start >= this.value.indexOf(settingsClone.negativeSignCharacter) + settingsClone.negativeSignCharacter.length);
                if (this.kdCode === 8) {
                    if (this.selection.start === (this.value.indexOf(settingsClone.negativeSignCharacter) + settingsClone.negativeSignCharacter.length)) {
                        left = left.substring(1);
                    } else if (left !== '-' && this.selection.start <= (this.value.indexOf(settingsClone.negativeSignCharacter) - settingsClone.currencySymbol.length)) {
                        left = left.substring(0, left.length - 1);
                    } else if (left !== '' && !contains(this.value, settingsClone.negativeSignCharacter)) {
                        left = left.substring(0, left.length - 1);
                    }
                } else {
                    settingsClone.caretFix = (this.selection.start >= this.value.indexOf(settingsClone.currencySymbol) && settingsClone.currencySymbol !== '');
                    if (this.selection.start === this.value.indexOf(settingsClone.negativeSignCharacter)) {
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

                if (((settingsClone.currencySymbolPlacement === 'p' && settingsClone.negativePositiveSignPlacement === 's') ||
                     (settingsClone.currencySymbolPlacement === 's' && (settingsClone.negativePositiveSignPlacement === 'l' || settingsClone.negativePositiveSignPlacement === 'r'))) &&
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
            if (cCode === settingsClone.decimalCharacter ||
                (settingsClone.decimalCharacterAlternative && cCode === settingsClone.decimalCharacterAlternative) ||
                ((cCode === '.' || cCode === ',') && this.kdCode === keyCode.DotNumpad)) {
                if (!settingsClone.decimalPlacesOverride || !settingsClone.decimalCharacter) {
                    return true;
                }

                // Do not allow decimal character before negativeSignCharacter character
                if (settingsClone.negativeSignCharacter && contains(right, settingsClone.negativeSignCharacter)) {
                    return true;
                }

                // Do not allow decimal character if other decimal character present
                if (contains(left, settingsClone.decimalCharacter)) {
                    return true;
                }

                if (right.indexOf(settingsClone.decimalCharacter) > 0) {
                    return true;
                }

                if (right.indexOf(settingsClone.decimalCharacter) === 0) {
                    right = right.substr(1);
                }

                this._setValueParts(left + settingsClone.decimalCharacter, right, null);

                return true;
            }

            // Prevent minus if not allowed
            if ((cCode === '-' || cCode === '+') && settingsClone.negativeSignCharacter === '-') {
                if (!settingsClone) {
                    return true;
                }

                // Caret is always after minus
                if ((settingsClone.currencySymbolPlacement === 'p' && settingsClone.negativePositiveSignPlacement === 's') || (settingsClone.currencySymbolPlacement === 's' && settingsClone.negativePositiveSignPlacement !== 'p')) {
                    if (left === '' && contains(right, settingsClone.negativeSignCharacter)) {
                        left = settingsClone.negativeSignCharacter;
                        right = right.substring(1, right.length);
                    }

                    // Change number sign, remove part if should
                    if (left.charAt(0) === '-' || contains(left, settingsClone.negativeSignCharacter)) {
                        left = left.substring(1, left.length);
                    } else {
                        left = (cCode === '-') ? settingsClone.negativeSignCharacter + left : left;
                    }
                } else {
                    if (left === '' && contains(right, settingsClone.negativeSignCharacter)) {
                        left = settingsClone.negativeSignCharacter;
                        right = right.substring(1, right.length);
                    }

                    // Change number sign, remove part if should
                    if (left.charAt(0) === settingsClone.negativeSignCharacter) {
                        left = left.substring(1, left.length);
                    } else {
                        left = (cCode === '-') ? settingsClone.negativeSignCharacter + left : left;
                    }
                }

                this._setValueParts(left, right, null);

                return true;
            }

            // If try to insert digit before minus
            if (cCode >= '0' && cCode <= '9') {
                if (settingsClone.negativeSignCharacter && left === '' && contains(right, settingsClone.negativeSignCharacter)) {
                    left = settingsClone.negativeSignCharacter;
                    right = right.substring(1, right.length);
                }

                if (settingsClone.maximumValue <= 0 && settingsClone.minimumValue < settingsClone.maximumValue && !contains(this.value, settingsClone.negativeSignCharacter) && cCode !== '0') {
                    left = settingsClone.negativeSignCharacter + left;
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
            const eventKeyCode = e.keyCode;
            let [left] = this._getBeforeAfterStripped();

            // No grouping separator and no currency sign
            if ((settingsClone.digitGroupSeparator  === '' || (settingsClone.digitGroupSeparator !== ''  && !contains(leftLength, settingsClone.digitGroupSeparator))) &&
                (settingsClone.currencySymbol === '' || (settingsClone.currencySymbol !== '' && !contains(leftLength, settingsClone.currencySymbol)))) {
                let [subParts] = leftLength.split(settingsClone.decimalCharacter);
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
                if ((settingsClone.negativePositiveSignPlacement === 's' || (settingsClone.currencySymbolPlacement === 's' && settingsClone.negativePositiveSignPlacement !== 'p')) &&
                    leftAr[0] === '-' && settingsClone.negativeSignCharacter !== '') {
                    leftAr.shift();

                    if ((eventKeyCode === keyCode.Backspace || this.kdCode === keyCode.Backspace ||
                        eventKeyCode === keyCode.Delete || this.kdCode === keyCode.Delete) &&
                        settingsClone.caretFix) {
                        if (settingsClone.currencySymbolPlacement === 's' && settingsClone.negativePositiveSignPlacement === 'l') {
                            leftAr.push('-');
                            settingsClone.caretFix = e.type === 'keydown';
                        }

                        if (settingsClone.currencySymbolPlacement === 'p' && settingsClone.negativePositiveSignPlacement === 's') {
                            leftAr.push('-');
                            settingsClone.caretFix = e.type === 'keydown';
                        }

                        if (settingsClone.currencySymbolPlacement === 's' && settingsClone.negativePositiveSignPlacement === 'r') {
                            const signParts = settingsClone.currencySymbol.split('');
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

                            if (eventKeyCode === keyCode.Backspace || this.kdCode === keyCode.Backspace) {
                                escapedParts.push('-');
                            }

                            // Pushing the escaped sign
                            leftAr.push(escapedParts.join(''));
                            settingsClone.caretFix = e.type === 'keydown';
                        }
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
                    if (((position === 0 && value.charAt(0) !== settingsClone.negativeSignCharacter) || (position === 1 && value.charAt(0) === settingsClone.negativeSignCharacter)) && settingsClone.currencySymbol && settingsClone.currencySymbolPlacement === 'p') {
                        // Place caret after prefix sign
                        position = this.settingsClone.currencySymbol.length + (value.charAt(0) === '-' ? 1 : 0);
                    }
                } else {
                    if (settingsClone.currencySymbol && settingsClone.currencySymbolPlacement === 's') {
                        // If we could not find a place for cursor and have a sign as a suffix
                        // Place caret before suffix currency sign
                        position -= settingsClone.currencySymbol.length;
                    }

                    if (settingsClone.suffixText) {
                        // If we could not find a place for cursor and have a suffix
                        // Place caret before suffix
                        position -= settingsClone.suffixText.length;
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
     * Locale formats are supported "1234.56-" or "1234,56" or "-1234,56 or "1234,56-", or even plain numbers => please see option "outputFormat" for more details
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
     * @param {Event} e
     * @returns {*}
     */
    function onFocusInAndMouseEnter($this, holder, e) {
        const settings = holder.settingsClone;

        if (e.type === 'focusin' || e.type === 'mouseenter' && !$this.is(':focus') && settings.emptyInputBehavior === 'focus') {
            settings.onOff = true;
            //TODO Fix issue #303 : if (e.type === 'focusin' && no mouse click && fromTabKey) { setElementSelection(e.target, 0); }

            if (settings.negativeBracketsTypeOnBlur !== null && settings.negativeSignCharacter !== '') {
                $this.val(negativeBracket(e.target.value, settings));
            }

            let result;
            if (settings.decimalPlacesShownOnFocus) {
                settings.decimalPlacesOverride = settings.decimalPlacesShownOnFocus;
                $this.autoNumeric('set', settings.rawValue);
            } else if (settings.scaleDivisor) {
                settings.decimalPlacesOverride = settings.oDec;
                $this.autoNumeric('set', settings.rawValue);
            } else if (settings.noSeparatorOnFocus) {
                settings.digitGroupSeparator = '';
                settings.currencySymbol = '';
                settings.suffixText = '';
                $this.autoNumeric('set', settings.rawValue);
            } else if ((result = stripAllNonNumberCharacters(e.target.value, settings)) !== settings.rawValue) {
                $this.autoNumeric('set', result);
            }

            // In order to send a 'native' change event when blurring the input, we need to first store the initial input value on focus.
            holder.valueOnFocus = e.target.value;
            holder.lastVal = holder.valueOnFocus;
            const onEmpty = checkEmpty(holder.valueOnFocus, settings, true);
            if ((onEmpty !== null && onEmpty !== '') && settings.emptyInputBehavior === 'focus') {
                $this.val(onEmpty);
            }
        }
    }

    /**
     * Handler for 'keydown' events.
     * The user just started pushing any key, hence one event is sent.
     *
     * Note :
     * By default a 'normal' input output those events in the right order when inputting a character key (ie. 'a') :
     * - keydown
     * - keypress
     * - input
     * - keyup
     *
     * ...when inputting a modifier key (ie. 'ctrl') :
     * - keydown
     * - keyup
     *
     * If 'delete' or 'backspace' is entered, the following events are sent :
     * - keydown
     * - input
     * - keyup
     *
     * If 'enter' is entered and the value has not changed, the following events are sent :
     * - keydown
     * - keypress
     * - keyup
     *
     * If 'enter' is entered and the value has been changed, the following events are sent :
     * - keydown
     * - keypress
     * - change
     * - keyup
     *
     * When a paste is done, the following events are sent :
     * - input (if paste is done with the mouse)
     *
     * - keydown (if paste is done with ctrl+v)
     * - keydown
     * - input
     * - keyup
     * - keyup
     *
     * @param {AutoNumericHolder} holder
     * @param {Event} e
     * @returns {*}
     */
    function onKeydown(holder, e) {
        //TODO Create a function that retrieve the element value (either by using `e.target.value` when the element is an <input>, or by using `element.textContent` when the element as its `contenteditable` set to true)
        const currentKeyCode = key(e); // The key being used

        if (holder.that.readOnly) {
            holder.processed = true;

            return;
        }

        // The "enter" key throws a `change` event if the value has changed since the `focus` event
        if (e.keyCode === keyCode.Enter && holder.valueOnFocus !== e.target.value) {
            triggerEvent('change', e.target);
            holder.valueOnFocus = e.target.value;
        }

        holder._updateFieldProperties(e); //FIXME This is called 2 to 3 times
        holder.processed = false;
        holder.formatted = false;

        if (holder._skipAlways(e)) {
            holder.processed = true;

            return;
        }

        // Check if the key is a delete/backspace key
        if (currentKeyCode === keyCode.Backspace || currentKeyCode === keyCode.Delete) {
            holder._processCharacterDeletion(); // Because backspace and delete only triggers keydown and keyup events, not keypress
            holder.processed = true;
            holder._formatQuick(e);

            // If and only if the resulting value has changed after that backspace/delete, then we have to send an 'input' event like browsers normally do.
            if ((e.target.value !== holder.lastVal) && holder.settingsClone.throwInput) {
                // Throw an input event when a character deletion is detected
                triggerEvent('input', e.target);
                e.preventDefault(); // ...and immediately prevent the browser to delete a second character
            }

            holder.lastVal = e.target.value;
            holder.settingsClone.throwInput = true;

            return;
        }

        holder.formatted = false; //TODO Is this line needed?
    }

    /**
     * Handler for 'keypress' events.
     * The user is still pressing the key, which will output a character (ie. '2') continuously until it releases the key.
     * Note: 'keypress' events are not sent for delete keys like Backspace/Delete.
     *
     * @param {AutoNumericHolder} holder
     * @param {Event} e
     * @returns {*}
     */
    function onKeypress(holder, e) {
        const currentKeyCode = key(e); // The key being used

        // Firefox fix for Shift && insert paste event
        if (e.shiftKey && currentKeyCode === keyCode.Insert) {
            return;
        }

        const processed = holder.processed;
        holder._updateFieldProperties(e); //FIXME This is called 2 to 3 times
        holder.processed = false;
        holder.formatted = false;

        if (holder._skipAlways(e)) {
            return;
        }

        if (processed) {
            e.preventDefault();

            return;
        }

        //FIXME `_processCharacterInsertion()` always returns TRUE, which means `holder.formatted = false;` at the end is NEVER called.
        if (holder._processCharacterInsertion()) {
            holder._formatQuick(e);
            if ((e.target.value !== holder.lastVal) && holder.settingsClone.throwInput) {
                // Throws input event on adding a character
                triggerEvent('input', e.target);
                e.preventDefault(); // ...and immediately prevent the browser to add a second character
            }
            else {
                // If the value has not changed, we do not allow the input event to be sent
                e.preventDefault();
            }

            holder.lastVal = e.target.value;
            holder.settingsClone.throwInput = true;

            return;
        }

        holder.formatted = false;
    }

    /**
     * Handler for 'keyup' events.
     * The user just released any key, hence one event is sent.
     *
     * @param {AutoNumericHolder} holder
     * @param {object} settings
     * @param {Event} e
     * @returns {*}
     */
    function onKeyup(holder, settings, e) {
        const currentKeyCode = key(e); // The key being used

        holder._updateFieldProperties(e); //FIXME This is called 2 to 3 times
        holder.processed = false;
        holder.formatted = false;

        const skip = holder._skipAlways(e);
        delete holder.valuePartsBeforePaste;
        if (skip || e.target.value === '') {
            return;
        }

        // Added to properly place the caret when only the currency sign is present
        if (e.target.value === holder.settingsClone.currencySymbol) {
            if (holder.settingsClone.currencySymbolPlacement === 's') {
                setElementSelection(e.target, 0, 0);
            } else {
                setElementSelection(e.target, holder.settingsClone.currencySymbol.length, holder.settingsClone.currencySymbol.length);
            }
        } else if (currentKeyCode === keyCode.Tab) {
            setElementSelection(e.target, 0, e.target.value.length);
        }

        if ((e.target.value === holder.settingsClone.suffixText) ||
            (holder.settingsClone.rawValue === '' && holder.settingsClone.currencySymbol !== '' && holder.settingsClone.suffixText !== '')) {
            setElementSelection(e.target, 0, 0);
        }

        // Saves the extended decimal to preserve the data when navigating away from the page
        if (holder.settingsClone.decimalPlacesShownOnFocus !== null && holder.settingsClone.saveValueToSessionStorage) {
            autoSave(e.target, settings, 'set');
        }

        if (!holder.formatted) {
            holder._formatQuick(e);
        }
    }

    /**
     * Handler for 'focusout' events
     *
     * @param $this
     * @param {AutoNumericHolder} holder
     * @param {Event} e
     * @returns {*}
     */
    function onFocusOutAndMouseLeave($this, holder, e) {
        if (!$this.is(':focus')) {
            let value = e.target.value;
            const origValue = value;
            const settings = holder.settingsClone;
            settings.onOff = false;

            if (settings.saveValueToSessionStorage) {
                autoSave(e.target, settings, 'set');
            }

            if (settings.noSeparatorOnFocus === true) {
                settings.digitGroupSeparator = settings.oSep;
                settings.currencySymbol = settings.oSign;
                settings.suffixText = settings.oSuffix;
            }

            if (settings.decimalPlacesShownOnFocus !== null) {
                settings.decimalPlacesOverride = settings.oDec;
                settings.allowDecimalPadding = settings.oPad;
                settings.negativeBracketsTypeOnBlur = settings.oBracket;
            }

            value = stripAllNonNumberCharacters(value, settings);
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

                    settings.decimalPlacesOverride = (settings.scaleDivisor && settings.scaleDecimalPlaces) ? +settings.scaleDecimalPlaces : settings.decimalPlacesOverride;
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
                if (settings.emptyInputBehavior === 'zero') {
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

            if (groupedValue !== holder.valueOnFocus) {
                $this.change();
                delete holder.valueOnFocus;
            }
        }
    }

    /**
     * Handler for 'paste' events
     *
     * @param $this
     * @param {AutoNumericHolder} holder
     * @param {Event} e
     * @returns {*}
     */
    function onPaste($this, holder, e) {
        //TODO Using ctrl+z after a paste should cancel it -> How would that affect other frameworks/component built with that feature in mind though?
        //FIXME When pasting '000' on a thousand group selection, the whole selection gets deleted, and only one '0' is pasted (cf. issue #302)
        // The event is prevented by default, since otherwise the user would be able to paste invalid characters into the input
        e.preventDefault();

        let rawPastedText = e.clipboardData.getData('text/plain');

        // 0. Special case if the user has selected all the input text before pasting
        const initialFormattedValue = e.target.value;
        const selectionStart = e.target.selectionStart || 0;
        const selectionEnd = e.target.selectionEnd || 0;
        const selectionSize = selectionEnd - selectionStart;
        let isAllInputTextSelected = false;

        if (selectionSize === initialFormattedValue.length) {
            isAllInputTextSelected = true;
        }

        // 1. Check if the paste has a negative sign (only if it's the first character), and store that information for later use
        const isPasteNegative = isNegative(rawPastedText);
        if (isPasteNegative) {
            // 1a. Remove the negative sign from the pasted text
            rawPastedText = rawPastedText.slice(1, rawPastedText.length);
        }
        const rawPastedTextSize = rawPastedText.length; // This use the 'cleaned' paste text

        // 2. Strip all thousand separators, brackets and currency sign, and convert the decimal character to a dot
        const pastedText = preparePastedText(rawPastedText, holder);

        // 3. Test if the paste is valid (only has numbers and eventually a decimal character). If it's not valid, stop here.
        if (!isNumber(pastedText) || pastedText === '') {
            if (holder.settings.onInvalidPaste === 'error') {
                //TODO Should we send a warning instead of throwing an error?
                throwError(`The pasted value '${rawPastedText}' is not a valid paste content.`);
            }

            return;
        }

        // 4. Calculate the paste result
        let caretPositionOnInitialTextAfterPasting;
        let initialUnformattedNumber = $this.autoNumeric('get');
        let isInitialValueNegative = isNegative(initialUnformattedNumber);
        let isPasteNegativeAndInitialValueIsPositive;
        let result;

        // If the pasted content is negative, then the result will be negative too
        if (isPasteNegative && !isInitialValueNegative) {
            initialUnformattedNumber = `-${initialUnformattedNumber}`;
            isInitialValueNegative = true;
            isPasteNegativeAndInitialValueIsPositive = true;
        }
        else {
            isPasteNegativeAndInitialValueIsPositive = false;
        }

        switch (holder.settings.onInvalidPaste) {
            /* 4a. Truncate paste behavior:
             * Insert as many numbers as possible on the right hand side of the caret from the pasted text content, until the input reach its range limit.
             * If there is more characters in the clipboard once a limit is reached, drop the extraneous characters.
             * Otherwise paste all the numbers in the clipboard.
             * While doing so, we check if the result is within the minimum and maximum values allowed, and stop as soon as we encounter one of those.
             *
             * 4b. Replace paste behavior:
             * Idem than the 'truncate' paste behavior, except that when a range limit is hit, we try to replace the subsequent initial numbers with the pasted ones, until we hit the range limit a second (and last) time, or we run out of numbers to paste
             */
            /* eslint no-case-declarations: 0 */
            case 'truncate':
            case 'replace':
                const leftFormattedPart = initialFormattedValue.slice(0, selectionStart);
                const rightFormattedPart = initialFormattedValue.slice(selectionEnd, initialFormattedValue.length);

                if (selectionStart !== selectionEnd) {
                    // a. If there is a selection, remove the selected part, and return the left and right part
                    result = preparePastedText(leftFormattedPart + rightFormattedPart, holder);
                } else {
                    // b. Else if this is only one caret (and therefore no selection), then return the left and right part
                    result = preparePastedText(initialFormattedValue, holder);
                }

                // Add back the negative sign if needed
                if (isInitialValueNegative) {
                    result = setRawNegativeSign(result);
                }

                // Build the unformatted result string
                caretPositionOnInitialTextAfterPasting = convertCharacterCountToIndexPosition(countNumberCharactersOnTheCaretLeftSide(initialFormattedValue, selectionStart, holder.settings.decimalCharacter));
                if (isPasteNegativeAndInitialValueIsPositive) {
                    // If the initial paste is negative and the initial value is not, then I must offset the caret position by one place to the right to take the additional hyphen into account
                    caretPositionOnInitialTextAfterPasting++;
                    //TODO Quid if the negative sign is not on the left (negativePositiveSignPlacement and currencySymbolPlacement)?
                }

                const leftPart = result.slice(0, caretPositionOnInitialTextAfterPasting);
                const rightPart = result.slice(caretPositionOnInitialTextAfterPasting, result.length);
                // -- Here, we are good to go to continue on the same basis

                // c. Add numbers one by one at the caret position, while testing if the result is valid and within the range of the minimum and maximum value
                //    Continue until you either run out of numbers to paste, or that you get out of the range limits
                const minParse = parseStr(holder.settings.minimumValue);
                const maxParse = parseStr(holder.settings.maximumValue);
                let lastGoodKnownResult = result; // This is set as the default, in case we do not add even one number
                let pastedTextIndex = 0;
                let modifiedLeftPart = leftPart;

                while (pastedTextIndex < pastedText.length) {
                    // Modify the result with another pasted character
                    modifiedLeftPart += pastedText[pastedTextIndex];
                    result = modifiedLeftPart + rightPart;

                    // Check the range limits
                    if (!checkIfInRange(result, minParse, maxParse)) {
                        // The result is out of the range limits, stop the loop here
                        break;
                    }

                    // Save the last good known result
                    lastGoodKnownResult = result;

                    // Update the local variables for the next loop
                    pastedTextIndex++;
                }

                // Update the last caret position where to insert a new number
                caretPositionOnInitialTextAfterPasting += pastedTextIndex;

                //XXX Here we have the result for the `truncate` option
                if (holder.settings.onInvalidPaste === 'truncate') {
                    result = lastGoodKnownResult;
                    break;
                }
                //XXX ...else we need to continue modifying the result for the 'replace' option

                // d. Until there are numbers to paste, replace the initial numbers one by one, and still do the range test.
                //    Stop when you have no more numbers to paste, or if you are out of the range limits.
                //    If you do get to the range limits, use the previous known good value within those limits.
                //    Note: The numbers are replaced one by one, in the integer then decimal part, while ignoring the decimal character
                //TODO What should happen if the user try to paste a decimal number? Should we override the current initial decimal character in favor of this new one? If we do, then we have to recalculate the vMin/vMax from the start in order to take into account this new decimal character position..
                let lastGoodKnownResultIndex = caretPositionOnInitialTextAfterPasting;
                const lastGoodKnownResultSize = lastGoodKnownResult.length;

                while (pastedTextIndex < pastedText.length && lastGoodKnownResultIndex < lastGoodKnownResultSize) {
                    if (lastGoodKnownResult[lastGoodKnownResultIndex] === '.') {
                        // We skip the decimal character 'replacement'. That way, we do not change the decimal character position regarding the remaining numbers.
                        lastGoodKnownResultIndex++;
                        continue;
                    }

                    // This replace one character at a time
                    result = replaceCharAt(lastGoodKnownResult, lastGoodKnownResultIndex, pastedText[pastedTextIndex]);

                    // Check the range limits
                    if (!checkIfInRange(result, minParse, maxParse)) {
                        // The result is out of the range limits, stop the loop here
                        break;
                    }

                    // Save the last good known result
                    lastGoodKnownResult = result;

                    // Update the local variables for the next loop
                    pastedTextIndex++;
                    lastGoodKnownResultIndex++;
                }

                // Update the last caret position where to insert a new number
                caretPositionOnInitialTextAfterPasting = lastGoodKnownResultIndex;

                result = lastGoodKnownResult;

                break;
            /* 4c. Normal paste behavior:
             * Insert the pasted number inside the current unformatted text, at the right caret position or selection
             */
            case 'error':
            case 'ignore':
            case 'clamp':
            default:
                // Test if there is a selection in the input
                if (selectionStart === selectionEnd) {
                    // There is no selection, and this is the caret position : Insert the paste into the element.value at that caret position
                    let indexWhereToInsertThePastedText = convertCharacterCountToIndexPosition(countNumberCharactersOnTheCaretLeftSide(initialFormattedValue, selectionStart, holder.settings.decimalCharacter));
                    if (isPasteNegativeAndInitialValueIsPositive) {
                        // If the pasted value has a '-' sign, but the initial value does not, offset the index by one
                        indexWhereToInsertThePastedText++;
                    }

                    result = insertCharAtPosition(initialUnformattedNumber, pastedText, indexWhereToInsertThePastedText);

                    caretPositionOnInitialTextAfterPasting = indexWhereToInsertThePastedText + rawPastedTextSize - countDotsInText(rawPastedText); // I must not count the characters that have been removed from the pasted text (ie. '.')
                } else {
                    // There is a selection : replace the selection with the paste content
                    const firstPart = e.target.value.slice(0, selectionStart);
                    const lastPart = e.target.value.slice(selectionEnd, e.target.value.length);
                    result = firstPart + pastedText + lastPart;

                    // Finally, remove any unwanted non-number characters
                    if (firstPart !== '' || lastPart !== '') {
                        // If the whole input has been selected prior to pasting, then firstPart and lastPart are empty, hence we only use the pastedText variable, otherwise we remove the potential decimal character in the result variable
                        result = preparePastedText(result, holder);
                    }

                    // Add back the negative sign if needed
                    if (isInitialValueNegative) {
                        result = setRawNegativeSign(result);
                    }

                    if (isAllInputTextSelected) {
                        // Special case when all the input text is selected before pasting, which means we'll completely erase its content and paste only the clipboard content
                        caretPositionOnInitialTextAfterPasting = result.length;
                    } else {
                        // Normal case
                        let indexSelectionEndInRawValue = convertCharacterCountToIndexPosition(countNumberCharactersOnTheCaretLeftSide(initialFormattedValue, selectionEnd, holder.settings.decimalCharacter));

                        if (isPasteNegativeAndInitialValueIsPositive) {
                            // If the pasted value has a '-' sign, but the initial value does not, offset the index by one
                            indexSelectionEndInRawValue++;
                        }

                        // Here I must not count the characters that have been removed from the pasted text (ie. '.'), or the thousand separators in the initial selected text
                        const selectedText = e.target.value.slice(selectionStart, selectionEnd);
                        caretPositionOnInitialTextAfterPasting = indexSelectionEndInRawValue - selectionSize + countCharInText(holder.settings.digitGroupSeparator, selectedText) + rawPastedTextSize - countDotsInText(rawPastedText);
                    }
                }
        }

        // 5. Check if the result is a valid number, if not, drop the paste and do nothing.
        if (!isNumber(result) || result === '') {
            if (holder.settings.onInvalidPaste === 'error') {
                throwError(`The pasted value '${rawPastedText}' would result into an invalid content '${result}'.`); //TODO Should we send a warning instead of throwing an error?
                //TODO This is not DRY ; refactor with above
            }
            return;
        }

        // 6. If it's a valid number, check if it falls inside the minimum and maximum value. If this fails, modify the value following this procedure :
        /*
         * If 'error' (this is the default) :
         *      - Normal paste behavior.
         *      - Try to set the new value, if it fails, then throw an error in the console.
         *      - Do not change the input value, do not change the current selection.
         * If 'ignore' :
         *      - Normal paste behavior.
         *      - Try to set the new value, if it fails, do nothing more.
         *      - Do not change the input value, do not change the current selection.
         * If 'clamp' :
         *      - Normal paste behavior.
         *      - Try to set the new value, if it fails, set the value to the minimum or maximum limit, whichever is closest to the
         *        paste result.
         *      - Change the caret position to be positioned on the left hand side of the decimal character.
         * If 'truncate' :
         *      - Truncate paste behavior.
         *      - Try to set the new value, until it fails (if the result is out of the min and max value limits).
         *      - Drop the remaining non-pasted numbers, and keep the last known non-failing result.
         *      - Change the caret position to be positioned after the last pasted character.
         * If 'replace' :
         *      - Replace paste behavior.
         *      - Try to set the new value, until it fails (if the result is out of the min and max value limits).
          *     - Then try to replace as many numbers as possible with the pasted ones. Once it fails, keep the last known non-failing result.
         *      - Change the caret position to be positioned after the last pasted character.
         */
        let valueHasBeenSet = false;
        let valueHasBeenClamped = false;
        try {
            $this.autoNumeric('set', result);
            valueHasBeenSet = true;
        }
        catch (error) {
            let clampedValue;
            switch (holder.settings.onInvalidPaste) {
                case 'clamp':
                    clampedValue = clampToRangeLimits(result, holder.settings);
                    try {
                        $this.autoNumeric('set', clampedValue);
                    }
                    catch (error) {
                        throwError(`Fatal error: Unable to set the clamped value '${clampedValue}'.`);
                    }

                    valueHasBeenClamped = true;
                    valueHasBeenSet = true;
                    result = clampedValue; // This is used only for setting the caret position later
                    break;
                case 'error':
                case 'truncate':
                case 'replace':
                    // Throw an error message
                    throwError(`The pasted value '${rawPastedText}' results in a value '${result}' that is outside of the minimum [${holder.settings.minimumValue}] and maximum [${holder.settings.maximumValue}] value range.`);
                    // falls through
                case 'ignore':
                    // Do nothing
                    // falls through
                default :
                    return; // ...and nothing else should be changed
            }
        }

        // 7. Then lastly, set the caret position at the right logical place
        let caretPositionInFormattedNumber;
        if (valueHasBeenSet) {
            switch (holder.settings.onInvalidPaste) {
                case 'clamp':
                    if (valueHasBeenClamped) {
                        if (holder.settings.currencySymbolPlacement === 's') {
                            setElementSelection(e.target, e.target.value.length - holder.settings.currencySymbol.length); // This puts the caret on the right of the last decimal place
                        } else {
                            setElementSelection(e.target, e.target.value.length); // ..and this on the far right
                        }

                        break;
                    } // else if the value has not been clamped, the default behavior is used...
                    // falls through
                case 'error':
                case 'ignore':
                case 'truncate':
                case 'replace':
                default :
                    // Whenever one or multiple characters are pasted, this means we have to manage the potential thousand separators that could be added by the formatting
                    caretPositionInFormattedNumber = findCaretPositionInFormattedNumber(result, caretPositionOnInitialTextAfterPasting, e.target.value, holder.settings.decimalCharacter);
                    setElementSelection(e.target, caretPositionInFormattedNumber);
            }
        }

        // 8. We make sure we send an input event only if the result is different than the initial value before the paste
        if (valueHasBeenSet && initialFormattedValue !== e.target.value) {
            // On a 'normal' non-autoNumeric input, an `input` event is sent when a paste is done. We mimic that.
            triggerEvent('input', e.target);
        }
    }

    /**
     * When focusing out of the input, we check if the value has changed, and if it has, then we send a `change` event (since the native one would have been prevented by `e.preventDefault()` called in the other event listeners).
     *
     * @param {AutoNumericHolder} holder
     * @param {Event} e
     */
    function onBlur(holder, e) {
        if (e.target.value !== holder.valueOnFocus) {
            triggerEvent('change', e.target);
            // e.preventDefault(); // ...and immediately prevent the browser to send a second change event (that somehow gets picked up by jQuery, but not by `addEventListener()` //FIXME KNOWN BUG : This does not prevent the second change event to be picked up by jQuery
        }
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
            if (holder) {
                const $settings = holder.settingsClone;

                if ($settings.unformatOnSubmit) {
                    $this.val($settings.rawValue);
                }
            }
        });
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
             * developer wants it formatted on init (cf. `settings.formatOnPageLoad`)).
             * Note; this is true whatever the developer has set for `data-an-default` in the html (asp.net users).
             *
             * In other words : if `defaultValueOverride` is not null, it means the developer is trying to prevent postback problems.
             * But if `input.value` is set to a number, and `$this.attr('value')` is not set, then it means the dev has
             * changed the input value, and then it means we should not overwrite his own decision to do so.
             * Hence, if `defaultValueOverride` is not null, but `input.value` is a number and `$this.attr('value')` is not set,
             * we should ignore `defaultValueOverride` altogether.
             */
            if (settings.formatOnPageLoad && currentValue !== '' && isUndefinedOrNullOrEmpty($this.attr('value'))) {
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
                if ((settings.defaultValueOverride !== null && settings.defaultValueOverride.toString() !== currentValue) ||
                    (settings.defaultValueOverride === null && currentValue !== '' && currentValue !== $this.attr('value')) ||
                    (currentValue !== '' && $this.attr('type') === 'hidden' && !$.isNumeric(currentValue.replace(',', '.')))) {
                    if ((settings.decimalPlacesShownOnFocus !== null && settings.saveValueToSessionStorage) ||
                        (settings.scaleDivisor && settings.saveValueToSessionStorage)) {
                        settings.rawValue = autoSave($this[0], settings, 'get');
                    }

                    // If the decimalPlacesShownOnFocus value should NOT be saved in sessionStorage
                    if (!settings.saveValueToSessionStorage) {
                        let toStrip;

                        if (settings.negativeBracketsTypeOnBlur !== null && settings.negativeSignCharacter !== '') {
                            settings.onOff = true;
                            toStrip = negativeBracket(currentValue, settings);
                        } else {
                            toStrip = currentValue;
                        }

                        settings.rawValue = ((settings.negativePositiveSignPlacement === 's' || (settings.currencySymbolPlacement === 's' && settings.negativePositiveSignPlacement !== 'p')) && settings.negativeSignCharacter !== '' && contains(currentValue, '-'))?'-' + stripAllNonNumberCharacters(toStrip, settings):stripAllNonNumberCharacters(toStrip, settings);
                    }

                    setValue = false;
                }
            }

            if (currentValue === '') {
                switch (settings.emptyInputBehavior) {
                    case 'focus':
                        setValue = false;
                        break;
                    case 'always':
                        $this.val(settings.currencySymbol);
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
            if (settings.defaultValueOverride !== null) {
                if (settings.defaultValueOverride === $this.text()) {
                    $this.autoNumeric('set', $this.text());
                }
            } else {
                $this.autoNumeric('set', $this.text());
            }
        }
    }

    /**
     * Enhance the user experience by modifying the default `negativePositiveSignPlacement` option depending on `currencySymbol` and `currencySymbolPlacement`.
     *
     * If the user has not set the placement of the negative sign (`negativePositiveSignPlacement`), but has set a currency symbol (`currencySymbol`),
     * then we modify the default value of `negativePositiveSignPlacement` in order to keep the resulting output logical by default :
     * - "$-1,234.56" instead of "-$1,234.56" ({currencySymbol: "$", negativePositiveSignPlacement: "r"})
     * - "-1,234.56$" instead of "1,234.56-$" ({currencySymbol: "$", currencySymbolPlacement: "s", negativePositiveSignPlacement: "p"})
     *
     * @param {object} options
     * @param {object} settings
     */
    function correctPNegOption(options, settings) {
        //TODO Merge the options and settings parameter to use only `settings`
        if (!isUndefined(options) && isUndefinedOrNullOrEmpty(options.negativePositiveSignPlacement) && options.currencySymbol !== '') {
            switch (settings.currencySymbolPlacement) {
                case 's':
                    settings.negativePositiveSignPlacement = 'p';
                    break;
                case 'p':
                    settings.negativePositiveSignPlacement = 'r';
                    break;
                default :
                //
            }
        }
    }

    /**
     * Analyze and save the minimumValue and maximumValue integer size for later uses
     *
     * @param {object} settings
     * @returns {{maximumValue: Array, minimumValue: Array}}
     */
    function calculateVMinAndVMaxIntegerSizes(settings) {
        let [maximumValueIntegerPart] = settings.maximumValue.toString().split('.');
        let [minimumValueIntegerPart] = (!settings.minimumValue && settings.minimumValue !== 0)?[]:settings.minimumValue.toString().split('.');
        maximumValueIntegerPart = maximumValueIntegerPart.replace('-', '');
        minimumValueIntegerPart = minimumValueIntegerPart.replace('-', '');

        settings.mIntPos = Math.max(maximumValueIntegerPart.length, 1);
        settings.mIntNeg = Math.max(minimumValueIntegerPart.length, 1);
    }

    /**
     * Modify `decimalPlacesOverride` as needed
     *
     * @param {object} settings
     */
    function correctMDecOption(settings) {
        if (!isNull(settings.scaleDivisor) && !isNull(settings.scaleDecimalPlaces)) {
            // Override the maximum number of decimal places with the one defined with the number of decimals to show when not in focus, if set
            settings.decimalPlacesOverride = settings.scaleDecimalPlaces;
        }
        else if (isNull(settings.decimalPlacesOverride)) {
            settings.decimalPlacesOverride = maximumVMinAndVMaxDecimalLength(settings.minimumValue, settings.maximumValue);
        }
        settings.oDec = String(settings.decimalPlacesOverride);

        // Most calculus assume `decimalPlacesOverride` is an integer, the following statement makes it clear (otherwise having it as a string leads to problems in rounding for instance)
        settings.decimalPlacesOverride = Number(settings.decimalPlacesOverride);
    }

    /**
     * Sets the alternative decimal separator key.
     *
     * @param {object} settings
     */
    function setsAlternativeDecimalSeparatorCharacter(settings) {
        if (isNull(settings.decimalCharacterAlternative) && Number(settings.decimalPlacesOverride) > 0) {
            if (settings.decimalCharacter === '.' && settings.digitGroupSeparator !== ',') {
                settings.decimalCharacterAlternative = ',';
            } else if (settings.decimalCharacter === ',' && settings.digitGroupSeparator !== '.') {
                settings.decimalCharacterAlternative = '.';
            }
        }
    }

    /**
     * Caches regular expressions for stripAllNonNumberCharacters
     *
     * @param {object} settings
     */
    function cachesUsualRegularExpressions(settings) {
        const aNegReg = settings.negativeSignCharacter?`([-\\${settings.negativeSignCharacter}]?)`:'(-?)';
        settings.aNegRegAutoStrip = aNegReg;
        settings.skipFirstAutoStrip = new RegExp(`${aNegReg}[^-${(settings.negativeSignCharacter?`\\${settings.negativeSignCharacter}`:'')}\\${settings.decimalCharacter}\\d].*?(\\d|\\${settings.decimalCharacter}\\d)`);
        settings.skipLastAutoStrip = new RegExp(`(\\d\\${settings.decimalCharacter}?)[^\\${settings.decimalCharacter}\\d]\\D*$`);

        const allowed = `-0123456789\\${settings.decimalCharacter}`;
        settings.allowedAutoStrip = new RegExp(`[^${allowed}]`, 'gi');
        settings.numRegAutoStrip = new RegExp(`${aNegReg}(?:\\${settings.decimalCharacter}?(\\d+\\${settings.decimalCharacter}\\d+)|(\\d*(?:\\${settings.decimalCharacter}\\d*)?))`);

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
     * Convert the old settings options name to new ones.
     *
     * @param {object} options
     */
    function convertOldOptionsToNewOnes(options) {
        //TODO Delete this function once the old options are not used anymore
        const oldOptionsConverter = {
            // Old option name, with their corresponding new option
            aSep                         : 'digitGroupSeparator',
            nSep                         : 'noSeparatorOnFocus',
            dGroup                       : 'digitalGroupSpacing',
            aDec                         : 'decimalCharacter',
            altDec                       : 'decimalCharacterAlternative',
            aSign                        : 'currencySymbol',
            pSign                        : 'currencySymbolPlacement',
            pNeg                         : 'negativePositiveSignPlacement',
            aSuffix                      : 'suffixText',
            oLimits                      : 'overrideMinMaxLimits',
            vMax                         : 'maximumValue',
            vMin                         : 'minimumValue',
            mDec                         : 'decimalPlacesOverride',
            eDec                         : 'decimalPlacesShownOnFocus',
            scaleDecimal                 : 'scaleDecimalPlaces',
            aStor                        : 'saveValueToSessionStorage',
            mRound                       : 'roundingMethod',
            aPad                         : 'allowDecimalPadding',
            nBracket                     : 'negativeBracketsTypeOnBlur',
            wEmpty                       : 'emptyInputBehavior',
            lZero                        : 'leadingZero',
            aForm                        : 'formatOnPageLoad',
            sNumber                      : 'selectNumberOnly',
            anDefault                    : 'defaultValueOverride',
            unSetOnSubmit                : 'unformatOnSubmit',
            outputType                   : 'outputFormat',
            debug                        : 'showWarnings',
            // Current options :
            digitGroupSeparator          : true,
            noSeparatorOnFocus           : true,
            digitalGroupSpacing          : true,
            decimalCharacter             : true,
            decimalCharacterAlternative  : true,
            currencySymbol               : true,
            currencySymbolPlacement      : true,
            negativePositiveSignPlacement: true,
            suffixText                   : true,
            overrideMinMaxLimits         : true,
            maximumValue                 : true,
            minimumValue                 : true,
            decimalPlacesOverride        : true,
            decimalPlacesShownOnFocus    : true,
            scaleDivisor                 : true,
            scaleDecimalPlaces           : true,
            scaleSymbol                  : true,
            saveValueToSessionStorage    : true,
            onInvalidPaste               : true,
            roundingMethod               : true,
            allowDecimalPadding          : true,
            negativeBracketsTypeOnBlur   : true,
            emptyInputBehavior           : true,
            leadingZero                  : true,
            formatOnPageLoad             : true,
            selectNumberOnly             : true,
            defaultValueOverride         : true,
            unformatOnSubmit             : true,
            outputFormat                 : true,
            showWarnings                 : true,
            failOnUnknownOption          : true,
            //FIXME Find a way to exclude those internal data from the settings object (ideally by using another object, or better yet, class attributes) -->
            onOff                : true,
            runOnce              : true,
            rawValue             : true,
            trailingNegative     : true,
            caretFix             : true,
            throwInput           : true,
            strip                : true,
            tagList              : true,
            negativeSignCharacter: true,
            mIntPos              : true,
            mIntNeg              : true,
            oDec                 : true,
            oPad                 : true,
            oBracket             : true,
            oSep                 : true,
            oSign                : true,
            oSuffix              : true,
            aNegRegAutoStrip     : true,
            skipFirstAutoStrip   : true,
            skipLastAutoStrip    : true,
            allowedAutoStrip     : true,
            numRegAutoStrip      : true,
            stripReg             : true,
            holder               : true,
        };

        for (const option in options) {
            if (options.hasOwnProperty(option)) {
                if (oldOptionsConverter[option] === true) {
                    // If the option is a 'new' option, we continue looping
                    continue;
                }

                if (oldOptionsConverter.hasOwnProperty(option)) {
                    // Else we have an 'old' option name
                    warning(`You are using the deprecated option name '${option}'. Please use '${oldOptionsConverter[option]}' instead from now on. The old option name will be dropped soon.`, true);

                    // Then we modify the initial option object to use the new options instead of the old ones
                    options[oldOptionsConverter[option]] = options[option];
                    delete options[option];
                } else if (options.failOnUnknownOption) {
                    // ...or the option name is unknown. This means there is a problem with the options object, therefore we throw an error.
                    throwError(`Option name '${option}' is unknown. Please fix the options passed to autoNumeric`);
                }
            }
        }
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

        // If the user used old options, we convert them to new ones
        if (update || !isNull(options)) {
            convertOldOptionsToNewOnes(options);
        }

        if (update || isUndefined(settings)) {
            if (update) {
                // The settings are updated
                settings = $.extend(settings, options);
            } else {
                // If we couldn't grab any settings create them from the default ones and combine them with the options passed
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

            // Improve the `negativePositiveSignPlacement` option if needed
            correctPNegOption(options, settings);

            // Set the negative sign if needed
            settings.negativeSignCharacter = settings.minimumValue < 0 ? '-' : '';

            // Additional changes to the settings object (from the original autoCode() function)
            runCallbacksFoundInTheSettingsObject($this, settings);
            calculateVMinAndVMaxIntegerSizes(settings);
            correctMDecOption(settings);
            setsAlternativeDecimalSeparatorCharacter(settings);
            cachesUsualRegularExpressions(settings);

            // Validate the settings
            validate(settings, false); // Throws if necessary

            // Original settings saved for use when decimalPlacesShownOnFocus, scaleDivisor & noSeparatorOnFocus options are being used
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
         * The options passed as a parameter is an object that contains the settings (ie. {digitGroupSeparator: ".", decimalCharacter: ",", currencySymbol: '€ '})
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
                const holder = getHolder($this, settings, false);

                if (!settings.runOnce && settings.formatOnPageLoad) {
                    formatDefaultValueOnPageLoad(settings, $input, $this);
                }

                settings.runOnce = true;

                // Add the events listeners to supported input types ("text", "hidden", "tel" and no type)
                if ($input) {
                    this.addEventListener('focusin', e => { onFocusInAndMouseEnter($this, holder, e); }, false);
                    this.addEventListener('mouseenter', e => { onFocusInAndMouseEnter($this, holder, e); }, false);
                    this.addEventListener('focusout', e => { onFocusOutAndMouseLeave($this, holder, e); }, false);
                    this.addEventListener('mouseleave', e => { onFocusOutAndMouseLeave($this, holder, e); }, false);
                    this.addEventListener('keydown', e => { onKeydown(holder, e); }, false);
                    this.addEventListener('keypress', e => { onKeypress(holder, e); }, false);
                    this.addEventListener('keyup', e => { onKeyup(holder, settings, e); }, false);
                    this.addEventListener('blur', e => { onBlur(holder, e); }, false);
                    this.addEventListener('paste', e => { onPaste($this, holder, e); }, false);
                    onSubmit($this, holder); //TODO Switch to `addEventListener'
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
         * The options passed as a parameter is an object that contains the settings (ie. {digitGroupSeparator: ".", decimalCharacter: ",", currencySymbol: '€ '}).
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
                    warning(`The value "${value}" being "set" is not numeric and therefore cannot be used appropriately.`, settings.showWarnings);
                    return $this.val('');
                }

                if (value !== '') {
                    const [minTest, maxTest] = autoCheck(value, settings);
                    if (minTest && maxTest) {
                        if ($input && (settings.decimalPlacesShownOnFocus || settings.scaleDivisor)) {
                            settings.rawValue = value;
                        }

                        // checks if the value falls within the min max range
                        if ($input || isInArray($this.prop('tagName').toLowerCase(), settings.tagList)) {
                            if (settings.scaleDivisor && !settings.onOff) {
                                value = value / settings.scaleDivisor;
                                value = value.toString();
                                settings.decimalPlacesOverride = (settings.scaleDecimalPlaces) ? settings.scaleDecimalPlaces : settings.decimalPlacesOverride;
                            }

                            value = autoRound(value, settings);
                            if (settings.decimalPlacesShownOnFocus === null && settings.scaleDivisor === null) {
                                settings.rawValue = value;
                            }

                            value = presentNumber(value, settings);
                            value = autoGroup(value, settings);
                        }

                        if (settings.saveValueToSessionStorage && (settings.decimalPlacesShownOnFocus || settings.scaleDivisor)) {
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

                        throwError(`The value [${attemptedValue}] being set falls outside of the minimumValue [${settings.minimumValue}] and maximumValue [${settings.maximumValue}] range set for this element`);

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
         * Locale formats are supported "1234.56-" or "1234,56" or "-1234,56 or "1234,56-", or even plain numbers => please see option "outputFormat" for more details
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

            if (settings.decimalPlacesShownOnFocus || settings.scaleDivisor) {
                value = settings.rawValue;
            } else {
                if (!((/\d/).test(value) || Number(value) === 0) && settings.emptyInputBehavior === 'focus') {
                    return '';
                }

                if (value !== '' && settings.negativeBracketsTypeOnBlur !== null) {
                    settings.onOff = true;
                    value = negativeBracket(value, settings);
                }

                if (settings.runOnce || settings.formatOnPageLoad === false) {
                    value = stripAllNonNumberCharacters(value, settings);
                }

                value = fixNumber(value, settings);
            }

            // Always return a numeric string
            return value;
        },

        /**
         * Returns the unformatted value, but following the `outputFormat` setting, which means the output can either be :
         * - a string (that could or could not represent a number (ie. "12345,67-")), or
         * - a plain number (if the setting 'number' is used).
         *
         * By default the returned values are an ISO numeric string "1234.56" or "-1234.56" where the decimal character is a period.
         * Check the "outputFormat" option definition for more details.
         *
         * @returns {*}
         */
        getLocalized() {
            const $this = autoGet(this);
            let value = $this.autoNumeric('get');
            const settings = $this.data('autoNumeric');

            if (Number(value) === 0 && settings.leadingZero !== 'keep') {
                value = '0';
            }

            return toLocale(value, settings.outputFormat);
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
         * Locale formats are supported "1234.56-" or "1234,56" or "-1234,56 or "1234,56-" or plain numbers => please see option "outputFormat" for details
         */
        getString() {
            return _getStringOrArray(false, this);
        },

        /**
         * The "getArray" method on the other hand uses jQuery's .serializeArray() method that creates array or objects that can be encoded as a JSON string.
         *
         * It then loops through the string and un-formats the inputs with autoNumeric.
         * By defaults values returned as ISO numeric string "1234.56" or "-1234.56" where the decimal character is a period
         * Locale formats are supported "1234.56-" or "1234,56" or "-1234,56 or "1234,56-" or plain numbers => please see option "outputFormat" for details
         */
        getArray() {
            return _getStringOrArray(true, this);
        },

        /**
         * The 'getSettings' function returns the object with autoNumeric settings for those who need to look under the hood
         * $(someSelector).autoNumeric('getSettings'); // no parameters accepted
         * $(someSelector).autoNumeric('getSettings').decimalCharacter; // return the decimalCharacter setting as a string - ant valid setting can be used
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
            settings.negativeSignCharacter = '-';
        }

        if (isNull(settings.decimalPlacesOverride)) {
            settings.decimalPlacesOverride = maximumVMinAndVMaxDecimalLength(settings.minimumValue, settings.maximumValue);
        }

        // Basic tests to check if the given value is valid
        const [minTest, maxTest] = autoCheck(value, settings);
        if (!minTest || !maxTest) {
            // Throw a custom event
            triggerEvent('autoFormat.autoNumeric', document, `Range test failed`);
            throwError(`The value [${value}] being set falls outside of the minimumValue [${settings.minimumValue}] and maximumValue [${settings.maximumValue}] range set for this element`);
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
        const allowed = `-0123456789\\${settings.decimalCharacter}`;
        const autoStrip = new RegExp(`[^${allowed}]`, 'gi');
        value = value.toString();

        if (value.charAt(0) === '-') {
            settings.negativeSignCharacter = '-';
        } else if (settings.negativeBracketsTypeOnBlur && settings.negativeBracketsTypeOnBlur.split(',')[0] === value.charAt(0)) {
            settings.negativeSignCharacter = '-';
            settings.onOff = true;
            value = negativeBracket(value, settings);
        }

        value = value.replace(autoStrip, '');
        value = value.replace(',', '.');
        value = toLocale(value, settings.outputFormat);

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
        const showWarnings = true; // The error here must always be thrown, since a badly configured options object will lead to wrong results, if any.

        if (isUndefinedOrNullOrEmpty(userOptions) || !isObject(userOptions) || isEmptyObj(userOptions)) {
            throwError(`The userOptions are invalid ; it should be a valid object, [${userOptions}] given.`);
        }

        // If the user used old options, we convert them to new ones
        if (!isNull(userOptions)) {
            convertOldOptionsToNewOnes(userOptions);
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
        if (!isInArray(options.digitGroupSeparator, [',', '.', ' ', ''])) {
            throwError(`The thousand separator character option 'digitGroupSeparator' is invalid ; it should be ',', '.', ' ' or empty (''), [${options.digitGroupSeparator}] given.`);
        }

        if (!isTrueOrFalseString(options.noSeparatorOnFocus) && !isBoolean(options.noSeparatorOnFocus)) {
            throwError(`The 'noSeparatorOnFocus' option is invalid ; it should be either 'false' or 'true', [${options.noSeparatorOnFocus}] given.`);
        }

        if (!testPositiveInteger.test(options.digitalGroupSpacing)) { // isNaN(parseInt(options.digitalGroupSpacing)) //DEBUG
            throwError(`The digital grouping for thousand separator option 'digitalGroupSpacing' is invalid ; it should be a positive integer, [${options.digitalGroupSpacing}] given.`);
        }

        if (!isInArray(options.decimalCharacter, [',', '.'])) {
            throwError(`The decimal separator character option 'decimalCharacter' is invalid ; it should be '.' or ',', [${options.decimalCharacter}] given.`);
        }

        // Checks if the decimal and thousand characters are the same
        if (options.decimalCharacter === options.digitGroupSeparator) {
            throwError(`autoNumeric will not function properly when the decimal character 'decimalCharacter' [${options.decimalCharacter}] and the thousand separator 'digitGroupSeparator' [${options.digitGroupSeparator}] are the same character.`);
        }

        if (!isNull(options.decimalCharacterAlternative) && !isString(options.decimalCharacterAlternative)) {
            throwError(`The alternate decimal separator character option 'decimalCharacterAlternative' is invalid ; it should be a string, [${options.decimalCharacterAlternative}] given.`);
        }

        if (options.currencySymbol !== '' && !isString(options.currencySymbol)) {
            throwError(`The currency symbol option 'currencySymbol' is invalid ; it should be a string, [${options.currencySymbol}] given.`);
        }

        if (!isInArray(options.currencySymbolPlacement, ['p', 's'])) {
            throwError(`The placement of the currency sign option 'currencySymbolPlacement' is invalid ; it should either be 'p' (prefix) or 's' (suffix), [${options.currencySymbolPlacement}] given.`);
        }

        if (!isInArray(options.negativePositiveSignPlacement, ['p', 's', 'l', 'r'])) {
            throwError(`The placement of the negative sign option 'negativePositiveSignPlacement' is invalid ; it should either be 'p' (prefix), 's' (suffix), 'l' (left) or 'r' (right), [${options.negativePositiveSignPlacement}] given.`);
        }

        if (!isString(options.suffixText) || (options.suffixText !== '' && (contains(options.suffixText, '-') || testNumericalCharacters.test(options.suffixText)))) {
            throwError(`The additional suffix option 'suffixText' is invalid ; it should not contains the negative sign '-' nor any numerical characters, [${options.suffixText}] given.`);
        }

        if (!isNull(options.overrideMinMaxLimits) && !isInArray(options.overrideMinMaxLimits, ['ceiling', 'floor', 'ignore'])) {
            throwError(`The override min & max limits option 'overrideMinMaxLimits' is invalid ; it should either be 'ceiling', 'floor' or 'ignore', [${options.overrideMinMaxLimits}] given.`);
        }

        if (!isString(options.maximumValue) || !testFloatOrIntegerAndPossibleNegativeSign.test(options.maximumValue)) {
            throwError(`The maximum possible value option 'maximumValue' is invalid ; it should be a string that represents a positive or negative number, [${options.maximumValue}] given.`);
        }

        if (!isString(options.minimumValue) || !testFloatOrIntegerAndPossibleNegativeSign.test(options.minimumValue)) {
            throwError(`The minimum possible value option 'minimumValue' is invalid ; it should be a string that represents a positive or negative number, [${options.minimumValue}] given.`);
        }

        if (parseFloat(options.minimumValue) > parseFloat(options.maximumValue)) {
            throwError(`The minimum possible value option is greater than the maximum possible value option ; 'minimumValue' [${options.minimumValue}] should be smaller than 'maximumValue' [${options.maximumValue}].`);
        }

        if (!(isNull(options.decimalPlacesOverride) ||
            (isInt(options.decimalPlacesOverride) && options.decimalPlacesOverride >= 0) || // If integer option
            (isString(options.decimalPlacesOverride) && testPositiveInteger.test(options.decimalPlacesOverride)))  // If string option
        ) {
            throwError(`The maximum number of decimal places option 'decimalPlacesOverride' is invalid ; it should be a positive integer, [${options.decimalPlacesOverride}] given.`);
        }

        // Write a warning message in the console if the number of decimal in minimumValue/maximumValue is overridden by decimalPlacesOverride (and not if decimalPlacesOverride is equal to the number of decimal used in minimumValue/maximumValue)
        const vMinAndVMaxMaximumDecimalPlaces = maximumVMinAndVMaxDecimalLength(options.minimumValue, options.maximumValue);
        if (!isNull(options.decimalPlacesOverride) && vMinAndVMaxMaximumDecimalPlaces !== Number(options.decimalPlacesOverride)) {
            warning(`Setting 'decimalPlacesOverride' to [${options.decimalPlacesOverride}] will override the decimals declared in 'minimumValue' [${options.minimumValue}] and 'maximumValue' [${options.maximumValue}].`, showWarnings);
        }

        if (!options.allowDecimalPadding && !isNull(options.decimalPlacesOverride)) {
            warning(`Setting 'allowDecimalPadding' to [false] will override the current 'decimalPlacesOverride' setting [${options.decimalPlacesOverride}].`, showWarnings);
        }

        if (!isNull(options.decimalPlacesShownOnFocus) && (!isString(options.decimalPlacesShownOnFocus) || !testPositiveInteger.test(options.decimalPlacesShownOnFocus))) {
            throwError(`The number of expanded decimal places option 'decimalPlacesShownOnFocus' is invalid ; it should be a positive integer, [${options.decimalPlacesShownOnFocus}] given.`);
        }

        // Checks if the extended decimal places "decimalPlacesShownOnFocus" is greater than the normal decimal places "decimalPlacesOverride"
        if (!isNull(options.decimalPlacesShownOnFocus) && !isNull(options.decimalPlacesOverride) && Number(options.decimalPlacesOverride) < Number(options.decimalPlacesShownOnFocus)) {
            throwError(`autoNumeric will not function properly when the extended decimal places 'decimalPlacesShownOnFocus' [${options.decimalPlacesShownOnFocus}] is greater than the 'decimalPlacesOverride' [${options.decimalPlacesOverride}] value.`);
        }

        if (!isNull(options.scaleDivisor) && !testPositiveFloatOrInteger.test(options.scaleDivisor)) {
            throwError(`The scale divisor option 'scaleDivisor' is invalid ; it should be a positive number, preferably an integer, [${options.scaleDivisor}] given.`);
        }

        if (!isNull(options.scaleDecimalPlaces) && !testPositiveInteger.test(options.scaleDecimalPlaces)) {
            throwError(`The scale number of decimals option 'scaleDecimalPlaces' is invalid ; it should be a positive integer, [${options.scaleDecimalPlaces}] given.`);
        }

        if (!isNull(options.scaleSymbol) && !isString(options.scaleSymbol)) {
            throwError(`The scale symbol option 'scaleSymbol' is invalid ; it should be a string, [${options.scaleSymbol}] given.`);
        }

        if (!isTrueOrFalseString(options.saveValueToSessionStorage) && !isBoolean(options.saveValueToSessionStorage)) {
            throwError(`The save to session storage option 'saveValueToSessionStorage' is invalid ; it should be either 'false' or 'true', [${options.saveValueToSessionStorage}] given.`);
        }

        if (!isInArray(options.onInvalidPaste, [
            'error',
            'ignore',
            'clamp',
            'truncate',
            'replace',
        ])) {
            throwError(`The paste behavior option 'onInvalidPaste' is invalid ; it should either be 'error', 'ignore', 'clamp', 'truncate' or 'replace' (cf. documentation), [${options.onInvalidPaste}] given.`);
        }

        if (!isInArray(options.roundingMethod, [
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
            throwError(`The rounding method option 'roundingMethod' is invalid ; it should either be 'S', 'A', 's', 'a', 'B', 'U', 'D', 'C', 'F', 'N05', 'CHF', 'U05' or 'D05' (cf. documentation), [${options.roundingMethod}] given.`);
        }

        if (!isTrueOrFalseString(options.allowDecimalPadding) && !isBoolean(options.allowDecimalPadding)) {
            throwError(`The control decimal padding option 'allowDecimalPadding' is invalid ; it should be either 'false' or 'true', [${options.allowDecimalPadding}] given.`);
        }

        if (!isNull(options.negativeBracketsTypeOnBlur) && !isInArray(options.negativeBracketsTypeOnBlur, ['(,)', '[,]', '<,>', '{,}'])) {
            throwError(`The brackets for negative values option 'negativeBracketsTypeOnBlur' is invalid ; it should either be '(,)', '[,]', '<,>' or '{,}', [${options.negativeBracketsTypeOnBlur}] given.`);
        }

        if (!isInArray(options.emptyInputBehavior, ['focus', 'press', 'always', 'zero'])) {
            throwError(`The display on empty string option 'emptyInputBehavior' is invalid ; it should either be 'focus', 'press', 'always' or 'zero', [${options.emptyInputBehavior}] given.`);
        }

        if (!isInArray(options.leadingZero, ['allow', 'deny', 'keep'])) {
            throwError(`The leading zero behavior option 'leadingZero' is invalid ; it should either be 'allow', 'deny' or 'keep', [${options.leadingZero}] given.`);
        }

        if (!isTrueOrFalseString(options.formatOnPageLoad) && !isBoolean(options.formatOnPageLoad)) {
            throwError(`The format on initialization option 'formatOnPageLoad' is invalid ; it should be either 'false' or 'true', [${options.formatOnPageLoad}] given.`);
        }

        if (!isTrueOrFalseString(options.selectNumberOnly) && !isBoolean(options.selectNumberOnly)) {
            throwError(`The select number only option 'selectNumberOnly' is invalid ; it should be either 'false' or 'true', [${options.selectNumberOnly}] given.`);
        }

        if (!isNull(options.defaultValueOverride) && (options.defaultValueOverride !== '' && !testFloatOrIntegerAndPossibleNegativeSign.test(options.defaultValueOverride))) {
            throwError(`The unformatted default value option 'defaultValueOverride' is invalid ; it should be a string that represents a positive or negative number, [${options.defaultValueOverride}] given.`);
        }

        if (!isTrueOrFalseString(options.unformatOnSubmit) && !isBoolean(options.unformatOnSubmit)) {
            throwError(`The remove formatting on submit option 'unformatOnSubmit' is invalid ; it should be either 'false' or 'true', [${options.unformatOnSubmit}] given.`);
        }

        if (!isNull(options.outputFormat) && !isInArray(options.outputFormat, [
            'string',
            'number',
            '.',
            '-.',
            ',',
            '-,',
            '.-',
            ',-',
        ])) {
            throwError(`The custom locale format option 'outputFormat' is invalid ; it should either be null, 'string', 'number', '.', '-.', ',', '-,', '.-' or ',-', [${options.outputFormat}] given.`);
        }

        if (!isTrueOrFalseString(options.showWarnings) && !isBoolean(options.showWarnings)) {
            throwError(`The debug option 'showWarnings' is invalid ; it should be either 'false' or 'true', [${options.showWarnings}] given.`);
        }

        if (!isTrueOrFalseString(options.failOnUnknownOption) && !isBoolean(options.failOnUnknownOption)) {
            throwError(`The debug option 'failOnUnknownOption' is invalid ; it should be either 'false' or 'true', [${options.failOnUnknownOption}] given.`);
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
     * Create a custom event and immediately sent it from the given element.
     * By default, if no element is given, the event is thrown from `document`.
     *
     * @param {string} eventName
     * @param {Element} element
     * @param {object} detail
     */
    function triggerEvent(eventName, element = document, detail = null) {
        let event;
        if (window.CustomEvent) {
            event = new CustomEvent(eventName, { detail, bubbles: false, cancelable: false }); // This is not supported by default by IE ; We use the polyfill for IE9 and later.
        } else {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent(eventName, true, true, { detail });
        }

        element.dispatchEvent(event);
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
