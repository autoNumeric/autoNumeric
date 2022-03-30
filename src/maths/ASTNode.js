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
 * The Abstract Syntax Tree node
 *
 * Each node carries the node information such as type (operator type), value (if it's a leaf), and the left and right branches
 */
export default class ASTNode {
    /*
    constructor() {
        // this.type = void(0);
        // this.value = 0;
        // this.left = null;
        // this.right = null;
    }
    */

    static createNode(type, left, right) {
        const node = new ASTNode();
        node.type = type;
        node.left = left;
        node.right = right;

        return node;
    }

    static createUnaryNode(left) {
        const node = new ASTNode();
        node.type = 'unaryMinus';
        node.left = left;
        node.right = null;

        return node;
    }

    static createLeaf(value) {
        const node = new ASTNode();
        node.type = 'number';
        node.value = value;

        return node;
    }
}
