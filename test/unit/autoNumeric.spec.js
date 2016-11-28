/**
 * Tests for autoNumeric.js
 * @author Alexandre Bonneau <alexandre.bonneau@linuxfr.eu>
 * @copyright © 2016 Alexandre Bonneau
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

/* eslint space-in-parens: 0 */
/* eslint spaced-comment: 0 */
/* global describe, it, xdescribe, xit, fdescribe, fit, expect, beforeEach, afterEach */

import $ from '../../node_modules/jquery/dist/jquery';
import an from '../../src/autoNumeric';

// Default Jasmine test to make sure the test framework works
xdescribe('A test suite', () => {
    it('contains a spec with an expectation', () => {
        expect(true).toBe(true);
    });
});

// The autoNumeric tests :

//-----------------------------------------------------------------------------
//---- Options & settings
const autoNumericOptionsEuro = { aSep: '.', aDec: ',', altDec: '.', aSign: ' €', pSign: 's', mRound: 'U' };
const autoNumericOptionsDollar = { aSep: ',', aDec: '.', aSign: '$', pSign: 'p', mRound: 'U' };

describe('The autoNumeric object', () => {
    let aNInput;
    let newInput;

    beforeEach(() => { // Initialization
        newInput = document.createElement('input');
        document.body.appendChild(newInput);
        aNInput = $(newInput).autoNumeric('init'); // Initiate the autoNumeric input
    });

    afterEach(() => { // Un-initialization
        aNInput.autoNumeric('destroy');
        document.body.removeChild(newInput);
    });

    const defaultOption = {
        aSep         : ',',
        nSep         : false,
        dGroup       : '3',
        aDec         : '.',
        altDec       : null,
        aSign        : '',
        pSign        : 'p',
        pNeg         : 'l',
        aSuffix      : '',
        oLimits      : null,
        vMax         : '9999999999999.99',
        vMin         : '-9999999999999.99',
        mDec         : null,
        eDec         : null,
        aScale       : null,
        aStor        : false,
        mRound       : 's',
        aPad         : true,
        nBracket     : null,
        wEmpty       : 'focus',
        lZero        : 'allow',
        aForm        : true,
        sNumber      : false,
        anDefault    : null,
        unSetOnSubmit: false,
        localeOutput : null,
        debug        : false,
    };

    it('should return some default values', () => {
        expect(an.getDefaultConfig()).toEqual(defaultOption);
    });

    it('should be initiated with the default values', () => {
        const defaultSettings = an.getDefaultConfig();
        const aNInputSettings = aNInput.autoNumeric('getSettings');
        /* let i = 0;
        for (let prop in defaultSettings) { //XXX This loop fails since the mDec default is overridden by vMax/vMin (cf. following test cases)
            i++;
            if (defaultSettings.hasOwnProperty(prop)) {
                console.log(`${i}: Setting ${prop} = [${defaultSettings[prop]}][${aNInputSettings[prop]}]`); //DEBUG
                expect(defaultSettings[prop]).toEqual(aNInputSettings[prop]);
            }
        } */

        expect(defaultSettings.aSep         ).toEqual(aNInputSettings.aSep         );
        expect(defaultSettings.nSep         ).toEqual(aNInputSettings.nSep         );
        expect(defaultSettings.dGroup       ).toEqual(aNInputSettings.dGroup       );
        expect(defaultSettings.aDec         ).toEqual(aNInputSettings.aDec         );
        expect(defaultSettings.altDec       ).toEqual(aNInputSettings.altDec       );
        expect(defaultSettings.aSign        ).toEqual(aNInputSettings.aSign        );
        expect(defaultSettings.pSign        ).toEqual(aNInputSettings.pSign        );
        expect(defaultSettings.pNeg         ).toEqual(aNInputSettings.pNeg         );
        expect(defaultSettings.aSuffix      ).toEqual(aNInputSettings.aSuffix      );
        expect(defaultSettings.oLimits      ).toEqual(aNInputSettings.oLimits      );
        expect(defaultSettings.vMax         ).toEqual(aNInputSettings.vMax         );
        expect(defaultSettings.vMin         ).toEqual(aNInputSettings.vMin         );

        // Special case for 'mDec': when it's set to 'null' (which is the default), then its value is overwritten by the greater vMin or vMax number of decimals
        const [, decimalPart] = aNInputSettings.vMin.split('.');
        let decimalPartLength = 0;
        if (decimalPart !== void(0)) {
            decimalPartLength = decimalPart.length;
        }
        expect(decimalPartLength).toEqual(2);
        expect(aNInputSettings.mDec).toEqual(decimalPartLength);

        expect(defaultSettings.eDec         ).toEqual(aNInputSettings.eDec         );
        expect(defaultSettings.aScale       ).toEqual(aNInputSettings.aScale       );
        expect(defaultSettings.aStor        ).toEqual(aNInputSettings.aStor        );
        expect(defaultSettings.mRound       ).toEqual(aNInputSettings.mRound       );
        expect(defaultSettings.aPad         ).toEqual(aNInputSettings.aPad         );
        expect(defaultSettings.nBracket     ).toEqual(aNInputSettings.nBracket     );
        expect(defaultSettings.wEmpty       ).toEqual(aNInputSettings.wEmpty       );
        expect(defaultSettings.lZero        ).toEqual(aNInputSettings.lZero        );
        expect(defaultSettings.aForm        ).toEqual(aNInputSettings.aForm        );
        expect(defaultSettings.sNumber      ).toEqual(aNInputSettings.sNumber      );
        expect(defaultSettings.anDefault    ).toEqual(aNInputSettings.anDefault    );
        expect(defaultSettings.unSetOnSubmit).toEqual(aNInputSettings.unSetOnSubmit);
        expect(defaultSettings.localeOutput ).toEqual(aNInputSettings.localeOutput );
        expect(defaultSettings.debug        ).toEqual(aNInputSettings.debug        );
    });

    it('should update the options values accordingly', () => {
        aNInput.autoNumeric('update', { aSep: '.', aDec: ',', aSign: '€' });
        const defaultSettings = an.getDefaultConfig();
        const aNInputSettings = aNInput.autoNumeric('getSettings');

        expect(defaultSettings.aSep ).not.toEqual(aNInputSettings.aSep );
        expect(defaultSettings.aDec ).not.toEqual(aNInputSettings.aDec );
        expect(defaultSettings.aSign).not.toEqual(aNInputSettings.aSign);
        expect(aNInputSettings.aSep ).toEqual('.');
        expect(aNInputSettings.aDec ).toEqual(',');
        expect(aNInputSettings.aSign).toEqual('€');
    });

    describe('manages the mDec configuration option specially', () => {
        it('should set the default value for mDec', () => {
            // Setup
            const newInput = document.createElement('input');
            document.body.appendChild(newInput);
            const localANInput = $(newInput).autoNumeric('init'); // Initiate the autoNumeric input
            const localANInputSettings = localANInput.autoNumeric('getSettings');

            //--------------- The tests
            // Default value overridden
            let [, decimalPart] = localANInputSettings.vMin.split('.');
            let decimalPartLength = 0;
            if (decimalPart !== void(0)) {
                decimalPartLength = decimalPart.length;
            }
            expect(decimalPartLength).toEqual(2);

            [, decimalPart] = localANInputSettings.vMax.split('.');
            decimalPartLength = 0;
            if (decimalPart !== void(0)) {
                decimalPartLength = decimalPart.length;
            }
            expect(decimalPartLength).toEqual(2);

            expect(localANInputSettings.mDec).toEqual(decimalPartLength); // Special case for 'mDec': when it's set to 'null' (which is the default), then its value is overwritten by the greater vMin or vMax decimal part

            // Tear down
            localANInput.autoNumeric('destroy');
            document.body.removeChild(newInput);
        });

        it('should set the default value for mDec when vMin and vMax have different decimal sizes, vMax being bigger', () => {
            // Setup
            const newInput = document.createElement('input');
            document.body.appendChild(newInput);
            const localANInput = $(newInput).autoNumeric('init', { vMin: '-99.99', vMax: '99.999' }); // Initiate the autoNumeric input
            const localANInputSettings = localANInput.autoNumeric('getSettings');

            //--------------- The tests
            // Default value overridden
            let [, decimalPart] = localANInputSettings.vMin.split('.');
            let vMinDecimalPartLength = 0;
            if (decimalPart !== void(0)) {
                vMinDecimalPartLength = decimalPart.length;
            }
            expect(vMinDecimalPartLength).toEqual(2);

            [, decimalPart] = localANInputSettings.vMax.split('.');
            let vMaxDecimalPartLength = 0;
            if (decimalPart !== void(0)) {
                vMaxDecimalPartLength = decimalPart.length;
            }
            expect(vMaxDecimalPartLength).toEqual(3);

            expect(localANInputSettings.mDec).toEqual(Math.max(vMinDecimalPartLength, vMaxDecimalPartLength)); // Special case for 'mDec': when it's set to 'null' (which is the default), then its value is overwritten by the greater vMin or vMax decimal part

            // Tear down
            localANInput.autoNumeric('destroy');
            document.body.removeChild(newInput);
        });

        it('should set the default value for mDec when vMin and vMax have different decimal sizes, vMin being bigger', () => {
            // Setup
            const newInput = document.createElement('input');
            document.body.appendChild(newInput);
            const localANInput = $(newInput).autoNumeric('init', { vMin: '-99.999', vMax: '99.99' }); // Initiate the autoNumeric input
            const localANInputSettings = localANInput.autoNumeric('getSettings');

            //--------------- The tests
            // Default value overridden
            let [, decimalPart] = localANInputSettings.vMin.split('.');
            let vMinDecimalPartLength = 0;
            if (decimalPart !== void(0)) {
                vMinDecimalPartLength = decimalPart.length;
            }
            expect(vMinDecimalPartLength).toEqual(3);

            [, decimalPart] = localANInputSettings.vMax.split('.');
            let vMaxDecimalPartLength = 0;
            if (decimalPart !== void(0)) {
                vMaxDecimalPartLength = decimalPart.length;
            }
            expect(vMaxDecimalPartLength).toEqual(2);

            expect(localANInputSettings.mDec).toEqual(Math.max(vMinDecimalPartLength, vMaxDecimalPartLength)); // Special case for 'mDec': when it's set to 'null' (which is the default), then its value is overwritten by the greater vMin or vMax decimal part

            // Tear down
            localANInput.autoNumeric('destroy');
            document.body.removeChild(newInput);
        });

        it(`should set the mDec value if it's not set to 'null', overwriting vMin and vMax settings`, () => {
            // Setup
            const newInput = document.createElement('input');
            document.body.appendChild(newInput);
            const localANInput = $(newInput).autoNumeric('init', { vMin: '-99.999', vMax: '99.99', mDec: '4' }); // Initiate the autoNumeric input
            const localANInputSettings = localANInput.autoNumeric('getSettings');

            //--------------- The tests
            // Default value overridden
            let [, decimalPart] = localANInputSettings.vMin.split('.');
            let vMinDecimalPartLength = 0;
            if (decimalPart !== void(0)) {
                vMinDecimalPartLength = decimalPart.length;
            }
            expect(vMinDecimalPartLength).toEqual(3);

            [, decimalPart] = localANInputSettings.vMax.split('.');
            let vMaxDecimalPartLength = 0;
            if (decimalPart !== void(0)) {
                vMaxDecimalPartLength = decimalPart.length;
            }
            expect(vMaxDecimalPartLength).toEqual(2);

            expect(localANInputSettings.mDec).toEqual(4); // Special case for 'mDec': when it's set to 'null' (which is the default), then its value is overwritten by the greater vMin or vMax decimal part, otherwise it takes precedence over vMin/vMax

            // Tear down
            localANInput.autoNumeric('destroy');
            document.body.removeChild(newInput);
        });
    });

//TODO Complete the tests in order to test every single option separately (and in the future ; with and without jQuery)

//-----------------------------------------------------------------------------
//---- Methods

    it('should recognize only a specific list of methods', () => {
        // The 'init' method is implicit tested since we use that to setup those tests
        expect(() => aNInput.autoNumeric('wipe')).not.toThrow();
        expect(() => aNInput.autoNumeric('update', {})).not.toThrow();
        expect(() => aNInput.autoNumeric('set', 1234)).not.toThrow();
        expect(() => aNInput.autoNumeric('set', 1234.56)).not.toThrow();
        expect(() => aNInput.autoNumeric('unSet')).not.toThrow();
        expect(() => aNInput.autoNumeric('reSet')).not.toThrow();
        expect(() => aNInput.autoNumeric('get')).not.toThrow();
        expect(() => aNInput.autoNumeric('getString')).not.toThrow();
        expect(() => aNInput.autoNumeric('getArray')).not.toThrow();
        expect(() => aNInput.autoNumeric('getSettings')).not.toThrow();
        expect(() => aNInput.autoNumeric('_getStringOrArray')).toThrow(); //This is a private function only

        expect(() => aNInput.autoNumeric('destroy')).not.toThrow(); //Special case that needs to be done at the end of this test suite
    });

    it('should not recognize non-existant methods', () => {
        // expect(() => aNInput.autoNumeric(0)).toThrow(); //FIXME Finish this : this does not fail, why?
        // expect(() => aNInput.autoNumeric(null)).toThrow(); //FIXME Finish this : this does not fail, why?
        // expect(() => aNInput.autoNumeric(undefined)).toThrow(); //FIXME Finish this : this does not fail, why?
        // expect(() => aNInput.autoNumeric([])).toThrow(); //FIXME Finish this : this does not fail, why?
        // expect(() => aNInput.autoNumeric({})).toThrow(); //FIXME Finish this : this does not fail, why?
        expect(() => aNInput.autoNumeric(1)).toThrow();
        expect(() => aNInput.autoNumeric(-10)).toThrow();
        expect(() => aNInput.autoNumeric('foobar')).toThrow();
        expect(() => aNInput.autoNumeric('foobar')).toThrowError('Method "foobar" is not supported by autoNumeric');
    });
});

