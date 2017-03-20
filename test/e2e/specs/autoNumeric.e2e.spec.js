/**
 * End-to-end tests for autoNumeric.js
 * @author Alexandre Bonneau <alexandre.bonneau@linuxfr.eu>
 * @copyright © 2017 Alexandre Bonneau
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

// eslint-disable-next-line
/* global describe, it, xdescribe, xit, fdescribe, fit, expect, beforeEach, afterEach, spyOn, require, process, browser, $ */

// Note : A list of named keys can be found here : https://github.com/webdriverio/webdriverio/blob/master/lib/helpers/constants.js#L67


//-----------------------------------------------------------------------------
// ---- Configuration

// Url to the end-to-end test page
const testUrl = '/e2e';

// Object that holds the references to the input we test
const selectors = {
    inputClassic          : '#classic',
    issue283Input0        : '#issue283Input0',
    issue283Input1        : '#issue283Input1',
    issue283Input2        : '#issue283Input2',
    issue283Input3        : '#issue283Input3',
    issue283Input4        : '#issue283Input4',
    issue183error         : '#issue_183_error',
    issue183ignore        : '#issue_183_ignore',
    issue183clamp         : '#issue_183_clamp',
    issue183truncate      : '#issue_183_truncate',
    issue183replace       : '#issue_183_replace',
    issue326input         : '#issue_326',
    issue322input         : '#issue_322',
    issue317input         : '#issue_317',
    issue306input         : '#issue_306',
    issue306inputDecimals : '#issue_306decimals',
    issue306inputDecimals2: '#issue_306decimals2',
    issue303inputNonAn    : '#issue_303non_an',
    issue303inputP        : '#issue_303p',
    issue303inputS        : '#issue_303s',
    issue403a             : '#issue_403a',
    issue403b             : '#issue_403b',
    issue403c             : '#issue_403c',
};

//-----------------------------------------------------------------------------
// ---- Helper functions

/*
 function helperGetCaretPosition(wdioElement) { //FIXME Find a way to allow using helper functions inside webdriver.io `execute()` blocks
 console.log('wdioElement:', wdioElement); //DEBUG
 // console.log('this:', this); //DEBUG
 const selector = wdioElement.selector;
 console.log('selector:', selector); //DEBUG

 const element = document.querySelector(selector);
 console.log('element.selectionStart:', element.selectionStart); //DEBUG
 return element.selectionStart;
 }
 */


//-----------------------------------------------------------------------------
// ---- Tests

xdescribe('webdriver.io page', () => {
    it('should have the right title - the fancy generator way', () => {
        browser.url('http://webdriver.io');
        const title = browser.getTitle();
        expect(title).toEqual('WebdriverIO - Selenium 2.0 javascript bindings for nodejs');
    });
});

describe('webdriver.io runner', () => {
    it(`should be able to send basic keys to basic inputs (which we'll use later for copy-pasting text strings)`, () => {
        browser.url(testUrl);

        // Test the initial values
        const title = browser.getTitle();
        expect(title).toEqual('End-to-end testing for autoNumeric');
        expect(browser.getValue(selectors.inputClassic)).toEqual('987654321');

        // Focus in that input
        const inputClassic = $(selectors.inputClassic);
        inputClassic.click();

        // Enter some keys
        browser.keys('End'); // 'chromedriver' does not automatically modify the caret position, so we need to set it up ourselves
        browser.keys('teststring');
        expect(browser.getValue(selectors.inputClassic)).toEqual('987654321teststring');
        // browser.keys('Home'); // This works!
        browser.keys(['ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft']);
        browser.keys('YES!');
        expect(browser.getValue(selectors.inputClassic)).toEqual('987654321teststYES!ring');
        browser.keys(['ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft']);
        browser.keys('0');
        browser.keys('1');
        expect(browser.getValue(selectors.inputClassic)).toEqual('987654321te01ststYES!ring');

        /*
         expect(helperGetCaretPosition(inputClassic)).toEqual(42); //FIXME This cannot be called correctly
         const result = browser.getCaretPosition(inputClassic); //FIXME This cannot be called correctly
         expect(result).toEqual(19);
         */

        // Hold some modifier keys
        browser.keys('End');
        browser.keys(['ArrowLeft']);
        browser.keys('Shift'); // This activates the shift key from now on
        browser.keys([
            'ArrowLeft',
            'ArrowLeft',
            'ArrowLeft',
            'ArrowLeft',
            'ArrowLeft',
            'ArrowLeft',
            'ArrowLeft',
            'ArrowLeft',
            'ArrowLeft',
            'ArrowLeft',
            'ArrowLeft',
            'ArrowLeft',
            'ArrowLeft',
            'ArrowLeft',
            'ArrowLeft',
            'ArrowLeft',
            'ArrowLeft',
            'ArrowLeft',
        ]);
        browser.keys('NULL'); // This deactivates any modifiers key (I could have used `browser.keys('Shift');` again to toggle it off)
        browser.keys('foobar');
        expect(browser.getValue(selectors.inputClassic)).toEqual('987654foobarg');
    });
});

