/**
 * End-to-end tests for autoNumeric.js
 * @author Alexandre Bonneau <alexandre.bonneau@linuxfr.eu>
 * @copyright © 2023 Alexandre Bonneau
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
/* global describe, it, xdescribe, xit, fdescribe, fit, expect, beforeEach, afterEach, spyOn, require, process, browser, $, toEqual */

import { Key } from 'webdriverio';

// High default timeout need when debugging the tests
/* eslint no-undef: 0 */
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
// jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999999; // Useful when using `./node_modules/.bin/wdio repl firefox` to test the Webdriver.io commands (in combination with `browser.debug()`)

//-----------------------------------------------------------------------------
// ---- Configuration

// Url to the end-to-end test page
const testUrl = 'http://localhost:2022/e2e';

// Object that holds the references to the input we test
const selectors = {
    inputClassic                      : '#classic',
    elementP1                         : '#tag_p1',
    elementP2                         : '#tag_p2',
    elementCode                       : '#tag_code',
    elementDiv                        : '#tag_div',
    elementH5                         : '#tag_h5',
    elementLabel                      : '#tag_label',
    elementSpan                       : '#tag_span',
    readOnlyElement                   : '#readOnly_option',
    noEventListenersElement           : '#noEventListeners_option',
    issue283Input0                    : '#issue283Input0',
    issue283Input1                    : '#issue283Input1',
    issue283Input2                    : '#issue283Input2',
    issue283Input3                    : '#issue283Input3',
    issue283Input4                    : '#issue283Input4',
    issue183error                     : '#issue_183_error',
    issue183ignore                    : '#issue_183_ignore',
    issue183clamp                     : '#issue_183_clamp',
    issue183truncate                  : '#issue_183_truncate',
    issue183replace                   : '#issue_183_replace',
    issue326input                     : '#issue_326',
    issue322input                     : '#issue_322',
    issue317input                     : '#issue_317',
    issue306input                     : '#issue_306',
    issue306inputDecimals             : '#issue_306decimals',
    issue306inputDecimals2            : '#issue_306decimals2',
    issue303inputNonAn                : '#issue_303non_an',
    issue303inputP                    : '#issue_303p',
    issue303inputS                    : '#issue_303s',
    issue387inputCancellable          : '#issue_387_cancellable',
    issue387inputCancellableNumOnly   : '#issue_387_cancellable_numOnly',
    issue387inputNotCancellable       : '#issue_387_not_cancellable',
    issue387inputNotCancellableNumOnly: '#issue_387_not_cancellable_numOnly',
    issue393inputNoWheel              : '#issue_393_nowheel',
    issue393inputFixed                : '#issue_393_fixed',
    issue393inputProgressive          : '#issue_393_progressive',
    issue393inputUpperLimit           : '#issue_393_upperLimit',
    issue393inputLowerLimit           : '#issue_393_lowerLimit',
    issue393inputLimitOneSideUp       : '#issue_393_limitOneSideUp',
    issue393inputLimitOneSideDown     : '#issue_393_limitOneSideDown',
    contentEditable1                  : '#contentEditable1',
    contentEditable2                  : '#contentEditable2',
    contentEditableNotActivatedYet    : '#contentEditableNotActivatedYet',
    contentEditableNotActivated       : '#contentEditableNotActivated',
    issue403a                         : '#issue_403a',
    issue403b                         : '#issue_403b',
    issue403c                         : '#issue_403c',
    negativeBrackets1                 : '#negativeBrackets1',
    negativeBrackets2                 : '#negativeBrackets2',
    negativeBrackets3                 : '#negativeBrackets3',
    negativeBrackets4                 : '#negativeBrackets4',
    negativeBrackets5                 : '#negativeBrackets5',
    negativeBracketsInput1            : '#negativeBrackets_1',
    negativeBracketsInput2            : '#negativeBrackets_2',
    negativeBracketsInput3            : '#negativeBrackets_3',
    negativeBracketsInput4            : '#negativeBrackets_4',
    negativeBracketsInput5            : '#negativeBrackets_5',
    negativeBracketsInput6            : '#negativeBrackets_6',
    negativeBracketsInput7            : '#negativeBrackets_7',
    negativeBracketsInput8            : '#negativeBrackets_8',
    remove1                           : '#remove1',
    undoRedo1                         : '#undoRedo1',
    undoRedo2                         : '#undoRedo2',
    undoRedo3                         : '#undoRedo3',
    undoRedo4                         : '#undoRedo4',
    issue423a                         : '#issue_423a',
    issue423b                         : '#issue_423b',
    issue409a                         : '#issue_409a',
    issue409n                         : '#issue_409n',
    issue409f                         : '#issue_409f',
    issue416Input1                    : '#issue_416_1',
    issue416Input2                    : '#issue_416_2',
    issue416Input3                    : '#issue_416_3',
    issue416Input4                    : '#issue_416_4',
    issue416Input5                    : '#issue_416_5',
    issue416Input6                    : '#issue_416_6',
    issue416Input7                    : '#issue_416_7',
    issue416Input8                    : '#issue_416_8',
    issue416Input9                    : '#issue_416_9',
    issue416Input10                   : '#issue_416_10',
    issue416Input11                   : '#issue_416_11',
    issue416Input12                   : '#issue_416_12',
    optionUpdate1                     : '#optionUpdate1',
    optionUpdate2                     : '#optionUpdate2',
    optionUpdate3                     : '#optionUpdate3',
    selection1                        : '#selection1',
    showOnlyNumbersOnFocusInput1      : '#showOnlyNumbersOnFocus1',
    showOnlyNumbersOnFocusInput2      : '#showOnlyNumbersOnFocus2',
    selectOnFocusA                    : '#selectOnFocusA',
    selectOnFocusB                    : '#selectOnFocusB',
    selectOnFocusC                    : '#selectOnFocusC',
    selectOnFocusD                    : '#selectOnFocusD',
    selectOnFocus1                    : '#selectOnFocus1',
    selectOnFocus2                    : '#selectOnFocus2',
    selectOnFocus3                    : '#selectOnFocus3',
    selectOnFocus4                    : '#selectOnFocus4',
    selectOnFocus5                    : '#selectOnFocus5',
    selectOnFocus6                    : '#selectOnFocus6',
    selectOnFocus7                    : '#selectOnFocus7',
    selectOnFocus8                    : '#selectOnFocus8',
    selectOnFocus9                    : '#selectOnFocus9',
    selectOnFocus10                   : '#selectOnFocus10',
    selectOnFocus11                   : '#selectOnFocus11',
    selectOnFocus12                   : '#selectOnFocus12',
    selectOnFocus13                   : '#selectOnFocus13',
    selectOnFocus14                   : '#selectOnFocus14',
    selectOnFocus15                   : '#selectOnFocus15',
    selectOnFocus16                   : '#selectOnFocus16',
    selectOnFocus17                   : '#selectOnFocus17',
    selectOnFocus18                   : '#selectOnFocus18',
    selectOnFocus19                   : '#selectOnFocus19',
    selectOnFocus20                   : '#selectOnFocus20',
    selectOnFocus21                   : '#selectOnFocus21',
    selectOnFocus22                   : '#selectOnFocus22',
    selectOnFocus23                   : '#selectOnFocus23',
    selectOnFocus24                   : '#selectOnFocus24',
    selectOnFocus25                   : '#selectOnFocus25',
    selectOnFocus26                   : '#selectOnFocus26',
    selectOnFocus27                   : '#selectOnFocus27',
    selectOnFocus28                   : '#selectOnFocus28',
    selectOnFocus29                   : '#selectOnFocus29',
    selectOnFocus30                   : '#selectOnFocus30',
    selectOnFocus31                   : '#selectOnFocus31',
    selectOnFocus32                   : '#selectOnFocus32',
    selectOnFocus33                   : '#selectOnFocus33',
    selectOnFocus34                   : '#selectOnFocus34',
    selectOnFocus35                   : '#selectOnFocus35',
    selectOnFocus36                   : '#selectOnFocus36',
    selectOnFocus37                   : '#selectOnFocus37',
    selectOnFocus38                   : '#selectOnFocus38',
    selectOnFocus39                   : '#selectOnFocus39',
    selectOnFocus40                   : '#selectOnFocus40',
    issue442One                       : '#issue_442_1',
    issue442Two                       : '#issue_442_2',
    issue442Three                     : '#issue_442_3',
    issue442Four                      : '#issue_442_4',
    issue442Submit                    : '#issue_442_submit',
    issue447                          : '#issue_447',
    result447                         : '#result_447',
    issue452                          : '#issue_452',
    issue452Unfocus                   : '#issue_452_unfocus',
    issue452Formatted                 : '#issue_452_formatted',
    result452                         : '#result_452',
    issue478Neg1                      : '#issue_478_neg1',
    issue478Neg2                      : '#issue_478_neg2',
    issue478Neg3                      : '#issue_478_neg3',
    issue478Pos1                      : '#issue_478_pos1',
    issue478Pos2                      : '#issue_478_pos2',
    issue478NegPos                    : '#issue_478_negPos',
    issue478RightPlacementNeg1        : '#issue_478_RightPlacement_neg1',
    issue478RightPlacementNeg2        : '#issue_478_RightPlacement_neg2',
    issue478RightPlacementNeg3        : '#issue_478_RightPlacement_neg3',
    issue478RightPlacementPos1        : '#issue_478_RightPlacement_pos1',
    issue478RightPlacementPos2        : '#issue_478_RightPlacement_pos2',
    issue478RightPlacementNegPos      : '#issue_478_RightPlacement_negPos',
    issue478Neg4                      : '#issue_478_neg4',
    issue527input                     : '#issue_527',
    issue527Blur                      : '#issue_527_blur',
    issue432dot                       : '#issue_432_dot',
    issue432none                      : '#issue_432_none',
    issue535                          : '#issue_535',
    issue550                          : '#issue_550',
    issue550Blur                      : '#issue_550_blur',
    issue550ChangeDetector            : '#issue_550_change_detector',
    issue550Button                    : '#issue_550_button',
    issue521                          : '#issue_521',
    issue521Set                       : '#issue_521_set',
    issue521InputDetector             : '#issue_521_input_detector',
    issue521Button                    : '#issue_521_button',
    issue574                          : '#issue_574',
    issue559                          : '#issue_559',
    issue559Default                   : '#issue_559_2',
    issue593                          : '#issue_593',
    issue593Paste                     : '#issue_593_paste',
    issue593Truncate                  : '#issue_593_truncate',
    issue594Left                      : '#issue_594_left',
    issue594Right                     : '#issue_594_right',
    issue542On                        : '#issue_542_on',
    issue542Off                       : '#issue_542_off',
    issue611HtmlReadOnly              : '#issue_611_html_readonly',
    issue611OptionReadOnly            : '#issue_611_option_readonly',
    issue611HtmlAndOptionReadOnly     : '#issue_611_html_and_option_readonly',
    issue652a                         : '#issue_652a',
    issue652b                         : '#issue_652b',
    issue652c                         : '#issue_652c',
    issue652d                         : '#issue_652d',
    issue647a                         : '#issue_647a',
    issue647b                         : '#issue_647b',
    issue656a                         : '#issue_656a',
    issue656b                         : '#issue_656b',
    issue675a                         : '#issue_675a',
    issue675b                         : '#issue_675b',
    issue675c                         : '#issue_675c',
    issue543Default                   : '#issue_543_override_default',
    issue543Invalid                   : '#issue_543_override_invalid',
    issue543Ignore                    : '#issue_543_override_ignore',
    issue543InvalidCE                 : '#issue_543_override_invalid_ce',
    issue757Form                      : '#issue_757_form',
    issue757input0                    : '#issue_757_test0',
    issue757input1                    : '#issue_757_test1',
    issue757input2                    : '#issue_757_test2',
    issue757input3                    : '#issue_757_test3',
    issue757input4                    : '#issue_757_test4',
    issue757Submit                    : '#issue_757_submit',
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

/*
describe('webdriver.io page', () => {
    it('should have the right title - the fancy generator way', () => {
        browser.url('http://webdriver.io');
        const title = browser.getTitle();
        expect(title).toEqual('WebdriverIO · Next-gen WebDriver test framework for Node.js');
    });
});
*/

describe('webdriver.io runner', () => {
    it(`should be able to send basic keys to basic inputs (which we'll use later for copy-pasting text strings)`, async () => {
        await browser.url(testUrl);
        const inputClassic = await $(selectors.inputClassic);

        // Test the initial values
        const title = await browser.getTitle();
        expect(title).toEqual('End-to-end testing for autoNumeric');
        expect(await inputClassic.getValue()).toEqual('987654321');

        // Focus in that input
        await inputClassic.click();

        // Enter some keys
        await browser.keys(Key.End); // 'chromedriver' does not automatically modify the caret position, so we need to set it up ourselves
        await browser.keys('teststring');
        expect(await inputClassic.getValue()).toEqual('987654321teststring');
        // await browser.keys(Key.Home); // This works!
        await browser.keys([Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft]);
        await browser.keys('YES!');
        expect(await inputClassic.getValue()).toEqual('987654321teststYES!ring');
        await browser.keys([Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft]);
        await browser.keys('0');
        await browser.keys('1');
        expect(await inputClassic.getValue()).toEqual('987654321te01ststYES!ring');

        /*
        expect(helperGetCaretPosition(inputClassic)).toEqual(42); //FIXME This cannot be called correctly
        const result = browser.getCaretPosition(inputClassic); //FIXME This cannot be called correctly
        expect(result).toEqual(19);
        */

        // Hold some modifier keys
        await browser.keys(Key.End);
        await browser.keys([Key.ArrowLeft]);
        await browser.keys([
            Key.Shift, // This activates the shift key from now on (do note that with the latest firefox webdriver, the Key.Shift key needs to be included in the array)
            Key.ArrowLeft,
            Key.ArrowLeft,
            Key.ArrowLeft,
            Key.ArrowLeft,
            Key.ArrowLeft,
            Key.ArrowLeft,
            Key.ArrowLeft,
            Key.ArrowLeft,
            Key.ArrowLeft,
            Key.ArrowLeft,
            Key.ArrowLeft,
            Key.ArrowLeft,
            Key.ArrowLeft,
            Key.ArrowLeft,
            Key.ArrowLeft,
            Key.ArrowLeft,
            Key.ArrowLeft,
            Key.ArrowLeft,
        ]);
        // await browser.keys('NULL'); // This deactivates any modifiers key (I could have used `await browser.keys(Key.Shift);` again to toggle it off)
        await browser.keys(Key.Shift);
        await browser.keys('foobar');
        // await browser.pause(5000); //DEBUG
        expect(await inputClassic.getValue()).toEqual('987654foobarg');
    });
});

describe('Webdriverio modifiers keys', () => {
    it('should work as before in Webdriver.io v8', async () => {
        await browser.url(testUrl);

        const inputClassic = await $(selectors.inputClassic);
        await inputClassic.setValue('12345');
        expect(await inputClassic.getValue()).toEqual('12345');

        await browser.keys([Key.Control, 'a', Key.Control, Key.Backspace]); // Key.Ctrl does not work anymore in v8
        expect(await inputClassic.getValue()).toEqual('');
    });
});

describe('Initialized non-input elements', () => {
    it('should show the same formatting as their <input> counterparts', async () => {
        await browser.url(testUrl);

        /* eslint space-in-parens: 0 */
        expect(await $(selectors.elementP1).getText()   ).toEqual('2.140%');
        expect(await $(selectors.elementP2).getText()   ).toEqual('666,42 €');
        expect(await $(selectors.elementCode).getText() ).toEqual('¥12,345.67');
        expect(await $(selectors.elementDiv).getText()  ).toEqual('$12,345.67');
        expect(await $(selectors.elementH5).getText()   ).toEqual('666.42 CHF');
        expect(await $(selectors.elementLabel).getText()).toEqual('12,345.67');
        expect(await $(selectors.elementSpan).getText() ).toEqual('');
    });
});

describe('Initialized elements with the noEventListeners option', () => {
    it('should not be created with the autoNumeric listeners', async () => {
        await browser.url(testUrl);

        // Focus in that input
        const input = await $(selectors.noEventListenersElement);
        await input.click();

        expect(await input.getValue()).toEqual('69,67 €');
        await browser.keys([Key.End, '123', Key.Home, '789']);
        expect(await input.getValue()).toEqual('78969,67 €123');
    });
});

describe('Initialized elements with the readOnly option', () => {
    it('should not be modifiable', async () => {
        await browser.url(testUrl);

        const input = await $(selectors.readOnlyElement);
        expect(await input.getValue()).toEqual('42.42');
        await browser.keys([Key.Home, '12345']);
        expect(await input.getValue()).toEqual('42.42');
    });
});

describe('Issue #327 (using inputs from issue #183)', () => {
    it('should test for default values', async () => {
        await browser.url(testUrl);

        /* eslint space-in-parens: 0 */
        expect(await $(selectors.issue183error   ).getValue()).toEqual('12.345.678,00 €');
        expect(await $(selectors.issue183ignore  ).getValue()).toEqual('12.345.678,00 €');
        expect(await $(selectors.issue183clamp   ).getValue()).toEqual('$ 12.345.678,00');
        expect(await $(selectors.issue183truncate).getValue()).toEqual('12.345.678,00 €');
        expect(await $(selectors.issue183replace ).getValue()).toEqual('12.345.678,00 €');
    });

    it(`should show the correct number of decimal places on focus, with 'decimalPlacesShownOnFocus' set to a specific value`, async () => {
        await browser.url(testUrl);

        // Focus in that input
        const input = await $(selectors.issue183error);
        await input.click();
        expect(await input.getValue()).toEqual('12.345.678,00000 €');
    });

    it(`should get the entire input selected when using the 'tab' key`, async () => {
        await browser.url(testUrl);

        // Focus in that first input
        const input = await $(selectors.issue183error);
        await input.click();

        // Then 'tab' on each other inputs
        await browser.keys(Key.Tab);
        // Check the text selection
        let inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue183ignore);
        expect(inputCaretPosition.start).toEqual(0);
        expect(inputCaretPosition.end).toEqual(13); //XXX This does not work under Firefox 45.7, but does under firefox 56. Since we only support the browsers last version - 2, let's ignore it.

        await browser.keys(Key.Tab);
        // Check the text selection
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue183clamp);
        expect(inputCaretPosition.start).toEqual(2);
        expect(inputCaretPosition.end).toEqual(15);

        await browser.keys(Key.Tab);
        // Check the text selection
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue183truncate);
        expect(inputCaretPosition.start).toEqual(0);
        expect(inputCaretPosition.end).toEqual(13);

        await browser.keys(Key.Tab);
        // Check the text selection
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue183replace);
        expect(inputCaretPosition.start).toEqual(0);
        expect(inputCaretPosition.end).toEqual(13);
    });
});

describe('Issue #306', () => {
    it('should test for default values', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue306input).getValue()).toEqual('');

        /*
        // The following code snippet shows if the browser detects that this is using the selenium geckodriver
        browser.execute(() => {
            const input306 = document.querySelector('#issue_306');
            if (window.navigator.webdriver) {
                input306.value = 'This is using the gecko webdriver.';
            } else {
                input306.value = 'This in NOT using the gecko webdriver.';
            }
        });
        browser.pause(5000);
        */
    });

    it(`should allow entering '0.0'`, async () => {
        // Focus in that input
        const input = await $(selectors.issue306input);
        await input.click();

        // Modify the input value
        await browser.keys('0');
        expect(await input.getValue()).toEqual('0');

        // Check the caret position
        let inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue306input);
        expect(inputCaretPosition).toEqual(1);


        // Modify the input value
        await browser.keys(Key.Backspace);
        expect(await input.getValue()).toEqual('');
        await browser.keys('.');
        expect(await input.getValue()).toEqual('0.');

        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue306input);
        expect(inputCaretPosition).toEqual(2);


        await browser.keys('0');
        expect(await input.getValue()).toEqual('0.0');

        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue306input);
        expect(inputCaretPosition).toEqual(3);
    });

    it(`should move the caret correctly while in the decimal places`, async () => {
        // Manage the second case
        // Focus in that input
        const input = await $(selectors.issue306inputDecimals);
        await input.click();

        // Modify the input value
        expect(await input.getValue()).toEqual('');
        await browser.keys('0,00000');
        expect(await input.getValue()).toEqual('0,00000');
        await browser.keys([Key.Home, Key.ArrowRight, '12345']);
        expect(await input.getValue()).toEqual('0,12345');
        await browser.keys([Key.Home, Key.ArrowRight, '00000']);
        expect(await input.getValue()).toEqual('0,00000');
        let inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue306inputDecimals);
        expect(inputCaretPosition).toEqual(7);

        // Tests that it does not allow adding a leading 0
        await browser.keys([Key.Home, '0']);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue306inputDecimals);
        expect(inputCaretPosition).toEqual(0);

        // Tests that entering a 0 while in the decimal places moves the caret to the right
        await browser.keys([Key.ArrowRight, '0']);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue306inputDecimals);
        expect(inputCaretPosition).toEqual(3);
        // ...and another
        await browser.keys('0');
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue306inputDecimals);
        expect(inputCaretPosition).toEqual(4);
        // ...and another
        await browser.keys('0');
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue306inputDecimals);
        expect(inputCaretPosition).toEqual(5);
        // ...and another
        await browser.keys('0');
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue306inputDecimals);
        expect(inputCaretPosition).toEqual(6);
        // ...and another
        await browser.keys('0');
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue306inputDecimals);
        expect(inputCaretPosition).toEqual(7);
        // ...and another that should be dropped
        await browser.keys('0');
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue306inputDecimals);
        expect(inputCaretPosition).toEqual(7);
    });

    it(`should move the caret correctly while in the decimal places, without having to setup any sequence of inputs`, async () => { //FIXME This does not work anymore
        // Manage the last case
        // Focus in that input
        const input = await $(selectors.issue306inputDecimals2);
        await input.click();

        // Modify the input value
        await input.setValue('50000,00');
        expect(await input.getValue()).toEqual('50.000,00');
        await browser.keys([Key.End, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowRight]);
        let inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue306inputDecimals2);
        expect(inputCaretPosition).toEqual(7);

        await browser.keys('0');
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue306inputDecimals2);
        expect(inputCaretPosition).toEqual(8);

        await browser.keys('0');
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue306inputDecimals2);
        expect(inputCaretPosition).toEqual(9);

        await browser.keys('0');
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue306inputDecimals2);
        expect(inputCaretPosition).toEqual(9);
    });
});