describe(`autoNumeric 'init' method`, () => {
    let aNInput;
    let newInput;

    beforeEach(() => { // Initialization
        newInput = document.createElement('input');
        document.body.appendChild(newInput);
    });

    afterEach(() => { // Un-initialization
        aNInput.autoNumeric('destroy');
        document.body.removeChild(newInput);
    });

    it('should init the element with the correct settings (Euro)', () => {
        newInput.value = '6789,02';
        aNInput = $(newInput).autoNumeric('init', autoNumericOptionsEuro);
        expect(aNInput.autoNumeric('get')).toEqual('6789.02');
        expect(aNInput.autoNumeric('getFormatted')).toEqual('6.789,02 €');

        aNInput.autoNumeric('update', autoNumericOptionsEuro);
        expect(aNInput.autoNumeric('getFormatted')).toEqual('6.789,02 €');
    });

    it('should init the element with the correct settings (Dollar)', () => {
        newInput.value = '6789.02';
        aNInput = $(newInput).autoNumeric('init', autoNumericOptionsDollar);
        expect(aNInput.autoNumeric('get')).toEqual('6789.02');
        expect(aNInput.autoNumeric('getFormatted')).toEqual('$6,789.02');

        aNInput.autoNumeric('update', autoNumericOptionsDollar);
        expect(aNInput.autoNumeric('getFormatted')).toEqual('$6,789.02');
    });

    it('should init the element with the correct settings (no methods, Euro)', () => {
        newInput.value = '256789,02';
        aNInput = $(newInput).autoNumeric(autoNumericOptionsEuro);
        expect(aNInput.autoNumeric('get')).toEqual('256789.02');
        expect(aNInput.autoNumeric('getFormatted')).toEqual('256.789,02 €');

        aNInput.autoNumeric('update', autoNumericOptionsEuro);
        expect(aNInput.autoNumeric('getFormatted')).toEqual('256.789,02 €');
    });

    it('should init the element with the correct settings (no methods, Dollar)', () => {
        newInput.value = '256789.02';
        aNInput = $(newInput).autoNumeric(autoNumericOptionsDollar);
        expect(aNInput.autoNumeric('get')).toEqual('256789.02');
        expect(aNInput.autoNumeric('getFormatted')).toEqual('$256,789.02');

        aNInput.autoNumeric('update', autoNumericOptionsDollar);
        expect(aNInput.autoNumeric('getFormatted')).toEqual('$256,789.02');
    });
});

