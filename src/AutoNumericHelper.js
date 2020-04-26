/**
 * Helper functions for autoNumeric.js
 * @author Alexandre Bonneau <alexandre.bonneau@linuxfr.eu>
 * @copyright © 2019 Alexandre Bonneau
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

import AutoNumericEnum from './AutoNumericEnum';

/**
 * Static class that holds all the helper functions autoNumeric uses.
 * Note : none of the functions in there are aware of any autoNumeric internals (which means there are no references to autoNumeric-specific info like options names or data structures).
 */
export default class AutoNumericHelper {
    /**
     * Return `true` if the `value` is null
     *
     * @static
     * @param {*} value The value to test
     * @returns {boolean} Return `true` if the `value` is null, FALSE otherwise
     */
    static isNull(value) {
        return value === null;
    }

    /**
     * Return `true` if the `value` is undefined
     *
     * @static
     * @param {*} value The value to test
     * @returns {boolean} Return `true` if the `value` is undefined, FALSE otherwise
     */
    static isUndefined(value) {
        return value === void(0);
    }

    /**
     * Return `true` if the `value` is undefined, null or empty
     *
     * @param {*} value
     * @returns {boolean}
     */
    static isUndefinedOrNullOrEmpty(value) {
        return value === null || value === void(0) || '' === value;
    }

    /**
     * Return `true` if the given parameter is a String
     *
     * @param {*} str
     * @returns {boolean}
     */
    static isString(str) {
        return (typeof str === 'string' || str instanceof String);
    }
    /**
     * Return `true` if the `value` is an empty string ''
     *
     * @static
     * @param {*} value The value to test
     * @returns {boolean} Return `true` if the `value` is an empty string '', FALSE otherwise
     */
    static isEmptyString(value) {
        return value === '';
    }

    /**
     * Return `true` if the parameter is a boolean
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     */
    static isBoolean(value) {
        return typeof(value) === 'boolean';
    }

    /**
     * Return `true` if the parameter is a string 'true' or 'false'
     *
     * This function accepts any cases for those strings.
     * @param {string} value
     * @returns {boolean}
     */
    static isTrueOrFalseString(value) {
        const lowercaseValue = String(value).toLowerCase();
        return lowercaseValue === 'true' || lowercaseValue === 'false';
    }

    /**
     * Return `true` if the parameter is an object
     *
     * @param {*} reference
     * @returns {boolean}
     */
    static isObject(reference) {
        return typeof reference === 'object' && reference !== null && !Array.isArray(reference);
    }