describe('Issue #283', () => {
    it('should test for default values', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue283Input0).getValue()).toEqual('1.12');
        expect(await $(selectors.issue283Input1).getValue()).toEqual('1.1235');
        expect(await $(selectors.issue283Input2).getValue()).toEqual('1,124%');
        expect(await $(selectors.issue283Input3).getValue()).toEqual('8.000,00\u00a0€');
        expect(await $(selectors.issue283Input4).getValue()).toEqual('8.000,00\u00a0€');
    });

    it(`should keep the caret position when trying to input a '0' that gets rejected`, async () => {
        await browser.url(testUrl);

        // Test the initial value
        const input = await $(selectors.issue283Input1);
        expect(await input.getValue()).toEqual('1.1235');

        // Focus in that input
        await input.click();

        // Change the caret position and modify its value
        await browser.keys([Key.Home]);
        await browser.keys('0');
        expect(await input.getValue()).toEqual('1.1235');

        // Check the final caret position
        const inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue283Input1);
        expect(inputCaretPosition).toEqual(0);
    });

    it(`should keep the caret position when trying to input a '0' that gets rejected on a euro number`, async () => {
        await browser.url(testUrl);

        // Test the initial value
        const input = await $(selectors.issue283Input4);
        expect(await input.getValue()).toEqual('8.000,00\u00a0€');

        // Focus in that input
        await input.click();

        // Change the caret position and modify its value
        await browser.keys([Key.Home]);
        await browser.keys('0');
        expect(await input.getValue()).toEqual('8.000,00\u00a0€');

        // Check the final caret position
        const inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue283Input4);
        expect(inputCaretPosition).toEqual(0);
    });

    it(`should insert a '0' and move the caret position when leadingZero is 'allow'`, async () => {
        await browser.url(testUrl);

        // Test the initial value
        const input = await $(selectors.issue283Input3);
        expect(await input.getValue()).toEqual('8.000,00\u00a0€');

        // Focus in that input
        await input.click();

        // Change the caret position and modify its value
        await browser.keys([Key.Home]);
        await browser.keys('0');
        expect(await input.getValue()).toEqual('08.000,00\u00a0€');

        // Check the final caret position
        const inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue283Input3);
        expect(inputCaretPosition).toEqual(1);
    });

    it(`should insert a '0' when in the middle of other zeros, and move the caret position`, async () => {
        await browser.url(testUrl);

        // Test the initial value
        const input = await $(selectors.issue283Input4);
        expect(await input.getValue()).toEqual('8.000,00\u00a0€');

        // Focus in that input
        await input.click();

        // Change the caret position and modify its value
        await browser.keys([Key.End, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft]); // 6 left
        await browser.keys('0');
        expect(await input.getValue()).toEqual('80.000,00\u00a0€');

        // Check the final caret position
        const inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue283Input4);
        expect(inputCaretPosition).toEqual(4);
    });
});

describe('Issue #326', () => {
    it('should test for default values, and focus on it', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue326input).getValue()).toEqual('12.345.678,00 €');
    });

    xit('should position the decimal character correctly on paste', async () => { //FIXME This does not work anymore in the v8 e2e test, but does manually
        // Add a comma ',' to the classic input in order to be able to copy it with `ctrl+c`
        const inputClassic = await $(selectors.inputClassic);
        await inputClassic.click();
        await browser.keys(Key.End); // 'chromedriver' does not automatically modify the caret position, so we need to set it up ourselves
        await browser.keys(','); // Note : This does not set, but append the value to the current one

        // Copy ','
        await browser.keys(Key.End);
        await browser.keys(Key.Shift);
        await browser.keys(Key.ArrowLeft);
        await browser.keys(Key.Shift);
        await browser.keys(Key.Control);
        await browser.keys('c');
        await browser.keys(Key.Control);
        // ',' is copied

        // Remove that ',' in order to get back to the original input state
        await browser.keys(Key.Delete);

        // Focus in the Issue #326 input
        const input = await $(selectors.issue326input);
        await input.click();

        // Delete the ',00 €' part
        await browser.keys(Key.End);
        await browser.keys(Key.Shift);
        await browser.keys([Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft]);
        await browser.keys(Key.Shift);
        await browser.keys(Key.Delete);

        // Move the caret position to  // 12.34|5.678 €
        await browser.keys([Key.End, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft]);

        // Paste the comma
        await browser.keys(Key.Control);
        await browser.keys('v');
        await browser.keys(Key.Control);

        // Test the resulting value
        expect(await input.getValue()).toEqual('1.234,57 €');
    });
});

xdescribe('Issue #322', () => {
    it('should test for default values, and focus on it', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue322input).getValue()).toEqual('12,345,678.00');
    });

    it('should paste correctly a string that contains grouping separators when pasting on a caret position', async () => { //FIXME This does not work anymore in the v8 e2e test, but does manually
        // Add '11,1' to the classic input in order to be able to copy it with `ctrl+c`
        const inputClassic = await $(selectors.inputClassic);
        await inputClassic.click();
        await browser.keys(Key.End); // 'chromedriver' does not automatically modify the caret position, so we need to set it up ourselves
        await browser.keys('11,1'); // Note : This does not set, but append the value to the current one

        // Copy ','
        await browser.keys(Key.End);
        await browser.keys(Key.Shift);
        await browser.keys([Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft]);
        await browser.keys(Key.Shift);
        await browser.keys(Key.Control);
        await browser.keys('c');
        await browser.keys(Key.Control);
        // '11,1' is copied

        // Remove that ',' in order to get back to the original input state
        await browser.keys(Key.Delete);

        // Focus in the issue input
        const input = await $(selectors.issue322input);
        await input.click();

        // Move the caret position to  // 12,345|,678.00
        await browser.keys([Key.End, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft]);

        // Paste the clipboard content
        await browser.keys(Key.Control);
        await browser.keys('v');
        await browser.keys(Key.Control);

        // Test the resulting value
        expect(await input.getValue()).toEqual('12,345,111,678.00');

        // Check the caret position
        const inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue322input);
        expect(inputCaretPosition).toEqual(10);
    });

    it('should paste correctly a string that contains grouping separators when pasting on a selection', async () => { //FIXME This does not work anymore in the v8 e2e test, but does manually
        // Pre-requisite : '11,1' is still in the clipboard

        // Focus in the issue input
        const input = await $(selectors.issue322input);
        await input.click();

        // Re-initialize its value
        await input.setValue('12345678');
        expect(await input.getValue()).toEqual('12,345,678');

        // Set the selection to  // 12,|345|,678
        await browser.keys([Key.End, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft]);
        await browser.keys(Key.Shift);
        await browser.keys([Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft]);
        await browser.keys(Key.Shift);

        // Paste the clipboard content
        await browser.keys(Key.Control);
        await browser.keys('v');
        await browser.keys(Key.Control);

        // Test the resulting value
        expect(await input.getValue()).toEqual('12,111,678.00');

        // Check the caret position
        const inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue322input);
        expect(inputCaretPosition).toEqual(6);
    });
});

xdescribe('Issue #527', () => { //FIXME This does not work anymore in the v8 e2e test, but does manually
    it('should test for default values, and focus on it', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue527input).getValue()).toEqual('1,357,246.81');
    });

    it('should correctly cut the number when using ctrl+x, format the result and set the caret position', async () => {
        const input = await $(selectors.issue527input);
        const inputForBlur = await $(selectors.issue527Blur);

        await input.click();
        await browser.keys(Key.Home);
        await browser.keys([Key.ArrowRight, Key.ArrowRight, Key.ArrowRight]); // 1,35|7,246.81

        // Cut
        await browser.keys(Key.Shift);
        await browser.keys([Key.ArrowRight, Key.ArrowRight, Key.ArrowRight, Key.ArrowRight]); // 1,35|7,24|6.81
        await browser.keys(Key.Shift);
        await browser.keys(Key.Control);
        await browser.keys('x');
        await browser.keys(Key.Control);
        expect(await input.getValue()).toEqual('1,356.81');

        // Blur that input
        await inputForBlur.click();

        // Then check that the input value is still the same
        expect(await input.getValue()).toEqual('1,356.81');
    });
});

describe('Issue #317', () => {
    it('should test for default values, and focus on it', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue317input).getValue()).toEqual('0.00');
    });

    it('should move the caret correctly when the value is zero', async () => {
        // Focus in the issue input
        const input = await $(selectors.issue317input);
        await input.click();

        // Set the caret position to  // 0|.00
        await browser.keys([Key.Home, Key.ArrowRight, Key.ArrowLeft]);

        // Try to enter a '0' that will be dropped
        await browser.keys('0');

        // Check that the value did not change, and that the caret is correctly positioned
        expect(await input.getValue()).toEqual('0.00');
        const inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue317input);
        expect(inputCaretPosition).toEqual(1);
    });

    it('should move the caret correctly when the value is zero', async () => {
        const input = await $(selectors.issue317input);
        // Set the value to 2.342.423.423.423
        await input.setValue(2342423423423);
        await browser.keys('.00'); // This is used to force autoNumeric to reformat the value, while adding the 'empty' decimal places

        // Set the caret position to  // 0|.00
        await browser.keys([Key.End, Key.ArrowLeft, Key.ArrowLeft]);

        // Try to enter a '9' that will be dropped
        await browser.keys('9');

        // Check that the value did not change, and that the caret is correctly positioned
        expect(await input.getValue()).toEqual('2,342,423,423,423.00');
        let inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue317input);
        expect(inputCaretPosition).toEqual(17);

        // Enter a decimal character that will make the caret move into the decimal place part
        // ...with the alternate decimal character
        await browser.keys(',');
        expect(await input.getValue()).toEqual('2,342,423,423,423.00');
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue317input);
        expect(inputCaretPosition).toEqual(18); //FIXME this places the caret at the end instead of just after the decimal character

        // ...with the period '.'
        await browser.keys(Key.ArrowLeft);
        await browser.keys('.');
        expect(await input.getValue()).toEqual('2,342,423,423,423.00');
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue317input);
        expect(inputCaretPosition).toEqual(18);

        // ...with the numpad dot
        await browser.keys(Key.ArrowLeft);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue317input);
        expect(inputCaretPosition).toEqual(17);
        /* await browser.keys(Key.Decimal); //FIXME The webdriver.io v8 changed 'Decimal' to `Key.Decimal`, and while it works manually, this now fails during the tests. Uncomment when webdriver.io has fixed this bug
        expect(await input.getValue()).toEqual('2,342,423,423,423.00');
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue317input);
        expect(inputCaretPosition).toEqual(18); */
    });
});

describe('Issue #303', () => {
    it('should test for default values', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue303inputP).getValue()).toEqual('');
        expect(await $(selectors.issue303inputS).getValue()).toEqual('');
    });


    it('should position the caret at the right position, depending on the currencySymbolPlacement', async () => {
        // Focus in the non-an input
        const input = await $(selectors.issue303inputNonAn);
        await input.click();

        // Then 'tab' to the next one
        await browser.keys(Key.Tab);
        expect(await $(selectors.issue303inputP).getValue()).toEqual('$');
        let inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue303inputP);
        expect(inputCaretPosition).toEqual(1);


        // Then 'tab' to the next one
        await browser.keys(Key.Tab);
        expect(await $(selectors.issue303inputS).getValue()).toEqual('\u00a0€');
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue303inputP);
        expect(inputCaretPosition).toEqual(0);
    });
});

describe('Issue #387', () => {
    it('should test for default values', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue387inputCancellable).getValue()).toEqual('$220,242.76');
        expect(await $(selectors.issue387inputNotCancellable).getValue()).toEqual('$220,242.76');
    });

    it('should cancel the last modifications', async () => {
        // Focus in the input
        const input = await $(selectors.issue387inputCancellable);
        await input.click();
        // Test the initial value
        expect(await input.getValue()).toEqual('$220,242.76');

        // Test that after deleting characters, we get back the original value
        await browser.keys([Key.End, Key.ArrowLeft, Key.ArrowLeft, Key.Backspace, Key.Backspace]);
        expect(await input.getValue()).toEqual('$2,202.76');
        await browser.keys([Key.Escape]);
        expect(await input.getValue()).toEqual('$220,242.76');
        // Check the text selection
        const inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue387inputCancellable);
        expect(inputCaretPosition.start).toEqual(0);
        expect(inputCaretPosition.end).toEqual('$220,242.76'.length);

        // Test that after adding characters, we get back the original value
        await browser.keys([Key.Home, Key.ArrowRight, Key.ArrowRight, Key.ArrowRight, '583']);
        expect(await input.getValue()).toEqual('$225,830,242.76');
        await browser.keys([Key.Escape]);
        expect(await input.getValue()).toEqual('$220,242.76');

        // Test that after adding and deleting characters, we get back the original value
        await browser.keys([Key.Home, Key.ArrowRight, Key.ArrowRight, Key.ArrowRight, Key.Delete, '583', Key.Delete, Key.Backspace]);
        expect(await input.getValue()).toEqual('$225,842.76');
        await browser.keys([Key.Escape]);
        expect(await input.getValue()).toEqual('$220,242.76');

        // Test that after not modifying the value, we get the same value
        // Focus in the next input
        await browser.keys([Key.Tab]);
        expect(await input.getValue()).toEqual('$220,242.76');
        // Test the initial value
        const inputCancellableNumOnly = await $(selectors.issue387inputCancellableNumOnly);
        expect(await inputCancellableNumOnly.getValue()).toEqual('$220,242.76');
        await browser.keys([Key.Home, Key.ArrowRight, Key.ArrowRight, Key.ArrowRight, Key.ArrowRight, '146']);
        expect(await inputCancellableNumOnly.getValue()).toEqual('$220,146,242.76');
        await browser.keys([Key.Backspace, Key.Backspace, Key.Backspace]);
        expect(await inputCancellableNumOnly.getValue()).toEqual('$220,242.76');
        await browser.keys([Key.Escape]);
        expect(await inputCancellableNumOnly.getValue()).toEqual('$220,242.76');
    });

    it('should select only the numbers on focus, without the currency symbol', async () => {
        // Focus in the first input
        const input = await $(selectors.issue387inputCancellable);
        await input.click();

        // Then focus in the next input
        await browser.keys([Key.Tab]);
        // Test the initial value
        expect(await $(selectors.issue387inputCancellableNumOnly).getValue()).toEqual('$220,242.76');
        // Check the text selection
        const inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue387inputCancellableNumOnly);
        // Since `selectNumberOnly` is set to `true`, the currency symbol is not selected by default
        expect(inputCaretPosition.start).toEqual(1); //XXX This does not work under Firefox 45.7, but does under firefox 53. Since we only support the browsers last version - 2, let's ignore it.
        expect(inputCaretPosition.end).toEqual('$220,242.76'.length);
    });

    it('should not cancel the last modifications, since `Enter` is used or the element is blurred', async () => {
        // Focus in the input
        const input = await $(selectors.issue387inputCancellable);
        await input.click();
        // Test the initial value
        expect(await input.getValue()).toEqual('$220,242.76');

        // Test that after hitting 'Enter' the saved cancellable value is updated
        await browser.keys([Key.End, Key.ArrowLeft, Key.ArrowLeft, Key.Backspace]);
        expect(await input.getValue()).toEqual('$22,024.76');
        await browser.keys([Key.Enter, Key.Escape]);
        expect(await input.getValue()).toEqual('$22,024.76');
        await browser.keys([Key.End, Key.ArrowLeft, Key.ArrowLeft, '678']);
        expect(await input.getValue()).toEqual('$22,024,678.76');
        await browser.keys([Key.Escape]);
        expect(await input.getValue()).toEqual('$22,024.76');
        // Check the text selection
        const inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue387inputCancellable);
        expect(inputCaretPosition.start).toEqual(0);
        expect(inputCaretPosition.end).toEqual('$22,024.76'.length);

        // Test that after blurring the input the saved cancellable value is updated
        await browser.keys([Key.Home, Key.ArrowRight, Key.ArrowRight, '446']);
        expect(await input.getValue()).toEqual('$24,462,024.76');
        await browser.keys([Key.Tab, Key.Shift, Key.Tab, Key.Shift]); // I focus on the next input, then come back to this one
        expect(await input.getValue()).toEqual('$24,462,024.76');
        await browser.keys([Key.Escape]);
        expect(await input.getValue()).toEqual('$24,462,024.76');
    });

    it('should not cancel the last modifications, since `isCancellable` is set to false', async () => {
        // Focus in the input
        const input = await $(selectors.issue387inputNotCancellable);
        await input.click();
        // Test the initial value
        expect(await input.getValue()).toEqual('$220,242.76');

        // Test that after deleting characters, we get back the original value
        await browser.keys([Key.End, Key.ArrowLeft, Key.ArrowLeft, Key.Backspace, Key.Backspace]);
        expect(await input.getValue()).toEqual('$2,202.76');
        await browser.keys([Key.Escape]);
        expect(await input.getValue()).toEqual('$2,202.76');
        // Check the text selection
        const inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue387inputNotCancellable);
        expect(inputCaretPosition.start).toEqual(0);
        expect(inputCaretPosition.end).toEqual('$2,202.76'.length);

        // Test that after adding characters, we get back the original value
        await browser.keys([Key.Home, Key.ArrowRight, Key.ArrowRight, Key.ArrowRight, '583']);
        expect(await input.getValue()).toEqual('$2,258,302.76');
        await browser.keys([Key.Escape]);
        expect(await input.getValue()).toEqual('$2,258,302.76');

        await input.setValue('220242.76');
        expect(await input.getValue()).toEqual('$220,242.76');
        // Test that after adding and deleting characters, we get back the original value
        await browser.keys([Key.Home, Key.ArrowRight, Key.ArrowRight, Key.ArrowRight, Key.Delete, '583', Key.Delete, Key.Backspace]);
        expect(await input.getValue()).toEqual('$225,842.76');
        await browser.keys([Key.Escape]);
        expect(await input.getValue()).toEqual('$225,842.76');

        // Test that after not modifying the value, we get the same value
        // Focus in the next input
        await browser.keys([Key.Tab]);
        // Test the initial value
        const inputNotCancellable = await $(selectors.issue387inputNotCancellableNumOnly);
        expect(await inputNotCancellable.getValue()).toEqual('$220,242.76');
        await browser.keys([Key.Home, Key.ArrowRight, Key.ArrowRight, Key.ArrowRight, Key.ArrowRight, '146']);
        expect(await inputNotCancellable.getValue()).toEqual('$220,146,242.76');
        await browser.keys([Key.Backspace, Key.Backspace, Key.Backspace]);
        expect(await inputNotCancellable.getValue()).toEqual('$220,242.76');
        await browser.keys([Key.Escape]);
        expect(await inputNotCancellable.getValue()).toEqual('$220,242.76');
    });
});

