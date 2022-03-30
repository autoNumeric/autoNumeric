/**
 * End-to-end tests for autoNumeric.js
 * @author Alexandre Bonneau <alexandre.bonneau@linuxfr.eu>
 * @copyright © 2020 Alexandre Bonneau
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

// High default timeout need when debugging the tests
/* eslint no-undef: 0 */
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
// jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999999; // Useful when using `./node_modules/.bin/wdio repl firefox` to test the Webdriver.io commands (in combination with `browser.debug()`)

//-----------------------------------------------------------------------------
// ---- Configuration

// Url to the end-to-end test page
const testUrl = '/e2e';

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
    it(`should be able to send basic keys to basic inputs (which we'll use later for copy-pasting text strings)`, () => {
        browser.url(testUrl);
        const inputClassic = $(selectors.inputClassic);

        // Test the initial values
        const title = browser.getTitle();
        expect(title).toEqual('End-to-end testing for autoNumeric');
        expect(inputClassic.getValue()).toEqual('987654321');

        // Focus in that input
        inputClassic.click();

        // Enter some keys
        browser.keys('End'); // 'chromedriver' does not automatically modify the caret position, so we need to set it up ourselves
        browser.keys('teststring');
        expect(inputClassic.getValue()).toEqual('987654321teststring');
        // browser.keys('Home'); // This works!
        browser.keys(['ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft']);
        browser.keys('YES!');
        expect(inputClassic.getValue()).toEqual('987654321teststYES!ring');
        browser.keys(['ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft']);
        browser.keys('0');
        browser.keys('1');
        expect(inputClassic.getValue()).toEqual('987654321te01ststYES!ring');

        /*
        expect(helperGetCaretPosition(inputClassic)).toEqual(42); //FIXME This cannot be called correctly
        const result = browser.getCaretPosition(inputClassic); //FIXME This cannot be called correctly
        expect(result).toEqual(19);
        */

        // Hold some modifier keys
        browser.keys('End');
        browser.keys(['ArrowLeft']);
        browser.keys([
            'Shift', // This activates the shift key from now on (do note that with the latest firefox webdriver, the 'Shift' key needs to be included in the array)
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
        expect(inputClassic.getValue()).toEqual('987654foobarg');
    });
});

describe('Initialized non-input elements', () => {
    it('should show the same formatting as their <input> counterparts', () => {
        browser.url(testUrl);

        /* eslint space-in-parens: 0 */
        expect($(selectors.elementP1).getText()   ).toEqual('2.140%');
        expect($(selectors.elementP2).getText()   ).toEqual('666,42 €');
        expect($(selectors.elementCode).getText() ).toEqual('¥12,345.67');
        expect($(selectors.elementDiv).getText()  ).toEqual('$12,345.67');
        expect($(selectors.elementH5).getText()   ).toEqual('666.42 CHF');
        expect($(selectors.elementLabel).getText()).toEqual('12,345.67');
        expect($(selectors.elementSpan).getText() ).toEqual('');
    });
});

describe('Initialized elements with the noEventListeners option', () => {
    it('should not be react with the autoNumeric listeners', () => {
        browser.url(testUrl);

        // Focus in that input
        const input = $(selectors.noEventListenersElement);
        input.click();

        expect(input.getValue()).toEqual('69,67 €');
        browser.keys(['End', '123', 'Home', '789']);
        expect(input.getValue()).toEqual('78969,67 €123');
    });
});

describe('Initialized elements with the readOnly option', () => {
    it('should not be modifiable', () => {
        browser.url(testUrl);

        const input = $(selectors.readOnlyElement);
        expect(input.getValue()).toEqual('42.42');
        browser.keys(['Home', '12345']);
        expect(input.getValue()).toEqual('42.42');
    });
});

describe('Issue #327 (using inputs from issue #183)', () => {
    it('should test for default values', () => {
        browser.url(testUrl);

        /* eslint space-in-parens: 0 */
        expect($(selectors.issue183error   ).getValue()).toEqual('12.345.678,00 €');
        expect($(selectors.issue183ignore  ).getValue()).toEqual('12.345.678,00 €');
        expect($(selectors.issue183clamp   ).getValue()).toEqual('$ 12.345.678,00');
        expect($(selectors.issue183truncate).getValue()).toEqual('12.345.678,00 €');
        expect($(selectors.issue183replace ).getValue()).toEqual('12.345.678,00 €');
    });

    it(`should show the correct number of decimal places on focus, with 'decimalPlacesShownOnFocus' set to a specific value`, () => {
        browser.url(testUrl);

        // Focus in that input
        const input = $(selectors.issue183error);
        input.click();
        expect(input.getValue()).toEqual('12.345.678,00000 €');
    });

    it(`should get the entire input selected when using the 'tab' key`, () => {
        browser.url(testUrl);

        // Focus in that first input
        const input = $(selectors.issue183error);
        input.click();

        // Then 'tab' on each other inputs
        browser.keys('Tab');
        // Check the text selection
        let inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue183ignore);
        expect(inputCaretPosition.start).toEqual(0);
        expect(inputCaretPosition.end).toEqual(13); //XXX This does not work under Firefox 45.7, but does under firefox 56. Since we only support the browsers last version - 2, let's ignore it.

        browser.keys('Tab');
        // Check the text selection
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue183clamp);
        expect(inputCaretPosition.start).toEqual(2);
        expect(inputCaretPosition.end).toEqual(15);

        browser.keys('Tab');
        // Check the text selection
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue183truncate);
        expect(inputCaretPosition.start).toEqual(0);
        expect(inputCaretPosition.end).toEqual(13);

        browser.keys('Tab');
        // Check the text selection
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue183replace);
        expect(inputCaretPosition.start).toEqual(0);
        expect(inputCaretPosition.end).toEqual(13);
    });
});

describe('Issue #306', () => {
    it('should test for default values', () => {
        browser.url(testUrl);

        expect($(selectors.issue306input).getValue()).toEqual('');

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

    it(`should allow entering '0.0'`, () => {
        // Focus in that input
        const input = $(selectors.issue306input);
        input.click();

        // Modify the input value
        browser.keys('0');
        expect(input.getValue()).toEqual('0');

        // Check the caret position
        let inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue306input);
        expect(inputCaretPosition).toEqual(1);


        // Modify the input value
        browser.keys('Backspace');
        expect(input.getValue()).toEqual('');
        browser.keys('.');
        expect(input.getValue()).toEqual('0.');

        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue306input);
        expect(inputCaretPosition).toEqual(2);


        browser.keys('0');
        expect(input.getValue()).toEqual('0.0');

        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue306input);
        expect(inputCaretPosition).toEqual(3);
    });

    it(`should move the caret correctly while in the decimal places`, () => {
        // Manage the second case
        // Focus in that input
        const input = $(selectors.issue306inputDecimals);
        input.click();

        // Modify the input value
        expect(input.getValue()).toEqual('');
        browser.keys('0,00000');
        expect(input.getValue()).toEqual('0,00000');
        browser.keys(['Home', 'ArrowRight', '12345']);
        expect(input.getValue()).toEqual('0,12345');
        browser.keys(['Home', 'ArrowRight', '00000']);
        expect(input.getValue()).toEqual('0,00000');
        let inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue306inputDecimals);
        expect(inputCaretPosition).toEqual(7);

        // Tests that it does not allow adding a leading 0
        browser.keys(['Home', '0']);
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue306inputDecimals);
        expect(inputCaretPosition).toEqual(0);

        // Tests that entering a 0 while in the decimal places moves the caret to the right
        browser.keys(['ArrowRight', '0']);
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue306inputDecimals);
        expect(inputCaretPosition).toEqual(3);
        // ...and another
        browser.keys('0');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue306inputDecimals);
        expect(inputCaretPosition).toEqual(4);
        // ...and another
        browser.keys('0');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue306inputDecimals);
        expect(inputCaretPosition).toEqual(5);
        // ...and another
        browser.keys('0');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue306inputDecimals);
        expect(inputCaretPosition).toEqual(6);
        // ...and another
        browser.keys('0');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue306inputDecimals);
        expect(inputCaretPosition).toEqual(7);
        // ...and another that should be dropped
        browser.keys('0');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue306inputDecimals);
        expect(inputCaretPosition).toEqual(7);
    });

    it(`should move the caret correctly while in the decimal places, without having to setup any sequence of inputs`, () => {
        // Manage the last case
        // Focus in that input
        const input = $(selectors.issue306inputDecimals2);
        input.click();

        // Modify the input value
        input.setValue('50000,00');
        expect(input.getValue()).toEqual('50.000,00');
        browser.keys(['End', 'ArrowLeft', 'ArrowLeft', 'ArrowRight']);
        let inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue306inputDecimals2);
        expect(inputCaretPosition).toEqual(7);

        browser.keys('0');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue306inputDecimals2);
        expect(inputCaretPosition).toEqual(8);

        browser.keys('0');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue306inputDecimals2);
        expect(inputCaretPosition).toEqual(9);

        browser.keys('0');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue306inputDecimals2);
        expect(inputCaretPosition).toEqual(9);
    });
});

describe('Issue #283', () => {
    it('should test for default values', () => {
        browser.url(testUrl);

        expect($(selectors.issue283Input0).getValue()).toEqual('1.12');
        expect($(selectors.issue283Input1).getValue()).toEqual('1.1235');
        expect($(selectors.issue283Input2).getValue()).toEqual('1,124%');
        expect($(selectors.issue283Input3).getValue()).toEqual('8.000,00\u00a0€');
        expect($(selectors.issue283Input4).getValue()).toEqual('8.000,00\u00a0€');
    });

    it(`should keep the caret position when trying to input a '0' that gets rejected`, () => {
        browser.url(testUrl);

        // Test the initial value
        const input = $(selectors.issue283Input1);
        expect(input.getValue()).toEqual('1.1235');

        // Focus in that input
        input.click();

        // Change the caret position and modify its value
        browser.keys(['Home']);
        browser.keys('0');
        expect(input.getValue()).toEqual('1.1235');

        // Check the final caret position
        const inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue283Input1);
        expect(inputCaretPosition).toEqual(0);
    });

    it(`should keep the caret position when trying to input a '0' that gets rejected on a euro number`, () => {
        browser.url(testUrl);

        // Test the initial value
        const input = $(selectors.issue283Input4);
        expect(input.getValue()).toEqual('8.000,00\u00a0€');

        // Focus in that input
        input.click();

        // Change the caret position and modify its value
        browser.keys(['Home']);
        browser.keys('0');
        expect(input.getValue()).toEqual('8.000,00\u00a0€');

        // Check the final caret position
        const inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue283Input4);
        expect(inputCaretPosition).toEqual(0);
    });

    it(`should insert a '0' and move the caret position when leadingZero is 'allow'`, () => {
        browser.url(testUrl);

        // Test the initial value
        const input = $(selectors.issue283Input3);
        expect(input.getValue()).toEqual('8.000,00\u00a0€');

        // Focus in that input
        input.click();

        // Change the caret position and modify its value
        browser.keys(['Home']);
        browser.keys('0');
        expect(input.getValue()).toEqual('08.000,00\u00a0€');

        // Check the final caret position
        const inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue283Input3);
        expect(inputCaretPosition).toEqual(1);
    });

    it(`should insert a '0' when in the middle of other zeros, and move the caret position`, () => {
        browser.url(testUrl);

        // Test the initial value
        const input = $(selectors.issue283Input4);
        expect(input.getValue()).toEqual('8.000,00\u00a0€');

        // Focus in that input
        input.click();

        // Change the caret position and modify its value
        browser.keys(['End', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft']); // 6 left
        browser.keys('0');
        expect(input.getValue()).toEqual('80.000,00\u00a0€');

        // Check the final caret position
        const inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue283Input4);
        expect(inputCaretPosition).toEqual(4);
    });
});

describe('Issue #326', () => {
    it('should test for default values, and focus on it', () => {
        browser.url(testUrl);

        expect($(selectors.issue326input).getValue()).toEqual('12.345.678,00 €');
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
        expect(input.getValue()).toEqual('1.234,57 €');
    });
});

describe('Issue #322', () => {
    it('should test for default values, and focus on it', () => {
        browser.url(testUrl);

        expect($(selectors.issue322input).getValue()).toEqual('12,345,678.00');
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
        expect(input.getValue()).toEqual('12,345,111,678.00');

        // Check the caret position
        const inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue322input);
        expect(inputCaretPosition).toEqual(10);
    });

    it('should paste correctly a string that contains grouping separators when pasting on a selection', () => {
        // Pre-requisite : '11,1' is still in the clipboard

        // Focus in the issue input
        const input = $(selectors.issue322input);
        input.click();

        // Re-initialize its value
        input.setValue('12345678');
        expect(input.getValue()).toEqual('12,345,678');

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
        expect(input.getValue()).toEqual('12,111,678.00');

        // Check the caret position
        const inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue322input);
        expect(inputCaretPosition).toEqual(6);
    });
});

xdescribe('Issue #527', () => { //FIXME Uncomment that test when PhantomJS will correctly run it
    it('should test for default values, and focus on it', () => {
        browser.url(testUrl);

        expect($(selectors.issue527input).getValue()).toEqual('1,357,246.81');
    });

    it('should correctly cut the number when using ctrl+x, format the result and set the caret position', () => {
        const input = $(selectors.issue527input);
        const inputForBlur = $(selectors.issue527Blur);

        input.click();
        browser.keys('Home');
        browser.keys(['ArrowRight', 'ArrowRight', 'ArrowRight']);

        // Cut
        browser.keys('Shift');
        browser.keys(['ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowRight']);
        browser.keys('Shift');
        browser.keys('Control');
        browser.keys('x');
        browser.keys('Control');
        expect(input.getValue()).toEqual('1,356.81');

        // Blur that input
        inputForBlur.click();

        // Then check that the input value is still the same
        expect(input.getValue()).toEqual('1,356.81');
    });
});

describe('Issue #317', () => {
    it('should test for default values, and focus on it', () => {
        browser.url(testUrl);

        expect($(selectors.issue317input).getValue).toEqual('0.00');
    });

    it('should move the caret correctly when the value is zero', () => {
        // Focus in the issue input
        const input = $(selectors.issue317input);
        input.click();

        // Set the caret position to  // 0|.00
        browser.keys(['Home', 'ArrowRight', 'ArrowLeft']);

        // Try to enter a '0' that will be dropped
        browser.keys('0');

        // Check that the value did not change, and that the caret is correctly positioned
        expect(input.getValue()).toEqual('0.00');
        const inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue317input);
        expect(inputCaretPosition).toEqual(1);
    });

    it('should move the caret correctly when the value is zero', () => {
        const input = $(selectors.issue317input);
        // Set the value to 2.342.423.423.423
        input.setValue(2342423423423);
        browser.keys('.00'); // This is used to force autoNumeric to reformat the value, while adding the 'empty' decimal places

        // Set the caret position to  // 0|.00
        browser.keys(['End', 'ArrowLeft', 'ArrowLeft']);

        // Try to enter a '9' that will be dropped
        browser.keys('9');

        // Check that the value did not change, and that the caret is correctly positioned
        expect(input.getValue()).toEqual('2,342,423,423,423.00');
        let inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue317input);
        expect(inputCaretPosition).toEqual(17);

        // Enter a decimal character that will make the caret move into the decimal place part
        // ...with the alternate decimal character
        browser.keys(',');
        expect(input.getValue()).toEqual('2,342,423,423,423.00');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue317input);
        expect(inputCaretPosition).toEqual(18);

        // ...with the period '.'
        browser.keys('ArrowLeft');
        browser.keys('.');
        expect(input.getValue()).toEqual('2,342,423,423,423.00');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue317input);
        expect(inputCaretPosition).toEqual(18);

        // ...with the numpad dot
        browser.keys('ArrowLeft');
        browser.keys('Decimal');
        expect(input.getValue()).toEqual('2,342,423,423,423.00');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue317input);
        expect(inputCaretPosition).toEqual(18);
    });
});

describe('Issue #303', () => {
    it('should test for default values', () => {
        browser.url(testUrl);

        expect($(selectors.issue303inputP).getValue()).toEqual('');
        expect($(selectors.issue303inputS).getValue()).toEqual('');
    });


    it('should position the caret at the right position, depending on the currencySymbolPlacement', () => {
        // Focus in the non-an input
        const input = $(selectors.issue303inputNonAn);
        input.click();

        // Then 'tab' to the next one
        browser.keys('Tab');
        expect($(selectors.issue303inputP).getValue()).toEqual('$');
        let inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue303inputP);
        expect(inputCaretPosition).toEqual(1);


        // Then 'tab' to the next one
        browser.keys('Tab');
        expect($(selectors.issue303inputS).getValue()).toEqual('\u00a0€');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue303inputP);
        expect(inputCaretPosition).toEqual(0);
    });
});