describe(`autoNumeric 'get' method`, () => {
    let aNInput;
    let newInput;

    beforeEach(() => { // Initialization
        newInput = document.createElement('input');
        document.body.appendChild(newInput);
        aNInput = $(newInput).autoNumeric('init'); // Initiate the autoNumeric input
    });

    afterEach(() => { // Un-initialization
        aNInput.autoNumeric('destroy');
        document.body.removeChild(newInput);
    });

    it('should return an unformatted value', () => {
        // Euros
        aNInput.autoNumeric('update', autoNumericOptionsEuro);
        aNInput.autoNumeric('set', 1234.56);
        expect(aNInput.autoNumeric('get')).toEqual('1234.56');
        aNInput.autoNumeric('set', 6789012.345);
        expect(aNInput.autoNumeric('get')).toEqual('6789012.35'); // Rounding happens here

        // Dollars
        aNInput.autoNumeric('update', autoNumericOptionsDollar);
        expect(aNInput.autoNumeric('get')).toEqual('6789012.35'); // First check if updating the options changed the results accordingly
        aNInput.autoNumeric('set', 1234.56);
        expect(aNInput.autoNumeric('get')).toEqual('1234.56');
        aNInput.autoNumeric('set', 6789012.345);
        expect(aNInput.autoNumeric('get')).toEqual('6789012.35');
    });
});