describe('Issue #393', () => { //FIXME Finish this
    it('should test for default values', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue393inputFixed).getValue()).toEqual('');
        expect(await $(selectors.issue393inputProgressive).getValue()).toEqual('2,202.00');
        expect(await $(selectors.issue393inputUpperLimit).getValue()).toEqual('');
        expect(await $(selectors.issue393inputLowerLimit).getValue()).toEqual('');
        expect(await $(selectors.issue393inputLimitOneSideUp).getValue()).toEqual('');
        expect(await $(selectors.issue393inputLimitOneSideDown).getValue()).toEqual('');
    });
    //TODO Create the tests once the mousewheel events will be managed by the Selenium server (cf. http://stackoverflow.com/questions/6735830/how-to-fire-mouse-wheel-event-in-firefox-with-javascript | https://groups.google.com/forum/#!topic/selenium-users/VyE-BB5Z2lU)

    xit('should increment and decrement the value with a fixed step', async () => { //FIXME Finish this
        // Focus in the input
        const input = await $(selectors.issue393inputFixed);
        await input.click();
        // Test the initial value
        expect(await input.getValue()).toEqual('');

        // Simulate a mouseevent on that input element
        // input.scrollIntoView(); //FIXME Does not work : This only used to scroll the view to that element, but does not simulate wheel events (cf. http://webdriver.io/api/utility/scroll.html#Example)
        /*
        browser.execute(() => {
            /!*const evt = document.createEvent('MouseEvents'); //FIXME Does not work (cf. http://stackoverflow.com/a/6740625/2834898)
            evt.initMouseEvent(
                'DOMMouseScroll', // in DOMString typeArg,
                true,  // in boolean canBubbleArg,
                true,  // in boolean cancelableArg,
                window,// in views::AbstractView viewArg,
                120,   // in long detailArg,
                0,     // in long screenXArg,
                0,     // in long screenYArg,
                0,     // in long clientXArg,
                0,     // in long clientYArg,
                0,     // in boolean ctrlKeyArg,
                0,     // in boolean altKeyArg,
                0,     // in boolean shiftKeyArg,
                0,     // in boolean metaKeyArg,
                0,     // in unsigned short buttonArg,
                null   // in EventTarget relatedTargetArg
            );
            document.querySelector('#issue_393_fixed').dispatchEvent(evt);*!/

            const input = document.querySelector('#issue_393_fixed');
            // input.scrollTop += 20; //FIXME à tester (cf. http://stackoverflow.com/questions/25994971/mousewheel-scrolling-over-div)
        });
        */
        // input.mouseWheel(-100); //FIXME Does not work (cf. http://stackoverflow.com/questions/29837922/how-to-implement-zoom-in-out-by-using-ctrlmousewheel-in-selenium-webdriver)
        expect(await input.getValue()).toEqual('1,000.00');
    });
});

describe('Elements with the `contenteditable` attribute set to `true`', () => {
    it('should test for default values', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.contentEditable1).getText()).toEqual('');
        expect(await $(selectors.contentEditable2).getText()).toEqual('$12,345,678.90');
    });

    it('should change the input value accordingly when focusing on the element', async () => {
        const contentEditable1 = await $(selectors.contentEditable1);
        const contentEditable2 = await $(selectors.contentEditable2);

        // Focus in the input
        await contentEditable1.click();

        // Test the values
        expect(await contentEditable1.getText()).toEqual('\u202f€');
        await browser.keys([Key.Home, '1234567.89']);
        expect(await contentEditable1.getText()).toEqual('1.234.567,89\u202f€');

        // Focus in the input
        await contentEditable2.click();

        // Test the values
        expect(await contentEditable2.getText()).toEqual('$12,345,678.90');
        await browser.keys([Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft]); // Under Firefox, Key.Home does not work and I must rely on that //TODO Change it back when the bug is fixed upstream
        await browser.keys([Key.Home]); // Under Firefox, Key.Home does not work and I must rely on that //TODO Change it back when the bug is fixed upstream
        // browser.keys([Key.Home, Key.Delete, Key.Delete, Key.Delete, Key.Delete, Key.Delete, Key.Delete, '2267']); //TODO Uncomment this line when the bug is fixed upstream
        await browser.keys([Key.Delete, Key.Delete, Key.Delete, Key.Delete, Key.Delete, Key.Delete, '2267']); //TODO Delete this line when the bug is fixed upstream
        expect(await contentEditable2.getText()).toEqual('$226,778.90');
    });

    it('should be able change the element value since `contenteditable` is initially set to `false`, but an option update sets the `readOnly` option to `false`', async () => {
        const contentEditableNotActivated = await $(selectors.contentEditableNotActivated);

        // Focus in the input
        await contentEditableNotActivated.click();

        // Test the `contenteditable` attribute
        expect(await contentEditableNotActivated.getAttribute('contenteditable')).toEqual('true');

        // Test the values
        expect(await contentEditableNotActivated.getText()).toEqual('69.02 CHF');
        await browser.keys([Key.Home]);
        await browser.keys(['1234']);
        expect(await contentEditableNotActivated.getText()).toEqual("123'469.02 CHF");
    });

    it('should not change the element value since `contenteditable` is set to `false`', async () => {
        const contentEditableNotActivatedYet = await $(selectors.contentEditableNotActivatedYet);

        // Focus in the input
        await contentEditableNotActivatedYet.click();

        // Test the `contenteditable` attribute
        expect(await contentEditableNotActivatedYet.getAttribute('contenteditable')).toEqual('false');

        // Test the values
        expect(await contentEditableNotActivatedYet.getText()).toEqual('©123,456.79');
        await browser.keys([Key.Home, '1234']);
        expect(await contentEditableNotActivatedYet.getText()).toEqual('©123,456.79');
    });

    //FIXME Add the paste tests (and check the resulting caret position)
});

describe('Issue #403', () => {
    it('should test for default values', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue403a).getValue()).toEqual('25.00%');
        expect(await $(selectors.issue403b).getValue()).toEqual('1.200%');
        expect(await $(selectors.issue403c).getValue()).toEqual('');
    });

    it('should change the input value accordingly when focusing on the element', async () => {
        const inputA = await $(selectors.issue403a);
        const inputB = await $(selectors.issue403b);

        // Focus in the input
        await inputA.click();

        // Test the input value while the element is focused
        expect(await inputA.getValue()).toEqual('0.25');

        // Focus out of the input
        await inputB.click();

        // Test the input value while the element is not focused
        expect(await inputA.getValue()).toEqual('25.00%');

        // Then we cycle back twice just to make sure the value stays the same while tabbing in/out
        await inputA.click();
        expect(await inputA.getValue()).toEqual('0.25');
        await inputB.click();
        expect(await inputA.getValue()).toEqual('25.00%');
        await inputA.click();
        expect(await inputA.getValue()).toEqual('0.25');
        await inputB.click();
        expect(await inputA.getValue()).toEqual('25.00%');
    });

    it('should change the input value accordingly when focusing on the element', async () => {
        const inputA = await $(selectors.issue403a);
        const inputB = await $(selectors.issue403b);

        // Focus in the input
        await inputB.click();

        // Set the value
        await browser.keys([Key.Control, 'a', Key.Control, Key.Delete]); // Bug in v8 where you need to manually delete the selection before entering keys, otherwise the keys are enter and the selection start only (see upstream bug declaration: https://github.com/webdriverio/webdriverio/issues/9923)
        await browser.keys(['0.01234']);

        // Test the input value while the element is focused
        expect(await inputB.getValue()).toEqual('0.01234');

        // Focus out of the input
        await inputA.click();

        // Test the input value while the element is not focused
        expect(await inputB.getValue()).toEqual('1.234%');

        // Then we cycle back twice just to make sure the value stays the same while tabbing in/out
        await inputB.click();
        expect(await inputB.getValue()).toEqual('0.01234');
        await inputA.click();
        expect(await inputB.getValue()).toEqual('1.234%');

        await inputB.click();
        expect(await inputB.getValue()).toEqual('0.01234');
        await inputA.click();
        expect(await inputB.getValue()).toEqual('1.234%');
    });

    it('should change the input value accordingly when focusing on the element, with a bigger number of decimal places', async () => {
        const inputB = await $(selectors.issue403b);
        const inputC = await $(selectors.issue403c);

        // Focus in the input
        await inputC.click();
        await browser.keys(['1234567.89']);

        // Test the input value while the element is focused
        expect(await inputC.getValue()).toEqual('1,234,567.89');

        // Focus out of the input
        await inputB.click();

        // Test the input value while the element is not focused
        expect(await inputC.getValue()).toEqual('1.23457MM');

        // Then we cycle back twice just to make sure the value stays the same while tabbing in/out
        await inputC.click();
        expect(await inputC.getValue()).toEqual('1,234,567.89');
        await inputB.click();
        expect(await inputC.getValue()).toEqual('1.23457MM');

        await inputC.click();
        expect(await inputC.getValue()).toEqual('1,234,567.89');
        await inputB.click();
        expect(await inputC.getValue()).toEqual('1.23457MM');
    });
});

describe('Negative numbers & brackets notations', () => {
    it('should test for default values', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.negativeBrackets1).getValue()).toEqual('[1.352.468,24 €]');
        expect(await $(selectors.negativeBrackets2).getValue()).toEqual('<$1,352,468.24>');
        expect(await $(selectors.negativeBrackets3).getValue()).toEqual("{1'352'468.24 CHF}");
        expect(await $(selectors.negativeBrackets4).getValue()).toEqual('(1.352.468,24 €)');
        expect(await $(selectors.negativeBrackets5).getValue()).toEqual('$-1,352,468.24');

        expect(await $(selectors.negativeBracketsInput1).getValue()).toEqual('(1.234,57)');
        expect(await $(selectors.negativeBracketsInput2).getValue()).toEqual('(1.234,57)');
        expect(await $(selectors.negativeBracketsInput3).getValue()).toEqual('(€ 1.234,57)');
        expect(await $(selectors.negativeBracketsInput4).getValue()).toEqual('(€ 1.234,57)');
        expect(await $(selectors.negativeBracketsInput5).getValue()).toEqual('(€ 1.234,57)');
        expect(await $(selectors.negativeBracketsInput6).getValue()).toEqual('(1.234,57 €)');
        expect(await $(selectors.negativeBracketsInput7).getValue()).toEqual('(1.234,57 €)');
        expect(await $(selectors.negativeBracketsInput8).getValue()).toEqual('(1.234,57 €)');
    });

    it('should hide the parenthesis on focus', async () => {
        const negativeBrackets1 = await $(selectors.negativeBrackets1);

        // Focus in the input
        await negativeBrackets1.click();
        expect(await negativeBrackets1.getValue()).toEqual('-1.352.468,24 €');
    });

    it('should show the parenthesis back on blur', async () => {
        const negativeBrackets1 = await $(selectors.negativeBrackets1);
        const negativeBrackets2 = await $(selectors.negativeBrackets2);

        // Focus on another the input
        await negativeBrackets2.click();
        expect(await negativeBrackets1.getValue()).toEqual('[1.352.468,24 €]');
        expect(await negativeBrackets2.getValue()).toEqual('$-1,352,468.24');
    });

    it('should not show the parenthesis back on blur if the value has changed for a positive one', async () => {
        const negativeBrackets1 = await $(selectors.negativeBrackets1);
        const negativeBrackets2 = await $(selectors.negativeBrackets2);

        // Focus in the input
        await negativeBrackets1.click();
        await browser.keys([Key.Home, Key.Delete]);
        expect(await negativeBrackets1.getValue()).toEqual('1.352.468,24 €');
        // Focus on another the input
        await negativeBrackets2.click();
        expect(await negativeBrackets1.getValue()).toEqual('1.352.468,24 €');
    });

    it('should toggle to positive and negative values when inputting `-` or `+`', async () => {
        const negativeBracketsInput1 = await $(selectors.negativeBracketsInput1);
        const negativeBracketsInput5 = await $(selectors.negativeBracketsInput5);

        await negativeBracketsInput1.click();
        expect(await negativeBracketsInput1.getValue()).toEqual('-1.234,57');
        await browser.keys([Key.Home, '-']);
        expect(await negativeBracketsInput1.getValue()).toEqual('+1.234,57');
        await browser.keys(['-']);
        expect(await negativeBracketsInput1.getValue()).toEqual('-1.234,57');
        await browser.keys(['-']);
        expect(await negativeBracketsInput1.getValue()).toEqual('+1.234,57');
        await browser.keys(['-']);
        expect(await negativeBracketsInput1.getValue()).toEqual('-1.234,57');

        await negativeBracketsInput5.click();
        expect(await negativeBracketsInput5.getValue()).toEqual('€ 1.234,57-');
        await browser.keys([Key.Home, '-']);
        expect(await negativeBracketsInput5.getValue()).toEqual('€ 1.234,57+');
        await browser.keys(['-']);
        expect(await negativeBracketsInput5.getValue()).toEqual('€ 1.234,57-');
        await browser.keys(['-']);
        expect(await negativeBracketsInput5.getValue()).toEqual('€ 1.234,57+');
        await browser.keys(['-']);
        expect(await negativeBracketsInput5.getValue()).toEqual('€ 1.234,57-');
    });

    it('should hide the parenthesis on focus, via tabbing, for each variations of the currency and negative sign placements', async () => {
        const negativeBracketsInput1 = await $(selectors.negativeBracketsInput1);

        // Focus in the input
        await negativeBracketsInput1.click();
        expect(await negativeBracketsInput1.getValue()).toEqual('-1.234,57');
        await browser.keys([Key.Tab]);
        expect(await $(selectors.negativeBracketsInput2).getValue()).toEqual('1.234,57-');
        await browser.keys([Key.Tab]);
        expect(await $(selectors.negativeBracketsInput3).getValue()).toEqual('€ -1.234,57');
        await browser.keys([Key.Tab]);
        expect(await $(selectors.negativeBracketsInput4).getValue()).toEqual('-€ 1.234,57');
        await browser.keys([Key.Tab]);
        expect(await $(selectors.negativeBracketsInput5).getValue()).toEqual('€ 1.234,57-');
        await browser.keys([Key.Tab]);
        expect(await $(selectors.negativeBracketsInput6).getValue()).toEqual('1.234,57- €');
        await browser.keys([Key.Tab]);
        expect(await $(selectors.negativeBracketsInput7).getValue()).toEqual('1.234,57 €-');
        await browser.keys([Key.Tab]);
        expect(await $(selectors.negativeBracketsInput8).getValue()).toEqual('-1.234,57 €');

        // Focus elsewhere
        await $(selectors.negativeBrackets1).click();

        // Check that the values are back with the parenthesis
        expect(await $(selectors.negativeBracketsInput1).getValue()).toEqual('(1.234,57)');
        expect(await $(selectors.negativeBracketsInput2).getValue()).toEqual('(1.234,57)');
        expect(await $(selectors.negativeBracketsInput3).getValue()).toEqual('(€ 1.234,57)');
        expect(await $(selectors.negativeBracketsInput4).getValue()).toEqual('(€ 1.234,57)');
        expect(await $(selectors.negativeBracketsInput5).getValue()).toEqual('(€ 1.234,57)');
        expect(await $(selectors.negativeBracketsInput6).getValue()).toEqual('(1.234,57 €)');
        expect(await $(selectors.negativeBracketsInput7).getValue()).toEqual('(1.234,57 €)');
        expect(await $(selectors.negativeBracketsInput8).getValue()).toEqual('(1.234,57 €)');
    });

    it('should hide the parenthesis on focus, via mouse clicks, for each variations of the currency and negative sign placements', async () => {
        const negativeBracketsInput1 = await $(selectors.negativeBracketsInput1);
        const negativeBracketsInput2 = await $(selectors.negativeBracketsInput2);
        const negativeBracketsInput3 = await $(selectors.negativeBracketsInput3);
        const negativeBracketsInput4 = await $(selectors.negativeBracketsInput4);
        const negativeBracketsInput5 = await $(selectors.negativeBracketsInput5);
        const negativeBracketsInput6 = await $(selectors.negativeBracketsInput6);
        const negativeBracketsInput7 = await $(selectors.negativeBracketsInput7);
        const negativeBracketsInput8 = await $(selectors.negativeBracketsInput8);

        // Focus in the input
        await negativeBracketsInput1.click();
        expect(await negativeBracketsInput1.getValue()).toEqual('-1.234,57');
        await negativeBracketsInput2.click();
        expect(await negativeBracketsInput2.getValue()).toEqual('1.234,57-');
        await negativeBracketsInput3.click();
        expect(await negativeBracketsInput3.getValue()).toEqual('€ -1.234,57');
        await negativeBracketsInput4.click();
        expect(await negativeBracketsInput4.getValue()).toEqual('-€ 1.234,57');
        await negativeBracketsInput5.click();
        expect(await negativeBracketsInput5.getValue()).toEqual('€ 1.234,57-');
        await negativeBracketsInput6.click();
        expect(await negativeBracketsInput6.getValue()).toEqual('1.234,57- €');
        await negativeBracketsInput7.click();
        expect(await negativeBracketsInput7.getValue()).toEqual('1.234,57 €-');
        await negativeBracketsInput8.click();
        expect(await negativeBracketsInput8.getValue()).toEqual('-1.234,57 €');

        // Focus elsewhere
        await $(selectors.negativeBrackets1).click();

        // Check that the values are back with the parenthesis
        expect(await negativeBracketsInput1.getValue()).toEqual('(1.234,57)');
        expect(await negativeBracketsInput2.getValue()).toEqual('(1.234,57)');
        expect(await negativeBracketsInput3.getValue()).toEqual('(€ 1.234,57)');
        expect(await negativeBracketsInput4.getValue()).toEqual('(€ 1.234,57)');
        expect(await negativeBracketsInput5.getValue()).toEqual('(€ 1.234,57)');
        expect(await negativeBracketsInput6.getValue()).toEqual('(1.234,57 €)');
        expect(await negativeBracketsInput7.getValue()).toEqual('(1.234,57 €)');
        expect(await negativeBracketsInput8.getValue()).toEqual('(1.234,57 €)');
    });

    it('should correctly remove the brackets when the value is set to a positive one, when the caret in on the far left (Issue #414)', async () => {
        const negativeBracketsInput1 = await $(selectors.negativeBracketsInput1);
        const negativeBracketsInput2 = await $(selectors.negativeBracketsInput2);
        const negativeBracketsInput3 = await $(selectors.negativeBracketsInput3);
        const negativeBracketsInput4 = await $(selectors.negativeBracketsInput4);
        const negativeBracketsInput5 = await $(selectors.negativeBracketsInput5);
        const negativeBracketsInput6 = await $(selectors.negativeBracketsInput6);
        const negativeBracketsInput7 = await $(selectors.negativeBracketsInput7);
        const negativeBracketsInput8 = await $(selectors.negativeBracketsInput8);

        // Focus in the input
        await negativeBracketsInput1.click();
        expect(await negativeBracketsInput1.getValue()).toEqual('-1.234,57');
        await browser.keys([Key.Home, '+']);
        expect(await negativeBracketsInput1.getValue()).toEqual('+1.234,57'); //FIXME Fails on Chrome and Firefox; it seems to be a bug in either the selenium chromedriver/geckodriver or in webdriver

        await negativeBracketsInput2.click();
        expect(await negativeBracketsInput2.getValue()).toEqual('1.234,57-');
        await browser.keys([Key.Home, '+']);
        expect(await negativeBracketsInput2.getValue()).toEqual('1.234,57+');

        await negativeBracketsInput3.click();
        expect(await negativeBracketsInput3.getValue()).toEqual('€ -1.234,57');
        await browser.keys([Key.Home, '+']);
        expect(await negativeBracketsInput3.getValue()).toEqual('€ +1.234,57');

        await negativeBracketsInput4.click();
        expect(await negativeBracketsInput4.getValue()).toEqual('-€ 1.234,57');
        await browser.keys([Key.Home, '+']);
        expect(await negativeBracketsInput4.getValue()).toEqual('+€ 1.234,57');

        await negativeBracketsInput5.click();
        expect(await negativeBracketsInput5.getValue()).toEqual('€ 1.234,57-');
        await browser.keys([Key.Home, '+']);
        expect(await negativeBracketsInput5.getValue()).toEqual('€ 1.234,57+');

        await negativeBracketsInput6.click();
        expect(await negativeBracketsInput6.getValue()).toEqual('1.234,57- €');
        await browser.keys([Key.Home, '+']);
        expect(await negativeBracketsInput6.getValue()).toEqual('1.234,57+ €');

        await negativeBracketsInput7.click();
        expect(await negativeBracketsInput7.getValue()).toEqual('1.234,57 €-');
        await browser.keys([Key.Home, '+']);
        expect(await negativeBracketsInput7.getValue()).toEqual('1.234,57 €+');

        await negativeBracketsInput8.click();
        expect(await negativeBracketsInput8.getValue()).toEqual('-1.234,57 €');
        await browser.keys([Key.Home, '+']);
        expect(await negativeBracketsInput8.getValue()).toEqual('+1.234,57 €');

        // Focus elsewhere
        await $(selectors.negativeBrackets1).click();

        // Check that the values are correctly formatted when unfocused
        expect(await negativeBracketsInput1.getValue()).toEqual('+1.234,57');
        expect(await negativeBracketsInput2.getValue()).toEqual('1.234,57+');
        expect(await negativeBracketsInput3.getValue()).toEqual('€ +1.234,57');
        expect(await negativeBracketsInput4.getValue()).toEqual('+€ 1.234,57');
        expect(await negativeBracketsInput5.getValue()).toEqual('€ 1.234,57+');
        expect(await negativeBracketsInput6.getValue()).toEqual('1.234,57+ €');
        expect(await negativeBracketsInput7.getValue()).toEqual('1.234,57 €+');
        expect(await negativeBracketsInput8.getValue()).toEqual('+1.234,57 €');
    });

    it('should correctly keep the positive value when tabbing between the inputs (Issue #414)', async () => {
        const negativeBracketsInput1 = await $(selectors.negativeBracketsInput1);
        const negativeBracketsInput2 = await $(selectors.negativeBracketsInput2);
        const negativeBracketsInput3 = await $(selectors.negativeBracketsInput3);
        const negativeBracketsInput4 = await $(selectors.negativeBracketsInput4);
        const negativeBracketsInput5 = await $(selectors.negativeBracketsInput5);
        const negativeBracketsInput6 = await $(selectors.negativeBracketsInput6);
        const negativeBracketsInput7 = await $(selectors.negativeBracketsInput7);
        const negativeBracketsInput8 = await $(selectors.negativeBracketsInput8);

        // Focus in the input
        await negativeBracketsInput1.click();
        expect(await negativeBracketsInput1.getValue()).toEqual('+1.234,57'); //FIXME Fails on Chrome only; there is a bug in the selenium chromedriver
        await browser.keys([Key.Tab]);
        expect(await negativeBracketsInput1.getValue()).toEqual('+1.234,57');

        expect(await negativeBracketsInput2.getValue()).toEqual('1.234,57+');
        await browser.keys([Key.Tab]);
        expect(await negativeBracketsInput2.getValue()).toEqual('1.234,57+');

        expect(await negativeBracketsInput3.getValue()).toEqual('€ +1.234,57');
        await browser.keys([Key.Tab]);
        expect(await negativeBracketsInput3.getValue()).toEqual('€ +1.234,57');

        expect(await negativeBracketsInput4.getValue()).toEqual('+€ 1.234,57');
        await browser.keys([Key.Tab]);
        expect(await negativeBracketsInput4.getValue()).toEqual('+€ 1.234,57');

        expect(await negativeBracketsInput5.getValue()).toEqual('€ 1.234,57+');
        await browser.keys([Key.Tab]);
        expect(await negativeBracketsInput5.getValue()).toEqual('€ 1.234,57+');

        expect(await negativeBracketsInput6.getValue()).toEqual('1.234,57+ €');
        await browser.keys([Key.Tab]);
        expect(await negativeBracketsInput6.getValue()).toEqual('1.234,57+ €');

        expect(await negativeBracketsInput7.getValue()).toEqual('1.234,57 €+');
        await browser.keys([Key.Tab]);
        expect(await negativeBracketsInput7.getValue()).toEqual('1.234,57 €+');

        expect(await negativeBracketsInput8.getValue()).toEqual('+1.234,57 €');
        await browser.keys([Key.Shift, Key.Tab, Key.Shift]);
        expect(await negativeBracketsInput8.getValue()).toEqual('+1.234,57 €');
    });

    it('should correctly change back the element value to negative ones, with tabbing (Issue #414)', async () => {
        const negativeBracketsInput1 = await $(selectors.negativeBracketsInput1);
        const negativeBracketsInput2 = await $(selectors.negativeBracketsInput2);
        const negativeBracketsInput3 = await $(selectors.negativeBracketsInput3);
        const negativeBracketsInput4 = await $(selectors.negativeBracketsInput4);
        const negativeBracketsInput5 = await $(selectors.negativeBracketsInput5);
        const negativeBracketsInput6 = await $(selectors.negativeBracketsInput6);
        const negativeBracketsInput7 = await $(selectors.negativeBracketsInput7);
        const negativeBracketsInput8 = await $(selectors.negativeBracketsInput8);

        // Focus in the input
        await negativeBracketsInput1.click();
        expect(await negativeBracketsInput1.getValue()).toEqual('+1.234,57'); //FIXME Fails on Chrome only; there is a bug in the selenium chromedriver
        await browser.keys([Key.Home, '-', Key.Tab]);

        expect(await negativeBracketsInput2.getValue()).toEqual('1.234,57+');
        await browser.keys([Key.Home, '-', Key.Tab]);

        expect(await negativeBracketsInput3.getValue()).toEqual('€ +1.234,57');
        await browser.keys([Key.Home, '-', Key.Tab]);

        expect(await negativeBracketsInput4.getValue()).toEqual('+€ 1.234,57');
        await browser.keys([Key.Home, '-', Key.Tab]);

        expect(await negativeBracketsInput5.getValue()).toEqual('€ 1.234,57+');
        await browser.keys([Key.Home, '-', Key.Tab]);

        expect(await negativeBracketsInput6.getValue()).toEqual('1.234,57+ €');
        await browser.keys([Key.Home, '-', Key.Tab]);

        expect(await negativeBracketsInput7.getValue()).toEqual('1.234,57 €+');
        await browser.keys([Key.Home, '-', Key.Tab]);

        expect(await negativeBracketsInput8.getValue()).toEqual('+1.234,57 €');
        await browser.keys([Key.Home, '-']);

        // Focus elsewhere
        await $(selectors.negativeBrackets1).click();

        // Check that the values are correctly formatted when unfocused
        expect(await negativeBracketsInput1.getValue()).toEqual('(1.234,57)');
        expect(await negativeBracketsInput2.getValue()).toEqual('(1.234,57)');
        expect(await negativeBracketsInput3.getValue()).toEqual('(€ 1.234,57)');
        expect(await negativeBracketsInput4.getValue()).toEqual('(€ 1.234,57)');
        expect(await negativeBracketsInput5.getValue()).toEqual('(€ 1.234,57)');
        expect(await negativeBracketsInput6.getValue()).toEqual('(1.234,57 €)');
        expect(await negativeBracketsInput7.getValue()).toEqual('(1.234,57 €)');
        expect(await negativeBracketsInput8.getValue()).toEqual('(1.234,57 €)');
    });

    it('should correctly remove the brackets when the value is set to a positive one, when the caret in on the far right (Issue #414)', async () => {
        const negativeBracketsInput1 = await $(selectors.negativeBracketsInput1);
        const negativeBracketsInput2 = await $(selectors.negativeBracketsInput2);
        const negativeBracketsInput3 = await $(selectors.negativeBracketsInput3);
        const negativeBracketsInput4 = await $(selectors.negativeBracketsInput4);
        const negativeBracketsInput5 = await $(selectors.negativeBracketsInput5);
        const negativeBracketsInput6 = await $(selectors.negativeBracketsInput6);
        const negativeBracketsInput7 = await $(selectors.negativeBracketsInput7);
        const negativeBracketsInput8 = await $(selectors.negativeBracketsInput8);

        // Focus in the input
        await negativeBracketsInput1.click();
        expect(await negativeBracketsInput1.getValue()).toEqual('-1.234,57'); //FIXME Fails on Chrome only; there is a bug in the selenium chromedriver
        await browser.keys([Key.End, '+']);
        expect(await negativeBracketsInput1.getValue()).toEqual('+1.234,57');

        await negativeBracketsInput2.click();
        expect(await negativeBracketsInput2.getValue()).toEqual('1.234,57-');
        await browser.keys([Key.End, '+']);
        expect(await negativeBracketsInput2.getValue()).toEqual('1.234,57+');

        await negativeBracketsInput3.click();
        expect(await negativeBracketsInput3.getValue()).toEqual('€ -1.234,57');
        await browser.keys([Key.End, '+']);
        expect(await negativeBracketsInput3.getValue()).toEqual('€ +1.234,57');

        await negativeBracketsInput4.click();
        expect(await negativeBracketsInput4.getValue()).toEqual('-€ 1.234,57');
        await browser.keys([Key.End, '+']);
        expect(await negativeBracketsInput4.getValue()).toEqual('+€ 1.234,57');

        await negativeBracketsInput5.click();
        expect(await negativeBracketsInput5.getValue()).toEqual('€ 1.234,57-');
        await browser.keys([Key.End, '+']);
        expect(await negativeBracketsInput5.getValue()).toEqual('€ 1.234,57+');

        await negativeBracketsInput6.click();
        expect(await negativeBracketsInput6.getValue()).toEqual('1.234,57- €');
        await browser.keys([Key.End, '+']);
        expect(await negativeBracketsInput6.getValue()).toEqual('1.234,57+ €');

        await negativeBracketsInput7.click();
        expect(await negativeBracketsInput7.getValue()).toEqual('1.234,57 €-');
        await browser.keys([Key.End, '+']);
        expect(await negativeBracketsInput7.getValue()).toEqual('1.234,57 €+');

        await negativeBracketsInput8.click();
        expect(await negativeBracketsInput8.getValue()).toEqual('-1.234,57 €');
        await browser.keys([Key.End, '+']);
        expect(await negativeBracketsInput8.getValue()).toEqual('+1.234,57 €');

        // Focus elsewhere
        await $(selectors.negativeBrackets1).click();

        // Check that the values are correctly formatted when unfocused
        expect(await negativeBracketsInput1.getValue()).toEqual('+1.234,57');
        expect(await negativeBracketsInput2.getValue()).toEqual('1.234,57+');
        expect(await negativeBracketsInput3.getValue()).toEqual('€ +1.234,57');
        expect(await negativeBracketsInput4.getValue()).toEqual('+€ 1.234,57');
        expect(await negativeBracketsInput5.getValue()).toEqual('€ 1.234,57+');
        expect(await negativeBracketsInput6.getValue()).toEqual('1.234,57+ €');
        expect(await negativeBracketsInput7.getValue()).toEqual('1.234,57 €+');
        expect(await negativeBracketsInput8.getValue()).toEqual('+1.234,57 €');
    });
});