    /**
     * Return `true` if the given object is empty
     * cf. http://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object and http://jsperf.com/empty-object-test
     *
     * @param {object} obj
     * @returns {boolean}
     */
    static isEmptyObj(obj) {
        for (const prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Return `true` if the parameter is a real number (and not a numeric string).
     *
     * @param {*} n
     * @returns {boolean}
     */
    static isNumberStrict(n) {
        return typeof n === 'number';
    }

    /**
     * Return `true` if the parameter is a number (or a number written as a string).
     *
     * @param {*} n
     * @returns {boolean}
     */
    static isNumber(n) {
        return !this.isArray(n) && !isNaN(parseFloat(n)) && isFinite(n);
    }

    /**
     * Return `true` if the given character is a number (0 to 9)
     *
     * @param {char} char
     * @returns {boolean}
     */
    static isDigit(char) {
        return /\d/.test(char);
    }

    /**
     * Return `true` if the parameter is a number (or a number written as a string).
     * This version also accepts Arabic and Persian numbers.
     *
     * @param {*} n
     * @returns {boolean}
     */
    static isNumberOrArabic(n) {
        const latinConvertedNumber = this.arabicToLatinNumbers(n, false, true, true);
        return this.isNumber(latinConvertedNumber);
    }

    /**
     * Return `true` if the parameter is an integer (and not a float).
     *
     * @param {*} n
     * @returns {boolean}
     */
    static isInt(n) {
        return typeof n === 'number' && parseFloat(n) === parseInt(n, 10) && !isNaN(n);
    }

    /**
     * Return `true` if the parameter is a function.
     *
     * @param {function} func
     * @returns {boolean}
     */
    static isFunction(func) {
        return typeof func === 'function';
    }

    /**
     * Return `true` if the current browser is the obsolete Internet Explorer 11 (IE11) one
     * cf. https://stackoverflow.com/a/21825207/2834898
     *
     * @returns {boolean}
     */
    static isIE11() {
        // noinspection JSUnresolvedVariable
        return typeof window !== 'undefined' && !!window.MSInputMethodContext && !!document.documentMode;
    }

    /**
     * Return `true` is the string `str` contains the string `needle`
     * Note: this function does not coerce the parameters types
     *
     * @param {string} str
     * @param {string} needle
     * @returns {boolean}
     */
    static contains(str, needle) {
        //TODO Use `Array.prototype.includes()` when available (cf. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)
        if (!this.isString(str) || !this.isString(needle) || str === '' || needle === '') {
            return false;
        }

        return str.indexOf(needle) !== -1;
    }

    /**
     * Return `true` if the `needle` is in the array
     *
     * @param {*} needle
     * @param {Array} array
     * @returns {boolean}
     */
    static isInArray(needle, array) {
        if (!this.isArray(array) || array === [] || this.isUndefined(needle)) {
            return false;
        }

        return array.indexOf(needle) !== -1;
    }

    /**
     * Return `true` if the parameter is an Array
     * //TODO Replace this by the default `Array.isArray()` function?
     *
     * @param {*} arr
     * @throws Error
     * @returns {*|boolean}
     */
    static isArray(arr) {
        if (Object.prototype.toString.call([]) === '[object Array]') { // Make sure an array has a class attribute of [object Array]
            // Test passed, now check if is an Array
            return Array.isArray(arr) || (typeof arr === 'object' && Object.prototype.toString.call(arr) === '[object Array]');
        }
        else {
            throw new Error('toString message changed for Object Array'); // Verify that the string returned by `toString` does not change in the future (cf. http://stackoverflow.com/a/8365215)
        }
    }

    /**
     * Return `true` if the parameter is a DOM element
     * cf. http://stackoverflow.com/a/4754104/2834898
     *
     * @param {*} obj
     * @returns {boolean}
     */
    static isElement(obj) {
        // return !!(obj && obj.nodeName);
        // return obj && 'nodeType' in obj;
        // return obj instanceof Element || obj instanceof HTMLInputElement || obj instanceof HTMLElement;
        if (typeof Element === 'undefined') {
            // This test is needed in environnements where the Element object does not exist (ie. in web workers)
            return false;
        }

        return obj instanceof Element;
    }

    /**
     * Return `true` in the given DOM element is an <input>.
     *
     * @param {HTMLElement|HTMLInputElement} domElement
     * @returns {boolean}
     * @private
     */
    static isInputElement(domElement) {
        return this.isElement(domElement) && domElement.tagName.toLowerCase() === 'input';
    }

    /**
     * Return `true` if the parameter is a string that represents a float number, and that number has a decimal part
     *
     * @param {string} str
     * @returns {boolean}
     */
    // static hasDecimals(str) {
    //     const [, decimalPart] = str.split('.');
    //     return !isUndefined(decimalPart);
    // }

    /**
     * Return the number of decimal places if the parameter is a string that represents a float number, and that number has a decimal part.
     *
     * @param {string} str
     * @returns {int}
     */
    static decimalPlaces(str) {
        const [, decimalPart] = str.split('.');
        if (!this.isUndefined(decimalPart)) {
            return decimalPart.length;
        }

        return 0;
    }

    /**
     * Return the index of the first non-zero decimal place in the given value.
     * The index starts after the decimal point, if any, and begins at '1'.
     * If no decimal places are found in the value, this function returns `0`.
     *
     * @example
     * indexFirstNonZeroDecimalPlace('0.00') -> 0
     * indexFirstNonZeroDecimalPlace('1.00') -> 0
     * indexFirstNonZeroDecimalPlace('0.12') -> 1
     * indexFirstNonZeroDecimalPlace('0.1234') -> 1
     * indexFirstNonZeroDecimalPlace('0.01234') -> 2
     * indexFirstNonZeroDecimalPlace('0.001234') -> 3
     * indexFirstNonZeroDecimalPlace('0.0001234') -> 4
     *
     * @param {number} value
     * @returns {Number|number}
     */
    static indexFirstNonZeroDecimalPlace(value) {
        const [, decimalPart] = String(Math.abs(value)).split('.');

        if (this.isUndefined(decimalPart)) {
            return 0;
        }

        let result = decimalPart.lastIndexOf('0');
        if (result === -1) {
            result = 0;
        } else {
            result += 2;
        }

        return result;
    }

    /**
     * Return the code for the key used to generate the given event.
     *
     * @param {Event} event
     * @returns {string|Number}
     */
    static keyCodeNumber(event) {
        // `event.keyCode` and `event.which` are deprecated, `KeyboardEvent.key` (https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) must be used now
        // Also, do note that Firefox generate a 'keypress' event (e.keyCode === 0) for the keys that do not print a character (ie. 'Insert', 'Delete', 'Fn' keys, 'PageUp', 'PageDown' etc.). 'Shift' on the other hand does not generate a keypress event.
        return (typeof event.which === 'undefined')?event.keyCode:event.which;
    }

    /**
     * Return the character from the event key code.
     * If the KeyboardEvent does not represent a printable character, then the key name is used (ie. 'Meta', 'Shift', 'F1', etc.)
     * @example character(50) => '2'
     *
     * @param {KeyboardEvent} event
     * @returns {string}
     */
    static character(event) {
        let result;
        if (event.key === 'Unidentified' || event.key === void(0) || this.isSeleniumBot()) {
            //XXX The selenium geckodriver does not understand `event.key`, hence when using it, we need to rely on the old deprecated `keyCode` attribute, cf. upstream issue https://github.com/mozilla/geckodriver/issues/440
            // Use the old deprecated keyCode property, if the new `key` one is not supported
            const keyCode = this.keyCodeNumber(event);
            if (keyCode === AutoNumericEnum.keyCode.AndroidDefault) {
                return AutoNumericEnum.keyName.AndroidDefault;
            }

            const potentialResult = AutoNumericEnum.fromCharCodeKeyCode[keyCode];
            if (!AutoNumericHelper.isUndefinedOrNullOrEmpty(potentialResult)) {
                // Since `String.fromCharCode` do not return named keys for some keys ('Escape' and 'Enter' for instance), we convert the characters to the key names
                result = potentialResult;
            } else {
                result = String.fromCharCode(keyCode);
            }
        } else {
            let browser;
            switch (event.key) {
                // Manages all the special cases for obsolete browsers that return the non-standard names
                case 'Add':
                    result = AutoNumericEnum.keyName.NumpadPlus;
                    break;
                case 'Apps':
                    result = AutoNumericEnum.keyName.ContextMenu;
                    break;
                case 'Crsel':
                    result = AutoNumericEnum.keyName.CrSel;
                    break;
                case 'Decimal':
                    if (event.char) {
                        // this fixes #602
                        result = event.char;
                    } else {
                        result = AutoNumericEnum.keyName.NumpadDot;
                    }
                    break;
                case 'Del':
                    browser = this.browser();
                    if ((browser.name === 'firefox' && browser.version <= 36) ||
                        (browser.name === 'ie' && browser.version <= 9)) {
                        // Special workaround for the obsolete browser IE11 which output a 'Delete' key when using the numpad 'dot' one! This fixes issue #401
                        // This workaround break the usage of the 'Delete' key for Firefox <=36, and IE9, since those browser send 'Del' instead of 'Delete', therefore we only use it for those obsolete browsers
                        result = AutoNumericEnum.keyName.Dot;
                    } else {
                        result = AutoNumericEnum.keyName.Delete;
                    }
                    break;
                case 'Divide':
                    result = AutoNumericEnum.keyName.NumpadSlash;
                    break;
                case 'Down':
                    result = AutoNumericEnum.keyName.DownArrow;
                    break;
                case 'Esc':
                    result = AutoNumericEnum.keyName.Esc;
                    break;
                case 'Exsel':
                    result = AutoNumericEnum.keyName.ExSel;
                    break;
                case 'Left':
                    result = AutoNumericEnum.keyName.LeftArrow;
                    break;
                case 'Meta':
                case 'Super':
                    result = AutoNumericEnum.keyName.OSLeft;
                    break;
                case 'Multiply':
                    result = AutoNumericEnum.keyName.NumpadMultiply;
                    break;
                case 'Right':
                    result = AutoNumericEnum.keyName.RightArrow;
                    break;
                case 'Spacebar':
                    result = AutoNumericEnum.keyName.Space;
                    break;
                case 'Subtract':
                    result = AutoNumericEnum.keyName.NumpadMinus;
                    break;
                case 'Up':
                    result = AutoNumericEnum.keyName.UpArrow;
                    break;
                default:
                    // The normal case
                    result = event.key;
            }
        }

        return result;
    }

    /**
     * Return an object containing the name and version of the current browser.
     * @example `browserVersion()` => { name: 'Firefox', version: '42' }
     * Based on http://stackoverflow.com/a/38080051/2834898
     *
     * @returns {{ name: string, version: string }}
     */
    static browser() {
        const ua = navigator.userAgent;
        let tem;
        let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return { name: 'ie', version: (tem[1] || '') };
        }

        if (M[1] === 'Chrome') {
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if (tem !== null) {
                return { name: tem[1].replace('OPR', 'opera'), version: tem[2] };
            }
        }

        M = M[2]?[M[1], M[2]]:[navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) !== null) {
            M.splice(1, 1, tem[1]);
        }

        return { name: M[0].toLowerCase(), version: M[1] };
    }