describe('Issue #387', () => {
    it('should test for default values', () => {
        browser.url(testUrl);

        expect($(selectors.issue387inputCancellable).getValue()).toEqual('$220,242.76');
        expect($(selectors.issue387inputNotCancellable).getValue()).toEqual('$220,242.76');
    });

    it('should cancel the last modifications', () => {
        // Focus in the input
        const input = $(selectors.issue387inputCancellable);
        input.click();
        // Test the initial value
        expect(input.getValue()).toEqual('$220,242.76');

        // Test that after deleting characters, we get back the original value
        browser.keys(['End', 'ArrowLeft', 'ArrowLeft', 'Backspace', 'Backspace']);
        expect(input.getValue()).toEqual('$2,202.76');
        browser.keys(['Escape']);
        expect(input.getValue()).toEqual('$220,242.76');
        // Check the text selection
        const inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue387inputCancellable);
        expect(inputCaretPosition.start).toEqual(0);
        expect(inputCaretPosition.end).toEqual('$220,242.76'.length);

        // Test that after adding characters, we get back the original value
        browser.keys(['Home', 'ArrowRight', 'ArrowRight', 'ArrowRight', '583']);
        expect(input.getValue()).toEqual('$225,830,242.76');
        browser.keys(['Escape']);
        expect(input.getValue()).toEqual('$220,242.76');

        // Test that after adding and deleting characters, we get back the original value
        browser.keys(['Home', 'ArrowRight', 'ArrowRight', 'ArrowRight', 'Delete', '583', 'Delete', 'Backspace']);
        expect(input.getValue()).toEqual('$225,842.76');
        browser.keys(['Escape']);
        expect(input.getValue()).toEqual('$220,242.76');

        // Test that after not modifying the value, we get the same value
        // Focus in the next input
        browser.keys(['Tab']);
        // Test the initial value
        const inputCancellable = $(selectors.issue387inputCancellable);
        expect(inputCancellable.getValue()).toEqual('$220,242.76');
        browser.keys(['Home', 'ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowRight', '146']);
        expect(inputCancellable.getValue()).toEqual('$220,146,242.76');
        browser.keys(['Backspace', 'Backspace', 'Backspace']);
        expect(inputCancellable.getValue()).toEqual('$220,242.76');
        browser.keys(['Escape']);
        expect(inputCancellable.getValue()).toEqual('$220,242.76');
    });

    it('should select only the numbers on focus, without the currency symbol', () => {
        // Focus in the first input
        const input = $(selectors.issue387inputCancellable);
        input.click();

        // Then focus in the next input
        browser.keys(['Tab']);
        // Test the initial value
        expect($(selectors.issue387inputCancellableNumOnly).getValue()).toEqual('$220,242.76');
        // Check the text selection
        const inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue387inputCancellableNumOnly);
        // Since `selectNumberOnly` is set to `true`, the currency symbol is not selected by default
        expect(inputCaretPosition.start).toEqual(1); //XXX This does not work under Firefox 45.7, but does under firefox 53. Since we only support the browsers last version - 2, let's ignore it.
        expect(inputCaretPosition.end).toEqual('$220,242.76'.length);
    });

    it('should not cancel the last modifications, since `Enter` is used or the element is blurred', () => {
        // Focus in the input
        const input = $(selectors.issue387inputCancellable);
        input.click();
        // Test the initial value
        expect(input.getValue()).toEqual('$220,242.76');

        // Test that after hitting 'Enter' the saved cancellable value is updated
        browser.keys(['End', 'ArrowLeft', 'ArrowLeft', 'Backspace']);
        expect(input.getValue()).toEqual('$22,024.76');
        browser.keys(['Enter', 'Escape']);
        expect(input.getValue()).toEqual('$22,024.76');
        browser.keys(['End', 'ArrowLeft', 'ArrowLeft', '678']);
        expect(input.getValue()).toEqual('$22,024,678.76');
        browser.keys(['Escape']);
        expect(input.getValue()).toEqual('$22,024.76');
        // Check the text selection
        const inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue387inputCancellable);
        expect(inputCaretPosition.start).toEqual(0);
        expect(inputCaretPosition.end).toEqual('$22,024.76'.length);

        // Test that after blurring the input the saved cancellable value is updated
        browser.keys(['Home', 'ArrowRight', 'ArrowRight', '446']);
        expect(input.getValue()).toEqual('$24,462,024.76');
        browser.keys(['Tab', 'Shift', 'Tab', 'Shift']); // I focus on the next input, then come back to this one
        expect(input.getValue()).toEqual('$24,462,024.76');
        browser.keys(['Escape']);
        expect(input.getValue()).toEqual('$24,462,024.76');
    });

    it('should not cancel the last modifications, since `isCancellable` is set to false', () => {
        // Focus in the input
        const input = $(selectors.issue387inputNotCancellable);
        input.click();
        // Test the initial value
        expect(input.getValue()).toEqual('$220,242.76');

        // Test that after deleting characters, we get back the original value
        browser.keys(['End', 'ArrowLeft', 'ArrowLeft', 'Backspace', 'Backspace']);
        expect(input.getValue()).toEqual('$2,202.76');
        browser.keys(['Escape']);
        expect(input.getValue()).toEqual('$2,202.76');
        // Check the text selection
        const inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue387inputNotCancellable);
        expect(inputCaretPosition.start).toEqual(0);
        expect(inputCaretPosition.end).toEqual('$2,202.76'.length);

        // Test that after adding characters, we get back the original value
        browser.keys(['Home', 'ArrowRight', 'ArrowRight', 'ArrowRight', '583']);
        expect(input.getValue()).toEqual('$2,258,302.76');
        browser.keys(['Escape']);
        expect(input.getValue()).toEqual('$2,258,302.76');

        input.setValue('220242.76');
        expect(input.getValue()).toEqual('$220,242.76');
        // Test that after adding and deleting characters, we get back the original value
        browser.keys(['Home', 'ArrowRight', 'ArrowRight', 'ArrowRight', 'Delete', '583', 'Delete', 'Backspace']);
        expect(input.getValue()).toEqual('$225,842.76');
        browser.keys(['Escape']);
        expect(input.getValue()).toEqual('$225,842.76');

        // Test that after not modifying the value, we get the same value
        // Focus in the next input
        browser.keys(['Tab']);
        // Test the initial value
        const inputNotCancellable = $(selectors.issue387inputNotCancellableNumOnly);
        expect(inputNotCancellable.getValue()).toEqual('$220,242.76');
        browser.keys(['Home', 'ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowRight', '146']);
        expect(inputNotCancellable.getValue()).toEqual('$220,146,242.76');
        browser.keys(['Backspace', 'Backspace', 'Backspace']);
        expect(inputNotCancellable.getValue()).toEqual('$220,242.76');
        browser.keys(['Escape']);
        expect(inputNotCancellable.getValue()).toEqual('$220,242.76');
    });
});

describe('Issue #393', () => { //FIXME Finish this
    it('should test for default values', () => {
        browser.url(testUrl);

        expect($(selectors.issue393inputFixed).getValue()).toEqual('');
        expect($(selectors.issue393inputProgressive).getValue()).toEqual('2,202.00');
        expect($(selectors.issue393inputUpperLimit).getValue()).toEqual('');
        expect($(selectors.issue393inputLowerLimit).getValue()).toEqual('');
        expect($(selectors.issue393inputLimitOneSideUp).getValue()).toEqual('');
        expect($(selectors.issue393inputLimitOneSideDown).getValue()).toEqual('');
    });
    //TODO Create the tests once the mousewheel events will be managed by the Selenium server (cf. http://stackoverflow.com/questions/6735830/how-to-fire-mouse-wheel-event-in-firefox-with-javascript | https://groups.google.com/forum/#!topic/selenium-users/VyE-BB5Z2lU)

    xit('should increment and decrement the value with a fixed step', () => { //FIXME Finish this
        // Focus in the input
        const input = $(selectors.issue393inputFixed);
        input.click();
        // Test the initial value
        expect(input.getValue()).toEqual('');

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
        expect(input.getValue()).toEqual('1,000.00');
    });
});

describe('Elements with the `contenteditable` attribute set to `true`', () => {
    it('should test for default values', () => {
        browser.url(testUrl);

        expect($(selectors.contentEditable1).getText()).toEqual('');
        expect($(selectors.contentEditable2).getText()).toEqual('$12,345,678.90');
    });

    it('should change the input value accordingly when focusing on the element', () => { //FIXME Fails on Firefox where the contenteditable field is said to be not visible, see upstream bug https://github.com/mozilla/geckodriver/issues/1074
        const contentEditable1 = $(selectors.contentEditable1);
        const contentEditable2 = $(selectors.contentEditable2);

        // Focus in the input
        contentEditable1.click();

        // Test the values
        // expect(browser.getText(selectors.contentEditable1)).toEqual('\u202f€'); //TODO There is a bug upstream in webdriver.io where `getText` trims whitespaces (https://github.com/webdriverio/webdriverio/issues/1896)
        expect(contentEditable1.getText()).toEqual('€'); //TODO Delete this line when the upstream bug (https://github.com/webdriverio/webdriverio/issues/1896) is corrected
        browser.keys(['Home', '1234567.89']);
        expect(contentEditable1.getText()).toEqual('1.234.567,89\u202f€');

        // Focus in the input
        contentEditable2.click();

        // Test the values
        expect(contentEditable2.getText()).toEqual('$12,345,678.90');
        browser.keys(['ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft']); // Under Firefox, 'Home' does not work and I must rely on that //TODO Change it back when the bug is fixed upstream
        browser.keys(['Home']); // Under Firefox, 'Home' does not work and I must rely on that //TODO Change it back when the bug is fixed upstream
        // browser.keys(['Home', 'Delete', 'Delete', 'Delete', 'Delete', 'Delete', 'Delete', '2267']); //TODO Uncomment this line when the bug is fixed upstream
        browser.keys(['Delete', 'Delete', 'Delete', 'Delete', 'Delete', 'Delete', '2267']); //TODO Delete this line when the bug is fixed upstream
        expect(contentEditable2.getText()).toEqual('$226,778.90');
    });

    it('should be able change the element value since `contenteditable` is initially set to `false`, but an option update sets the `readOnly` option to `false`', () => {
        const contentEditableNotActivated = $(selectors.contentEditableNotActivated);

        // Focus in the input
        contentEditableNotActivated.click();

        // Test the `contenteditable` attribute
        expect(contentEditableNotActivated.getAttribute('contenteditable')).toEqual('true');

        // Test the values
        expect(contentEditableNotActivated.getText()).toEqual('69.02 CHF');
        browser.keys(['Home']);
        browser.keys(['ArrowLeft']); //FIXME This is a hack to circumvent a geckodriver bug where `Home` is not taken into account on the preceding line
        browser.keys(['1234']);
        expect(contentEditableNotActivated.getText()).toEqual("123'469.02 CHF");
    });

    it('should not change the element value since `contenteditable` is set to `false`', () => {
        const contentEditableNotActivatedYet = $(selectors.contentEditableNotActivatedYet);

        // Focus in the input
        contentEditableNotActivatedYet.click();

        // Test the `contenteditable` attribute
        expect(contentEditableNotActivatedYet.getAttribute('contenteditable')).toEqual('false');

        // Test the values
        expect(contentEditableNotActivatedYet.getText()).toEqual('©123,456.79');
        browser.keys(['Home', '1234']);
        expect(contentEditableNotActivatedYet.getText()).toEqual('©123,456.79');
    });

    //FIXME Add the paste tests (and check the resulting caret position)
});

describe('Issue #403', () => {
    it('should test for default values', () => {
        browser.url(testUrl);

        expect($(selectors.issue403a).getValue()).toEqual('25.00%');
        expect($(selectors.issue403b).getValue()).toEqual('1.200%');
        expect($(selectors.issue403c).getValue()).toEqual('');
    });

    it('should change the input value accordingly when focusing on the element', () => {
        const inputA = $(selectors.issue403a);
        const inputB = $(selectors.issue403b);

        // Focus in the input
        inputA.click();

        // Test the input value while the element is focused
        expect(inputA.getValue()).toEqual('0.25');

        // Focus out of the input
        inputB.click();

        // Test the input value while the element is not focused
        expect(inputA.getValue()).toEqual('25.00%');

        // Then we cycle back twice just to make sure the value stays the same while tabbing in/out
        inputA.click();
        expect(inputA.getValue()).toEqual('0.25');
        inputB.click();
        expect(inputA.getValue()).toEqual('25.00%');
        inputA.click();
        expect(inputA.getValue()).toEqual('0.25');
        inputB.click();
        expect(inputA.getValue()).toEqual('25.00%');
    });

    it('should change the input value accordingly when focusing on the element', () => {
        const inputA = $(selectors.issue403a);
        const inputB = $(selectors.issue403b);

        // Focus in the input
        inputB.click();

        // Set the value
        browser.keys(['Control', 'a', 'Control', '0.01234']);

        // Test the input value while the element is focused
        expect(inputB.getValue()).toEqual('0.01234');

        // Focus out of the input
        inputA.click();

        // Test the input value while the element is not focused
        expect(inputB.getValue()).toEqual('1.234%');

        // Then we cycle back twice just to make sure the value stays the same while tabbing in/out
        inputB.click();
        expect(inputB.getValue()).toEqual('0.01234');
        inputA.click();
        expect(inputB.getValue()).toEqual('1.234%');

        inputB.click();
        expect(inputB.getValue()).toEqual('0.01234');
        inputA.click();
        expect(inputB.getValue()).toEqual('1.234%');
    });

    it('should change the input value accordingly when focusing on the element, with a bigger number of decimal places', () => {
        const inputB = $(selectors.issue403b);
        const inputC = $(selectors.issue403c);

        // Focus in the input
        inputC.click();
        browser.keys(['1234567.89']);

        // Test the input value while the element is focused
        expect(inputC.getValue()).toEqual('1,234,567.89');

        // Focus out of the input
        inputB.click();

        // Test the input value while the element is not focused
        expect(inputC.getValue()).toEqual('1.23457MM');

        // Then we cycle back twice just to make sure the value stays the same while tabbing in/out
        inputC.click();
        expect(inputC.getValue()).toEqual('1,234,567.89');
        inputB.click();
        expect(inputC.getValue()).toEqual('1.23457MM');

        inputC.click();
        expect(inputC.getValue()).toEqual('1,234,567.89');
        inputB.click();
        expect(inputC.getValue()).toEqual('1.23457MM');
    });
});