describe('remove() function', () => {
    it('should test for default values', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.remove1).getValue()).toEqual('2.468,42 €');
    });

    it('should stop reacting with the AutoNumeric event handlers to user interactions once its removed', async () => {
        const remove1 = await $(selectors.remove1);

        // Focus in the input
        await remove1.click();
        await browser.keys([Key.Home, '115']);
        expect(await remove1.getValue()).toEqual('1.152.468,42 €');

        // Call the `remove()` function
        await browser.execute(domId => {
            const inputRemove1 = document.querySelector(domId);
            // eslint-disable-next-line
            const anElement = AutoNumeric.getAutoNumericElement(inputRemove1);
            anElement.remove();
        }, selectors.remove1);

        // Check that the value has not changed
        expect(await remove1.getValue()).toEqual('1.152.468,42 €');
        await browser.keys([Key.Home, Key.ArrowRight, Key.ArrowRight, Key.ArrowRight, Key.ArrowRight, Key.Delete, Key.Delete]);
        expect(await remove1.getValue()).toEqual('1.15468,42 €');
    });
});

xdescribe('undo and redo functions', () => {
    it('should test for default values', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.undoRedo1).getValue()).toEqual('1.357,92 €');
        expect(await $(selectors.undoRedo2).getText()).toEqual('1.357,92 €');
        expect(await $(selectors.undoRedo3).getValue()).toEqual('12.340');
        expect(await $(selectors.undoRedo4).getValue()).toEqual('');
    });

    it('should undo the user inputs correctly on <input> elements', async () => {
        let inputCaretPosition;
        const undoRedoInput = await $(selectors.undoRedo1);

        // Focus in the input
        await undoRedoInput.click();

        // Enter some characters to build the history table
        await browser.keys([Key.Home, '0']); // Input a character that will be dropped and won't be set in the history list
        expect(await undoRedoInput.getValue()).toEqual('1.357,92 €'); // |1.357,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(0);

        await browser.keys(['1']);
        expect(await undoRedoInput.getValue()).toEqual('11.357,92 €'); // 1|1.357,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(1);

        await browser.keys([Key.ArrowRight, '2']);
        expect(await undoRedoInput.getValue()).toEqual('112.357,92 €'); // 11.|357,92 € -> 112|.357,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(3);

        await browser.keys(['4']);
        expect(await undoRedoInput.getValue()).toEqual('1.124.357,92 €'); // 1.124|.357,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(5);

        await browser.keys([Key.ArrowRight, Key.ArrowRight, '6']);
        expect(await undoRedoInput.getValue()).toEqual('11.243.657,92 €'); // 1.124.|357,92 € -> 1.124.3|57,92 € -> 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(8);

        //FIXME All those undos do not work anymore with webdriver.io v8, but do manually; check back later when Webdriver.io has fixed that
        // Undos
        await browser.keys([Key.Control, 'z']);
        expect(await undoRedoInput.getValue()).toEqual('1.124.357,92 €'); // 1.124.3|57,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(7);

        await browser.keys(['z']);
        expect(await undoRedoInput.getValue()).toEqual('112.357,92 €'); // 112|.357,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(3);

        await browser.keys(['z']);
        expect(await undoRedoInput.getValue()).toEqual('11.357,92 €'); // 11.|357,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(3);

        await browser.keys(['z']);
        expect(await undoRedoInput.getValue()).toEqual('1.357,92 €'); // |1.357,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(0);

        await browser.keys(['z']); // This makes sure we cannot go back too far
        expect(await undoRedoInput.getValue()).toEqual('1.357,92 €'); // |1.357,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(0);

        await browser.keys([Key.Control]); // Release the control key
        expect(await undoRedoInput.getValue()).toEqual('1.357,92 €'); // |1.357,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(0);
    });

    it('should redo the user inputs correctly on <input> elements, when releasing the Shift then Control key', async () => {
        let inputCaretPosition;
        const undoRedoInput = await $(selectors.undoRedo1);

        // Redos (releasing the keys shift, then ctrl)
        await browser.keys([Key.Control, Key.Shift, 'z']);
        expect(await undoRedoInput.getValue()).toEqual('11.357,92 €'); // 11.|357,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(3);

        await browser.keys(['z']);
        expect(await undoRedoInput.getValue()).toEqual('112.357,92 €'); // 112|.357,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(3);

        await browser.keys(['z']);
        expect(await undoRedoInput.getValue()).toEqual('1.124.357,92 €'); // 1.124.3|57,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(7);

        await browser.keys(['z']);
        expect(await undoRedoInput.getValue()).toEqual('11.243.657,92 €'); // 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(8);

        await browser.keys(['z']); // This makes sure we cannot go back too far
        expect(await undoRedoInput.getValue()).toEqual('11.243.657,92 €'); // 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(8);

        await browser.keys([Key.Shift]); // Release the Shift key
        expect(await undoRedoInput.getValue()).toEqual('11.243.657,92 €'); // 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(8);

        await browser.keys([Key.Control]); // Release the control key
        expect(await undoRedoInput.getValue()).toEqual('11.243.657,92 €'); // 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(8);
    });

    it('should redo the user inputs correctly on <input> elements, when releasing the Control then Shift key', async () => {
        let inputCaretPosition;
        const undoRedoInput = await $(selectors.undoRedo1);

        // Undos some more to test the last redos with the specific key release order
        await browser.keys([Key.Control, 'z']);
        expect(await undoRedoInput.getValue()).toEqual('1.124.357,92 €'); // 1.124.3|57,92 €
        await browser.keys(['z']);
        expect(await undoRedoInput.getValue()).toEqual('112.357,92 €'); // 112|.357,92 €
        await browser.keys([Key.Control]);
        expect(await undoRedoInput.getValue()).toEqual('112.357,92 €'); // 112|.357,92 €

        // Redos (releasing the keys ctrl, then shift)
        await browser.keys([Key.Control, Key.Shift, 'z']);
        expect(await undoRedoInput.getValue()).toEqual('1.124.357,92 €'); // 1.124.3|57,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(7);

        await browser.keys(['z']);
        expect(await undoRedoInput.getValue()).toEqual('11.243.657,92 €'); // 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(8);

        await browser.keys([Key.Control]); // Release the control key
        expect(await undoRedoInput.getValue()).toEqual('11.243.657,92 €'); // 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(8);

        await browser.keys([Key.Shift]); // Release the Shift key
        expect(await undoRedoInput.getValue()).toEqual('11.243.657,92 €'); // 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(8);
    });

    it('should save the very last known caret/selection position correctly, even if a group separator is added', async () => {
        let inputCaretPosition;
        const undoRedoInput = await $(selectors.undoRedo1);

        await browser.keys(['1']);
        expect(await undoRedoInput.getValue()).toEqual('112.436.157,92 €'); // 112.436.1|57,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(9);

        await browser.keys(['2']);
        expect(await undoRedoInput.getValue()).toEqual('1.124.361.257,92 €'); // 1.124.361.2|57,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(11);

        // Undo
        await browser.keys([Key.Control, 'z']);
        expect(await undoRedoInput.getValue()).toEqual('112.436.157,92 €'); // 112.436.1|57,92 €
        await browser.keys([Key.Control]); // Release the control key
        expect(await undoRedoInput.getValue()).toEqual('112.436.157,92 €'); // 112.436.1|57,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(9);

        // Redo
        await browser.keys([Key.Control, Key.Shift, 'z', Key.Shift, Key.Control]);
        expect(await undoRedoInput.getValue()).toEqual('1.124.361.257,92 €'); // 1.124.361.2|57,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(11);
    });

    it('should respect the `historySize` option', async () => {
        let inputCaretPosition;
        const undoRedoInput = await $(selectors.undoRedo3);

        // Focus in the input
        await undoRedoInput.click();

        // Enter some characters to build the history table
        await browser.keys([Key.Home, Key.ArrowRight, Key.Shift, Key.ArrowRight, Key.ArrowRight, Key.ArrowRight, Key.Shift, '5']);
        expect(await undoRedoInput.getValue()).toEqual('1.540'); // 1|2.3|40 -> 1.5|40
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo3);
        expect(inputCaretPosition).toEqual(3);

        await browser.keys([Key.Home, Key.Shift, Key.ArrowRight, Key.ArrowRight, Key.ArrowRight, Key.Shift, '6']);
        expect(await undoRedoInput.getValue()).toEqual('640'); // 1.5|40 -> 6|40
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo3);
        expect(inputCaretPosition).toEqual(1);

        await browser.keys([Key.Backspace]);
        expect(await undoRedoInput.getValue()).toEqual('40'); // 6|40 -> |40
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo3);
        expect(inputCaretPosition).toEqual(0);

        await browser.keys(['2']);
        expect(await undoRedoInput.getValue()).toEqual('240'); // |40 -> 2|40
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo3);
        expect(inputCaretPosition).toEqual(1);

        await browser.keys(['8']);
        expect(await undoRedoInput.getValue()).toEqual('2.840'); // 2|40 -> 2.8|40
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo3);
        expect(inputCaretPosition).toEqual(3);


        // Undos
        await browser.keys([Key.Control, 'zzzzz', Key.Control]);
        expect(await undoRedoInput.getValue()).toEqual('1.540'); // 1.5|40
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.undoRedo3);
        expect(inputCaretPosition.start).toEqual(0);
        expect(inputCaretPosition.end).toEqual(3);


        // Redos
        await browser.keys([Key.Control, Key.Shift, 'zzzzz', Key.Shift, Key.Control]);
        expect(await undoRedoInput.getValue()).toEqual('2.840'); // 2.8|40
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo3);
        expect(inputCaretPosition).toEqual(3);


        // Input more numbers so that the history size overflow
        await browser.keys([Key.Home, '6']);
        expect(await undoRedoInput.getValue()).toEqual('62.840'); // |2.840 -> 6|2.840
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo3);
        expect(inputCaretPosition).toEqual(1);

        // Undo to the max history size
        await browser.keys([Key.Control, 'zzzzz', Key.Control]);
        expect(await undoRedoInput.getValue()).toEqual('640'); // 6|40
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo3);
        expect(inputCaretPosition).toEqual(1);

        // Try to undo once more ; this stays on the same state, since the first one got deleted
        await browser.keys([Key.Control, 'z', Key.Control]);
        expect(await undoRedoInput.getValue()).toEqual('640'); // 6|40
        // Check the caret position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo3);
        expect(inputCaretPosition).toEqual(1);

        // Try to redo more states that there is in the history table should only return the last state
        await browser.keys([Key.Control, Key.Shift, 'zzzzzzzzz', Key.Shift, Key.Control]);
        expect(await undoRedoInput.getValue()).toEqual('62.840');
    });

    it('should keep the redo history if the use re-enter the same redo information that do not change the intermediary states', async () => {
        const undoRedoInput = await $(selectors.undoRedo4);

        // Focus in the input
        await undoRedoInput.click();

        // Enter some characters to build the history table
        await browser.keys([Key.End, '1234567890']);
        expect(await undoRedoInput.getValue()).toEqual('1,234,567,890');

        // Undos some states in order to stop at an intermediary state where there are multiple potential redo states after the current history pointer
        await browser.keys([Key.Control, 'zzzz', Key.Control]);
        expect(await undoRedoInput.getValue()).toEqual('123,456.00');

        // Enter the exact same data that would result in the same next saved state
        await browser.keys(['7']);
        expect(await undoRedoInput.getValue()).toEqual('1,234,567.00');

        // ...and test if the rest of the history stable is still there by doing some redos
        await browser.keys([Key.Control, Key.Shift, 'z']);
        expect(await undoRedoInput.getValue()).toEqual('12,345,678.00');
        await browser.keys(['z']);
        expect(await undoRedoInput.getValue()).toEqual('123,456,789.00');
        await browser.keys(['z']);
        expect(await undoRedoInput.getValue()).toEqual('1,234,567,890.00');
        await browser.keys(['z']);
        expect(await undoRedoInput.getValue()).toEqual('1,234,567,890.00');
        await browser.keys([Key.Shift, Key.Control]); // Release the Key.Control and Key.Shift keys
    });

    xit('should undo the user inputs correctly on non-input elements', async () => { //FIXME This does not work under FF 52...
        let inputCaretPosition;
        const undoRedoElement = await $(selectors.undoRedo2);

        // Focus in the input
        await undoRedoElement.click();

        // Enter some characters to build the history table
        await browser.keys([Key.Home, '0']); // Input a character that will be dropped and won't be set in the history list
        expect(await undoRedoElement.getText()).toEqual('1.357,92 €'); // |1.357,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(0);

        await browser.keys(['1']);
        expect(await undoRedoElement.getText()).toEqual('11.357,92 €'); // 1|1.357,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(1);

        await browser.keys([Key.ArrowRight, '2']);
        expect(await undoRedoElement.getText()).toEqual('112.357,92 €'); // 11.|357,92 € -> 112|.357,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(3);

        await browser.keys(['4']);
        expect(await undoRedoElement.getText()).toEqual('1.124.357,92 €'); // 1.124|.357,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(5);

        await browser.keys([Key.ArrowRight, Key.ArrowRight, '6']);
        expect(await undoRedoElement.getText()).toEqual('11.243.657,92 €'); // 1.124.|357,92 € -> 1.124.3|57,92 € -> 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(8);


        // Undos
        await browser.keys([Key.Control, 'z']);
        expect(await undoRedoElement.getText()).toEqual('1.124.357,92 €'); // 1.124.3|57,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(7);

        await browser.keys(['z']);
        expect(await undoRedoElement.getText()).toEqual('112.357,92 €'); // 112|.357,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(3);

        await browser.keys(['z']);
        expect(await undoRedoElement.getText()).toEqual('11.357,92 €'); // 11.|357,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(3);

        await browser.keys(['z']);
        expect(await undoRedoElement.getText()).toEqual('1.357,92 €'); // |1.357,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(0);

        await browser.keys(['z']); // This makes sure we cannot go back too far
        expect(await undoRedoElement.getText()).toEqual('1.357,92 €'); // |1.357,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(0);

        await browser.keys([Key.Control]); // Release the control key
        expect(await undoRedoElement.getText()).toEqual('1.357,92 €'); // |1.357,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(0);
    });

    xit('should redo the user inputs correctly on non-input elements, when releasing the Shift then Control key', async () => { //FIXME This does not work under FF 52...
        let inputCaretPosition;
        const undoRedoElement = await $(selectors.undoRedo2);

        // Redos (releasing the keys shift, then ctrl)
        await browser.keys([Key.Control, Key.Shift, 'z']);
        expect(await undoRedoElement.getText()).toEqual('11.357,92 €'); // 11.|357,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(3);

        await browser.keys(['z']);
        expect(await undoRedoElement.getText()).toEqual('112.357,92 €'); // 112|.357,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(3);

        await browser.keys(['z']);
        expect(await undoRedoElement.getText()).toEqual('1.124.357,92 €'); // 1.124.3|57,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(7);

        await browser.keys(['z']);
        expect(await undoRedoElement.getText()).toEqual('11.243.657,92 €'); // 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(8);

        await browser.keys(['z']); // This makes sure we cannot go back too far
        expect(await undoRedoElement.getText()).toEqual('11.243.657,92 €'); // 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(8);

        await browser.keys([Key.Shift]); // Release the Shift key
        expect(await undoRedoElement.getText()).toEqual('11.243.657,92 €'); // 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(8);

        await browser.keys([Key.Control]); // Release the control key
        expect(await undoRedoElement.getText()).toEqual('11.243.657,92 €'); // 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(8);
    });

    xit('should redo the user inputs correctly on non-input elements, when releasing the Control then Shift key', async () => { //FIXME This does not work under FF 52...
        let inputCaretPosition;
        const undoRedoElement = await $(selectors.undoRedo2);

        // Undos some more to test the last redos with the specific key release order
        await browser.keys([Key.Control, 'z']);
        expect(await undoRedoElement.getText()).toEqual('1.124.357,92 €'); // 1.124.3|57,92 €
        await browser.keys(['z']);
        expect(await undoRedoElement.getText()).toEqual('112.357,92 €'); // 112|.357,92 €
        await browser.keys([Key.Control]);
        expect(await undoRedoElement.getText()).toEqual('112.357,92 €'); // 112|.357,92 €

        // Redos (releasing the keys ctrl, then shift)
        await browser.keys([Key.Control, Key.Shift, 'z']);
        expect(await undoRedoElement.getText()).toEqual('1.124.357,92 €'); // 1.124.3|57,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(7);

        await browser.keys(['z']);
        expect(await undoRedoElement.getText()).toEqual('11.243.657,92 €'); // 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(8);

        await browser.keys([Key.Control]); // Release the control key
        expect(await undoRedoElement.getText()).toEqual('11.243.657,92 €'); // 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(8);

        await browser.keys([Key.Shift]); // Release the Shift key
        expect(await undoRedoElement.getText()).toEqual('11.243.657,92 €'); // 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = await browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(8);
    });
});

