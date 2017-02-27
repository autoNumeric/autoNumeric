/**
 * Helper functions for autoNumeric.js
 * @author Alexandre Bonneau <alexandre.bonneau@linuxfr.eu>
 * @copyright © 2016 Alexandre Bonneau
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
            if (obj.hasOwnProperty(prop)) {
                return false;
            }
        }
        return true;
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
        return obj instanceof Element;
    }

    /**
     * Return `true` in the given DOM element is an <input>.
     *
     * @param {HTMLElement|HTMLInputElement} domElement
     * @returns {boolean}
     * @private
     */
    static isInputElement(domElement) { //FIXME à terminer
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
     * Return the code for the key used to generate the given event.
     *
     * @param {Event} event
     * @returns {string|Number}
     */
    static keyCodeNumber(event) {
        // `event.keyCode` and `event.which` are deprecated, `KeyboardEvent.key` (https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) must be used now
        return (typeof event.which === 'undefined')?event.keyCode:event.which;
    }

    /**
     * Return the character from the event key code.
     * @example character(50) => '2'
     *
     * @param {KeyboardEvent} event
     * @returns {string}
     */
    static character(event) {
        if (typeof event.key === 'undefined' || event.key === 'Unidentified') {
            return String.fromCharCode(this.keyCodeNumber(event));
        } else {
            // Special case for obsolete browsers like IE that return the old names
            let result;
            switch (event.key) {
                case 'Decimal':
                    result = AutoNumericEnum.keyName.NumpadDot;
                    break;
                case 'Multiply':
                    result = AutoNumericEnum.keyName.NumpadMultiply;
                    break;
                case 'Add':
                    result = AutoNumericEnum.keyName.NumpadPlus;
                    break;
                case 'Subtract':
                    result = AutoNumericEnum.keyName.NumpadMinus;
                    break;
                case 'Divide':
                    result = AutoNumericEnum.keyName.NumpadSlash;
                    break;
                default:
                    result = event.key;
            }

            return result;
        }
    }

    /**
     * Return `true` if the given string contains a negative sign :
     * - everywhere in the string (by default), or
     * - on the first character only if the `checkEverywhere` parameter is set to `false`.
     *
     * @param {string} numericString A number represented by a string
     * @param {boolean} checkEverywhere If TRUE, then the negative sign is search everywhere in the numeric string (this is needed for instance if the string is '1234.56-')
     * @returns {boolean}
     */
    static isNegative(numericString, checkEverywhere = true) {
        //TODO Use the `negativeSignCharacter` from the settings here
        if (checkEverywhere) {
            return this.contains(numericString, '-');
        }

        return this.isNegativeStrict(numericString);
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
     * @returns {boolean}
     */
    static isNegativeStrict(numericString) {
        //TODO Using the `negativeSignCharacter` from the settings here
        return numericString.charAt(0) === '-';
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
     *
     * @param {string} value
     * @returns {*}
     */
    static setRawNegativeSign(value) {
        if (!this.isNegativeStrict(value)) {
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
     * Cross browser routine for getting selected range/cursor position
     *
     * @param {HTMLInputElement|EventTarget} element
     * @returns {{}}
     */
    static getElementSelection(element) {
        const position = {};
        if (this.isUndefined(element.selectionStart)) {
            element.focus();
            const select = document.selection.createRange();
            position.length = select.text.length;
            select.moveStart('character', -element.value.length);
            position.end = select.text.length;
            position.start = position.end - position.length;
        } else {
            position.start = element.selectionStart;
            position.end = element.selectionEnd;
            position.length = position.end - position.start;
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
        //TODO Replace this with the official `setSelectionRange()` (cf. https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setSelectionRange)
        if (this.isUndefinedOrNullOrEmpty(end)) {
            end = start;
        }

        if (this.isUndefined(element.selectionStart)) {
            element.focus();
            const range = element.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        } else {
            element.selectionStart = start;
            element.selectionEnd = end;
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
     * Return `true` if the given event is a wheelup event
     *
     * @param {WheelEvent} wheelEvent
     * @returns {boolean}
     */
    static isWheelUpEvent(wheelEvent) {
        if (!wheelEvent.deltaY) {
            this.throwError(`The event passed as a parameter is not a wheel event, ${wheelEvent.type} given.`);
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
        if (!wheelEvent.deltaY) {
            this.throwError(`The event passed as a parameter is not a wheel event, ${wheelEvent.type} given.`);
        }

        return wheelEvent.deltaY > 0;
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
        if (value <= 10 && value >= -10) {
            return value;
        }

        if (0 === value) {
            return 0;
        }

        return Math.round(value / stepPlace) * stepPlace;
    }

    /**
     * Return the 'nearest rounded' value automatically by adding or subtracting the calculated offset to the initial value.
     * This is done without having to pass a step to this function.
     * @example                    Calculated offset
     *           1 ->           1 (10)
     *          14 ->          10 (10)
     *         143 ->         140 (10)
     *       1.278 ->       1.300 (100)
     *      28.456 ->      28.500 (100)
     *     276.345 ->     276.000 (1000)
     *   4.534.061 ->   4.530.000 (10000)
     *  66.723.844 ->  66.700.000 (100000)
     * 257.833.411 -> 258.000.000 (1000000)
     *
     * @param {number} value
     * @param {boolean} isAddition
     * @returns {*}
     */
    static modifyAndRoundToNearestAuto(value, isAddition) {
        value = parseInt(value, 10);
        const lengthValue = Math.abs(value).toString().length; // Math.abs is needed here to omit the negative sign '-' in case of a negative value

        let pow;
        switch (lengthValue) {
            // Special cases for small numbers
            case 1:
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

        return this.roundToNearest(result, Math.pow(10, pow));
    }

    /**
     * Return the 'nearest rounded' value automatically by adding the calculated offset to the initial value.
     *
     * @param {number} value
     * @returns {*}
     */
    static addAndRoundToNearestAuto(value) {
        return this.modifyAndRoundToNearestAuto(value, true);
    }

    /**
     * Return the 'nearest rounded' value automatically by subtracting the calculated offset to the initial value.
     *
     * @param {number} value
     * @returns {*}
     */
    static subtractAndRoundToNearestAuto(value) {
        return this.modifyAndRoundToNearestAuto(value, false);
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
     * @param {HTMLElement|HTMLDocument} element
     * @param {object} detail
     */
    static triggerEvent(eventName, element = document, detail = null) {
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
        if (this.isNegativeStrict(n)) {
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
     * Retrieve the current element value.
     *
     * @param {HTMLElement|HTMLInputElement|EventTarget} element
     * @returns {number|string|null}
     */
    static getElementValue(element) {
        if (element.tagName.toLowerCase() === 'input') {
            return element.value;
        }

        // if (typeof element.textContent !== 'undefined') {
        return element.textContent;
        // }
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
}
