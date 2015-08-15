/**
 * autoNumeric.js
 * @author: Bob Knothe
 * @contributor: Sokolov Yura
 * @version: 2.0-beta - 2015-08-15 GMT 2:00 PM / 14:00
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
;(function ($, window, document, undefined) {
    "use strict";
    /*jslint browser: true, bitwise: true*/
    /*global jQuery: false, sessionStorage: false*/

    /**
     * Cross browser routine for getting selected range/cursor position
     */
    function getElementSelection(that) {
        var position = {};
        if (that.selectionStart === undefined) {
            that.focus();
            var select = document.selection.createRange();
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
        if (that.selectionStart === undefined) {
            that.focus();
            var r = that.createTextRange();
            r.collapse(true);
            r.moveEnd('character', end);
            r.moveStart('character', start);
            r.select();
        } else {
            that.selectionStart = start;
            that.selectionEnd = end;
        }
    }

    /**
     * Function to handle errors messages
     */
    function throwErr(message, debug) {
        if (debug) {
            var err = new Error(message);
            throw err;
        }
    }

    /**
     * run callbacks in parameters if any
     * any parameter could be a callback:
     * - a function, which invoked with jQuery element, parameters and this parameter name and returns parameter value
     * - a name of function, attached to $(selector).autoNumeric.functionName(){} - which was called previously
     */
    function runCallbacks($this, settings) {
        /**
         * loops through the settings object (option array) to find the following
         * k = option name example k=aNum
         * val = option value example val=0123456789
         */
        $.each(settings, function (k, val) {
            if (typeof val === 'function') {
                settings[k] = val($this, settings, k);
            } else if (typeof $this.autoNumeric[val] === 'function') {
                /**
                 * calls the attached function from the html5 data example: data-a-sign="functionName"
                 */
                settings[k] = $this.autoNumeric[val]($this, settings, k);
            }
        });
    }

    /**
     * Preparing user defined options for further usage
     * merge them with defaults appropriately
     */
    function autoCode($this, settings) {
        runCallbacks($this, settings);
        var vmax = settings.vMax.toString().split('.'),
            vmin = (!settings.vMin && settings.vMin !== 0) ? [] : settings.vMin.toString().split('.');
        settings.aNeg = settings.vMin < 0 ? '-' : '';
        vmax[0] = vmax[0].replace('-', '');
        vmin[0] = vmin[0].replace('-', '');
        settings.mIntPos = Math.max(vmax[0].length, 1);
        settings.mIntNeg = Math.max(vmin[0].length, 1);
        if (settings.mDec === null) {
            var vmaxLength = 0,
                vminLength = 0;
            if (vmax[1]) {
                vmaxLength = vmax[1].length;
            }
            if (vmin[1]) {
                vminLength = vmin[1].length;
            }
            settings.mDec = Math.max(vmaxLength, vminLength);
            settings.oDec = settings.mDec;
        } else {
            settings.mDec = Number(settings.mDec);
        }
        /** set alternative decimal separator key */
        if (settings.altDec === null && settings.mDec > 0) {
            if (settings.aDec === '.' && settings.aSep !== ',') {
                settings.altDec = ',';
            } else if (settings.aDec === ',' && settings.aSep !== '.') {
                settings.altDec = '.';
            }
        }
        /** cache regexps for autoStrip */
        var aNegReg = settings.aNeg ? '([-\\' + settings.aNeg + ']?)' : '(-?)';
        settings.aNegRegAutoStrip = aNegReg;
        settings.skipFirstAutoStrip = new RegExp(aNegReg + '[^-' + (settings.aNeg ? '\\' + settings.aNeg : '') + '\\' + settings.aDec + '\\d]' + '.*?(\\d|\\' + settings.aDec + '\\d)');
        settings.skipLastAutoStrip = new RegExp('(\\d\\' + settings.aDec + '?)[^\\' + settings.aDec + '\\d]\\D*$');
        var allowed = '-' + settings.aNum + '\\' + settings.aDec;
        settings.allowedAutoStrip = new RegExp('[^' + allowed + ']', 'gi');
        settings.numRegAutoStrip = new RegExp(aNegReg + '(?:\\' + settings.aDec + '?(\\d+\\' + settings.aDec + '\\d+)|(\\d*(?:\\' + settings.aDec + '\\d*)?))');
        return settings;
    }

    /**
     * strip all unwanted characters and leave only a number alert
     */
    function autoStrip(s, settings) {
        if (settings.aSign !== '') { /** remove currency sign */
            s = s.replace(settings.aSign, '');
        }
        if (settings.aSuffix) { /** remove suffix */
            while (s.indexOf(settings.aSuffix) > -1) {
                s = s.replace(settings.aSuffix, '');
            }
        }
        s = s.replace(settings.skipFirstAutoStrip, '$1$2'); /** first replace anything before digits */
        if ((settings.pNeg === 's' || (settings.pSign === 's' && settings.pNeg !== 'p')) && s.indexOf('-') > -1 && s !== '') {
            settings.trailingNegative = true;
        }
        s = s.replace(settings.skipLastAutoStrip, '$1'); /** then replace anything after digits */
        s = s.replace(settings.allowedAutoStrip, ''); /** then remove any uninterested characters */
        if (settings.altDec) {
            s = s.replace(settings.altDec, settings.aDec);
        } /** get only number string */
        var m = s.match(settings.numRegAutoStrip);
        s = m ? [m[1], m[2], m[3]].join('') : '';
        if (settings.lZero === 'allow' || settings.lZero === 'keep') {
            var parts = [],
                nSign = '';
            parts = s.split(settings.aDec);
            if (parts[0].indexOf(settings.aNeg) !== -1) {
                nSign = settings.aNeg;
                parts[0] = parts[0].replace(settings.aNeg, '');
            }
            if (nSign === "" && parts[0].length > settings.mIntPos && parts[0].charAt(0) === '0') { /** strip leading zero if need */
                parts[0] = parts[0].slice(1);
            }
            if (nSign !== '' && parts[0].length > settings.mIntNeg && parts[0].charAt(0) === '0') { /** strip leading zero if need */
                parts[0] = parts[0].slice(1);
            }
            s = nSign + parts.join(settings.aDec);
        }
        if ((settings.onOff && settings.lZero === 'deny') || (settings.lZero === 'allow' && settings.onOff === false)) {
            var strip_reg = '^' + settings.aNegRegAutoStrip + '0*(\\d|$)';
            strip_reg = new RegExp(strip_reg);
            s = s.replace(strip_reg, '$1$2');
        }
        return s;
    }

    /**
     * places or removes brackets on negative values
     */
    function negativeBracket(s, settings) {
        if ((settings.pSign === 'p' && settings.pNeg === 'l') || (settings.pSign === 's' && settings.pNeg === 'p')) {
            var brackets = settings.nBracket.split(',');
            if (!settings.onOff) {
                s = s.replace(settings.aNeg, '');
                s = brackets[0] + s + brackets[1];
            } else if (settings.onOff && s.charAt(0) === brackets[0]) {
                s = s.replace(brackets[0], settings.aNeg);
                s = s.replace(brackets[1], '');
            }
        }
        return s;
    }

    /**
     * convert locale format to javaSript numeric string
     * allows locale decimal separator to be a period or comma - no thousand separator allowed of currency signs allowed
     * '1234.56'    OK
     * '-1234.56'   OK
     * '1234.56-'   OK
     * '1234,56'    OK
     * '-1234,56'   OK
     * '1234,56-'   OK
     */
    function convertLocale(s) {
        s = s.replace(',', '.');
        if (s.lastIndexOf('-') !== -1 && s.lastIndexOf('-') === s.length - 1) {
            s = s.replace('-', '');
            s = '-' + s;
        }
        return s;
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
    function presentNumber(s, aDec, aNeg) {
        if (aNeg && aNeg !== '-') {
            s = s.replace('-', aNeg);
        }
        if (aDec && aDec !== '.') {
            s = s.replace('.', aDec);
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
        iv = autoStrip(iv, settings);
        if (settings.trailingNegative && iv.indexOf('-') === -1) {
            iv = '-' + iv;
        }
        var empty = checkEmpty(iv, settings, true),
            isNeg = iv.replace(',', '.') < 0;
        if (iv.indexOf('-') > -1 && Number(iv) === 0) {
            isNeg = true;
        }
        if (isNeg) {
            iv = iv.replace('-', '');
        }
        if (empty !== null) {
            return empty;
        }
        var digitalGroup = '';
        settings.dGroup = settings.dGroup.toString();
        if (settings.dGroup === '2') {
            digitalGroup = /(\d)((\d)(\d{2}?)+)$/;
        } else if (settings.dGroup === '2s') {
            digitalGroup = /(\d)((?:\d{2}){0,2}\d{3}(?:(?:\d{2}){2}\d{3})*?)$/;
        } else if (settings.dGroup === '4') {
            digitalGroup = /(\d)((\d{4}?)+)$/;
        } else {
            digitalGroup = /(\d)((\d{3}?)+)$/;
        } /** splits the string at the decimal string */
        var ivSplit = iv.split(settings.aDec);
        if (settings.altDec && ivSplit.length === 1) {
            ivSplit = iv.split(settings.altDec);
        } /** assigns the whole number to the a variable (s) */
        var s = ivSplit[0];
        if (settings.aSep !== '') {
            while (digitalGroup.test(s)) { /** re-inserts the thousand separator via a regular expression */
                s = s.replace(digitalGroup, '$1' + settings.aSep + '$2');
            }
        }
        if (settings.mDec !== 0 && ivSplit.length > 1) {
            if (ivSplit[1].length > settings.mDec) {
                ivSplit[1] = ivSplit[1].substring(0, settings.mDec);
            } /** joins the whole number with the decimal value */
            iv = s + settings.aDec + ivSplit[1];
        } else { /** if whole numbers only */
            iv = s;
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
            if (!isNeg && !settings.trailingNegative) {
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
        if (settings.rawValue < 0 && settings.nBracket !== null) { /** removes the negative sign and places brackets */
            iv = negativeBracket(iv, settings);
        }
        settings.trailingNegative = false;
        return iv + settings.aSuffix;
    }

    /**
     * round number after setting by pasting or $().autoNumericSet()
     * private function for round the number
     * please note this handled as text - JavaScript math function can return inaccurate values
     * also this offers multiple rounding methods that are not easily accomplished in JavaScript
     */
    function autoRound(iv, settings) { /** value to string */
        iv = (iv === '') ? '0' : iv.toString();
        if (settings.mRound === 'N05' || settings.mRound === 'U05' || settings.mRound === 'D05') {
            iv = (settings.mRound === 'N05') ? (Math.round(iv * 20) / 20).toString() : (settings.mRound === 'U05') ? (Math.ceil(iv * 20) / 20).toString() : (Math.floor(iv * 20) / 20).toString();
            return (iv.indexOf('.') === -1) ? iv + '.00' : (iv.length - iv.indexOf('.') < 3) ? iv + '0' : iv;
        }
        var ivRounded = '',
            i = 0,
            nSign = '',
            rDec = (typeof (settings.aPad) === 'boolean' || settings.aPad === null) ? (settings.aPad ? settings.mDec : 0) : Number(settings.aPad);
        var truncateZeros = function (ivRounded) { /** truncate not needed zeros */
            var regex = rDec === 0 ? (/(\.(?:\d*[1-9])?)0*$/) : rDec === 1 ? (/(\.\d(?:\d*[1-9])?)0*$/) : new RegExp('(\\.\\d{' + rDec + '}(?:\\d*[1-9])?)0*');
            ivRounded = ivRounded.replace(regex, '$1'); /** If there are no decimal places, we don't need a decimal point at the end */
            if (rDec === 0) {
                ivRounded = ivRounded.replace(/\.$/, '');
            }
            return ivRounded;
        };
        if (iv.charAt(0) === '-') { /** Checks if the iv (input Value)is a negative value */
            nSign = '-';
            iv = iv.replace('-', ''); /** removes the negative sign will be added back later if required */
        }
        if (!iv.match(/^\d/)) { /** append a zero if first character is not a digit (then it is likely to be a dot)*/
            iv = '0' + iv;
        }
        if (nSign === '-' && Number(iv) === 0) { /** determines if the value is zero - if zero no negative sign */
            nSign = '';
        }
        if ((Number(iv) > 0 && settings.lZero !== 'keep') || (iv.length > 0 && settings.lZero === 'allow')) { /** trims leading zero's if needed */
            iv = iv.replace(/^0*(\d)/, '$1');
        }
        var dPos = iv.lastIndexOf('.'),
            /** virtual decimal position */
            vdPos = (dPos === -1) ? iv.length - 1 : dPos,
            /** checks decimal places to determine if rounding is required */
            cDec = (iv.length - 1) - vdPos; /** check if no rounding is required */
        if (cDec <= settings.mDec) {
            ivRounded = iv; /** check if we need to pad with zeros */
            if (cDec < rDec) {
                if (dPos === -1) {
                    ivRounded += '.';
                }
                var zeros = '000000';
                while (cDec < rDec) {
                    zeros = zeros.substring(0, rDec - cDec);
                    ivRounded += zeros;
                    cDec += zeros.length;
                }
            } else if (cDec > rDec) {
                ivRounded = truncateZeros(ivRounded);
            } else if (cDec === 0 && rDec === 0) {
                ivRounded = ivRounded.replace(/\.$/, '');
            }
            return (Number(ivRounded) === 0) ? ivRounded : nSign + ivRounded;
        } /** rounded length of the string after rounding */
        var rLength = dPos + settings.mDec,
            tRound = Number(iv.charAt(rLength + 1)),
            ivArray = iv.substring(0, rLength + 1).split(''),
            odd = (iv.charAt(rLength) === '.') ? (iv.charAt(rLength - 1) % 2) : (iv.charAt(rLength) % 2);
        /*jslint white: true*/
        if ((tRound > 4 && settings.mRound === 'S') || /**                      Round half up symmetric */
            (tRound > 4 && settings.mRound === 'A' && nSign === '') || /**      Round half up asymmetric positive values */
            (tRound > 5 && settings.mRound === 'A' && nSign === '-') || /**     Round half up asymmetric negative values */
            (tRound > 5 && settings.mRound === 's') || /**                      Round half down symmetric */
            (tRound > 5 && settings.mRound === 'a' && nSign === '') || /**      Round half down asymmetric positive values */
            (tRound > 4 && settings.mRound === 'a' && nSign === '-') || /**     Round half down asymmetric negative values */
            (tRound > 5 && settings.mRound === 'B') || /**                      Round half even "Banker's Rounding" */
            (tRound === 5 && settings.mRound === 'B' && odd === 1) || /**       Round half even "Banker's Rounding" */
            (tRound > 0 && settings.mRound === 'C' && nSign === '') || /**      Round to ceiling toward positive infinite */
            (tRound > 0 && settings.mRound === 'F' && nSign === '-') || /**     Round to floor toward negative infinite */
            (tRound > 0 && settings.mRound === 'U')) { /**                      Round up away from zero */
        /*jslint white: false*/
            for (i = (ivArray.length - 1); i >= 0; i -= 1) { /** Round up the last digit if required, and continue until no more 9's are found */
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
        ivArray = ivArray.slice(0, rLength + 1); /** Reconstruct the string, converting any 10's to 0's */
        ivRounded = truncateZeros(ivArray.join('')); /** return rounded value */
        return (Number(ivRounded) === 0) ? ivRounded : nSign + ivRounded;
    }

    /**
     * truncate decimal part of a number
     */
    function truncateDecimal(s, settings, paste) {
        var aDec = settings.aDec,
            mDec = settings.mDec;
        s = (paste === 'paste') ? autoRound(s, settings) : s;
        if (aDec && mDec) {
            var parts = s.split(aDec);
            /** truncate decimal part to satisfying length
             * cause we would round it anyway */
            if (parts[1] && parts[1].length > mDec) {
                if (mDec > 0) {
                    parts[1] = parts[1].substring(0, mDec);
                    s = parts.join(aDec);
                } else {
                    s = parts[0];
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
        var x = {},
            e,
            i,
            nL,
            j;
        /** Minus zero? */
        if (n === 0 && 1 / n < 0) {
            n = '-0';
        }
        /** Determine sign. 1 positive, -1 negative */
        if (n.charAt(0) === '-') {
            n = n.slice(1);
            x.s = -1;
        } else {
            x.s = 1;
        }
        /** Decimal point? */
        e = n.indexOf('.');
        if (e > -1) {
            n = n.replace('.', '');
        }
        /** length of string if no decimal character */
        if (e < 0) {
            /** Integer. */
            e = n.length;
        }
        /** Determine leading zeros. */
        i = (n.search(/[1-9]/i) === -1) ? n.length : n.search(/[1-9]/i);
        nL = n.length;
        if (i === nL) {
            /** Zero. */
            x.e = 0;
            x.c = [0];
        } else {
            /** Determine trailing zeros. */
            for (j = nL - 1; n.charAt(j) === '0'; j -= 1) {
                nL -= 1;
            }
            nL -= 1;
            /** Decimal location. */
            x.e = e - i - 1;
            x.c = [];
            /** Convert string to array of digits without leading/trailing zeros. */
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
        var xNeg,
            xc = x.c,
            yc = y.c,
            i = x.s,
            j = y.s,
            k = x.e,
            l = y.e;
        /** Either zero? */
        if (!xc[0] || !yc[0]) {
            return !xc[0] ? !yc[0] ? 0 : -j : i;
        }
        /** Signs differ? */
        if (i !== j) {
            return i;
        }
        xNeg = i < 0;
        /** Compare exponents. */
        if (k !== l) {
            return k > l ^ xNeg ? 1 : -1;
        }
        i = -1;
        k = xc.length;
        l = yc.length;
        j = (k < l) ? k : l;
        /** Compare digit by digit. */
        for (i += 1; i < j; i += 1) {
            if (xc[i] !== yc[i]) {
                return xc[i] > yc[i] ^ xNeg ? 1 : -1;
            }
        }
        /** Compare lengths */
        return k === l ? 0 : k > l ^ xNeg ? 1 : -1;
    }

    /**
     * checking that number satisfy format conditions
     * and lays between settings.vMin and settings.vMax
     * and the string length does not exceed the digits in settings.vMin and settings.vMax
     */
    function autoCheck(s, settings) {
        s = s.replace(',', '.');
        var minParse = parseStr(settings.vMin),
            maxParse = parseStr(settings.vMax),
            valParse = parseStr(s);
        return testMinMax(minParse, valParse) > -1 && testMinMax(maxParse, valParse) < 1;
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
        init: function (e) {
            this.value = this.that.value;
            this.settingsClone = autoCode(this.$that, this.settings);
            this.ctrlKey = e.ctrlKey;
            this.cmdKey = e.metaKey;
            this.shiftKey = e.shiftKey;
            this.selection = getElementSelection(this.that); /** keypress event overwrites meaningful value of e.keyCode */
            if (e.type === 'keydown' || e.type === 'keyup') {
                this.kdCode = e.keyCode;
            }
            this.which = e.which;
            this.processed = false;
            this.formatted = false;
        },
        setSelection: function (start, end, setReal) {
            start = Math.max(start, 0);
            end = Math.min(end, this.that.value.length);
            this.selection = {
                start: start,
                end: end,
                length: end - start
            };
            if (setReal === undefined || setReal) {
                setElementSelection(this.that, start, end);
            }
        },
        setPosition: function (pos, setReal) {
            this.setSelection(pos, pos, setReal);
        },
        getBeforeAfter: function () {
            var value = this.value,
                left = value.substring(0, this.selection.start),
                right = value.substring(this.selection.end, value.length);
            return [left, right];
        },
        getBeforeAfterStriped: function () {
            var settingsClone = this.settingsClone,
                parts = this.getBeforeAfter();
            parts[0] = autoStrip(parts[0], this.settingsClone);
            parts[1] = autoStrip(parts[1], this.settingsClone);
            if (settingsClone.trailingNegative && parts[0].indexOf('-') === -1) {
                parts[0] = '-' + parts[0];
                parts[1] = (parts[1] === '-') ? '' : parts[1];
            }
            settingsClone.trailingNegative = false;
            return parts;
        },

        /**
         * strip parts from excess characters and leading zeroes
         */
        normalizeParts: function (left, right) {
            var settingsClone = this.settingsClone;
            left = autoStrip(left, settingsClone); /** prevents multiple leading zeros from being entered */
            right = autoStrip(right, settingsClone); /** if right is not empty and first character is not aDec, */
            if (settingsClone.trailingNegative && left.indexOf('-') === -1) {
                left = '-' + left;
                settingsClone.trailingNegative = false;
            }
            if ((left === '' || left === settingsClone.aNeg) && settingsClone.lZero === 'deny') {
                if (right > '') {
                    right = right.replace(/^0*(\d)/, '$1');
                }
            }
            var new_value = left + right; /** insert zero if has leading dot */
            if (settingsClone.aDec) {
                var m = new_value.match(new RegExp('^' + settingsClone.aNegRegAutoStrip + '\\' + settingsClone.aDec));
                if (m) {
                    left = left.replace(m[1], m[1] + '0');
                    new_value = left + right;
                }
            }
            return [left, right];
        },

        /**
         * set part of number to value keeping position of cursor
         */
        setValueParts: function (left, right, paste) {
            var settingsClone = this.settingsClone,
                parts = this.normalizeParts(left, right),
                new_value = parts.join(''),
                position = parts[0].length;
            if (autoCheck(new_value, settingsClone)) {
                new_value = truncateDecimal(new_value, settingsClone, paste);
                var test_value = (new_value.indexOf(',') !== -1) ? new_value.replace(',', '.') : new_value,
                    text_value = test_value;
                if (test_value === '' || test_value === settingsClone.aNeg) {
                    settingsClone.rawValue = '';
                } else {
                    settingsClone.rawValue = text_value;
                }
                if (position > new_value.length) {
                    position = new_value.length;
                }
                this.value = new_value;
                this.setPosition(position, false);
                return true;
            }
            return false;
        },

        /**
         * helper function for expandSelectionOnSign
         * returns sign position of a formatted value
         */
        signPosition: function () {
            var settingsClone = this.settingsClone,
                aSign = settingsClone.aSign,
                that = this.that;
            if (aSign) {
                var aSignLen = aSign.length;
                if (settingsClone.pSign === 'p') {
                    var hasNeg = settingsClone.aNeg && that.value && that.value.charAt(0) === settingsClone.aNeg;
                    return hasNeg ? [1, aSignLen + 1] : [0, aSignLen];
                }
                var valueLen = that.value.length;
                return [valueLen - aSignLen, valueLen];
            }
            return [1000, -1];
        },

        /**
         * expands selection to cover whole sign
         * prevents partial deletion/copying/overwriting of a sign
         */
        expandSelectionOnSign: function (setReal) {
            var sign_position = this.signPosition(),
                selection = this.selection;
            if (selection.start < sign_position[1] && selection.end > sign_position[0]) { /** if selection catches something except sign and catches only space from sign */
                if ((selection.start < sign_position[0] || selection.end > sign_position[1]) && this.value.substring(Math.max(selection.start, sign_position[0]), Math.min(selection.end, sign_position[1])).match(/^\s*$/)) { /** then select without empty space */
                    if (selection.start < sign_position[0]) {
                        this.setSelection(selection.start, sign_position[0], setReal);
                    } else {
                        this.setSelection(sign_position[1], selection.end, setReal);
                    }
                } else { /** else select with whole sign */
                    this.setSelection(Math.min(selection.start, sign_position[0]), Math.max(selection.end, sign_position[1]), setReal);
                }
            }
        },

        /**
         * try to strip pasted value to digits
         */
        checkPaste: function () {
            if (this.valuePartsBeforePaste !== undefined) {
                var parts = this.getBeforeAfter(),
                    oldParts = this.valuePartsBeforePaste;
                delete this.valuePartsBeforePaste; /** try to strip pasted value first */
                parts[0] = parts[0].substr(0, oldParts[0].length) + autoStrip(parts[0].substr(oldParts[0].length), this.settingsClone);
                if (!this.setValueParts(parts[0], parts[1], 'paste')) {
                    this.value = oldParts.join('');
                    this.setPosition(oldParts[0].length, false);
                }
            }
        },

        /**
         * process pasting, cursor moving and skipping of not interesting keys
         * if returns true, further processing is not performed
         */
        skipAllways: function (e) {
            var kdCode = this.kdCode,
                which = this.which,
                ctrlKey = this.ctrlKey,
                cmdKey = this.cmdKey,
                shiftKey = this.shiftKey; /** catch the ctrl up on ctrl-v */
            if (((ctrlKey || cmdKey) && e.type === 'keyup' && this.valuePartsBeforePaste !== undefined) || (shiftKey && kdCode === 45)) {
                this.checkPaste();
                return false;
            }
            /** codes are taken from http://www.cambiaresearch.com/c4/702b8cd1-e5b0-42e6-83ac-25f0306e3e25/Javascript-Char-Codes-Key-Codes.aspx
             * skip Fx keys, windows keys, other special keys
             */
            if ((kdCode >= 112 && kdCode <= 123) || (kdCode >= 91 && kdCode <= 93) || (kdCode >= 9 && kdCode <= 31) || (kdCode < 8 && (which === 0 || which === kdCode)) || kdCode === 144 || kdCode === 145 || kdCode === 45 || kdCode === 224) {
                return true;
            }
            if ((ctrlKey || cmdKey) && kdCode === 65) { /** if select all (a=65)*/
                if (this.settings.sNumber) {
                    e.preventDefault();
                    var valueLen = this.that.value.length,
                        aSignLen = this.settings.aSign.length,
                        negLen = (this.that.value.indexOf('-') === -1) ? 0 : 1,
                        aSuffixLen =  this.settings.aSuffix.length,
                        pSign = this.settings.pSign,
                        pNeg =  this.settings.pNeg,
                        start = (pSign === 's') ? 0 : (pNeg === 'l' && negLen === 1 && aSignLen > 0) ? aSignLen + 1 : aSignLen,
                        end = (pSign === 'p') ? valueLen - aSuffixLen : (pNeg === 'l') ? valueLen - (aSuffixLen + aSignLen) : (pNeg === 'r') ? (aSignLen > 0) ? valueLen - (aSignLen + negLen + aSuffixLen) : valueLen - (aSignLen + aSuffixLen) : valueLen - (aSignLen + aSuffixLen);
                    setElementSelection(this.that, start, end);
                }
                return true;
            }
            if ((ctrlKey || cmdKey) && (kdCode === 67 || kdCode === 86 || kdCode === 88)) { /** if copy (c=67) paste (v=86) or cut (x=88) */
                if (e.type === 'keydown') {
                    this.expandSelectionOnSign();
                }
                if (kdCode === 86 || kdCode === 45) { /** try to prevent wrong paste */
                    if (e.type === 'keydown' || e.type === 'keypress') {
                        if (this.valuePartsBeforePaste === undefined) {
                            this.valuePartsBeforePaste = this.getBeforeAfter();
                        }
                    } else {
                        this.checkPaste();
                    }
                }
                return e.type === 'keydown' || e.type === 'keypress' || kdCode === 67;
            }
            if (ctrlKey || cmdKey) {
                return true;
            }
            if (kdCode === 37 || kdCode === 39) { /** jump over thousand separator */
                var aSep = this.settingsClone.aSep,
                    aDec = this.settingsClone.aDec,
                    startJump = this.selection.start,
                    value = this.that.value;
                if (e.type === 'keydown' && !this.shiftKey) {
                    if (kdCode === 37 && (value.charAt(startJump - 2) === aSep || value.charAt(startJump - 2) === aDec)) {
                        this.setPosition(startJump - 1);
                    } else if (kdCode === 39 && (value.charAt(startJump + 1) === aSep || value.charAt(startJump + 1) === aDec)) {
                        this.setPosition(startJump + 1);
                    }
                }
                return true;
            }
            if (kdCode >= 34 && kdCode <= 40) {
                return true;
            }
            return false;
        },

        /**
         * process deletion of characters when the minus sign is to the right of the numeric characters
         */
        processTrailing: function (parts) {
            var settingsClone = this.settingsClone;
            if (settingsClone.pSign === 'p' && settingsClone.pNeg === 's') {
                if (this.kdCode === 8) {
                    settingsClone.caretFix = (this.selection.start >= this.value.indexOf(settingsClone.aSuffix) && settingsClone.aSuffix !== '') ? true : false;
                    if (this.value.charAt(this.selection.start - 1) === '-') {
                        parts[0] = parts[0].substring(1);
                    } else if (this.selection.start <= this.value.length - settingsClone.aSuffix.length) {
                        parts[0] = parts[0].substring(0, parts[0].length - 1);
                    }
                } else {
                    settingsClone.caretFix = (this.selection.start >= this.value.indexOf(settingsClone.aSuffix) && settingsClone.aSuffix !== '') ? true : false;
                    if (this.selection.start >= this.value.indexOf(settingsClone.aSign) + settingsClone.aSign.length) {
                        parts[1] = parts[1].substring(1, parts[1].length);
                    }
                    if (parts[0].indexOf('-') > -1 && this.value.charAt(this.selection.start) === '-') {
                        parts[0] = parts[0].substring(1);
                    }
                }
            }
            if (settingsClone.pSign === 's' && settingsClone.pNeg === 'l') {
                settingsClone.caretFix = (this.selection.start >=  this.value.indexOf(settingsClone.aNeg) + settingsClone.aNeg.length) ? true : false;
                if (this.kdCode === 8) {
                    if (this.selection.start === (this.value.indexOf(settingsClone.aNeg) + settingsClone.aNeg.length) && this.value.indexOf(settingsClone.aNeg) !== -1) {
                        parts[0] = parts[0].substring(1);
                    } else if (parts[0] !== '-' && ((this.selection.start <= this.value.indexOf(settingsClone.aNeg)) || this.value.indexOf(settingsClone.aNeg) === -1)) {
                        parts[0] = parts[0].substring(0, parts[0].length - 1);
                    }
                } else {
                    if (parts[0][0] === '-') {
                        parts[1] = parts[1].substring(1);
                    }
                    if (this.selection.start === this.value.indexOf(settingsClone.aNeg) && this.value.indexOf(settingsClone.aNeg) !== -1) {
                        parts[0] = parts[0].substring(1);
                    }
                }
            }
            if (settingsClone.pSign === 's' && settingsClone.pNeg === 'r') {
                settingsClone.caretFix = (this.selection.start >=  this.value.indexOf(settingsClone.aNeg) + settingsClone.aNeg.length) ? true : false;
                if (this.kdCode === 8) {
                    if (this.selection.start === (this.value.indexOf(settingsClone.aNeg) + settingsClone.aNeg.length)) {
                        parts[0] = parts[0].substring(1);
                    } else if (parts[0] !== '-' && this.selection.start <= (this.value.indexOf(settingsClone.aNeg) - settingsClone.aSign.length)) {
                        parts[0] = parts[0].substring(0, parts[0].length - 1);
                    } else if (parts[0] !== '' && this.value.indexOf(settingsClone.aNeg) === -1) {
                        parts[0] = parts[0].substring(0, parts[0].length - 1);
                    }
                } else {
                    settingsClone.caretFix = (this.selection.start >= this.value.indexOf(settingsClone.aSign) && settingsClone.aSign !== '') ? true : false;
                    if (this.selection.start === this.value.indexOf(settingsClone.aNeg)) {
                        parts[0] = parts[0].substring(1);
                    }
                    parts[1] = parts[1].substring(1);
                }
            }
            return parts;
        },

        /**
         * process deletion of characters
         * returns true if processing performed
         */
        processAllways: function () {
            var settingsClone = this.settingsClone,
                parts = [];
            if (this.kdCode === 8 || this.kdCode === 46) {
                if (!this.selection.length) {
                    parts = this.getBeforeAfterStriped();
                    if ((settingsClone.pSign === 'p' && settingsClone.pNeg === 's') || (settingsClone.pSign === 's' && settingsClone.pNeg !== 'p')) {
                        parts = this.processTrailing(parts);
                    } else {
                        if (this.kdCode === 8) {
                            parts[0] = parts[0].substring(0, parts[0].length - 1);
                        } else {
                            parts[1] = parts[1].substring(1, parts[1].length);
                        }
                    }
                    this.setValueParts(parts[0], parts[1]);
                } else {
                    this.expandSelectionOnSign(false);
                    parts = this.getBeforeAfterStriped();
                    this.setValueParts(parts[0], parts[1]);
                }
                return true;
            }
            return false;
        },

        /**
         * process insertion of characters
         * returns true if processing performed
         */
        processKeypress: function () {
            var settingsClone = this.settingsClone,
                cCode = String.fromCharCode(this.which),
                parts = this.getBeforeAfterStriped(),
                left = parts[0],
                right = parts[1];
            /** start rules when the decimal character key is pressed always use numeric pad dot to insert decimal separator */
            if (cCode === settingsClone.aDec || (settingsClone.altDec && cCode === settingsClone.altDec) || ((cCode === '.' || cCode === ',') && this.kdCode === 110)) { /** do not allow decimal character if no decimal part allowed */
                if (!settingsClone.mDec || !settingsClone.aDec) {
                    return true;
                } /** do not allow decimal character before aNeg character */
                if (settingsClone.aNeg && right.indexOf(settingsClone.aNeg) > -1) {
                    return true;
                } /** do not allow decimal character if other decimal character present */
                if (left.indexOf(settingsClone.aDec) > -1) {
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
            if (cCode === '-' || cCode === '+') { /** prevent minus if not allowed */
                if (!settingsClone) {
                    return true;
                } /** caret is always after minus */
                if ((settingsClone.pSign === 'p' && settingsClone.pNeg === 's') || (settingsClone.pSign === 's' && settingsClone.pNeg !== 'p')) {
                    if (left === '' && right.indexOf(settingsClone.aNeg) > -1) {
                        left = settingsClone.aNeg;
                        right = right.substring(1, right.length);
                    } /** change sign of number, remove part if should */
                    if (left.charAt(0) === '-' || left.indexOf(settingsClone.aNeg) !== -1) {
                        left = left.substring(1, left.length);
                    } else {
                        left = (cCode === '-') ? settingsClone.aNeg + left : left;
                    }
                } else {
                    if (left === '' && right.indexOf(settingsClone.aNeg) > -1) {
                        left = settingsClone.aNeg;
                        right = right.substring(1, right.length);
                    } /** change sign of number, remove part if should */
                    if (left.charAt(0) === settingsClone.aNeg) {
                        left = left.substring(1, left.length);
                    } else {
                        left = (cCode === '-') ? settingsClone.aNeg + left : left;
                    }
                }
                this.setValueParts(left, right, null);
                return true;
            }
            if (cCode >= '0' && cCode <= '9') { /** if try to insert digit before minus */
                if (settingsClone.aNeg && left === '' && right.indexOf(settingsClone.aNeg) > -1) {
                    left = settingsClone.aNeg;
                    right = right.substring(1, right.length);
                }
                if (settingsClone.vMax <= 0 && settingsClone.vMin < settingsClone.vMax && this.value.indexOf(settingsClone.aNeg) === -1 && cCode !== '0') {
                    left = settingsClone.aNeg + left;
                }
                this.setValueParts(left + cCode, right, null);
                return true;
            } /** prevent any other character */
            return true;
        },

        /**
         * formatting of just processed value with keeping of cursor position
         */
        formatQuick: function (e) {
            var settingsClone = this.settingsClone,
                parts = this.getBeforeAfterStriped(),
                leftLength = this.value,
                kuCode = e.keyCode;
                /** no grouping separator and no currency sign */
            if ((settingsClone.aSep === '' || (settingsClone.aSep !== '' && leftLength.indexOf(settingsClone.aSep) === -1)) && (settingsClone.aSign === '' || (settingsClone.aSign !== '' && leftLength.indexOf(settingsClone.aSign) === -1))) {
                var subParts = [],
                    nSign = '';
                subParts = leftLength.split(settingsClone.aDec);
                if (subParts[0].indexOf('-') > -1) {
                    nSign = '-';
                    subParts[0] = subParts[0].replace('-', '');
                    parts[0] = parts[0].replace('-', '');
                }
                if (nSign === '' && subParts[0].length > settingsClone.mIntPos && parts[0].charAt(0) === '0') { /** strip leading zero on positive value if need */
                    parts[0] = parts[0].slice(1);
                }
                if (nSign === '-' && subParts[0].length > settingsClone.mIntNeg && parts[0].charAt(0) === '0') { /** strip leading zero on negative value if need */
                    parts[0] = parts[0].slice(1);
                }
                parts[0] = nSign + parts[0];
            }
            var value = autoGroup(this.value, this.settingsClone);
            var position = value.length;
            if (value) {
                /** prepare regexp which searches for cursor position from unformatted left part */
                var left_ar = parts[0].split(''),
                    i = 0;
                /** fixes caret position with trailing minus sign */
                if ((settingsClone.pNeg === 's' || (settingsClone.pSign === 's' && settingsClone.pNeg !== 'p')) && left_ar[0] === '-' && settingsClone.aNeg !== '') {
                    left_ar.shift();
                    if (settingsClone.pSign === 's' && settingsClone.pNeg === 'l' && (kuCode === 8 || this.kdCode === 8 || kuCode === 46 || this.kdCode === 46) && settingsClone.caretFix) {
                        left_ar.push('-');
                        settingsClone.caretFix = (e.type === 'keydown') ? true : false;
                    }
                    if (settingsClone.pSign === 'p' && settingsClone.pNeg === 's' && (kuCode === 8 || this.kdCode === 8 || kuCode === 46 || this.kdCode === 46) && settingsClone.caretFix) {
                        left_ar.push('-');
                        settingsClone.caretFix = (e.type === 'keydown') ? true : false;
                    }
                    if (settingsClone.pSign === 's' && settingsClone.pNeg === 'r' && (kuCode === 8 || this.kdCode === 8 || kuCode === 46 || this.kdCode === 46) && settingsClone.caretFix) {
                        var signParts = settingsClone.aSign.split(''),
                            escapeChr = ['\\', '^', '$', '.', '|', '?', '*', '+', '(', ')', '['],
                            escapedParts = [],
                            escapedSign = '';
                        $.each(signParts, function (i, miniParts) {
                            miniParts = signParts[i];
                            if ($.inArray(miniParts, escapeChr) !== -1) {
                                escapedParts.push('\\' + miniParts);
                            } else {
                                escapedParts.push(miniParts);
                            }
                        });
                        if (kuCode === 8 || this.kdCode === 8) {
                            escapedParts.push('-');
                        }
                        escapedSign = escapedParts.join('');
                        left_ar.push(escapedSign);
                        settingsClone.caretFix = (e.type === 'keydown') ? true : false;
                    }
                }
                for (i; i < left_ar.length; i += 1) { /** thanks Peter Kovari */
                    if (!left_ar[i].match('\\d')) {
                        left_ar[i] = '\\' + left_ar[i];
                    }
                }
                var leftReg = new RegExp('^.*?' + left_ar.join('.*?')),
                    newLeft = value.match(leftReg); /** search cursor position in formatted value */
                if (newLeft) {
                    position = newLeft[0].length;
                    /** if we are just before sign which is in prefix position */
                    if (((position === 0 && value.charAt(0) !== settingsClone.aNeg) || (position === 1 && value.charAt(0) === settingsClone.aNeg)) && settingsClone.aSign && settingsClone.pSign === 'p') {
                        /** place caret after prefix sign */
                        position = this.settingsClone.aSign.length + (value.charAt(0) === '-' ? 1 : 0);
                    }
                } else {
                    if (settingsClone.aSign && settingsClone.pSign === 's') {
                        /** if we could not find a place for cursor and have a sign as a suffix */
                        /** place caret before suffix currency sign */
                        position -= settingsClone.aSign.length;
                    }
                    if (settingsClone.aSuffix) {
                        /** if we could not find a place for cursor and have a suffix */
                        /** place caret before suffix */
                        position -= settingsClone.aSuffix.length;
                    }
                }
            }
            this.that.value = value;
            this.setPosition(position);
            this.formatted = true;
        }
    };

    /**
     * thanks to Anthony & Evan C
     */
    function autoGet(obj) {
        if (typeof obj === 'string') {
            obj = obj.replace(/\[/g, "\\[").replace(/\]/g, "\\]");
            obj = '#' + obj.replace(/(:|\.)/g, '\\$1');
            /** obj = '#' + obj.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1'); */
            /** possible modification to replace the above 2 lines */
        }
        return $(obj);
    }

    /**
     * function to attach data to the element
     * and imitate the holder
     */
    function getHolder($that, settings, update) {
        var data = $that.data('autoNumeric');
        if (!data) {
            data = {};
            $that.data('autoNumeric', data);
        }
        var holder = data.holder;
        if ((holder === undefined && settings) || update) {
            holder = new AutoNumericHolder($that.get(0), settings);
            data.holder = holder;
        }
        return holder;
    }

    /**
     * original settings saved for use when eDec & nSep options are being used
     */
    function originalSettings(settings) {
        settings.oDec = settings.mDec;
        settings.oPad = settings.aPad;
        settings.oBracket = settings.nBracket;
        settings.oSep = settings.aSep;
        settings.oSign = settings.aSign;
        return settings;
    }

    /**
     * original settings saved for use when eDec & nSep options are being used
     * taken from Quirksmode
     */
    function readCookie(name) {
        var nameEQ = name + "=",
            ca = document.cookie.split(';'),
            i = 0,
            c = '';
        for (i; i < ca.length; i += 1) {
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
     * Test if sessionStorage is supported - taken from moderizr
     */
    function storageTest() {
        var mod = 'modernizr';
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
            var storedName = ($this[0].name !== '' && $this[0].name !== undefined) ? 'AUTO_' + decodeURIComponent($this[0].name) : 'AUTO_' + $this[0].id;
            if (storageTest() === false) { /** sets cookie for browser that do not support sessionStorage IE 6 & ie7 */
                if (toDo === 'get') {
                    return readCookie(storedName);
                }
                if (toDo === 'set') {
                    document.cookie = storedName + '=' + settings.rawValue + '; expires= ; path=/';
                }
                if (toDo === 'wipe') {
                    var date = new Date();
                    date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));
                    var expires = "; expires=" + date.toGMTString();
                    document.cookie = storedName + '="" ;' + expires + '; path=/';
                }
            } else {
                if (toDo === 'get') {
                    return sessionStorage.getItem(storedName);
                }
                if (toDo === 'set') {
                    sessionStorage.setItem(storedName, settings.rawValue);
                }
                if (toDo === 'wipe') {
                    sessionStorage.removeItem(storedName);
                }
            }
        }
        return;
    }

    /**
     * Methods supported by autoNumeric
     */
    var methods = {

        /**
         * Method to initiate autoNumeric and attached the settings (default and options passed as a parameter
         * $(someSelector).autoNumeric('init'); // initiate autoNumeric with defaults
         * $(someSelector).autoNumeric('init', {option}); // initiate autoNumeric with options
         * $(someSelector).autoNumeric(); // initiate autoNumeric with defaults
         * $(someSelector).autoNumeric({option}); // initiate autoNumeric with options
         * options passes as a parameter example '{aSep: '.', aDec: ',', aSign: '€ '}
         */
        init: function (options) {
            return this.each(function () {
                var $this = $(this),
                    /** attempt to grab 'autoNumeric' settings, if they don't exist returns "undefined". */
                    settings = $this.data('autoNumeric'),
                    /** attempt to grab HTML5 data, if they don't exist we'll get "undefined".*/
                    tagData = $this.data(),
                    /** supported input types*/
                    $input = $this.is('input[type=text], input[type=hidden], input[type=tel], input:not([type])');
                $.each(tagData, function (key, value) {
                    if (typeof value ===  'number') {
                        tagData[key] = value.toString();
                    }
                });
                if (typeof settings !== 'object') { /** If we couldn't grab settings, create them from defaults and passed options. */
                    settings = $.extend({}, $.fn.autoNumeric.defaults, tagData, options, {
                        aNum: '0123456789',
                        onOff: false,
                        runOnce: false,
                        rawValue: '',
                        trailingNegative: false,
                        caretFix: false,
                        tagList: ['b', 'caption', 'cite', 'code', 'dd', 'del', 'div', 'dfn', 'dt', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ins', 'kdb', 'label', 'li', 'option', 'output', 'p', 'q', 's', 'sample', 'span', 'strong', 'td', 'th', 'u', 'var']
                    }); /** Merge defaults, tagData and options */
                    if (settings.aDec === settings.aSep) {
                        throwErr('autoNumeric will not function properly when the decimal character aDec: "' + settings.aDec + '" and thousand separator aSep: "' + settings.aSep + '" are the same character', settings.debug);
                    }
                    $.each(settings, function (key, value) {
                        if (value ===  'true' || value ===  'false') {
                            settings[key] = (value === 'true') ? true : false;
                        }
                    });
                    $this.data('autoNumeric', settings); /** Save our new settings */
                } else {
                    return this;
                }
                settings = originalSettings(settings); /** original settings saved for use when eDec & nSep options are being used */
                var holder = getHolder($this, settings);
                if (!$input && $this.prop('tagName').toLowerCase() === 'input') { /** checks for non-supported input types */
                    throwErr('The input type "' + $this.prop('type') + '" is not supported by autoNumeric()', settings.debug);
                }
                if ($.inArray($this.prop('tagName').toLowerCase(), settings.tagList) === -1 && $this.prop('tagName').toLowerCase() !== 'input') { /** checks for non-supported tags */
                    throwErr('The "<' + $this.prop('tagName').toLowerCase() + '>" is not supported by autoNumeric()', settings.debug);
                }
                if (settings.aDec === settings.aSep) { /** checks if the decimal and thousand are characters are the same */
                    throwErr('autoNumeric will not function properly when the decimal character aDec: "' + settings.aDec + '" and thousand separator aSep: "' + settings.aSep + '" are the same character', settings.debug);
                }
                if (settings.eDec < settings.mDec && settings.eDec !== null) { /** checks the extended decimal places "eDec" is greater than the normal decimal places "mDec" */
                    throwErr('autoNumeric will not function properly when the extended decimal places "eDec: ' + settings.eDec + '" is greater than mDec: "' + settings.mDec + '" value', settings.debug);
                }
                /** routine to format default value on page load */
                if (settings.runOnce === false && settings.aForm) {
                    var setValue = true;
                    if ($input) {
                        /** checks for page reload from back button
                         * also checks for ASP.net form post back
                         * the following HTML data attribute is REQUIRED (data-an-default="same value as the value attribute")
                         * example: <asp:TextBox runat="server" id="someID" text="1234.56" data-an-default="1234.56">
                         */
                        if ((settings.anDefault !== null && settings.anDefault.toString() !== $this.val()) || (settings.anDefault === null && $this.val() !== '' && $this.val() !== $this.attr('value')) || ($this.val() !== '' && $this.attr('type') === 'hidden' && !$.isNumeric($this.val().replace(',', '.')))) {
                            if (settings.eDec !== null && settings.aStor) {
                                settings.rawValue = autoSave($this, settings, 'get');
                            }
                            if (!settings.aStor) {
                                var toStrip = '';
                                if (settings.nBracket !== null && settings.aNeg !== '') {
                                    settings.onOff = true;
                                    toStrip = negativeBracket($this.val(), settings);
                                } else {
                                    toStrip = $this.val();
                                }
                                settings.rawValue = ((settings.pNeg === 's' || (settings.pSign === 's' && settings.pNeg !== 'p')) && settings.aNeg !== '' && $this.val().indexOf('-') > -1) ? '-' + autoStrip(toStrip, settings) : autoStrip(toStrip, settings);
                            }
                            setValue = false;
                        }
                        if ($this.val() === '' && settings.wEmpty === 'focus') {
                            setValue = false;
                        }
                        if ($this.val() === '' && settings.wEmpty === 'always') {
                            $this.val(settings.aSign);
                            setValue = false;
                        }
                        if (setValue && $this.val() !== '' && $this.val() === $this.attr('value')) {
                            $this.autoNumeric('set', $this.val());
                        }
                    }
                    if ($.inArray($this.prop('tagName').toLowerCase(), settings.tagList) !== -1 && $this.text() !== '') {
                        $this.autoNumeric('set', $this.text());
                    }
                }
                settings.runOnce = true;
                if ($input) { /**input types supported "text", "hidden", "tel" and no type*/
                    $this.on('keydown.autoNumeric', function (e) {
                        holder = getHolder($this);
                        if (holder.that.readOnly) {
                            holder.processed = true;
                            return true;
                        }
                        /** The below streamed code / comment allows the "enter" keydown to throw a change() event */
                        /** if (e.keyCode === 13 && holder.inVal !== $this.val()){
                            $this.change();
                            holder.inVal = $this.val();
                        }*/
                        holder.init(e);
                        if (holder.skipAllways(e)) {
                            holder.processed = true;
                            return true;
                        }
                        if (holder.processAllways()) {
                            holder.processed = true;
                            holder.formatQuick(e);
                            $this.trigger('input'); /** throws input event in deletion character */
                            e.preventDefault();
                            return false;
                        }
                        holder.formatted = false;
                        return true;
                    });
                    $this.on('keypress.autoNumeric', function (e) {
                        if (e.shiftKey && e.keyCode === 45) { /** FF fix for Shift && insert paste event */
                            return;
                        }
                        holder = getHolder($this);
                        var processed = holder.processed;
                        holder.init(e);
                        if (holder.skipAllways(e)) {
                            return true;
                        }
                        if (processed) {
                            e.preventDefault();
                            return false;
                        }
                        if (holder.processAllways() || holder.processKeypress()) {
                            holder.formatQuick(e);
                            $this.trigger('input'); /** throws input event on adding character */
                            e.preventDefault();
                            return;
                        }
                        holder.formatted = false;
                    });
                    $this.on('keyup.autoNumeric', function (e) {
                        holder = getHolder($this);
                        holder.init(e);
                        var skip = holder.skipAllways(e);
                        holder.kdCode = 0;
                        delete holder.valuePartsBeforePaste;
                        if ($this[0].value === holder.settingsClone.aSign) { /** added to properly place the caret when only the currency is present */
                            if (holder.settingsClone.pSign === 's') {
                                setElementSelection(this, 0, 0);
                            } else {
                                setElementSelection(this, holder.settingsClone.aSign.length, holder.settingsClone.aSign.length);
                            }
                        }
                        if ($this[0].value === holder.settingsClone.aSuffix) {
                            setElementSelection(this, 0, 0);
                        }
                        if (holder.settingsClone.rawValue === '' && holder.settingsClone.aSign !== '' && holder.settingsClone.aSuffix !== '') {
                            setElementSelection(this, 0, 0);
                        }
                        if (holder.settingsClone.eDec !== null && holder.settingsClone.aStor) { /** saves the extended decimal to preserve the data when navigating away from the page */
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
                    $this.on('focusin.autoNumeric', function () {
                        holder = getHolder($this);
                        var $settings = holder.settingsClone;
                        $settings.onOff = true;
                        if ($settings.nBracket !== null && $settings.aNeg !== '') {
                            $this.val(negativeBracket($this.val(), $settings));
                        }
                        if ($settings.nSep === true) {
                            $settings.aSep = '';
                            $settings.aSign = '';
                        }
                        if ($settings.eDec !== null) {
                            $settings.mDec = $settings.eDec;
                            $this.autoNumeric('set', $settings.rawValue);
                        } else {
                            $this.autoNumeric('set', $settings.rawValue);
                        }
                        holder.inVal = $this.val();
                        var onEmpty = checkEmpty(holder.inVal, $settings, true);
                        if ((onEmpty !== null && onEmpty !== '') && $settings.wEmpty === 'focus') {
                            $this.val(onEmpty);
                        }
                    });
                    $this.on('focusout.autoNumeric', function () {
                        holder = getHolder($this);
                        var value = $this.val(),
                            origValue = value,
                            $settings = holder.settingsClone;
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
                        if (value !== '') {
                            value = autoStrip(value, $settings);
                            if ($settings.trailingNegative) {
                                value = '-' + value;
                                $settings.trailingNegative = false;
                            }
                            if (checkEmpty(value, $settings) === null && autoCheck(value, $settings, $this[0])) {
                                value = fixNumber(value, $settings.aDec, $settings.aNeg);
                                $settings.rawValue = value;
                                value = autoRound(value, $settings);
                                value = presentNumber(value, $settings.aDec, $settings.aNeg);
                            } else {
                                value = '';
                                $settings.rawValue = '';
                            }
                        } else {
                            $settings.rawValue = '';
                        }
                        var groupedValue = checkEmpty(value, $settings, false);
                        if (groupedValue === null) {
                            groupedValue = autoGroup(value, $settings);
                        }
                        if (groupedValue !== origValue) {
                            $this.val(groupedValue);
                        }
                        if (groupedValue !== holder.inVal) {
                            $this.change();
                            delete holder.inVal;
                        }
                    });
                    $this.closest('form').on('submit.autoNumeric', function () {
                        holder = getHolder($this);
                        var $settings = holder.settingsClone;
                        if ($settings.unSetOnSubmit) {
                            $this.val($settings.rawValue);
                        }

                    });
                }
            });
        },

        /**
         * method to remove settings and stop autoNumeric() - does not remove the formatting
         * $(someSelector).autoNumeric('destroy'); // destroys autoNumeric
         * no parameters accepted
         */
        destroy: function () {
            return $(this).each(function () {
                var $this = autoGet($(this)),
                    settings = $this.data('autoNumeric');
                $this.val('');
                autoSave($this, settings, 'wipe');
                $this.off('.autoNumeric');
                $this.removeData('autoNumeric');
            });
        },

        /**
         * method to clear the value and sessionStorage or cookie depending on browser supports
         * $(someSelector).autoNumeric('wipe'); // removes session storage and cookies from memory
         * no parameters accepted
         */
        wipe: function () {
            return $(this).each(function () {
                var $this = autoGet($(this)),
                    settings = $this.data('autoNumeric');
                if (typeof settings === 'object') {
                    $this.val('');
                    settings.rawValue = '';
                    autoSave($this, settings, 'wipe');
                }
            });
        },

        /**
         * method to update settings - can be call as many times
         * $(someSelector).autoNumeric('update', {options}); // updates the settings
         * options passed as a parameter example '{aSep: '.', aDec: ',', aSign: '€ '}
         */
        update: function (options) {
            return $(this).each(function () {
                var $this = autoGet($(this)),
                    settings = $this.data('autoNumeric');
                if (typeof settings !== 'object') {
                    throwErr('Initializing autoNumeric is required prior to calling the "update" method', true);
                }
                var strip = $this.autoNumeric('get');
                settings = $.extend(settings, options);
                settings = originalSettings(settings);
                getHolder($this, settings, true);
                if (settings.aDec === settings.aSep) {
                    throwErr('autoNumeric will not function properly when the decimal character aDec: "' + settings.aDec + '" and thousand separator aSep: "' + settings.aSep + '" are the same character', settings.debug);
                }
                $this.data('autoNumeric', settings);
                if ($this.val() !== '' || $this.text() !== '') {
                    return $this.autoNumeric('set', strip);
                }
                return;
            });
        },

        /**
         * method to format value sent as a parameter ""
         * $(someSelector).autoNumeric('set', 'value'}); // formats the value being passed
         * value passed as a string - can be a integer '1234' or double '1234.56789'
         * must contain only numbers and one decimal (period) character
         */
        set: function (valueIn) {
            return $(this).each(function () {
                if (valueIn === null) {
                    return;
                }
                var $this = autoGet($(this)),
                    settings = $this.data('autoNumeric'),
                    value = valueIn.toString(),
                    $input = $this.is('input[type=text], input[type=hidden], input[type=tel], input:not([type])');
                if (typeof settings !== 'object') {
                    throwErr('Initializing autoNumeric is required prior to calling the "set" method', true);
                }
                /** allows locale decimal separator to be a comma - no thousand separator allowed */
                value = convertLocale(value);
                /** Throws an error if the value being set is not numeric */
                if (!$.isNumeric(Number(value))) {
                    throwErr('The value "' + value + '" being "set" is not numeric and has caused a error to be thrown', settings.debug);
                }
                if (value !== '') {
                    if (autoCheck(value, settings)) {
                        if ($input && settings.eDec !== null) {
                            settings.rawValue = value;
                        }
                        if ($input || $.inArray($this.prop('tagName').toLowerCase(), settings.tagList) !== -1) { /** checks if the value falls within the min max range */
                            value = autoRound(value, settings);
                            if (settings.eDec === null) {
                                settings.rawValue = value;
                            }
                            value = presentNumber(value, settings.aDec, settings.aNeg);
                            value = autoGroup(value, settings);
                        }
                        if (settings.aStor && settings.eDec !== null) {
                            autoSave($this, settings, 'set');
                        }
                    } else {
                        settings.rawValue = '';
                        autoSave($this, settings, 'wipe');
                        value = '';
                        throwErr('The value being set falls outside the min: "' + settings.vMin + ' max: "' + settings.vMax + '" ) settings for this element', settings.debug);
                        return '';
                    }
                } else {
                    return '';
                }
                if ($input) {
                    return $this.val(value);
                }
                if ($.inArray($this.prop('tagName').toLowerCase(), settings.tagList) !== -1) {
                    return $this.text(value);
                }
                return false;
            });
        },

        /**
         * method to un-format inputs - handy to use right before form submission
         * $(someSelector).autoNumeric('unSet'); // parameter optional
         * $(someSelector).autoNumeric('unSet', 'komma'); // returns string '1234,56' with a komma as the decimal character
         * $(someSelector).autoNumeric('unSet', 'checkOptions'); // returns string '1234.56' or '1234.56' depending of the format setting for the input
         */
        unSet: function (outPut) {
            return $(this).each(function () {
                var $this = autoGet($(this)),
                    settings = $this.data('autoNumeric');
                if (typeof settings === 'object') {
                    settings.onOff = true;
                    $this.val($this.autoNumeric('get', outPut));
                }
            });
        },

        /**
         * method to re-format inputs - handy to use right after form submission
         * $(someSelector).autoNumeric('reSet'); // no parameters accepted
         * this is called after the 'unSet' method to reformat the input
         */
        reSet: function () {
            return $(this).each(function () {
                var $this = autoGet($(this)),
                    settings = $this.data('autoNumeric');
                if (typeof settings === 'object') {
                    $this.autoNumeric('set', $this.val());
                }
            });
        },

        /**
         * method to get the unformatted that accepts up to one parameter
         * $(someSelector).autoNumeric('get'); no parameter used - values returned as ISO numeric string "1234.56" where the decimal character is a period
         * $(someSelector).autoNumeric('get', 'asKomma'); values returned as strings "nnnn,nn" where the comma / komma is the decimal character
         * $(someSelector).autoNumeric('get', 'checkOptions'); values returned as strings - either as "nnnn.nn" or "nnnn,mm" depending of the format setting for the input
         * only the first element in the selector is returned
         */
        get: function (outPut) {
            var $this = autoGet($(this)),
                settings = $this.data('autoNumeric'),
                $input = $this.is('input[type=text], input[type=hidden], input[type=tel], input:not([type])');
            if (typeof settings !== 'object') {
                throwErr('Initializing autoNumeric is required prior to calling the "get" method', true);
            }
            var getValue = '';
            /** determine the element type then use .eq(0) selector to grab the value of the first element in selector */
            if ($input) {
                getValue = $this.eq(0).val();
            } else if ($.inArray($this.prop('tagName').toLowerCase(), settings.tagList) !== -1) {
                getValue = $this.eq(0).text();
            } else {
                throwErr('The "<' + $this.prop('tagName').toLowerCase() + '>" is not supported by autoNumeric()', settings.debug);
            }
            if (settings.rawValue !== '') {
                getValue = settings.rawValue;
            }
            if ((!/\d/.test(getValue) || Number(getValue) === 0) && settings.wEmpty === 'focus') {
                return '';
            }
            if (getValue !== '' && settings.nBracket !== null) {
                settings.onOff = true;
                getValue = negativeBracket(getValue, settings);
            }
            getValue = fixNumber(getValue, settings.aDec, settings.aNeg);
            if (Number(getValue) === 0 && settings.lZero !== 'keep') {
                getValue = '0';
            }
            if (outPut === ',') {
                getValue = getValue.replace('.', ',');
            }
            if (outPut === '.-' && getValue.indexOf('-') > -1) {
                getValue = getValue.replace('-', '') + '-';
            }
            if (outPut === ',-' && getValue.indexOf('-') > -1) {
                getValue = getValue.replace('.', ',').replace('-', '') + '-';
            }
            return getValue; /** returned Numeric String */
        },

        /**
         * The 'getString' method used jQuerys .serialize() method that creates a text string in standard URL-encoded notation
         * it then loops through the string and un-formats the inputs with autoNumeric
         * $(someSelector).autoNumeric('getString'); no parameter used - values returned as ISO numeric string "1234.56" where the decimal character is a period
         * $(someSelector).autoNumeric('getString', 'asKomma'); values returned as strings "nnnn,nn" where the comma / komma is the decimal character
         * $(someSelector).autoNumeric('getString', 'checkOptions'); values returned as strings - either as "nnnn.nn" or "nnnn,mm" depending of the format setting for the input
         */
        getString: function (outPut) {
            var $this = autoGet($(this)),
                formFields = $this.serialize(),
                formParts = formFields.split('&'),
                formIndex = $('form').index($this),
                allFormElements = $('form:eq(' + formIndex + ')'),
                aiIndex = [], /** all input index */
                scIndex = [], /** successful control index */
                rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i, /* from jQuery serialize method */
                rsubmittable = /^(?:input|select|textarea|keygen)/i, /* from jQuery serialize method */
                rcheckableType = /^(?:checkbox|radio)$/i,
                rnonAutoNumericTypes = /^(?:button|checkbox|color|date|datetime|datetime-local|email|file|image|month|number|password|radio|range|reset|search|submit|time|url|week)/i,
                count = 0;
            /*jslint unparam: true*/
            /** index of successful elements */
            $.each(allFormElements[0], function (i, field) {
                if (field.name !== '' && rsubmittable.test(field.localName) && !rsubmitterTypes.test(field.type) && !field.disabled && (field.checked || !rcheckableType.test(field.type))) {
                    scIndex.push(count);
                    count = count + 1;
                } else {
                    scIndex.push(-1);
                }
            });
            /** index of all inputs tags except checkbox */
            count = 0;
            $.each(allFormElements[0], function (i, field) {
                if (field.localName === 'input' && (field.type === '' || field.type === 'text' || field.type === 'hidden' || field.type === 'tel')) {
                    aiIndex.push(count);
                    count = count + 1;
                } else {
                    aiIndex.push(-1);
                    if (field.localName === 'input' && rnonAutoNumericTypes.test(field.type)) {
                        count = count + 1;
                    }
                }
            });
            $.each(formParts, function (i, miniParts) {
                miniParts = formParts[i].split('=');
                var scElement = $.inArray(i, scIndex);
                if (scElement > -1 && aiIndex[scElement] > -1) {
                    var testInput = $('form:eq(' + formIndex + ') input:eq(' + aiIndex[scElement] + ')'),
                        settings = testInput.data('autoNumeric');
                    if (typeof settings === 'object') {
                        if (miniParts[1] !== null) {
                            miniParts[1] = $('form:eq(' + formIndex + ') input:eq(' + aiIndex[scElement] + ')').autoNumeric('get', outPut).toString();
                            formParts[i] = miniParts.join('=');
                        }
                    }
                }
            });
            /*jslint unparam: false*/
            return formParts.join('&');
        },

        /**
         * The 'getString' method used jQuerys .serializeArray() method that creates array or objects that can be encoded as a JSON string
         * it then loops through the string and un-formats the inputs with autoNumeric
         * $(someSelector).autoNumeric('getArray'); no parameter used - values returned as ISO numeric string "1234.56" where the decimal character is a period
         * $(someSelector).autoNumeric('getArray', 'asKomma'); values returned as strings "nnnn,nn" where the comma / komma is the decimal character
         * $(someSelector).autoNumeric('getArray', 'checkOptions'); values returned as strings - either as "nnnn.nn" or "nnnn,mm" depending of the format setting for the input
         */
        getArray: function (outPut) {
            var $this = autoGet($(this)),
                formFields = $this.serializeArray(),
                formIndex = $('form').index($this),
                allFormElements = $('form:eq(' + formIndex + ')'),
                aiIndex = [], /* all input index */
                scIndex = [], /* successful control index */
                rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i, /* from jQuery serialize method */
                rsubmittable = /^(?:input|select|textarea|keygen)/i, /* from jQuery serialize method */
                rcheckableType = /^(?:checkbox|radio)$/i,
                rnonAutoNumericTypes = /^(?:button|checkbox|color|date|datetime|datetime-local|email|file|image|month|number|password|radio|range|reset|search|submit|time|url|week)/i,
                count = 0;
            /*jslint unparam: true*/
            /* index of successful elements */
            $.each(allFormElements[0], function (i, field) {
                if (field.name !== '' && rsubmittable.test(field.localName) && !rsubmitterTypes.test(field.type) && !field.disabled && (field.checked || !rcheckableType.test(field.type))) {
                    scIndex.push(count);
                    count = count + 1;
                } else {
                    scIndex.push(-1);
                }
            });
            /* index of all inputs tags */
            count = 0;
            $.each(allFormElements[0], function (i, field) {
                if (field.localName === 'input' && (field.type === '' || field.type === 'text' || field.type === 'hidden' || field.type === 'tel')) {
                    aiIndex.push(count);
                    count = count + 1;
                } else {
                    aiIndex.push(-1);
                    if (field.localName === 'input' && rnonAutoNumericTypes.test(field.type)) {
                        count = count + 1;
                    }
                }
            });
            $.each(formFields, function (i, field) {
                var scElement = $.inArray(i, scIndex);
                if (scElement > -1 && aiIndex[scElement] > -1) {
                    var testInput = $('form:eq(' + formIndex + ') input:eq(' + aiIndex[scElement] + ')'),
                        settings = testInput.data('autoNumeric');
                    if (typeof settings === 'object') {
                        field.value = $('form:eq(' + formIndex + ') input:eq(' + aiIndex[scElement] + ')').autoNumeric('get', outPut).toString();
                    }
                }
            });
            /*jslint unparam: false*/
            return formFields;
        },

        /**
         * The 'getSteetings returns the object with autoNumeric settings for those who need to look under the hood
         * $(someSelector).autoNumeric('getSettings'); // no parameters accepted
         * $(someSelector).autoNumeric('getSettings').aDec; // return the aDec setting as a string - ant valid setting can be used
         */
        getSettings: function () {
            var $this = autoGet($(this));
            return $this.eq(0).data('autoNumeric');
        }
    };

    /**
     * autoNumeric function
     */
    $.fn.autoNumeric = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
        throwErr('Method "' + method + '" is not supported by autoNumeric()', true);
    };

    /**
     * Defaults are public - these can be overridden by the following:
     * HTML5 data attributes
     * Options passed by the 'init' or 'update' methods
     * Use jQuery's $.extend method for global changes - also a great way to pass ASP.NET current culture settings
     */
    $.fn.autoNumeric.defaults = {
        /** allowed thousand separator characters
         * comma = ','
         * period "full stop" = '.'
         * apostrophe is escaped = '\''
         * space = ' '
         * none = ''
         * NOTE: do not use numeric characters
         */
        aSep: ',',
        /** when true => when the input has focus only the decimal character is visible
         */
        nSep: false,
        /** digital grouping for the thousand separator used in Format
         * dGroup: '2', results in 99,99,99,999 India's lakhs
         * dGroup: '2s', results in 99,999,99,99,999 India's lakhs scaled
         * dGroup: '3', results in 999,999,999 default
         * dGroup: '4', results in 9999,9999,9999 used in some Asian countries
         */
        dGroup: '3',
        /** allowed decimal separator characters
         * period "full stop" = '.'
         * comma = ','
         */
        aDec: '.',
        /** allow to declare alternative decimal separator which is automatically replaced by aDec
         * developed for countries the use a comma ',' as the decimal character
         * and have keyboards\numeric pads that have a period 'full stop' as the decimal characters (Spain is an example)
         */
        altDec: null,
        /** aSign = allowed currency symbol
         * Must be in quotes aSign: '$'
         * space to the right of the currency symbol aSign: '$ '
         * space to the left of the currency symbol aSign: ' $'
         */
        aSign: '',
        /** pSign = placement of currency sign as a p=prefix or s=suffix
         * for prefix pSign: 'p' (default)
         * for suffix pSign: 's'
         */
        pSign: 'p',
        /** placement of negative sign relative to the aSign option l=left, r=right, p=prefix & s=suffix
         * -1,234.56  => defaults no options required
         * 1,234.56-  => {pNeg: 's'}
         * -$1,234.56 => {aSign: '$'}
         * $-1,234.56 => {aSign: '$', pNeg: 'r'}
         * $1,234.56- => {aSign: '$', pNeg: 's'}
         * 1,234.56-$ => {aSign: '$', pSign: 's'}
         * 1,234.56$- => {aSign: '$', pSign: 's', pNeg: 'r'}
         * -1,234.56$ => {aSign: '$', pSign: 's', pNeg: 'p'}
         */
        pNeg: 'l',
        /** Additional suffix
         * Must be in quotes aSuffix: 'gross', a space is allowed aSuffix: ' dollars'
         * Numeric characters and negative sign not allowed'
         */
        aSuffix: '',
        /** maximum possible value
         * value must be enclosed in quotes and use the period for the decimal point
         * value must be larger than vMin
         */
        vMax: '9999999999999.99',
        /** minimum possible value
         * value must be enclosed in quotes and use the period for the decimal point
         * value must be smaller than vMax
         */
        vMin: '-9999999999999.99',
        /** Maximum number of decimal places = used to override decimal places set by the vMin & vMax values
         * value must be enclosed in quotes example mDec: '3',
         */
        mDec: null,
        /** Expanded decimal places visible when input has focus
         * value must be enclosed in quotes example mDec: '3',
         */
        eDec: null,
        /** Set to true to allow the eDec value to be saved with sessionStorage
         * if ie 6 or 7 the value will be saved as a session cookie
         */
        aStor: false,
        /** method used for rounding
         * mRound: 'S', Round-Half-Up Symmetric (default)
         * mRound: 'A', Round-Half-Up Asymmetric
         * mRound: 's', Round-Half-Down Symmetric (lower case s)
         * mRound: 'a', Round-Half-Down Asymmetric (lower case a)
         * mRound: 'B', Round-Half-Even "Bankers Rounding"
         * mRound: 'U', Round Up "Round-Away-From-Zero"
         * mRound: 'D', Round Down "Round-Toward-Zero" - same as truncate
         * mRound: 'C', Round to Ceiling "Toward Positive Infinity"
         * mRound: 'F', Round to Floor "Toward Negative Infinity"
         * mRound: 'N05' Rounds to the nearest .05
         * mRound: 'U05' Rounds up to next .05
         * mRound: 'D05' Rounds down to next .05
         */
        mRound: 'S',
        /** controls decimal padding
         * aPad: true - always Pad decimals with zeros
         * aPad: false - does not pad with zeros.
         * aPad: `some number` - pad decimals with zero to number different from mDec
         * thanks to Jonas Johansson for the suggestion
         */
        aPad: true,
        /** places brackets on negative value -$ 999.99 to (999.99)
         * visible only when the field does NOT have focus the left and right symbols should be enclosed in quotes and separated by a comma
         * nBracket: null - (default)
         * nBracket: '(,)', nBracket: '[,]', nBracket: '<,>' or nBracket: '{,}'
         */
        nBracket: null,
        /** Displayed on empty string ""
         * wEmpty: 'focus' - (default) currency sign displayed and the input receives focus
         * wEmpty: 'press' - currency sign displays on any key being pressed
         * wEmpty: 'always' - always displays the currency sign
         */
        wEmpty: 'focus',
        /** controls leading zero behavior
         * lZero: 'allow', - allows leading zeros to be entered. Zeros will be truncated when entering additional digits. On focusout zeros will be deleted.
         * lZero: 'deny', - allows only one leading zero on values less than one
         * lZero: 'keep', - allows leading zeros to be entered. on focusout zeros will be retained.
         */
        lZero: 'allow',
        /** determine if the default value will be formatted on page ready.
         * true = automatically formats the default value on page ready
         * false = will not format the default value
         */
        aForm: true,
        /** determine if the select all keyboard command will select
         * the complete input text or only the input numeric value
         * if the currency symbol is between the numeric value and the negative sign only the numeric value will selected
         */
        sNumber: false,
        /** helper option for ASP.NET postback
         * should be the value of the unformatted default value
         * examples:
         * no default value='' {anDefault: ''}
         * value=1234.56 {anDefault: '1234.56'}
         */
        anDefault: null,
        /** removes formatting on submit event
         * this output format: positive nnnn.nn, negative -nnnn.nn
         * review the 'unSet' method for other formats
         */
        unSetOnSubmit: false,
        /** error handling function
         * true => all errors are thrown - helpful in site development
         * false => throws errors when calling methods prior to the supported element has been initialized be autoNumeric
         */
        debug: true
    };
}(jQuery, window, document));