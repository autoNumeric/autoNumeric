/**
 * Options for autoNumeric.js
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

import AutoNumeric from './AutoNumeric';

/**
 * Event list managed by AutoNumeric
 *
 * @type {{correctedValue: string, initialized: string, invalidFormula: string, invalidValue: string, formatted: string, rawValueModified: string, minRangeExceeded: string, maxRangeExceeded: string, native: {input: string, change: string}, validFormula: string}}
 */
AutoNumeric.events = {
    correctedValue  : 'autoNumeric:correctedValue',
    initialized     : 'autoNumeric:initialized',
    invalidFormula  : 'autoNumeric:invalidFormula',
    invalidValue    : 'autoNumeric:invalidValue',
    formatted       : 'autoNumeric:formatted',
    rawValueModified: 'autoNumeric:rawValueModified',
    minRangeExceeded: 'autoNumeric:minExceeded',
    maxRangeExceeded: 'autoNumeric:maxExceeded',
    native          : {
        input : 'input',
        change: 'change',
    },
    validFormula    : 'autoNumeric:validFormula',
};

Object.freeze(AutoNumeric.events.native);
Object.freeze(AutoNumeric.events);
Object.defineProperty(AutoNumeric, 'events', { configurable: false, writable: false });

export default {};
