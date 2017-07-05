/**
 * Unit tests for autoNumeric.js
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
// eslint-disable-next-line
/* global describe, it, xdescribe, xit, fdescribe, fit, expect, beforeEach, afterEach, spyOn */

import $ from '../../node_modules/jquery/dist/jquery';
import an from '../../src/autoNumeric';

// Default Jasmine test to make sure the test framework works
// describe('A test suite', () => {
//     it('contains a spec with an expectation', () => {
//         expect(true).toBe(true);
//     });
// });

// The autoNumeric tests :

//-----------------------------------------------------------------------------
//---- Options & settings
const autoNumericOptionsEuro = {
    digitGroupSeparator        : '.',
    decimalCharacter           : ',',
    decimalCharacterAlternative: '.',
    currencySymbol             : ' €',
    currencySymbolPlacement    : 's',
    roundingMethod             : 'U',
};
const autoNumericOptionsEuroNumber = {
    digitGroupSeparator        : '.',
    decimalCharacter           : ',',
    decimalCharacterAlternative: '.',
    currencySymbol             : ' €',
    currencySymbolPlacement    : 's',
    roundingMethod             : 'U',
    outputFormat               : 'number',
};
const autoNumericOptionsDollar = {
    digitGroupSeparator    : ',',
    decimalCharacter       : '.',
    currencySymbol         : '$',
    currencySymbolPlacement: 'p',
    roundingMethod         : 'U',
};

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
        digitGroupSeparator          : ',',
        noSeparatorOnFocus           : false,
        digitalGroupSpacing          : '3',
        decimalCharacter             : '.',
        decimalCharacterAlternative  : null,
        currencySymbol               : '',
        currencySymbolPlacement      : 'p',
        negativePositiveSignPlacement: null,
        showPositiveSign             : false,
        suffixText                   : '',
        overrideMinMaxLimits         : null,
        maximumValue                 : '9999999999999.99',
        minimumValue                 : '-9999999999999.99',
        decimalPlacesOverride        : null,
        decimalPlacesShownOnFocus    : null,
        scaleDivisor                 : null,
        scaleDecimalPlaces           : null,
        scaleSymbol                  : null,
        saveValueToSessionStorage    : false,
        onInvalidPaste               : 'error',
        roundingMethod               : 'S',
        allowDecimalPadding          : true,
        negativeBracketsTypeOnBlur   : null,
        emptyInputBehavior           : 'focus',
        leadingZero                  : 'deny',
        formatOnPageLoad             : true,
        selectNumberOnly             : false,
        defaultValueOverride         : null,
        unformatOnSubmit             : false,
        outputFormat                 : null,
        showWarnings                 : true,
        failOnUnknownOption          : false,
    };

    it('should return some default values', () => {
        // Test the options one by one, which makes it easier to spot the error
        //XXX This loop is useful to spot the faulty options, since only those that are not equal to the default are shown
        const defaultSettings = an.getDefaultConfig();
        let i = 0;
        for (const prop in defaultSettings) {
            i++;
            if (defaultSettings.hasOwnProperty(prop)) {
                if (defaultSettings[prop] !== defaultOption[prop]) {
                    console.log(`${i}: Setting ${prop} = [${defaultSettings[prop]}][${defaultOption[prop]}]`); //DEBUG
                }
                expect(defaultSettings[prop]).toEqual(defaultOption[prop]);
            }
        }

        // Global test
        expect(an.getDefaultConfig()).toEqual(defaultOption);
    });

    it('should return the predefined language options', () => {
        const defaultLanguageOption = {
            French       : { // Français
                selectNumberOnly           : true,
                digitGroupSeparator        : '.',
                decimalCharacter           : ',',
                decimalCharacterAlternative: '.',
                currencySymbol             : '\u202f€',
                currencySymbolPlacement    : 's',
                roundingMethod             : 'U',
                leadingZero                : 'deny',
                minimumValue               : '-999999999999.99',
                maximumValue               : '999999999999.99',
            },
            NorthAmerican: {
                selectNumberOnly       : true,
                digitGroupSeparator    : ',',
                decimalCharacter       : '.',
                currencySymbol         : '$',
                currencySymbolPlacement: 'p',
                roundingMethod         : 'U',
                leadingZero            : 'deny',
                minimumValue           : '-999999999999.99',
                maximumValue           : '999999999999.99',
            },
        };

        // Test the options one by one, which makes it easier to spot the error
        //XXX This loop is useful to spot the faulty options, since only those that are not equal to the default are shown
        const predefinedLanguages = an.getLanguages();
        let i = 0;
        for (const lang in defaultLanguageOption) { //XXX Here I test only this language subset
            i++;
            if (predefinedLanguages.hasOwnProperty(lang)) {
                for (const prop in predefinedLanguages[lang]) {
                    if (predefinedLanguages[lang].hasOwnProperty(prop)) {
                        if (predefinedLanguages[lang][prop] !== defaultLanguageOption[lang][prop]) {
                            console.log(`${i}: Setting ${prop} = [${predefinedLanguages[lang][prop]}][${defaultLanguageOption[lang][prop]}]`); //DEBUG
                        }
                        expect(predefinedLanguages[lang][prop]).toEqual(defaultLanguageOption[lang][prop]);
                    }
                }
            }
        }

        // Global test
        // expect(an.getLanguages()).toEqual(defaultLanguageOption); //XXX Here I test only a language subset, not all language options
    });

    it('should be initiated with the default values', () => {
        const defaultSettings = an.getDefaultConfig();
        const aNInputSettings = aNInput.autoNumeric('getSettings');
        /* let i = 0;
        for (let prop in defaultSettings) { //XXX This loop fails since the decimalPlacesOverride default is overridden by maximumValue/minimumValue (cf. following test cases)
            i++;
            if (defaultSettings.hasOwnProperty(prop)) {
                console.log(`${i}: Setting ${prop} = [${defaultSettings[prop]}][${aNInputSettings[prop]}]`); //DEBUG
                expect(defaultSettings[prop]).toEqual(aNInputSettings[prop]);
            }
        } */

        expect(defaultSettings.digitGroupSeparator        ).toEqual(aNInputSettings.digitGroupSeparator        );
        expect(defaultSettings.noSeparatorOnFocus         ).toEqual(aNInputSettings.noSeparatorOnFocus         );
        expect(defaultSettings.digitalGroupSpacing        ).toEqual(aNInputSettings.digitalGroupSpacing        );
        expect(defaultSettings.decimalCharacter           ).toEqual(aNInputSettings.decimalCharacter           );
        expect(defaultSettings.decimalCharacterAlternative).toEqual(aNInputSettings.decimalCharacterAlternative);
        expect(defaultSettings.currencySymbol             ).toEqual(aNInputSettings.currencySymbol             );
        expect(defaultSettings.currencySymbolPlacement    ).toEqual(aNInputSettings.currencySymbolPlacement    );

        // Special case for `negativePositiveSignPlacement`, see the related tests
        // expect(defaultSettings.negativePositiveSignPlacement).toEqual(aNInputSettings.negativePositiveSignPlacement);
        expect(defaultSettings.suffixText                   ).toEqual(aNInputSettings.suffixText                   );
        expect(defaultSettings.overrideMinMaxLimits         ).toEqual(aNInputSettings.overrideMinMaxLimits         );
        expect(defaultSettings.maximumValue                 ).toEqual(aNInputSettings.maximumValue                 );
        expect(defaultSettings.minimumValue                 ).toEqual(aNInputSettings.minimumValue                 );

        // Special case for 'decimalPlacesOverride': when it's set to 'null' (which is the default), then its value is overwritten by the greater minimumValue or maximumValue number of decimals
        const [, decimalPart] = aNInputSettings.minimumValue.split('.');
        let decimalPartLength = 0;
        if (decimalPart !== void(0)) {
            decimalPartLength = decimalPart.length;
        }
        expect(decimalPartLength).toEqual(2);
        expect(aNInputSettings.decimalPlacesOverride).toEqual(decimalPartLength);

        expect(defaultSettings.decimalPlacesShownOnFocus ).toEqual(aNInputSettings.decimalPlacesShownOnFocus );
        expect(defaultSettings.scaleDivisor              ).toEqual(aNInputSettings.scaleDivisor              );
        expect(defaultSettings.scaleDecimalPlaces        ).toEqual(aNInputSettings.scaleDecimalPlaces        );
        expect(defaultSettings.scaleSymbol               ).toEqual(aNInputSettings.scaleSymbol               );
        expect(defaultSettings.saveValueToSessionStorage ).toEqual(aNInputSettings.saveValueToSessionStorage );
        expect(defaultSettings.roundingMethod            ).toEqual(aNInputSettings.roundingMethod            );
        expect(defaultSettings.allowDecimalPadding       ).toEqual(aNInputSettings.allowDecimalPadding       );
        expect(defaultSettings.negativeBracketsTypeOnBlur).toEqual(aNInputSettings.negativeBracketsTypeOnBlur);
        expect(defaultSettings.emptyInputBehavior        ).toEqual(aNInputSettings.emptyInputBehavior        );
        expect(defaultSettings.leadingZero               ).toEqual(aNInputSettings.leadingZero               );
        expect(defaultSettings.formatOnPageLoad          ).toEqual(aNInputSettings.formatOnPageLoad          );
        expect(defaultSettings.selectNumberOnly          ).toEqual(aNInputSettings.selectNumberOnly          );
        expect(defaultSettings.defaultValueOverride      ).toEqual(aNInputSettings.defaultValueOverride      );
        expect(defaultSettings.unformatOnSubmit          ).toEqual(aNInputSettings.unformatOnSubmit          );
        expect(defaultSettings.outputFormat              ).toEqual(aNInputSettings.outputFormat              );
        expect(defaultSettings.showWarnings              ).toEqual(aNInputSettings.showWarnings              );
    });

    it('should update the options values accordingly', () => {
        aNInput.autoNumeric('update', { digitGroupSeparator: '.', decimalCharacter: ',', currencySymbol: '€' });
        const defaultSettings = an.getDefaultConfig();
        const aNInputSettings = aNInput.autoNumeric('getSettings');

        expect(defaultSettings.digitGroupSeparator).not.toEqual(aNInputSettings.digitGroupSeparator );
        expect(defaultSettings.decimalCharacter   ).not.toEqual(aNInputSettings.decimalCharacter    );
        expect(defaultSettings.currencySymbol     ).not.toEqual(aNInputSettings.currencySymbol      );
        expect(aNInputSettings.digitGroupSeparator).toEqual('.');
        expect(aNInputSettings.decimalCharacter   ).toEqual(',');
        expect(aNInputSettings.currencySymbol     ).toEqual('€');
    });

    describe('manages the negativePositiveSignPlacement configuration option specially', () => {
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

        /*
         * Special case for `negativePositiveSignPlacement`:
         * If the user has not set the placement of the negative sign (`negativePositiveSignPlacement`), but has set a currency symbol (`currencySymbol`),
         * then the default value of `negativePositiveSignPlacement` is modified in order to keep the resulting output logical by default :
         * - "$-1,234.56" instead of "-$1,234.56" ({currencySymbol: "$", negativePositiveSignPlacement: "r"})
         * - "-1,234.56$" instead of "1,234.56-$" ({currencySymbol: "$", currencySymbolPlacement: "s", negativePositiveSignPlacement: "p"})
         */
        it(`this should set the negativePositiveSignPlacement differently based on the currencySymbol and currencySymbolPlacement (s) values`, () => {
            // Case 1 : settings.currencySymbolPlacement equals 's'
            aNInput = $(newInput).autoNumeric('init', { currencySymbol: '$', currencySymbolPlacement: 's' }); // Initiate the autoNumeric input
            const aNInputSettings = aNInput.autoNumeric('getSettings');

            expect(aNInputSettings.negativePositiveSignPlacement).toEqual('p');
        });

        it(`this should set the negativePositiveSignPlacement differently based on the currencySymbol and currencySymbolPlacement (p) values`, () => {
            // Case 2 : settings.currencySymbolPlacement equals 'p'
            aNInput = $(newInput).autoNumeric('init', { currencySymbol: '$', currencySymbolPlacement: 'p' }); // Initiate the autoNumeric input
            const aNInputSettings = aNInput.autoNumeric('getSettings');

            expect(aNInputSettings.negativePositiveSignPlacement).toEqual('l');
        });

        /*
         * Default cases
         */
        it(`this should set the default negativePositiveSignPlacement value if it's not set by the user, to -1,234.56`, () => {
            aNInput = $(newInput).autoNumeric('init', { negativePositiveSignPlacement : null }); // Initiate the autoNumeric input
            const aNInputSettings = aNInput.autoNumeric('getSettings');

            expect(aNInputSettings.currencySymbol).toEqual('');
            expect(aNInputSettings.currencySymbolPlacement).toEqual('p');
            expect(aNInputSettings.negativePositiveSignPlacement).toEqual('l');
        });


        it(`this should set the default negativePositiveSignPlacement value if it's not set by the user, to -$1,234.56`, () => {
            aNInput = $(newInput).autoNumeric('init', { currencySymbol: '$', negativePositiveSignPlacement : null }); // Initiate the autoNumeric input
            const aNInputSettings = aNInput.autoNumeric('getSettings');

            expect(aNInputSettings.currencySymbol).toEqual('$');
            expect(aNInputSettings.currencySymbolPlacement).toEqual('p');
            expect(aNInputSettings.negativePositiveSignPlacement).toEqual('l');
        });

        it(`this should not override the negativePositiveSignPlacement value 'p' if it has been set by the user`, () => {
            aNInput = $(newInput).autoNumeric('init', { negativePositiveSignPlacement : 'p' }); // Initiate the autoNumeric input
            const aNInputSettings = aNInput.autoNumeric('getSettings');
            expect(aNInputSettings.negativePositiveSignPlacement).toEqual('p');
        });

        it(`this should not override the negativePositiveSignPlacement value 's' if it has been set by the user`, () => {
            aNInput = $(newInput).autoNumeric('init', { negativePositiveSignPlacement : 's' }); // Initiate the autoNumeric input
            const aNInputSettings = aNInput.autoNumeric('getSettings');
            expect(aNInputSettings.negativePositiveSignPlacement).toEqual('s');
        });

        it(`this should not override the negativePositiveSignPlacement value 'l' if it has been set by the user`, () => {
            aNInput = $(newInput).autoNumeric('init', { negativePositiveSignPlacement : 'l' }); // Initiate the autoNumeric input
            const aNInputSettings = aNInput.autoNumeric('getSettings');
            expect(aNInputSettings.negativePositiveSignPlacement).toEqual('l');
        });

        it(`this should not override the negativePositiveSignPlacement value 'r' if it has been set by the user`, () => {
            aNInput = $(newInput).autoNumeric('init', { negativePositiveSignPlacement : 'r' }); // Initiate the autoNumeric input
            const aNInputSettings = aNInput.autoNumeric('getSettings');
            expect(aNInputSettings.negativePositiveSignPlacement).toEqual('r');
        });
    });

    describe('manages the decimalPlacesOverride configuration option specially', () => {
        it('should set the default value for decimalPlacesOverride', () => {
            // Setup
            const newInput = document.createElement('input');
            document.body.appendChild(newInput);
            const localANInput = $(newInput).autoNumeric('init'); // Initiate the autoNumeric input
            const localANInputSettings = localANInput.autoNumeric('getSettings');

            //--------------- The tests
            // Default value overridden
            let [, decimalPart] = localANInputSettings.minimumValue.split('.');
            let decimalPartLength = 0;
            if (decimalPart !== void(0)) {
                decimalPartLength = decimalPart.length;
            }
            expect(decimalPartLength).toEqual(2);

            [, decimalPart] = localANInputSettings.maximumValue.split('.');
            decimalPartLength = 0;
            if (decimalPart !== void(0)) {
                decimalPartLength = decimalPart.length;
            }
            expect(decimalPartLength).toEqual(2);

            expect(localANInputSettings.decimalPlacesOverride).toEqual(decimalPartLength); // Special case for 'decimalPlacesOverride': when it's set to 'null' (which is the default), then its value is overwritten by the greater minimumValue or maximumValue decimal part

            // Tear down
            localANInput.autoNumeric('destroy');
            document.body.removeChild(newInput);
        });

        it('should set the default value for decimalPlacesOverride when minimumValue and maximumValue have different decimal sizes, maximumValue being bigger', () => {
            // Setup
            const newInput = document.createElement('input');
            document.body.appendChild(newInput);
            const localANInput = $(newInput).autoNumeric('init', { minimumValue: '-99.99', maximumValue: '99.999' }); // Initiate the autoNumeric input
            const localANInputSettings = localANInput.autoNumeric('getSettings');

            //--------------- The tests
            // Default value overridden
            let [, decimalPart] = localANInputSettings.minimumValue.split('.');
            let minimumValueDecimalPartLength = 0;
            if (decimalPart !== void(0)) {
                minimumValueDecimalPartLength = decimalPart.length;
            }
            expect(minimumValueDecimalPartLength).toEqual(2);

            [, decimalPart] = localANInputSettings.maximumValue.split('.');
            let maximumValueDecimalPartLength = 0;
            if (decimalPart !== void(0)) {
                maximumValueDecimalPartLength = decimalPart.length;
            }
            expect(maximumValueDecimalPartLength).toEqual(3);

            expect(localANInputSettings.decimalPlacesOverride).toEqual(Math.max(minimumValueDecimalPartLength, maximumValueDecimalPartLength)); // Special case for 'decimalPlacesOverride': when it's set to 'null' (which is the default), then its value is overwritten by the greater minimumValue or maximumValue decimal part

            // Tear down
            localANInput.autoNumeric('destroy');
            document.body.removeChild(newInput);
        });

        it('should set the default value for decimalPlacesOverride when minimumValue and maximumValue have different decimal sizes, minimumValue being bigger', () => {
            // Setup
            const newInput = document.createElement('input');
            document.body.appendChild(newInput);
            const localANInput = $(newInput).autoNumeric('init', { minimumValue: '-99.999', maximumValue: '99.99' }); // Initiate the autoNumeric input
            const localANInputSettings = localANInput.autoNumeric('getSettings');

            //--------------- The tests
            // Default value overridden
            let [, decimalPart] = localANInputSettings.minimumValue.split('.');
            let minimumValueDecimalPartLength = 0;
            if (decimalPart !== void(0)) {
                minimumValueDecimalPartLength = decimalPart.length;
            }
            expect(minimumValueDecimalPartLength).toEqual(3);

            [, decimalPart] = localANInputSettings.maximumValue.split('.');
            let maximumValueDecimalPartLength = 0;
            if (decimalPart !== void(0)) {
                maximumValueDecimalPartLength = decimalPart.length;
            }
            expect(maximumValueDecimalPartLength).toEqual(2);

            expect(localANInputSettings.decimalPlacesOverride).toEqual(Math.max(minimumValueDecimalPartLength, maximumValueDecimalPartLength)); // Special case for 'decimalPlacesOverride': when it's set to 'null' (which is the default), then its value is overwritten by the greater minimumValue or maximumValue decimal part

            // Tear down
            localANInput.autoNumeric('destroy');
            document.body.removeChild(newInput);
        });

        it(`should set the decimalPlacesOverride value if it's not set to 'null', overwriting minimumValue and maximumValue settings`, () => {
            // Setup
            const newInput = document.createElement('input');
            document.body.appendChild(newInput);
            spyOn(console, 'warn'); // The next statement will output a warning since we override the decimals places declared in minimumValue
            const localANInput = $(newInput).autoNumeric('init', { minimumValue: '-99.999', maximumValue: '99.99', decimalPlacesOverride: '4' }); // Initiate the autoNumeric input
            expect(console.warn).toHaveBeenCalled();
            const localANInputSettings = localANInput.autoNumeric('getSettings');

            //--------------- The tests
            // Default value overridden
            let [, decimalPart] = localANInputSettings.minimumValue.split('.');
            let minimumValueDecimalPartLength = 0;
            if (decimalPart !== void(0)) {
                minimumValueDecimalPartLength = decimalPart.length;
            }
            expect(minimumValueDecimalPartLength).toEqual(3);

            [, decimalPart] = localANInputSettings.maximumValue.split('.');
            let maximumValueDecimalPartLength = 0;
            if (decimalPart !== void(0)) {
                maximumValueDecimalPartLength = decimalPart.length;
            }
            expect(maximumValueDecimalPartLength).toEqual(2);

            expect(localANInputSettings.decimalPlacesOverride).toEqual(4); // Special case for 'decimalPlacesOverride': when it's set to 'null' (which is the default), then its value is overwritten by the greater minimumValue or maximumValue decimal part, otherwise it takes precedence over minimumValue/maximumValue

            // Tear down
            localANInput.autoNumeric('destroy');
            document.body.removeChild(newInput);
        });

        it(`should set the decimalPlacesOverride value, and show a warning when setting a greater decimalPlacesShownOnFocus`, () => {
            // Setup
            const newInput = document.createElement('input');
            document.body.appendChild(newInput);
            spyOn(console, 'warn'); // The next statement will output a warning since decimalPlacesShownOnFocus is lower than decimalPlacesOverride
            const localANInput = $(newInput).autoNumeric('init', { minimumValue: '-99.99', maximumValue: '99.99', decimalPlacesOverride: '5', decimalPlacesShownOnFocus: '3' }); // Initiate the autoNumeric input
            expect(console.warn).toHaveBeenCalled();
            const localANInputSettings = localANInput.autoNumeric('getSettings');

            expect(localANInputSettings.decimalPlacesOverride).toEqual(5); // 'decimalPlacesOverride' is not overwritten by a greater decimalPlacesShownOnFocus

            // Tear down
            localANInput.autoNumeric('destroy');
            document.body.removeChild(newInput);
        });

        it(`should set the decimalPlacesOverride value when decimalPlacesOverride is not defined, and show a warning when setting a greater decimalPlacesShownOnFocus`, () => {
            // Setup
            const newInput = document.createElement('input');
            document.body.appendChild(newInput);
            spyOn(console, 'warn'); // The next statement will output a warning since decimalPlacesShownOnFocus is lower than decimalPlacesOverride
            const localANInput = $(newInput).autoNumeric('init', { minimumValue: '-99.9999', maximumValue: '99.9999', decimalPlacesShownOnFocus: '3' }); // Initiate the autoNumeric input
            expect(console.warn).toHaveBeenCalled();
            const localANInputSettings = localANInput.autoNumeric('getSettings');

            expect(localANInputSettings.decimalPlacesOverride).toEqual(4); // 'decimalPlacesOverride' is not overwritten by a greater decimalPlacesShownOnFocus

            // Tear down
            localANInput.autoNumeric('destroy');
            document.body.removeChild(newInput);
        });

        it(`should set the decimalPlacesOverride value, and show a warning when setting a greater decimalPlacesShownOnFocus`, () => {
            // Setup
            const newInput = document.createElement('input');
            document.body.appendChild(newInput);
            spyOn(console, 'warn'); // The next statement will output a warning since decimalPlacesShownOnFocus is lower than decimalPlacesOverride
            const localANInput = $(newInput).autoNumeric('init', { minimumValue: '-99.99', maximumValue: '99.99', decimalPlacesOverride: '5', decimalPlacesShownOnFocus: '3' }); // Initiate the autoNumeric input
            expect(console.warn).toHaveBeenCalled();
            const localANInputSettings = localANInput.autoNumeric('getSettings');

            expect(localANInputSettings.decimalPlacesOverride).toEqual(5); // 'decimalPlacesOverride' is not overwritten by a greater decimalPlacesShownOnFocus

            // Tear down
            localANInput.autoNumeric('destroy');
            document.body.removeChild(newInput);
        });

        it(`should set the decimalPlacesOverride value when decimalPlacesOverride is not defined, and show a warning when setting a greater decimalPlacesShownOnFocus`, () => {
            // Setup
            const newInput = document.createElement('input');
            document.body.appendChild(newInput);
            spyOn(console, 'warn'); // The next statement will output a warning since decimalPlacesShownOnFocus is lower than decimalPlacesOverride
            const localANInput = $(newInput).autoNumeric('init', { minimumValue: '-99.9999', maximumValue: '99.9999', decimalPlacesShownOnFocus: '3' }); // Initiate the autoNumeric input
            expect(console.warn).toHaveBeenCalled();
            const localANInputSettings = localANInput.autoNumeric('getSettings');

            expect(localANInputSettings.decimalPlacesOverride).toEqual(4); // 'decimalPlacesOverride' is not overwritten by a greater decimalPlacesShownOnFocus

            // Tear down
            localANInput.autoNumeric('destroy');
            document.body.removeChild(newInput);
        });
    });

    xdescribe(`autoNumeric 'getSettings' options`, () => { //FIXME Correct the `rawValue` tests
        let aNInput;
        let newInput;
        const anOptions = { decimalCharacter: ',', digitGroupSeparator: '.' };

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
            aNInput = $(newInput).autoNumeric('init', anOptions); // Initiate the autoNumeric input
        });

        afterEach(() => { // Un-initialization
            aNInput.autoNumeric('destroy');
            document.body.removeChild(newInput);
        });

        it('should return a correct raw value with a point as a decimal character', () => {
            aNInput.autoNumeric('set', '1234.56');
            expect(aNInput.autoNumeric('get')).toEqual('1234.56');
            expect(aNInput.autoNumeric('getNumber')).toEqual(1234.56);
            expect(aNInput.autoNumeric('getSettings').rawValue).toEqual('1234.56');

            aNInput.autoNumeric('set', '-1234.56');
            expect(aNInput.autoNumeric('get')).toEqual('-1234.56');
            expect(aNInput.autoNumeric('getNumber')).toEqual(-1234.56);
            expect(aNInput.autoNumeric('getSettings').rawValue).toEqual('-1234.56');

            aNInput.autoNumeric('set', '1234');
            expect(aNInput.autoNumeric('get')).toEqual('1234');
            expect(aNInput.autoNumeric('getNumber')).toEqual(1234);
            expect(aNInput.autoNumeric('getSettings').rawValue).toEqual('1234');

            aNInput.autoNumeric('set', '-1234');
            expect(aNInput.autoNumeric('get')).toEqual('-1234');
            expect(aNInput.autoNumeric('getNumber')).toEqual(-1234);
            expect(aNInput.autoNumeric('getSettings').rawValue).toEqual('-1234');
        });
    });