describe('Issue #327 (using inputs from issue #183)', () => {
    it('should tests for default values', () => {
        browser.url(testUrl);

        /* eslint space-in-parens: 0 */
        expect(browser.getValue(selectors.issue183error   )).toEqual('12.345.678,00 €');
        expect(browser.getValue(selectors.issue183ignore  )).toEqual('12.345.678,00 €');
        expect(browser.getValue(selectors.issue183clamp   )).toEqual('$ 12.345.678,00');
        expect(browser.getValue(selectors.issue183truncate)).toEqual('12.345.678,00 €');
        expect(browser.getValue(selectors.issue183replace )).toEqual('12.345.678,00 €');
    });

    it(`should show the correct number of decimal places on focus, with 'decimalPlacesShownOnFocus' set to a specific value`, () => {
        browser.url(testUrl);

        // Focus in that input
        const input = $(selectors.issue183error);
        input.click();
        expect(browser.getValue(selectors.issue183error)).toEqual('12.345.678,00000 €');
    });

    it(`should get the entire input selected when using the 'tab' key`, () => {
        browser.url(testUrl);

        // Focus in that first input
        const input = $(selectors.issue183error);
        input.click();

        // Then 'tab' on each other inputs
        browser.keys('Tab');
        // Check the text selection
        let inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue_183_ignore');
            return { start: input.selectionStart, end: input.selectionEnd };
        }).value;
        expect(inputCaretPosition.start).toEqual(0);
        expect(inputCaretPosition.end).toEqual(15);

        browser.keys('Tab');
        // Check the text selection
        inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue_183_clamp');
            return { start: input.selectionStart, end: input.selectionEnd };
        }).value;
        expect(inputCaretPosition.start).toEqual(0);
        expect(inputCaretPosition.end).toEqual(15);

        browser.keys('Tab');
        // Check the text selection
        inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue_183_truncate');
            return { start: input.selectionStart, end: input.selectionEnd };
        }).value;
        expect(inputCaretPosition.start).toEqual(0);
        expect(inputCaretPosition.end).toEqual(15);

        browser.keys('Tab');
        // Check the text selection
        inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue_183_replace');
            return { start: input.selectionStart, end: input.selectionEnd };
        }).value;
        expect(inputCaretPosition.start).toEqual(0);
        expect(inputCaretPosition.end).toEqual(15);
    });
});