describe('Negative numbers & brackets notations', () => {
    it('should test for default values', () => {
        browser.url(testUrl);

        expect($(selectors.negativeBrackets1).getValue()).toEqual('[1.352.468,24 €]');
        expect($(selectors.negativeBrackets2).getValue()).toEqual('<$1,352,468.24>');
        expect($(selectors.negativeBrackets3).getValue()).toEqual("{1'352'468.24 CHF}");
        expect($(selectors.negativeBrackets4).getValue()).toEqual('(1.352.468,24 €)');
        expect($(selectors.negativeBrackets5).getValue()).toEqual('$-1,352,468.24');

        expect($(selectors.negativeBracketsInput1).getValue()).toEqual('(1.234,57)');
        expect($(selectors.negativeBracketsInput2).getValue()).toEqual('(1.234,57)');
        expect($(selectors.negativeBracketsInput3).getValue()).toEqual('(€ 1.234,57)');
        expect($(selectors.negativeBracketsInput4).getValue()).toEqual('(€ 1.234,57)');
        expect($(selectors.negativeBracketsInput5).getValue()).toEqual('(€ 1.234,57)');
        expect($(selectors.negativeBracketsInput6).getValue()).toEqual('(1.234,57 €)');
        expect($(selectors.negativeBracketsInput7).getValue()).toEqual('(1.234,57 €)');
        expect($(selectors.negativeBracketsInput8).getValue()).toEqual('(1.234,57 €)');
    });

    it('should hide the parenthesis on focus', () => {
        const negativeBrackets1 = $(selectors.negativeBrackets1);

        // Focus in the input
        negativeBrackets1.click();
        expect(negativeBrackets1.getValue()).toEqual('-1.352.468,24 €');
    });

    it('should show the parenthesis back on blur', () => {
        const negativeBrackets1 = $(selectors.negativeBrackets1);
        const negativeBrackets2 = $(selectors.negativeBrackets2);

        // Focus on another the input
        negativeBrackets2.click();
        expect(negativeBrackets1.getValue()).toEqual('[1.352.468,24 €]');
        expect(negativeBrackets2.getValue()).toEqual('$-1,352,468.24');
    });

    it('should not show the parenthesis back on blur if the value has changed for a positive one', () => {
        const negativeBrackets1 = $(selectors.negativeBrackets1);
        const negativeBrackets2 = $(selectors.negativeBrackets2);

        // Focus in the input
        negativeBrackets1.click();
        browser.keys(['Home', 'Delete']);
        expect(negativeBrackets1.getValue()).toEqual('1.352.468,24 €');
        // Focus on another the input
        negativeBrackets2.click();
        expect(negativeBrackets1.getValue()).toEqual('1.352.468,24 €');
    });

    it('should toggle to positive and negative values when inputting `-` or `+`', () => {
        const negativeBracketsInput1 = $(selectors.negativeBracketsInput1);
        const negativeBracketsInput5 = $(selectors.negativeBracketsInput5);

        negativeBracketsInput1.click();
        expect(negativeBracketsInput1.getValue()).toEqual('-1.234,57');
        browser.keys(['Home', '-']);
        expect(negativeBracketsInput1.getValue()).toEqual('+1.234,57');
        browser.keys(['-']);
        expect(negativeBracketsInput1.getValue()).toEqual('-1.234,57');
        browser.keys(['-']);
        expect(negativeBracketsInput1.getValue()).toEqual('+1.234,57');
        browser.keys(['-']);
        expect(negativeBracketsInput1.getValue()).toEqual('-1.234,57');

        negativeBracketsInput5.click();
        expect(negativeBracketsInput5.getValue()).toEqual('€ 1.234,57-');
        browser.keys(['Home', '-']);
        expect(negativeBracketsInput5.getValue()).toEqual('€ 1.234,57+');
        browser.keys(['-']);
        expect(negativeBracketsInput5.getValue()).toEqual('€ 1.234,57-');
        browser.keys(['-']);
        expect(negativeBracketsInput5.getValue()).toEqual('€ 1.234,57+');
        browser.keys(['-']);
        expect(negativeBracketsInput5.getValue()).toEqual('€ 1.234,57-');
    });

    it('should hide the parenthesis on focus, via tabbing, for each variations of the currency and negative sign placements', () => {
        const negativeBracketsInput1 = $(selectors.negativeBracketsInput1);

        // Focus in the input
        negativeBracketsInput1.click();
        expect(negativeBracketsInput1.getValue()).toEqual('-1.234,57');
        browser.keys(['Tab']);
        expect($(selectors.negativeBracketsInput2).getValue()).toEqual('1.234,57-');
        browser.keys(['Tab']);
        expect($(selectors.negativeBracketsInput3).getValue()).toEqual('€ -1.234,57');
        browser.keys(['Tab']);
        expect($(selectors.negativeBracketsInput4).getValue()).toEqual('-€ 1.234,57');
        browser.keys(['Tab']);
        expect($(selectors.negativeBracketsInput5).getValue()).toEqual('€ 1.234,57-');
        browser.keys(['Tab']);
        expect($(selectors.negativeBracketsInput6).getValue()).toEqual('1.234,57- €');
        browser.keys(['Tab']);
        expect($(selectors.negativeBracketsInput7).getValue()).toEqual('1.234,57 €-');
        browser.keys(['Tab']);
        expect($(selectors.negativeBracketsInput8).getValue()).toEqual('-1.234,57 €');

        // Focus elsewhere
        $(selectors.negativeBrackets1).click();

        // Check that the values are back with the parenthesis
        expect($(selectors.negativeBracketsInput1).getValue()).toEqual('(1.234,57)');
        expect($(selectors.negativeBracketsInput2).getValue()).toEqual('(1.234,57)');
        expect($(selectors.negativeBracketsInput3).getValue()).toEqual('(€ 1.234,57)');
        expect($(selectors.negativeBracketsInput4).getValue()).toEqual('(€ 1.234,57)');
        expect($(selectors.negativeBracketsInput5).getValue()).toEqual('(€ 1.234,57)');
        expect($(selectors.negativeBracketsInput6).getValue()).toEqual('(1.234,57 €)');
        expect($(selectors.negativeBracketsInput7).getValue()).toEqual('(1.234,57 €)');
        expect($(selectors.negativeBracketsInput8).getValue()).toEqual('(1.234,57 €)');
    });

    it('should hide the parenthesis on focus, via mouse clicks, for each variations of the currency and negative sign placements', () => {
        const negativeBracketsInput1 = $(selectors.negativeBracketsInput1);
        const negativeBracketsInput2 = $(selectors.negativeBracketsInput2);
        const negativeBracketsInput3 = $(selectors.negativeBracketsInput3);
        const negativeBracketsInput4 = $(selectors.negativeBracketsInput4);
        const negativeBracketsInput5 = $(selectors.negativeBracketsInput5);
        const negativeBracketsInput6 = $(selectors.negativeBracketsInput6);
        const negativeBracketsInput7 = $(selectors.negativeBracketsInput7);
        const negativeBracketsInput8 = $(selectors.negativeBracketsInput8);

        // Focus in the input
        negativeBracketsInput1.click();
        expect(negativeBracketsInput1.getValue()).toEqual('-1.234,57');
        negativeBracketsInput2.click();
        expect(negativeBracketsInput2.getValue()).toEqual('1.234,57-');
        negativeBracketsInput3.click();
        expect(negativeBracketsInput3.getValue()).toEqual('€ -1.234,57');
        negativeBracketsInput4.click();
        expect(negativeBracketsInput4.getValue()).toEqual('-€ 1.234,57');
        negativeBracketsInput5.click();
        expect(negativeBracketsInput5.getValue()).toEqual('€ 1.234,57-');
        negativeBracketsInput6.click();
        expect(negativeBracketsInput6.getValue()).toEqual('1.234,57- €');
        negativeBracketsInput7.click();
        expect(negativeBracketsInput7.getValue()).toEqual('1.234,57 €-');
        negativeBracketsInput8.click();
        expect(negativeBracketsInput8.getValue()).toEqual('-1.234,57 €');

        // Focus elsewhere
        $(selectors.negativeBrackets1).click();

        // Check that the values are back with the parenthesis
        expect(negativeBracketsInput1.getValue()).toEqual('(1.234,57)');
        expect(negativeBracketsInput2.getValue()).toEqual('(1.234,57)');
        expect(negativeBracketsInput3.getValue()).toEqual('(€ 1.234,57)');
        expect(negativeBracketsInput4.getValue()).toEqual('(€ 1.234,57)');
        expect(negativeBracketsInput5.getValue()).toEqual('(€ 1.234,57)');
        expect(negativeBracketsInput6.getValue()).toEqual('(1.234,57 €)');
        expect(negativeBracketsInput7.getValue()).toEqual('(1.234,57 €)');
        expect(negativeBracketsInput8.getValue()).toEqual('(1.234,57 €)');
    });

    it('should correctly remove the brackets when the value is set to a positive one, when the caret in on the far left (Issue #414)', () => {
        const negativeBracketsInput1 = $(selectors.negativeBracketsInput1);
        const negativeBracketsInput2 = $(selectors.negativeBracketsInput2);
        const negativeBracketsInput3 = $(selectors.negativeBracketsInput3);
        const negativeBracketsInput4 = $(selectors.negativeBracketsInput4);
        const negativeBracketsInput5 = $(selectors.negativeBracketsInput5);
        const negativeBracketsInput6 = $(selectors.negativeBracketsInput6);
        const negativeBracketsInput7 = $(selectors.negativeBracketsInput7);
        const negativeBracketsInput8 = $(selectors.negativeBracketsInput8);

        // Focus in the input
        negativeBracketsInput1.click();
        expect(negativeBracketsInput1.getValue()).toEqual('-1.234,57');
        browser.keys(['Home', '+']);
        expect(negativeBracketsInput1.getValue()).toEqual('+1.234,57'); //FIXME Fails on Chrome and Firefox; it seems to be a bug in either the selenium chromedriver/geckodriver or in webdriver

        negativeBracketsInput2.click();
        expect(negativeBracketsInput2.getValue()).toEqual('1.234,57-');
        browser.keys(['Home', '+']);
        expect(negativeBracketsInput2.getValue()).toEqual('1.234,57+');

        negativeBracketsInput3.click();
        expect(negativeBracketsInput3.getValue()).toEqual('€ -1.234,57');
        browser.keys(['Home', '+']);
        expect(negativeBracketsInput3.getValue()).toEqual('€ +1.234,57');

        negativeBracketsInput4.click();
        expect(negativeBracketsInput4.getValue()).toEqual('-€ 1.234,57');
        browser.keys(['Home', '+']);
        expect(negativeBracketsInput4.getValue()).toEqual('+€ 1.234,57');

        negativeBracketsInput5.click();
        expect(negativeBracketsInput5.getValue()).toEqual('€ 1.234,57-');
        browser.keys(['Home', '+']);
        expect(negativeBracketsInput5.getValue()).toEqual('€ 1.234,57+');

        negativeBracketsInput6.click();
        expect(negativeBracketsInput6.getValue()).toEqual('1.234,57- €');
        browser.keys(['Home', '+']);
        expect(negativeBracketsInput6.getValue()).toEqual('1.234,57+ €');

        negativeBracketsInput7.click();
        expect(negativeBracketsInput7.getValue()).toEqual('1.234,57 €-');
        browser.keys(['Home', '+']);
        expect(negativeBracketsInput7.getValue()).toEqual('1.234,57 €+');

        negativeBracketsInput8.click();
        expect(negativeBracketsInput8.getValue()).toEqual('-1.234,57 €');
        browser.keys(['Home', '+']);
        expect(negativeBracketsInput8.getValue()).toEqual('+1.234,57 €');

        // Focus elsewhere
        $(selectors.negativeBrackets1).click();

        // Check that the values are correctly formatted when unfocused
        expect(negativeBracketsInput1.getValue()).toEqual('+1.234,57');
        expect(negativeBracketsInput2.getValue()).toEqual('1.234,57+');
        expect(negativeBracketsInput3.getValue()).toEqual('€ +1.234,57');
        expect(negativeBracketsInput4.getValue()).toEqual('+€ 1.234,57');
        expect(negativeBracketsInput5.getValue()).toEqual('€ 1.234,57+');
        expect(negativeBracketsInput6.getValue()).toEqual('1.234,57+ €');
        expect(negativeBracketsInput7.getValue()).toEqual('1.234,57 €+');
        expect(negativeBracketsInput8.getValue()).toEqual('+1.234,57 €');
    });

    it('should correctly keep the positive value when tabbing between the inputs (Issue #414)', () => {
        const negativeBracketsInput1 = $(selectors.negativeBracketsInput1);
        const negativeBracketsInput2 = $(selectors.negativeBracketsInput2);
        const negativeBracketsInput3 = $(selectors.negativeBracketsInput3);
        const negativeBracketsInput4 = $(selectors.negativeBracketsInput4);
        const negativeBracketsInput5 = $(selectors.negativeBracketsInput5);
        const negativeBracketsInput6 = $(selectors.negativeBracketsInput6);
        const negativeBracketsInput7 = $(selectors.negativeBracketsInput7);
        const negativeBracketsInput8 = $(selectors.negativeBracketsInput8);

        // Focus in the input
        negativeBracketsInput1.click();
        expect(negativeBracketsInput1.getValue()).toEqual('+1.234,57'); //FIXME Fails on Chrome only; there is a bug in the selenium chromedriver
        browser.keys(['Tab']);
        expect(negativeBracketsInput1.getValue()).toEqual('+1.234,57');

        expect(negativeBracketsInput2.getValue()).toEqual('1.234,57+');
        browser.keys(['Tab']);
        expect(negativeBracketsInput2.getValue()).toEqual('1.234,57+');

        expect(negativeBracketsInput3.getValue()).toEqual('€ +1.234,57');
        browser.keys(['Tab']);
        expect(negativeBracketsInput3.getValue()).toEqual('€ +1.234,57');

        expect(negativeBracketsInput4.getValue()).toEqual('+€ 1.234,57');
        browser.keys(['Tab']);
        expect(negativeBracketsInput4.getValue()).toEqual('+€ 1.234,57');

        expect(negativeBracketsInput5.getValue()).toEqual('€ 1.234,57+');
        browser.keys(['Tab']);
        expect(negativeBracketsInput5.getValue()).toEqual('€ 1.234,57+');

        expect(negativeBracketsInput6.getValue()).toEqual('1.234,57+ €');
        browser.keys(['Tab']);
        expect(negativeBracketsInput6.getValue()).toEqual('1.234,57+ €');

        expect(negativeBracketsInput7.getValue()).toEqual('1.234,57 €+');
        browser.keys(['Tab']);
        expect(negativeBracketsInput7.getValue()).toEqual('1.234,57 €+');

        expect(negativeBracketsInput8.getValue()).toEqual('+1.234,57 €');
        browser.keys(['Shift', 'Tab', 'Shift']);
        expect(negativeBracketsInput8.getValue()).toEqual('+1.234,57 €');
    });

    it('should correctly change back the element value to negative ones, with tabbing (Issue #414)', () => {
        const negativeBracketsInput1 = $(selectors.negativeBracketsInput1);
        const negativeBracketsInput2 = $(selectors.negativeBracketsInput2);
        const negativeBracketsInput3 = $(selectors.negativeBracketsInput3);
        const negativeBracketsInput4 = $(selectors.negativeBracketsInput4);
        const negativeBracketsInput5 = $(selectors.negativeBracketsInput5);
        const negativeBracketsInput6 = $(selectors.negativeBracketsInput6);
        const negativeBracketsInput7 = $(selectors.negativeBracketsInput7);
        const negativeBracketsInput8 = $(selectors.negativeBracketsInput8);

        // Focus in the input
        negativeBracketsInput1.click();
        expect(negativeBracketsInput1.getValue()).toEqual('+1.234,57'); //FIXME Fails on Chrome only; there is a bug in the selenium chromedriver
        browser.keys(['Home', '-', 'Tab']);

        expect(negativeBracketsInput2.getValue()).toEqual('1.234,57+');
        browser.keys(['Home', '-', 'Tab']);

        expect(negativeBracketsInput3.getValue()).toEqual('€ +1.234,57');
        browser.keys(['Home', '-', 'Tab']);

        expect(negativeBracketsInput4.getValue()).toEqual('+€ 1.234,57');
        browser.keys(['Home', '-', 'Tab']);

        expect(negativeBracketsInput5.getValue()).toEqual('€ 1.234,57+');
        browser.keys(['Home', '-', 'Tab']);

        expect(negativeBracketsInput6.getValue()).toEqual('1.234,57+ €');
        browser.keys(['Home', '-', 'Tab']);

        expect(negativeBracketsInput7.getValue()).toEqual('1.234,57 €+');
        browser.keys(['Home', '-', 'Tab']);

        expect(negativeBracketsInput8.getValue()).toEqual('+1.234,57 €');
        browser.keys(['Home', '-']);

        // Focus elsewhere
        $(selectors.negativeBrackets1).click();

        // Check that the values are correctly formatted when unfocused
        expect(negativeBracketsInput1.getValue()).toEqual('(1.234,57)');
        expect(negativeBracketsInput2.getValue()).toEqual('(1.234,57)');
        expect(negativeBracketsInput3.getValue()).toEqual('(€ 1.234,57)');
        expect(negativeBracketsInput4.getValue()).toEqual('(€ 1.234,57)');
        expect(negativeBracketsInput5.getValue()).toEqual('(€ 1.234,57)');
        expect(negativeBracketsInput6.getValue()).toEqual('(1.234,57 €)');
        expect(negativeBracketsInput7.getValue()).toEqual('(1.234,57 €)');
        expect(negativeBracketsInput8.getValue()).toEqual('(1.234,57 €)');
    });

    it('should correctly remove the brackets when the value is set to a positive one, when the caret in on the far right (Issue #414)', () => {
        const negativeBracketsInput1 = $(selectors.negativeBracketsInput1);
        const negativeBracketsInput2 = $(selectors.negativeBracketsInput2);
        const negativeBracketsInput3 = $(selectors.negativeBracketsInput3);
        const negativeBracketsInput4 = $(selectors.negativeBracketsInput4);
        const negativeBracketsInput5 = $(selectors.negativeBracketsInput5);
        const negativeBracketsInput6 = $(selectors.negativeBracketsInput6);
        const negativeBracketsInput7 = $(selectors.negativeBracketsInput7);
        const negativeBracketsInput8 = $(selectors.negativeBracketsInput8);

        // Focus in the input
        negativeBracketsInput1.click();
        expect(negativeBracketsInput1.getValue()).toEqual('-1.234,57'); //FIXME Fails on Chrome only; there is a bug in the selenium chromedriver
        browser.keys(['End', '+']);
        expect(negativeBracketsInput1.getValue()).toEqual('+1.234,57');

        negativeBracketsInput2.click();
        expect(negativeBracketsInput2.getValue()).toEqual('1.234,57-');
        browser.keys(['End', '+']);
        expect(negativeBracketsInput2.getValue()).toEqual('1.234,57+');

        negativeBracketsInput3.click();
        expect(negativeBracketsInput3.getValue()).toEqual('€ -1.234,57');
        browser.keys(['End', '+']);
        expect(negativeBracketsInput3.getValue()).toEqual('€ +1.234,57');

        negativeBracketsInput4.click();
        expect(negativeBracketsInput4.getValue()).toEqual('-€ 1.234,57');
        browser.keys(['End', '+']);
        expect(negativeBracketsInput4.getValue()).toEqual('+€ 1.234,57');

        negativeBracketsInput5.click();
        expect(negativeBracketsInput5.getValue()).toEqual('€ 1.234,57-');
        browser.keys(['End', '+']);
        expect(negativeBracketsInput5.getValue()).toEqual('€ 1.234,57+');

        negativeBracketsInput6.click();
        expect(negativeBracketsInput6.getValue()).toEqual('1.234,57- €');
        browser.keys(['End', '+']);
        expect(negativeBracketsInput6.getValue()).toEqual('1.234,57+ €');

        negativeBracketsInput7.click();
        expect(negativeBracketsInput7.getValue()).toEqual('1.234,57 €-');
        browser.keys(['End', '+']);
        expect(negativeBracketsInput7.getValue()).toEqual('1.234,57 €+');

        negativeBracketsInput8.click();
        expect(negativeBracketsInput8.getValue()).toEqual('-1.234,57 €');
        browser.keys(['End', '+']);
        expect(negativeBracketsInput8.getValue()).toEqual('+1.234,57 €');

        // Focus elsewhere
        $(selectors.negativeBrackets1).click();

        // Check that the values are correctly formatted when unfocused
        expect(negativeBracketsInput1.getValue()).toEqual('+1.234,57');
        expect(negativeBracketsInput2.getValue()).toEqual('1.234,57+');
        expect(negativeBracketsInput3.getValue()).toEqual('€ +1.234,57');
        expect(negativeBracketsInput4.getValue()).toEqual('+€ 1.234,57');
        expect(negativeBracketsInput5.getValue()).toEqual('€ 1.234,57+');
        expect(negativeBracketsInput6.getValue()).toEqual('1.234,57+ €');
        expect(negativeBracketsInput7.getValue()).toEqual('1.234,57 €+');
        expect(negativeBracketsInput8.getValue()).toEqual('+1.234,57 €');
    });
});

describe('remove() function', () => {
    it('should test for default values', () => {
        browser.url(testUrl);

        expect($(selectors.remove1).getValue()).toEqual('2.468,42 €');
    });

    it('should stop reacting with the AutoNumeric event handlers to user interactions once its removed', () => {
        const remove1 = $(selectors.remove1);

        // Focus in the input
        remove1.click();
        browser.keys(['Home', '115']);
        expect(remove1.getValue()).toEqual('1.152.468,42 €');

        // Call the `remove()` function
        browser.execute(domId => {
            const inputRemove1 = document.querySelector(domId);
            // eslint-disable-next-line
            const anElement = AutoNumeric.getAutoNumericElement(inputRemove1);
            anElement.remove();
        }, selectors.remove1);

        // Check that the value has not changed
        expect(remove1.getValue()).toEqual('1.152.468,42 €');
        browser.keys(['Home', 'ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowRight', 'Delete', 'Delete']);
        expect(remove1.getValue()).toEqual('1.15468,42 €');
    });
});

