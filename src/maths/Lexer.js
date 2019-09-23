/**
 * Math expression tokenizer/parser/evaluator functions for autoNumeric.js
 *
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

import AutoNumericHelper from '../AutoNumericHelper';
import Token             from './Token';

export default class Lexer {
    constructor(text) {
        this.text  = text;
        this.textLength = text.length;
        this.index = 0;
        this.token = new Token('Error', 0, 0);
    }

    /**
     * Ignore white spaces and increment the index count until a non-space character is found
     * @private
     */
    _skipSpaces() {
        while (this.text[this.index] === ' ' && this.index <= this.textLength) {
            this.index++;
        }
    }

    /**
     * Return the current index
     *
     * @returns {number}
     */
    getIndex() {
        return this.index;
    }

    /**
     * Return the next token object
     *
     * @param {string} decimalCharacter The decimal character to use in the float numbers
     * @returns {Token}
     */
    getNextToken(decimalCharacter = '.') {
        this._skipSpaces();

        // Test for the end of text
        if (this.textLength === this.index) {
            this.token.type = 'EOT'; // End of text

            return this.token;
        }

        // If the current character is a digit read a number
        if (AutoNumericHelper.isDigit(this.text[this.index])) {
            this.token.type  = 'num';
            this.token.value = this._getNumber(decimalCharacter);

            return this.token;
        }

        // Check if the current character is an operator or parentheses
        this.token.type = 'Error';
        switch (this.text[this.index]) {
            case '+': this.token.type = '+'; break;
            case '-': this.token.type = '-'; break;
            case '*': this.token.type = '*'; break;
            case '/': this.token.type = '/'; break;
            case '(': this.token.type = '('; break;
            case ')': this.token.type = ')'; break;
        }

        if (this.token.type !== 'Error') {
            this.token.symbol = this.text[this.index];
            this.index++;
        } else {
            throw new Error(`Unexpected token '${this.token.symbol}' at position '${this.token.index}' in the token function`);
        }

        return this.token;
    }

    /**
     * Return the integer or float number starting from the `this.index` string index
     *
     * @param {string} decimalCharacter The decimal character to use in the float numbers
     *
     * @returns {string}
     * @private
     */
    _getNumber(decimalCharacter) {
        this._skipSpaces();

        const startIndex = this.index;
        while (this.index <= this.textLength && AutoNumericHelper.isDigit(this.text[this.index])) { // Integer part
            this.index++;
        }

        if (this.text[this.index] === decimalCharacter) {
            this.index++;
        }

        while (this.index <= this.textLength && AutoNumericHelper.isDigit(this.text[this.index])) { // Decimal part, if any
            this.index++;
        }

        if (this.index === startIndex) {
            throw new Error(`No number has been found while it was expected`);
        }

        // Convert the localized float number to a Javascript number
        return this.text.substring(startIndex, this.index).replace(decimalCharacter, '.');
    }
}