describe('Issue #306', () => {
    it('should tests for default values', () => {
        browser.url(testUrl);

        expect(browser.getValue(selectors.issue306input)).toEqual('');
    });

    it(`should allow entering '0.0'`, () => {
        // Focus in that input
        const input = $(selectors.issue306input);
        input.click();

        // Modify the input value
        browser.keys('0');
        expect(browser.getValue(selectors.issue306input)).toEqual('0');

        // Check the caret position
        let inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue_306');
            return input.selectionStart;
        }).value;
        expect(inputCaretPosition).toEqual(1);


        // Modify the input value
        browser.keys('Backspace');
        expect(browser.getValue(selectors.issue306input)).toEqual('');
        browser.keys('.');
        expect(browser.getValue(selectors.issue306input)).toEqual('0.');

        // Check the caret position
        inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue_306');
            return input.selectionStart;
        }).value;
        expect(inputCaretPosition).toEqual(2);


        browser.keys('0');
        expect(browser.getValue(selectors.issue306input)).toEqual('0.0');

        // Check the caret position
        inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue_306');
            return input.selectionStart;
        }).value;
        expect(inputCaretPosition).toEqual(3);
    });

    it(`should move the caret correctly while in the decimal places`, () => {
        // Manage the second case
        // Focus in that input
        const input = $(selectors.issue306inputDecimals);
        input.click();

        // Modify the input value
        expect(browser.getValue(selectors.issue306inputDecimals)).toEqual('');
        browser.keys('0,00000');
        expect(browser.getValue(selectors.issue306inputDecimals)).toEqual('0,00000');
        browser.keys(['Home', 'ArrowRight', '12345']);
        expect(browser.getValue(selectors.issue306inputDecimals)).toEqual('0,12345');
        browser.keys(['Home', 'ArrowRight', '00000']);
        expect(browser.getValue(selectors.issue306inputDecimals)).toEqual('0,00000');
        let inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue_306decimals');
            return input.selectionStart;
        }).value;
        expect(inputCaretPosition).toEqual(7);

        // Tests that it does not allow adding a leading 0
        browser.keys(['Home', '0']);
        inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue_306decimals');
            return input.selectionStart;
        }).value;
        expect(inputCaretPosition).toEqual(0);

        // Tests that entering a 0 while in the decimal places moves the caret to the right
        browser.keys(['ArrowRight', '0']);
        inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue_306decimals');
            return input.selectionStart;
        }).value;
        expect(inputCaretPosition).toEqual(3);
        // ...and another
        browser.keys('0');
        inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue_306decimals');
            return input.selectionStart;
        }).value;
        expect(inputCaretPosition).toEqual(4);
        // ...and another
        browser.keys('0');
        inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue_306decimals');
            return input.selectionStart;
        }).value;
        expect(inputCaretPosition).toEqual(5);
        // ...and another
        browser.keys('0');
        inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue_306decimals');
            return input.selectionStart;
        }).value;
        expect(inputCaretPosition).toEqual(6);
        // ...and another
        browser.keys('0');
        inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue_306decimals');
            return input.selectionStart;
        }).value;
        expect(inputCaretPosition).toEqual(7);
        // ...and another that should be dropped
        browser.keys('0');
        inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue_306decimals');
            return input.selectionStart;
        }).value;
        expect(inputCaretPosition).toEqual(7);
    });

    it(`should move the caret correctly while in the decimal places, without having to setup any sequence of inputs`, () => {
        // Manage the last case
        // Focus in that input
        const input = $(selectors.issue306inputDecimals2);
        input.click();

        // Modify the input value
        browser.setValue(selectors.issue306inputDecimals2, '50000,00');
        expect(browser.getValue(selectors.issue306inputDecimals2)).toEqual('50.000,00');
        browser.keys(['End', 'ArrowLeft', 'ArrowLeft', 'ArrowRight']);
        let inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue_306decimals2');
            return input.selectionStart;
        }).value;
        expect(inputCaretPosition).toEqual(7);

        browser.keys('0');
        inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue_306decimals2');
            return input.selectionStart;
        }).value;
        expect(inputCaretPosition).toEqual(8);

        browser.keys('0');
        inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue_306decimals2');
            return input.selectionStart;
        }).value;
        expect(inputCaretPosition).toEqual(9);

        browser.keys('0');
        inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue_306decimals2');
            return input.selectionStart;
        }).value;
        expect(inputCaretPosition).toEqual(9);
    });
});