describe('Issue #423', () => {
    it('should test for default values', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue423a).getValue()).toEqual('');
    });

    it('should keep zeros when losing focus and coming back to the element', async () => {
        const inputA = await $(selectors.issue423a);
        const inputB = await $(selectors.issue423b);

        // Focus in the input
        await inputA.click();

        // Input the numbers
        await browser.keys(['00123']);
        expect(await inputA.getValue()).toEqual('00123');

        // Lose the focus
        await inputB.click();
        expect(await inputA.getValue()).toEqual('00123');

        // Focus back in the input
        await inputA.click();
        expect(await inputA.getValue()).toEqual('00123');
    });

    it('should automatically overwrite zeros on the left-hand side when adding numbers', async () => {
        const inputA = await $(selectors.issue423a);

        // Input the numbers
        await browser.keys([Key.End, '4']);
        expect(await inputA.getValue()).toEqual('01234');
        await browser.keys(['5']);
        expect(await inputA.getValue()).toEqual('12345');

        // Try to add more numbers, that will be dropped due to the length constraint on the input
        await browser.keys(['6']);
        expect(await inputA.getValue()).toEqual('12345');
    });
});

describe('Issue #409', () => {
    it('should test for default values', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue409a).getValue()).toEqual('500.40');
        expect(await $(selectors.issue409n).getValue()).toEqual('500.4');
        expect(await $(selectors.issue409f).getValue()).toEqual('500.40');
    });

    it('should keep or remove zeros when losing focus and coming back to the element', async () => {
        const inputA = await $(selectors.issue409a);
        const inputN = await $(selectors.issue409n);
        const inputF = await $(selectors.issue409f);

        // Focus on the first input that we want to test
        await inputA.click();

        // Modify the value to an integer
        await browser.keys([Key.End, Key.Backspace, Key.Backspace]);
        await inputN.click(); // Focus out of the input so that it reformat itself
        expect(await inputA.getValue()).toEqual('500.00');

        // Modify the value to an integer
        await browser.keys([Key.End, Key.Backspace]);
        await inputF.click(); // Focus out of the input so that it reformat itself
        expect(await inputN.getValue()).toEqual('500');

        // Modify the value to float
        await browser.keys([Key.End, Key.Backspace]);
        await inputA.click(); // Focus out of the input so that it reformat itself
        expect(await inputF.getValue()).toEqual('500.40');

        // Modify the value to an integer
        await inputF.click();
        await browser.keys([Key.End, Key.Backspace, Key.Backspace]);
        await inputA.click(); // Focus out of the input so that it reformat itself
        expect(await inputF.getValue()).toEqual('500');
    });

    it('should keep or remove zeros when adding back the decimal part, and losing focus and coming back to the element', async () => {
        const inputA = await $(selectors.issue409a);
        const inputN = await $(selectors.issue409n);
        const inputF = await $(selectors.issue409f);

        // Focus on the first input that we want to test
        await inputA.click();

        // Modify the value to a float
        await browser.keys([Key.End, Key.ArrowLeft, Key.Backspace, '2']);
        await inputN.click(); // Focus out of the input so that it reformat itself
        expect(await inputA.getValue()).toEqual('500.20');
        await inputA.click();
        await browser.keys([Key.End, Key.Backspace, Key.Backspace, '2']);
        await inputN.click(); // Focus out of the input so that it reformat itself
        expect(await inputA.getValue()).toEqual('500.20');

        // Check that the value is converted to an integer by dropping the last dot character
        await browser.keys([Key.End, '.']);
        await inputF.click(); // Focus out of the input so that it reformat itself
        expect(await inputN.getValue()).toEqual('500');
        await inputN.click();
        // Modify the value to a float
        await browser.keys([Key.End, '.', '2']);
        await inputF.click(); // Focus out of the input so that it reformat itself
        expect(await inputN.getValue()).toEqual('500.2');

        // Modify the value to float
        await browser.keys([Key.End, '.']);
        await inputA.click(); // Focus out of the input so that it reformat itself
        // Check that the value is converted to an integer by dropping the last dot character
        expect(await inputF.getValue()).toEqual('500');
        await inputF.click();
        await browser.keys([Key.End, '.', '2']);
        await inputA.click(); // Focus out of the input so that it reformat itself
        expect(await inputF.getValue()).toEqual('500.20');
    });
});

describe('Issue #416', () => {
    it('should test for default values', async () => {
        await browser.url(testUrl);

        // none
        expect(await $(selectors.issue416Input1).getValue()).toEqual('1.00');
        // positiveNegative
        expect(await $(selectors.issue416Input2).getValue()).toEqual('-2.00');
        expect(await $(selectors.issue416Input3).getValue()).toEqual('3.00');
        // evenOdd
        expect(await $(selectors.issue416Input4).getValue()).toEqual('4.00');
        expect(await $(selectors.issue416Input5).getValue()).toEqual('5.00');
        // range0To100With4Steps
        expect(await $(selectors.issue416Input6).getValue()).toEqual('0.00');
        expect(await $(selectors.issue416Input7).getValue()).toEqual('25.00');
        expect(await $(selectors.issue416Input8).getValue()).toEqual('50.00');
        expect(await $(selectors.issue416Input9).getValue()).toEqual('99.00');
        // rangeSmallAndZero
        expect(await $(selectors.issue416Input10).getValue()).toEqual('-1.00');
        expect(await $(selectors.issue416Input11).getValue()).toEqual('0.00');
        expect(await $(selectors.issue416Input12).getValue()).toEqual('0.08');
    });

    it('should correctly change the CSS positive/negative classes', async () => {
        const input2 = await $(selectors.issue416Input2);
        const input3 = await $(selectors.issue416Input3);

        await input2.click();
        await browser.keys([Key.Home, '-----']);
        await input3.click();
        await browser.keys([Key.Home, '-----']);
    });

    it('should correctly change the CSS odd/even classes', async () => {
        const input4 = await $(selectors.issue416Input4);
        const input5 = await $(selectors.issue416Input5);

        await input4.click();
        await browser.keys([Key.Home, Key.ArrowRight, Key.ArrowLeft, '1']);
        expect(await input4.getValue()).toEqual('41.00');
        await input5.click();
        await browser.keys([Key.Home, Key.ArrowRight, Key.ArrowLeft, '2']);
        expect(await input5.getValue()).toEqual('52.00');
    });

    it('should correctly change the CSS ranges classes', async () => {
        // Not really a test, but it's pretty ;)
        const input6 = await $(selectors.issue416Input6);
        const input7 = await $(selectors.issue416Input7);
        const input8 = await $(selectors.issue416Input8);
        const input9 = await $(selectors.issue416Input9);

        // One cycle
        await input6.click();
        await browser.keys([Key.Control, 'a', Key.Control, '25']);
        await input7.click();
        await browser.keys([Key.Control, 'a', Key.Control, '50']);
        await input8.click();
        await browser.keys([Key.Control, 'a', Key.Control, '75']);
        await input9.click();
        await browser.keys([Key.Control, 'a', Key.Control, '0']);

        await input6.click();
        await browser.keys([Key.Control, 'a', Key.Control, '50']);
        await input7.click();
        await browser.keys([Key.Control, 'a', Key.Control, '75']);
        await input8.click();
        await browser.keys([Key.Control, 'a', Key.Control, '0']);
        await input9.click();
        await browser.keys([Key.Control, 'a', Key.Control, '25']);

        await input6.click();
        await browser.keys([Key.Control, 'a', Key.Control, '75']);
        await input7.click();
        await browser.keys([Key.Control, 'a', Key.Control, '0']);
        await input8.click();
        await browser.keys([Key.Control, 'a', Key.Control, '25']);
        await input9.click();
        await browser.keys([Key.Control, 'a', Key.Control, '50']);

        await input6.click();
        await browser.keys([Key.Control, 'a', Key.Control, '0']);
        await input7.click();
        await browser.keys([Key.Control, 'a', Key.Control, '25']);
        await input8.click();
        await browser.keys([Key.Control, 'a', Key.Control, '50']);
        await input9.click();
        await browser.keys([Key.Control, 'a', Key.Control, '75']);

        // Second cycle
        await input6.click();
        await browser.keys([Key.Control, 'a', Key.Control, '25']);
        await input7.click();
        await browser.keys([Key.Control, 'a', Key.Control, '50']);
        await input8.click();
        await browser.keys([Key.Control, 'a', Key.Control, '75']);
        await input9.click();
        await browser.keys([Key.Control, 'a', Key.Control, '0']);

        await input6.click();
        await browser.keys([Key.Control, 'a', Key.Control, '50']);
        await input7.click();
        await browser.keys([Key.Control, 'a', Key.Control, '75']);
        await input8.click();
        await browser.keys([Key.Control, 'a', Key.Control, '0']);
        await input9.click();
        await browser.keys([Key.Control, 'a', Key.Control, '25']);

        await input6.click();
        await browser.keys([Key.Control, 'a', Key.Control, '75']);
        await input7.click();
        await browser.keys([Key.Control, 'a', Key.Control, '0']);
        await input8.click();
        await browser.keys([Key.Control, 'a', Key.Control, '25']);
        await input9.click();
        await browser.keys([Key.Control, 'a', Key.Control, '50']);

        await input6.click();
        await browser.keys([Key.Control, 'a', Key.Control, '0']);
        await input7.click();
        await browser.keys([Key.Control, 'a', Key.Control, '25']);
        await input8.click();
        await browser.keys([Key.Control, 'a', Key.Control, '50']);
        await input9.click();
        await browser.keys([Key.Control, 'a', Key.Control, '75']);
    });

    it('should correctly change the CSS `rangeSmallAndZero` classes', async () => {
        // Ditto
        const input10 = await $(selectors.issue416Input10);
        const input11 = await $(selectors.issue416Input11);
        const input12 = await $(selectors.issue416Input12);

        // One cycle
        await input10.click();
        await browser.keys([Key.Control, 'a', Key.Control, '0']);
        await input11.click();
        await browser.keys([Key.Control, 'a', Key.Control, '1']);
        await input12.click();
        await browser.keys([Key.Control, 'a', Key.Control, '-1']);

        await input10.click();
        await browser.keys([Key.Control, 'a', Key.Control, '1']);
        await input11.click();
        await browser.keys([Key.Control, 'a', Key.Control, '-1']);
        await input12.click();
        await browser.keys([Key.Control, 'a', Key.Control, '0']);

        await input10.click();
        await browser.keys([Key.Control, 'a', Key.Control, '-1']);
        await input11.click();
        await browser.keys([Key.Control, 'a', Key.Control, '0']);
        await input12.click();
        await browser.keys([Key.Control, 'a', Key.Control, '1']);
    });
});

describe('Options updates', () => {
    it('should test for default values', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.optionUpdate1).getValue()).toEqual('2.222,22 €');
        expect(await $(selectors.optionUpdate2).getValue()).toEqual('4.444,66 €');
        expect(await $(selectors.optionUpdate3).getValue()).toEqual('$8,888.00');
    });

    it('should update the `decimalCharacterAlternative` option (cf. issue #432)', async () => {
        const input1 = await $(selectors.optionUpdate1);
        await input1.click();
        await browser.keys([Key.End, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.Delete]);
        expect(await input1.getValue()).toEqual('222.222 €');
        await browser.keys([',']);
        expect(await input1.getValue()).toEqual('2.222,22 €');
        await browser.keys([Key.Backspace]);
        expect(await input1.getValue()).toEqual('222.222 €');
        await browser.keys(['.']);
        expect(await input1.getValue()).toEqual('2.222,22 €');


        const input2 = await $(selectors.optionUpdate2);
        await input2.click();
        await browser.keys([Key.End, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.ArrowLeft, Key.Delete]);
        expect(await input2.getValue()).toEqual('444.466 €');
        await browser.keys([',']);
        expect(await input2.getValue()).toEqual('4.444,66 €');
        await browser.keys([Key.Backspace]);
        expect(await input2.getValue()).toEqual('444.466 €');
        await browser.keys(['*']);
        expect(await input2.getValue()).toEqual('4.444,66 €');
        await browser.keys([Key.Backspace]);
        expect(await input2.getValue()).toEqual('444.466 €');

        // Update the option
        const anElementVersion = await browser.execute(domId => {
            const input = document.querySelector(domId);
            const anElement = AutoNumeric.getAutoNumericElement(input);
            anElement.options.decimalCharacterAlternative('/');
            return anElement.rawValue;
        }, selectors.optionUpdate2);
        expect(anElementVersion).toEqual('444466');
        await browser.keys(['*']); // Ignored
        expect(await input2.getValue()).toEqual('444.466 €');
        await browser.keys(['/']);
        expect(await input2.getValue()).toEqual('4.444,66 €'); //XXX Using '#' as the decimal character alternative fails this test


        const input3 = await $(selectors.optionUpdate3);
        await input3.click();
        await browser.keys([Key.End, Key.ArrowLeft, Key.ArrowLeft, Key.Delete]);
        expect(await input3.getValue()).toEqual('$888,800');
        await browser.keys(['.']);
        expect(await input3.getValue()).toEqual('$8,888.00');
        await browser.keys([Key.Backspace]);
        expect(await input3.getValue()).toEqual('$888,800');
        await browser.keys([',']); // Ignored
        expect(await input3.getValue()).toEqual('$888,800'); // See issue #432
    });
});

describe('`decimalPlacesShownOnFocus` and selections', () => {
    it('should test for default values', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.selection1).getValue()).toEqual('12.266,123\u202f€');
    });

    it('should select the decimals correctly regarding the `decimalPlacesShownOnFocus` option', async () => {
        const input1 = await $(selectors.selection1);

        // Focus on the input
        await input1.click();

        // Check the text selection in the first input
        const inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            const anElement = AutoNumeric.getAutoNumericElement(input);
            anElement.selectDecimal();
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.selection1);
        expect(inputCaretPosition.start).toEqual(7);
        expect(inputCaretPosition.end).toEqual(13);
    });
});

describe('`showOnlyNumbersOnFocus` option', () => {
    it('should test for default values', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.showOnlyNumbersOnFocusInput1).getValue()).toEqual('-246.813,58\u202f€ loan');
        expect(await $(selectors.showOnlyNumbersOnFocusInput2).getValue()).toEqual('$-246,813.58 interest');
    });

    it('should show the unformatted value on focus', async () => {
        const input1 = await $(selectors.showOnlyNumbersOnFocusInput1);
        const input2 = await $(selectors.showOnlyNumbersOnFocusInput2);

        // Focus on the first input
        await input1.click();
        expect(await input1.getValue()).toEqual('-246813,58');
        expect(await input2.getValue()).toEqual('$-246,813.58 interest');

        // Blur the first input, and focus on the second
        await input2.click();
        expect(await input1.getValue()).toEqual('-246.813,58\u202f€ loan');
        expect(await input2.getValue()).toEqual('-246813.58');
    });
});

