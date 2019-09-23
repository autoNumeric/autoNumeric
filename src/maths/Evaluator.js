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

/**
 * Recursively evaluate the abstract syntax tree (AST) and return the result for the given sub-tree
 */
export default class Evaluator {
    constructor(ast) {
        if (ast === null) {
            throw new Error(`Invalid AST`);
        }

        // return this.evaluate(ast);
    }

    evaluate(subtree) {
        if (subtree === void(0) || subtree === null) {
            throw new Error(`Invalid AST sub-tree`);
        }

        if (subtree.type === 'number') {
            return subtree.value;
        } else if (subtree.type === 'unaryMinus') {
            return -this.evaluate(subtree.left);
        } else {
            const left  = this.evaluate(subtree.left);
            const right = this.evaluate(subtree.right);

            switch (subtree.type) {
                case 'op_+':
                    return Number(left) + Number(right);
                case 'op_-':
                    return left - right;
                case 'op_*':
                    return left * right;
                case 'op_/':
                    return left / right;
                default :
                    throw new Error(`Invalid operator '${subtree.type}'`);
            }
        }
    }
}