describe('Issue #283', () => {
    it('should tests for default values', () => {
        browser.url(testUrl);

        expect(browser.getValue(selectors.issue283Input0)).toEqual('1.12');
        expect(browser.getValue(selectors.issue283Input1)).toEqual('1.1235');
        expect(browser.getValue(selectors.issue283Input2)).toEqual('1,124%');
        expect(browser.getValue(selectors.issue283Input3)).toEqual('8.000,00\u00a0€');
        expect(browser.getValue(selectors.issue283Input4)).toEqual('8.000,00\u00a0€');
    });

    it(`should keep the caret position when trying to input a '0' that gets rejected`, () => {
        browser.url(testUrl);

        // Test the initial value
        expect(browser.getValue(selectors.issue283Input1)).toEqual('1.1235');

        // Focus in that input
        const input = $(selectors.issue283Input1);
        input.click();

        // Change the caret position and modify its value
        browser.keys(['Home']);
        browser.keys('0');
        expect(browser.getValue(selectors.issue283Input1)).toEqual('1.1235');

        // Check the final caret position
        const inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue283Input1');
            return input.selectionStart;
        }).value;
        expect(inputCaretPosition).toEqual(0);
    });

    it(`should keep the caret position when trying to input a '0' that gets rejected on a euro number`, () => {
        browser.url(testUrl);

        // Test the initial value
        expect(browser.getValue(selectors.issue283Input4)).toEqual('8.000,00\u00a0€');

        // Focus in that input
        const input = $(selectors.issue283Input4);
        input.click();

        // Change the caret position and modify its value
        browser.keys(['Home']);
        browser.keys('0');
        expect(browser.getValue(selectors.issue283Input4)).toEqual('8.000,00\u00a0€');

        // Check the final caret position
        const inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue283Input4');
            return input.selectionStart;
        }).value;
        expect(inputCaretPosition).toEqual(0);
    });

    it(`should insert a '0' and move the caret position when leadingZero is 'allow'`, () => {
        browser.url(testUrl);

        // Test the initial value
        expect(browser.getValue(selectors.issue283Input3)).toEqual('8.000,00\u00a0€');

        // Focus in that input
        const input = $(selectors.issue283Input3);
        input.click();

        // Change the caret position and modify its value
        browser.keys(['Home']);
        browser.keys('0');
        expect(browser.getValue(selectors.issue283Input3)).toEqual('08.000,00\u00a0€');

        // Check the final caret position
        const inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue283Input3');
            return input.selectionStart;
        }).value;
        expect(inputCaretPosition).toEqual(1);
    });

    it(`should insert a '0' when in the middle of other zeros, and move the caret position`, () => {
        browser.url(testUrl);

        // Test the initial value
        expect(browser.getValue(selectors.issue283Input4)).toEqual('8.000,00\u00a0€');

        // Focus in that input
        const input = $(selectors.issue283Input4);
        input.click();

        // Change the caret position and modify its value
        browser.keys(['End', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft']); // 6 left
        browser.keys('0');
        expect(browser.getValue(selectors.issue283Input4)).toEqual('80.000,00\u00a0€');

        // Check the final caret position
        const inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue283Input4');
            return input.selectionStart;
        }).value;
        expect(inputCaretPosition).toEqual(4);
    });
});