describe('undo and redo functions', () => {
    it('should test for default values', () => {
        browser.url(testUrl);

        expect($(selectors.undoRedo1).getValue()).toEqual('1.357,92 €');
        expect($(selectors.undoRedo2).getText()).toEqual('1.357,92 €');
        expect($(selectors.undoRedo3).getValue()).toEqual('12.340');
        expect($(selectors.undoRedo4).getValue()).toEqual('');
    });

    it('should undo the user inputs correctly on <input> elements', () => {
        let inputCaretPosition;
        const undoRedoInput = $(selectors.undoRedo1);

        // Focus in the input
        undoRedoInput.click();

        // Enter some characters to build the history table
        browser.keys(['Home', '0']); // Input a character that will be dropped and won't be set in the history list
        expect(undoRedoInput.getValue()).toEqual('1.357,92 €'); // |1.357,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(0);

        browser.keys(['1']);
        expect(undoRedoInput.getValue()).toEqual('11.357,92 €'); // 1|1.357,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(1);

        browser.keys(['ArrowRight', '2']);
        expect(undoRedoInput.getValue()).toEqual('112.357,92 €'); // 11.|357,92 € -> 112|.357,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(3);

        browser.keys(['4']);
        expect(undoRedoInput.getValue()).toEqual('1.124.357,92 €'); // 1.124|.357,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(5);

        browser.keys(['ArrowRight', 'ArrowRight', '6']);
        expect(undoRedoInput.getValue()).toEqual('11.243.657,92 €'); // 1.124.|357,92 € -> 1.124.3|57,92 € -> 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(8);


        // Undos
        browser.keys(['Control', 'z']);
        expect(undoRedoInput.getValue()).toEqual('1.124.357,92 €'); // 1.124.3|57,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(7);

        browser.keys(['z']);
        expect(undoRedoInput.getValue()).toEqual('112.357,92 €'); // 112|.357,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(3);

        browser.keys(['z']);
        expect(undoRedoInput.getValue()).toEqual('11.357,92 €'); // 11.|357,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(3);

        browser.keys(['z']);
        expect(undoRedoInput.getValue()).toEqual('1.357,92 €'); // |1.357,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(0);

        browser.keys(['z']); // This makes sure we cannot go back too far
        expect(undoRedoInput.getValue()).toEqual('1.357,92 €'); // |1.357,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(0);

        browser.keys(['Control']); // Release the control key
        expect(undoRedoInput.getValue()).toEqual('1.357,92 €'); // |1.357,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(0);
    });

    it('should redo the user inputs correctly on <input> elements, when releasing the Shift then Control key', () => {
        let inputCaretPosition;
        const undoRedoInput = $(selectors.undoRedo1);

        // Redos (releasing the keys shift, then ctrl)
        browser.keys(['Control', 'Shift', 'z']);
        expect(undoRedoInput.getValue()).toEqual('11.357,92 €'); // 11.|357,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(3);

        browser.keys(['z']);
        expect(undoRedoInput.getValue()).toEqual('112.357,92 €'); // 112|.357,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(3);

        browser.keys(['z']);
        expect(undoRedoInput.getValue()).toEqual('1.124.357,92 €'); // 1.124.3|57,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(7);

        browser.keys(['z']);
        expect(undoRedoInput.getValue()).toEqual('11.243.657,92 €'); // 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(8);

        browser.keys(['z']); // This makes sure we cannot go back too far
        expect(undoRedoInput.getValue()).toEqual('11.243.657,92 €'); // 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(8);

        browser.keys(['Shift']); // Release the Shift key
        expect(undoRedoInput.getValue()).toEqual('11.243.657,92 €'); // 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(8);

        browser.keys(['Control']); // Release the control key
        expect(undoRedoInput.getValue()).toEqual('11.243.657,92 €'); // 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(8);
    });

    it('should redo the user inputs correctly on <input> elements, when releasing the Control then Shift key', () => {
        let inputCaretPosition;
        const undoRedoInput = $(selectors.undoRedo1);

        // Undos some more to test the last redos with the specific key release order
        browser.keys(['Control', 'z']);
        expect(undoRedoInput.getValue()).toEqual('1.124.357,92 €'); // 1.124.3|57,92 €
        browser.keys(['z']);
        expect(undoRedoInput.getValue()).toEqual('112.357,92 €'); // 112|.357,92 €
        browser.keys(['Control']);
        expect(undoRedoInput.getValue()).toEqual('112.357,92 €'); // 112|.357,92 €

        // Redos (releasing the keys ctrl, then shift)
        browser.keys(['Control', 'Shift', 'z']);
        expect(undoRedoInput.getValue()).toEqual('1.124.357,92 €'); // 1.124.3|57,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(7);

        browser.keys(['z']);
        expect(undoRedoInput.getValue()).toEqual('11.243.657,92 €'); // 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(8);

        browser.keys(['Control']); // Release the control key
        expect(undoRedoInput.getValue()).toEqual('11.243.657,92 €'); // 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(8);

        browser.keys(['Shift']); // Release the Shift key
        expect(undoRedoInput.getValue()).toEqual('11.243.657,92 €'); // 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(8);
    });

    it('should save the very last known caret/selection position correctly, even if a group separator is added', () => {
        let inputCaretPosition;
        const undoRedoInput = $(selectors.undoRedo1);

        browser.keys(['1']);
        expect(undoRedoInput.getValue()).toEqual('112.436.157,92 €'); // 112.436.1|57,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(9);

        browser.keys(['2']);
        expect(undoRedoInput.getValue()).toEqual('1.124.361.257,92 €'); // 1.124.361.2|57,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(11);

        // Undo
        browser.keys(['Control', 'z']);
        expect(undoRedoInput.getValue()).toEqual('112.436.157,92 €'); // 112.436.1|57,92 €
        browser.keys(['Control']); // Release the control key
        expect(undoRedoInput.getValue()).toEqual('112.436.157,92 €'); // 112.436.1|57,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(9);

        // Redo
        browser.keys(['Control', 'Shift', 'z', 'Shift', 'Control']);
        expect(undoRedoInput.getValue()).toEqual('1.124.361.257,92 €'); // 1.124.361.2|57,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo1);
        expect(inputCaretPosition).toEqual(11);
    });

    it('should respect the `historySize` option', () => {
        let inputCaretPosition;
        const undoRedoInput = $(selectors.undoRedo3);

        // Focus in the input
        undoRedoInput.click();

        // Enter some characters to build the history table
        browser.keys(['Home', 'ArrowRight', 'Shift', 'ArrowRight', 'ArrowRight', 'ArrowRight', 'Shift', '5']);
        expect(undoRedoInput.getValue()).toEqual('1.540'); // 1|2.3|40 -> 1.5|40
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo3);
        expect(inputCaretPosition).toEqual(3);

        browser.keys(['Home', 'Shift', 'ArrowRight', 'ArrowRight', 'ArrowRight', 'Shift', '6']);
        expect(undoRedoInput.getValue()).toEqual('640'); // 1.5|40 -> 6|40
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo3);
        expect(inputCaretPosition).toEqual(1);

        browser.keys(['Backspace']);
        expect(undoRedoInput.getValue()).toEqual('40'); // 6|40 -> |40
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo3);
        expect(inputCaretPosition).toEqual(0);

        browser.keys(['2']);
        expect(undoRedoInput.getValue()).toEqual('240'); // |40 -> 2|40
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo3);
        expect(inputCaretPosition).toEqual(1);

        browser.keys(['8']);
        expect(undoRedoInput.getValue()).toEqual('2.840'); // 2|40 -> 2.8|40
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo3);
        expect(inputCaretPosition).toEqual(3);


        // Undos
        browser.keys(['Control', 'zzzzz', 'Control']);
        expect(undoRedoInput.getValue()).toEqual('1.540'); // 1.5|40
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.undoRedo3);
        expect(inputCaretPosition.start).toEqual(0);
        expect(inputCaretPosition.end).toEqual(3);


        // Redos
        browser.keys(['Control', 'Shift', 'zzzzz', 'Shift', 'Control']);
        expect(undoRedoInput.getValue()).toEqual('2.840'); // 2.8|40
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo3);
        expect(inputCaretPosition).toEqual(3);


        // Input more numbers so that the history size overflow
        browser.keys(['Home', '6']);
        expect(undoRedoInput.getValue()).toEqual('62.840'); // |2.840 -> 6|2.840
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo3);
        expect(inputCaretPosition).toEqual(1);

        // Undo to the max history size
        browser.keys(['Control', 'zzzzz', 'Control']);
        expect(undoRedoInput.getValue()).toEqual('640'); // 6|40
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo3);
        expect(inputCaretPosition).toEqual(1);

        // Try to undo once more ; this stays on the same state, since the first one got deleted
        browser.keys(['Control', 'z', 'Control']);
        expect(undoRedoInput.getValue()).toEqual('640'); // 6|40
        // Check the caret position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.undoRedo3);
        expect(inputCaretPosition).toEqual(1);

        // Try to redo more states that there is in the history table should only return the last state
        browser.keys(['Control', 'Shift', 'zzzzzzzzz', 'Shift', 'Control']);
        expect(undoRedoInput.getValue()).toEqual('62.840');
    });

    it('should keep the redo history if the use re-enter the same redo information that do not change the intermediary states', () => {
        const undoRedoInput = $(selectors.undoRedo4);

        // Focus in the input
        undoRedoInput.click();

        // Enter some characters to build the history table
        browser.keys(['End', '1234567890']);
        expect(undoRedoInput.getValue()).toEqual('1,234,567,890');

        // Undos some states in order to stop at an intermediary state where there are multiple potential redo states after the current history pointer
        browser.keys(['Control', 'zzzz', 'Control']);
        expect(undoRedoInput.getValue()).toEqual('123,456.00');

        // Enter the exact same data that would result in the same next saved state
        browser.keys(['7']);
        expect(undoRedoInput.getValue()).toEqual('1,234,567.00');

        // ...and test if the rest of the history stable is still there by doing some redos
        browser.keys(['Control', 'Shift', 'z']);
        expect(undoRedoInput.getValue()).toEqual('12,345,678.00');
        browser.keys(['z']);
        expect(undoRedoInput.getValue()).toEqual('123,456,789.00');
        browser.keys(['z']);
        expect(undoRedoInput.getValue()).toEqual('1,234,567,890.00');
        browser.keys(['z']);
        expect(undoRedoInput.getValue()).toEqual('1,234,567,890.00');
        browser.keys(['Shift', 'Control']); // Release the 'Control' and 'Shift' keys
    });

    xit('should undo the user inputs correctly on non-input elements', () => { //FIXME This does not work under FF 52...
        let inputCaretPosition;
        const undoRedoElement = $(selectors.undoRedo2);

        // Focus in the input
        undoRedoElement.click();

        // Enter some characters to build the history table
        browser.keys(['Home', '0']); // Input a character that will be dropped and won't be set in the history list
        expect(undoRedoElement.getText()).toEqual('1.357,92 €'); // |1.357,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(0);

        browser.keys(['1']);
        expect(undoRedoElement.getText()).toEqual('11.357,92 €'); // 1|1.357,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(1);

        browser.keys(['ArrowRight', '2']);
        expect(undoRedoElement.getText()).toEqual('112.357,92 €'); // 11.|357,92 € -> 112|.357,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(3);

        browser.keys(['4']);
        expect(undoRedoElement.getText()).toEqual('1.124.357,92 €'); // 1.124|.357,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(5);

        browser.keys(['ArrowRight', 'ArrowRight', '6']);
        expect(undoRedoElement.getText()).toEqual('11.243.657,92 €'); // 1.124.|357,92 € -> 1.124.3|57,92 € -> 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(8);


        // Undos
        browser.keys(['Control', 'z']);
        expect(undoRedoElement.getText()).toEqual('1.124.357,92 €'); // 1.124.3|57,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(7);

        browser.keys(['z']);
        expect(undoRedoElement.getText()).toEqual('112.357,92 €'); // 112|.357,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(3);

        browser.keys(['z']);
        expect(undoRedoElement.getText()).toEqual('11.357,92 €'); // 11.|357,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(3);

        browser.keys(['z']);
        expect(undoRedoElement.getText()).toEqual('1.357,92 €'); // |1.357,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(0);

        browser.keys(['z']); // This makes sure we cannot go back too far
        expect(undoRedoElement.getText()).toEqual('1.357,92 €'); // |1.357,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(0);

        browser.keys(['Control']); // Release the control key
        expect(undoRedoElement.getText()).toEqual('1.357,92 €'); // |1.357,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(0);
    });

    xit('should redo the user inputs correctly on non-input elements, when releasing the Shift then Control key', () => { //FIXME This does not work under FF 52...
        let inputCaretPosition;
        const undoRedoElement = $(selectors.undoRedo2);

        // Redos (releasing the keys shift, then ctrl)
        browser.keys(['Control', 'Shift', 'z']);
        expect(undoRedoElement.getText()).toEqual('11.357,92 €'); // 11.|357,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(3);

        browser.keys(['z']);
        expect(undoRedoElement.getText()).toEqual('112.357,92 €'); // 112|.357,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(3);

        browser.keys(['z']);
        expect(undoRedoElement.getText()).toEqual('1.124.357,92 €'); // 1.124.3|57,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(7);

        browser.keys(['z']);
        expect(undoRedoElement.getText()).toEqual('11.243.657,92 €'); // 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(8);

        browser.keys(['z']); // This makes sure we cannot go back too far
        expect(undoRedoElement.getText()).toEqual('11.243.657,92 €'); // 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(8);

        browser.keys(['Shift']); // Release the Shift key
        expect(undoRedoElement.getText()).toEqual('11.243.657,92 €'); // 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(8);

        browser.keys(['Control']); // Release the control key
        expect(undoRedoElement.getText()).toEqual('11.243.657,92 €'); // 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(8);
    });

    xit('should redo the user inputs correctly on non-input elements, when releasing the Control then Shift key', () => { //FIXME This does not work under FF 52...
        let inputCaretPosition;
        const undoRedoElement = $(selectors.undoRedo2);

        // Undos some more to test the last redos with the specific key release order
        browser.keys(['Control', 'z']);
        expect(undoRedoElement.getText()).toEqual('1.124.357,92 €'); // 1.124.3|57,92 €
        browser.keys(['z']);
        expect(undoRedoElement.getText()).toEqual('112.357,92 €'); // 112|.357,92 €
        browser.keys(['Control']);
        expect(undoRedoElement.getText()).toEqual('112.357,92 €'); // 112|.357,92 €

        // Redos (releasing the keys ctrl, then shift)
        browser.keys(['Control', 'Shift', 'z']);
        expect(undoRedoElement.getText()).toEqual('1.124.357,92 €'); // 1.124.3|57,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(7);

        browser.keys(['z']);
        expect(undoRedoElement.getText()).toEqual('11.243.657,92 €'); // 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(8);

        browser.keys(['Control']); // Release the control key
        expect(undoRedoElement.getText()).toEqual('11.243.657,92 €'); // 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(() => {
            const selectionInfo = window.getSelection().getRangeAt(0);
            const position = {};
            position.start = selectionInfo.startOffset;
            position.end = selectionInfo.endOffset;
            return position.start;
        });
        expect(inputCaretPosition).toEqual(8);

        browser.keys(['Shift']); // Release the Shift key
        expect(undoRedoElement.getText()).toEqual('11.243.657,92 €'); // 11.243.6|57,92 €
        // Check the caret position
        inputCaretPosition = browser.execute(() => {
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
    it('should test for default values', () => {
        browser.url(testUrl);

        expect($(selectors.issue423a).getValue()).toEqual('');
    });

    it('should keep zeros when losing focus and coming back to the element', () => {
        const inputA = $(selectors.issue423a);
        const inputB = $(selectors.issue423b);

        // Focus in the input
        inputA.click();

        // Input the numbers
        browser.keys(['00123']);
        expect(inputA.getValue()).toEqual('00123');

        // Lose the focus
        inputB.click();
        expect(inputA.getValue()).toEqual('00123');

        // Focus back in the input
        inputA.click();
        expect(inputA.getValue()).toEqual('00123');
    });

    it('should automatically overwrite zeros on the left-hand side when adding numbers', () => {
        const inputA = $(selectors.issue423a);

        // Input the numbers
        browser.keys(['End', '4']);
        expect(inputA.getValue()).toEqual('01234');
        browser.keys(['5']);
        expect(inputA.getValue()).toEqual('12345');

        // Try to add more numbers, that will be dropped due to the length constraint on the input
        browser.keys(['6']);
        expect(inputA.getValue()).toEqual('12345');
    });
});

describe('Issue #409', () => {
    it('should test for default values', () => {
        browser.url(testUrl);

        expect($(selectors.issue409a).getValue()).toEqual('500.40');
        expect($(selectors.issue409n).getValue()).toEqual('500.4');
        expect($(selectors.issue409f).getValue()).toEqual('500.40');
    });

    it('should keep or remove zeros when losing focus and coming back to the element', () => {
        const inputA = $(selectors.issue409a);
        const inputN = $(selectors.issue409n);
        const inputF = $(selectors.issue409f);

        // Focus on the first input that we want to test
        inputA.click();

        // Modify the value to an integer
        browser.keys(['End', 'Backspace', 'Backspace']);
        inputN.click(); // Focus out of the input so that it reformat itself
        expect(inputA.getValue()).toEqual('500.00');

        // Modify the value to an integer
        browser.keys(['End', 'Backspace']);
        inputF.click(); // Focus out of the input so that it reformat itself
        expect(inputN.getValue()).toEqual('500');

        // Modify the value to float
        browser.keys(['End', 'Backspace']);
        inputA.click(); // Focus out of the input so that it reformat itself
        expect(inputF.getValue()).toEqual('500.40');

        // Modify the value to an integer
        inputF.click();
        browser.keys(['End', 'Backspace', 'Backspace']);
        inputA.click(); // Focus out of the input so that it reformat itself
        expect(inputF.getValue()).toEqual('500');
    });

    it('should keep or remove zeros when adding back the decimal part, and losing focus and coming back to the element', () => {
        const inputA = $(selectors.issue409a);
        const inputN = $(selectors.issue409n);
        const inputF = $(selectors.issue409f);

        // Focus on the first input that we want to test
        inputA.click();

        // Modify the value to a float
        browser.keys(['End', 'ArrowLeft', 'Backspace', '2']);
        inputN.click(); // Focus out of the input so that it reformat itself
        expect(inputA.getValue()).toEqual('500.20');
        inputA.click();
        browser.keys(['End', 'Backspace', 'Backspace', '2']);
        inputN.click(); // Focus out of the input so that it reformat itself
        expect(inputA.getValue()).toEqual('500.20');

        // Check that the value is converted to an integer by dropping the last dot character
        browser.keys(['End', '.']);
        inputF.click(); // Focus out of the input so that it reformat itself
        expect(inputN.getValue()).toEqual('500');
        inputN.click();
        // Modify the value to a float
        browser.keys(['End', '.', '2']);
        inputF.click(); // Focus out of the input so that it reformat itself
        expect(inputN.getValue()).toEqual('500.2');

        // Modify the value to float
        browser.keys(['End', '.']);
        inputA.click(); // Focus out of the input so that it reformat itself
        // Check that the value is converted to an integer by dropping the last dot character
        expect(inputF.getValue()).toEqual('500');
        inputF.click();
        browser.keys(['End', '.', '2']);
        inputA.click(); // Focus out of the input so that it reformat itself
        expect(inputF.getValue()).toEqual('500.20');
    });
});