    /**
     * Check if the browser is controlled by Selenium.
     * Note: This only works within the geckodriver.
     * cf. http://stackoverflow.com/questions/33225947/can-a-website-detect-when-you-are-using-selenium-with-chromedriver
     *
     * @returns {boolean}
     */
    static isSeleniumBot() {
        // noinspection JSUnresolvedVariable
        return window.navigator.webdriver === true;
    }

    /**
     * Return `true` if the given number is negative, or if the given string contains a negative sign :
     * - everywhere in the string (by default), or
     * - on the first character only if the `checkEverywhere` parameter is set to `false`.
     *
     * Note: `-0` is not a negative number since it's equal to `0`.
     *
     * @param {number|string} numberOrNumericString A Number, or a number represented by a string
     * @param {string} negativeSignCharacter The single character that represent the negative sign
     * @param {boolean} checkEverywhere If TRUE, then the negative sign is search everywhere in the numeric string (this is needed for instance if the string is '1234.56-')
     * @returns {boolean}
     */
    static isNegative(numberOrNumericString, negativeSignCharacter = '-', checkEverywhere = true) {
        if (numberOrNumericString === negativeSignCharacter) {
            return true;
        }

        if (numberOrNumericString === '') {
            return false;
        }

        if (AutoNumericHelper.isNumber(numberOrNumericString)) {
            return numberOrNumericString < 0;
        }

        if (checkEverywhere) {
            return this.contains(numberOrNumericString, negativeSignCharacter);
        }

        return this.isNegativeStrict(numberOrNumericString, negativeSignCharacter);
    }

    /**
     * Return `true` if the given string contains a negative sign on the first character (on the far left).
     *
     * @example isNegativeStrict('1234.56')     => false
     * @example isNegativeStrict('1234.56-')    => false
     * @example isNegativeStrict('-1234.56')    => true
     * @example isNegativeStrict('-1,234.56 €') => true
     *
     * @param {string} numericString
     * @param {string} negativeSignCharacter The single character that represent the negative sign
     * @returns {boolean}
     */
    static isNegativeStrict(numericString, negativeSignCharacter = '-') {
        return numericString.charAt(0) === negativeSignCharacter;
    }