describe(`autoNumeric 'set' method`, () => {
    let aNInput;
    let newInput;

    beforeEach(() => { // Initialization
        newInput = document.createElement('input');
        document.body.appendChild(newInput);
        aNInput = $(newInput).autoNumeric('init'); // Initiate the autoNumeric input
    });

    afterEach(() => { // Un-initialization
        aNInput.autoNumeric('destroy');
        document.body.removeChild(newInput);
    });

    it('should set a raw value and result in a formatted value', () => {
        // Euros
        aNInput.autoNumeric('update', autoNumericOptionsEuro);
        aNInput.autoNumeric('set', 1234.56);
        expect(aNInput.autoNumeric('getFormatted')).toEqual('1.234,56 €');
        aNInput.autoNumeric('set', 6789012.345);
        expect(aNInput.autoNumeric('getFormatted')).toEqual('6.789.012,35 €'); // Rounding happens here

        aNInput.autoNumeric('set', '1234.56');
        expect(aNInput.autoNumeric('getFormatted')).toEqual('1.234,56 €');
        aNInput.autoNumeric('set', '6789012.345');
        expect(aNInput.autoNumeric('getFormatted')).toEqual('6.789.012,35 €'); // Rounding happens here

        // Dollars
        aNInput.autoNumeric('update', autoNumericOptionsDollar);
        expect(aNInput.autoNumeric('getFormatted')).toEqual('$6,789,012.35'); // First check if updating the options changed the results accordingly
        aNInput.autoNumeric('set', 1234.56);
        expect(aNInput.autoNumeric('getFormatted')).toEqual('$1,234.56');
        aNInput.autoNumeric('set', 6789012.345);
        expect(aNInput.autoNumeric('getFormatted')).toEqual('$6,789,012.35');

        aNInput.autoNumeric('set', '1234.56');
        expect(aNInput.autoNumeric('getFormatted')).toEqual('$1,234.56');
        aNInput.autoNumeric('set', '6789012.345');
        expect(aNInput.autoNumeric('getFormatted')).toEqual('$6,789,012.35');
    });
});