describe('Issue #326', () => {
    it('should tests for default values, and focus on it', () => {
        browser.url(testUrl);

        expect(browser.getValue(selectors.issue326input)).toEqual('12.345.678,00 €');
    });

    it('should position the decimal character correctly on paste', () => {
        // Add a comma ',' to the classic input in order to be able to copy it with `ctrl+c`
        const inputClassic = $(selectors.inputClassic);
        inputClassic.click();
        browser.keys('End'); // 'chromedriver' does not automatically modify the caret position, so we need to set it up ourselves
        browser.keys(','); // Note : This does not set, but append the value to the current one

        // Copy ','
        browser.keys('End');
        browser.keys('Shift');
        browser.keys('ArrowLeft');
        browser.keys('Shift');
        browser.keys('Control');
        browser.keys('c');
        browser.keys('Control');
        // ',' is copied

        // Remove that ',' in order to get back to the original input state
        browser.keys('Delete');

        // Focus in the Issue #326 input
        const input = $(selectors.issue326input);
        input.click();

        // Delete the ',00 €' part
        browser.keys('End');
        browser.keys('Shift');
        browser.keys(['ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft']);
        browser.keys('Shift');
        browser.keys('Delete');

        // Move the caret position to  // 12.34|5.678 €
        browser.keys(['End', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft']);

        // Paste the comma
        browser.keys('Control');
        browser.keys('v');
        browser.keys('Control');

        // Test the resulting value
        expect(browser.getValue(selectors.issue326input)).toEqual('1.234,57 €');
    });
});


describe('Issue #322', () => {
    it('should tests for default values, and focus on it', () => {
        browser.url(testUrl);

        expect(browser.getValue(selectors.issue322input)).toEqual('12,345,678.00');
    });

    it('should paste correctly a string that contains grouping separators when pasting on a caret position', () => {
        // Add '11,1' to the classic input in order to be able to copy it with `ctrl+c`
        const inputClassic = $(selectors.inputClassic);
        inputClassic.click();
        browser.keys('End'); // 'chromedriver' does not automatically modify the caret position, so we need to set it up ourselves
        browser.keys('11,1'); // Note : This does not set, but append the value to the current one

        // Copy ','
        browser.keys('End');
        browser.keys('Shift');
        browser.keys(['ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft']);
        browser.keys('Shift');
        browser.keys('Control');
        browser.keys('c');
        browser.keys('Control');
        // '11,1' is copied

        // Remove that ',' in order to get back to the original input state
        browser.keys('Delete');

        // Focus in the issue input
        const input = $(selectors.issue322input);
        input.click();

        // Move the caret position to  // 12,345|,678.00
        browser.keys(['End', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft']);

        // Paste the clipboard content
        browser.keys('Control');
        browser.keys('v');
        browser.keys('Control');

        // Test the resulting value
        expect(browser.getValue(selectors.issue322input)).toEqual('12,345,111,678.00');

        // Check the caret position
        const inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue_322');
            return input.selectionStart;
        }).value;
        expect(inputCaretPosition).toEqual(10);
    });

    it('should paste correctly a string that contains grouping separators when pasting on a selection', () => {
        // Pre-requisite : '11,1' is still in the clipboard

        // Focus in the issue input
        const input = $(selectors.issue322input);
        input.click();

        // Re-initialize its value
        browser.setValue(selectors.issue322input, '12345678');
        expect(browser.getValue(selectors.issue322input)).toEqual('12,345,678');

        // Set the selection to  // 12,|345|,678
        browser.keys(['End', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft']);
        browser.keys('Shift');
        browser.keys(['ArrowLeft', 'ArrowLeft', 'ArrowLeft']);
        browser.keys('Shift');

        // Paste the clipboard content
        browser.keys('Control');
        browser.keys('v');
        browser.keys('Control');

        // Test the resulting value
        expect(browser.getValue(selectors.issue322input)).toEqual('12,111,678.00');

        // Check the caret position
        const inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue_322');
            return input.selectionStart;
        }).value;
        expect(inputCaretPosition).toEqual(6);
    });
});

describe('Issue #317', () => {
    it('should tests for default values, and focus on it', () => {
        browser.url(testUrl);

        expect(browser.getValue(selectors.issue317input)).toEqual('0.00');
    });

    it('should move the caret correctly when the value is zero', () => {
        // Focus in the issue input
        const input = $(selectors.issue317input);
        input.click();

        // Set the caret position to  // 0|.00
        browser.keys(['Home', 'ArrowRight', 'ArrowLeft']);

        // Try to enter a '0' that will be dropped
        browser.keys('0');

        // Check that the value did not change, and the the caret is correctly positionned
        expect(browser.getValue(selectors.issue317input)).toEqual('0.00');
        const inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue_317');
            return input.selectionStart;
        }).value;
        expect(inputCaretPosition).toEqual(1);
    });

    it('should move the caret correctly when the value is zero', () => {
        // Set the value to 2.342.423.423.423
        browser.setValue(selectors.issue317input, 2342423423423);
        browser.keys('.00'); // This is used to force autoNumeric to reformat the value, while adding the 'empty' decimal places

        // Set the caret position to  // 0|.00
        browser.keys(['End', 'ArrowLeft', 'ArrowLeft']);

        // Try to enter a '9' that will be dropped
        browser.keys('9');

        // Check that the value did not change, and the the caret is correctly positionned
        expect(browser.getValue(selectors.issue317input)).toEqual('2,342,423,423,423.00');
        let inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue_317');
            return input.selectionStart;
        }).value;
        expect(inputCaretPosition).toEqual(17);

        // Enter a decimal character that will make the caret move into the decimal place part
        // ...with the alternate decimal character
        browser.keys(',');
        expect(browser.getValue(selectors.issue317input)).toEqual('2,342,423,423,423.00');
        inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue_317');
            return input.selectionStart;
        }).value;
        expect(inputCaretPosition).toEqual(18);

        // ...with the period '.'
        browser.keys('ArrowLeft');
        browser.keys('.');
        expect(browser.getValue(selectors.issue317input)).toEqual('2,342,423,423,423.00');
        inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue_317');
            return input.selectionStart;
        }).value;
        expect(inputCaretPosition).toEqual(18);

        // ...with the numpad dot
        browser.keys('ArrowLeft');
        browser.keys('Decimal');
        expect(browser.getValue(selectors.issue317input)).toEqual('2,342,423,423,423.00');
        inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue_317');
            return input.selectionStart;
        }).value;
        expect(inputCaretPosition).toEqual(18);
    });
});