describe('Issue #416', () => {
    it('should test for default values', () => {
        browser.url(testUrl);

        // none
        expect($(selectors.issue416Input1).getValue()).toEqual('1.00');
        // positiveNegative
        expect($(selectors.issue416Input2).getValue()).toEqual('-2.00');
        expect($(selectors.issue416Input3).getValue()).toEqual('3.00');
        // evenOdd
        expect($(selectors.issue416Input4).getValue()).toEqual('4.00');
        expect($(selectors.issue416Input5).getValue()).toEqual('5.00');
        // range0To100With4Steps
        expect($(selectors.issue416Input6).getValue()).toEqual('0.00');
        expect($(selectors.issue416Input7).getValue()).toEqual('25.00');
        expect($(selectors.issue416Input8).getValue()).toEqual('50.00');
        expect($(selectors.issue416Input9).getValue()).toEqual('99.00');
        // rangeSmallAndZero
        expect($(selectors.issue416Input10).getValue()).toEqual('-1.00');
        expect($(selectors.issue416Input11).getValue()).toEqual('0.00');
        expect($(selectors.issue416Input12).getValue()).toEqual('0.08');
    });

    it('should correctly change the CSS positive/negative classes', () => {
        const input2 = $(selectors.issue416Input2);
        const input3 = $(selectors.issue416Input3);

        input2.click();
        browser.keys(['Home', '-----']);
        input3.click();
        browser.keys(['Home', '-----']);
    });

    it('should correctly change the CSS odd/even classes', () => {
        const input4 = $(selectors.issue416Input4);
        const input5 = $(selectors.issue416Input5);

        input4.click();
        browser.keys(['Home', 'ArrowRight', 'ArrowLeft', '1']);
        expect(input4.getValue()).toEqual('41.00');
        input5.click();
        browser.keys(['Home', 'ArrowRight', 'ArrowLeft', '2']);
        expect(input5.getValue()).toEqual('52.00');
    });

    it('should correctly change the CSS ranges classes', () => {
        // Not really a test, but it's pretty ;)
        const input6 = $(selectors.issue416Input6);
        const input7 = $(selectors.issue416Input7);
        const input8 = $(selectors.issue416Input8);
        const input9 = $(selectors.issue416Input9);

        // One cycle
        input6.click();
        browser.keys(['Control', 'a', 'Control', '25']);
        input7.click();
        browser.keys(['Control', 'a', 'Control', '50']);
        input8.click();
        browser.keys(['Control', 'a', 'Control', '75']);
        input9.click();
        browser.keys(['Control', 'a', 'Control', '0']);

        input6.click();
        browser.keys(['Control', 'a', 'Control', '50']);
        input7.click();
        browser.keys(['Control', 'a', 'Control', '75']);
        input8.click();
        browser.keys(['Control', 'a', 'Control', '0']);
        input9.click();
        browser.keys(['Control', 'a', 'Control', '25']);

        input6.click();
        browser.keys(['Control', 'a', 'Control', '75']);
        input7.click();
        browser.keys(['Control', 'a', 'Control', '0']);
        input8.click();
        browser.keys(['Control', 'a', 'Control', '25']);
        input9.click();
        browser.keys(['Control', 'a', 'Control', '50']);

        input6.click();
        browser.keys(['Control', 'a', 'Control', '0']);
        input7.click();
        browser.keys(['Control', 'a', 'Control', '25']);
        input8.click();
        browser.keys(['Control', 'a', 'Control', '50']);
        input9.click();
        browser.keys(['Control', 'a', 'Control', '75']);

        // Second cycle
        input6.click();
        browser.keys(['Control', 'a', 'Control', '25']);
        input7.click();
        browser.keys(['Control', 'a', 'Control', '50']);
        input8.click();
        browser.keys(['Control', 'a', 'Control', '75']);
        input9.click();
        browser.keys(['Control', 'a', 'Control', '0']);

        input6.click();
        browser.keys(['Control', 'a', 'Control', '50']);
        input7.click();
        browser.keys(['Control', 'a', 'Control', '75']);
        input8.click();
        browser.keys(['Control', 'a', 'Control', '0']);
        input9.click();
        browser.keys(['Control', 'a', 'Control', '25']);

        input6.click();
        browser.keys(['Control', 'a', 'Control', '75']);
        input7.click();
        browser.keys(['Control', 'a', 'Control', '0']);
        input8.click();
        browser.keys(['Control', 'a', 'Control', '25']);
        input9.click();
        browser.keys(['Control', 'a', 'Control', '50']);

        input6.click();
        browser.keys(['Control', 'a', 'Control', '0']);
        input7.click();
        browser.keys(['Control', 'a', 'Control', '25']);
        input8.click();
        browser.keys(['Control', 'a', 'Control', '50']);
        input9.click();
        browser.keys(['Control', 'a', 'Control', '75']);
    });

    it('should correctly change the CSS `rangeSmallAndZero` classes', () => {
        // Ditto
        const input10 = $(selectors.issue416Input10);
        const input11 = $(selectors.issue416Input11);
        const input12 = $(selectors.issue416Input12);

        // One cycle
        input10.click();
        browser.keys(['Control', 'a', 'Control', '0']);
        input11.click();
        browser.keys(['Control', 'a', 'Control', '1']);
        input12.click();
        browser.keys(['Control', 'a', 'Control', '-1']);

        input10.click();
        browser.keys(['Control', 'a', 'Control', '1']);
        input11.click();
        browser.keys(['Control', 'a', 'Control', '-1']);
        input12.click();
        browser.keys(['Control', 'a', 'Control', '0']);

        input10.click();
        browser.keys(['Control', 'a', 'Control', '-1']);
        input11.click();
        browser.keys(['Control', 'a', 'Control', '0']);
        input12.click();
        browser.keys(['Control', 'a', 'Control', '1']);
    });
});

describe('Options updates', () => {
    it('should test for default values', () => {
        browser.url(testUrl);

        expect($(selectors.optionUpdate1).getValue()).toEqual('2.222,22 €');
        expect($(selectors.optionUpdate2).getValue()).toEqual('4.444,66 €');
        expect($(selectors.optionUpdate3).getValue()).toEqual('$8,888.00');
    });

    xit('should update the `decimalCharacterAlternative` option (cf. issue #432)', () => {
        const input1 = $(selectors.optionUpdate1);
        input1.click();
        browser.keys(['End', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'Delete']);
        expect(input1.getValue()).toEqual('222.222 €');
        browser.keys([',']);
        expect(input1.getValue()).toEqual('2.222,22 €');
        browser.keys(['Backspace']);
        expect(input1.getValue()).toEqual('222.222 €');
        browser.keys(['.']);
        expect(input1.getValue()).toEqual('2.222,22 €');


        const input2 = $(selectors.optionUpdate2);
        input2.click();
        browser.keys(['End', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'Delete']);
        expect(input2.getValue()).toEqual('444.466 €');
        browser.keys([',']);
        expect(input2.getValue()).toEqual('4.444,66 €');
        browser.keys(['Backspace']);
        expect(input2.getValue()).toEqual('444.466 €');
        browser.keys(['*']);
        expect(input2.getValue()).toEqual('4.444,66 €');
        browser.keys(['Backspace']);
        expect(input2.getValue()).toEqual('444.466 €');

        // Update the option
        const anElementVersion = browser.execute(domId => {
            const input = document.querySelector(domId);
            const anElement = AutoNumeric.getAutoNumericElement(input);
            anElement.options.decimalCharacterAlternative('#');
            return anElement.rawValue;
        }, selectors.optionUpdate2);
        expect(anElementVersion).toEqual('444466');
        browser.keys(['*']); // Ignored
        expect(input2.getValue()).toEqual('444.466 €');
        browser.keys(['#']);
        expect(input2.getValue()).toEqual('4.444,66 €'); //FIXME This fails under Firefox 56


        const input3 = $(selectors.optionUpdate3);
        input3.click();
        browser.keys(['End', 'ArrowLeft', 'ArrowLeft', 'Delete']);
        expect(input3.getValue()).toEqual('$888,800');
        browser.keys(['.']);
        expect(input3.getValue()).toEqual('$8,888.00');
        browser.keys(['Backspace']);
        expect(input3.getValue()).toEqual('$888,800');
        browser.keys([',']); // Ignored
        expect(input3.getValue()).toEqual('$888,800'); //FIXME This should work (issue #432)
    });
});

describe('`decimalPlacesShownOnFocus` and selections', () => {
    it('should test for default values', () => {
        browser.url(testUrl);

        expect($(selectors.selection1).getValue()).toEqual('12.266,123\u202f€');
    });

    it('should select the decimals correctly regarding the `decimalPlacesShownOnFocus` option', () => {
        const input1 = $(selectors.selection1);

        // Focus on the input
        input1.click();

        // Check the text selection in the first input
        const inputCaretPosition = browser.execute(domId => {
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
    it('should test for default values', () => {
        browser.url(testUrl);

        expect($(selectors.showOnlyNumbersOnFocusInput1).getValue()).toEqual('-246.813,58\u202f€ loan');
        expect($(selectors.showOnlyNumbersOnFocusInput2).getValue()).toEqual('$-246,813.58 interest');
    });

    it('should show the unformatted value on focus', () => {
        const input1 = $(selectors.showOnlyNumbersOnFocusInput1);
        const input2 = $(selectors.showOnlyNumbersOnFocusInput2);

        // Focus on the first input
        input1.click();
        expect(input1.getValue()).toEqual('-246813,58');
        expect(input2.getValue()).toEqual('$-246,813.58 interest');

        // Blur the first input, and focus on the second
        input2.click();
        expect(input1.getValue()).toEqual('-246.813,58\u202f€ loan');
        expect(input2.getValue()).toEqual('-246813.58');
    });
});

describe('`caretPositionOnFocus` option', () => {
    it('should test for default values', () => {
        browser.url(testUrl);

        expect($(selectors.selectOnFocus1).getValue()).toEqual('-jk246.813,58');
        expect($(selectors.selectOnFocus2).getValue()).toEqual('-jk246.813,58');
        expect($(selectors.selectOnFocus3).getValue()).toEqual('jk-246.813,58');
        expect($(selectors.selectOnFocus4).getValue()).toEqual('jk246.813,58-');
        expect($(selectors.selectOnFocus5).getValue()).toEqual('-jk246.813,58');

        expect($(selectors.selectOnFocus6).getValue()).toEqual('-jk246.813,58');
        expect($(selectors.selectOnFocus7).getValue()).toEqual('-jk246.813,58');
        expect($(selectors.selectOnFocus8).getValue()).toEqual('jk-246.813,58');
        expect($(selectors.selectOnFocus9).getValue()).toEqual('jk246.813,58-');
        expect($(selectors.selectOnFocus10).getValue()).toEqual('-jk246.813,58');

        expect($(selectors.selectOnFocus11).getValue()).toEqual('-jk246.813,58');
        expect($(selectors.selectOnFocus12).getValue()).toEqual('-jk246.813,58');
        expect($(selectors.selectOnFocus13).getValue()).toEqual('jk-246.813,58');
        expect($(selectors.selectOnFocus14).getValue()).toEqual('jk246.813,58-');
        expect($(selectors.selectOnFocus15).getValue()).toEqual('-jk246.813,58');

        expect($(selectors.selectOnFocus16).getValue()).toEqual('-jk246.813,58');
        expect($(selectors.selectOnFocus17).getValue()).toEqual('-jk246.813,58');
        expect($(selectors.selectOnFocus18).getValue()).toEqual('jk-246.813,58');
        expect($(selectors.selectOnFocus19).getValue()).toEqual('jk246.813,58-');
        expect($(selectors.selectOnFocus20).getValue()).toEqual('-jk246.813,58');


        expect($(selectors.selectOnFocus21).getValue()).toEqual('-246.813,58jk');
        expect($(selectors.selectOnFocus22).getValue()).toEqual('246.813,58-jk');
        expect($(selectors.selectOnFocus23).getValue()).toEqual('246.813,58jk-');
        expect($(selectors.selectOnFocus24).getValue()).toEqual('246.813,58jk-');
        expect($(selectors.selectOnFocus25).getValue()).toEqual('-246.813,58jk');

        expect($(selectors.selectOnFocus26).getValue()).toEqual('-246.813,58jk');
        expect($(selectors.selectOnFocus27).getValue()).toEqual('246.813,58-jk');
        expect($(selectors.selectOnFocus28).getValue()).toEqual('246.813,58jk-');
        expect($(selectors.selectOnFocus29).getValue()).toEqual('246.813,58jk-');
        expect($(selectors.selectOnFocus30).getValue()).toEqual('-246.813,58jk');

        expect($(selectors.selectOnFocus31).getValue()).toEqual('-246.813,58jk');
        expect($(selectors.selectOnFocus32).getValue()).toEqual('246.813,58-jk');
        expect($(selectors.selectOnFocus33).getValue()).toEqual('246.813,58jk-');
        expect($(selectors.selectOnFocus34).getValue()).toEqual('246.813,58jk-');
        expect($(selectors.selectOnFocus35).getValue()).toEqual('-246.813,58jk');

        expect($(selectors.selectOnFocus36).getValue()).toEqual('-246.813,58jk');
        expect($(selectors.selectOnFocus37).getValue()).toEqual('246.813,58-jk');
        expect($(selectors.selectOnFocus38).getValue()).toEqual('246.813,58jk-');
        expect($(selectors.selectOnFocus39).getValue()).toEqual('246.813,58jk-');
        expect($(selectors.selectOnFocus40).getValue()).toEqual('-246.813,58jk');
    });

    it('should position the caret correctly on focus', () => {
        let inputCaretPosition;
        const inputD = $(selectors.selectOnFocusD);

        // Focus on the input before the input series
        inputD.click();

        // Serie 1
        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus1);
        expect(inputCaretPosition).toEqual(3);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus2);
        expect(inputCaretPosition).toEqual(3);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus3);
        expect(inputCaretPosition).toEqual(3);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus4);
        expect(inputCaretPosition).toEqual(2);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus5);
        expect(inputCaretPosition).toEqual(3);

        // Serie 2
        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus6);
        expect(inputCaretPosition).toEqual(13);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus7);
        expect(inputCaretPosition).toEqual(13);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus8);
        expect(inputCaretPosition).toEqual(13);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus9);
        expect(inputCaretPosition).toEqual(12);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus10);
        expect(inputCaretPosition).toEqual(13);

        // Serie 3
        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus11);
        expect(inputCaretPosition).toEqual(10);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus12);
        expect(inputCaretPosition).toEqual(10);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus13);
        expect(inputCaretPosition).toEqual(10);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus14);
        expect(inputCaretPosition).toEqual(9);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus15);
        expect(inputCaretPosition).toEqual(10);

        // Serie 4
        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus16);
        expect(inputCaretPosition).toEqual(11);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus17);
        expect(inputCaretPosition).toEqual(11);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus18);
        expect(inputCaretPosition).toEqual(11);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus19);
        expect(inputCaretPosition).toEqual(10);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus20);
        expect(inputCaretPosition).toEqual(11);

        // Serie 5
        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus21);
        expect(inputCaretPosition).toEqual(1);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus22);
        expect(inputCaretPosition).toEqual(0);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus23);
        expect(inputCaretPosition).toEqual(0);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus24);
        expect(inputCaretPosition).toEqual(0);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus25);
        expect(inputCaretPosition).toEqual(1);

        // Serie 6
        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus26);
        expect(inputCaretPosition).toEqual(11);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus27);
        expect(inputCaretPosition).toEqual(10);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus28);
        expect(inputCaretPosition).toEqual(10);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus29);
        expect(inputCaretPosition).toEqual(10);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus30);
        expect(inputCaretPosition).toEqual(11);

        // Serie 7
        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus31);
        expect(inputCaretPosition).toEqual(8);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus32);
        expect(inputCaretPosition).toEqual(7);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus33);
        expect(inputCaretPosition).toEqual(7);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus34);
        expect(inputCaretPosition).toEqual(7);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus35);
        expect(inputCaretPosition).toEqual(8);

        // Serie 8
        // Focus on the input and check the caret position -246.813,58jk
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus36);
        expect(inputCaretPosition).toEqual(9);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus37);
        expect(inputCaretPosition).toEqual(8);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus38);
        expect(inputCaretPosition).toEqual(8);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus39);
        expect(inputCaretPosition).toEqual(8);

        // Focus on the input and check the caret position
        browser.keys('Tab');
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.selectOnFocus40);
        expect(inputCaretPosition).toEqual(9);
    });
});

describe('`unformatOnSubmit` option', () => {
    it('should test for default values', () => {
        browser.url(testUrl);

        expect($(selectors.issue442One).getValue()).toEqual('12.345,67\u202f€');
        expect($(selectors.issue442Two).getValue()).toEqual('1.111.222,21\u202f€');
        expect($(selectors.issue442Three).getValue()).toEqual('22.432.392,23\u202f€');
        expect($(selectors.issue442Four).getValue()).toEqual('0,00\u202f€');
    });

    it('should unformat on submit only the elements that activated the `unformatOnSubmit` option', () => {
        const submitButton = $(selectors.issue442Submit);

        submitButton.click(); // Submit the form by clicking on the submit button
        expect($(selectors.issue442One).getValue()).toEqual('12345.67');
        expect($(selectors.issue442Two).getValue()).toEqual('1.111.222,21\u202f€');
        expect($(selectors.issue442Three).getValue()).toEqual('22432392.23');
        expect($(selectors.issue442Four).getValue()).toEqual('0,00\u202f€');
    });
});