    /**
     * Return `true` if the very first character is the opening bracket, and if the rest of the `valueString` also has the closing bracket.
     *
     * @param {string} valueString
     * @param {string} leftBracket
     * @param {string} rightBracket
     * @returns {boolean}
     */
    static isNegativeWithBrackets(valueString, leftBracket, rightBracket) {
        return valueString.charAt(0) === leftBracket && this.contains(valueString, rightBracket);
    }

    /**
     * Return `true` if the formatted or unformatted numeric string represent the value 0 (ie. '0,00 €'), or is empty (' €').
     * This works since we test if there are any numbers from 1 to 9 in the string. If there is none, then the number is zero (or the string is empty).
     *
     * @param {string} numericString
     * @returns {boolean}
     */
    static isZeroOrHasNoValue(numericString) {
        return !(/[1-9]/g).test(numericString);
    }

    /**
     * Return the negative version of the value (represented as a string) given as a parameter.
     * The numeric string is a valid Javascript number when typecast to a `Number`.
     *
     * @param {string} value
     * @returns {*}
     */
    static setRawNegativeSign(value) {
        if (!this.isNegativeStrict(value, '-')) {
            return `-${value}`;
        }

        return value;
    }

    /**
     * Replace the character at the position `index` in the string `string` by the character(s) `newCharacter`.
     *
     * @param {string} string
     * @param {int} index
     * @param {string} newCharacter
     * @returns {string}
     */
    static replaceCharAt(string, index, newCharacter) {
        return `${string.substr(0, index)}${newCharacter}${string.substr(index + newCharacter.length)}`;
    }