xdescribe('Issue #303', () => { //FIXME Finish this
    it('should tests for default values', () => {
        browser.url(testUrl);

        expect(browser.getValue(selectors.issue303inputP)).toEqual('');
        expect(browser.getValue(selectors.issue303inputS)).toEqual('');
    });


    it('should position the caret at the right position, depending on the currencySymbolPlacement', () => {
        // Focus in the non-an input
        const input = $(selectors.issue303inputNonAn);
        input.click();

        // Then 'tab' to the next one
        browser.keys('Tab');
        expect(browser.getValue(selectors.issue303inputP)).toEqual('$'); //FIXME This fails while it should not
        let inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue_303p');
            return input.selectionStart;
        }).value;
        expect(inputCaretPosition).toEqual(1);


        // Then 'tab' to the next one
        browser.keys('Tab');
        expect(browser.getValue(selectors.issue303inputS)).toEqual('\u00a0€'); //FIXME This fails while it should not
        inputCaretPosition = browser.execute(() => {
            const input = document.querySelector('#issue_303p');
            return input.selectionStart;
        }).value;
        expect(inputCaretPosition).toEqual(0);
    });
});

describe('Issue #403', () => {
    it('should tests for default values', () => {
        browser.url(testUrl);

        expect(browser.getValue(selectors.issue403a)).toEqual('25.00%');
    });

    it('should change the input value accordingly when focusing on the element', () => {
        const inputA = $(selectors.issue403a);
        const inputB = $(selectors.issue403b);

        // Focus in the input
        inputA.click();

        // Test the input value while the element is focused
        expect(browser.getValue(selectors.issue403a)).toEqual('0.25');

        // Focus out of the input
        inputB.click();

        // Test the input value while the element is not focused
        expect(browser.getValue(selectors.issue403a)).toEqual('25.00%');

        // Then we cycle back twice just to make sure the value stays the same while tabbing in/out
        inputA.click();
        expect(browser.getValue(selectors.issue403a)).toEqual('0.25');
        inputB.click();
        expect(browser.getValue(selectors.issue403a)).toEqual('25.00%');
        inputA.click();
        expect(browser.getValue(selectors.issue403a)).toEqual('0.25');
        inputB.click();
        expect(browser.getValue(selectors.issue403a)).toEqual('25.00%');
    });

    it('should change the input value accordingly when focusing on the element', () => {
        const inputA = $(selectors.issue403a);
        const inputB = $(selectors.issue403b);

        // Focus in the input
        inputB.click();

        // Test the input value while the element is focused
        expect(browser.getValue(selectors.issue403b)).toEqual('0.01200');

        // Focus out of the input
        inputA.click();

        // Test the input value while the element is not focused
        expect(browser.getValue(selectors.issue403b)).toEqual('1.200%');

        // Then we cycle back twice just to make sure the value stays the same while tabbing in/out
        inputB.click();
        expect(browser.getValue(selectors.issue403b)).toEqual('0.01200');
        inputA.click();
        expect(browser.getValue(selectors.issue403b)).toEqual('1.200%');

        inputB.click();
        expect(browser.getValue(selectors.issue403b)).toEqual('0.01200');
        inputA.click();
        expect(browser.getValue(selectors.issue403b)).toEqual('1.200%');
    });

    it('should change the input value accordingly when focusing on the element, with a bigger number of decimal places', () => {
        const inputB = $(selectors.issue403b);
        const inputC = $(selectors.issue403c);

        // Focus in the input
        inputC.click();
        browser.keys(['Control', 'a', 'Control', '1234567.89']);

        // Test the input value while the element is focused
        expect(browser.getValue(selectors.issue403c)).toEqual('1,234,567.89');

        // Focus out of the input
        inputB.click();

        // Test the input value while the element is not focused
        expect(browser.getValue(selectors.issue403c)).toEqual('1.23457MM');

        // Then we cycle back twice just to make sure the value stays the same while tabbing in/out
        inputC.click();
        expect(browser.getValue(selectors.issue403c)).toEqual('1,234,567.89');
        inputB.click();
        expect(browser.getValue(selectors.issue403c)).toEqual('1.23457MM');

        inputC.click();
        expect(browser.getValue(selectors.issue403c)).toEqual('1,234,567.89');
        inputB.click();
        expect(browser.getValue(selectors.issue403c)).toEqual('1.23457MM');
    });
});