describe('`caretPositionOnFocus` option', () => {
    it('should test for default values', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.selectOnFocus1).getValue()).toEqual('-jk246.813,58');
        expect(await $(selectors.selectOnFocus2).getValue()).toEqual('-jk246.813,58');
        expect(await $(selectors.selectOnFocus3).getValue()).toEqual('jk-246.813,58');
        expect(await $(selectors.selectOnFocus4).getValue()).toEqual('jk246.813,58-');
        expect(await $(selectors.selectOnFocus5).getValue()).toEqual('-jk246.813,58');

        expect(await $(selectors.selectOnFocus6).getValue()).toEqual('-jk246.813,58');
        expect(await $(selectors.selectOnFocus7).getValue()).toEqual('-jk246.813,58');
        expect(await $(selectors.selectOnFocus8).getValue()).toEqual('jk-246.813,58');
        expect(await $(selectors.selectOnFocus9).getValue()).toEqual('jk246.813,58-');
        expect(await $(selectors.selectOnFocus10).getValue()).toEqual('-jk246.813,58');

        expect(await $(selectors.selectOnFocus11).getValue()).toEqual('-jk246.813,58');
        expect(await $(selectors.selectOnFocus12).getValue()).toEqual('-jk246.813,58');
        expect(await $(selectors.selectOnFocus13).getValue()).toEqual('jk-246.813,58');
        expect(await $(selectors.selectOnFocus14).getValue()).toEqual('jk246.813,58-');
        expect(await $(selectors.selectOnFocus15).getValue()).toEqual('-jk246.813,58');

        expect(await $(selectors.selectOnFocus16).getValue()).toEqual('-jk246.813,58');
        expect(await $(selectors.selectOnFocus17).getValue()).toEqual('-jk246.813,58');
        expect(await $(selectors.selectOnFocus18).getValue()).toEqual('jk-246.813,58');
        expect(await $(selectors.selectOnFocus19).getValue()).toEqual('jk246.813,58-');
        expect(await $(selectors.selectOnFocus20).getValue()).toEqual('-jk246.813,58');


        expect(await $(selectors.selectOnFocus21).getValue()).toEqual('-246.813,58jk');
        expect(await $(selectors.selectOnFocus22).getValue()).toEqual('246.813,58-jk');
        expect(await $(selectors.selectOnFocus23).getValue()).toEqual('246.813,58jk-');
        expect(await $(selectors.selectOnFocus24).getValue()).toEqual('246.813,58jk-');
        expect(await $(selectors.selectOnFocus25).getValue()).toEqual('-246.813,58jk');

        expect(await $(selectors.selectOnFocus26).getValue()).toEqual('-246.813,58jk');
        expect(await $(selectors.selectOnFocus27).getValue()).toEqual('246.813,58-jk');
        expect(await $(selectors.selectOnFocus28).getValue()).toEqual('246.813,58jk-');
        expect(await $(selectors.selectOnFocus29).getValue()).toEqual('246.813,58jk-');
        expect(await $(selectors.selectOnFocus30).getValue()).toEqual('-246.813,58jk');

        expect(await $(selectors.selectOnFocus31).getValue()).toEqual('-246.813,58jk');
        expect(await $(selectors.selectOnFocus32).getValue()).toEqual('246.813,58-jk');
        expect(await $(selectors.selectOnFocus33).getValue()).toEqual('246.813,58jk-');
        expect(await $(selectors.selectOnFocus34).getValue()).toEqual('246.813,58jk-');
        expect(await $(selectors.selectOnFocus35).getValue()).toEqual('-246.813,58jk');

        expect(await $(selectors.selectOnFocus36).getValue()).toEqual('-246.813,58jk');
        expect(await $(selectors.selectOnFocus37).getValue()).toEqual('246.813,58-jk');
        expect(await $(selectors.selectOnFocus38).getValue()).toEqual('246.813,58jk-');
        expect(await $(selectors.selectOnFocus39).getValue()).toEqual('246.813,58jk-');
        expect(await $(selectors.selectOnFocus40).getValue()).toEqual('-246.813,58jk');
    });

    it('should position the caret correctly on focus', async () => {
        let inputCaretPosition;
        const inputD = await $(selectors.selectOnFocusD);

        // Focus on the input before the input series
        await inputD.click();

        // Serie 1
        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus1);
        expect(inputCaretPosition).toEqual(3);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus2);
        expect(inputCaretPosition).toEqual(3);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus3);
        expect(inputCaretPosition).toEqual(3);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus4);
        expect(inputCaretPosition).toEqual(2);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus5);
        expect(inputCaretPosition).toEqual(3);

        // Serie 2
        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus6);
        expect(inputCaretPosition).toEqual(13);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus7);
        expect(inputCaretPosition).toEqual(13);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus8);
        expect(inputCaretPosition).toEqual(13);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus9);
        expect(inputCaretPosition).toEqual(12);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus10);
        expect(inputCaretPosition).toEqual(13);

        // Serie 3
        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus11);
        expect(inputCaretPosition).toEqual(10);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus12);
        expect(inputCaretPosition).toEqual(10);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus13);
        expect(inputCaretPosition).toEqual(10);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus14);
        expect(inputCaretPosition).toEqual(9);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus15);
        expect(inputCaretPosition).toEqual(10);

        // Serie 4
        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus16);
        expect(inputCaretPosition).toEqual(11);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus17);
        expect(inputCaretPosition).toEqual(11);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus18);
        expect(inputCaretPosition).toEqual(11);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus19);
        expect(inputCaretPosition).toEqual(10);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus20);
        expect(inputCaretPosition).toEqual(11);

        // Serie 5
        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus21);
        expect(inputCaretPosition).toEqual(1);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus22);
        expect(inputCaretPosition).toEqual(0);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus23);
        expect(inputCaretPosition).toEqual(0);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus24);
        expect(inputCaretPosition).toEqual(0);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus25);
        expect(inputCaretPosition).toEqual(1);

        // Serie 6
        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus26);
        expect(inputCaretPosition).toEqual(11);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus27);
        expect(inputCaretPosition).toEqual(10);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus28);
        expect(inputCaretPosition).toEqual(10);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus29);
        expect(inputCaretPosition).toEqual(10);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus30);
        expect(inputCaretPosition).toEqual(11);

        // Serie 7
        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus31);
        expect(inputCaretPosition).toEqual(8);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus32);
        expect(inputCaretPosition).toEqual(7);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus33);
        expect(inputCaretPosition).toEqual(7);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus34);
        expect(inputCaretPosition).toEqual(7);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus35);
        expect(inputCaretPosition).toEqual(8);

        // Serie 8
        // Focus on the input and check the caret position -246.813,58jk
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus36);
        expect(inputCaretPosition).toEqual(9);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus37);
        expect(inputCaretPosition).toEqual(8);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus38);
        expect(inputCaretPosition).toEqual(8);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus39);
        expect(inputCaretPosition).toEqual(8);

        // Focus on the input and check the caret position
        await browser.keys(Key.Tab);
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus40);
        expect(inputCaretPosition).toEqual(9);
    });
});

describe('`unformatOnSubmit` option', () => {
    it('should test for default values', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue442One).getValue()).toEqual('12.345,67\u202f€');
        expect(await $(selectors.issue442Two).getValue()).toEqual('1.111.222,21\u202f€');
        expect(await $(selectors.issue442Three).getValue()).toEqual('22.432.392,23\u202f€');
        expect(await $(selectors.issue442Four).getValue()).toEqual('0,00\u202f€');
    });

    it('should unformat on submit only the elements that activated the `unformatOnSubmit` option', async () => {
        const submitButton = await $(selectors.issue442Submit);

        await submitButton.click(); // Submit the form by clicking on the submit button
        expect(await $(selectors.issue442One).getValue()).toEqual('12345.67');
        expect(await $(selectors.issue442Two).getValue()).toEqual('1.111.222,21\u202f€');
        expect(await $(selectors.issue442Three).getValue()).toEqual('22432392.23');
        expect(await $(selectors.issue442Four).getValue()).toEqual('0,00\u202f€');
    });
});

describe('`emptyInputBehavior` option', () => {
    it('should test for default values', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue447).getValue()).toEqual('');
    });

    it('should detect a `null` value after using `set()`', async () => {
        expect(await $(selectors.result447).getText()).toEqual('Input value is null');
    });

    it('should change the `rawValue` to `null` when emptied', async () => {
        const issue447 = await $(selectors.issue447);

        await issue447.click(); // Focus on the input element
        expect(await issue447.getValue()).toEqual('');
        await browser.keys('1234');
        expect(await issue447.getValue()).toEqual('1,234');
        await browser.keys(Key.End);
        await browser.keys(Key.Backspace);
        expect(await issue447.getValue()).toEqual('123');
        await browser.keys(Key.Backspace);
        expect(await issue447.getValue()).toEqual('12');
        await browser.keys(Key.Backspace);
        expect(await issue447.getValue()).toEqual('1');
        await browser.keys(Key.Backspace);
        expect(await issue447.getValue()).toEqual('');

        // Then we test if the rawValue is correctly set to `null`
        const result = await browser.execute(domId => {
            const input = document.querySelector(domId);
            const an = AutoNumeric.getAutoNumericElement(input);
            return an.getNumber();
        }, selectors.issue447);
        expect(result).toBeNull();
    });

    //TODO Test that no error are produced when hovering the input
});

describe('`rawValueDivisor` option', () => {
    it('should test for default values', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue452).getValue()).toEqual('');
        expect(await $(selectors.result452).getText()).toEqual('Testing the raw value');
    });

    it('should update the raw value when divided by a `rawValueDivisor`, and the value is modified manually', async () => {
        const input = await $(selectors.issue452);
        const result = await $(selectors.result452);

        // Test entering a number manually, and getting the divided raw value
        await input.click(); // Focus on the input element
        expect(await input.getValue()).toEqual('');
        await browser.keys('1234');
        expect(await input.getValue()).toEqual('1,234');
        expect(await result.getText()).toEqual('12.34');

        // Test the rawValue directly
        const resultNum = await browser.execute(domId => {
            const input = document.querySelector(domId);
            const an    = AutoNumeric.getAutoNumericElement(input);
            return an.getNumericString();
        }, selectors.issue452);
        expect(resultNum).toEqual('12.34');

        await browser.keys('567.8');
        expect(await input.getValue()).toEqual('1,234,567.8');
        expect(await result.getText()).toEqual('12345.678');
    });

    it('should keep the correct raw value (divided by `rawValueDivisor`) when the element is unfocused', async () => {
        // Focus out of that input and check that the formatted and raw value are still ok
        await $(selectors.issue452Unfocus).click(); // First we change the focus to another element, then try to `set()` a value.
        expect(await $(selectors.issue452).getValue()).toEqual('1,234,567.80');
        expect(await $(selectors.result452).getText()).toEqual('12345.678');
    });

    it('should update the raw value when divided by a `rawValueDivisor`, and the value is modified via a script, while the element is unfocused', async () => {
        // Modify the element value while it does not have the focus
        const result = await browser.execute(domId => {
            const input = document.querySelector(domId);
            const an = AutoNumeric.getAutoNumericElement(input);
            an.update(AutoNumeric.getPredefinedOptions().percentageEU3dec);
            an.set(0.0221456); // This makes sure that if the element is currently unfocused, and an external script modify its value with `set`, the `rawValueDivisor` option is not used. This should only be used when the user is actually inputting numbers manually.
            return an.getNumericString();
        }, selectors.issue452);
        expect(result).toEqual('0.02215');
        expect(await $(selectors.issue452).getValue()).toEqual('2,215\u202f%');
        // browser.keys(Key.Escape, Key.Escape);
        // browser.keys(Key.Backspace);
    });

    it('should update the raw value when divided by a `rawValueDivisor`, and the value is modified via a script, while the element is focused', async () => {
        // Modify the element value while it has the focus
        await $(selectors.issue452).click(); // Focus on the input element
        const result = await browser.execute(domId => {
            const input = document.querySelector(domId);
            const an = AutoNumeric.getAutoNumericElement(input);
            an.set(0.07621327); // This makes sure that if the element is currently focused in, and an external script modify its value with `set`, the `rawValueDivisor` option is not used. This should only be used when the user is actually inputting numbers manually.
            return an.getNumericString();
        }, selectors.issue452);
        expect(result).toEqual('0.07621');
        expect(await $(selectors.issue452).getValue()).toEqual('7,621\u202f%');
    });

    it('should update on load the formatted and raw value when divided by a `rawValueDivisor`', async () => {
        expect(await $(selectors.issue452Formatted).getValue()).toEqual('12,35\u202f%');
        const result = await browser.execute(domId => {
            const input = document.querySelector(domId);
            const an = AutoNumeric.getAutoNumericElement(input);
            return an.getNumericString();
        }, selectors.issue452Formatted);
        expect(result).toEqual('0.1235');
    });
});

describe('`negativeSignCharacter` option', () => {
    it('should test for default values', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue478Neg1).getValue()).toEqual('-0.20');
        expect(await $(selectors.issue478Neg2).getValue()).toEqual('°12.00');
        expect(await $(selectors.issue478Neg3).getValue()).toEqual('(200.00)');
        expect(await $(selectors.issue478Pos1).getValue()).toEqual('z14.00');
        expect(await $(selectors.issue478Pos2).getValue()).toEqual('-0.42');
        expect(await $(selectors.issue478NegPos).getValue()).toEqual('∸1,234.78');

        expect(await $(selectors.issue478RightPlacementNeg1).getValue()).toEqual('0.20');
        expect(await $(selectors.issue478RightPlacementNeg2).getValue()).toEqual('12.00');
        expect(await $(selectors.issue478RightPlacementNeg3).getValue()).toEqual('200.00');
        expect(await $(selectors.issue478RightPlacementPos1).getValue()).toEqual('14.00p');
        expect(await $(selectors.issue478RightPlacementPos2).getValue()).toEqual('0.42⧺');
        expect(await $(selectors.issue478RightPlacementNegPos).getValue()).toEqual('1,234.78⧻');

        expect(await $(selectors.issue478Neg4).getValue()).toEqual('(468.31)');
    });

    it('should display the correct negative/positive value on focus, when the positive and negative signs are customized', async () => {
        await $(selectors.issue478Neg1).click(); // Focus on the input element
        expect(await $(selectors.issue478Neg1).getValue()).toEqual('-0.20');
        await browser.keys(Key.Tab);
        expect(await $(selectors.issue478Neg2).getValue()).toEqual('°12.00');
        await browser.keys(Key.Tab);
        expect(await $(selectors.issue478Neg3).getValue()).toEqual('-200.00');
        await browser.keys(Key.Tab);
        expect(await $(selectors.issue478Pos1).getValue()).toEqual('z14.00');
        await browser.keys(Key.Tab);
        expect(await $(selectors.issue478Pos2).getValue()).toEqual('-0.42');
        await browser.keys(Key.Tab);
        expect(await $(selectors.issue478NegPos).getValue()).toEqual('∸1,234.78');
        await browser.keys(Key.Tab);

        expect(await $(selectors.issue478RightPlacementNeg1).getValue()).toEqual('0.20');
        await browser.keys(Key.Tab);
        expect(await $(selectors.issue478RightPlacementNeg2).getValue()).toEqual('12.00');
        await browser.keys(Key.Tab);
        expect(await $(selectors.issue478RightPlacementNeg3).getValue()).toEqual('200.00');
        await browser.keys(Key.Tab);
        expect(await $(selectors.issue478RightPlacementPos1).getValue()).toEqual('14.00p');
        await browser.keys(Key.Tab);
        expect(await $(selectors.issue478RightPlacementPos2).getValue()).toEqual('0.42⧺');
        await browser.keys(Key.Tab);
        expect(await $(selectors.issue478RightPlacementNegPos).getValue()).toEqual('1,234.78⧻');
        await browser.keys(Key.Tab);

        expect(await $(selectors.issue478Neg4).getValue()).toEqual('∸468.31');
    });

    it('should display the correct negative/positive value on blur, when the positive and negative signs are customized', async () => {
        await $(selectors.issue478RightPlacementNegPos).click();
        expect(await $(selectors.issue478Neg1).getValue()).toEqual('-0.20');
        await $(selectors.issue478Neg1).click();
        expect(await $(selectors.issue478Neg1).getValue()).toEqual('-0.20');
        await browser.keys(Key.Tab);
        expect(await $(selectors.issue478Neg1).getValue()).toEqual('-0.20');
        await browser.keys(Key.Tab);
        expect(await $(selectors.issue478Neg2).getValue()).toEqual('°12.00');
        await browser.keys(Key.Tab);
        expect(await $(selectors.issue478Neg3).getValue()).toEqual('(200.00)');
        await browser.keys(Key.Tab);
        expect(await $(selectors.issue478Pos1).getValue()).toEqual('z14.00');
        await browser.keys(Key.Tab);
        expect(await $(selectors.issue478Pos2).getValue()).toEqual('-0.42');
        await browser.keys(Key.Tab);
        expect(await $(selectors.issue478NegPos).getValue()).toEqual('∸1,234.78');
        await browser.keys(Key.Tab);

        expect(await $(selectors.issue478RightPlacementNeg1).getValue()).toEqual('0.20');
        await browser.keys(Key.Tab);
        expect(await $(selectors.issue478RightPlacementNeg2).getValue()).toEqual('12.00');
        await browser.keys(Key.Tab);
        expect(await $(selectors.issue478RightPlacementNeg3).getValue()).toEqual('200.00');
        await browser.keys(Key.Tab);
        expect(await $(selectors.issue478RightPlacementPos1).getValue()).toEqual('14.00p');
        await browser.keys(Key.Tab);
        expect(await $(selectors.issue478RightPlacementPos2).getValue()).toEqual('0.42⧺');
        await browser.keys(Key.Tab);
        expect(await $(selectors.issue478RightPlacementNegPos).getValue()).toEqual('1,234.78⧻');
        await browser.keys(Key.Tab);

        expect(await $(selectors.issue478Neg4).getValue()).toEqual('(468.31)');
    });

    it('should allow modifying the negative/positive state using the hyphen key, when the negative sign is the hyphen character', async () => {
        await $(selectors.issue478Neg1).click(); // Focus on the input element
        expect(await $(selectors.issue478Neg1).getValue()).toEqual('-0.20');
        await browser.keys([Key.End, '-']);
        expect(await $(selectors.issue478Neg1).getValue()).toEqual('0.20');
        await browser.keys('-');
        expect(await $(selectors.issue478Neg1).getValue()).toEqual('-0.20');
        await browser.keys([Key.Home, '-']);
        expect(await $(selectors.issue478Neg1).getValue()).toEqual('0.20');
        await browser.keys('-');
        expect(await $(selectors.issue478Neg1).getValue()).toEqual('-0.20');

        // Test the rawValue directly
        const result = await browser.execute(domId => {
            const input = document.querySelector(domId);
            const an    = AutoNumeric.getAutoNumericElement(input);
            return an.getNumericString();
        }, selectors.issue478Neg1);
        expect(result).toEqual('-0.2');

        await browser.keys([Key.Home, '234']);
        expect(await $(selectors.issue478Neg1).getValue()).toEqual('-2,340.20');
    });

    //FIXME Test the localized value when using a custom negative sign and `outputFormat.dotNegative`, `outputFormat.commaNegative` and `outputFormat.number`
    //FIXME Test the rounded value when rounding a positive and negative value with `roundingMethod.halfUpAsymmetric`, `roundingMethod.halfDownAsymmetric`, `roundingMethod.toCeilingTowardPositiveInfinity` and `roundingMethod.toFloorTowardNegativeInfinity`

    it('should allow modifying the negative/positive state using the hyphen key if a custom negative sign is used', async () => {
        await $(selectors.issue478Neg2).click(); // Focus on the input element
        expect(await $(selectors.issue478Neg2).getValue()).toEqual('°12.00');
        await browser.keys([Key.Home, '-']); // Check that when entering '-' while the caret is on the far left of the negative number (with a custom negative sign), the whole value is replaced by '-', while it should just toggle the negative/positive state
        expect(await $(selectors.issue478Neg2).getValue()).toEqual('12.00');
        await browser.keys('-');
        expect(await $(selectors.issue478Neg2).getValue()).toEqual('°12.00');
        // await browser.keys('°'); // We don't want the user to be able to change the negative/positive sign using the custom character (too complex), so only '-' and '+' are accepted
        // expect(await $(selectors.issue478Neg2).getValue()).toEqual('°12.00'); //FIXME This does not work anymore with Webdriver.io v8: fix this
        await browser.keys('-');
        expect(await $(selectors.issue478Neg2).getValue()).toEqual('12.00');
        // await browser.keys('°');
        // expect(await $(selectors.issue478Neg2).getValue()).toEqual('12.00'); //FIXME This does not work anymore with Webdriver.io v8: fix this
        await browser.keys('-');
        expect(await $(selectors.issue478Neg2).getValue()).toEqual('°12.00');

        // Test the rawValue directly
        const result = await browser.execute(domId => {
            const input = document.querySelector(domId);
            const an    = AutoNumeric.getAutoNumericElement(input);
            return an.getNumericString();
        }, selectors.issue478Neg2);
        expect(result).toEqual('-12');

        // Having the caret on the far left and entering a number should automatically set that number at the right position
        await browser.keys([Key.Home, '7']);
        expect(await $(selectors.issue478Neg2).getValue()).toEqual('°712.00');
        // Check the text selection
        const inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue478Neg2);
        expect(inputCaretPosition.start).toEqual(2);
        expect(inputCaretPosition.end).toEqual(2);

        // Continue adding numbers
        await browser.keys('34');
        expect(await $(selectors.issue478Neg2).getValue()).toEqual('°73,412.00');
        await browser.keys([Key.End, '-']);
        expect(await $(selectors.issue478Neg2).getValue()).toEqual('73,412.00');
        await browser.keys('-');
        expect(await $(selectors.issue478Neg2).getValue()).toEqual('°73,412.00');
    });

    it('should not allow modifying the negative/positive state using the custom negative sign', async () => {
        await $(selectors.issue478Pos1).click(); // Focus on the input element
        expect(await $(selectors.issue478Pos1).getValue()).toEqual('z14.00');
        await browser.keys([Key.End, '-']);
        expect(await $(selectors.issue478Pos1).getValue()).toEqual('+14.00');
        await browser.keys('-');
        expect(await $(selectors.issue478Pos1).getValue()).toEqual('z14.00');
        await browser.keys([Key.Home, '-']);
        expect(await $(selectors.issue478Pos1).getValue()).toEqual('+14.00');
        await browser.keys('-');
        expect(await $(selectors.issue478Pos1).getValue()).toEqual('z14.00');
        await browser.keys('z'); // This should have no effect on the negative/positive sign
        expect(await $(selectors.issue478Pos1).getValue()).toEqual('z14.00');

        // Test the rawValue directly
        const result = await browser.execute(domId => {
            const input = document.querySelector(domId);
            const an    = AutoNumeric.getAutoNumericElement(input);
            return an.getNumericString();
        }, selectors.issue478Pos1);
        expect(result).toEqual('-14');

        await browser.keys([Key.Home, '234']);
        expect(await $(selectors.issue478Pos1).getValue()).toEqual('z23,414.00');
    });

    it('should allow setting the positive state using the `+` character, while a custom positive sign is defined', async () => {
        await $(selectors.issue478RightPlacementPos1).click(); // Focus on the input element
        expect(await $(selectors.issue478RightPlacementPos1).getValue()).toEqual('14.00p');
        await browser.keys([Key.Home, '+']);
        expect(await $(selectors.issue478RightPlacementPos1).getValue()).toEqual('14.00-');
        await browser.keys([Key.Home, '+']);
        expect(await $(selectors.issue478RightPlacementPos1).getValue()).toEqual('14.00p');
        await browser.keys('+');
        expect(await $(selectors.issue478RightPlacementPos1).getValue()).toEqual('14.00-');

        // Check that the caret position is at the correct position
        const inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue478RightPlacementPos1);
        expect(inputCaretPosition.start).toEqual(0);
        expect(inputCaretPosition.end).toEqual(0);

        await browser.keys([Key.End, '+']); // Check that if the caret is after the positive sign, you can still modify the positive/negative state
        expect(await $(selectors.issue478RightPlacementPos1).getValue()).toEqual('14.00p'); // Fixed in issue #481
        await browser.keys('+');
        expect(await $(selectors.issue478RightPlacementPos1).getValue()).toEqual('14.00-');
        await browser.keys('p'); // This should have no effect on the negative/positive sign
        expect(await $(selectors.issue478RightPlacementPos1).getValue()).toEqual('14.00-');
        await browser.keys('+');
        expect(await $(selectors.issue478RightPlacementPos1).getValue()).toEqual('14.00p');

        // Test the rawValue directly
        const result = await browser.execute(domId => {
            const input = document.querySelector(domId);
            const an    = AutoNumeric.getAutoNumericElement(input);
            return an.getNumericString();
        }, selectors.issue478RightPlacementPos1);
        expect(result).toEqual('14');

        await browser.keys([Key.Home, '234']);
        expect(await $(selectors.issue478RightPlacementPos1).getValue()).toEqual('23,414.00p');
    });

    it('should toggle the negative state and set the caret at the correct position when using custom negative and positive trailing signs', async () => {
        // issue_478_RightPlacement_negPos
        await $(selectors.issue478RightPlacementNegPos).click(); // Focus on the input element
        expect(await $(selectors.issue478RightPlacementNegPos).getValue()).toEqual('1,234.78⧻');
        await browser.keys([Key.End, '-']);
        expect(await $(selectors.issue478RightPlacementNegPos).getValue()).toEqual('1,234.78∸');
        // Check that the caret position is at the correct position
        let inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue478RightPlacementNegPos);
        expect(inputCaretPosition.start).toEqual(8);
        expect(inputCaretPosition.end).toEqual(8);

        await browser.keys('-');
        expect(await $(selectors.issue478RightPlacementNegPos).getValue()).toEqual('1,234.78⧻');
        // Check that the caret position is at the correct position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue478RightPlacementNegPos);
        expect(inputCaretPosition.start).toEqual(8);
        expect(inputCaretPosition.end).toEqual(8);

        await browser.keys([Key.End, '+']);
        expect(await $(selectors.issue478RightPlacementNegPos).getValue()).toEqual('1,234.78∸');
        // Check that the caret position is at the correct position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue478RightPlacementNegPos);
        expect(inputCaretPosition.start).toEqual(8);
        expect(inputCaretPosition.end).toEqual(8);

        await browser.keys('+');
        expect(await $(selectors.issue478RightPlacementNegPos).getValue()).toEqual('1,234.78⧻');
        // Check that the caret position is at the correct position
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue478RightPlacementNegPos);
        expect(inputCaretPosition.start).toEqual(8);
        expect(inputCaretPosition.end).toEqual(8);
    });

    it('should not allow setting the positive state using the custom positive sign', async () => {
        await $(selectors.issue478RightPlacementPos1).click(); // Focus on the input element
        expect(await $(selectors.issue478RightPlacementPos1).getValue()).toEqual('23,414.00p');
        await browser.keys([Key.Home, '+']);
        expect(await $(selectors.issue478RightPlacementPos1).getValue()).toEqual('23,414.00-');
        await browser.keys('+');
        expect(await $(selectors.issue478RightPlacementPos1).getValue()).toEqual('23,414.00p');
        await browser.keys('p'); // This should have no effect on the negative/positive sign
        expect(await $(selectors.issue478RightPlacementPos1).getValue()).toEqual('23,414.00p');
        await browser.keys('+');
        expect(await $(selectors.issue478RightPlacementPos1).getValue()).toEqual('23,414.00-');
    });

    it('should display the brackets when `negativeBracketsTypeOnBlur`, `negativeSignCharacter` and `positiveSignCharacter` are set, on focus and blur', async () => {
        const issue478Neg4 = await $(selectors.issue478Neg4);

        expect(await issue478Neg4.getValue()).toEqual('(468.31)');
        await issue478Neg4.click();
        // When removing the brackets, the custom negative sign must be shown
        expect(await issue478Neg4.getValue()).toEqual('∸468.31');
        await $(selectors.issue478Neg1).click();
        expect(await issue478Neg4.getValue()).toEqual('(468.31)');
    });

    it('should allow pasting values with custom positive and negative signs', async () => {
        // First, paste a positive value
        const inputClassic = await $(selectors.inputClassic);
        await inputClassic.click();
        // Clear the input content
        await browser.keys([Key.Control, 'a', Key.Control, Key.Backspace]);
        await browser.keys('⧺67890.42');

        // Copy
        await browser.keys([Key.Control, 'a', 'c', Key.Control]);

        // Paste
        await $(selectors.issue478Pos2).click();
        await browser.keys([Key.Control, 'a', 'v', Key.Control]);
        expect(await $(selectors.issue478Pos2).getValue()).toEqual('⧺67,890.42');


        // Then paste a negative value
        await inputClassic.click();
        // Clear the input content
        await browser.keys([Key.Control, 'a', Key.Control, Key.Backspace]);
        await browser.keys('∸234,220.08');

        // Copy
        await browser.keys([Key.Control, 'a', 'c', Key.Control]);

        // Paste
        await $(selectors.issue478NegPos).click();
        await browser.keys([Key.Control, 'a', 'v', Key.Control]);
        expect(await $(selectors.issue478NegPos).getValue()).toEqual('∸234,220.08');
    });

    it('should allow pasting the exact same value without setting the final result to zero (Issue #483)', async () => {
        // First, paste a positive value
        const inputClassic = await $(selectors.inputClassic);
        await inputClassic.click();
        // Clear the input content
        await browser.keys([Key.Control, 'a', Key.Control, Key.Backspace]);
        await browser.keys('⧺111222.33');

        // Copy
        await browser.keys([Key.Control, 'a', 'c', Key.Control]);

        await $(selectors.issue478Pos2).click();
        // Paste number 1
        await browser.keys([Key.Control, 'a', 'v', Key.Control]);
        expect(await $(selectors.issue478Pos2).getValue()).toEqual('⧺111,222.33');
        // Paste number 2 ; this should not change the result
        await browser.keys([Key.Control, 'a', 'v', Key.Control]);
        expect(await $(selectors.issue478Pos2).getValue()).toEqual('⧺111,222.33');
    });

    xit('should allow using the wheel to modify the input value when both the positive and negative signs are customized', async () => { //FIXME Finish this -->
        expect(await $(selectors.issue478RightPlacementPos1).getValue()).toEqual('23,414.00-');
        await browser.moveTo(selectors.issue478RightPlacementPos1); // Move the mouse over the element //TODO Test the webdriver.io v5 moveToObject change to `moveTo` function
        await browser.scrollIntoView(0, 250); //FIXME This is not the right function to call here
        expect(await $(selectors.issue478RightPlacementPos1).getValue()).toEqual('23,914.00-');
    });

    xit('should correctly modify the value when using the mouse wheel event on an element where `negativeBracketsTypeOnBlur` and `negativeSignCharacter` are set, when the value is changed once, then blurred, then changed again with the mouse wheel while it\'s negative', async () => { //FIXME Finish this -->
        //
    });

    xit('should correctly display the negative value with the custom negative sign on mouseover (without adding the default minus sign)', async () => { //FIXME Finish this -->
        expect(await $(selectors.issue478Neg3).getValue()).toEqual('(200.00)');
        await browser.moveTo(selectors.issue478Neg3); // Move the mouse over the element //FIXME This does not work //TODO Test the webdriver.io v5 moveToObject change to `moveTo` function
        expect(await $(selectors.issue478Neg3).getValue()).toEqual('-200.00');
    });
});

