/**
* autoNumeric.js
* @author: Bob Knothe
* @contributors: Sokolov Yura and other Github users
* @version: 2.0 - 2016-11-16 UTC-10 23:00
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
(function(factory) {
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
     * Return TRUE if the given parameter is as String
     *
     * @param {*} str
     * @returns {boolean}
     */
    function isString(str) {
        return (typeof str === 'string' || str instanceof String);
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
     * Return TRUE is the `needle` is in the array.
     *
     * @param {Array} array
     * @param {*} needle
     * @returns {boolean}
     */
    function isInArray(needle, array) {
        if (!isArray(array) || array === [] || isUndefined(needle) || needle === '' || needle === null) {
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
     * Function to handle errors messages
     */
    function throwError(message, debug) {
        if (debug) {
            throw new Error(message);
        }
    }

    /**
     * run callbacks in parameters if any
     * any parameter could be a callback:
     * - a function, which invoked with jQuery element, parameters and this parameter name and returns parameter value
     * - a name of function, attached to $(selector).autoNumeric.functionName(){} - which was called previously
     */
    function runCallbacks($this, settings) {
        // loops through the settings object (option array) to find the following
        $.each(settings, (k, val) => {
            if (typeof val === 'function') {
                settings[k] = val($this, settings, k);
            } else if (typeof $this.autoNumeric[val] === 'function') {
                // calls the attached function from the html5 data example: data-a-sign="functionName"
                settings[k] = $this.autoNumeric[val]($this, settings, k);
            }
        });
    }

    /**
     * Determine the decimal length from the vMin vMax settings
     */
    function decLength(vMin, vMax) {
        let vMaxLength = 0;
        let vMinLength = 0;
        if (vMax[1]) {
            vMaxLength = vMax[1].length;
        }
        if (vMin[1]) {
            vMinLength = vMin[1].length;
        }

        return Math.max(vMaxLength, vMinLength);
    }

    /**
     * Preparing user defined options for further usage
     * merge them with defaults appropriately
     */
    function autoCode($this, settings) {
        runCallbacks($this, settings);
        const vMax = settings.vMax.toString().split('.');
        const vMin = (!settings.vMin && settings.vMin !== 0) ? [] : settings.vMin.toString().split('.');
        settings.aNeg = settings.vMin < 0 ? '-' : '';
        vMax[0] = vMax[0].replace('-', '');
        vMin[0] = vMin[0].replace('-', '');
        settings.mIntPos = Math.max(vMax[0].length, 1);
        settings.mIntNeg = Math.max(vMin[0].length, 1);
        if (settings.mDec === null) {
            settings.mDec = decLength(vMin, vMax);
            settings.oDec = settings.mDec;
        } else {
            settings.mDec = Number(settings.mDec);
        }
        if (settings.scaleDecimal) {
            settings.mDec = settings.scaleDecimal;
        }

        // set alternative decimal separator key
        if (settings.altDec === null && settings.mDec > 0) {
            if (settings.aDec === '.' && settings.aSep !== ',') {
                settings.altDec = ',';
            } else if (settings.aDec === ',' && settings.aSep !== '.') {
                settings.altDec = '.';
            }
        }

        // cache regexps for autoStrip
        const aNegReg = settings.aNeg ?`([-\\${settings.aNeg}]?)` :'(-?)';
        settings.aNegRegAutoStrip = aNegReg;
        settings.skipFirstAutoStrip = new RegExp(`${aNegReg}[^-${(settings.aNeg?`\\${settings.aNeg}`:'')}\\${settings.aDec}\\d].*?(\\d|\\${settings.aDec}\\d)`);
        settings.skipLastAutoStrip = new RegExp(`(\\d\\${settings.aDec}?)[^\\${settings.aDec}\\d]\\D*$`);
        const allowed = `-0123456789\\${settings.aDec}`;
        settings.allowedAutoStrip = new RegExp(`[^${allowed}]`, 'gi');
        settings.numRegAutoStrip = new RegExp(`${aNegReg}(?:\\${settings.aDec}?(\\d+\\${settings.aDec}\\d+)|(\\d*(?:\\${settings.aDec}\\d*)?))`);

        return settings;
    }

    /**
     * strip all unwanted characters and leave only a number alert
     */
    function autoStrip(s, settings) {
        if (settings.aSign !== '') {
            // remove currency sign
            s = s.replace(settings.aSign, '');
        }
        if (settings.aSuffix) {
            // remove suffix
            while (contains(s, settings.aSuffix)) {
                s = s.replace(settings.aSuffix, '');
            }
        }

        // first replace anything before digits
        s = s.replace(settings.skipFirstAutoStrip, '$1$2');

        if ((settings.pNeg === 's' || (settings.pSign === 's' && settings.pNeg !== 'p')) && contains(s, '-') && s !== '') {
            settings.trailingNegative = true;
        }

        // then replace anything after digits
        s = s.replace(settings.skipLastAutoStrip, '$1');

        // then remove any uninterested characters
        s = s.replace(settings.allowedAutoStrip, '');
        if (settings.altDec) {
            s = s.replace(settings.altDec, settings.aDec);
        }

        // get only number string
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

            // strip leading zero on positive value if need
            if (nSign === '' && modifiedIntegerPart.length > settings.mIntPos && modifiedIntegerPart.charAt(0) === '0') {
                modifiedIntegerPart = modifiedIntegerPart.slice(1);
            }

            // strip leading zero on negative value if need
            if (nSign !== '' && modifiedIntegerPart.length > settings.mIntNeg && modifiedIntegerPart.charAt(0) === '0') {
                modifiedIntegerPart = modifiedIntegerPart.slice(1);
            }
            s = `${nSign}${modifiedIntegerPart}${isUndefined(decimalPart)?'':settings.aDec + decimalPart}`;
        }
        if ((settings.onOff && settings.lZero === 'deny') || (settings.lZero === 'allow' && settings.onOff === false)) {
            // Using this regex version `^${settings.aNegRegAutoStrip}0*(\\d|$)` entirely clear the input on blur
            let stripReg = `^${settings.aNegRegAutoStrip}0*(\\d)`;
            stripReg = new RegExp(stripReg);
            s = s.replace(stripReg, '$1$2');
        }

        return s;
    }

    /**
     * places or removes brackets on negative values
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
     * converts the ISO numeric string to the locale decimal and minus sign placement
     * see "localeOutput" option for determine
     * null => nnnn.nn or -nnnn.nn default
     * ","  => nnnn,nn or -nnnn,nn can als be "-,"
     * ".-" => nnnn.nn or nnnn.nn-
     * ",-" => nnnn,nn or nnnn,nn-
     */
    function toLocale(value, locale) {
        if (locale === '.-') {
            value = contains(value, '-') ? value.replace('-', '') + '-' : value;
        }
        if (locale === ',' || locale === '-,') {
            value = value.replace('.', ',');
        }
        if (locale === ',-') {
            value = value.replace('.', ',');
            value = contains(value, '-') ? value.replace('-', '') + '-' : value;
        }

        return value;
    }

    /**
     * prepare number string to be converted to real number
     */
    function fixNumber(s, aDec, aNeg) {
        if (aDec && aDec !== '.') {
            s = s.replace(aDec, '.');
        }
        if (aNeg && aNeg !== '-') {
            s = s.replace(aNeg, '-');
        }
        if (!s.match(/\d/)) {
            s += '0';
        }

        return s;
    }

    /**
     * prepare real number to be converted to our format
     */
    function presentNumber(s, settings) {
        if (settings.aNeg && settings.aNeg !== '-') {
            s = s.replace('-', settings.aNeg);
        }
        if (settings.aDec && settings.aDec !== '.') {
            s = s.replace('.', settings.aDec);
        }

        return s;
    }

    /**
     * private function to check for empty value
     */
    function checkEmpty(iv, settings, signOnEmpty) {
        if (iv === '' || iv === settings.aNeg) {
            if (settings.wEmpty === 'always' || signOnEmpty) {
                return (settings.pNeg === 'l') ? iv + settings.aSign + settings.aSuffix : settings.aSign + iv + settings.aSuffix;
            }
            return iv;
        }

        return null;
    }

    /**
     * private function that formats our number
     */
    function autoGroup(iv, settings) {
        if (settings.strip) {
            iv = autoStrip(iv, settings);
        }
        if (settings.trailingNegative && !contains(iv, '-')) {
            iv = '-' + iv;
        }
        const empty = checkEmpty(iv, settings, true);
        const isNeg = contains(iv, '-');
        if (isNeg) {
            iv = iv.replace('-', '');
        }
        if (empty !== null) {
            return empty;
        }
        let digitalGroup = '';
        settings.dGroup = settings.dGroup.toString();
        if (settings.dGroup === '2') {
            digitalGroup = /(\d)((\d)(\d{2}?)+)$/;
        } else if (settings.dGroup === '2s') {
            digitalGroup = /(\d)((?:\d{2}){0,2}\d{3}(?:(?:\d{2}){2}\d{3})*?)$/;
        } else if (settings.dGroup === '4') {
            digitalGroup = /(\d)((\d{4}?)+)$/;
        } else {
            digitalGroup = /(\d)((\d{3}?)+)$/;
        }

        // splits the string at the decimal string
        let [integerPart, decimalPart] = iv.split(settings.aDec);
        if (settings.altDec && isUndefined(decimalPart)) {
            [integerPart, decimalPart] = iv.split(settings.altDec);
        }
        if (settings.aSep !== '') {
            // re-inserts the thousand separator via a regular expression
            while (digitalGroup.test(integerPart)) {
                integerPart = integerPart.replace(digitalGroup, `$1${settings.aSep}$2`);
            }
        }
        if (settings.mDec !== 0 && !isUndefined(decimalPart)) {
            if (decimalPart.length > settings.mDec) {
                decimalPart = decimalPart.substring(0, settings.mDec);
            }

            // joins the whole number with the decimal value
            iv = integerPart + settings.aDec + decimalPart;
        } else {
            // if whole numbers only
            iv = integerPart;
        }
        if (settings.pSign === 'p') {
            if (isNeg && settings.pNeg === 'l') {
                iv = settings.aNeg + settings.aSign + iv;
            }
            if (isNeg && settings.pNeg === 'r') {
                iv = settings.aSign + settings.aNeg + iv;
            }
            if (isNeg && settings.pNeg === 's') {
                iv = settings.aSign + iv + settings.aNeg;
            }
            if (!isNeg) {
                iv = settings.aSign + iv;
            }
        }
        if (settings.pSign === 's') {
            if (isNeg && settings.pNeg === 'r') {
                iv = iv + settings.aSign + settings.aNeg;
            }
            if (isNeg && settings.pNeg === 'l') {
                iv = iv + settings.aNeg + settings.aSign;
            }
            if (isNeg && settings.pNeg === 'p') {
                iv = settings.aNeg + iv + settings.aSign;
            }
            if (!isNeg) {
                iv = iv + settings.aSign;
            }
        }

        // removes the negative sign and places brackets
        if (settings.nBracket !== null && (settings.rawValue < 0 || iv.charAt(0) === '-')) {
            iv = negativeBracket(iv, settings);
        }
        settings.trailingNegative = false;

        return iv + settings.aSuffix;
    }

    /**
     * Truncate not needed zeros
     */
    function truncateZeros(ivRounded, rDec) {
        let regex;
        switch (rDec) {
            case 0:
                regex = /(\.(?:\d*[1-9])?)0*$/;
                break;
            case 1:
                regex = /(\.\d(?:\d*[1-9])?)0*$/;
                break;
            default :
                regex = new RegExp(`(\\.\\d{${rDec}}(?:\\d*[1-9])?)0*`);
        }

        // If there are no decimal places, we don't need a decimal point at the end
        ivRounded = ivRounded.replace(regex, '$1');
        if (rDec === 0) {
            ivRounded = ivRounded.replace(/\.$/, '');
        }

        return ivRounded;
    }

    /**
     * round number after setting by pasting or $().autoNumericSet()
     * private function for round the number
     * please note this handled as text - JavaScript math function can return inaccurate values
     * also this offers multiple rounding methods that are not easily accomplished in JavaScript
     */
    function autoRound(iv, settings) { // value to string
        iv = (iv === '') ? '0' : iv.toString();
        if (settings.mRound === 'N05' || settings.mRound === 'CHF' || settings.mRound === 'U05' || settings.mRound === 'D05') {
            switch (settings.mRound) {
                case 'N05':
                    iv = (Math.round(iv * 20) / 20).toString();
                    break;
                case 'U05':
                    iv = (Math.ceil(iv * 20) / 20).toString();
                    break;
                default :
                    iv = (Math.floor(iv * 20) / 20).toString();
            }

            let result;
            if (!contains(iv, '.')) {
                result = iv + '.00';
            } else if (iv.length - iv.indexOf('.') < 3) {
                result = iv + '0';
            } else {
                result = iv;
            }
            return result;
        }

        let ivRounded = '';
        let i = 0;
        let nSign = '';
        let rDec;

        if (typeof(settings.aPad) === 'boolean' || settings.aPad === null) {
            rDec = settings.aPad?settings.mDec:0;
        } else {
            rDec = Number(settings.aPad);
        }

        // Checks if the iv (input Value)is a negative value
        if (iv.charAt(0) === '-') {
            nSign = '-';

            // removes the negative sign will be added back later if required
            iv = iv.replace('-', '');
        }

        // append a zero if first character is not a digit (then it is likely to be a dot
        if (!iv.match(/^\d/)) {
            iv = '0' + iv;
        }

        // determines if the value is zero - if zero no negative sign
        if (nSign === '-' && Number(iv) === 0) {
            nSign = '';
        }

        // trims leading zero's needed
        if ((Number(iv) > 0 && settings.lZero !== 'keep') || (iv.length > 0 && settings.lZero === 'allow')) {
            iv = iv.replace(/^0*(\d)/, '$1');
        }

        const dPos = iv.lastIndexOf('.');

        // virtual decimal position
        const vdPos = (dPos === -1) ? iv.length - 1 : dPos;

        // checks decimal places to determine if rounding is required :
        // check if no rounding is required
        let cDec = (iv.length - 1) - vdPos;
        if (cDec <= settings.mDec) {
            // check if we need to pad with zeros
            ivRounded = iv;
            if (cDec < rDec) {
                if (dPos === -1) {
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

        // rounded length of the string after rounding
        const rLength = dPos + settings.mDec; //TODO Modify `dPos` here if it's not intended that it can be equal to '-1'
        const tRound = Number(iv.charAt(rLength + 1));
        const odd = (iv.charAt(rLength) === '.') ? (iv.charAt(rLength - 1) % 2) : (iv.charAt(rLength) % 2);
        let ivArray = iv.substring(0, rLength + 1).split('');
        if ((tRound > 4 && settings.mRound === 's')                  || // Round half up symmetric
            (tRound > 4 && settings.mRound === 'A' && nSign === '')  || // Round half up asymmetric positive values
            (tRound > 5 && settings.mRound === 'A' && nSign === '-') || // Round half up asymmetric negative values
            (tRound > 5 && settings.mRound === 's')                  || // Round half down symmetric
            (tRound > 5 && settings.mRound === 'A' && nSign === '')  || // Round half down asymmetric positive values
            (tRound > 4 && settings.mRound === 'A' && nSign === '-') || // Round half down asymmetric negative values
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

        // return rounded value
        ivRounded = truncateZeros(ivArray.join(''), rDec);

        return (Number(ivRounded) === 0) ? ivRounded : nSign + ivRounded;
    }

    /**
     * truncates the decimal part of a number
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
     * checking that number satisfy format conditions
     * and lays between settings.vMin and settings.vMax
     * and the string length does not exceed the digits in settings.vMin and settings.vMax
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
        if (typeof obj === 'string' || obj instanceof String) {
            obj = obj.replace(/\[/g, '\\[').replace(/]/g, '\\]');
            obj = '#' + obj.replace(/(:|\.)/g, '\\$1');
            // obj = '#' + obj.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1'); // possible modification to replace the above 2 lines
        }

        return $(obj);
    }

    /**
     * function to attach data to the element
     * and imitate the holder
     */
    function getHolder($that, settings, update) {
        let data = $that.data('autoNumeric');
        if (!data) {
            data = {};
            $that.data('autoNumeric', data);
        }
        let holder = data.holder;
        if ((isUndefined(holder) && settings) || update) {
            holder = new AutoNumericHolder($that.get(0), settings);
            data.holder = holder;
        }

        return holder;
    }

    /**
     * original settings saved for use when eDec & nSep options are being used
     */
    function originalSettings(settings) {
        settings.oDec     = settings.mDec;
        settings.oPad     = settings.aPad;
        settings.oBracket = settings.nBracket;
        settings.oSep     = settings.aSep;
        settings.oSign    = settings.aSign;

        return settings;
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
    function autoSave($this, settings, toDo) {
        if (settings.aStor) {
            const storedName = ($this[0].name !== '' && !isUndefined($this[0].name)) ?`AUTO_${decodeURIComponent($this[0].name)}` :`AUTO_${$this[0].id}`;
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
    function AutoNumericHolder(that, settings) {
        this.settings = settings;
        this.that = that;
        this.$that = $(that);
        this.formatted = false;
        this.settingsClone = autoCode(this.$that, this.settings);
        this.value = that.value;
    }

    AutoNumericHolder.prototype = {
        init(e) {
            this.value = this.that.value;
            this.settingsClone = autoCode(this.$that, this.settings);
            this.ctrlKey = e.ctrlKey;
            this.cmdKey = e.metaKey;
            this.shiftKey = e.shiftKey;

            // keypress event overwrites meaningful value of e.keyCode
            this.selection = getElementSelection(this.that);
            if (e.type === 'keydown' || e.type === 'keyup') {
                this.kdCode = e.keyCode;
            }
            this.which = e.which;
            this.processed = false;
            this.formatted = false;
        },

        setSelection(start, end, setReal) {
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
        },

        setPosition(pos, setReal) {
            this.setSelection(pos, pos, setReal);
        },

        getBeforeAfter() {
            const value = this.value;
            const left = value.substring(0, this.selection.start);
            const right = value.substring(this.selection.end, value.length);

            return [left, right];
        },

        getBeforeAfterStriped() {
            const settingsClone = this.settingsClone;
            let [left, right] = this.getBeforeAfter();
            left = autoStrip(left, this.settingsClone);
            right = autoStrip(right, this.settingsClone);
            if (settingsClone.trailingNegative && !contains(left, '-')) {
                left = '-' + left;
                right = (right === '-') ? '' : right;
            }
            settingsClone.trailingNegative = false;

            return [left, right];
        },

        /**
         * strip parts from excess characters and leading zeroes
         */
        normalizeParts(left, right) {
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
        },

        /**
         * set part of number to value keeping position of cursor
         */
        setValueParts(left, right, advent) {
            const settingsClone = this.settingsClone;
            const parts = this.normalizeParts(left, right);
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
                this.value = this.newValue;
                this.setPosition(position, false);
                return true;
            }
            if (!minTest) {
                this.$that.trigger('autoNumeric:minExceeded');
            } else if (!maxTest) {
                this.$that.trigger('autoNumeric:maxExceeded');
            }

            return false;
        },

        /**
         * helper function for expandSelectionOnSign
         * returns sign position of a formatted value
         */
        signPosition() {
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
        },

        /**
         * expands selection to cover whole sign
         * prevents partial deletion/copying/overwriting of a sign
         */
        expandSelectionOnSign(setReal) {
            const signPosition = this.signPosition();
            const selection = this.selection;

            // if selection catches something except sign and catches only space from sign
            if (selection.start < signPosition[1] && selection.end > signPosition[0]) {
                // then select without empty space
                if ((selection.start < signPosition[0] || selection.end > signPosition[1]) && this.value.substring(Math.max(selection.start, signPosition[0]), Math.min(selection.end, signPosition[1])).match(/^\s*$/)) {
                    if (selection.start < signPosition[0]) {
                        this.setSelection(selection.start, signPosition[0], setReal);
                    } else {
                        this.setSelection(signPosition[1], selection.end, setReal);
                    }
                } else {
                    // else select with whole sign
                    this.setSelection(Math.min(selection.start, signPosition[0]), Math.max(selection.end, signPosition[1]), setReal);
                }
            }
        },

        /**
         * try to strip pasted value to digits
         */
        checkPaste() {
            if (!isUndefined(this.valuePartsBeforePaste)) {
                const oldParts = this.valuePartsBeforePaste;
                const [left, right] = this.getBeforeAfter();

                // try to strip pasted value first
                delete this.valuePartsBeforePaste;
                const modifiedLeftPart = left.substr(0, oldParts[0].length) + autoStrip(left.substr(oldParts[0].length), this.settingsClone);
                if (!this.setValueParts(modifiedLeftPart, right, 'paste')) {
                    this.value = oldParts.join('');
                    this.setPosition(oldParts[0].length, false);
                }
            }
        },

        /**
         * process pasting, cursor moving and skipping of not interesting keys
         * if returns true, further processing is not performed
         */
        skipAlways(e) {
            const kdCode = this.kdCode;
            const which = this.which;
            const ctrlKey = this.ctrlKey;
            const cmdKey = this.cmdKey;

            // catch the ctrl up on ctrl-v
            const shiftKey = this.shiftKey;
            if (((ctrlKey || cmdKey) && e.type === 'keyup' && !isUndefined(this.valuePartsBeforePaste)) || (shiftKey && kdCode === keyCode.Insert)) {
                this.checkPaste();
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
                    this.expandSelectionOnSign();
                }

                // try to prevent wrong paste
                if (kdCode === keyCode.v || kdCode === keyCode.Insert) {
                    if (e.type === 'keydown' || e.type === 'keypress') {
                        if (isUndefined(this.valuePartsBeforePaste)) {
                            this.valuePartsBeforePaste = this.getBeforeAfter();
                        }
                    } else {
                        this.checkPaste();
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
                        this.setPosition(startJump - 1);
                    } else if (kdCode === keyCode.RightArrow && (value.charAt(startJump + 1) === aSep || value.charAt(startJump + 1) === aDec)) {
                        this.setPosition(startJump + 1);
                    }
                }
                return true;
            }

            return kdCode >= keyCode.PageDown && kdCode <= keyCode.DownArrow;
        },

        /**
         * process deletion of characters when the minus sign is to the right of the numeric characters
         */
        processTrailing([left, right]) {
            const settingsClone = this.settingsClone;
            if (settingsClone.pSign === 'p' && settingsClone.pNeg === 's') {
                if (this.kdCode === 8) {
                    settingsClone.caretFix = Boolean(this.selection.start >= this.value.indexOf(settingsClone.aSuffix) && settingsClone.aSuffix !== '');
                    if (this.value.charAt(this.selection.start - 1) === '-') {
                        left = left.substring(1);
                    } else if (this.selection.start <= this.value.length - settingsClone.aSuffix.length) {
                        left = left.substring(0, left.length - 1);
                    }
                } else {
                    settingsClone.caretFix = Boolean(this.selection.start >= this.value.indexOf(settingsClone.aSuffix) && settingsClone.aSuffix !== '');
                    if (this.selection.start >= this.value.indexOf(settingsClone.aSign) + settingsClone.aSign.length) {
                        right = right.substring(1, right.length);
                    }
                    if (contains(left, '-') && this.value.charAt(this.selection.start) === '-') {
                        left = left.substring(1);
                    }
                }
            }

            if (settingsClone.pSign === 's' && settingsClone.pNeg === 'l') {
                settingsClone.caretFix = Boolean(this.selection.start >= this.value.indexOf(settingsClone.aNeg) + settingsClone.aNeg.length);
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
                settingsClone.caretFix = Boolean(this.selection.start >= this.value.indexOf(settingsClone.aNeg) + settingsClone.aNeg.length);
                if (this.kdCode === 8) {
                    if (this.selection.start === (this.value.indexOf(settingsClone.aNeg) + settingsClone.aNeg.length)) {
                        left = left.substring(1);
                    } else if (left !== '-' && this.selection.start <= (this.value.indexOf(settingsClone.aNeg) - settingsClone.aSign.length)) {
                        left = left.substring(0, left.length - 1);
                    } else if (left !== '' && !contains(this.value, settingsClone.aNeg)) {
                        left = left.substring(0, left.length - 1);
                    }
                } else {
                    settingsClone.caretFix = Boolean(this.selection.start >= this.value.indexOf(settingsClone.aSign) && settingsClone.aSign !== '');
                    if (this.selection.start === this.value.indexOf(settingsClone.aNeg)) {
                        left = left.substring(1);
                    }
                    right = right.substring(1);
                }
            }

            return [left, right];
        },

        /**
         * process deletion of characters
         * returns true if processing performed
         */
        processAlways() {
            const settingsClone = this.settingsClone;
            if (this.kdCode === keyCode.Backspace || this.kdCode === keyCode.Delete) {
                let left;
                let right;
                if (!this.selection.length) {
                    [left, right] = this.getBeforeAfterStriped();
                    if (left === '' && right === '') {
                        settingsClone.throwInput = false;
                    }
                    if (((settingsClone.pSign === 'p' && settingsClone.pNeg === 's') ||
                            (settingsClone.pSign === 's' && (settingsClone.pNeg === 'l' || settingsClone.pNeg === 'r'))) &&
                            contains(this.value, '-')) {
                        [left, right] = this.processTrailing([left, right]);
                    } else {
                        if (this.kdCode === 8) {
                            left = left.substring(0, left.length - 1);
                        } else {
                            right = right.substring(1, right.length);
                        }
                    }
                    this.setValueParts(left, right);
                } else {
                    this.expandSelectionOnSign(false);
                    [left, right] = this.getBeforeAfterStriped();
                    this.setValueParts(left, right);
                }
                return true;
            }

            return false;
        },

        /**
         * process insertion of characters
         * returns true if processing performed
         */
        processKeypress() {
            const settingsClone = this.settingsClone;
            const cCode = String.fromCharCode(this.which);
            let [left, right] = this.getBeforeAfterStriped();
            settingsClone.throwInput = true;

            // start rules when the decimal character key is pressed always use numeric pad dot to insert decimal separator
            // do not allow decimal character if no decimal part allowed
            if (cCode === settingsClone.aDec || (settingsClone.altDec && cCode === settingsClone.altDec) || ((cCode === '.' || cCode === ',') && this.kdCode === keyCode.DotNumpad)) {
                if (!settingsClone.mDec || !settingsClone.aDec) {
                    return true;
                }

                // do not allow decimal character before aNeg character
                if (settingsClone.aNeg && contains(right, settingsClone.aNeg)) {
                    return true;
                }

                // do not allow decimal character if other decimal character present
                if (contains(left, settingsClone.aDec)) {
                    return true;
                }
                if (right.indexOf(settingsClone.aDec) > 0) {
                    return true;
                }
                if (right.indexOf(settingsClone.aDec) === 0) {
                    right = right.substr(1);
                }
                this.setValueParts(left + settingsClone.aDec, right, null);
                return true;
            }

            // prevent minus if not allowed
            if ((cCode === '-' || cCode === '+') && settingsClone.aNeg === '-') {
                if (!settingsClone) {
                    return true;
                }

                // caret is always after minus
                if ((settingsClone.pSign === 'p' && settingsClone.pNeg === 's') || (settingsClone.pSign === 's' && settingsClone.pNeg !== 'p')) {
                    if (left === '' && contains(right, settingsClone.aNeg)) {
                        left = settingsClone.aNeg;
                        right = right.substring(1, right.length);
                    }

                    // change sign of number, remove part if should
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

                    // change sign of number, remove part if should
                    if (left.charAt(0) === settingsClone.aNeg) {
                        left = left.substring(1, left.length);
                    } else {
                        left = (cCode === '-') ? settingsClone.aNeg + left : left;
                    }
                }
                this.setValueParts(left, right, null);
                return true;
            }

            // if try to insert digit before minus
            if (cCode >= '0' && cCode <= '9') {
                if (settingsClone.aNeg && left === '' && contains(right, settingsClone.aNeg)) {
                    left = settingsClone.aNeg;
                    right = right.substring(1, right.length);
                }
                if (settingsClone.vMax <= 0 && settingsClone.vMin < settingsClone.vMax && !contains(this.value, settingsClone.aNeg) && cCode !== '0') {
                    left = settingsClone.aNeg + left;
                }
                this.setValueParts(left + cCode, right, null);
                return true;
            }

            // prevent any other character
            settingsClone.throwInput = false;

            return true;
        },

        /**
         * formatting of just processed value with keeping of cursor position
         */
        formatQuick(e) {
            const settingsClone = this.settingsClone;
            const leftLength = this.value;
            const kuCode = e.keyCode;
            let [left] = this.getBeforeAfterStriped();

            // no grouping separator and no currency sign
            if ((settingsClone.aSep  === '' || (settingsClone.aSep !== ''  && !contains(leftLength, settingsClone.aSep))) &&
                (settingsClone.aSign === '' || (settingsClone.aSign !== '' && !contains(leftLength, settingsClone.aSign)))) {
                let [subParts] = leftLength.split(settingsClone.aDec);
                let nSign = '';
                if (contains(subParts, '-')) {
                    nSign = '-';
                    subParts = subParts.replace('-', '');
                    left = left.replace('-', '');
                }

                // strip leading zero on positive value if need
                if (nSign === '' && subParts.length > settingsClone.mIntPos && left.charAt(0) === '0') {
                    left = left.slice(1);
                }

                // strip leading zero on negative value if need
                if (nSign === '-' && subParts.length > settingsClone.mIntNeg && left.charAt(0) === '0') {
                    left = left.slice(1);
                }
                left = nSign + left;
            }

            const value = autoGroup(this.value, this.settingsClone);
            let position = value.length;
            if (value) {
                // prepare regexp which searches for cursor position from unformatted left part
                const leftAr = left.split('');

                // fixes caret position with trailing minus sign
                if ((settingsClone.pNeg === 's' || (settingsClone.pSign === 's' && settingsClone.pNeg !== 'p')) && leftAr[0] === '-' && settingsClone.aNeg !== '') {
                    leftAr.shift();
                    if (settingsClone.pSign === 's' && settingsClone.pNeg === 'l' && (kuCode === keyCode.Backspace || this.kdCode === keyCode.Backspace || kuCode === keyCode.Delete || this.kdCode === keyCode.Delete) && settingsClone.caretFix) {
                        leftAr.push('-');
                        settingsClone.caretFix = Boolean(e.type === 'keydown');
                    }
                    if (settingsClone.pSign === 'p' && settingsClone.pNeg === 's' && (kuCode === keyCode.Backspace || this.kdCode === keyCode.Backspace || kuCode === keyCode.Delete || this.kdCode === keyCode.Delete) && settingsClone.caretFix) {
                        leftAr.push('-');
                        settingsClone.caretFix = Boolean(e.type === 'keydown');
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

                        // pushing the escaped sign
                        leftAr.push(escapedParts.join(''));
                        settingsClone.caretFix = Boolean(e.type === 'keydown');
                    }
                }

                for (let i = 0; i < leftAr.length; i++) {
                    if (!leftAr[i].match('\\d')) {
                        leftAr[i] = '\\' + leftAr[i];
                    }
                }

                const leftReg = new RegExp('^.*?' + leftAr.join('.*?'));

                // search cursor position in formatted value
                const newLeft = value.match(leftReg);
                if (newLeft) {
                    position = newLeft[0].length;

                    // if we are just before sign which is in prefix position
                    if (((position === 0 && value.charAt(0) !== settingsClone.aNeg) || (position === 1 && value.charAt(0) === settingsClone.aNeg)) && settingsClone.aSign && settingsClone.pSign === 'p') {
                        // place caret after prefix sign
                        position = this.settingsClone.aSign.length + (value.charAt(0) === '-' ? 1 : 0);
                    }
                } else {
                    if (settingsClone.aSign && settingsClone.pSign === 's') {
                        // if we could not find a place for cursor and have a sign as a suffix
                        // place caret before suffix currency sign
                        position -= settingsClone.aSign.length;
                    }
                    if (settingsClone.aSuffix) {
                        // if we could not find a place for cursor and have a suffix
                        // place caret before suffix
                        position -= settingsClone.aSuffix.length;
                    }
                }
            }
            this.that.value = value;
            this.setPosition(position);
            this.formatted = true;
        },
    };

    /**
     * Methods supported by autoNumeric
     */
    const methods = {
        /**
         * Method to initiate autoNumeric and attached the settings (default and options passed as a parameter
         * $(someSelector).autoNumeric('init');           // initiate autoNumeric with defaults
         * $(someSelector).autoNumeric('init', {option}); // initiate autoNumeric with options
         * $(someSelector).autoNumeric();                 // initiate autoNumeric with defaults
         * $(someSelector).autoNumeric({option});         // initiate autoNumeric with options
         * options passes as a parameter example '{aSep: ".", aDec: ",", aSign: '€ '}
         */
        init(options) {
            return this.each(function() {
                const $this = $(this);

                // attempt to grab HTML5 data, if they don't exist we'll get "undefined"
                const tagData = $this.data();

                // supported input type
                const $input = $this.is('input[type=text], input[type=hidden], input[type=tel], input:not([type])');

                // attempt to grab "autoNumeric" settings, if they don't exist returns "undefined"
                let settings = $this.data('autoNumeric');

                // If we couldn't grab settings, create them from defaults and passed options
                if (typeof settings !== 'object') {
                    settings = $.extend({}, $.fn.autoNumeric.defaults, tagData, options, {
                        onOff: false,
                        runOnce: false,
                        rawValue: '',
                        trailingNegative: false,
                        caretFix: false,
                        throwInput: true,
                        strip: true,
                        tagList: ['b', 'caption', 'cite', 'code', 'dd', 'del', 'div', 'dfn', 'dt', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ins', 'kdb', 'label', 'li', 'option', 'output', 'p', 'q', 's', 'sample', 'span', 'strong', 'td', 'th', 'u', 'const'],
                    });

                    // Merge defaults, tagData and options
                    if (settings.aDec === settings.aSep) {
                        throwError(`autoNumeric will not function properly when the decimal character aDec [${settings.aDec}] and the thousand separator aSep [${settings.aSep}] are the same character`, settings.debug);
                    }
                    $.each(settings, (key, value) => {
                        if (value === 'true' || value === 'false') {
                            settings[key] = Boolean(value === 'true');
                        }
                        if (typeof value === 'number' && key !== 'aScale') {
                            settings[key] = value.toString();
                        }
                    });
                    if (settings.aScale !== null) {
                        settings.scaleFactor = +settings.aScale[0];
                        settings.scaleDecimal = (settings.aScale[1]) ? +settings.aScale[1] : null;
                        settings.scaleSuffix = (settings.aScale[2]) ? settings.aScale[2] : '';
                    }

                    // Save our new settings
                    $this.data('autoNumeric', settings);
                } else {
                    return this;
                }

                // original settings saved for use when eDec & nSep options are being used
                settings = originalSettings(settings);
                let holder = getHolder($this, settings);

                // checks for non-supported input types
                if (!$input && $this.prop('tagName').toLowerCase() === 'input') {
                    throwError(`The input type "${$this.prop('type')}" is not supported by autoNumeric`, settings.debug);
                }

                // checks for non-supported tags
                if (!isInArray($this.prop('tagName').toLowerCase(), settings.tagList) && $this.prop('tagName').toLowerCase() !== 'input') {
                    throwError(`The <${$this.prop('tagName').toLowerCase()}> tag is not supported by autoNumeric`, settings.debug);
                }

                //TODO Replace the two next tests with a `validateOptions()` function
                // checks if the decimal and thousand are characters are the same
                if (settings.aDec === settings.aSep) {
                    throwError(`autoNumeric will not function properly when the decimal character aDec [${settings.aDec}] and the thousand separator aSep [${settings.aSep}] are the same character`, settings.debug);
                }

                // checks the extended decimal places "eDec" is greater than the normal decimal places "mDec"
                if (settings.eDec < settings.mDec && settings.eDec !== null) {
                    throwError(`autoNumeric will not function properly when the extended decimal places eDec [${settings.eDec}] is greater than the mDec [${settings.mDec}] value`, settings.debug);
                }

                // routine to format default value on page load
                if (settings.runOnce === false && settings.aForm) {
                    let setValue = true;
                    if ($input) {
                        const currentValue = $this.val();
                        /* checks for page reload from back button
                         * also checks for ASP.net form post back
                         * the following HTML data attribute is REQUIRED (data-an-default="same value as the value attribute")
                         * example: <asp:TextBox runat="server" id="someID" text="1234.56" data-an-default="1234.56">
                         */
                        if ((settings.anDefault && settings.anDefault.toString() !== currentValue) || (settings.anDefault === null && currentValue !== '' && currentValue !== $this.attr('value')) || (currentValue !== '' && $this.attr('type') === 'hidden' && !$.isNumeric(currentValue.replace(',', '.')))) {
                            if (settings.eDec && settings.aStor) {
                                settings.rawValue = autoSave($this, settings, 'get');
                            }
                            if (settings.aScale && settings.aStor) {
                                settings.rawValue = autoSave($this, settings, 'get');
                            }
                            if (!settings.aStor) {
                                let toStrip;
                                if (settings.nBracket !== null && settings.aNeg !== '') {
                                    settings.onOff = true;
                                    toStrip = negativeBracket(currentValue, settings);
                                } else {
                                    toStrip = currentValue;
                                }
                                settings.rawValue = ((settings.pNeg === 's' || (settings.pSign === 's' && settings.pNeg !== 'p')) && settings.aNeg !== '' && contains(currentValue, '-')) ? '-' + autoStrip(toStrip, settings) : autoStrip(toStrip, settings);
                            }
                            setValue = false;
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
                        }
                        else if (setValue && currentValue === $this.attr('value')) {
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

                settings.runOnce = true;

                // input types supported "text", "hidden", "tel" and no type
                if ($input) {
                    $this.on('focusin.autoNumeric', () => {
                        holder = getHolder($this);
                        const $settings = holder.settingsClone;
                        $settings.onOff = true;
                        if ($settings.nBracket !== null && $settings.aNeg !== '') {
                            $this.val(negativeBracket($this.val(), $settings));
                        }
                        if ($settings.nSep === true) {
                            $settings.aSep = '';
                            $settings.aSign = '';
                        }

                        let result;
                        if ($settings.eDec) {
                            $settings.mDec = $settings.eDec;
                            $this.autoNumeric('set', $settings.rawValue);
                        } else if ($settings.aScale) {
                            $settings.mDec = $settings.oDec;
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
                    });

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
                        holder.init(e);
                        if (holder.skipAlways(e)) {
                            holder.processed = true;
                            return true;
                        }
                        if (holder.processAlways()) {
                            holder.processed = true;
                            holder.formatQuick(e);
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

                    $this.on('keypress.autoNumeric', e => {
                        // Firefox fix for Shift && insert paste event
                        if (e.shiftKey && e.keyCode === keyCode.Insert) {
                            return;
                        }
                        holder = getHolder($this);
                        const processed = holder.processed;
                        holder.init(e);
                        if (holder.skipAlways(e)) {
                            return true;
                        }
                        if (processed) {
                            e.preventDefault();
                            return false;
                        }
                        if (holder.processAlways() || holder.processKeypress()) {
                            holder.formatQuick(e);
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

                    $this.on('keyup.autoNumeric', function(e) {
                        holder = getHolder($this);
                        holder.init(e);
                        const skip = holder.skipAlways(e);
                        const tab = holder.kdCode;
                        holder.kdCode = 0;
                        delete holder.valuePartsBeforePaste;

                        // added to properly place the caret when only the currency sign is present
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

                        // saves the extended decimal to preserve the data when navigating away from the page
                        if (holder.settingsClone.eDec !== null && holder.settingsClone.aStor) {
                            autoSave($this, settings, 'set');
                        }
                        if (skip) {
                            return true;
                        }
                        if (this.value === '') {
                            return true;
                        }
                        if (!holder.formatted) {
                            holder.formatQuick(e);
                        }
                    });

                    $this.on('focusout.autoNumeric', () => {
                        holder = getHolder($this);
                        let value = $this.val();
                        const origValue = value;
                        const $settings = holder.settingsClone;
                        $settings.onOff = false;
                        if ($settings.aStor) {
                            autoSave($this, $settings, 'set');
                        }
                        if ($settings.nSep === true) {
                            $settings.aSep = $settings.oSep;
                            $settings.aSign = $settings.oSign;
                        }
                        if ($settings.eDec !== null) {
                            $settings.mDec = $settings.oDec;
                            $settings.aPad = $settings.oPad;
                            $settings.nBracket = $settings.oBracket;
                        }
                        value = autoStrip(value, $settings);
                        if (value !== '') {
                            if ($settings.trailingNegative) {
                                value = '-' + value;
                                $settings.trailingNegative = false;
                            }
                            const [minTest, maxTest] = autoCheck(value, $settings);
                            if (checkEmpty(value, $settings) === null && minTest && maxTest) {
                                value = fixNumber(value, $settings.aDec, $settings.aNeg);
                                $settings.rawValue = value;
                                if ($settings.aScale) {
                                    value = value / $settings.scaleFactor;
                                    value = value.toString();
                                }
                                $settings.mDec = ($settings.aScale && $settings.aScale[1]) ? +$settings.scaleDecimal : $settings.mDec;
                                value = autoRound(value, $settings);
                                value = presentNumber(value, $settings);
                            } else {
                                if (!minTest) {
                                    $this.trigger('autoNumeric:minExceeded');
                                }
                                if (!maxTest) {
                                    $this.trigger('autoNumeric:maxExceeded');
                                }
                                value = $settings.rawValue;
                            }
                        } else {
                            if ($settings.wEmpty === 'zero') {
                                $settings.rawValue = '0';
                                value = autoRound('0', $settings);
                            } else {
                                $settings.rawValue = '';
                            }
                        }
                        let groupedValue = checkEmpty(value, $settings, false);
                        if (groupedValue === null) {
                            groupedValue = autoGroup(value, $settings);
                        }
                        if (groupedValue !== origValue) {
                            groupedValue = ($settings.scaleSuffix) ? groupedValue + $settings.scaleSuffix : groupedValue;
                            $this.val(groupedValue);
                        }
                        if (groupedValue !== holder.inVal) {
                            $this.change();
                            delete holder.inVal;
                        }
                    });

                    $this.on('paste', function(e) {
                        //FIXME After a paste, the caret is put on the far right of the input, it should be set to something like `newCaretPosition = oldCaretPosition + pasteText.length;`, while taking into account the thousand separators and the decimal character
                        e.preventDefault();
                        holder = getHolder($this);
                        function prepare(text) {
                            return autoStrip(text, holder.settingsClone).replace(holder.settingsClone.aDec, '.');
                        }
                        function isValid(text) {
                            return text !== '' && !isNaN(text);
                        }
                        const oldRawValue = $this.autoNumeric('get');
                        const currentValue = this.value || '';
                        const selectionStart = this.selectionStart || 0;
                        const selectionEnd = this.selectionEnd || 0;
                        const prefix = currentValue.substring(0, selectionStart);
                        const suffix = currentValue.substring(selectionEnd, currentValue.length);
                        const pastedText = prepare(e.originalEvent.clipboardData.getData('text/plain'));
                        if (isValid(pastedText)) {
                            const newValue = prepare(prefix + Number(pastedText).valueOf() + suffix);
                            if (isValid(newValue) && Number(oldRawValue).valueOf() !== Number(newValue).valueOf()) {
                                $this.autoNumeric('set', newValue);
                                $this.trigger('input');
                            }
                        } else {
                            this.selectionStart = selectionEnd;
                        }
                    });

                    $this.closest('form').on('submit.autoNumeric', () => {
                        holder = getHolder($this);
                        if (holder) {
                            const $settings = holder.settingsClone;
                            if ($settings.unSetOnSubmit) {
                                $this.val($settings.rawValue);
                            }
                        }
                    });
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
                const $this = autoGet($(this));
                const settings = $this.data('autoNumeric');
                if (typeof settings === 'object') {
                    $this.val('');
                    autoSave($this, settings, 'wipe');
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
                const $this = autoGet($(this));
                const settings = $this.data('autoNumeric');
                if (typeof settings === 'object') {
                    $this.val('');
                    settings.rawValue = '';
                    autoSave($this, settings, 'wipe');
                }
            });
        },

        /**
         * method to update settings - can be call as many times
         * $(someSelector).autoNumeric("update", {options}); // updates the settings
         * options passed as a parameter example '{aSep: ".", aDec: ",", aSign: '€ '}
         */
        update(options) {
            return $(this).each(function() {
                const $this = autoGet($(this));
                let settings = $this.data('autoNumeric');
                if (typeof settings !== 'object') {
                    throwError(`Initializing autoNumeric is required prior to calling the "update" method`, true);
                }
                const strip = $this.autoNumeric('get');
                settings = $.extend(settings, options);
                if (settings.aScale !== null) {
                    settings.scaleFactor = +settings.aScale[0];
                    settings.scaleDecimal = (settings.aScale[1]) ? +settings.aScale[1] : null;
                    settings.scaleSuffix = (settings.aScale[2]) ? settings.aScale[2] : '';
                }
                settings = originalSettings(settings);
                getHolder($this, settings, true);
                if (settings.aDec === settings.aSep) {
                    throwError(`autoNumeric will not function properly when the decimal character aDec: "${settings.aDec}" and thousand separator aSep: "${settings.aSep}" are the same character`, settings.debug);
                }
                $this.data('autoNumeric', settings);
                if ($this.val() !== '' || $this.text() !== '') {
                    return $this.autoNumeric('set', strip);
                }
            });
        },

        /**
         * method to format value sent as a parameter ""
         * $(someSelector).autoNumeric('set', 'value'}); // formats the value being passed
         * value passed as a string - can be a integer '1234' or double '1234.56789'
         * must contain only numbers and one decimal (period) character
         */
        set(valueIn) {
            return $(this).each(function() {
                if (valueIn === null || isUndefined(valueIn)) {
                    return;
                }
                const $this = autoGet($(this));
                const settings = $this.data('autoNumeric');
                const $input = $this.is('input[type=text], input[type=hidden], input[type=tel], input:not([type])');
                let value = valueIn.toString();
                if (typeof settings !== 'object') {
                    throwError(`Initializing autoNumeric is required prior to calling the "set" method`, true);
                }

                // allows locale decimal separator to be a comma - no thousand separator allowed
                value = fromLocale(value);

                // Throws an error if the value being set is not numeric
                if (!$.isNumeric(Number(value))) {
                    throwError(`The value "${value}" being "set" is not numeric and has caused a error to be thrown`, settings.debug);
                    return $this.val('');
                }

                if (value !== '') {
                    const [minTest, maxTest] = autoCheck(value, settings);
                    if (minTest && maxTest) {
                        if ($input && (!settings.eDec || !settings.aScale)) {
                            settings.rawValue = value;
                        }

                        // checks if the value falls within the min max range
                        if ($input || isInArray($this.prop('tagName').toLowerCase(), settings.tagList)) {
                            if (settings.aScale && !settings.onOff) {
                                value = value / settings.scaleFactor;
                                value = value.toString();
                                settings.mDec = settings.scaleDecimal;
                            }
                            value = autoRound(value, settings);
                            if (settings.eDec === null && settings.aScale === null) {
                                settings.rawValue = value;
                            }
                            value = presentNumber(value, settings);
                            value = autoGroup(value, settings);
                        }
                        if (settings.aStor && (settings.eDec !== null || settings.aScale !== null)) {
                            autoSave($this, settings, 'set');
                        }
                    } else {
                        settings.rawValue = '';
                        autoSave($this, settings, 'wipe');
                        const attemptedValue = value;
                        value = '';
                        if (!minTest) {
                            $this.trigger('autoNumeric:minExceeded');
                        }
                        if (!maxTest) {
                            $this.trigger('autoNumeric:maxExceeded');
                        }
                        throwError(`The value [${attemptedValue}] being set falls outside the vMin [${settings.vMin}] and vMax [${settings.vMax}] settings for this element`, settings.debug);
                        return $this.val('');
                    }
                } else {
                    return $this.val('');
                }

                if (!settings.onOff && settings.scaleSuffix) {
                    value = value + settings.scaleSuffix;
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
         * locale formats are supported "1234.56-" or "1234,56" or "-1234,56 or "1234,56-" => please see option "localeOutput" for details
         */
        unSet() {
            return $(this).each(function() {
                const $this = autoGet($(this));
                const settings = $this.data('autoNumeric');
                if (typeof settings === 'object') {
                    settings.onOff = true;
                    $this.val($this.autoNumeric('get'));
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
                const $this = autoGet($(this));
                const settings = $this.data('autoNumeric');
                if (typeof settings === 'object') {
                    $this.autoNumeric('set', $this.val());
                }
            });
        },

        /**
         * method to get the unformatted that accepts up to one parameter
         * $(someSelector).autoNumeric('get'); no parameter supported
         * by defaults values returned as ISO numeric string "1234.56" or "-1234.56" where the decimal character is a period
         * locale formats are supported "1234.56-" or "1234,56" or "-1234,56 or "1234,56-" => please see option "localeOutput" for details
         */
        get() {
            const $this = autoGet($(this));
            const settings = $this.data('autoNumeric');
            const $input = $this.is('input[type=text], input[type=hidden], input[type=tel], input:not([type])');
            let value = '';
            if (typeof settings !== 'object') {
                throwError(`Initializing autoNumeric is required prior to calling the "get" method`, true);
            }

            // determine the element type then use .eq(0) selector to grab the value of the first element in selector
            if ($input) {
                value = $this.eq(0).val();
            } else if (isInArray($this.prop('tagName').toLowerCase(), settings.tagList)) {
                value = $this.eq(0).text();
            } else {
                throwError(`The "<${$this.prop('tagName').toLowerCase()}>" tag is not supported by autoNumeric`, settings.debug);
            }

            if (settings.eDec || settings.aScale) {
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
                value = fixNumber(value, settings.aDec, settings.aNeg);
            }

            if (Number(value) === 0 && settings.lZero !== 'keep') {
                value = '0';
            }
            if (settings.localeOutput) {
                value = toLocale(value, settings.localeOutput);
            }

            // returned Numeric String
            return value;
        },

        /**
         * This function factorise the `getString()` and `getArray()` functions since they share quite a lot of code.
         *
         * The "getString" method uses jQuery's .serialize() method that creates a text string in standard URL-encoded notation.
         * The "getArray" method on the other hand uses jQuery's .serializeArray() method that creates array or objects that can be encoded as a JSON string.
         *
         * It then loops through the string and un-formats the inputs with autoNumeric.
         * By defaults values returned as ISO numeric string "1234.56" or "-1234.56" where the decimal character is a period
         * Locale formats are supported "1234.56-" or "1234,56" or "-1234,56 or "1234,56-" => please see option "localeOutput" for details
         *
         * @param {boolean} getArrayBehavior - If set to TRUE, then this function behave like `getArray()`, otherwise if set to FALSE, it behave like `getString()`
         * @returns {*}
         * @private
         */
        _getStringOrArray(getArrayBehavior = true) {
            const $this = autoGet($(this));
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
                            field.value = testInput.autoNumeric('get', settings.localeOutput).toString();
                        }
                    }
                });

                return formFields;
            }
            else {
                // getString() behavior
                const formFields = $this.serialize();
                const formParts = formFields.split('&');

                $.each(formParts, (i, miniParts) => {
                    miniParts = formParts[i].split('=');
                    const scElement = $.inArray(i, scIndex);
                    if (scElement > -1 && aiIndex[scElement] > -1) {
                        const testInput = $(`form:eq(${formIndex}) input:eq(${aiIndex[scElement]})`);
                        const settings = testInput.data('autoNumeric');
                        if (typeof settings === 'object') {
                            if (miniParts[1] !== null) {
                                miniParts[1] = testInput.autoNumeric('get', settings.localeOutput).toString();
                                formParts[i] = miniParts.join('=');
                            }
                        }
                    }
                });

                return formParts.join('&');
            }
        },

        /**
         * The "getString" method uses jQuery's .serialize() method that creates a text string in standard URL-encoded notation.
         *
         * It then loops through the string and un-formats the inputs with autoNumeric.
         * By defaults values returned as ISO numeric string "1234.56" or "-1234.56" where the decimal character is a period
         * Locale formats are supported "1234.56-" or "1234,56" or "-1234,56 or "1234,56-" => please see option "localeOutput" for details
         */
        getString() {
            this._getStringOrArray(false);
        },

        /**
         * The "getArray" method on the other hand uses jQuery's .serializeArray() method that creates array or objects that can be encoded as a JSON string.
         *
         * It then loops through the string and un-formats the inputs with autoNumeric.
         * By defaults values returned as ISO numeric string "1234.56" or "-1234.56" where the decimal character is a period
         * Locale formats are supported "1234.56-" or "1234,56" or "-1234,56 or "1234,56-" => please see option "localeOutput" for details
         */
        getArray() {
            this._getStringOrArray(true);
        },

        /**
         * The 'getSettings' function returns the object with autoNumeric settings for those who need to look under the hood
         * $(someSelector).autoNumeric('getSettings'); // no parameters accepted
         * $(someSelector).autoNumeric('getSettings').aDec; // return the aDec setting as a string - ant valid setting can be used
         */
        getSettings() {
            const $this = autoGet($(this));

            return $this.eq(0).data('autoNumeric');
        },
    };

    /**
     * autoNumeric function
     */
    $.fn.autoNumeric = function(method, ...args) {
        if (methods[method]) {
            return methods[method].apply(this, args);
        }
        if (typeof method === 'object' || !method) {
            return methods.init.apply(this, args);
        }
        throwError(`Method "${method}" is not supported by autoNumeric`, true);
    };

    /**
     * Defaults are public - these can be overridden by the following:
     * HTML5 data attributes
     * Options passed by the 'init' or 'update' methods
     * Use jQuery's `$.extend` method for global changes - also a great way to pass ASP.NET current culture settings
     */
    $.fn.autoNumeric.defaults = {
        /* allowed thousand separator characters
         * comma = ","
         * period "full stop" = "."
         * apostrophe is escaped = "\""
         * space = " "
         * none = ""
         * NOTE: do not use numeric characters
         */
        aSep: ',',

        /* when true => when the input has focus only the decimal character is visible
         */
        nSep: false,

        /* digital grouping for the thousand separator used in Format
         * dGroup: "2", results in 99,99,99,999 India's lakhs
         * dGroup: "2s", results in 99,999,99,99,999 India's lakhs scaled
         * dGroup: "3", results in 999,999,999 default
         * dGroup: "4", results in 9999,9999,9999 used in some Asian countries
         */
        dGroup: '3',

        /* allowed decimal separator characters
         * period "full stop" = "."
         * comma = ","
         */
        aDec: '.',

        /* allow to declare alternative decimal separator which is automatically replaced by aDec
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

        /* placement of negative sign relative to the aSign option l=left, r=right, p=prefix & s=suffix
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

        /* override min max limits'
         * oLimits: "ceiling" adheres to vMax and ignores vMin settings
         * oLimits: "floor" adheres to vMin and ignores vMax settings
         * oLimits: "ignore" ignores both vMin & vMax
         */
        oLimits: null,

        /* maximum possible value
         * value must be enclosed in quotes and use the period for the decimal point
         * value must be larger than vMin
         */
        vMax: '9999999999999.99',

        /* minimum possible value
         * value must be enclosed in quotes and use the period for the decimal point
         * value must be smaller than vMax
         */
        vMin: '-9999999999999.99',

        /* Maximum number of decimal places = used to override decimal places set by the vMin & vMax values
         * value must be enclosed in quotes example mDec: "3",
         */
        mDec: null,

        /* Expanded decimal places visible when input has focus - example:
         * {eDec: "5"} and the default 2 decimal places with focus "1,000.12345" without focus "1,000.12" the results depends on the rounding method used
         * the "get" method returns the extended decimal places
         */
        eDec: null,

        /* Scaled number displayed when input does not have focus example with the following:
         * {aScale: ["1000", "0", "K"]}  => with focus "1,000.00" without focus "1K"
         * ["divisor", "decimal places", "symbol"]
         * divisor value - does not need to be whole number - please understand that Javascript has limited accuracy in math
         * the "get" method returns the full value and scaled value.
         * decimal places "optional" when not in focus - if omitted the decimal places will be the same when the input has focus
         * Symbol "optional" displayed when the input does not have focus - NOTE: if a symbol is used you MUST also specify the decimal places
         * value must be enclosed in quotes example mDec: "3"
         */
        aScale: null,

        /* Set to true to allow the eDec value to be saved with sessionStorage
         * if ie 6 or 7 the value will be saved as a session cookie
         */
        aStor: false,

        /* method used for rounding
         * mRound: "s", Round-Half-Up Symmetric (default)
         * mRound: "A", Round-Half-Up Asymmetric
         * mRound: "s", Round-Half-Down Symmetric (lower case s)
         * mRound: "A", Round-Half-Down Asymmetric (lower case a)
         * mRound: "B", Round-Half-Even "Bankers Rounding"
         * mRound: "U", Round Up "Round-Away-From-Zero"
         * mRound: "D", Round Down "Round-Toward-Zero" - same as truncate
         * mRound: "C", Round to Ceiling "Toward Positive Infinity"
         * mRound: "F", Round to Floor "Toward Negative Infinity"
         * mRound: "N05" Rounds to the nearest .05 => same as "CHF" used in 1.9X and still valid
         * mRound: "U05" Rounds up to next .05
         * mRound: "D05" Rounds down to next .05
         */
        mRound: 's',

        /* controls decimal padding
         * aPad: true - always Pad decimals with zeros
         * aPad: false - does not pad with zeros.
         * aPad: `some number` - pad decimals with zero to number different from mDec
         * thanks to Jonas Johansson for the suggestion
         */
        aPad: true,

        /* places brackets on negative value -$ 999.99 to (999.99)
         * visible only when the field does NOT have focus the left and right symbols should be enclosed in quotes and separated by a comma
         * nBracket: null - (default)
         * nBracket: '(,)', nBracket: '[,]', nBracket: '<,>' or nBracket: '{,}'
         */
        nBracket: null,

        /* Displayed on empty string ""
         * wEmpty: "focus" - (default) currency sign displayed and the input receives focus
         * wEmpty: "press" - currency sign displays on any key being pressed
         * wEmpty: "always" - always displays the currency sign only
         * wEmpty: "zero" - if the input has no value on focus out displays a zero "rounded" with or with a currency sign
         */
        wEmpty: 'focus',

        /* controls leading zero behavior
         * lZero: "allow", - allows leading zeros to be entered. Zeros will be truncated when entering additional digits. On focusout zeros will be deleted.
         * lZero: "deny", - allows only one leading zero on values less than one
         * lZero: "keep", - allows leading zeros to be entered. on focusout zeros will be retained.
         */
        lZero: 'allow',

        /* determine if the default value will be formatted on page ready.
         * true = automatically formats the default value on page ready
         * false = will not format the default value
         */
        aForm: true,

        /* determine if the select all keyboard command will select
         * the complete input text or only the input numeric value
         * if the currency symbol is between the numeric value and the negative sign only the numeric value will selected
         */
        sNumber: false,

        /* helper option for ASP.NET postback
         * should be the value of the unformatted default value
         * examples:
         * no default value="" {anDefault: ""}
         * value=1234.56 {anDefault: '1234.56'}
         */
        anDefault: null,

        /* removes formatting on submit event
         * this output format: positive nnnn.nn, negative -nnnn.nn
         * review the 'unSet' method for other formats
         */
        unSetOnSubmit: false,

        /* allows the output to be in the locale format via the "get", "getString" & "getArray" methods
         * null => nnnn.nn or -nnnn.nn default
         * ","  => nnnn,nn or -nnnn,nn can als be "-,"
         * ".-" => nnnn.nn or nnnn.nn-
         * ",-" => nnnn,nn or nnnn,nn-
         */
        localeOutput: null,

        /* error handling function
         * true => all errors are thrown - helpful in site development
         * false => throws errors when calling methods prior to the supported element has been initialized be autoNumeric
         */
        debug: false,
    };

    /**
     * public function that allows formatting without an element trigger
     */
    $.fn.autoFormat = function(value, options) {
        const settings = $.extend({}, $.fn.autoNumeric.defaults, { strip: false }, options);
        value = value.toString();
        value = fromLocale(value);
        if (Number(value) < 0) {
            settings.aNeg = '-';
        }
        if (settings.mDec === null) {
            const vMax = settings.vMax.toString().split('.');
            const vMin = (!settings.vMin && settings.vMin !== 0) ? [] : settings.vMin.toString().split('.');
            settings.mDec = decLength(vMin, vMax);
        }
        const [minTest, maxTest] = autoCheck(value, settings);
        if (!minTest || !maxTest) {
            // Throw a custom event
            sendCustomEvent('autoFormat.autoNumeric', `Range test failed`);
            throwError(`The value [${value}] being set falls outside the vMin [${settings.vMin}] and vMax [${settings.vMax}] settings`, settings.debug);
        }
        value = autoRound(value, settings);
        value = presentNumber(value, settings);
        value = autoGroup(value, settings);

        return value;
    };

    /**
     * public function that allows formatting without an element
     */
    $.fn.autoUnformat = function(value, options) {
        const settings = $.extend({}, $.fn.autoNumeric.defaults, { strip: false }, options);
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
        if (settings.localeOutput) {
            value = toLocale(value, settings.localeOutput);
        }

        return value;
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
        /* let eventInfo = new CustomEventInit(); //This should be used instead, but IE does not support 'CustomEventInit' yet
        eventInfo.detail = detail;
        return new CustomEvent(eventName, eventInfo); */
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
        if (typeof window.CustomEvent === 'function') {return false;}

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
