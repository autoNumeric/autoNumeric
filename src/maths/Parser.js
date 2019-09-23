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

import ASTNode from './ASTNode';
import Lexer   from './Lexer';

/**
 * Math expression parser using the shunting-yard algorithm
 *
 * This implements the following BNF grammar:
 * EXP       -> TERM MORE_EXP
 * MORE_EXP  -> + TERM MORE_EXP |
 *              - TERM MORE_EXP |
 *              epsilon
 * TERM      -> FACTOR MORE_TERM
 * MORE_TERM -> * FACTOR MORE_TERM |
 *              / FACTOR MORE_TERM |
 *              epsilon
 * FACTOR    -> number |
 *             ( EXP ) |
 *             - FACTOR
 */
export default class Parser {
    /**
     * Parse the given string, and generate an abstract syntax tree (AST) from the math expression
     *
     * @param {string} text
     * @param {string} customDecimalCharacter The custom decimal character to use in floats
     * @returns {ASTNode}
     */
    constructor(text, customDecimalCharacter = '.') {
        this.text = text;
        this.decimalCharacter = customDecimalCharacter;
        this.lexer = new Lexer(text);
        this.token = this.lexer.getNextToken(this.decimalCharacter);

        return this._exp();
    }

    _exp() {
        const termNode = this._term();
        const exprNode = this._moreExp();

        //TODO Do not create an 'empty' node where this is added to 0
        return ASTNode.createNode('op_+', termNode, exprNode);
    }

    _moreExp() {
        let termNode;
        let exprNode;
        switch (this.token.type) {
            case '+':
                this.token = this.lexer.getNextToken(this.decimalCharacter);
                termNode = this._term();
                exprNode = this._moreExp();

                return ASTNode.createNode('op_+', exprNode, termNode);
            case '-':
                this.token = this.lexer.getNextToken(this.decimalCharacter);
                termNode = this._term();
                exprNode = this._moreExp();

                return ASTNode.createNode('op_-', exprNode, termNode);
        }

        return ASTNode.createLeaf(0);
    }

    _term() {
        const factorNode = this._factor();
        const termsNode = this._moreTerms();

        //TODO Do not create an 'empty' node where this is multiplied by 1
        return ASTNode.createNode('op_*', factorNode, termsNode);
    }

    _moreTerms() {
        let factorNode;
        let termsNode;
        switch (this.token.type) {
            case '*':
                this.token = this.lexer.getNextToken(this.decimalCharacter);
                factorNode = this._factor();
                termsNode = this._moreTerms();

                return ASTNode.createNode('op_*', termsNode, factorNode);
            case '/':
                this.token = this.lexer.getNextToken(this.decimalCharacter);
                factorNode = this._factor();
                termsNode = this._moreTerms();

                return ASTNode.createNode('op_/', termsNode, factorNode);
        }

        return ASTNode.createLeaf(1);
    }

    _factor() {
        let expression;
        let factor;
        let value;
        switch (this.token.type) {
            case 'num':
                value = this.token.value;
                this.token = this.lexer.getNextToken(this.decimalCharacter);

                return ASTNode.createLeaf(value);
            case '-':
                this.token = this.lexer.getNextToken(this.decimalCharacter);
                factor = this._factor();

                return ASTNode.createUnaryNode(factor);
            case '(':
                this.token = this.lexer.getNextToken(this.decimalCharacter);
                expression = this._exp();
                this._match(')');

                return expression;
            default: {
                throw new Error(`Unexpected token '${this.token.symbol}' with type '${this.token.type}' at position '${this.token.index}' in the factor function`);
            }
        }
    }

    _match(expected) {
        const index = this.lexer.getIndex() - 1;
        if (this.text[index] === expected) {
            this.token = this.lexer.getNextToken(this.decimalCharacter);
        } else {
            throw new Error(`Unexpected token '${this.token.symbol}' at position '${index}' in the match function`);
        }
    }
}