describe('Pasting', () => {
    it('should test for default values', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue387inputCancellable).getValue()).toEqual('$220,242.76');
    });

    it('should not be possible to paste any invalid numbers in an element if the whole content is not already selected', async () => {
        const inputClassic = await $(selectors.inputClassic);
        const issue387inputCancellable = await $(selectors.issue387inputCancellable);

        await inputClassic.click();
        // Clear the input content
        await browser.keys([Key.Control, 'a', Key.Control, Key.Backspace]);
        await browser.keys('foobar');
        expect(await inputClassic.getValue()).toEqual('foobar');

        // Copy
        await browser.keys([Key.Control, 'a', 'c', Key.Control]);

        // Paste
        await issue387inputCancellable.click();
        await browser.keys([Key.Home, Key.ArrowRight, Key.ArrowRight, Key.ArrowRight]);
        await browser.keys([Key.Control, 'v', Key.Control]);
        expect(await issue387inputCancellable.getValue()).toEqual('$220,242.76');
    });

    it('should not be possible to paste any invalid numbers in an element if the whole content is already selected', async () => {
        const inputClassic = await $(selectors.inputClassic);
        const issue387inputCancellable = await $(selectors.issue387inputCancellable);

        await inputClassic.click();
        // Clear the input content
        await browser.keys([Key.Control, 'a', Key.Control, Key.Backspace]);
        await browser.keys('foobar');
        expect(await inputClassic.getValue()).toEqual('foobar');

        // Copy
        await browser.keys([Key.Control, 'a', 'c', Key.Control]);

        // Paste
        await issue387inputCancellable.click();
        await browser.keys([Key.Control, 'a', 'v', Key.Control]);
        expect(await issue387inputCancellable.getValue()).toEqual('$220,242.76');
    });

    it('should not be possible to paste an invalid number on a selection which does not include the currency symbol', async () => {
        const inputClassic = await $(selectors.inputClassic);
        const issue387inputCancellable = await $(selectors.issue387inputCancellable);

        await inputClassic.click();
        // Clear the input content
        await browser.keys([Key.Control, 'a', Key.Control, Key.Backspace]);
        await browser.keys('foobar');
        expect(await inputClassic.getValue()).toEqual('foobar');

        // Copy
        await browser.keys([Key.Control, 'a', 'c', Key.Control]);

        // Paste
        await issue387inputCancellable.click();
        await browser.keys([Key.Home, Key.ArrowRight, Key.Shift, Key.ArrowRight, Key.ArrowRight, Key.Shift]);
        await browser.keys([Key.Control, 'a', 'v', Key.Control]);
        expect(await issue387inputCancellable.getValue()).toEqual('$220,242.76');
    });

    it('should not be possible to paste an valid number in a readOnly element', async () => {
        const readOnlyElement = await $(selectors.readOnlyElement);
        expect(await readOnlyElement.getValue()).toEqual('42.42');

        const inputClassic = await $(selectors.inputClassic);
        await inputClassic.click();
        // Clear the input content
        await browser.keys([Key.Control, 'a', Key.Control, Key.Backspace]);
        await browser.keys('12345.67');
        expect(await inputClassic.getValue()).toEqual('12345.67');

        // Copy
        await browser.keys([Key.Control, 'a', 'c', Key.Control]);

        // Paste
        await readOnlyElement.click();
        await browser.keys([Key.Home, Key.ArrowRight, Key.Shift, Key.ArrowRight, Key.ArrowRight, Key.Shift]);
        await browser.keys([Key.Control, 'a', 'v', Key.Control]);
        expect(await readOnlyElement.getValue()).toEqual('42.42'); // No changes!
    });
});

describe('Issue #432', () => {
    it('should test for default values, and focus on it', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue432dot).getValue()).toEqual('');
        expect(await $(selectors.issue432none).getValue()).toEqual('');
    });

    it('should accept the alternative decimal character', async () => {
        const inputWithDecimalCharAlternative = await $(selectors.issue432dot);

        await inputWithDecimalCharAlternative.click();
        // With the comma: ok
        await browser.keys('123,45');
        expect(await inputWithDecimalCharAlternative.getValue()).toEqual('123,45 €');

        // With the dot: ok
        await browser.keys([Key.Home, Key.Control, 'a', Key.Control, Key.Delete]);
        await browser.keys('123.45');
        expect(await inputWithDecimalCharAlternative.getValue()).toEqual('123,45 €');
    });

    it('should not accept any alternative decimal character', async () => {
        const inputWithoutDecimalCharAlternative = await $(selectors.issue432none);

        await inputWithoutDecimalCharAlternative.click();
        // With the comma: ok
        await browser.keys('123,45');
        expect(await inputWithoutDecimalCharAlternative.getValue()).toEqual('123,45 €');

        // With the dot: ko
        await browser.keys([Key.Home, Key.Control, 'a', Key.Control, Key.Delete]);
        await browser.keys('123.45');
        expect(await inputWithoutDecimalCharAlternative.getValue()).toEqual('12.345 €');
    });
});

describe('Issue #535', () => {
    it('should test for default values, and focus on it', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue535).getValue()).toEqual('');
    });

    it('should not accept the decimal character or its alternative, and not change the selection', async () => {
        const inputWithDecimalCharAlternative = await $(selectors.issue535);

        await inputWithDecimalCharAlternative.click();
        // With the default decimal character
        await browser.keys('123.456');
        expect(await inputWithDecimalCharAlternative.getValue()).toEqual('123456');

        // With the alternative decimal character
        await browser.keys([Key.Home, Key.Control, 'a', Key.Control, Key.Delete]);
        await browser.keys('123,456');
        expect(await inputWithDecimalCharAlternative.getValue()).toEqual('123456');
    });
});

describe('Issue #550', () => {
    it('should test for default values, and focus on it', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue550).getValue()).toEqual('(1,357,246.81)');
    });

    it(`should not send a 'change' event when focusing then blurring the input`, async () => {
        const input = await $(selectors.issue550);
        await input.click();
        const inputBlur = await $(selectors.issue550Blur);
        await inputBlur.click();
        const issue550ChangeDetector = await $(selectors.issue550ChangeDetector);

        expect(await issue550ChangeDetector.getValue()).toEqual('0');

        // Reset the change event counter
        await $(selectors.issue550Button).click();
        expect(await issue550ChangeDetector.getValue()).toEqual('0');
    });

    it(`should send a single 'change' event when modifying the value, then blurring`, async () => {
        const input = await $(selectors.issue550);
        const inputBlur = await $(selectors.issue550Blur);
        const issue550ChangeDetector = await $(selectors.issue550ChangeDetector);
        await input.click();

        expect(await issue550ChangeDetector.getValue()).toEqual('0');
        await browser.keys([Key.Home, '5']);
        expect(await input.getValue()).toEqual('-51,357,246.81');
        await inputBlur.click();
        expect(await issue550ChangeDetector.getValue()).toEqual('1');

        // Modify the input again
        await input.click();
        await browser.keys([Key.Home, '6']);
        expect(await input.getValue()).toEqual('-651,357,246.81');
        await inputBlur.click();
        expect(await issue550ChangeDetector.getValue()).toEqual('2');
        await input.click();
        await browser.keys([Key.Home, '2']);
        expect(await input.getValue()).toEqual('-2,651,357,246.81');
        await inputBlur.click();
        expect(await issue550ChangeDetector.getValue()).toEqual('3');

        // Reset the change event counter
        await $(selectors.issue550Button).click();
        expect(await issue550ChangeDetector.getValue()).toEqual('0');
    });

    it(`should send a single 'change' event when modifying the value, then hitting the enter key (and then blurring the input)`, async () => {
        const input = await $(selectors.issue550);
        const inputBlur = await $(selectors.issue550Blur);
        const issue550ChangeDetector = await $(selectors.issue550ChangeDetector);
        await input.click();

        expect(await issue550ChangeDetector.getValue()).toEqual('0');
        await browser.keys([Key.Home, '1']);
        expect(await input.getValue()).toEqual('-12,651,357,246.81');
        await browser.keys(Key.Enter);
        expect(await issue550ChangeDetector.getValue()).toEqual('1');
        await inputBlur.click();
        expect(await issue550ChangeDetector.getValue()).toEqual('1');
    });
});

describe('Issue #521', () => {
    it('should test for default values, and focus on it', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue521).getValue()).toEqual('');
        expect(await $(selectors.issue521Set).getValue()).toEqual('1,234.57');

        // Prepare the text to paste
        const inputClassic = await $(selectors.inputClassic);
        await inputClassic.click();
        expect(await inputClassic.getValue()).toEqual('987654321');
        await browser.keys([Key.Home, Key.Shift, Key.ArrowRight, Key.ArrowRight, Key.Shift]);
        await browser.keys([Key.Control, 'c', Key.Control]); // 98 in the clipboard
    });

    it(`should send an 'input' event when pasting a valid value in an empty input`, async () => {
        const input = await $(selectors.issue521);
        const issue521InputDetector = await $(selectors.issue521InputDetector);

        await input.click();
        expect(await issue521InputDetector.getValue()).toEqual('0');
        await browser.keys([Key.Control, 'v', Key.Control]); // Paste
        expect(await issue521InputDetector.getValue()).toEqual('1');
        expect(await input.getValue()).toEqual('98.00');

        // Reset the input event counter
        await $(selectors.issue521Button).click();
        expect(await issue521InputDetector.getValue()).toEqual('0');
    });

    it(`should send an 'input' event when pasting a valid value at a caret position in an non-empty input`, async () => {
        const input = await $(selectors.issue521Set);
        const issue521InputDetector = await $(selectors.issue521InputDetector);

        await input.click();
        expect(await issue521InputDetector.getValue()).toEqual('0');

        await browser.keys([Key.Home, Key.ArrowRight, Key.ArrowRight]); // Move the caret
        await browser.keys([Key.Control, 'v', Key.Control]); // Paste
        expect(await issue521InputDetector.getValue()).toEqual('1');
        expect(await input.getValue()).toEqual('129,834.57');

        // Reset the change event counter
        await $(selectors.issue521Button).click();
        expect(await issue521InputDetector.getValue()).toEqual('0');
    });

    it(`should send an 'input' event when pasting a valid value in an non-empty input with all its content selected`, async () => {
        const input = await $(selectors.issue521Set);
        const issue521InputDetector = await $(selectors.issue521InputDetector);

        await input.click();
        expect(await issue521InputDetector.getValue()).toEqual('0');

        await browser.keys([Key.Home, Key.Shift, Key.End, Key.Shift]); // Select all the input content
        await browser.keys([Key.Control, 'v', Key.Control]); // Paste
        expect(await issue521InputDetector.getValue()).toEqual('1');
        expect(await input.getValue()).toEqual('98.00');
    });
});

describe('Issue #574', () => {
    it('should test for default values, and focus on it', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue574).getValue()).toEqual('-0.05');
    });

    it(`should send an 'input' event when pasting a valid value in an empty input`, async () => {
        const input = await $(selectors.issue574);
        await input.click();
        await browser.keys([Key.Home, Key.ArrowRight, Key.ArrowRight, '-']);
        expect(await input.getValue()).toEqual('0.05');
        await browser.keys(['-']);
        expect(await input.getValue()).toEqual('-0.05');
    });
});