describe(`autoNumeric 'getString' and 'getArray' methods`, () => {
    let form;
    let input1;
    let input2;
    let input3;
    let input4;
    let input5;
    let anInput1;
    let anInput2;
    let anInput3;

    beforeEach(() => { // Initialization
        form = document.createElement('form');
        input1 = document.createElement('input');
        input2 = document.createElement('input');
        input3 = document.createElement('input');
        input4 = document.createElement('input');
        input5 = document.createElement('input');

        document.body.appendChild(form);
        form.appendChild(input1);
        form.appendChild(input2);
        form.appendChild(input3);
        form.appendChild(input4);
        form.appendChild(input5);

        input1.name = 'aa';
        input2.name = 'bb';
        input3.name = 'cc';
        input4.name = 'ab';
        input5.name = 'bc';

        input1.value = '1111.11';
        expect(input1.value).toEqual('1111.11');
        input2.value = '2222.22';
        input3.value = '3333.33';
        input4.value = 'not autoNumeric test';
        expect(input4.value).toEqual('not autoNumeric test');
        input5.value = 'not autoNumeric $1,234.567';
        expect(input5.value).toEqual('not autoNumeric $1,234.567');

        // Initiate only 3 autoNumeric inputs
        const anOptions = { aSep: '.', aDec: ',', aSign: '€ ' };
        anInput1 = $(input1).autoNumeric('init', anOptions);
        anInput2 = $(input2).autoNumeric('init', anOptions);
        anInput3 = $(input3).autoNumeric('init', anOptions);

        expect(input1.value).toEqual('€ 1.111,11');
        expect(anInput1.autoNumeric('getFormatted')).toEqual('€ 1.111,11');
        anInput1.autoNumeric('update', anOptions);
        expect(anInput1.autoNumeric('getFormatted')).toEqual('€ 1.111,11');
    });

    afterEach(() => { // Un-initialization
        anInput1.autoNumeric('destroy');
        anInput2.autoNumeric('destroy');
        anInput3.autoNumeric('destroy');
        form.removeChild(input1);
        form.removeChild(input2);
        form.removeChild(input3);
        form.removeChild(input4);
        form.removeChild(input5);
        document.body.removeChild(form);
    });

    it('should return the correct string', () => {
        expect($(form).autoNumeric('getString')).toEqual('aa=1111.11&bb=2222.22&cc=3333.33&ab=not%20autoNumeric%20test&bc=not%20autoNumeric%20%241%2C234.567');
    });

    it('should return the correct array', () => {
        const arrayResult = [
            {
                name: 'aa',
                value: '1111.11' ,
            },
            {
                name : 'bb',
                value: '2222.22',
            },
            {
                name : 'cc',
                value: '3333.33',
            },
            {
                name: 'ab',
                value: 'not autoNumeric test',
            },
            {
                name: 'bc',
                value: 'not autoNumeric $1,234.567',
            },
        ];
        expect($(form).autoNumeric('getArray')).toEqual(arrayResult);
    });
});