describe('`emptyInputBehavior` option', () => {
    it('should test for default values', () => {
        browser.url(testUrl);

        expect($(selectors.issue447).getValue()).toEqual('');
    });

    it('should detect a `null` value after using `set()`', () => {
        expect($(selectors.result447).getText()).toEqual('Input value is null');
    });

    it('should change the `rawValue` to `null` when emptied', () => {
        const issue447 = $(selectors.issue447);

        issue447.click(); // Focus on the input element
        expect(issue447.getValue()).toEqual('');
        browser.keys('1234');
        expect(issue447.getValue()).toEqual('1,234');
        browser.keys('End');
        browser.keys('Backspace');
        expect(issue447.getValue()).toEqual('123');
        browser.keys('Backspace');
        expect(issue447.getValue()).toEqual('12');
        browser.keys('Backspace');
        expect(issue447.getValue()).toEqual('1');
        browser.keys('Backspace');
        expect(issue447.getValue()).toEqual('');

        // Then we test if the rawValue is correctly set to `null`
        const result = browser.execute(domId => {
            const input = document.querySelector(domId);
            const an = AutoNumeric.getAutoNumericElement(input);
            return an.getNumber();
        }, selectors.issue447);
        expect(result).toBeNull();
    });

    //TODO Test that no error are produced when hovering the input
});

describe('`rawValueDivisor` option', () => {
    it('should test for default values', () => {
        browser.url(testUrl);

        expect($(selectors.issue452).getValue()).toEqual('');
        expect($(selectors.result452).getText()).toEqual('Testing the raw value');
    });

    it('should update the raw value when divided by a `rawValueDivisor`, and the value is modified manually', () => {
        const input = $(selectors.issue452);
        const result = $(selectors.result452);

        // Test entering a number manually, and getting the divided raw value
        input.click(); // Focus on the input element
        expect(input.getValue()).toEqual('');
        browser.keys('1234');
        expect(input.getValue()).toEqual('1,234');
        expect(result.getText()).toEqual('12.34');

        // Test the rawValue directly
        const resultNum = browser.execute(domId => {
            const input = document.querySelector(domId);
            const an    = AutoNumeric.getAutoNumericElement(input);
            return an.getNumericString();
        }, selectors.issue452);
        expect(resultNum).toEqual('12.34');

        browser.keys('567.8');
        expect(input.getValue()).toEqual('1,234,567.8');
        expect(result.getText()).toEqual('12345.678');
    });

    it('should keep the correct raw value (divided by `rawValueDivisor`) when the element is unfocused', () => {
        // Focus out of that input and check that the formatted and raw value are still ok
        $(selectors.issue452Unfocus).click(); // First we change the focus to another element, then try to `set()` a value.
        expect($(selectors.issue452).getValue()).toEqual('1,234,567.80');
        expect($(selectors.result452).getText()).toEqual('12345.678');
    });

    it('should update the raw value when divided by a `rawValueDivisor`, and the value is modified via a script, while the element is unfocused', () => {
        // Modify the element value while it does not have the focus
        const result = browser.execute(domId => {
            const input = document.querySelector(domId);
            const an = AutoNumeric.getAutoNumericElement(input);
            an.update(AutoNumeric.getPredefinedOptions().percentageEU3dec);
            an.set(0.0221456); // This makes sure that if the element is currently unfocused, and an external script modify its value with `set`, the `rawValueDivisor` option is not used. This should only be used when the user is actually inputting numbers manually.
            return an.getNumericString();
        }, selectors.issue452);
        expect(result).toEqual('0.02215');
        expect($(selectors.issue452).getValue()).toEqual('2,215\u202f%');
        // browser.keys('Esc', 'Esc');
        // browser.keys('Backspace');
    });

    it('should update the raw value when divided by a `rawValueDivisor`, and the value is modified via a script, while the element is focused', () => {
        // Modify the element value while it has the focus
        $(selectors.issue452).click(); // Focus on the input element
        const result = browser.execute(domId => {
            const input = document.querySelector(domId);
            const an = AutoNumeric.getAutoNumericElement(input);
            an.set(0.07621327); // This makes sure that if the element is currently focused in, and an external script modify its value with `set`, the `rawValueDivisor` option is not used. This should only be used when the user is actually inputting numbers manually.
            return an.getNumericString();
        }, selectors.issue452);
        expect(result).toEqual('0.07621');
        expect($(selectors.issue452).getValue()).toEqual('7,621\u202f%');
    });

    it('should update on load the formatted and raw value when divided by a `rawValueDivisor`', () => {
        expect($(selectors.issue452Formatted).getValue()).toEqual('12,35\u202f%');
        const result = browser.execute(domId => {
            const input = document.querySelector(domId);
            const an = AutoNumeric.getAutoNumericElement(input);
            return an.getNumericString();
        }, selectors.issue452Formatted);
        expect(result).toEqual('0.1235');
    });
});

describe('`negativeSignCharacter` option', () => {
    it('should test for default values', () => {
        browser.url(testUrl);

        expect($(selectors.issue478Neg1).getValue()).toEqual('-0.20');
        expect($(selectors.issue478Neg2).getValue()).toEqual('≂12.00');
        expect($(selectors.issue478Neg3).getValue()).toEqual('(200.00)');
        expect($(selectors.issue478Pos1).getValue()).toEqual('z14.00');
        expect($(selectors.issue478Pos2).getValue()).toEqual('-0.42');
        expect($(selectors.issue478NegPos).getValue()).toEqual('∸1,234.78');

        expect($(selectors.issue478RightPlacementNeg1).getValue()).toEqual('0.20');
        expect($(selectors.issue478RightPlacementNeg2).getValue()).toEqual('12.00');
        expect($(selectors.issue478RightPlacementNeg3).getValue()).toEqual('200.00');
        expect($(selectors.issue478RightPlacementPos1).getValue()).toEqual('14.00p');
        expect($(selectors.issue478RightPlacementPos2).getValue()).toEqual('0.42⧺');
        expect($(selectors.issue478RightPlacementNegPos).getValue()).toEqual('1,234.78⧻');

        expect($(selectors.issue478Neg4).getValue()).toEqual('(468.31)');
    });

    it('should display the correct negative/positive value on focus, when the positive and negative signs are customized', () => {
        $(selectors.issue478Neg1).click(); // Focus on the input element
        expect($(selectors.issue478Neg1).getValue()).toEqual('-0.20');
        browser.keys('Tab');
        expect($(selectors.issue478Neg2).getValue()).toEqual('≂12.00');
        browser.keys('Tab');
        expect($(selectors.issue478Neg3).getValue()).toEqual('-200.00');
        browser.keys('Tab');
        expect($(selectors.issue478Pos1).getValue()).toEqual('z14.00');
        browser.keys('Tab');
        expect($(selectors.issue478Pos2).getValue()).toEqual('-0.42');
        browser.keys('Tab');
        expect($(selectors.issue478NegPos).getValue()).toEqual('∸1,234.78');
        browser.keys('Tab');

        expect($(selectors.issue478RightPlacementNeg1).getValue()).toEqual('0.20');
        browser.keys('Tab');
        expect($(selectors.issue478RightPlacementNeg2).getValue()).toEqual('12.00');
        browser.keys('Tab');
        expect($(selectors.issue478RightPlacementNeg3).getValue()).toEqual('200.00');
        browser.keys('Tab');
        expect($(selectors.issue478RightPlacementPos1).getValue()).toEqual('14.00p');
        browser.keys('Tab');
        expect($(selectors.issue478RightPlacementPos2).getValue()).toEqual('0.42⧺');
        browser.keys('Tab');
        expect($(selectors.issue478RightPlacementNegPos).getValue()).toEqual('1,234.78⧻');
        browser.keys('Tab');

        expect($(selectors.issue478Neg4).getValue()).toEqual('∸468.31');
    });

    it('should display the correct negative/positive value on blur, when the positive and negative signs are customized', () => {
        $(selectors.issue478RightPlacementNegPos).click();
        expect($(selectors.issue478Neg1).getValue()).toEqual('-0.20');
        $(selectors.issue478Neg1).click();
        expect($(selectors.issue478Neg1).getValue()).toEqual('-0.20');
        browser.keys('Tab');
        expect($(selectors.issue478Neg1).getValue()).toEqual('-0.20');
        browser.keys('Tab');
        expect($(selectors.issue478Neg2).getValue()).toEqual('≂12.00');
        browser.keys('Tab');
        expect($(selectors.issue478Neg3).getValue()).toEqual('(200.00)');
        browser.keys('Tab');
        expect($(selectors.issue478Pos1).getValue()).toEqual('z14.00');
        browser.keys('Tab');
        expect($(selectors.issue478Pos2).getValue()).toEqual('-0.42');
        browser.keys('Tab');
        expect($(selectors.issue478NegPos).getValue()).toEqual('∸1,234.78');
        browser.keys('Tab');

        expect($(selectors.issue478RightPlacementNeg1).getValue()).toEqual('0.20');
        browser.keys('Tab');
        expect($(selectors.issue478RightPlacementNeg2).getValue()).toEqual('12.00');
        browser.keys('Tab');
        expect($(selectors.issue478RightPlacementNeg3).getValue()).toEqual('200.00');
        browser.keys('Tab');
        expect($(selectors.issue478RightPlacementPos1).getValue()).toEqual('14.00p');
        browser.keys('Tab');
        expect($(selectors.issue478RightPlacementPos2).getValue()).toEqual('0.42⧺');
        browser.keys('Tab');
        expect($(selectors.issue478RightPlacementNegPos).getValue()).toEqual('1,234.78⧻');
        browser.keys('Tab');

        expect($(selectors.issue478Neg4).getValue()).toEqual('(468.31)');
    });

    it('should allow modifying the negative/positive state using the hyphen key, when the negative sign is the hyphen character', () => {
        $(selectors.issue478Neg1).click(); // Focus on the input element
        expect($(selectors.issue478Neg1).getValue()).toEqual('-0.20');
        browser.keys(['End', '-']);
        expect($(selectors.issue478Neg1).getValue()).toEqual('0.20');
        browser.keys('-');
        expect($(selectors.issue478Neg1).getValue()).toEqual('-0.20');
        browser.keys(['Home', '-']);
        expect($(selectors.issue478Neg1).getValue()).toEqual('0.20');
        browser.keys('-');
        expect($(selectors.issue478Neg1).getValue()).toEqual('-0.20');

        // Test the rawValue directly
        const result = browser.execute(domId => {
            const input = document.querySelector(domId);
            const an    = AutoNumeric.getAutoNumericElement(input);
            return an.getNumericString();
        }, selectors.issue478Neg1);
        expect(result).toEqual('-0.2');

        browser.keys(['Home', '234']);
        expect($(selectors.issue478Neg1).getValue()).toEqual('-2,340.20');
    });

    //FIXME Test the localized value when using a custom negative sign and `outputFormat.dotNegative`, `outputFormat.commaNegative` and `outputFormat.number`
    //FIXME Test the rounded value when rounding a positive and negative value with `roundingMethod.halfUpAsymmetric`, `roundingMethod.halfDownAsymmetric`, `roundingMethod.toCeilingTowardPositiveInfinity` and `roundingMethod.toFloorTowardNegativeInfinity`

    it('should allow modifying the negative/positive state using the hyphen key if a custom negative sign is used', () => {
        $(selectors.issue478Neg2).click(); // Focus on the input element
        expect($(selectors.issue478Neg2).getValue()).toEqual('≂12.00');
        browser.keys(['Home', '-']); // Check that when entering '-' while the caret is on the far left of the negative number (with a custom negative sign), the whole value is replaced by '-', while it should just toggle the negative/positive state
        expect($(selectors.issue478Neg2).getValue()).toEqual('12.00');
        browser.keys('-');
        expect($(selectors.issue478Neg2).getValue()).toEqual('≂12.00');
        browser.keys('≂');
        expect($(selectors.issue478Neg2).getValue()).toEqual('≂12.00');
        browser.keys('-');
        expect($(selectors.issue478Neg2).getValue()).toEqual('12.00');
        browser.keys('≂');
        expect($(selectors.issue478Neg2).getValue()).toEqual('12.00');
        browser.keys('-');
        expect($(selectors.issue478Neg2).getValue()).toEqual('≂12.00');

        // Test the rawValue directly
        const result = browser.execute(domId => {
            const input = document.querySelector(domId);
            const an    = AutoNumeric.getAutoNumericElement(input);
            return an.getNumericString();
        }, selectors.issue478Neg2);
        expect(result).toEqual('-12');

        // Having the caret on the far left and entering a number should automatically set that number at the right position
        browser.keys(['Home', '7']);
        expect($(selectors.issue478Neg2).getValue()).toEqual('≂712.00');
        // Check the text selection
        const inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue478Neg2);
        expect(inputCaretPosition.start).toEqual(2);
        expect(inputCaretPosition.end).toEqual(2);

        // Continue adding numbers
        browser.keys('34');
        expect($(selectors.issue478Neg2).getValue()).toEqual('≂73,412.00');
        browser.keys(['End', '-']);
        expect($(selectors.issue478Neg2).getValue()).toEqual('73,412.00');
        browser.keys('-');
        expect($(selectors.issue478Neg2).getValue()).toEqual('≂73,412.00');
    });

    it('should not allow modifying the negative/positive state using the custom negative sign', () => {
        $(selectors.issue478Pos1).click(); // Focus on the input element
        expect($(selectors.issue478Pos1).getValue()).toEqual('z14.00');
        browser.keys(['End', '-']);
        expect($(selectors.issue478Pos1).getValue()).toEqual('+14.00');
        browser.keys('-');
        expect($(selectors.issue478Pos1).getValue()).toEqual('z14.00');
        browser.keys(['Home', '-']);
        expect($(selectors.issue478Pos1).getValue()).toEqual('+14.00');
        browser.keys('-');
        expect($(selectors.issue478Pos1).getValue()).toEqual('z14.00');
        browser.keys('z'); // This should have no effect on the negative/positive sign
        expect($(selectors.issue478Pos1).getValue()).toEqual('z14.00');

        // Test the rawValue directly
        const result = browser.execute(domId => {
            const input = document.querySelector(domId);
            const an    = AutoNumeric.getAutoNumericElement(input);
            return an.getNumericString();
        }, selectors.issue478Pos1);
        expect(result).toEqual('-14');

        browser.keys(['Home', '234']);
        expect($(selectors.issue478Pos1).getValue()).toEqual('z23,414.00');
    });

    it('should allow setting the positive state using the `+` character, while a custom positive sign is defined', () => {
        $(selectors.issue478RightPlacementPos1).click(); // Focus on the input element
        expect($(selectors.issue478RightPlacementPos1).getValue()).toEqual('14.00p');
        browser.keys(['Home', '+']);
        expect($(selectors.issue478RightPlacementPos1).getValue()).toEqual('14.00-'); //FIXME Fails on Chrome only; there is a bug in the selenium chromedriver
        browser.keys(['Home', '+']);
        expect($(selectors.issue478RightPlacementPos1).getValue()).toEqual('14.00p');
        browser.keys('+');
        expect($(selectors.issue478RightPlacementPos1).getValue()).toEqual('14.00-');

        // Check that the caret position is at the correct position
        const inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue478RightPlacementPos1);
        expect(inputCaretPosition.start).toEqual(0);
        expect(inputCaretPosition.end).toEqual(0);

        browser.keys(['End', '+']); // Check that if the caret is after the positive sign, you can still modify the positive/negative state
        expect($(selectors.issue478RightPlacementPos1).getValue()).toEqual('14.00p'); // Fixed in issue #481
        browser.keys('+');
        expect($(selectors.issue478RightPlacementPos1).getValue()).toEqual('14.00-');
        browser.keys('p'); // This should have no effect on the negative/positive sign
        expect($(selectors.issue478RightPlacementPos1).getValue()).toEqual('14.00-');
        browser.keys('+');
        expect($(selectors.issue478RightPlacementPos1).getValue()).toEqual('14.00p');

        // Test the rawValue directly
        const result = browser.execute(domId => {
            const input = document.querySelector(domId);
            const an    = AutoNumeric.getAutoNumericElement(input);
            return an.getNumericString();
        }, selectors.issue478RightPlacementPos1);
        expect(result).toEqual('14');

        browser.keys(['Home', '234']);
        expect($(selectors.issue478RightPlacementPos1).getValue()).toEqual('23,414.00p');
    });

    it('should toggle the negative state and set the caret at the correct position when using custom negative and positive trailing signs', () => {
        // issue_478_RightPlacement_negPos
        $(selectors.issue478RightPlacementNegPos).click(); // Focus on the input element
        expect($(selectors.issue478RightPlacementNegPos).getValue()).toEqual('1,234.78⧻');
        browser.keys(['End', '-']);
        expect($(selectors.issue478RightPlacementNegPos).getValue()).toEqual('1,234.78∸');
        // Check that the caret position is at the correct position
        let inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue478RightPlacementNegPos);
        expect(inputCaretPosition.start).toEqual(8);
        expect(inputCaretPosition.end).toEqual(8);

        browser.keys('-');
        expect($(selectors.issue478RightPlacementNegPos).getValue()).toEqual('1,234.78⧻');
        // Check that the caret position is at the correct position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue478RightPlacementNegPos);
        expect(inputCaretPosition.start).toEqual(8);
        expect(inputCaretPosition.end).toEqual(8);

        browser.keys(['End', '+']);
        expect($(selectors.issue478RightPlacementNegPos).getValue()).toEqual('1,234.78∸'); //FIXME Fails on Chrome only; there is a bug in the selenium chromedriver
        // Check that the caret position is at the correct position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue478RightPlacementNegPos);
        expect(inputCaretPosition.start).toEqual(8);
        expect(inputCaretPosition.end).toEqual(8);

        browser.keys('+');
        expect($(selectors.issue478RightPlacementNegPos).getValue()).toEqual('1,234.78⧻');
        // Check that the caret position is at the correct position
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue478RightPlacementNegPos);
        expect(inputCaretPosition.start).toEqual(8);
        expect(inputCaretPosition.end).toEqual(8);
    });

    it('should not allow setting the positive state using the custom positive sign', () => {
        $(selectors.issue478RightPlacementPos1).click(); // Focus on the input element
        expect($(selectors.issue478RightPlacementPos1).getValue()).toEqual('23,414.00p'); //FIXME Fails on Chrome only; there is a bug in the selenium chromedriver
        browser.keys(['Home', '+']);
        expect($(selectors.issue478RightPlacementPos1).getValue()).toEqual('23,414.00-');
        browser.keys('+');
        expect($(selectors.issue478RightPlacementPos1).getValue()).toEqual('23,414.00p');
        browser.keys('p'); // This should have no effect on the negative/positive sign
        expect($(selectors.issue478RightPlacementPos1).getValue()).toEqual('23,414.00p');
        browser.keys('+');
        expect($(selectors.issue478RightPlacementPos1).getValue()).toEqual('23,414.00-');
    });

    it('should display the brackets when `negativeBracketsTypeOnBlur`, `negativeSignCharacter` and `positiveSignCharacter` are set, on focus and blur', () => {
        const issue478Neg4 = $(selectors.issue478Neg4);

        expect(issue478Neg4.getValue()).toEqual('(468.31)');
        issue478Neg4.click();
        // When removing the brackets, the custom negative sign must be shown
        expect(issue478Neg4.getValue()).toEqual('∸468.31');
        $(selectors.issue478Neg1).click();
        expect(issue478Neg4.getValue()).toEqual('(468.31)');
    });

    it('should allow pasting values with custom positive and negative signs', () => {
        // First, paste a positive value
        const inputClassic = $(selectors.inputClassic);
        inputClassic.click();
        // Clear the input content
        browser.keys(['Control', 'a', 'Control', 'Backspace']);
        browser.keys('⧺67890.42');

        // Copy
        browser.keys(['Control', 'a', 'c', 'Control']);

        // Paste
        $(selectors.issue478Pos2).click();
        browser.keys(['Control', 'a', 'v', 'Control']);
        expect($(selectors.issue478Pos2).getValue()).toEqual('⧺67,890.42');


        // Then paste a negative value
        inputClassic.click();
        // Clear the input content
        browser.keys(['Control', 'a', 'Control', 'Backspace']);
        browser.keys('∸234,220.08');

        // Copy
        browser.keys(['Control', 'a', 'c', 'Control']);

        // Paste
        $(selectors.issue478NegPos).click();
        browser.keys(['Control', 'a', 'v', 'Control']);
        expect($(selectors.issue478NegPos).getValue()).toEqual('∸234,220.08');
    });

    it('should allow pasting the exact same value without setting the final result to zero (Issue #483)', () => {
        // First, paste a positive value
        const inputClassic = $(selectors.inputClassic);
        inputClassic.click();
        // Clear the input content
        browser.keys(['Control', 'a', 'Control', 'Backspace']);
        browser.keys('⧺111222.33');

        // Copy
        browser.keys(['Control', 'a', 'c', 'Control']);

        $(selectors.issue478Pos2).click();
        // Paste number 1
        browser.keys(['Control', 'a', 'v', 'Control']);
        expect($(selectors.issue478Pos2).getValue()).toEqual('⧺111,222.33');
        // Paste number 2 ; this should not change the result
        browser.keys(['Control', 'a', 'v', 'Control']);
        expect($(selectors.issue478Pos2).getValue()).toEqual('⧺111,222.33');
    });

    xit('should allow using the wheel to modify the input value when both the positive and negative signs are customized', () => { //FIXME Finish this -->
        expect($(selectors.issue478RightPlacementPos1).getValue()).toEqual('23,414.00-');
        browser.moveTo(selectors.issue478RightPlacementPos1); // Move the mouse over the element //TODO Test the webdriver.io v5 moveToObject change to `moveTo` function
        browser.scrollIntoView(0, 250); //FIXME This is not the right function to call here
        expect($(selectors.issue478RightPlacementPos1).getValue()).toEqual('23,914.00-');
    });

    xit('should correctly modify the value when using the mouse wheel event on an element where `negativeBracketsTypeOnBlur` and `negativeSignCharacter` are set, when the value is changed once, then blurred, then changed again with the mouse wheel while it\'s negative', () => { //FIXME Finish this -->
        //
    });

    xit('should correctly display the negative value with the custom negative sign on mouseover (without adding the default minus sign)', () => { //FIXME Finish this -->
        expect($(selectors.issue478Neg3).getValue()).toEqual('(200.00)');
        browser.moveTo(selectors.issue478Neg3); // Move the mouse over the element //FIXME This does not work //TODO Test the webdriver.io v5 moveToObject change to `moveTo` function
        expect($(selectors.issue478Neg3).getValue()).toEqual('-200.00');
    });
});