describe('Issue #559', () => {
    it('should test for default values, and focus on it', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue559).getValue()).toEqual('12,345.68');
        expect(await $(selectors.issue559Default).getValue()).toEqual('');
    });

    it(`should accept a decimal character on the far left of a negative number, when the \`alwaysAllowDecimalCharacter\` option is set to \`false\``, async () => {
        const input = await $(selectors.issue559Default);
        await input.click();
        await browser.keys(['-12345']);
        await browser.keys([Key.Home, '.']);
        expect(await input.getValue()).toEqual('-0.12');
    });

    it(`should not accept a decimal character if one is already present, by default`, async () => {
        const input = await $(selectors.issue559Default);
        await input.click();
        await browser.keys([Key.Control, 'a', Key.Control, Key.Backspace]);
        await browser.keys(['-12345.67']); // Starting in Webdriverio v8, you cannot use the modifiers keys and the strings in the same call
        expect(await input.getValue()).toEqual('-12,345.67');
        await browser.keys([Key.Home, Key.ArrowRight, Key.ArrowRight, '.']);
        expect(await input.getValue()).toEqual('-12,345.67');
    });

    it(`should accept a decimal character everywhere, when the \`alwaysAllowDecimalCharacter\` option is set to \`true\``, async () => {
        const input = await $(selectors.issue559);
        await input.click();
        await browser.keys([Key.Home, Key.ArrowRight, Key.ArrowRight, Key.ArrowRight, '.']);
        expect(await input.getValue()).toEqual('123.45');
        await browser.keys([Key.End, Key.ArrowLeft, '.']);
        expect(await input.getValue()).toEqual('1,234.5');
        await browser.keys([Key.Home, '.']);
        expect(await input.getValue()).toEqual('0.12');

        // And with a negative number
        await browser.keys([Key.Escape, Key.Backspace, '-12345']);
        await browser.keys([Key.Home, '.']);
        expect(await input.getValue()).toEqual('-0.12');

        await browser.keys([Key.Control, 'a', Key.Control, Key.Backspace]);
        await browser.keys(['-12345']); // Starting in Webdriverio v8, you cannot use the modifiers keys and the strings in the same call
        await browser.keys([Key.Home, Key.ArrowRight, '.']);
        expect(await input.getValue()).toEqual('-0.12');

        // Test that entering a decimal character on another decimal character works (and moves the caret to the right)
        await browser.keys([Key.Control, 'a', Key.Control, Key.Backspace]);
        await browser.keys(['-12345']); // Starting in Webdriverio v8, you cannot use the modifiers keys and the strings in the same call
        await browser.keys([Key.Home, Key.ArrowRight, Key.ArrowRight, '.']);
        expect(await input.getValue()).toEqual('-1.23');
        await browser.keys([Key.ArrowLeft, '.']);
        expect(await input.getValue()).toEqual('-1.23');
        await browser.keys(['6']);
        expect(await input.getValue()).toEqual('-1.62');
    });
});

describe('Issue #593', () => {
    it('should test for default values, and focus on it', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue593).getValue()).toEqual('-1,00 €');
        expect(await $(selectors.issue593Paste).getValue()).toEqual('-1234');
    });

    it(`should correctly paste a negative value on a negative value using the French predefined option`, async () => {
        // Copy the text to paste
        const inputPaste = await $(selectors.issue593Paste);
        await inputPaste.click();
        await browser.keys([Key.Control, 'a', 'c', Key.Control]);

        // Paste into the AutoNumeric element with the default `onInvalidPaste` option
        await browser.keys([Key.Shift, Key.Tab, Key.Shift]); // Go to the other input
        await browser.keys([Key.Control, 'v', Key.Control]);
        expect(await $(selectors.issue593).getValue()).toEqual('-1.234,00 €');
        // Also test the caret position after the paste
        let inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue593);
        expect(inputCaretPosition.start).toEqual(6);

        // Paste into the other AutoNumeric element with the `truncate` `onInvalidPaste` option
        await browser.keys([Key.Shift, Key.Tab, Key.Shift]); // Go to the other input
        await browser.keys([Key.Control, 'v', Key.Control]);
        expect(await $(selectors.issue593Truncate).getValue()).toEqual('-1.234,00 €');
        // Also test the caret position after the paste
        inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue593Truncate);
        expect(inputCaretPosition.start).toEqual(6);
    });

    it(`should correctly paste a negative value on a positive value using the French predefined option`, async () => {
        // Copy the text to paste
        const inputPaste = await $(selectors.issue593Paste);
        await inputPaste.click();
        await browser.keys([Key.Control, 'a', 'c', Key.Control]);

        // Paste into the AutoNumeric element with the default `onInvalidPaste` option
        await browser.keys([Key.Shift, Key.Tab, Key.Shift]); // Go to the other input
        await browser.keys([Key.Home, '-']); // Switch to a positive number
        await browser.keys([Key.Control, 'a', 'v', Key.Control]);
        expect(await $(selectors.issue593).getValue()).toEqual('-1.234,00 €');
        // Also test the caret position after the paste
        /*
        let inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue593);
        expect(inputCaretPosition.start).toEqual(6);
        */ //FIXME Manually this returns the correct caret position, with selenium it fails

        // Paste into the other AutoNumeric element with the `truncate` `onInvalidPaste` option
        await browser.keys([Key.Shift, Key.Tab, Key.Shift]); // Go to the other input
        await browser.keys([Key.Home, '-']); // Switch to a positive number
        await browser.keys([Key.Control, 'a', 'v', Key.Control]);
        expect(await $(selectors.issue593Truncate).getValue()).toEqual('-1.234,00 €');
        // Also test the caret position after the paste
        /*
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue593Truncate);
        expect(inputCaretPosition.start).toEqual(6);
        */ //FIXME Manually this returns the correct caret position, with selenium it fails
    });
});

describe('Issue #594', () => {
    it('should test for default values', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue594Left).getValue()).toEqual('');
        expect(await $(selectors.issue594Right).getValue()).toEqual('');
    });

    it(`should display the negative sign on the left side of the currency symbol when the element is empty`, async () => {
        const input = await $(selectors.issue594Left);
        await input.click();
        expect(await input.getValue()).toEqual(' €');
        await browser.keys(['-']);
        expect(await input.getValue()).toEqual('- €');

        // Check the caret position
        const inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue594Left);
        expect(inputCaretPosition.start).toEqual(1);
    });

    it(`should display the negative sign on the right side of the currency symbol when the element is empty`, async () => {
        const input = await $(selectors.issue594Right);
        await input.click();
        expect(await input.getValue()).toEqual(' €');
        await browser.keys(['-']);
        expect(await input.getValue()).toEqual(' €-');

        // Check the caret position
        const inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue594Right);
        expect(inputCaretPosition.start).toEqual(0);
    });
});

xdescribe('Issue #542', () => {
    it('should test for default values', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue542On).getValue()).toEqual('1,234,567.89');
        expect(await $(selectors.issue542Off).getValue()).toEqual('1,234,567.89');
    });

    it(`should not allow formula mode on default AutoNumeric elements`, async () => {
        const input = await $(selectors.issue542Off);
        await input.click();
        await browser.keys([Key.Home, '=']);
        expect(await input.getValue()).toEqual('1,234,567.89');
    });

    it(`should allow formula mode on AutoNumeric elements with the \`formulaMode\` option set to \`true\``, async () => {
        const input = await $(selectors.issue542On);
        const issue542Off = await $(selectors.issue542Off);
        await input.click();


        await browser.keys([Key.Escape, '666777.88']);
        expect(await issue542Off.getValue()).toEqual('666,777.88'); //XXX Fails in Chrome, not in Firefox
        await browser.keys([Key.Escape]);
        expect(await issue542Off.getValue()).toEqual('1,234,567.89');
        await browser.keys([Key.Escape, '666777.88', Key.Enter]); // Save the rawValue
        expect(await issue542Off.getValue()).toEqual('666,777.88');
        await browser.keys([Key.Escape]);
        expect(await issue542Off.getValue()).toEqual('666,777.88');
        // Start editing the value as usual
        await browser.keys(['12345']);
        expect(await issue542Off.getValue()).toEqual('12,345');

        // Then enter formula mode
        await browser.keys(['=']);
        expect(await input.getValue()).toEqual('=');
        await browser.keys(['12+ 24.11']); //XXX The chromedriver bugs and does not accepts the '+' character
        expect(await input.getValue()).toEqual('=12+ 24.11');
        await browser.keys(['foobar']);
        expect(await input.getValue()).toEqual('=12+ 24.11');
        await browser.keys(['-( 2/ (12+5))']); //XXX The geckodriver bugs and does not accepts the '(' and ')' characters
        expect(await input.getValue()).toEqual('=12+ 24.11-( 2/ (12+5))');

        // Cancel the formula
        await browser.keys([Key.Escape]);
        expect(await input.getValue()).toEqual('12,345.00');
        // Check that hitting `esc` a second time changes the value to the last saved one, not the one before entering the formula mode
        await browser.keys([Key.Escape]);
        expect(await input.getValue()).toEqual('666,777.88');

        // Validate the formula with Enter
        await browser.keys(['=']);
        expect(await input.getValue()).toEqual('=');
        await browser.keys(['-10000 + 12+ 24.16-( 1044/ (12))', Key.Enter]);
        expect(await input.getValue()).toEqual('-10,050.84');

        // Validate the formula with Blur
        await browser.keys(['=']);
        expect(await input.getValue()).toEqual('=');
        await browser.keys(['-60000 + 12+ 24.16-( 1044/ (12))']);
        expect(await input.getValue()).toEqual('=-60000 + 12+ 24.16-( 1044/ (12))');
        await issue542Off.click(); // Blur
        expect(await input.getValue()).toEqual('-60,050.84');
    });

    //TODO Add the tests when using a custom `decimalCharacter`
});

describe('Issue #611', () => {
    it('should test for default values', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue611HtmlReadOnly).getValue()).toEqual('224,466.88');
        expect(await $(selectors.issue611OptionReadOnly).getValue()).toEqual('11,224,466.88');
        expect(await $(selectors.issue611HtmlAndOptionReadOnly).getValue()).toEqual('4,466.88');
    });

    it(`should not allow entering anything in an element set read-only via its html attribute`, async () => {
        const input = await $(selectors.issue611HtmlReadOnly);
        await input.click();
        await browser.keys([Key.Home, '1']);
        expect(await input.getValue()).toEqual('224,466.88');
    });

    xit(`should allow modifying the element value if the html read-only attribute is removed dynamically`, async () => {
        const input = await $(selectors.issue611HtmlReadOnly);
        await input.click();
        await browser.keys([Key.Home, '1']);
        expect(await input.getValue()).toEqual('224,466.88');
        await browser.execute(domId => { document.querySelector(domId).readOnly = false; }, selectors.issue611HtmlReadOnly);
        await browser.keys([Key.Home, '1']);
        expect(await input.getValue()).toEqual('1,224,466.88'); //FIXME Fails on Chrome only; there is a bug in the selenium chromedriver
    });

    it(`should still not allow modifying the element value if the html read-only attribute is removed dynamically, but the \`readOnly\` option is set to \`true\``, async () => {
        const input = await $(selectors.issue611HtmlAndOptionReadOnly);
        await input.click();
        await browser.keys([Key.Home, '1']);
        expect(await input.getValue()).toEqual('4,466.88');
        await browser.execute(domId => { document.querySelector(domId).readOnly = false; }, selectors.issue611HtmlAndOptionReadOnly);
        await browser.keys([Key.Home, '1']);
        expect(await input.getValue()).toEqual('4,466.88');
    });

    it(`should not allow entering anything in an element set read-only via the AutoNumeric \`readOnly\` option`, async () => {
        const input = await $(selectors.issue611OptionReadOnly);
        await input.click();
        await browser.keys([Key.Home, '1']);
        expect(await input.getValue()).toEqual('11,224,466.88');
    });
});

describe('Issue #652', () => {
    it('should test for default values, and respect the `allowDecimalPadding` option set as \'floats\' on load', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue652a).getValue()).toEqual('150');
        expect(await $(selectors.issue652b).getValue()).toEqual('1,234');
        expect(await $(selectors.issue652c).getValue()).toEqual('150');
        expect(await $(selectors.issue652d).getValue()).toEqual('150');
    });
});

describe('Issue #647', () => {
    it('should test for default values', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue647a).getValue()).toEqual('a1 121.00');
        expect(await $(selectors.issue647b).getValue()).toEqual('121.00 a1');
    });

    it(`should enter the number at the correct caret, even when the currency in prefix position contains numbers that are entered by the user`, async () => {
        const input = await $(selectors.issue647a);
        await input.click();
        await browser.keys(['1']);
        expect(await input.getValue()).toEqual('a1 1');
        await browser.keys(['2']);
        expect(await input.getValue()).toEqual('a1 12');
        await browser.keys(['3']);
        expect(await input.getValue()).toEqual('a1 123');
        await browser.keys(['4']);
        expect(await input.getValue()).toEqual('a1 1,234');
    });

    it(`should enter the number at the correct caret, even when the currency in suffix position contains numbers that are entered by the user`, async () => {
        const input = await $(selectors.issue647b);
        await input.click();
        await browser.keys(['1']);
        expect(await input.getValue()).toEqual('1 a1');
        await browser.keys(['2']);
        expect(await input.getValue()).toEqual('12 a1');
        await browser.keys(['3']);
        expect(await input.getValue()).toEqual('123 a1');
        await browser.keys(['4']);
        expect(await input.getValue()).toEqual('1,234 a1');
    });
});

xdescribe('Issue #656', () => { //FIXME With Firefox and Chromium, the control key is used correctly, while with Selenium the Key.Control key is not activated correctly when used in combination with Backspace nor Delete
    it('should test for default values', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue656a).getValue()).toEqual('12,344,321.67');
        expect(await $(selectors.issue656b).getValue()).toEqual('1,234,567,890.01');
    });

    it(`should delete batch of numbers using ctrl+backspace, then retain the resulting value on focusout`, async () => {
        const input = await $(selectors.issue656a);
        await input.click();
        await browser.keys([Key.End, Key.Control, Key.Backspace, Key.Backspace, Key.Control]);
        expect(await input.getValue()).toEqual('12,344,');
        const inputB = await $(selectors.issue656b);
        await inputB.click();
        expect(await input.getValue()).toEqual('12,344.00');
    });

    it(`should delete batch of numbers using ctrl+delete, then retain the resulting value on focusout`, async () => {
        const input = await $(selectors.issue656b);
        await input.click();
        await browser.keys([Key.End, Key.Backspace, Key.Backspace]);
        expect(await input.getValue()).toEqual('1,234,567,890.');
        await browser.keys([Key.Home, Key.Control, Key.Delete, Key.Delete, Key.Control]);
        expect(await input.getValue()).toEqual('567,890.');
        const inputA = await $(selectors.issue656a);
        await inputA.click();
        expect(await input.getValue()).toEqual('567,890.00');
    });
});

describe('Issue #675', () => {
    it('should test for default values', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue675a).getValue()).toEqual('80,000.00');
        expect(await $(selectors.issue675b).getValue()).toEqual('€90,000.00');
        expect(await $(selectors.issue675c).getValue()).toEqual('70,000.00€');
    });

    it(`should correctly place the caret when deleting a number leads to a rawValue of zero, while the currency symbol isn't displayed`, async () => {
        const input = await $(selectors.issue675a);
        await input.click();
        await browser.keys([Key.Home, Key.Delete]);
        expect(await input.getValue()).toEqual('0,000.00');

        // Check the caret position
        const inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue675a);
        expect(inputCaretPosition).toEqual(0);
    });

    it(`should correctly place the caret when deleting a number leads to a rawValue of zero, while the currency symbol is in suffix position`, async () => {
        const input = await $(selectors.issue675b);
        await input.click();
        await browser.keys([Key.Home, Key.Delete]);
        expect(await input.getValue()).toEqual('€0,000.00');

        // Check the caret position
        const inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue675b);
        expect(inputCaretPosition).toEqual(1);
    });

    it(`should correctly place the caret when deleting a number leads to a rawValue of zero, while the currency symbol is in prefix position`, async () => {
        const input = await $(selectors.issue675c);
        await input.click();
        await browser.keys([Key.Home, Key.Delete]);
        expect(await input.getValue()).toEqual('0,000.00€');

        // Check the caret position
        const inputCaretPosition = await browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue675c);
        expect(inputCaretPosition).toEqual(0);
    });
});


//TODO Add some tests to make sure the correct number of `AutoNumeric.events.formatted` is sent during each keypress

describe('Issue #543', () => {
    //TODO check the events sent when typing invalid numbers (#543)
    it('should test for default values', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue543Default).getValue()).toEqual('12.00');
        expect(await $(selectors.issue543Invalid).getValue()).toEqual('24.00');
        expect(await $(selectors.issue543Ignore).getValue()).toEqual('42.00');
        expect(await $(selectors.issue543InvalidCE).getText()).toEqual('24.00');
    });

    it(`should disallows entering numbers out-of-bounds when using the default \`overrideMinMaxLimits\` option`, async () => {
        const input = await $(selectors.issue543Default);
        await input.click();
        await browser.keys([Key.Home, Key.Delete]);
        expect(await input.getValue()).toEqual('12.00');
        await browser.keys([Key.End, Key.Backspace, Key.Backspace, Key.Backspace, Key.Backspace]);
        expect(await input.getValue()).toEqual('12');
        await browser.keys([Key.Home, Key.ArrowRight, '5']);
        expect(await input.getValue()).toEqual('152');
        await browser.keys([Key.Delete, Key.Home, Key.Delete]);
        expect(await input.getValue()).toEqual('5');
        await browser.keys([Key.Delete]);
        expect(await input.getValue()).toEqual('5');
    });

    xit(`should allows entering numbers out-of-bounds when using the \`overrideMinMaxLimits\` option \`invalid\`, while setting the invalid state`, async () => { //FIXME Those tests are correct and work as expected under Chromium. They fail under Firefox ESR 68.7 when trying to access the validity property (see the upstream bug declared on https://github.com/mozilla/geckodriver/issues/938#issuecomment-616006856)
        //TODO Check that the invalid event is sent
        const input = await $(selectors.issue543Invalid);
        await input.click();
        expect((await input.getProperty('validity')).valid).toEqual(true);
        await browser.keys([Key.Home, Key.Delete]);
        expect(await input.getValue()).toEqual('4.00');
        expect((await input.getProperty('validity')).valid).toEqual(false);
        await browser.keys([Key.Delete]);
        expect(await input.getValue()).toEqual('0.00');
        expect((await input.getProperty('validity')).valid).toEqual(false);
        await browser.keys(['5']);
        expect((await input.getProperty('validity')).valid).toEqual(true);
        await browser.keys(['000']); // 5000
        expect((await input.getProperty('validity')).valid).toEqual(true);
        await browser.keys([Key.Home, Key.Delete, '10']); // 10000
        expect((await input.getProperty('validity')).valid).toEqual(true);
        await browser.keys([Key.End, Key.ArrowLeft, '1']); // 10000.01
        expect((await input.getProperty('validity')).valid).toEqual(false);
    });

    xit(`should allows entering numbers out-of-bounds when using the \`overrideMinMaxLimits\` option \`invalid\` on a contenteditable-enabled element, while setting the invalid CSS class`, async () => { //FIXME Those tests are correct and work as expected under Chromium. They fail under Firefox ESR 68.7 when trying to send the Home key (perhaps related to the upstream bug https://github.com/mozilla/geckodriver/issues/1508 ?)
        //TODO Check that the invalid event is sent
        const input = await $(selectors.issue543InvalidCE);
        await input.click();
        expect(await input.getAttribute('class')).toEqual(''); //FIXME Chrome expects '', while Firefox expect 'null'...
        await browser.keys([Key.Home, Key.Delete]);
        expect(await input.getText()).toEqual('4.00');
        expect(await input.getAttribute('class')).toEqual('an-invalid');
        await browser.keys([Key.Delete]);
        expect(await input.getText()).toEqual('0.00');
        expect(await input.getAttribute('class')).toEqual('an-invalid');
        await browser.keys(['5']);
        expect(await input.getAttribute('class')).toEqual('');
        await browser.keys(['000']); // 5000
        expect(await input.getAttribute('class')).toEqual('');
        await browser.keys([Key.Home, Key.Delete, '10']); // 10000 //FIXME Under Firefox ESR, Key.Home does not work //TODO Change it back when the bug is fixed upstream
        expect(await input.getAttribute('class')).toEqual('');
        await browser.keys([Key.End, Key.ArrowLeft, '1']); // 10000.01
        expect(await input.getAttribute('class')).toEqual('an-invalid');
    });

    it(`should allows entering numbers out-of-bounds when using the \`overrideMinMaxLimits\` option \`ignore\``, async () => {
        //TODO Check that no events are sent
        const input = await $(selectors.issue543Ignore);
        await input.click();
        await browser.keys([Key.Home, Key.Delete]);
        expect(await input.getValue()).toEqual('2.00');
        await browser.keys([Key.Delete]);
        expect(await input.getValue()).toEqual('0.00');
        await browser.keys(['10000']);
        expect(await input.getValue()).toEqual('10,000.00');
        await browser.keys([Key.End, Key.ArrowLeft, '1']); // 10000.01
        expect(await input.getValue()).toEqual('10,000.01');
    });
});

describe('Issue #757', () => {
    it('should test for default values', async () => {
        await browser.url(testUrl);

        expect(await $(selectors.issue757input0).getValue()).toEqual('$0.00000002');
        expect(await $(selectors.issue757input1).getValue()).toEqual('$0.00000012');
        expect(await $(selectors.issue757input2).getValue()).toEqual('$0.00000112');
        expect(await $(selectors.issue757input3).getValue()).toEqual('$0.00001112');
        expect(await $(selectors.issue757input4).getValue()).toEqual('$0.00011112');
    });

    it(`should display the unformatted values after submitting the form data`, async () => {
        const input = await $(selectors.issue757Submit);
        await input.click();

        expect(await $(selectors.issue757input0).getValue()).toEqual('0.00000002');
        expect(await $(selectors.issue757input1).getValue()).toEqual('0.00000012');
        expect(await $(selectors.issue757input2).getValue()).toEqual('0.00000112');
        expect(await $(selectors.issue757input3).getValue()).toEqual('0.00001112');
        expect(await $(selectors.issue757input4).getValue()).toEqual('0.00011112');
    });
});