//TODO Complete the tests in order to test every single method separately (and in the future ; with and without jQuery)

//-----------------------------------------------------------------------------
//---- Static functions

describe('Static autoNumeric functions', () => {
    describe('should unformat using jQuery `$.fn`', () => {
        it('with default options', () => {
            expect($.fn.autoUnformat('$1,234.56')).toEqual(1234.56);
            expect($.fn.autoUnformat('$123.45')).toEqual(123.45);
            expect($.fn.autoUnformat('$0.00')).toEqual(0);
            expect($.fn.autoUnformat(null)).toEqual(null);
        });

        it('with user options', () => {
            expect($.fn.autoUnformat('1.234,56 €', autoNumericOptionsEuro)).toEqual(1234.56);
            expect($.fn.autoUnformat('123,45 €', autoNumericOptionsEuro)).toEqual(123.45);
            expect($.fn.autoUnformat('0,00 €', autoNumericOptionsEuro)).toEqual(0);
            expect($.fn.autoUnformat(null, autoNumericOptionsEuro)).toEqual(null);
        });
    });

    describe('should unformat without jQuery `$.fn`', () => {
        it('with default options', () => {
            expect(an.unFormat('$1,234.56')).toEqual(1234.56);
            expect(an.unFormat('$123.45')).toEqual(123.45);
            expect(an.unFormat('$0.00')).toEqual(0);
            expect(an.unFormat(null)).toEqual(null);
        });

        it('with user options', () => {
            expect(an.unFormat('1.234,56 €', autoNumericOptionsEuro)).toEqual(1234.56);
            expect(an.unFormat('123,45 €', autoNumericOptionsEuro)).toEqual(123.45);
            expect(an.unFormat('0,00 €', autoNumericOptionsEuro)).toEqual(0);
            expect(an.unFormat(null, autoNumericOptionsEuro)).toEqual(null);

            // expect(an.unFormat(1234.56, autoNumericOptions)).toEqual(1234.56); //TODO Does giving an unformatted value should return the same unformatted value, whatever the options passed as a parameter?
        });
    });

    describe('should format using jQuery `$.fn`', () => {
        it('with default options', () => {
            expect($.fn.autoFormat(1234.56)).toEqual('1,234.56');
            expect($.fn.autoFormat(123.45)).toEqual('123.45');
            expect($.fn.autoFormat(0)).toEqual('0.00');
            expect($.fn.autoFormat(null)).toEqual(null);
            expect($.fn.autoFormat(undefined)).toEqual(null);
        });

        it('with user options', () => {
            expect($.fn.autoFormat(1234.56, autoNumericOptionsEuro)).toEqual('1.234,56 €');
            expect($.fn.autoFormat(123.45, autoNumericOptionsEuro)).toEqual('123,45 €');
            expect($.fn.autoFormat(0, autoNumericOptionsEuro)).toEqual('0,00 €');
            expect($.fn.autoFormat(null, autoNumericOptionsEuro)).toEqual(null);
            expect($.fn.autoFormat(undefined, autoNumericOptionsEuro)).toEqual(null);
        });
    });

    describe('should format without jQuery `$.fn`', () => {
        it('with default options', () => {
            expect(an.format(1234.56)).toEqual('1,234.56');
            expect(an.format(123.45)).toEqual('123.45');
            expect(an.format(0)).toEqual('0.00');
            expect(an.format(null)).toEqual(null);
            expect(an.format(undefined)).toEqual(null);
        });

        it('with user options', () => {
            expect(an.format(1234.56, autoNumericOptionsEuro)).toEqual('1.234,56 €');
            expect(an.format(123.45, autoNumericOptionsEuro)).toEqual('123,45 €');
            expect(an.format(0, autoNumericOptionsEuro)).toEqual('0,00 €');
            expect(an.format(null, autoNumericOptionsEuro)).toEqual(null);
            expect(an.format(undefined, autoNumericOptionsEuro)).toEqual(null);
        });
    });

    xit('should fail formatting wrong parameters', () => {
        expect(() => an.format('foobar')).toThrow(); //FIXME This should throw
        expect(() => an.format([1234])).toThrow(); //FIXME This should throw
        expect(() => an.format('1234.56')).toThrow(); //FIXME This should throw
        expect(() => an.format('1234,56')).toThrow(); //FIXME This should throw
        expect(() => an.format('1.234,56')).toThrow(); //FIXME This should throw
        expect(() => an.format({})).toThrow(); //FIXME This should throw
        expect(() => an.format({ val: 1234 })).toThrow(); //FIXME This should throw
        expect(() => an.format([])).toThrow(); //FIXME This should throw
    });

    xit('should fail unformatting wrong parameters', () => {
        expect(() => an.unFormat('foobar')).toThrow(); //FIXME This should throw
        expect(() => an.unFormat([1234])).toThrow(); //FIXME This should throw
        expect(() => an.unFormat('1234.56')).toThrow(); //FIXME This should throw
        expect(() => an.unFormat('1234,56')).toThrow(); //FIXME This should throw
        expect(() => an.unFormat({})).toThrow(); //FIXME This should throw
        expect(() => an.unFormat({ val: 1234 })).toThrow(); //FIXME This should throw
        expect(() => an.unFormat([])).toThrow(); //FIXME This should throw

        expect(() => an.unFormat(1234.56)).not.toThrow(); //FIXME This should not throw
    });
});

//TODO Complete the tests with user interactions tests