    /**
     * Return the value clamped to the nearest minimum/maximum value, as defined in the settings.
     *
     * @param {string|number} value
     * @param {object} settings
     * @returns {number}
     */
    static clampToRangeLimits(value, settings) {
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
    static countNumberCharactersOnTheCaretLeftSide(formattedNumberString, caretPosition, decimalCharacter) {
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
    static findCaretPositionInFormattedNumber(rawNumberString, caretPositionInRawValue, formattedNumberString, decimalCharacter) {
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
     * Count the number of occurrence of the given character, in the given text.
     *
     * @param {string} character
     * @param {string} text
     * @returns {number}
     */
    static countCharInText(character, text) {
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
     * @param {int} characterCount
     * @returns {number}
     */
    static convertCharacterCountToIndexPosition(characterCount) {
        return Math.max(characterCount, characterCount - 1);
    }

    /**
     * Cross browser routine for getting selected range/cursor position.
     * Note: this also works with edge cases like contenteditable-enabled elements, and hidden inputs.
     *
     * @param {HTMLInputElement|EventTarget} element
     * @returns {{}}
     */
    static getElementSelection(element) {
        const position = {};

        let isSelectionStartUndefined;
        try {
            isSelectionStartUndefined = this.isUndefined(element.selectionStart);
        } catch (error) {
            isSelectionStartUndefined = false;
        }

        try {
            if (isSelectionStartUndefined) {
                const selection = window.getSelection();
                const selectionInfo = selection.getRangeAt(0);
                position.start = selectionInfo.startOffset;
                position.end = selectionInfo.endOffset;
                position.length = position.end - position.start;
            } else {
                position.start = element.selectionStart;
                position.end = element.selectionEnd;
                position.length = position.end - position.start;
            }
        } catch (error) {
            // Manages the cases where :
            // - the 'contenteditable' elements that have no selections
            // - the <input> element is of type 'hidden'
            position.start = 0;
            position.end = 0;
            position.length = 0;
        }

        return position;
    }

    /**
     * Cross browser routine for setting selected range/cursor position
     *
     * @param {HTMLInputElement|EventTarget} element
     * @param {int} start
     * @param {int|null} end
     */
    static setElementSelection(element, start, end = null) {
        if (this.isUndefinedOrNullOrEmpty(end)) {
            end = start;
        }

        if (this.isInputElement(element)) {
            element.setSelectionRange(start, end);
        } else if (!AutoNumericHelper.isNull(element.firstChild)) {
            const range = document.createRange();
            range.setStart(element.firstChild, start);
            range.setEnd(element.firstChild, end);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    /**
     * Function that throw error messages
     *
     * @param {string} message
     * @throws
     */
    static throwError(message) {
        throw new Error(message);
    }

    /**
     * Function that display a warning messages, according to the debug level.
     *
     * @param {string} message
     * @param {boolean} showWarning If FALSE, then the warning message is not displayed
     */
    static warning(message, showWarning = true) {
        if (showWarning) {
            /* eslint no-console: 0 */
            console.warn(`Warning: ${message}`);
        }
    }

    /**
     * Return `true` if the given event is an instance of WheelEvent
     *
     * @static
     * @param {event} event The event to test
     * @returns {boolean} Return `true` if the event is an instance of WheelEvent, FALSE otherwise
    */
    static isWheelEvent(event) {
        return event instanceof WheelEvent;
    }

    /**
     * Return `true` if the given event is a wheelup event
     *
     * @param {WheelEvent} wheelEvent
     * @returns {boolean}
     */
    static isWheelUpEvent(wheelEvent) {
        if (!this.isWheelEvent(wheelEvent) || this.isUndefinedOrNullOrEmpty(wheelEvent.deltaY)) {
            this.throwError(`The event passed as a parameter is not a valid wheel event, '${wheelEvent.type}' given.`);
        }

        return wheelEvent.deltaY < 0;
    }

    /**
     * Return `true` if the given event is a wheeldown event
     *
     * @param {WheelEvent} wheelEvent
     * @returns {boolean}
     */
    static isWheelDownEvent(wheelEvent) {
        if (!this.isWheelEvent(wheelEvent) || this.isUndefinedOrNullOrEmpty(wheelEvent.deltaY)) {
            this.throwError(`The event passed as a parameter is not a valid wheel event, '${wheelEvent.type}' given.`);
        }

        return wheelEvent.deltaY > 0;
    }

    /**
     * Return the given raw value truncated at the given number of decimal places `decimalPlaces`.
     * This function does not round the value.
     *
     * @example
     * forceDecimalPlaces(123.45678, 0) -> '123.45678'
     * forceDecimalPlaces(123.45678, 1) -> '123.4'
     * forceDecimalPlaces(123.45678, 2) -> '123.45'
     * forceDecimalPlaces(123.45678, 3) -> '123.456'
     *
     * @param {number} value
     * @param {int} decimalPlaces
     * @returns {number|string}
     */
    static forceDecimalPlaces(value, decimalPlaces) {
        // We could make sure `decimalPlaces` is an integer and positive, but we'll leave that to the dev calling this function.
        const [integerPart, decimalPart] = String(value).split('.');
        if (!decimalPart) {
            return value;
        }

        return `${integerPart}.${decimalPart.substr(0, decimalPlaces)}`;
    }

    /**
     * Return the 'nearest rounded' value, according to the given step size.
     * @example roundToNearest(264789, 10000)) => 260000
     *
     * @param {number} value
     * @param {number} stepPlace
     * @returns {*}
     */
    static roundToNearest(value, stepPlace = 1000) {
        if (0 === value) {
            return 0;
        }

        if (stepPlace === 0) {
            this.throwError('The `stepPlace` used to round is equal to `0`. This value must not be equal to zero.');
        }

        return Math.round(value / stepPlace) * stepPlace;
    }

    /**
     * Return the 'nearest rounded' value by automatically adding or subtracting the calculated offset to the initial value.
     * This is done without having to pass a step to this function, and based on the size of the given `value`.
     *
     * @example                    Calculated offset
     *           1 ->           1 (1)
     *          14 ->          10 (10)
     *         143 ->         140 (10)
     *       1.278 ->       1.300 (100)
     *      28.456 ->      28.500 (100)
     *     276.345 ->     276.000 (1.000)
     *   4.534.061 ->   4.530.000 (10.000)
     *  66.723.844 ->  66.700.000 (100.000)
     * 257.833.411 -> 258.000.000 (1.000.000)
     *
     *                           Initial   Added   Offset
     * 2 decimalPlacesRawValue : 1.12   -> 2.00   (1)
     * 3 decimalPlacesRawValue : 1.123  -> 2.000  (1)
     *
     * Special case when the `value` to round is between -1 and 1, excluded :
     * @example
     *     Number of             Initial   Result  Calculated
     *     decimal places        value     (add)   offset
     * 2 decimalPlacesRawValue : 0.12   -> 0.13    (0.01) : Math.pow(10, -2)
     * 2 decimalPlacesRawValue : 0.01   -> 0.02    (0.01)
     * 2 decimalPlacesRawValue : 0.00   -> 0.01    (0.01)
     *
     * 3 decimalPlacesRawValue : 0.123  -> 0.133   (0.01)  : Math.pow(10, -2)
     * 3 decimalPlacesRawValue : 0.012  -> 0.013   (0.001) : Math.pow(10, -3)
     * 3 decimalPlacesRawValue : 0.001  -> 0.001   (0.001)
     * 3 decimalPlacesRawValue : 0.000  -> 0.001   (0.001)
     *
     * 4 decimalPlacesRawValue : 0.4123 -> 0.4200  (0.01)   : Math.pow(10, -2)
     * 4 decimalPlacesRawValue : 0.0412 -> 0.0420  (0.001)  : Math.pow(10, -3)
     * 4 decimalPlacesRawValue : 0.0041 -> 0.0042  (0.0001) : Math.pow(10, -4)
     * 4 decimalPlacesRawValue : 0.0004 -> 0.0005  (0.0001)
     * 4 decimalPlacesRawValue : 0.0000 -> 0.0001  (0.0001)
     *
     * @param {number} value
     * @param {boolean} isAddition
     * @param {int} decimalPlacesRawValue The precision needed by the `rawValue`
     * @returns {*}
     */
    static modifyAndRoundToNearestAuto(value, isAddition, decimalPlacesRawValue) {
        value = Number(this.forceDecimalPlaces(value, decimalPlacesRawValue)); // Make sure that '0.13000000001' is converted to the number of rawValue decimal places '0.13'

        const absValue = Math.abs(value);
        if (absValue >= 0 && absValue < 1) {
            const rawValueMinimumOffset = Math.pow(10, -decimalPlacesRawValue);
            if (value === 0) {
                // 4 decimalPlacesRawValue : 0.0000 -> 0.0001 (0.0001)
                return (isAddition)?rawValueMinimumOffset:-rawValueMinimumOffset;
            }

            let offset;
            const minimumOffsetFirstDecimalPlaceIndex = decimalPlacesRawValue;
            // Find where is the first non-zero decimal places
            const indexFirstNonZeroDecimalPlace = this.indexFirstNonZeroDecimalPlace(value);
            if (indexFirstNonZeroDecimalPlace >= minimumOffsetFirstDecimalPlaceIndex - 1) {
                /* 4 decimalPlacesRawValue : 0.0041 -> 0.0042 (0.0001) : Math.pow(10, -4)
                 * 4 decimalPlacesRawValue : 0.0004 -> 0.0005 (0.0001)
                 */
                offset = rawValueMinimumOffset;
            } else {
                offset = Math.pow(10, -(indexFirstNonZeroDecimalPlace + 1));
            }

            let result;
            if (isAddition) {
                result = value + offset;
            } else {
                result = value - offset;
            }

            return this.roundToNearest(result, offset);
        } else {
            // For values >= 1
            value = parseInt(value, 10);
            const lengthValue = Math.abs(value).toString().length; // `Math.abs()` is needed here to omit the negative sign '-' in case of a negative value

            let pow;
            switch (lengthValue) {
                // Special cases for small numbers
                case 1:
                    pow = 0;
                    break;
                case 2:
                case 3:
                    pow = 1;
                    break;
                case 4:
                case 5:
                    pow = 2;
                    break;
                // Default behavior
                default:
                    pow = lengthValue - 3;
            }
            const offset = Math.pow(10, pow);

            let result;
            if (isAddition) {
                result = value + offset;
            } else {
                result = value - offset;
            }

            if (result <= 10 && result >= -10) {
                return result;
            }

            return this.roundToNearest(result, offset);
        }
    }

    /**
     * Return the 'nearest rounded' value automatically by adding the calculated offset to the initial value.
     * This will limit the result to the given number of decimal places `decimalPlacesLimit`.
     *
     * @param {number} value
     * @param {int} decimalPlacesLimit
     * @returns {*}
     */
    static addAndRoundToNearestAuto(value, decimalPlacesLimit) {
        return this.modifyAndRoundToNearestAuto(value, true, decimalPlacesLimit);
    }

    /**
     * Return the 'nearest rounded' value automatically by subtracting the calculated offset to the initial value.
     * This will limit the result to the given number of decimal places `decimalPlacesLimit`.
     *
     * @param {number} value
     * @param {int} decimalPlacesLimit
     * @returns {*}
     */
    static subtractAndRoundToNearestAuto(value, decimalPlacesLimit) {
        return this.modifyAndRoundToNearestAuto(value, false, decimalPlacesLimit);
    }

    /**
     * Take an arabic number as a string and return a javascript number.
     * By default, this function does not try to convert the arabic decimal and thousand separator characters.
     * This returns `NaN` is the conversion is not possible.
     * Based on http://stackoverflow.com/a/17025392/2834898
     *
     * @param {string} arabicNumbers
     * @param {boolean} returnANumber If `true`, return a Number, otherwise return a String
     * @param {boolean} parseDecimalCharacter
     * @param {boolean} parseThousandSeparator
     * @returns {string|number|NaN}
     */
    static arabicToLatinNumbers(arabicNumbers, returnANumber = true, parseDecimalCharacter = false, parseThousandSeparator = false) {
        if (this.isNull(arabicNumbers)) {
            return arabicNumbers;
        }

        let result = arabicNumbers.toString();
        if (result === '') {
            return arabicNumbers;
        }

        if (result.match(/[٠١٢٣٤٥٦٧٨٩۴۵۶]/g) === null) {
            // If no Arabic/Persian numbers are found, return the numeric string or number directly
            if (returnANumber) {
                result = Number(result);
            }

            return result;
        }

        if (parseDecimalCharacter) {
            result = result.replace(/٫/, '.'); // Decimal character
        }

        if (parseThousandSeparator) {
            result = result.replace(/٬/g, ''); // Thousand separator
        }

        // Replace the numbers only
        result = result.replace(/[٠١٢٣٤٥٦٧٨٩]/g, d => d.charCodeAt(0) - 1632) // Arabic numbers
            .replace(/[۰۱۲۳۴۵۶۷۸۹]/g, d => d.charCodeAt(0) - 1776); // Persian numbers

        // `NaN` has precedence over the string `'NaN'`
        const resultAsNumber = Number(result);
        if (isNaN(resultAsNumber)) {
            return resultAsNumber;
        }

        if (returnANumber) {
            result = resultAsNumber;
        }

        return result;
    }

    /**
     * Create a custom event and immediately sent it from the given element.
     * By default, if no element is given, the event is thrown from `document`.
     *
     * @param {string} eventName
     * @param {HTMLElement|HTMLDocument|EventTarget} element
     * @param {object} detail
     * @param {boolean} bubbles Set to `true` if the event must bubble up
     * @param {boolean} cancelable Set to `true` if the event must be cancelable
     */
    static triggerEvent(eventName, element = document, detail = null, bubbles = true, cancelable = true) {
        let event;
        if (window.CustomEvent) {
            event = new CustomEvent(eventName, { detail, bubbles , cancelable }); // This is not supported by default by IE ; We use the polyfill for IE9 and later.
        } else {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent(eventName, bubbles, cancelable, { detail });
        }

        element.dispatchEvent(event);
    }

    /**
     * Function to parse minimumValue, maximumValue & the input value to prepare for testing to determine if the value falls within the min / max range.
     * Return an object example: minimumValue: "999999999999999.99" returns the following "{s: -1, e: 12, c: Array[15]}".
     *
     * This function is adapted from Big.js https://github.com/MikeMcl/big.js/. Many thanks to Mike.
     *
     * @param {number|string} n A numeric value.
     * @returns {{}}
     */
    static parseStr(n) {
        const x = {}; // A Big number instance.
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
        if (this.isNegativeStrict(n, '-')) {
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

        // Length of string if no decimal character
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
     * Function to test if the input value falls with the Min / Max settings.
     * This uses the parsed strings for the above parseStr function.
     *
     * This function is adapted from Big.js https://github.com/MikeMcl/big.js/. Many thanks to Mike.
     *
     * @param {object} y Big number instance
     * @param {object} x Big number instance
     * @returns {*}
     */
    static testMinMax(y, x) {
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
     * Generate a random string.
     * cf. http://stackoverflow.com/a/8084248/2834898
     *
     * @param {Number} strLength Length of the generated string (in character count)
     * @returns {string}
     */
    static randomString(strLength = 5) {
        return Math.random()
            .toString(36)
            .substr(2, strLength);
    }

    /**
     * Return the DOM element when passed either a DOM element or a selector string.
     *
     * @param {HTMLElement|string} domElementOrSelector
     * @returns {HTMLElement}
     */
    static domElement(domElementOrSelector) {
        let domElement;
        if (AutoNumericHelper.isString(domElementOrSelector)) {
            domElement = document.querySelector(domElementOrSelector);
        } else {
            domElement = domElementOrSelector;
        }

        return domElement;
    }

    /**
     * Retrieve the current element value.
     *
     * @param {HTMLElement|HTMLInputElement|EventTarget} element
     * @returns {number|string|null}
     */
    static getElementValue(element) {
        if (element.tagName.toLowerCase() === 'input') {
            return element.value;
        }

        return this.text(element);
    }

    /**
     * Modify the element value directly.
     *
     * @param {HTMLElement|HTMLInputElement} element
     * @param {number|string|null} value
     */
    static setElementValue(element, value = null) {
        if (element.tagName.toLowerCase() === 'input') {
            element.value = value;
        } else {
            element.textContent = value;
        }
    }

    /**
     * Set the invalid state for the given element.
     * A custom message can be passed as the second argument.
     * Note: This does not work with contenteditable elements
     *
     * @param {HTMLElement|HTMLInputElement} element
     * @param {string|null} message
     * @throws Error
     */
    static setInvalidState(element, message = 'Invalid') {
        if (message === '' || this.isNull(message)) this.throwError('Cannot set the invalid state with an empty message.');

        element.setCustomValidity(message);
    }

    /**
     * Set the valid state for the given element.
     * Note: This does not work with contenteditable elements
     *
     * @param {HTMLElement|HTMLInputElement} element
     */
    static setValidState(element) {
        element.setCustomValidity('');
    }

    /**
     * This clone the given object, and return it.
     * WARNING: This does not do a deep cloning.
     * cf. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Examples
     * //TODO Add a `deep` option to clone object with more than one depth
     *
     * @param {object} obj
     * @returns {object}
     */
    static cloneObject(obj) {
        return Object.assign({}, obj);
    }

    /**
     * Return a 'camelized' version of the given string.
     * By default, this assume that :
     * - the separators are hyphens '-',
     * - the 'data-' string should be removed, and
     * - that the very first word should not be capitalized.
     *
     * @example camelize('data-currency-symbol') => 'currencySymbol'
     *
     * @param {string} str Text to camelize
     * @param {string} separator Character that separate each word
     * @param {boolean} removeData If set to `true`, remove the `data-` part that you can find on some html attributes
     * @param {boolean} skipFirstWord If set to `true`, do not capitalize the very first word
     * @returns {string|null}
     */
    static camelize(str, separator = '-', removeData = true, skipFirstWord = true) {
        if (this.isNull(str)) {
            return null;
        }

        if (removeData) {
            str = str.replace(/^data-/, '');
        }

        // Cut the string into words
        const words = str.split(separator);

        // Capitalize each word
        let result = words.map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`);

        // Then concatenate them back
        result = result.join('');

        if (skipFirstWord) {
            // Skip the very first letter
            result = `${result.charAt(0).toLowerCase()}${result.slice(1)}`;
        }

        return result;
    }

    /**
     * Return the text component of the given DOM element.
     *
     * @param {Element} domElement
     * @returns {string}
     */
    static text(domElement) {
        const nodeType = domElement.nodeType;

        let result;
        // cf. https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
        if (nodeType === Node.ELEMENT_NODE ||
            nodeType === Node.DOCUMENT_NODE ||
            nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
            result = domElement.textContent;
        } else if (nodeType === Node.TEXT_NODE) {
            result = domElement.nodeValue;
        } else {
            result = '';
        }

        return result;
    }

    /**
     * Set the text content of the given DOM element.
     * @param {Element} domElement
     * @param {string} text
     */
    static setText(domElement, text) {
        const nodeType = domElement.nodeType;
        if (nodeType === Node.ELEMENT_NODE ||
            nodeType === Node.DOCUMENT_NODE ||
            nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
            domElement.textContent = text;
        }
        //TODO Display a warning if that function does not do anything?
    }

    /**
     * Filter out the given `arr` array with the elements found in `excludedElements`.
     * This returns a new array and does not modify the source.
     * cf. verification here : http://codepen.io/AnotherLinuxUser/pen/XpvrMg?editors=0012
     *
     * @param {Array} arr
     * @param {Array} excludedElements
     * @returns {*|Array.<T>}
     */
    static filterOut(arr, excludedElements) {
        return arr.filter(element => !this.isInArray(element, excludedElements));
    }

    /**
     * Remove the trailing zeros in the decimal part of a number.
     *
     * @param {string} numericString
     * @returns {*}
     */
    static trimPaddedZerosFromDecimalPlaces(numericString) {
        numericString = String(numericString);
        if (numericString === '') {
            return '';
        }

        const [integerPart, decimalPart] = numericString.split('.');
        if (this.isUndefinedOrNullOrEmpty(decimalPart)) {
            return integerPart;
        }

        const trimmedDecimalPart = decimalPart.replace(/0+$/g, '');

        let result;
        if (trimmedDecimalPart === '') {
            result = integerPart;
        } else {
            result = `${integerPart}.${trimmedDecimalPart}`;
        }

        return result;
    }

    /**
     * Return the top-most hovered item by the mouse cursor.
     *
     * @returns {*}
     */
    static getHoveredElement() {
        const hoveredElements = [...document.querySelectorAll(':hover')];
        return hoveredElements[hoveredElements.length - 1];
    }

    /**
     * Return the given array trimmed to the given length.
     * @example arrayTrim([1, 2, 3, 4], 2) -> [1, 2]
     *
     * @param {Array} array
     * @param {Number} length
     * @returns {*}
     */
    static arrayTrim(array, length) {
        const arrLength = array.length;
        if (arrLength === 0 || length > arrLength) {
            // Also manage the case where `length` is higher than the current length
            return array;
        }

        if (length < 0) {
            return [];
        }

        array.length = parseInt(length, 10);

        return array;
    }

    /**
     * Merge all the given arrays by keeping only unique elements, and return an array with de-duplicated values.
     * cf. http://stackoverflow.com/a/27664971/2834898
     *
     * @param {...array} arrays
     * @returns {[*]}
     */
    static arrayUnique(...arrays) { //FIXME à tester
        return [...new Set([].concat(...arrays))];
    }

    /**
     * Merge all the given Maps by keeping only unique elements, and return a new Map with de-duplicated keys.
     *
     * @param {...Map} mapObjects
     * @returns {Map}
     */
    static mergeMaps(...mapObjects) {
        return new Map(mapObjects.reduce((as, b) => as.concat([...b]), []));
    }

    /**
     * Search the given `value` in the object `obj`, and return the very first key it finds
     *
     * @param {object} obj
     * @param {string|number} value
     * @returns {*|null}
     */
    static objectKeyLookup(obj, value) {
        const result = Object.entries(obj).find(array => array[1] === value);
        let key = null;
        if (result !== void(0)) {
            key = result[0];
        }

        return key;
    }

    /**
     * Insert the single character `char` in the string `str` at the given position `index`
     *
     * @param {string} str
     * @param {string} char
     * @param {int} index
     * @returns {string}
     */
    static insertAt(str, char, index) {
        str = String(str);

        if (index > str.length) {
            throw new Error(`The given index is out of the string range.`);
        }

        if (char.length !== 1) {
            throw new Error('The given string `char` should be only one character long.');
        }

        if (str === '' && index === 0) {
            return char;
        }

        return `${str.slice(0, index)}${char}${str.slice(index)}`;
    }

    /**
     * Convert the given scientific notation to the 'expanded' decimal notation
     *
     * @example scientificToDecimal('-123.4567e-6') returns '-0.0001234567'
     *
     * @param {number|string} val
     * @returns {number|string}
     */
    static scientificToDecimal(val) {
        // Check that the val is a Number
        const numericValue = Number(val);
        if (isNaN(numericValue)) {
            return NaN;
        }

        // Check if the number is in a scientific notation
        val                = String(val);
        const isScientific = this.contains(val, 'e') || this.contains(val, 'E');

        if (!isScientific) {
            return val;
        }

        // Convert the scientific notation to a numeric string
        let [value, exponent] = val.split(/e/i);
        const isNegative = value < 0;
        if (isNegative) {
            value = value.replace('-', '');
        }

        const isNegativeExponent = +exponent < 0;
        if (isNegativeExponent) {
            exponent = exponent.replace('-', ''); // Remove the negative sign
        }

        const [int, float] = value.split(/\./);

        let result;
        if (isNegativeExponent) {
            if (int.length > exponent) {
                // Place the decimal point at the int length count minus exponent
                result = this.insertAt(int, '.', int.length - exponent);
            } else {
                // If that decimal point is greater than the int length, pad with zeros (ie. Number('-123.4567e-6') --> -0.0001234567)
                result = `0.${'0'.repeat(exponent - int.length)}${int}`;
            }

            result = `${result}${float?float:''}`;
        } else { // Positive exponent
            if (float) {
                value = `${int}${float}`; // Remove the '.', if any
                if (exponent < float.length) {
                    result = this.insertAt(value, '.', +exponent + int.length);
                } else {
                    result = `${value}${'0'.repeat(exponent - float.length)}`;
                }
            } else {
                value = value.replace('.', ''); // Single case where val is '1.e4'
                result = `${value}${'0'.repeat(Number(exponent))}`;
            }
        }

        if (isNegative) {
            // Put back the negative sign, if any
            result = `-${result}`;
        }

        return result;
    }
}