describe('Pasting', () => {
    it('should test for default values', () => {
        browser.url(testUrl);

        expect($(selectors.issue387inputCancellable).getValue()).toEqual('$220,242.76');
    });

    it('should not be possible to paste any invalid numbers in an element if the whole content is not already selected', () => {
        const inputClassic = $(selectors.inputClassic);
        const issue387inputCancellable = $(selectors.issue387inputCancellable);

        inputClassic.click();
        // Clear the input content
        browser.keys(['Control', 'a', 'Control', 'Backspace']);
        browser.keys('foobar');
        expect(inputClassic.getValue()).toEqual('foobar');

        // Copy
        browser.keys(['Control', 'a', 'c', 'Control']);

        // Paste
        issue387inputCancellable.click();
        browser.keys(['Home', 'ArrowRight', 'ArrowRight', 'ArrowRight']);
        browser.keys(['Control', 'v', 'Control']);
        expect(issue387inputCancellable.getValue()).toEqual('$220,242.76');
    });

    it('should not be possible to paste any invalid numbers in an element if the whole content is already selected', () => {
        const inputClassic = $(selectors.inputClassic);
        const issue387inputCancellable = $(selectors.issue387inputCancellable);

        inputClassic.click();
        // Clear the input content
        browser.keys(['Control', 'a', 'Control', 'Backspace']);
        browser.keys('foobar');
        expect(inputClassic.getValue()).toEqual('foobar');

        // Copy
        browser.keys(['Control', 'a', 'c', 'Control']);

        // Paste
        issue387inputCancellable.click();
        browser.keys(['Control', 'a', 'v', 'Control']);
        expect(issue387inputCancellable.getValue()).toEqual('$220,242.76');
    });

    it('should not be possible to paste an invalid number on a selection which does not include the currency symbol', () => {
        const inputClassic = $(selectors.inputClassic);
        const issue387inputCancellable = $(selectors.issue387inputCancellable);

        inputClassic.click();
        // Clear the input content
        browser.keys(['Control', 'a', 'Control', 'Backspace']);
        browser.keys('foobar');
        expect(inputClassic.getValue()).toEqual('foobar');

        // Copy
        browser.keys(['Control', 'a', 'c', 'Control']);

        // Paste
        issue387inputCancellable.click();
        browser.keys(['Home', 'ArrowRight', 'Shift', 'ArrowRight', 'ArrowRight', 'Shift']);
        browser.keys(['Control', 'a', 'v', 'Control']);
        expect(issue387inputCancellable.getValue()).toEqual('$220,242.76');
    });

    it('should not be possible to paste an valid number in a readOnly element', () => {
        const readOnlyElement = $(selectors.readOnlyElement);
        expect(readOnlyElement.getValue()).toEqual('42.42');

        const inputClassic = $(selectors.inputClassic);
        inputClassic.click();
        // Clear the input content
        browser.keys(['Control', 'a', 'Control', 'Backspace']);
        browser.keys('12345.67');
        expect(inputClassic.getValue()).toEqual('12345.67');

        // Copy
        browser.keys(['Control', 'a', 'c', 'Control']);

        // Paste
        readOnlyElement.click();
        browser.keys(['Home', 'ArrowRight', 'Shift', 'ArrowRight', 'ArrowRight', 'Shift']);
        browser.keys(['Control', 'a', 'v', 'Control']);
        expect(readOnlyElement.getValue()).toEqual('42.42'); // No changes!
    });
});

describe('Issue #432', () => {
    it('should test for default values, and focus on it', () => {
        browser.url(testUrl);

        expect($(selectors.issue432dot).getValue()).toEqual('');
        expect($(selectors.issue432none).getValue()).toEqual('');
    });

    it('should accept the alternative decimal character', () => {
        const inputWithDecimalCharAlternative = $(selectors.issue432dot);

        inputWithDecimalCharAlternative.click();
        // With the comma: ok
        browser.keys('123,45');
        expect(inputWithDecimalCharAlternative.getValue()).toEqual('123,45 €');

        // With the dot: ok
        browser.keys(['Home', 'Control', 'a', 'Control', 'Delete']);
        browser.keys('123.45');
        expect(inputWithDecimalCharAlternative.getValue()).toEqual('123,45 €');
    });

    it('should not accept any alternative decimal character', () => {
        const inputWithoutDecimalCharAlternative = $(selectors.issue432none);

        inputWithoutDecimalCharAlternative.click();
        // With the comma: ok
        browser.keys('123,45');
        expect(inputWithoutDecimalCharAlternative.getValue()).toEqual('123,45 €');

        // With the dot: ko
        browser.keys(['Home', 'Control', 'a', 'Control', 'Delete']);
        browser.keys('123.45');
        expect(inputWithoutDecimalCharAlternative.getValue()).toEqual('12.345 €');
    });
});

describe('Issue #535', () => {
    it('should test for default values, and focus on it', () => {
        browser.url(testUrl);

        expect($(selectors.issue535).getValue()).toEqual('');
    });

    it('should not accept the decimal character or its alternative, and not change the selection', () => {
        const inputWithDecimalCharAlternative = $(selectors.issue535);

        inputWithDecimalCharAlternative.click();
        // With the default decimal character
        browser.keys('123.456');
        expect(inputWithDecimalCharAlternative.getValue()).toEqual('123456');

        // With the alternative decimal character
        browser.keys(['Home', 'Control', 'a', 'Control', 'Delete']);
        browser.keys('123,456');
        expect(inputWithDecimalCharAlternative.getValue()).toEqual('123456');
    });
});

describe('Issue #550', () => {
    it('should test for default values, and focus on it', () => {
        browser.url(testUrl);

        expect($(selectors.issue550).getValue()).toEqual('(1,357,246.81)');
    });

    it(`should not send a 'change' event when focusing then blurring the input`, () => {
        const input = $(selectors.issue550);
        input.click();
        const inputBlur = $(selectors.issue550Blur);
        inputBlur.click();
        const issue550ChangeDetector = $(selectors.issue550ChangeDetector);

        expect(issue550ChangeDetector.getValue()).toEqual('0');

        // Reset the change event counter
        $(selectors.issue550Button).click();
        expect(issue550ChangeDetector.getValue()).toEqual('0');
    });

    it(`should send a single 'change' event when modifying the value, then blurring`, () => {
        const input = $(selectors.issue550);
        const inputBlur = $(selectors.issue550Blur);
        const issue550ChangeDetector = $(selectors.issue550ChangeDetector);
        input.click();

        expect(issue550ChangeDetector.getValue()).toEqual('0');
        browser.keys(['Home', '5']);
        expect(input.getValue()).toEqual('-51,357,246.81');
        inputBlur.click();
        expect(issue550ChangeDetector.getValue()).toEqual('1');

        // Modify the input again
        input.click();
        browser.keys(['Home', '6']);
        expect(input.getValue()).toEqual('-651,357,246.81');
        inputBlur.click();
        expect(issue550ChangeDetector.getValue()).toEqual('2');
        input.click();
        browser.keys(['Home', '2']);
        expect(input.getValue()).toEqual('-2,651,357,246.81');
        inputBlur.click();
        expect(issue550ChangeDetector.getValue()).toEqual('3');

        // Reset the change event counter
        $(selectors.issue550Button).click();
        expect(issue550ChangeDetector.getValue()).toEqual('0');
    });

    it(`should send a single 'change' event when modifying the value, then hitting the enter key (and then blurring the input)`, () => {
        const input = $(selectors.issue550);
        const inputBlur = $(selectors.issue550Blur);
        const issue550ChangeDetector = $(selectors.issue550ChangeDetector);
        input.click();

        expect(issue550ChangeDetector.getValue()).toEqual('0');
        browser.keys(['Home', '1']);
        expect(input.getValue()).toEqual('-12,651,357,246.81');
        browser.keys('Enter');
        expect(issue550ChangeDetector.getValue()).toEqual('1');
        inputBlur.click();
        expect(issue550ChangeDetector.getValue()).toEqual('1');
    });
});

describe('Issue #521', () => {
    it('should test for default values, and focus on it', () => {
        browser.url(testUrl);

        expect($(selectors.issue521).getValue()).toEqual('');
        expect($(selectors.issue521Set).getValue()).toEqual('1,234.57');

        // Prepare the text to paste
        const inputClassic = $(selectors.inputClassic);
        inputClassic.click();
        expect(inputClassic.getValue()).toEqual('987654321');
        browser.keys(['Home', 'Shift', 'ArrowRight', 'ArrowRight', 'Shift']);
        browser.keys(['Control', 'c', 'Control']); // 98 in the clipboard
    });

    it(`should send an 'input' event when pasting a valid value in an empty input`, () => {
        const input = $(selectors.issue521);
        const issue521InputDetector = $(selectors.issue521InputDetector);

        input.click();
        expect(issue521InputDetector.getValue()).toEqual('0');
        browser.keys(['Control', 'v', 'Control']); // Paste
        expect(issue521InputDetector.getValue()).toEqual('1');
        expect(input.getValue()).toEqual('98.00');

        // Reset the input event counter
        $(selectors.issue521Button).click();
        expect(issue521InputDetector.getValue()).toEqual('0');
    });

    it(`should send an 'input' event when pasting a valid value at a caret position in an non-empty input`, () => {
        const input = $(selectors.issue521Set);
        const issue521InputDetector = $(selectors.issue521InputDetector);

        input.click();
        expect(issue521InputDetector.getValue()).toEqual('0');

        browser.keys(['Home', 'ArrowRight', 'ArrowRight']); // Move the caret
        browser.keys(['Control', 'v', 'Control']); // Paste
        expect(issue521InputDetector.getValue()).toEqual('1');
        expect(input.getValue()).toEqual('129,834.57');

        // Reset the change event counter
        $(selectors.issue521Button).click();
        expect(issue521InputDetector.getValue()).toEqual('0');
    });

    it(`should send an 'input' event when pasting a valid value in an non-empty input with all its content selected`, () => {
        const input = $(selectors.issue521Set);
        const issue521InputDetector = $(selectors.issue521InputDetector);

        input.click();
        expect(issue521InputDetector.getValue()).toEqual('0');

        browser.keys(['Home', 'Shift', 'End', 'Shift']); // Select all the input content
        browser.keys(['Control', 'v', 'Control']); // Paste
        expect(issue521InputDetector.getValue()).toEqual('1');
        expect(input.getValue()).toEqual('98.00');
    });
});

describe('Issue #574', () => {
    it('should test for default values, and focus on it', () => {
        browser.url(testUrl);

        expect($(selectors.issue574).getValue()).toEqual('-0.05');
    });

    it(`should send an 'input' event when pasting a valid value in an empty input`, () => {
        const input = $(selectors.issue574);
        input.click();
        browser.keys(['Home', 'ArrowRight', 'ArrowRight', '-']);
        expect(input.getValue()).toEqual('0.05');
        browser.keys(['-']);
        expect(input.getValue()).toEqual('-0.05');
    });
});

describe('Issue #559', () => {
    it('should test for default values, and focus on it', () => {
        browser.url(testUrl);

        expect($(selectors.issue559).getValue()).toEqual('12,345.68');
        expect($(selectors.issue559Default).getValue()).toEqual('');
    });

    it(`should accept a decimal character on the far left of a negative number, when the \`alwaysAllowDecimalCharacter\` option is set to \`false\``, () => {
        const input = $(selectors.issue559Default);
        input.click();
        browser.keys(['-12345']);
        browser.keys(['Home', '.']);
        expect(input.getValue()).toEqual('-0.12');
    });

    it(`should not accept a decimal character if one is already present, by default`, () => {
        const input = $(selectors.issue559Default);
        input.click();
        browser.keys(['Control', 'a', 'Control', 'Backspace', '-12345.67']);
        expect(input.getValue()).toEqual('-12,345.67');
        browser.keys(['Home', 'ArrowRight', 'ArrowRight', '.']);
        expect(input.getValue()).toEqual('-12,345.67');
    });

    it(`should accept a decimal character everywhere, when the \`alwaysAllowDecimalCharacter\` option is set to \`true\``, () => {
        const input = $(selectors.issue559);
        input.click();
        browser.keys(['Home', 'ArrowRight', 'ArrowRight', 'ArrowRight', '.']);
        expect(input.getValue()).toEqual('123.45');
        browser.keys(['End', 'ArrowLeft', '.']);
        expect(input.getValue()).toEqual('1,234.5');
        browser.keys(['Home', '.']);
        expect(input.getValue()).toEqual('0.12');

        // And with a negative number
        browser.keys(['Esc', 'Backspace', '-12345']);
        browser.keys(['Home', '.']);
        expect(input.getValue()).toEqual('-0.12');

        browser.keys(['Control', 'a', 'Control', 'Backspace', '-12345', 'Home', 'ArrowRight', '.']);
        expect(input.getValue()).toEqual('-0.12');

        // Test that entering a decimal character on another decimal character works (and moves the caret to the right)
        browser.keys(['Control', 'a', 'Control', 'Backspace', '-12345']);
        browser.keys(['Home', 'ArrowRight', 'ArrowRight', '.']);
        expect(input.getValue()).toEqual('-1.23');
        browser.keys(['ArrowLeft', '.']);
        expect(input.getValue()).toEqual('-1.23');
        browser.keys(['6']);
        expect(input.getValue()).toEqual('-1.62');
    });
});