//TODO Complete the tests in order to test every single option separately (and in the future ; with and without jQuery)

//-----------------------------------------------------------------------------
//---- Methods

    it('should recognize only a specific list of methods', () => {
        // The 'init' method is implicit tested since we use that to setup those tests
        expect(() => aNInput.autoNumeric('get')).not.toThrow();
        expect(() => aNInput.autoNumeric('getArray')).not.toThrow();
        expect(() => aNInput.autoNumeric('getFormatted')).not.toThrow();
        expect(() => aNInput.autoNumeric('getLocalized')).not.toThrow();
        expect(() => aNInput.autoNumeric('getNumber')).not.toThrow();
        expect(() => aNInput.autoNumeric('getSettings')).not.toThrow();
        expect(() => aNInput.autoNumeric('getString')).not.toThrow();
        expect(() => aNInput.autoNumeric('reSet')).not.toThrow();
        expect(() => aNInput.autoNumeric('set', 1234)).not.toThrow();
        expect(() => aNInput.autoNumeric('set', 1234.56)).not.toThrow();
        expect(() => aNInput.autoNumeric('update', {})).not.toThrow();
        expect(() => aNInput.autoNumeric('unSet')).not.toThrow();
        expect(() => aNInput.autoNumeric('wipe')).not.toThrow();
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

describe(`autoNumeric 'init' method should init with predefined options`, () => {
    let aNInput;
    let newInput;

    it('with French', () => {
        newInput = document.createElement('input');
        document.body.appendChild(newInput);
        aNInput = $(newInput).autoNumeric('init', $.fn.autoNumeric.lang.French); // Initiate the autoNumeric input

        aNInput.autoNumeric('set', '1234567.89');
        expect(aNInput.autoNumeric('get')).toEqual('1234567.89');
        expect(aNInput.autoNumeric('getNumber')).toEqual(1234567.89);
        expect(aNInput.autoNumeric('getFormatted')).toEqual('1.234.567,89\u202f€');

        aNInput.autoNumeric('destroy');
        document.body.removeChild(newInput);
    });

    it('with North American', () => {
        newInput = document.createElement('input');
        document.body.appendChild(newInput);
        aNInput = $(newInput).autoNumeric('init', $.fn.autoNumeric.lang.NorthAmerican); // Initiate the autoNumeric input

        aNInput.autoNumeric('set', '1234567.89');
        expect(aNInput.autoNumeric('get')).toEqual('1234567.89');
        expect(aNInput.autoNumeric('getNumber')).toEqual(1234567.89);
        expect(aNInput.autoNumeric('getFormatted')).toEqual('$1,234,567.89');

        aNInput.autoNumeric('destroy');
        document.body.removeChild(newInput);
    });

    it('with Japanese', () => {
        newInput = document.createElement('input');
        document.body.appendChild(newInput);
        aNInput = $(newInput).autoNumeric('init', $.fn.autoNumeric.lang.Japanese); // Initiate the autoNumeric input

        aNInput.autoNumeric('set', '1234567.89');
        expect(aNInput.autoNumeric('get')).toEqual('1234567.89');
        expect(aNInput.autoNumeric('getNumber')).toEqual(1234567.89);
        expect(aNInput.autoNumeric('getFormatted')).toEqual('¥1,234,567.89');

        aNInput.autoNumeric('destroy');
        document.body.removeChild(newInput);
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

    // Test the showPositiveSign option
    // +1.234,00
    const noneLeft = {
        digitGroupSeparator        : '.',
        decimalCharacter           : ',',
        decimalCharacterAlternative: '.',
        showPositiveSign           : true,
    };

    // 1.234,00+
    const noneSuffix = {
        digitGroupSeparator          : '.',
        decimalCharacter             : ',',
        decimalCharacterAlternative  : '.',
        negativePositiveSignPlacement: 's',
        showPositiveSign             : true,
    };

    // € +1.234,00
    const leftRight = {
        digitGroupSeparator          : '.',
        decimalCharacter             : ',',
        decimalCharacterAlternative  : '.',
        currencySymbol               : '€\u00a0',
        roundingMethod               : 'U',
        negativePositiveSignPlacement: 'r',
        showPositiveSign             : true,
    };

    // +€ 1.234,00
    const leftLeft = {
        digitGroupSeparator          : '.',
        decimalCharacter             : ',',
        decimalCharacterAlternative  : '.',
        currencySymbol               : '€\u00a0',
        roundingMethod               : 'U',
        negativePositiveSignPlacement: 'l',
        showPositiveSign             : true,
    };

    // € 1.234,00+
    const leftSuffix = {
        digitGroupSeparator          : '.',
        decimalCharacter             : ',',
        decimalCharacterAlternative  : '.',
        currencySymbol               : '€\u00a0',
        roundingMethod               : 'U',
        negativePositiveSignPlacement: 's',
        showPositiveSign             : true,
    };

    // 1.234,00+ €
    const rightLeft = {
        digitGroupSeparator          : '.',
        decimalCharacter             : ',',
        decimalCharacterAlternative  : '.',
        currencySymbol               : '\u00a0€',
        currencySymbolPlacement      : 's',
        roundingMethod               : 'U',
        negativePositiveSignPlacement: 'l',
        showPositiveSign             : true,
    };

    // 1.234,00 €+
    const rightRight = {
        digitGroupSeparator          : '.',
        decimalCharacter             : ',',
        decimalCharacterAlternative  : '.',
        currencySymbol               : '\u00a0€',
        currencySymbolPlacement      : 's',
        roundingMethod               : 'U',
        negativePositiveSignPlacement: 'r',
        showPositiveSign             : true,
    };

    // +1.234,00 €
    const rightPrefix = {
        digitGroupSeparator          : '.',
        decimalCharacter             : ',',
        decimalCharacterAlternative  : '.',
        currencySymbol               : '\u00a0€',
        currencySymbolPlacement      : 's',
        roundingMethod               : 'U',
        negativePositiveSignPlacement: 'p',
        showPositiveSign             : true,
    };

    it('should format with showPositiveSign, no currency sign, default placement', () => {
        newInput.value = '1234567.89';
        aNInput = $(newInput).autoNumeric('init', noneLeft);
        expect(aNInput.autoNumeric('get')).toEqual('1234567.89');
        expect(aNInput.autoNumeric('getFormatted')).toEqual('+1.234.567,89');
    });

    it('should format with showPositiveSign, no currency sign, suffix placement', () => {
        newInput.value = '1234567.89';
        aNInput = $(newInput).autoNumeric('init', noneSuffix);
        expect(aNInput.autoNumeric('get')).toEqual('1234567.89');
        expect(aNInput.autoNumeric('getFormatted')).toEqual('1.234.567,89+');
    });

    it('should format with showPositiveSign, left currency sign, right placement', () => {
        newInput.value = '1234567.89';
        aNInput = $(newInput).autoNumeric('init', leftRight);
        expect(aNInput.autoNumeric('get')).toEqual('1234567.89');
        expect(aNInput.autoNumeric('getFormatted')).toEqual('€\u00a0+1.234.567,89');
    });

    it('should format with showPositiveSign, left currency sign, left placement', () => {
        newInput.value = '1234567.89';
        aNInput = $(newInput).autoNumeric('init', leftLeft);
        expect(aNInput.autoNumeric('get')).toEqual('1234567.89');
        expect(aNInput.autoNumeric('getFormatted')).toEqual('+€\u00a01.234.567,89');
    });

    it('should format with showPositiveSign, left currency sign, suffix placement', () => {
        newInput.value = '1234567.89';
        aNInput = $(newInput).autoNumeric('init', leftSuffix);
        expect(aNInput.autoNumeric('get')).toEqual('1234567.89');
        expect(aNInput.autoNumeric('getFormatted')).toEqual('€\u00a01.234.567,89+');
    });

    it('should format with showPositiveSign, right currency sign, left placement', () => {
        newInput.value = '1234567.89';
        aNInput = $(newInput).autoNumeric('init', rightLeft);
        expect(aNInput.autoNumeric('get')).toEqual('1234567.89');
        expect(aNInput.autoNumeric('getFormatted')).toEqual('1.234.567,89+\u00a0€');
    });

    it('should format with showPositiveSign, right currency sign, right placement', () => {
        newInput.value = '1234567.89';
        aNInput = $(newInput).autoNumeric('init', rightRight);
        expect(aNInput.autoNumeric('get')).toEqual('1234567.89');
        expect(aNInput.autoNumeric('getFormatted')).toEqual('1.234.567,89\u00a0€+');
    });

    it('should format with showPositiveSign, right currency sign, prefix placement', () => {
        newInput.value = '1234567.89';
        aNInput = $(newInput).autoNumeric('init', rightPrefix);
        expect(aNInput.autoNumeric('get')).toEqual('1234567.89');
        expect(aNInput.autoNumeric('getFormatted')).toEqual('+1.234.567,89\u00a0€');
    });
});

describe(`autoNumeric 'get', 'getLocalized' and 'getNumber' methods`, () => {
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


    it('should return an unformatted value, (without having any option specified)', () => {
        // With an integer
        aNInput.autoNumeric('set', 0);
        expect(aNInput.autoNumeric('get')).toEqual('0');
        expect(aNInput.autoNumeric('getLocalized')).toEqual('0');
        expect(aNInput.autoNumeric('getNumber')).toEqual(0);

        aNInput.autoNumeric('set', -42);
        expect(aNInput.autoNumeric('get')).toEqual('-42');
        aNInput.autoNumeric('update', { outputFormat: ',-' });
        expect(aNInput.autoNumeric('get')).toEqual('-42');
        expect(aNInput.autoNumeric('getLocalized')).toEqual('42-');
        expect(aNInput.autoNumeric('getNumber')).toEqual(-42);
        aNInput.autoNumeric('update', { outputFormat: '-,' });
        expect(aNInput.autoNumeric('getLocalized')).toEqual('-42');
        expect(aNInput.autoNumeric('getNumber')).toEqual(-42);
        aNInput.autoNumeric('update', { outputFormat: '.-' });
        expect(aNInput.autoNumeric('getLocalized')).toEqual('42-');
        expect(aNInput.autoNumeric('getNumber')).toEqual(-42);
        aNInput.autoNumeric('update', { outputFormat: null });
        expect(aNInput.autoNumeric('getLocalized')).toEqual('-42');
        expect(aNInput.autoNumeric('getNumber')).toEqual(-42);
        aNInput.autoNumeric('update', { outputFormat: 'number' });
        expect(aNInput.autoNumeric('getLocalized')).toEqual(-42);
        expect(aNInput.autoNumeric('getNumber')).toEqual(-42);
        aNInput.autoNumeric('update', { outputFormat: 'string' });
        expect(aNInput.autoNumeric('getLocalized')).toEqual('-42');
        expect(aNInput.autoNumeric('getNumber')).toEqual(-42);

        // With a float
        aNInput.autoNumeric('set', -42.76);
        expect(aNInput.autoNumeric('get')).toEqual('-42.76');
        aNInput.autoNumeric('update', { outputFormat: ',-' });
        expect(aNInput.autoNumeric('get')).toEqual('-42.76');
        expect(aNInput.autoNumeric('getLocalized')).toEqual('42,76-');
        expect(aNInput.autoNumeric('getNumber')).toEqual(-42.76);

        aNInput.autoNumeric('update', { outputFormat: '-,' });
        expect(aNInput.autoNumeric('getLocalized')).toEqual('-42,76');
        expect(aNInput.autoNumeric('getNumber')).toEqual(-42.76);
        aNInput.autoNumeric('update', { outputFormat: '.-' });
        expect(aNInput.autoNumeric('getLocalized')).toEqual('42.76-');
        expect(aNInput.autoNumeric('getNumber')).toEqual(-42.76);
        aNInput.autoNumeric('update', { outputFormat: null });
        expect(aNInput.autoNumeric('getLocalized')).toEqual('-42.76');
        expect(aNInput.autoNumeric('getNumber')).toEqual(-42.76);
        aNInput.autoNumeric('update', { outputFormat: 'number' });
        expect(aNInput.autoNumeric('getLocalized')).toEqual(-42.76);
        expect(aNInput.autoNumeric('getNumber')).toEqual(-42.76);
        aNInput.autoNumeric('update', { outputFormat: 'string' });
        expect(aNInput.autoNumeric('getLocalized')).toEqual('-42.76');
        expect(aNInput.autoNumeric('getNumber')).toEqual(-42.76);
    });

    it('should return an unformatted value (with some options set)', () => {
        // Euros
        aNInput.autoNumeric('update', autoNumericOptionsEuro);
        aNInput.autoNumeric('update', { outputFormat: ',-' });
        aNInput.autoNumeric('set', 0);
        expect(aNInput.autoNumeric('get')).toEqual('0');
        expect(aNInput.autoNumeric('getLocalized')).toEqual('0');
        expect(aNInput.autoNumeric('getNumber')).toEqual(0);
        aNInput.autoNumeric('update', { leadingZero: 'keep' });
        expect(aNInput.autoNumeric('getLocalized')).toEqual('0');
        expect(aNInput.autoNumeric('getNumber')).toEqual(0);

        aNInput.autoNumeric('set', -42);
        expect(aNInput.autoNumeric('get')).toEqual('-42');
        expect(aNInput.autoNumeric('getLocalized')).toEqual('42-');
        expect(aNInput.autoNumeric('getNumber')).toEqual(-42);
        aNInput.autoNumeric('update', { outputFormat: '-,' });
        expect(aNInput.autoNumeric('getLocalized')).toEqual('-42');
        expect(aNInput.autoNumeric('getNumber')).toEqual(-42);
        aNInput.autoNumeric('update', { outputFormat: '.-' });
        expect(aNInput.autoNumeric('getLocalized')).toEqual('42-');
        expect(aNInput.autoNumeric('getNumber')).toEqual(-42);
        aNInput.autoNumeric('update', { outputFormat: null });
        expect(aNInput.autoNumeric('getLocalized')).toEqual('-42');
        expect(aNInput.autoNumeric('getNumber')).toEqual(-42);
        aNInput.autoNumeric('update', { outputFormat: 'number' });
        expect(aNInput.autoNumeric('getLocalized')).toEqual(-42);
        expect(aNInput.autoNumeric('getNumber')).toEqual(-42);
        aNInput.autoNumeric('update', { outputFormat: 'string' });
        expect(aNInput.autoNumeric('getLocalized')).toEqual('-42');
        expect(aNInput.autoNumeric('getNumber')).toEqual(-42);

        aNInput.autoNumeric('set', 1234.56); // Here I also test that setting a positive value after a negative one works ok
        expect(aNInput.autoNumeric('get')).toEqual('1234.56');
        expect(aNInput.autoNumeric('getNumber')).toEqual(1234.56);
        aNInput.autoNumeric('set', 6789012.345);
        expect(aNInput.autoNumeric('get')).toEqual('6789012.35'); // Rounding happens here
        expect(aNInput.autoNumeric('getNumber')).toEqual(6789012.35);

        // Dollars
        aNInput.autoNumeric('update', autoNumericOptionsDollar);
        expect(aNInput.autoNumeric('get')).toEqual('6789012.35'); // First check if updating the options changed the results accordingly
        expect(aNInput.autoNumeric('getNumber')).toEqual(6789012.35);
        aNInput.autoNumeric('set', 1234.56);
        expect(aNInput.autoNumeric('get')).toEqual('1234.56');
        expect(aNInput.autoNumeric('getNumber')).toEqual(1234.56);
        aNInput.autoNumeric('set', 6789012.345);
        expect(aNInput.autoNumeric('get')).toEqual('6789012.35');
        expect(aNInput.autoNumeric('getNumber')).toEqual(6789012.35);
        aNInput.autoNumeric('set', 0);
        expect(aNInput.autoNumeric('get')).toEqual('0');
        expect(aNInput.autoNumeric('getNumber')).toEqual(0);
        aNInput.autoNumeric('set', -42);
        expect(aNInput.autoNumeric('get')).toEqual('-42');
        expect(aNInput.autoNumeric('getNumber')).toEqual(-42);
    });

    it('should return an unformatted value even if the number is bigger than Number.MAX_SAFE_INTEGER', () => {
        if (Number.MAX_SAFE_INTEGER === void(0)) { // Special polyfill case for PhantomJS
            // console.log(`Setting the Number.MAX_SAFE_INTEGER polyfill...`); //DEBUG
            //noinspection JSPrimitiveTypeWrapperUsage
            Number.MAX_SAFE_INTEGER = 9007199254740991;
        }

        aNInput.autoNumeric('update', { maximumValue: '9007199254740991000000' });
        aNInput.autoNumeric('set', Number.MAX_SAFE_INTEGER); // The exact highest safe integer
        expect(aNInput.autoNumeric('get')).toEqual(`${Number.MAX_SAFE_INTEGER}`);
        aNInput.autoNumeric('set', '9007199254740996'); // A bit higher than the biggest safest integer
        expect(aNInput.autoNumeric('get')).toEqual('9007199254740996');
        // Add a test where the user set a very big number (bigger than Number.MAX_SAFE_INTEGER), and check if `get` return the correct number
        aNInput.autoNumeric('set', '9007199254740991000000'); // A very big number
        expect(aNInput.autoNumeric('get')).toEqual('9007199254740991000000');
    });
});

describe(`autoNumeric 'get' methods`, () => {
    it(`should return an empty string as the default value`, () => {
        const newInput = document.createElement('input');
        document.body.appendChild(newInput);
        const aNInput = $(newInput).autoNumeric('init'); // Initiate the autoNumeric input

        expect(aNInput.autoNumeric('get')).toEqual('');
    });

    it(`should return '0' as the default value`, () => {
        const newInput = document.createElement('input');
        document.body.appendChild(newInput);
        const aNInput = $(newInput).autoNumeric('init', { emptyInputBehavior : 'zero' }); // Initiate the autoNumeric input

        expect(aNInput.autoNumeric('get')).toEqual('0');
    });

    it(`should not return a negative value when inputting a positive one and minimumValue is equal to '0' (cf. issue #284)`, () => {
        const newInput = document.createElement('input');
        document.body.appendChild(newInput);
        spyOn(console, 'warn');
        const aNInput = $(newInput).autoNumeric('init', { minimumValue: '0', maximumValue: '9999', decimalPlacesOverride: '2' }); // Initiate the autoNumeric input
        expect(console.warn).toHaveBeenCalled();

        expect(aNInput.autoNumeric('get')).toEqual('');
        aNInput.autoNumeric('set', 1234);
        expect(aNInput.autoNumeric('get')).toEqual('1234');
        aNInput.autoNumeric('set', 0);
        expect(aNInput.autoNumeric('get')).toEqual('0');
        aNInput.autoNumeric('set', -0);
        expect(aNInput.autoNumeric('get')).toEqual('0');

        aNInput.autoNumeric('destroy');
        document.body.removeChild(newInput);
    });

    it(`should not return a negative value when inputting a positive one and minimumValue is superior to '0' (cf. issue #284)`, () => {
        const newInput = document.createElement('input');
        document.body.appendChild(newInput);
        spyOn(console, 'warn');
        const aNInput = $(newInput).autoNumeric('init', { minimumValue: '1', maximumValue: '9999', decimalPlacesOverride: '2' }); // Initiate the autoNumeric input
        expect(console.warn).toHaveBeenCalled();

        expect(aNInput.autoNumeric('get')).toEqual('');
        aNInput.autoNumeric('set', 1234);
        expect(aNInput.autoNumeric('get')).toEqual('1234');

        aNInput.autoNumeric('destroy');
        document.body.removeChild(newInput);
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

    it('should set a formatted value and result in a formatted value', () => {
        // Euros
        aNInput.autoNumeric('update', autoNumericOptionsEuro);
        aNInput.autoNumeric('set', '1.234,56');
        expect(aNInput.autoNumeric('getFormatted')).toEqual('1.234,56 €');
        aNInput.autoNumeric('set', '6.789.012,345');
        expect(aNInput.autoNumeric('getFormatted')).toEqual('6.789.012,35 €'); // Rounding happens here

        // Dollars
        aNInput.autoNumeric('update', autoNumericOptionsDollar);
        expect(aNInput.autoNumeric('getFormatted')).toEqual('$6,789,012.35'); // First check if updating the options changed the results accordingly
        aNInput.autoNumeric('set', '1,234.56');
        expect(aNInput.autoNumeric('getFormatted')).toEqual('$1,234.56');
        aNInput.autoNumeric('set', '6,789,012.345');
        expect(aNInput.autoNumeric('getFormatted')).toEqual('$6,789,012.35');
    });

    it('should respect the minimumValue and maximumValue settings', () => {
        aNInput.autoNumeric('update', { minimumValue: '999999.99', maximumValue: '1111111111111.11' });
        expect(() => aNInput.autoNumeric('set', 999999.99)).not.toThrow();
        expect(() => aNInput.autoNumeric('set', 1111111111111.11)).not.toThrow();

        expect(() => aNInput.autoNumeric('set', 999999.984)).toThrow(); // Min, with rounding up
        expect(() => aNInput.autoNumeric('set', 999999.989)).toThrow(); // Min, even without rounding
        expect(() => aNInput.autoNumeric('set', 999999.991)).not.toThrow();
        expect(() => aNInput.autoNumeric('set', 1111111111111.109)).not.toThrow();
        expect(() => aNInput.autoNumeric('set', 1111111111111.111)).toThrow(); // Max
    });

    it('should respect the minimumValue and maximumValue settings', () => {
        aNInput.autoNumeric('update', { minimumValue: '999999.99', maximumValue: '1111111111111.11' });
        expect(() => aNInput.autoNumeric('set', 999999.99)).not.toThrow();
        expect(() => aNInput.autoNumeric('set', 1111111111111.11)).not.toThrow();

        expect(() => aNInput.autoNumeric('set', 999999.984)).toThrow(); // Min, with rounding up
        expect(() => aNInput.autoNumeric('set', 999999.989)).toThrow(); // Min, even without rounding
        expect(() => aNInput.autoNumeric('set', 999999.991)).not.toThrow();
        expect(() => aNInput.autoNumeric('set', 1111111111111.109)).not.toThrow();
        expect(() => aNInput.autoNumeric('set', 1111111111111.111)).toThrow(); // Max
    });

    it('should respect the minimumValue and maximumValue settings', () => {
        aNInput.autoNumeric('update', { minimumValue: '999999.99', maximumValue: '1111111111111.11' });
        expect(() => aNInput.autoNumeric('set', 999999.99)).not.toThrow();
        expect(() => aNInput.autoNumeric('set', 1111111111111.11)).not.toThrow();

        expect(() => aNInput.autoNumeric('set', 999999.984)).toThrow(); // Min, with rounding up
        expect(() => aNInput.autoNumeric('set', 999999.989)).toThrow(); // Min, even without rounding
        expect(() => aNInput.autoNumeric('set', 999999.991)).not.toThrow();
        expect(() => aNInput.autoNumeric('set', 1111111111111.109)).not.toThrow();
        expect(() => aNInput.autoNumeric('set', 1111111111111.111)).toThrow(); // Max
    });
});

describe('`set` and non-ascii numbers', () => {
    let aNInput;
    let newInput;

    beforeEach(() => { // Initialization
        newInput = document.createElement('input');
        document.body.appendChild(newInput);
        aNInput = $(newInput).autoNumeric('init', { digitGroupSeparator : ',', decimalCharacter : '.' }); // Initiate the autoNumeric input
    });

    afterEach(() => { // Un-initialization
        aNInput.autoNumeric('destroy');
        document.body.removeChild(newInput);
    });

    it('should accepts Arabic numbers', () => {
        expect(aNInput.autoNumeric('get')).toEqual('');
        aNInput.autoNumeric('set', '١٠٢٣٤٥٦٧.٨٩');
        expect(aNInput.autoNumeric('get')).toEqual('10234567.89');
        expect(aNInput.autoNumeric('getNumber')).toEqual(10234567.89);
        expect(aNInput.autoNumeric('getFormatted')).toEqual('10,234,567.89');
    });

    it('should accepts Persian numbers', () => {
        expect(aNInput.autoNumeric('get')).toEqual('');
        aNInput.autoNumeric('set', '۱٠۲۳۴۵۶۷.۸۹');
        expect(aNInput.autoNumeric('get')).toEqual('10234567.89');
        expect(aNInput.autoNumeric('getNumber')).toEqual(10234567.89);
        expect(aNInput.autoNumeric('getFormatted')).toEqual('10,234,567.89');
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
        const anOptions = { digitGroupSeparator: '.', decimalCharacter: ',', currencySymbol: '€ ' };
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
    describe('`autoUnformat` should unformat using jQuery `$.fn`', () => {
        it('with default options', () => {
            expect($.fn.autoUnformat('$1,234,567.89')).toEqual('1234567.89');
            expect($.fn.autoUnformat('$1,234.56')).toEqual('1234.56');
            expect($.fn.autoUnformat('$123.45')).toEqual('123.45');
            expect($.fn.autoUnformat('$0.00')).toEqual('0.00');

            expect($.fn.autoUnformat('$1,234.56', { outputFormat : 'number' })).toEqual(1234.56);
            expect($.fn.autoUnformat('$123.45', { outputFormat : 'number' })).toEqual(123.45);
            expect($.fn.autoUnformat('$0.00', { outputFormat : 'number' })).toEqual(0);
            expect($.fn.autoUnformat(null)).toEqual(null);
        });

        it('with user options', () => {
            expect($.fn.autoUnformat('1.234.567,89 €', autoNumericOptionsEuroNumber)).toEqual(1234567.89);
            expect($.fn.autoUnformat('1.234,56 €', autoNumericOptionsEuroNumber)).toEqual(1234.56);
            expect($.fn.autoUnformat('123,45 €', autoNumericOptionsEuroNumber)).toEqual(123.45);
            expect($.fn.autoUnformat('0,00 €', autoNumericOptionsEuroNumber)).toEqual(0);

            expect($.fn.autoUnformat('1.234,56 €', autoNumericOptionsEuro)).toEqual('1234.56');
            expect($.fn.autoUnformat('123,45 €', autoNumericOptionsEuro)).toEqual('123.45');
            expect($.fn.autoUnformat('0,00 €', autoNumericOptionsEuro)).toEqual('0.00');
            expect($.fn.autoUnformat(null, autoNumericOptionsEuro)).toEqual(null);
        });
    });

    describe('`unFormat` should unformat without jQuery `$.fn`', () => {
        it('with default options', () => {
            expect(an.unFormat('$1,234,567.89')).toEqual('1234567.89');
            expect(an.unFormat('$1,234.56')).toEqual('1234.56');
            expect(an.unFormat('$123.45')).toEqual('123.45');
            expect(an.unFormat('$0.00')).toEqual('0.00');

            expect(an.unFormat('$1,234.56', { outputFormat : 'number' })).toEqual(1234.56);
            expect(an.unFormat('$123.45', { outputFormat : 'number' })).toEqual(123.45);
            expect(an.unFormat('$0.00', { outputFormat : 'number' })).toEqual(0);
            expect(an.unFormat(null)).toEqual(null);
            expect(an.unFormat(1234.56, { outputFormat : 'number' })).toEqual(1234.56);
            expect(an.unFormat(0, { outputFormat : 'number' })).toEqual(0);
        });

        it('with user options', () => {
            expect(an.unFormat('1.234.567,89 €', autoNumericOptionsEuroNumber)).toEqual(1234567.89);
            expect(an.unFormat('1.234,56 €', autoNumericOptionsEuroNumber)).toEqual(1234.56);
            expect(an.unFormat('123,45 €', autoNumericOptionsEuroNumber)).toEqual(123.45);
            expect(an.unFormat('0,00 €', autoNumericOptionsEuroNumber)).toEqual(0);

            expect(an.unFormat('1.234,56 €', autoNumericOptionsEuro)).toEqual('1234.56');
            expect(an.unFormat('123,45 €', autoNumericOptionsEuro)).toEqual('123.45');
            expect(an.unFormat('0,00 €', autoNumericOptionsEuro)).toEqual('0.00');
            expect(an.unFormat(null, autoNumericOptionsEuro)).toEqual(null);
        });

        it(`and return a 'real' number, whatever options are passed as an argument`, () => {
            expect(an.unFormat(1234.56)).toEqual(1234.56);
            expect(an.unFormat(0)).toEqual(0);

            // Giving an unformatted value should return the same unformatted value, whatever the options passed as a parameter
            expect(an.unFormat(1234.56, autoNumericOptionsEuro)).toEqual(1234.56);
        });

        it('should only send a warning, and not throw', () => {
            spyOn(console, 'warn');
            expect(() => an.validate({ decimalPlacesOverride: '3', decimalPlacesShownOnFocus: '2' })).not.toThrow();
            expect(console.warn).toHaveBeenCalled();
        });
    });

    describe('`autoFormat` should format using jQuery `$.fn`', () => {
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

    describe('`format` should format without jQuery `$.fn`', () => {
        it('with default options', () => {
            expect(an.format(1234.56)).toEqual('1,234.56');
            expect(an.format('1234.56')).toEqual('1,234.56');
            expect(an.format(123.45)).toEqual('123.45');
            expect(an.format('1234,56')).toEqual('123,456.00'); // By default, ',' is a group separator, which gets removed
            expect(an.format('1.234,56')).toEqual('1.23'); // By default, '.' is the decimal separator
            expect(an.format(0)).toEqual('0.00');
            expect(an.format(null)).toEqual(null);
            expect(an.format(undefined)).toEqual(null);
        });

        it('with user options', () => {
            expect(an.format(1234.56, autoNumericOptionsEuro)).toEqual('1.234,56 €');
            expect(an.format('1.234,56 €', autoNumericOptionsEuro)).toEqual('1.234,56 €');
            expect(an.format('1234.56', autoNumericOptionsEuro)).toEqual('1.234,56 €');
            expect(an.format(123.45, autoNumericOptionsEuro)).toEqual('123,45 €');
            expect(an.format('123,45 €', autoNumericOptionsEuro)).toEqual('123,45 €');
            expect(an.format(0, autoNumericOptionsEuro)).toEqual('0,00 €');

            expect(an.format(1234.56, autoNumericOptionsDollar)).toEqual('$1,234.56');
            expect(an.format(123.45, autoNumericOptionsDollar)).toEqual('$123.45');
            expect(an.format('$1,234.56', autoNumericOptionsDollar)).toEqual('$1,234.56');
            expect(an.format('$123.45', autoNumericOptionsDollar)).toEqual('$123.45');

            expect(an.format(null, autoNumericOptionsEuro)).toEqual(null);
            expect(an.format(undefined, autoNumericOptionsEuro)).toEqual(null);
        });

        it('should only send a warning, and not throw', () => {
            spyOn(console, 'warn');
            expect(() => an.validate({ decimalPlacesOverride: '3', decimalPlacesShownOnFocus: '2' })).not.toThrow();
            expect(console.warn).toHaveBeenCalled();
        });
    });

    it('`format` should fail formatting wrong parameters', () => {
        spyOn(console, 'warn');
        expect(() => an.format('foobar')).toThrow();
        expect(() => an.format([1234])).toThrow();
        expect(() => an.format({})).toThrow();
        expect(() => an.format({ val: 1234 })).toThrow();
        expect(() => an.format([])).toThrow();
        expect(console.warn).toHaveBeenCalledTimes(1);
    });

    it('`format` should fail when trying to format a localized string with the wrong options', () => {
        spyOn(console, 'warn');
        expect(() => an.format('$1,234.56', autoNumericOptionsEuro)).toThrow();
        expect(() => an.format('$123.45', autoNumericOptionsEuro)).toThrow();
        expect(() => an.format('1.234,56 €', autoNumericOptionsDollar)).toThrow();
        expect(() => an.format('123,45 €', autoNumericOptionsDollar)).toThrow();
        expect(console.warn).toHaveBeenCalledTimes(4);
    });

    it('`unFormat` should fail unformatting wrong parameters', () => {
        // expect(() => an.unFormat('foobar')).toThrow(); //FIXME This should throw
        expect(() => an.unFormat([1234])).toThrow();
        expect(() => an.unFormat({})).toThrow();
        expect(() => an.unFormat({ val: 1234 })).toThrow();
        expect(() => an.unFormat([])).toThrow();
    });

    describe('`validate` (without jQuery `$.fn`)', () => {
        it('should validate any old setting name, while outputting a warning', () => {
            const oldOptionObject = { aSep: ' ' };
            // Test if a warning is written in the console
            spyOn(console, 'warn');
            expect(() => an.validate(oldOptionObject)).not.toThrow();
            /* eslint no-console: 0 */
            expect(console.warn).toHaveBeenCalled();

            // We make sure that the initial option object is modified accordingly
            expect(oldOptionObject).toEqual({ digitGroupSeparator: ' ' });
        });

        it('should validate multiple old setting names, while outputting as many warnings as needed', () => {
            const oldOptionObject = { aSep: ' ', aDec: ',', altDec: '.', aSign: ' €' };
            // Test if a warning is written in the console
            spyOn(console, 'warn');
            expect(() => an.validate(oldOptionObject)).not.toThrow();
            /* eslint no-console: 0 */
            expect(console.warn).toHaveBeenCalled();
            expect(console.warn).toHaveBeenCalledTimes(4);

            // We make sure that the initial option object is modified accordingly
            expect(oldOptionObject).toEqual({ digitGroupSeparator: ' ', decimalCharacter: ',', decimalCharacterAlternative: '.', currencySymbol: ' €' });
        });

        it('should throw when using a unknown option name, if `failOnUnknownOption` is set to `TRUE`', () => {
            expect(() => an.validate({ failOnUnknownOption: true, foobar: '.' })).toThrow();
        });

        it('should not throw when using a unknown option name, if `failOnUnknownOption` is set to `FALSE`', () => {
            expect(() => an.validate({ foobar: '.' })).not.toThrow();
        });

        it('should validate', () => {
            expect(() => an.validate(autoNumericOptionsEuro)).not.toThrow();
            expect(() => an.validate(autoNumericOptionsDollar)).not.toThrow();

            expect(() => an.validate({ digitGroupSeparator: ',' })).not.toThrow();
            expect(() => an.validate({ digitGroupSeparator: '.',  decimalCharacter: ',' })).not.toThrow();
            expect(() => an.validate({ digitGroupSeparator: ' ' })).not.toThrow();
            expect(() => an.validate({ digitGroupSeparator: '\u2009' })).not.toThrow(); // Thin-space
            expect(() => an.validate({ digitGroupSeparator: '\u202f' })).not.toThrow(); // Narrow no-break space
            expect(() => an.validate({ digitGroupSeparator: '\u00a0' })).not.toThrow(); // No-break space
            expect(() => an.validate({ digitGroupSeparator: '' })).not.toThrow();
            expect(() => an.validate({ digitGroupSeparator: "'" })).not.toThrow();
            expect(() => an.validate({ digitGroupSeparator: '٬' })).not.toThrow();
            expect(() => an.validate({ digitGroupSeparator: '˙' })).not.toThrow();

            expect(() => an.validate({ noSeparatorOnFocus: false })).not.toThrow();
            expect(() => an.validate({ noSeparatorOnFocus: true })).not.toThrow();
            expect(() => an.validate({ noSeparatorOnFocus: 'false' })).not.toThrow();
            expect(() => an.validate({ noSeparatorOnFocus: 'true' })).not.toThrow();

            expect(() => an.validate({ digitalGroupSpacing: '2' })).not.toThrow();
            expect(() => an.validate({ digitalGroupSpacing: '3' })).not.toThrow();
            expect(() => an.validate({ digitalGroupSpacing: 4 })).not.toThrow();

            expect(() => an.validate({ decimalCharacter: ',', digitGroupSeparator: ' ' })).not.toThrow();
            expect(() => an.validate({ decimalCharacter: '.' })).not.toThrow();
            expect(() => an.validate({ decimalCharacter: '·' })).not.toThrow();
            expect(() => an.validate({ decimalCharacter: '٫' })).not.toThrow();
            expect(() => an.validate({ decimalCharacter: '⎖' })).not.toThrow();

            expect(() => an.validate({ decimalCharacterAlternative: null })).not.toThrow();
            expect(() => an.validate({ decimalCharacterAlternative: 'longSeparator' })).not.toThrow();

            expect(() => an.validate({ currencySymbol: ' €' })).not.toThrow();
            expect(() => an.validate({ currencySymbol: '' })).not.toThrow();
            expect(() => an.validate({ currencySymbol: 'foobar' })).not.toThrow();

            expect(() => an.validate({ currencySymbolPlacement: 'p' })).not.toThrow();
            expect(() => an.validate({ currencySymbolPlacement: 's' })).not.toThrow();

            expect(() => an.validate({ negativePositiveSignPlacement: 'p' })).not.toThrow();
            expect(() => an.validate({ negativePositiveSignPlacement: 's' })).not.toThrow();
            expect(() => an.validate({ negativePositiveSignPlacement: 'l' })).not.toThrow();
            expect(() => an.validate({ negativePositiveSignPlacement: 'r' })).not.toThrow();
            expect(() => an.validate({ negativePositiveSignPlacement: null })).not.toThrow();

            expect(() => an.validate({ showPositiveSign: true })).not.toThrow();
            expect(() => an.validate({ showPositiveSign: false })).not.toThrow();
            expect(() => an.validate({ showPositiveSign: 'true' })).not.toThrow();
            expect(() => an.validate({ showPositiveSign: 'false' })).not.toThrow();

            expect(() => an.validate({ suffixText: '' })).not.toThrow();
            expect(() => an.validate({ suffixText: 'foobar' })).not.toThrow();
            expect(() => an.validate({ suffixText: ' foobar' })).not.toThrow();
            expect(() => an.validate({ suffixText: 'foo bar' })).not.toThrow();
            expect(() => an.validate({ suffixText: 'foobar ' })).not.toThrow();

            expect(() => an.validate({ overrideMinMaxLimits: null })).not.toThrow();
            expect(() => an.validate({ overrideMinMaxLimits: 'ceiling' })).not.toThrow();
            expect(() => an.validate({ overrideMinMaxLimits: 'floor' })).not.toThrow();
            expect(() => an.validate({ overrideMinMaxLimits: 'ignore' })).not.toThrow();

            expect(() => an.validate({ maximumValue: '42' })).not.toThrow();
            expect(() => an.validate({ maximumValue: '42.4' })).not.toThrow();
            expect(() => an.validate({ maximumValue: '42.42' })).not.toThrow();
            expect(() => an.validate({ maximumValue: '-42' })).not.toThrow();
            expect(() => an.validate({ maximumValue: '-42.4' })).not.toThrow();
            expect(() => an.validate({ maximumValue: '-42.42' })).not.toThrow();
            expect(() => an.validate({ maximumValue: '9999999999999.99' })).not.toThrow();
            expect(() => an.validate({ maximumValue: '-9999999999999.99' })).not.toThrow();

            expect(() => an.validate({ minimumValue: '42' })).not.toThrow();
            expect(() => an.validate({ minimumValue: '42.4' })).not.toThrow();
            expect(() => an.validate({ minimumValue: '42.42' })).not.toThrow();
            expect(() => an.validate({ minimumValue: '-42' })).not.toThrow();
            expect(() => an.validate({ minimumValue: '-42.4' })).not.toThrow();
            expect(() => an.validate({ minimumValue: '-42.42' })).not.toThrow();
            expect(() => an.validate({ minimumValue: '9999999999999.99' })).not.toThrow();
            expect(() => an.validate({ minimumValue: '-9999999999999.99' })).not.toThrow();

            expect(() => an.validate({ minimumValue: '-10', maximumValue: '-5' })).not.toThrow();
            expect(() => an.validate({ minimumValue: '-10', maximumValue:  '0' })).not.toThrow();
            expect(() => an.validate({ minimumValue: '-10', maximumValue: '20' })).not.toThrow();
            expect(() => an.validate({ minimumValue:   '0', maximumValue: '20' })).not.toThrow();
            expect(() => an.validate({ minimumValue:  '10', maximumValue: '20' })).not.toThrow();

            expect(() => an.validate({ decimalPlacesOverride: null })).not.toThrow();
            expect(() => an.validate({ decimalPlacesOverride: '2' })).not.toThrow();

            expect(() => an.validate({ decimalPlacesShownOnFocus: null })).not.toThrow();
            expect(() => an.validate({ decimalPlacesShownOnFocus: '0' })).not.toThrow();
            expect(() => an.validate({ decimalPlacesShownOnFocus: '2' })).not.toThrow();
            expect(() => an.validate({ decimalPlacesShownOnFocus: '15' })).not.toThrow();

            expect(() => an.validate({ decimalPlacesOverride: '2', decimalPlacesShownOnFocus: '2' })).not.toThrow();
            expect(() => an.validate({ decimalPlacesOverride: '2', decimalPlacesShownOnFocus: '3' })).not.toThrow();

            expect(() => an.validate({ scaleDivisor: null })).not.toThrow();
            expect(() => an.validate({ scaleDivisor: '100' })).not.toThrow();
            expect(() => an.validate({ scaleDivisor: 100 })).not.toThrow();
            expect(() => an.validate({ scaleDivisor: 45.89 })).not.toThrow();

            expect(() => an.validate({ scaleDecimalPlaces: null })).not.toThrow();
            expect(() => an.validate({ scaleDecimalPlaces: 0 })).not.toThrow();
            expect(() => an.validate({ scaleDecimalPlaces: 2 })).not.toThrow();

            expect(() => an.validate({ scaleSymbol: null })).not.toThrow();
            expect(() => an.validate({ scaleSymbol: '' })).not.toThrow();
            expect(() => an.validate({ scaleSymbol: 'foobar' })).not.toThrow();
            expect(() => an.validate({ scaleSymbol: 'foo bar' })).not.toThrow();
            expect(() => an.validate({ scaleSymbol: ' foobar' })).not.toThrow();
            expect(() => an.validate({ scaleSymbol: 'foobar ' })).not.toThrow();

            expect(() => an.validate({ saveValueToSessionStorage: true })).not.toThrow();
            expect(() => an.validate({ saveValueToSessionStorage: false })).not.toThrow();
            expect(() => an.validate({ saveValueToSessionStorage: 'true' })).not.toThrow();
            expect(() => an.validate({ saveValueToSessionStorage: 'false' })).not.toThrow();

            expect(() => an.validate({ onInvalidPaste: 'error' })).not.toThrow();
            expect(() => an.validate({ onInvalidPaste: 'ignore' })).not.toThrow();
            expect(() => an.validate({ onInvalidPaste: 'clamp' })).not.toThrow();
            expect(() => an.validate({ onInvalidPaste: 'truncate' })).not.toThrow();
            expect(() => an.validate({ onInvalidPaste: 'replace' })).not.toThrow();

            expect(() => an.validate({ roundingMethod: 'S' })).not.toThrow();
            expect(() => an.validate({ roundingMethod: 'A' })).not.toThrow();
            expect(() => an.validate({ roundingMethod: 's' })).not.toThrow();
            expect(() => an.validate({ roundingMethod: 'a' })).not.toThrow();
            expect(() => an.validate({ roundingMethod: 'B' })).not.toThrow();
            expect(() => an.validate({ roundingMethod: 'U' })).not.toThrow();
            expect(() => an.validate({ roundingMethod: 'D' })).not.toThrow();
            expect(() => an.validate({ roundingMethod: 'C' })).not.toThrow();
            expect(() => an.validate({ roundingMethod: 'F' })).not.toThrow();
            expect(() => an.validate({ roundingMethod: 'N05' })).not.toThrow();
            expect(() => an.validate({ roundingMethod: 'CHF' })).not.toThrow();
            expect(() => an.validate({ roundingMethod: 'U05' })).not.toThrow();
            expect(() => an.validate({ roundingMethod: 'D05' })).not.toThrow();

            expect(() => an.validate({ allowDecimalPadding: true })).not.toThrow();
            expect(() => an.validate({ allowDecimalPadding: false })).not.toThrow();
            expect(() => an.validate({ allowDecimalPadding: 'true' })).not.toThrow();
            expect(() => an.validate({ allowDecimalPadding: 'false' })).not.toThrow();

            expect(() => an.validate({ negativeBracketsTypeOnBlur: null })).not.toThrow();
            expect(() => an.validate({ negativeBracketsTypeOnBlur: '(,)' })).not.toThrow();
            expect(() => an.validate({ negativeBracketsTypeOnBlur: '[,]' })).not.toThrow();
            expect(() => an.validate({ negativeBracketsTypeOnBlur: '<,>' })).not.toThrow();
            expect(() => an.validate({ negativeBracketsTypeOnBlur: '{,}' })).not.toThrow();

            expect(() => an.validate({ emptyInputBehavior: 'focus' })).not.toThrow();
            expect(() => an.validate({ emptyInputBehavior: 'press' })).not.toThrow();
            expect(() => an.validate({ emptyInputBehavior: 'always' })).not.toThrow();
            expect(() => an.validate({ emptyInputBehavior: 'zero' })).not.toThrow();

            expect(() => an.validate({ leadingZero: 'allow' })).not.toThrow();
            expect(() => an.validate({ leadingZero: 'deny' })).not.toThrow();
            expect(() => an.validate({ leadingZero: 'keep' })).not.toThrow();

            expect(() => an.validate({ formatOnPageLoad: true })).not.toThrow();
            expect(() => an.validate({ formatOnPageLoad: false })).not.toThrow();
            expect(() => an.validate({ formatOnPageLoad: 'true' })).not.toThrow();
            expect(() => an.validate({ formatOnPageLoad: 'false' })).not.toThrow();

            expect(() => an.validate({ selectNumberOnly: true })).not.toThrow();
            expect(() => an.validate({ selectNumberOnly: false })).not.toThrow();
            expect(() => an.validate({ selectNumberOnly: 'true' })).not.toThrow();
            expect(() => an.validate({ selectNumberOnly: 'false' })).not.toThrow();

            expect(() => an.validate({ defaultValueOverride: null })).not.toThrow();
            expect(() => an.validate({ defaultValueOverride: '' })).not.toThrow();
            expect(() => an.validate({ defaultValueOverride: '42' })).not.toThrow();
            expect(() => an.validate({ defaultValueOverride: '-42' })).not.toThrow();
            expect(() => an.validate({ defaultValueOverride: '42.99' })).not.toThrow();
            expect(() => an.validate({ defaultValueOverride: '-42.99' })).not.toThrow();
            expect(() => an.validate({ defaultValueOverride: 5 })).not.toThrow();
            expect(() => an.validate({ defaultValueOverride: -5 })).not.toThrow();

            expect(() => an.validate({ unformatOnSubmit: true })).not.toThrow();
            expect(() => an.validate({ unformatOnSubmit: false })).not.toThrow();
            expect(() => an.validate({ unformatOnSubmit: 'true' })).not.toThrow();
            expect(() => an.validate({ unformatOnSubmit: 'false' })).not.toThrow();

            expect(() => an.validate({ outputFormat: null })).not.toThrow();
            expect(() => an.validate({ outputFormat: 'string' })).not.toThrow();
            expect(() => an.validate({ outputFormat: 'number' })).not.toThrow();
            expect(() => an.validate({ outputFormat: '.' })).not.toThrow();
            expect(() => an.validate({ outputFormat: '-.' })).not.toThrow();
            expect(() => an.validate({ outputFormat: ',' })).not.toThrow();
            expect(() => an.validate({ outputFormat: '-,' })).not.toThrow();
            expect(() => an.validate({ outputFormat: '.-' })).not.toThrow();
            expect(() => an.validate({ outputFormat: ',-' })).not.toThrow();

            expect(() => an.validate({ showWarnings: true })).not.toThrow();
            expect(() => an.validate({ showWarnings: false })).not.toThrow();
            expect(() => an.validate({ showWarnings: 'true' })).not.toThrow();
            expect(() => an.validate({ showWarnings: 'false' })).not.toThrow();

            expect(() => an.validate({ failOnUnknownOption: true })).not.toThrow();
            expect(() => an.validate({ failOnUnknownOption: false })).not.toThrow();
            expect(() => an.validate({ failOnUnknownOption: 'true' })).not.toThrow();
            expect(() => an.validate({ failOnUnknownOption: 'false' })).not.toThrow();
        });

        it('should validate, with warnings', () => {
            spyOn(console, 'warn');
            expect(() => an.validate({ decimalPlacesOverride: '0' })).not.toThrow();
            expect(() => an.validate({ decimalPlacesOverride: '15' })).not.toThrow();
            expect(() => an.validate({ decimalPlacesOverride: 5 })).not.toThrow();

            expect(() => an.validate({ decimalPlacesOverride: '3', decimalPlacesShownOnFocus: '2' })).not.toThrow(); // This will output 2 warnings
            expect(() => an.validate({ decimalPlacesOverride: '2', minimumValue: '0', maximumValue: '20' })).not.toThrow(); // This will output a warning

            expect(() => an.validate({ allowDecimalPadding: false, decimalPlacesOverride: '2' })).not.toThrow(); // This will output a warning
            expect(console.warn).toHaveBeenCalled();
            expect(console.warn).toHaveBeenCalledTimes(7);
        });

        it('should not validate', () => {
            expect(() => an.validate(0)).toThrow();
            expect(() => an.validate(undefined)).toThrow();
            expect(() => an.validate(null)).toThrow();
            expect(() => an.validate('')).toThrow();
            expect(() => an.validate([])).toThrow();
            expect(() => an.validate({})).toThrow();
            expect(() => an.validate([{ digitGroupSeparator: '.' }])).toThrow();
            expect(() => an.validate('foobar')).toThrow();
            expect(() => an.validate(42)).toThrow();

            expect(() => an.validate({ digitGroupSeparator: '-' })).toThrow();
            expect(() => an.validate({ digitGroupSeparator: '"' })).toThrow();
            expect(() => an.validate({ digitGroupSeparator: 'a' })).toThrow();
            expect(() => an.validate({ digitGroupSeparator: 42 })).toThrow();
            expect(() => an.validate({ digitGroupSeparator: '.' })).toThrow(); // Since the default 'decimalCharacter' is '.' too
            expect(() => an.validate({ digitGroupSeparator: true })).toThrow();
            expect(() => an.validate({ digitGroupSeparator: null })).toThrow();

            expect(() => an.validate({ noSeparatorOnFocus: 'foobar' })).toThrow();
            expect(() => an.validate({ noSeparatorOnFocus: 42 })).toThrow();
            expect(() => an.validate({ noSeparatorOnFocus: null })).toThrow();

            expect(() => an.validate({ digitalGroupSpacing: '37foo' })).toThrow();
            expect(() => an.validate({ digitalGroupSpacing: null })).toThrow();

            expect(() => an.validate({ decimalCharacter: 'foobar' })).toThrow();
            expect(() => an.validate({ decimalCharacter: true })).toThrow();
            expect(() => an.validate({ decimalCharacter: 42 })).toThrow();
            expect(() => an.validate({ decimalCharacter: '.', digitGroupSeparator: '.' })).toThrow();
            expect(() => an.validate({ decimalCharacter: ',', digitGroupSeparator: ',' })).toThrow();

            expect(() => an.validate({ decimalCharacterAlternative: 42 })).toThrow();
            expect(() => an.validate({ decimalCharacterAlternative: true })).toThrow();
            expect(() => an.validate({ decimalCharacterAlternative: ['foobar'] })).toThrow();

            expect(() => an.validate({ currencySymbol: [] })).toThrow();
            expect(() => an.validate({ currencySymbol: 42 })).toThrow();
            expect(() => an.validate({ currencySymbol: true })).toThrow();
            expect(() => an.validate({ currencySymbol: null })).toThrow();

            expect(() => an.validate({ currencySymbolPlacement: ['s'] })).toThrow();
            expect(() => an.validate({ currencySymbolPlacement: 42 })).toThrow();
            expect(() => an.validate({ currencySymbolPlacement: true })).toThrow();
            expect(() => an.validate({ currencySymbolPlacement: null })).toThrow();
            expect(() => an.validate({ currencySymbolPlacement: 'foobar' })).toThrow();

            expect(() => an.validate({ negativePositiveSignPlacement: ['r'] })).toThrow();
            expect(() => an.validate({ negativePositiveSignPlacement: 42 })).toThrow();
            expect(() => an.validate({ negativePositiveSignPlacement: true })).toThrow();
            expect(() => an.validate({ negativePositiveSignPlacement: 'foobar' })).toThrow();

            expect(() => an.validate({ showPositiveSign: 0 })).toThrow();
            expect(() => an.validate({ showPositiveSign: 1 })).toThrow();
            expect(() => an.validate({ showPositiveSign: '0' })).toThrow();
            expect(() => an.validate({ showPositiveSign: '1' })).toThrow();
            expect(() => an.validate({ showPositiveSign: 'foobar' })).toThrow();

            expect(() => an.validate({ suffixText: '-foobar' })).toThrow();
            expect(() => an.validate({ suffixText: 'foo-bar' })).toThrow();
            expect(() => an.validate({ suffixText: 'foo42bar' })).toThrow();
            expect(() => an.validate({ suffixText: '42foobar' })).toThrow();
            expect(() => an.validate({ suffixText: 'foobar42' })).toThrow();
            expect(() => an.validate({ suffixText: 42 })).toThrow();
            expect(() => an.validate({ suffixText: -42 })).toThrow();
            expect(() => an.validate({ suffixText: true })).toThrow();
            expect(() => an.validate({ suffixText: null })).toThrow();

            expect(() => an.validate({ overrideMinMaxLimits: 'foobar' })).toThrow();
            expect(() => an.validate({ overrideMinMaxLimits: 42 })).toThrow();
            expect(() => an.validate({ overrideMinMaxLimits: true })).toThrow();

            expect(() => an.validate({ maximumValue: true })).toThrow();
            expect(() => an.validate({ maximumValue: null })).toThrow();
            expect(() => an.validate({ maximumValue: 42 })).toThrow();
            expect(() => an.validate({ maximumValue: 42.42 })).toThrow();
            expect(() => an.validate({ maximumValue: -42 })).toThrow();
            expect(() => an.validate({ maximumValue: -42.42 })).toThrow();
            expect(() => an.validate({ maximumValue: '42.' })).toThrow();
            expect(() => an.validate({ maximumValue: '-42.' })).toThrow();
            expect(() => an.validate({ maximumValue: '.42' })).toThrow();
            expect(() => an.validate({ maximumValue: '-42foobar' })).toThrow();
            expect(() => an.validate({ maximumValue: '9999999999999,99' })).toThrow();
            expect(() => an.validate({ maximumValue: 'foobar' })).toThrow();

            expect(() => an.validate({ minimumValue: true })).toThrow();
            expect(() => an.validate({ minimumValue: null })).toThrow();
            expect(() => an.validate({ minimumValue: 42 })).toThrow();
            expect(() => an.validate({ minimumValue: 42.42 })).toThrow();
            expect(() => an.validate({ minimumValue: -42 })).toThrow();
            expect(() => an.validate({ minimumValue: -42.42 })).toThrow();
            expect(() => an.validate({ minimumValue: '42.' })).toThrow();
            expect(() => an.validate({ minimumValue: '-42.' })).toThrow();
            expect(() => an.validate({ minimumValue: '.42' })).toThrow();
            expect(() => an.validate({ minimumValue: '-42foobar' })).toThrow();
            expect(() => an.validate({ minimumValue: '9999999999999,99' })).toThrow();
            expect(() => an.validate({ minimumValue: 'foobar' })).toThrow();

            expect(() => an.validate({ minimumValue: '20', maximumValue: '-10' })).toThrow();
            expect(() => an.validate({ minimumValue: '-5', maximumValue: '-10' })).toThrow();
            expect(() => an.validate({ minimumValue:  '0', maximumValue: '-10' })).toThrow();
            expect(() => an.validate({ minimumValue: '20', maximumValue: '-10' })).toThrow();
            expect(() => an.validate({ minimumValue: '20', maximumValue:   '0' })).toThrow();
            expect(() => an.validate({ minimumValue: '20', maximumValue:  '10' })).toThrow();

            expect(() => an.validate({ decimalPlacesOverride: [] })).toThrow();
            expect(() => an.validate({ decimalPlacesOverride: true })).toThrow();
            expect(() => an.validate({ decimalPlacesOverride: 'foobar' })).toThrow();
            expect(() => an.validate({ decimalPlacesOverride: '22foobar' })).toThrow();
            expect(() => an.validate({ decimalPlacesOverride: '-5' })).toThrow();
            expect(() => an.validate({ decimalPlacesOverride: -5 })).toThrow();

            expect(() => an.validate({ decimalPlacesShownOnFocus: [] })).toThrow();
            expect(() => an.validate({ decimalPlacesShownOnFocus: true })).toThrow();
            expect(() => an.validate({ decimalPlacesShownOnFocus: 'foobar' })).toThrow();
            expect(() => an.validate({ decimalPlacesShownOnFocus: '22foobar' })).toThrow();
            expect(() => an.validate({ decimalPlacesShownOnFocus: '-5' })).toThrow();
            expect(() => an.validate({ decimalPlacesShownOnFocus: 5 })).toThrow();
            expect(() => an.validate({ decimalPlacesShownOnFocus: -5 })).toThrow();

            expect(() => an.validate({ scaleDivisor: 'foobar' })).toThrow();
            expect(() => an.validate({ scaleDivisor: true })).toThrow();
            expect(() => an.validate({ scaleDivisor: -1000 })).toThrow();

            expect(() => an.validate({ scaleDecimalPlaces: -5 })).toThrow();
            expect(() => an.validate({ scaleDecimalPlaces: 4.2 })).toThrow();
            expect(() => an.validate({ scaleDecimalPlaces: 'foobar' })).toThrow();
            expect(() => an.validate({ scaleDecimalPlaces: false })).toThrow();

            expect(() => an.validate({ scaleSymbol: true })).toThrow();
            expect(() => an.validate({ scaleSymbol: 42 })).toThrow();
            expect(() => an.validate({ scaleSymbol: [] })).toThrow();

            expect(() => an.validate({ saveValueToSessionStorage: 0 })).toThrow();
            expect(() => an.validate({ saveValueToSessionStorage: 1 })).toThrow();
            expect(() => an.validate({ saveValueToSessionStorage: '0' })).toThrow();
            expect(() => an.validate({ saveValueToSessionStorage: '1' })).toThrow();
            expect(() => an.validate({ saveValueToSessionStorage: 'foobar' })).toThrow();

            expect(() => an.validate({ onInvalidPaste: 0 })).toThrow();
            expect(() => an.validate({ onInvalidPaste: 1 })).toThrow();
            expect(() => an.validate({ onInvalidPaste: -42 })).toThrow();
            expect(() => an.validate({ onInvalidPaste: '0' })).toThrow();
            expect(() => an.validate({ onInvalidPaste: '1' })).toThrow();
            expect(() => an.validate({ onInvalidPaste: 'foobar' })).toThrow();
            expect(() => an.validate({ onInvalidPaste: 0.5 })).toThrow();
            expect(() => an.validate({ onInvalidPaste: true })).toThrow();
            expect(() => an.validate({ onInvalidPaste: null })).toThrow();
            expect(() => an.validate({ onInvalidPaste: [] })).toThrow();

            expect(() => an.validate({ roundingMethod: 0.5 })).toThrow();
            expect(() => an.validate({ roundingMethod: true })).toThrow();
            expect(() => an.validate({ roundingMethod: null })).toThrow();
            expect(() => an.validate({ roundingMethod: 'foobar' })).toThrow();

            expect(() => an.validate({ allowDecimalPadding: 0 })).toThrow();
            expect(() => an.validate({ allowDecimalPadding: 1 })).toThrow();
            expect(() => an.validate({ allowDecimalPadding: '0' })).toThrow();
            expect(() => an.validate({ allowDecimalPadding: '1' })).toThrow();
            expect(() => an.validate({ allowDecimalPadding: 'foobar' })).toThrow();

            expect(() => an.validate({ negativeBracketsTypeOnBlur: [] })).toThrow();
            expect(() => an.validate({ negativeBracketsTypeOnBlur: true })).toThrow();
            expect(() => an.validate({ negativeBracketsTypeOnBlur: 'foobar' })).toThrow();
            expect(() => an.validate({ negativeBracketsTypeOnBlur: '22foobar' })).toThrow();
            expect(() => an.validate({ negativeBracketsTypeOnBlur: '-5' })).toThrow();
            expect(() => an.validate({ negativeBracketsTypeOnBlur: 5 })).toThrow();
            expect(() => an.validate({ negativeBracketsTypeOnBlur: -5 })).toThrow();

            expect(() => an.validate({ emptyInputBehavior: [] })).toThrow();
            expect(() => an.validate({ emptyInputBehavior: true })).toThrow();
            expect(() => an.validate({ emptyInputBehavior: 'foobar' })).toThrow();
            expect(() => an.validate({ emptyInputBehavior: '22foobar' })).toThrow();
            expect(() => an.validate({ emptyInputBehavior: '-5' })).toThrow();
            expect(() => an.validate({ emptyInputBehavior: 5 })).toThrow();
            expect(() => an.validate({ emptyInputBehavior: -5 })).toThrow();

            expect(() => an.validate({ leadingZero: [] })).toThrow();
            expect(() => an.validate({ leadingZero: true })).toThrow();
            expect(() => an.validate({ leadingZero: 'foobar' })).toThrow();
            expect(() => an.validate({ leadingZero: '22foobar' })).toThrow();
            expect(() => an.validate({ leadingZero: '-5' })).toThrow();
            expect(() => an.validate({ leadingZero: 5 })).toThrow();
            expect(() => an.validate({ leadingZero: -5 })).toThrow();

            expect(() => an.validate({ formatOnPageLoad: 0 })).toThrow();
            expect(() => an.validate({ formatOnPageLoad: 1 })).toThrow();
            expect(() => an.validate({ formatOnPageLoad: '0' })).toThrow();
            expect(() => an.validate({ formatOnPageLoad: '1' })).toThrow();
            expect(() => an.validate({ formatOnPageLoad: 'foobar' })).toThrow();

            expect(() => an.validate({ selectNumberOnly: 0 })).toThrow();
            expect(() => an.validate({ selectNumberOnly: 1 })).toThrow();
            expect(() => an.validate({ selectNumberOnly: '0' })).toThrow();
            expect(() => an.validate({ selectNumberOnly: '1' })).toThrow();
            expect(() => an.validate({ selectNumberOnly: 'foobar' })).toThrow();

            expect(() => an.validate({ defaultValueOverride: [] })).toThrow();
            expect(() => an.validate({ defaultValueOverride: true })).toThrow();
            expect(() => an.validate({ defaultValueOverride: 'foobar' })).toThrow();
            expect(() => an.validate({ defaultValueOverride: '22foobar' })).toThrow();

            expect(() => an.validate({ unformatOnSubmit: 0 })).toThrow();
            expect(() => an.validate({ unformatOnSubmit: 1 })).toThrow();
            expect(() => an.validate({ unformatOnSubmit: '0' })).toThrow();
            expect(() => an.validate({ unformatOnSubmit: '1' })).toThrow();
            expect(() => an.validate({ unformatOnSubmit: 'foobar' })).toThrow();

            expect(() => an.validate({ outputFormat: [] })).toThrow();
            expect(() => an.validate({ outputFormat: true })).toThrow();
            expect(() => an.validate({ outputFormat: 'foobar' })).toThrow();
            expect(() => an.validate({ outputFormat: '22foobar' })).toThrow();
            expect(() => an.validate({ outputFormat: '-5' })).toThrow();
            expect(() => an.validate({ outputFormat: 5 })).toThrow();
            expect(() => an.validate({ outputFormat: -5 })).toThrow();

            expect(() => an.validate({ showWarnings: 0 })).toThrow();
            expect(() => an.validate({ showWarnings: 1 })).toThrow();
            expect(() => an.validate({ showWarnings: '0' })).toThrow();
            expect(() => an.validate({ showWarnings: '1' })).toThrow();
            expect(() => an.validate({ showWarnings: 'foobar' })).toThrow();

            expect(() => an.validate({ failOnUnknownOption: 0 })).toThrow();
            expect(() => an.validate({ failOnUnknownOption: 1 })).toThrow();
            expect(() => an.validate({ failOnUnknownOption: '0' })).toThrow();
            expect(() => an.validate({ failOnUnknownOption: '1' })).toThrow();
            expect(() => an.validate({ failOnUnknownOption: 'foobar' })).toThrow();
        });

        it('should only send a warning, and not throw', () => {
            spyOn(console, 'warn');
            expect(() => an.validate({ decimalPlacesOverride: '3', decimalPlacesShownOnFocus: '2' })).not.toThrow();
            expect(console.warn).toHaveBeenCalled();
        });

        it('should only send a warning, and not throw', () => {
            spyOn(console, 'warn');
            expect(() => an.validate({ decimalPlacesOverride: '3', decimalPlacesShownOnFocus: '2' })).not.toThrow();
            expect(console.warn).toHaveBeenCalled();
        });
    });

    // Basic test (that are copied from the non-jQuery ones) just to test that the jQuery version is called correctly
    describe('`validate` (with jQuery `$.fn`)', () => {
        it('should validate', () => {
            expect(() => $.fn.autoValidate(autoNumericOptionsEuro)).not.toThrow();
            expect(() => $.fn.autoValidate(autoNumericOptionsDollar)).not.toThrow();

            expect(() => $.fn.autoValidate({ digitGroupSeparator: ',' })).not.toThrow();
            expect(() => $.fn.autoValidate({ digitGroupSeparator: '.',  decimalCharacter: ',' })).not.toThrow();
        });

        it('should not validate', () => {
            expect(() => $.fn.autoValidate(0)).toThrow();
            expect(() => $.fn.autoValidate(undefined)).toThrow();

            expect(() => $.fn.autoValidate({ digitGroupSeparator: '-' })).toThrow();
            expect(() => $.fn.autoValidate({ digitGroupSeparator: '"' })).toThrow();
        });
    });
});

//TODO Complete the tests with user interactions tests