describe('Issue #593', () => {
    it('should test for default values, and focus on it', () => {
        browser.url(testUrl);

        expect($(selectors.issue593).getValue()).toEqual('-1,00 €');
        expect($(selectors.issue593Paste).getValue()).toEqual('-1234');
    });

    it(`should correctly paste a negative value on a negative value using the French predefined option`, () => {
        // Copy the text to paste
        const inputPaste = $(selectors.issue593Paste);
        inputPaste.click();
        browser.keys(['Control', 'a', 'c', 'Control']);

        // Paste into the AutoNumeric element with the default `onInvalidPaste` option
        browser.keys(['Shift', 'Tab', 'Shift']); // Go to the other input
        browser.keys(['Control', 'v', 'Control']);
        expect($(selectors.issue593).getValue()).toEqual('-1.234,00 €');
        // Also test the caret position after the paste
        let inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue593);
        expect(inputCaretPosition.start).toEqual(6);

        // Paste into the other AutoNumeric element with the `truncate` `onInvalidPaste` option
        browser.keys(['Shift', 'Tab', 'Shift']); // Go to the other input
        browser.keys(['Control', 'v', 'Control']);
        expect($(selectors.issue593Truncate).getValue()).toEqual('-1.234,00 €');
        // Also test the caret position after the paste
        inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue593Truncate);
        expect(inputCaretPosition.start).toEqual(6);
    });

    it(`should correctly paste a negative value on a positive value using the French predefined option`, () => {
        // Copy the text to paste
        const inputPaste = $(selectors.issue593Paste);
        inputPaste.click();
        browser.keys(['Control', 'a', 'c', 'Control']);

        // Paste into the AutoNumeric element with the default `onInvalidPaste` option
        browser.keys(['Shift', 'Tab', 'Shift']); // Go to the other input
        browser.keys(['Home', '-']); // Switch to a positive number
        browser.keys(['Control', 'a', 'v', 'Control']);
        expect($(selectors.issue593).getValue()).toEqual('-1.234,00 €');
        // Also test the caret position after the paste
        /*
        let inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue593);
        expect(inputCaretPosition.start).toEqual(6);
        */ //FIXME Manually this returns the correct caret position, with selenium it fails

        // Paste into the other AutoNumeric element with the `truncate` `onInvalidPaste` option
        browser.keys(['Shift', 'Tab', 'Shift']); // Go to the other input
        browser.keys(['Home', '-']); // Switch to a positive number
        browser.keys(['Control', 'a', 'v', 'Control']);
        expect($(selectors.issue593Truncate).getValue()).toEqual('-1.234,00 €');
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
    it('should test for default values', () => {
        browser.url(testUrl);

        expect($(selectors.issue594Left).getValue()).toEqual('');
        expect($(selectors.issue594Right).getValue()).toEqual('');
    });

    it(`should display the negative sign on the left side of the currency symbol when the element is empty`, () => {
        const input = $(selectors.issue594Left);
        input.click();
        expect(input.getValue()).toEqual(' €');
        browser.keys(['-']);
        expect(input.getValue()).toEqual('- €');

        // Check the caret position
        const inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue594Left);
        expect(inputCaretPosition.start).toEqual(1);
    });

    it(`should display the negative sign on the right side of the currency symbol when the element is empty`, () => {
        const input = $(selectors.issue594Right);
        input.click();
        expect(input.getValue()).toEqual(' €');
        browser.keys(['-']);
        expect(input.getValue()).toEqual(' €-');

        // Check the caret position
        const inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return { start: input.selectionStart, end: input.selectionEnd };
        }, selectors.issue594Right);
        expect(inputCaretPosition.start).toEqual(0);
    });
});

xdescribe('Issue #542', () => {
    it('should test for default values', () => {
        browser.url(testUrl);

        expect($(selectors.issue542On).getValue()).toEqual('1,234,567.89');
        expect($(selectors.issue542Off).getValue()).toEqual('1,234,567.89');
    });

    it(`should not allow formula mode on default AutoNumeric elements`, () => {
        const input = $(selectors.issue542Off);
        input.click();
        browser.keys(['Home', '=']);
        expect(input.getValue()).toEqual('1,234,567.89');
    });

    it(`should allow formula mode on AutoNumeric elements with the \`formulaMode\` option set to \`true\``, () => {
        const input = $(selectors.issue542On);
        const issue542Off = $(selectors.issue542Off);
        input.click();


        browser.keys(['Esc', '666777.88']);
        expect(issue542Off.getValue()).toEqual('666,777.88'); //XXX Fails in Chrome, not in Firefox
        browser.keys(['Esc']);
        expect(issue542Off.getValue()).toEqual('1,234,567.89');
        browser.keys(['Esc', '666777.88', 'Enter']); // Save the rawValue
        expect(issue542Off.getValue()).toEqual('666,777.88');
        browser.keys(['Esc']);
        expect(issue542Off.getValue()).toEqual('666,777.88');
        // Start editing the value as usual
        browser.keys(['12345']);
        expect(issue542Off.getValue()).toEqual('12,345');

        // Then enter formula mode
        browser.keys(['=']);
        expect(input.getValue()).toEqual('=');
        browser.keys(['12+ 24.11']); //XXX The chromedriver bugs and does not accepts the '+' character
        expect(input.getValue()).toEqual('=12+ 24.11');
        browser.keys(['foobar']);
        expect(input.getValue()).toEqual('=12+ 24.11');
        browser.keys(['-( 2/ (12+5))']); //XXX The geckodriver bugs and does not accepts the '(' and ')' characters
        expect(input.getValue()).toEqual('=12+ 24.11-( 2/ (12+5))');

        // Cancel the formula
        browser.keys(['Esc']);
        expect(input.getValue()).toEqual('12,345.00');
        // Check that hitting `esc` a second time changes the value to the last saved one, not the one before entering the formula mode
        browser.keys(['Esc']);
        expect(input.getValue()).toEqual('666,777.88');

        // Validate the formula with Enter
        browser.keys(['=']);
        expect(input.getValue()).toEqual('=');
        browser.keys(['-10000 + 12+ 24.16-( 1044/ (12))', 'Enter']);
        expect(input.getValue()).toEqual('-10,050.84');

        // Validate the formula with Blur
        browser.keys(['=']);
        expect(input.getValue()).toEqual('=');
        browser.keys(['-60000 + 12+ 24.16-( 1044/ (12))']);
        expect(input.getValue()).toEqual('=-60000 + 12+ 24.16-( 1044/ (12))');
        issue542Off.click(); // Blur
        expect(input.getValue()).toEqual('-60,050.84');
    });

    //TODO Add the tests when using a custom `decimalCharacter`
});

describe('Issue #611', () => {
    it('should test for default values', () => {
        browser.url(testUrl);

        expect($(selectors.issue611HtmlReadOnly).getValue()).toEqual('224,466.88');
        expect($(selectors.issue611OptionReadOnly).getValue()).toEqual('11,224,466.88');
        expect($(selectors.issue611HtmlAndOptionReadOnly).getValue()).toEqual('4,466.88');
    });

    it(`should not allow entering anything in an element set read-only via its html attribute`, () => {
        const input = $(selectors.issue611HtmlReadOnly);
        input.click();
        browser.keys(['Home', '1']);
        expect(input.getValue()).toEqual('224,466.88');
    });

    xit(`should allow modifying the element value if the html read-only attribute is removed dynamically`, () => {
        const input = $(selectors.issue611HtmlReadOnly);
        input.click();
        browser.keys(['Home', '1']);
        expect(input.getValue()).toEqual('224,466.88');
        browser.execute(domId => { document.querySelector(domId).readOnly = false; }, selectors.issue611HtmlReadOnly);
        browser.keys(['Home', '1']);
        expect(input.getValue()).toEqual('1,224,466.88'); //FIXME Fails on Chrome only; there is a bug in the selenium chromedriver
    });

    it(`should still not allow modifying the element value if the html read-only attribute is removed dynamically, but the \`readOnly\` option is set to \`true\``, () => {
        const input = $(selectors.issue611HtmlAndOptionReadOnly);
        input.click();
        browser.keys(['Home', '1']);
        expect(input.getValue()).toEqual('4,466.88');
        browser.execute(domId => { document.querySelector(domId).readOnly = false; }, selectors.issue611HtmlAndOptionReadOnly);
        browser.keys(['Home', '1']);
        expect(input.getValue()).toEqual('4,466.88');
    });

    it(`should not allow entering anything in an element set read-only via the AutoNumeric \`readOnly\` option`, () => {
        const input = $(selectors.issue611OptionReadOnly);
        input.click();
        browser.keys(['Home', '1']);
        expect(input.getValue()).toEqual('11,224,466.88');
    });
});

describe('Issue #652', () => {
    it('should test for default values, and respect the `allowDecimalPadding` option set as \'floats\' on load', () => {
        browser.url(testUrl);

        expect($(selectors.issue652a).getValue()).toEqual('150');
        expect($(selectors.issue652b).getValue()).toEqual('1,234');
        expect($(selectors.issue652c).getValue()).toEqual('150');
        expect($(selectors.issue652d).getValue()).toEqual('150');
    });
});

describe('Issue #647', () => {
    it('should test for default values', () => {
        browser.url(testUrl);

        expect($(selectors.issue647a).getValue()).toEqual('a1 121.00');
        expect($(selectors.issue647b).getValue()).toEqual('121.00 a1');
    });

    it(`should enter the number at the correct caret, even when the currency in prefix position contains numbers that are entered by the user`, () => {
        const input = $(selectors.issue647a);
        input.click();
        browser.keys(['1']);
        expect(input.getValue()).toEqual('a1 1');
        browser.keys(['2']);
        expect(input.getValue()).toEqual('a1 12');
        browser.keys(['3']);
        expect(input.getValue()).toEqual('a1 123');
        browser.keys(['4']);
        expect(input.getValue()).toEqual('a1 1,234');
    });

    it(`should enter the number at the correct caret, even when the currency in suffix position contains numbers that are entered by the user`, () => {
        const input = $(selectors.issue647b);
        input.click();
        browser.keys(['1']);
        expect(input.getValue()).toEqual('1 a1');
        browser.keys(['2']);
        expect(input.getValue()).toEqual('12 a1');
        browser.keys(['3']);
        expect(input.getValue()).toEqual('123 a1');
        browser.keys(['4']);
        expect(input.getValue()).toEqual('1,234 a1');
    });
});

xdescribe('Issue #656', () => { //FIXME With Firefox and Chromium, the control key is used correctly, while with Selenium the 'Control' key is not activated correctly when used in combination with Backspace nor Delete
    it('should test for default values', () => {
        browser.url(testUrl);

        expect($(selectors.issue656a).getValue()).toEqual('12,344,321.67');
        expect($(selectors.issue656b).getValue()).toEqual('1,234,567,890.01');
    });

    it(`should delete batch of numbers using ctrl+backspace, then retain the resulting value on focusout`, () => {
        const input = $(selectors.issue656a);
        input.click();
        browser.keys(['End', 'Control', 'Backspace', 'Backspace', 'Control']);
        expect(input.getValue()).toEqual('12,344,');
        const inputB = $(selectors.issue656b);
        inputB.click();
        expect(input.getValue()).toEqual('12,344.00');
    });

    it(`should delete batch of numbers using ctrl+delete, then retain the resulting value on focusout`, () => {
        const input = $(selectors.issue656b);
        input.click();
        browser.keys(['End', 'Backspace', 'Backspace']);
        expect(input.getValue()).toEqual('1,234,567,890.');
        browser.keys(['Home', 'Control', 'Delete', 'Delete', 'Control']);
        expect(input.getValue()).toEqual('567,890.');
        const inputA = $(selectors.issue656a);
        inputA.click();
        expect(input.getValue()).toEqual('567,890.00');
    });
});

describe('Issue #675', () => {
    it('should test for default values', () => {
        browser.url(testUrl);

        expect($(selectors.issue675a).getValue()).toEqual('80,000.00');
        expect($(selectors.issue675b).getValue()).toEqual('€90,000.00');
        expect($(selectors.issue675c).getValue()).toEqual('70,000.00€');
    });

    it(`should correctly place the caret when deleting a number leads to a rawValue of zero, while the currency symbol isn't displayed`, () => {
        const input = $(selectors.issue675a);
        input.click();
        browser.keys(['Home', 'Delete']);
        expect(input.getValue()).toEqual('0,000.00');

        // Check the caret position
        const inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue675a);
        expect(inputCaretPosition).toEqual(0);
    });

    it(`should correctly place the caret when deleting a number leads to a rawValue of zero, while the currency symbol is in suffix position`, () => {
        const input = $(selectors.issue675b);
        input.click();
        browser.keys(['Home', 'Delete']);
        expect(input.getValue()).toEqual('€0,000.00');

        // Check the caret position
        const inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue675b);
        expect(inputCaretPosition).toEqual(1);
    });

    it(`should correctly place the caret when deleting a number leads to a rawValue of zero, while the currency symbol is in prefix position`, () => {
        const input = $(selectors.issue675c);
        input.click();
        browser.keys(['Home', 'Delete']);
        expect(input.getValue()).toEqual('0,000.00€');

        // Check the caret position
        const inputCaretPosition = browser.execute(domId => {
            const input = document.querySelector(domId);
            return input.selectionStart;
        }, selectors.issue675c);
        expect(inputCaretPosition).toEqual(0);
    });
});


//TODO Add some tests to make sure the correct number of `AutoNumeric.events.formatted` is sent during each keypress

describe('Issue #543', () => {
    //TODO check the events sent when typing invalid numbers (#543)
    it('should test for default values', () => {
        browser.url(testUrl);

        expect($(selectors.issue543Default).getValue()).toEqual('12.00');
        expect($(selectors.issue543Invalid).getValue()).toEqual('24.00');
        expect($(selectors.issue543Ignore).getValue()).toEqual('42.00');
        expect($(selectors.issue543InvalidCE).getText()).toEqual('24.00');
    });

    it(`should disallows entering numbers out-of-bounds when using the default \`overrideMinMaxLimits\` option`, () => {
        const input = $(selectors.issue543Default);
        input.click();
        browser.keys(['Home', 'Delete']);
        expect(input.getValue()).toEqual('12.00');
        browser.keys(['End', 'Backspace', 'Backspace', 'Backspace', 'Backspace']);
        expect(input.getValue()).toEqual('12');
        browser.keys(['Home', 'ArrowRight', '5']);
        expect(input.getValue()).toEqual('152');
        browser.keys(['Delete', 'Home', 'Delete']);
        expect(input.getValue()).toEqual('5');
        browser.keys(['Delete']);
        expect(input.getValue()).toEqual('5');
    });

    xit(`should allows entering numbers out-of-bounds when using the \`overrideMinMaxLimits\` option \`invalid\`, while setting the invalid state`, () => { //FIXME Those tests are correct and work as expected under Chromium. They fail under Firefox ESR 68.7 when trying to access the validity property (see the upstream bug declared on https://github.com/mozilla/geckodriver/issues/938#issuecomment-616006856)
        //TODO Check that the invalid event is sent
        const input = $(selectors.issue543Invalid);
        input.click();
        expect(input.getProperty('validity').valid).toEqual(true);
        browser.keys(['Home', 'Delete']);
        expect(input.getValue()).toEqual('4.00');
        expect(input.getProperty('validity').valid).toEqual(false);
        browser.keys(['Delete']);
        expect(input.getValue()).toEqual('0.00');
        expect(input.getProperty('validity').valid).toEqual(false);
        browser.keys(['5']);
        expect(input.getProperty('validity').valid).toEqual(true);
        browser.keys(['000']); // 5000
        expect(input.getProperty('validity').valid).toEqual(true);
        browser.keys(['Home', 'Delete', '10']); // 10000
        expect(input.getProperty('validity').valid).toEqual(true);
        browser.keys(['End', 'ArrowLeft', '1']); // 10000.01
        expect(input.getProperty('validity').valid).toEqual(false);
    });

    xit(`should allows entering numbers out-of-bounds when using the \`overrideMinMaxLimits\` option \`invalid\` on a contenteditable-enabled element, while setting the invalid CSS class`, () => { //FIXME Those tests are correct and work as expected under Chromium. They fail under Firefox ESR 68.7 when trying to send the Home key (perhaps related to the upstream bug https://github.com/mozilla/geckodriver/issues/1508 ?)
        //TODO Check that the invalid event is sent
        const input = $(selectors.issue543InvalidCE);
        input.click();
        expect(input.getAttribute('class')).toEqual(''); //FIXME Chrome expects '', while Firefox expect 'null'...
        browser.keys(['Home', 'Delete']);
        expect(input.getText()).toEqual('4.00');
        expect(input.getAttribute('class')).toEqual('an-invalid');
        browser.keys(['Delete']);
        expect(input.getText()).toEqual('0.00');
        expect(input.getAttribute('class')).toEqual('an-invalid');
        browser.keys(['5']);
        expect(input.getAttribute('class')).toEqual('');
        browser.keys(['000']); // 5000
        expect(input.getAttribute('class')).toEqual('');
        browser.keys(['Home', 'Delete', '10']); // 10000 //FIXME Under Firefox ESR, 'Home' does not work //TODO Change it back when the bug is fixed upstream
        expect(input.getAttribute('class')).toEqual('');
        browser.keys(['End', 'ArrowLeft', '1']); // 10000.01
        expect(input.getAttribute('class')).toEqual('an-invalid');
    });

    it(`should allows entering numbers out-of-bounds when using the \`overrideMinMaxLimits\` option \`ignore\``, () => {
        //TODO Check that no events are sent
        const input = $(selectors.issue543Ignore);
        input.click();
        browser.keys(['Home', 'Delete']);
        expect(input.getValue()).toEqual('2.00');
        browser.keys(['Delete']);
        expect(input.getValue()).toEqual('0.00');
        browser.keys(['10000']);
        expect(input.getValue()).toEqual('10,000.00');
        browser.keys(['End', 'ArrowLeft', '1']); // 10000.01
        expect(input.getValue()).toEqual('10,000.01');
    });
});
