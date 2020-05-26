/**
 * Unit tests for autoNumeric.js
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

/* eslint space-in-parens: 0 */
/* eslint spaced-comment: 0 */
// eslint-disable-next-line
/* global describe, it, xdescribe, xit, fdescribe, fit, expect, beforeEach, afterEach, spyOn */

import AutoNumeric       from '../../src/AutoNumeric';
import AutoNumericEnum   from '../../src/AutoNumericEnum';
import AutoNumericHelper from '../../src/AutoNumericHelper';
import Lexer             from '../../src/maths/Lexer';
import Parser            from '../../src/maths/Parser';
import Evaluator         from '../../src/maths/Evaluator';

// The autoNumeric tests :

//-----------------------------------------------------------------------------
//---- Options & settings
const autoNumericOptionsEuro = {
    digitGroupSeparator        : '.',
    decimalCharacter           : ',',
    decimalCharacterAlternative: '.',
    currencySymbol             : ' €',
    currencySymbolPlacement    : 's',
};
const autoNumericOptionsEuroNumber = {
    digitGroupSeparator        : '.',
    decimalCharacter           : ',',
    decimalCharacterAlternative: '.',
    currencySymbol             : ' €',
    currencySymbolPlacement    : 's',
    outputFormat               : 'number',
};
const autoNumericOptionsDollar = {
    digitGroupSeparator    : ',',
    decimalCharacter       : '.',
    currencySymbol         : '$',
    currencySymbolPlacement: 'p',
};

describe('The AutoNumeric object', () => {
    describe('manages default options', () => {
        let aNInput;
        let newInput;

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
            aNInput = new AutoNumeric(newInput); // Initiate the autoNumeric input
        });

        afterEach(() => { // Un-initialization
            aNInput.remove();
            document.body.removeChild(newInput);
        });

        const defaultOption = {
            allowDecimalPadding          : true,
            caretPositionOnFocus         : null,
            alwaysAllowDecimalCharacter  : false,
            createLocalList              : true,
            currencySymbol               : '',
            currencySymbolPlacement      : 'p',
            decimalCharacter             : '.',
            decimalCharacterAlternative  : null,
            decimalPlaces                : 2,
            decimalPlacesRawValue        : null,
            decimalPlacesShownOnBlur     : null,
            decimalPlacesShownOnFocus    : null,
            defaultValueOverride         : null,
            digitalGroupSpacing          : '3',
            digitGroupSeparator          : ',',
            divisorWhenUnfocused         : null,
            emptyInputBehavior           : 'focus',
            eventBubbles                 : true,
            eventIsCancelable            : true,
            failOnUnknownOption          : false,
            formatOnPageLoad             : true,
            formulaMode                  : false,
            historySize                  : 20,
            invalidClass                 : 'an-invalid',
            isCancellable                : true,
            leadingZero                  : 'deny',
            maximumValue                 : '10000000000000',
            minimumValue                 : '-10000000000000',
            modifyValueOnWheel           : true,
            negativeBracketsTypeOnBlur   : null,
            negativePositiveSignPlacement: null,
            negativeSignCharacter        : '-',
            noEventListeners             : false,
            onInvalidPaste               : 'error',
            outputFormat                 : null,
            overrideMinMaxLimits         : null,
            positiveSignCharacter        : '+',
            rawValueDivisor              : null,
            readOnly                     : false,
            roundingMethod               : 'S',
            saveValueToSessionStorage    : false,
            selectNumberOnly             : true,
            selectOnFocus                : true,
            serializeSpaces              : '+',
            showOnlyNumbersOnFocus       : false,
            showPositiveSign             : false,
            showWarnings                 : true,
            styleRules                   : null,
            suffixText                   : '',
            symbolWhenUnfocused          : null,
            unformatOnHover              : true,
            unformatOnSubmit             : false,
            valuesToStrings              : null,
            watchExternalChanges         : false,
            wheelOn                      : 'focus',
            wheelStep                    : 'progressive',
        };

        it('should return some default values', () => {
            // Test the options one by one, which makes it easier to spot the error
            //XXX This loop is useful to spot the faulty options, since only those that are not equal to the default are shown
            const defaultSettings = AutoNumeric.getDefaultConfig();
            let i = 0;
            for (const prop in defaultSettings) {
                i++;
                if (Object.prototype.hasOwnProperty.call(defaultSettings, prop)) {
                    if (defaultSettings[prop] !== defaultOption[prop]) {
                        console.log(`${i}: Setting ${prop} = [${defaultSettings[prop]}][${defaultOption[prop]}]`); //DEBUG
                    }
                    expect(defaultSettings[prop]).toEqual(defaultOption[prop]);
                }
            }

            // Global test
            expect(defaultSettings).toEqual(defaultOption);
        });

        it('should prevent modifying the `AutoNumeric.defaultSettings` object', () => {
            expect(AutoNumeric.defaultSettings.caretPositionOnFocus).toEqual(null);
            expect(() => { AutoNumeric.defaultSettings.caretPositionOnFocus = 'foo'; }).toThrow();
            expect(AutoNumeric.defaultSettings.caretPositionOnFocus).toEqual(null);
            expect(() => { AutoNumeric.defaultSettings = {}; }).toThrow();
        });

        it('should prevent modifying the `AutoNumericEnum` object', () => {
            expect(AutoNumericEnum.keyName._allFnKeys).toEqual(['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12']);
            expect(() => { AutoNumericEnum.keyName._allFnKeys = ['foo']; }).toThrow();
            expect(AutoNumericEnum.keyName._allFnKeys).toEqual(['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12']);

            expect(() => { AutoNumericEnum.allowedTagList = ['foobar']; }).toThrow();
            expect(() => { AutoNumericEnum.keyCode = {}; }).toThrow();
            expect(() => { AutoNumericEnum.fromCharCodeKeyCode = []; }).toThrow();
            expect(() => { AutoNumericEnum.fromCharCodeKeyCode[91] = 'foobar'; }).toThrow();
            expect(() => { AutoNumericEnum.keyName = {}; }).toThrow();
        });

        it('should prevent modifying the `AutoNumeric.events` object', () => {
            expect(AutoNumeric.events.initialized).toEqual('autoNumeric:initialized');
            expect(AutoNumeric.events.native.input).toEqual('input');
            expect(() => { AutoNumeric.events.initialized = 'foo'; }).toThrow();
            expect(() => { AutoNumeric.events.native.input = 'foo'; }).toThrow();
            expect(AutoNumeric.events.initialized).toEqual('autoNumeric:initialized');
            expect(AutoNumeric.events.native.input).toEqual('input');
            expect(() => { AutoNumeric.events = {}; }).toThrow();
        });

        it('should prevent modifying the `AutoNumeric.options` object', () => {
            expect(AutoNumeric.options.wheelStep.progressive).toEqual('progressive');
            expect(() => { AutoNumeric.options.wheelStep.progressive = 'foo'; }).toThrow();
            expect(AutoNumeric.options.wheelStep.progressive).toEqual('progressive');
            expect(() => { AutoNumeric.options = {}; }).toThrow();
        });

        it('should prevent modifying the `AutoNumeric.predefinedOptions` object', () => {
            expect(AutoNumeric.predefinedOptions.integer).toEqual({ decimalPlaces: 0 });
            expect(() => { AutoNumeric.predefinedOptions.integer = 'foo'; }).toThrow();
            expect(AutoNumeric.predefinedOptions.integer).toEqual({ decimalPlaces: 0 });
            expect(() => { AutoNumeric.predefinedOptions = {}; }).toThrow();
        });

        it('should return the predefined language options', () => {
            const defaultLanguageOption = {
                French       : { // Français
                    selectNumberOnly             : true,
                    digitGroupSeparator          : '.',
                    decimalCharacter             : ',',
                    decimalCharacterAlternative  : '.',
                    currencySymbol               : '\u202f€',
                    currencySymbolPlacement      : AutoNumeric.options.currencySymbolPlacement.suffix,
                    negativePositiveSignPlacement: AutoNumeric.options.negativePositiveSignPlacement.prefix,
                    roundingMethod               : 'U',
                    leadingZero                  : 'deny',
                    minimumValue                 : '-10000000000000',
                    maximumValue                 : '10000000000000',
                },
                NorthAmerican: {
                    selectNumberOnly             : true,
                    digitGroupSeparator          : ',',
                    decimalCharacter             : '.',
                    currencySymbol               : '$',
                    currencySymbolPlacement      : AutoNumeric.options.currencySymbolPlacement.prefix,
                    negativePositiveSignPlacement: AutoNumeric.options.negativePositiveSignPlacement.right,
                    roundingMethod               : 'U',
                    leadingZero                  : 'deny',
                    minimumValue                 : '-10000000000000',
                    maximumValue                 : '10000000000000',
                },
            };

            // Test the options one by one, which makes it easier to spot the error
            //XXX This loop is useful to spot the faulty options, since only those that are not equal to the default are shown
            const predefinedLanguages = AutoNumeric.getPredefinedOptions();
            let i = 0;
            for (const lang in defaultLanguageOption) { //XXX Here I test only this language subset
                i++;
                if (Object.prototype.hasOwnProperty.call(predefinedLanguages, lang)) {
                    for (const prop in predefinedLanguages[lang]) {
                        if (Object.prototype.hasOwnProperty.call(predefinedLanguages[lang], prop)) {
                            if (predefinedLanguages[lang][prop] !== defaultLanguageOption[lang][prop]) {
                                console.log(`${i}: Setting ${prop} = [${predefinedLanguages[lang][prop]}][${defaultLanguageOption[lang][prop]}]`); //DEBUG
                            }
                            expect(predefinedLanguages[lang][prop]).toEqual(defaultLanguageOption[lang][prop]);
                        }
                    }
                }
            }

            // Global test
            // expect(an.getPredefinedOptions()).toEqual(defaultLanguageOption); //XXX Here I test only a language subset, not all language options
        });

        it('should be initiated with the default values', () => {
            const defaultSettings = AutoNumeric.getDefaultConfig();
            const aNInputSettings = aNInput.getSettings();
            /* let i = 0;
            for (const prop in defaultSettings) { //XXX This loop fails because of the `decimalPlaces*` and `negativePositiveSignPlacement` options that are calculated on creation, and because `historySize` default value is an integer instead of a string
                i++;
                if (defaultSettings.hasOwnProperty(prop)) {
                    console.log(`${i}: Setting ${prop} = [${defaultSettings[prop]}][${aNInputSettings[prop]}]`); //DEBUG
                    expect(defaultSettings[prop]).toEqual(aNInputSettings[prop]);
                }
            } */

            expect(defaultSettings.allowDecimalPadding        ).toEqual(aNInputSettings.allowDecimalPadding        );
            expect(defaultSettings.caretPositionOnFocus       ).toEqual(aNInputSettings.caretPositionOnFocus       );
            expect(defaultSettings.alwaysAllowDecimalCharacter).toEqual(aNInputSettings.alwaysAllowDecimalCharacter);
            expect(defaultSettings.createLocalList            ).toEqual(aNInputSettings.createLocalList            );
            expect(defaultSettings.currencySymbol             ).toEqual(aNInputSettings.currencySymbol             );
            expect(defaultSettings.currencySymbolPlacement    ).toEqual(aNInputSettings.currencySymbolPlacement    );
            expect(defaultSettings.decimalCharacter           ).toEqual(aNInputSettings.decimalCharacter           );
            expect(defaultSettings.decimalCharacterAlternative).toEqual(aNInputSettings.decimalCharacterAlternative);
            // Special case for the decimalPlaces* options
            expect(defaultSettings.defaultValueOverride      ).toEqual(aNInputSettings.defaultValueOverride       );
            expect(defaultSettings.digitalGroupSpacing       ).toEqual(aNInputSettings.digitalGroupSpacing        );
            expect(defaultSettings.digitGroupSeparator       ).toEqual(aNInputSettings.digitGroupSeparator        );
            expect(defaultSettings.divisorWhenUnfocused      ).toEqual(aNInputSettings.divisorWhenUnfocused       );
            expect(defaultSettings.emptyInputBehavior        ).toEqual(aNInputSettings.emptyInputBehavior         );
            expect(defaultSettings.eventBubbles              ).toEqual(aNInputSettings.eventBubbles               );
            expect(defaultSettings.eventIsCancelable         ).toEqual(aNInputSettings.eventIsCancelable          );
            expect(defaultSettings.failOnUnknownOption       ).toEqual(aNInputSettings.failOnUnknownOption        );
            expect(defaultSettings.formatOnPageLoad          ).toEqual(aNInputSettings.formatOnPageLoad           );
            expect(defaultSettings.formulaMode               ).toEqual(aNInputSettings.formulaMode                );
            expect(String(defaultSettings.historySize)       ).toEqual(aNInputSettings.historySize                );
            expect(String(defaultSettings.invalidClass)      ).toEqual(aNInputSettings.invalidClass               );
            expect(defaultSettings.isCancellable             ).toEqual(aNInputSettings.isCancellable              );
            expect(defaultSettings.leadingZero               ).toEqual(aNInputSettings.leadingZero                );
            expect(defaultSettings.maximumValue              ).toEqual(aNInputSettings.maximumValue               );
            expect(defaultSettings.minimumValue              ).toEqual(aNInputSettings.minimumValue               );
            expect(defaultSettings.modifyValueOnWheel        ).toEqual(aNInputSettings.modifyValueOnWheel         );
            expect(defaultSettings.negativeBracketsTypeOnBlur).toEqual(aNInputSettings.negativeBracketsTypeOnBlur );
            // Special case for `negativePositiveSignPlacement`, see the related tests
            // expect(defaultSettings.negativePositiveSignPlacement).toEqual(aNInputSettings.negativePositiveSignPlacement);
            expect(defaultSettings.noEventListeners          ).toEqual(aNInputSettings.noEventListeners           );
            expect(defaultSettings.onInvalidPaste            ).toEqual(aNInputSettings.onInvalidPaste             );
            expect(defaultSettings.outputFormat              ).toEqual(aNInputSettings.outputFormat               );
            expect(defaultSettings.overrideMinMaxLimits      ).toEqual(aNInputSettings.overrideMinMaxLimits       );
            expect(defaultSettings.rawValueDivisor           ).toEqual(aNInputSettings.rawValueDivisor            );
            expect(defaultSettings.readOnly                  ).toEqual(aNInputSettings.readOnly                   );
            expect(defaultSettings.roundingMethod            ).toEqual(aNInputSettings.roundingMethod             );
            expect(defaultSettings.saveValueToSessionStorage ).toEqual(aNInputSettings.saveValueToSessionStorage  );
            expect(defaultSettings.selectNumberOnly          ).toEqual(aNInputSettings.selectNumberOnly           );
            expect(defaultSettings.selectOnFocus             ).toEqual(aNInputSettings.selectOnFocus              );
            expect(defaultSettings.serializeSpaces           ).toEqual(aNInputSettings.serializeSpaces            );
            expect(defaultSettings.showOnlyNumbersOnFocus    ).toEqual(aNInputSettings.showOnlyNumbersOnFocus     );
            expect(defaultSettings.showPositiveSign          ).toEqual(aNInputSettings.showPositiveSign           );
            expect(defaultSettings.showWarnings              ).toEqual(aNInputSettings.showWarnings               );
            expect(defaultSettings.styleRules                ).toEqual(aNInputSettings.styleRules                 );
            expect(defaultSettings.suffixText                ).toEqual(aNInputSettings.suffixText                 );
            expect(defaultSettings.symbolWhenUnfocused       ).toEqual(aNInputSettings.symbolWhenUnfocused        );
            expect(defaultSettings.unformatOnHover           ).toEqual(aNInputSettings.unformatOnHover            );
            expect(defaultSettings.unformatOnSubmit          ).toEqual(aNInputSettings.unformatOnSubmit           );
            expect(defaultSettings.valuesToStrings           ).toEqual(aNInputSettings.valuesToStrings            );
            expect(defaultSettings.watchExternalChanges      ).toEqual(aNInputSettings.watchExternalChanges       );
            expect(defaultSettings.wheelOn                   ).toEqual(aNInputSettings.wheelOn                    );
            expect(defaultSettings.wheelStep                 ).toEqual(aNInputSettings.wheelStep                  );
        });

        it('should initialize the decimal places options with the default values', () => {
            const defaultSettings = AutoNumeric.getDefaultConfig();
            const aNInputSettings = aNInput.getSettings();

            // Special cases here where `decimalPlacesRawValue`, `decimalPlacesShownOnBlur` and `decimalPlacesShownOnFocus` are calculated based on `decimalPlaces` if they are `null`, which is the default
            expect(defaultSettings.decimalPlaces            ).toEqual(2);
            expect(aNInputSettings.decimalPlacesRawValue    ).toEqual(2);
            //TODO Modify `_transformOptionsValuesToDefaultTypes()` so that the decimalPlacesShown* options are not converted to strings?
            expect(aNInputSettings.decimalPlacesShownOnBlur ).toEqual('2');
            expect(aNInputSettings.decimalPlacesShownOnFocus).toEqual('2');
        });

        it('should update the options values accordingly', () => {
            aNInput.update({ digitGroupSeparator: '.', decimalCharacter: ',', currencySymbol: '€' });
            const defaultSettings = AutoNumeric.getDefaultConfig();
            const aNInputSettings = aNInput.getSettings();

            expect(defaultSettings.digitGroupSeparator).not.toEqual(aNInputSettings.digitGroupSeparator );
            expect(defaultSettings.decimalCharacter   ).not.toEqual(aNInputSettings.decimalCharacter    );
            expect(defaultSettings.currencySymbol     ).not.toEqual(aNInputSettings.currencySymbol      );
            expect(aNInputSettings.digitGroupSeparator).toEqual('.');
            expect(aNInputSettings.decimalCharacter   ).toEqual(',');
            expect(aNInputSettings.currencySymbol     ).toEqual('€');
        });
    });

    describe('manages the `negativePositiveSignPlacement` configuration option specially', () => {
        let aNInput;
        let newInput;

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
        });

        afterEach(() => { // Un-initialization
            aNInput.remove();
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
            aNInput = new AutoNumeric(newInput, { currencySymbol: '$', currencySymbolPlacement: 's' }); // Initiate the autoNumeric input
            const aNInputSettings = aNInput.getSettings();

            expect(aNInputSettings.negativePositiveSignPlacement).toEqual('p');
        });

        it(`this should set the negativePositiveSignPlacement differently based on the currencySymbol and currencySymbolPlacement (p) values`, () => {
            // Case 2 : settings.currencySymbolPlacement equals 'p'
            aNInput = new AutoNumeric(newInput, { currencySymbol: '$', currencySymbolPlacement: 'p' }); // Initiate the autoNumeric input
            const aNInputSettings = aNInput.getSettings();

            expect(aNInputSettings.negativePositiveSignPlacement).toEqual('l');
        });

        /*
         * Default cases
         */
        it(`this should set the default negativePositiveSignPlacement value if it's not set by the user, to -1,234.56`, () => {
            aNInput = new AutoNumeric(newInput, { negativePositiveSignPlacement : null }); // Initiate the autoNumeric input
            const aNInputSettings = aNInput.getSettings();

            expect(aNInputSettings.currencySymbol).toEqual('');
            expect(aNInputSettings.currencySymbolPlacement).toEqual('p');
            expect(aNInputSettings.negativePositiveSignPlacement).toEqual('l');
        });


        it(`this should set the default negativePositiveSignPlacement value if it's not set by the user, to -$1,234.56`, () => {
            aNInput = new AutoNumeric(newInput, { currencySymbol: '$', negativePositiveSignPlacement : null }); // Initiate the autoNumeric input
            const aNInputSettings = aNInput.getSettings();

            expect(aNInputSettings.currencySymbol).toEqual('$');
            expect(aNInputSettings.currencySymbolPlacement).toEqual('p');
            expect(aNInputSettings.negativePositiveSignPlacement).toEqual('l');
        });

        it(`this should not override the negativePositiveSignPlacement value 'p' if it has been set by the user`, () => {
            aNInput = new AutoNumeric(newInput, { negativePositiveSignPlacement : 'p' }); // Initiate the autoNumeric input
            const aNInputSettings = aNInput.getSettings();
            expect(aNInputSettings.negativePositiveSignPlacement).toEqual('p');
        });

        it(`this should not override the negativePositiveSignPlacement value 's' if it has been set by the user`, () => {
            aNInput = new AutoNumeric(newInput, { negativePositiveSignPlacement : 's' }); // Initiate the autoNumeric input
            const aNInputSettings = aNInput.getSettings();
            expect(aNInputSettings.negativePositiveSignPlacement).toEqual('s');
        });

        it(`this should not override the negativePositiveSignPlacement value 'l' if it has been set by the user`, () => {
            aNInput = new AutoNumeric(newInput, { negativePositiveSignPlacement : 'l' }); // Initiate the autoNumeric input
            const aNInputSettings = aNInput.getSettings();
            expect(aNInputSettings.negativePositiveSignPlacement).toEqual('l');
        });

        it(`this should not override the negativePositiveSignPlacement value 'r' if it has been set by the user`, () => {
            aNInput = new AutoNumeric(newInput, { negativePositiveSignPlacement : 'r' }); // Initiate the autoNumeric input
            const aNInputSettings = aNInput.getSettings();
            expect(aNInputSettings.negativePositiveSignPlacement).toEqual('r');
        });
    });

    describe('manages the `decimalPlaces*` configuration option specially', () => {
        let localANInput;
        let newInput;

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
        });

        afterEach(() => { // Un-initialization
            localANInput.remove();
            document.body.removeChild(newInput);
        });

        it(`should show a warning when decimalPlacesRawValue is lower than decimalPlaces, and overwrite \`decimalPlacesRawValue\``, () => {
            spyOn(console, 'warn');
            localANInput = new AutoNumeric(newInput, { decimalPlacesRawValue: 2, decimalPlaces: 3 }); // Initiate the autoNumeric input
            expect(console.warn).toHaveBeenCalled();
            const localANInputSettings = localANInput.getSettings();

            expect(localANInputSettings.decimalPlaces).toEqual('3');
            expect(localANInputSettings.decimalPlacesRawValue).toEqual(3);
        });

        it(`should show a warning when decimalPlacesRawValue is lower than decimalPlacesShownOnFocus, and overwrite \`decimalPlacesRawValue\``, () => {
            // Setup
            spyOn(console, 'warn');
            localANInput = new AutoNumeric(newInput, { decimalPlacesRawValue: 2, decimalPlacesShownOnFocus: 3 }); // Initiate the autoNumeric input
            expect(console.warn).toHaveBeenCalled();
            const localANInputSettings = localANInput.getSettings();

            expect(localANInputSettings.decimalPlaces).toEqual('2');
            expect(localANInputSettings.decimalPlacesShownOnFocus).toEqual('3');
            expect(localANInputSettings.decimalPlacesRawValue).toEqual(3);
        });

        it(`should show a warning when decimalPlacesRawValue is lower than decimalPlacesShownOnBlur, and overwrite \`decimalPlacesRawValue\``, () => {
            // Setup
            spyOn(console, 'warn');
            localANInput = new AutoNumeric(newInput, { decimalPlacesRawValue: 2, decimalPlacesShownOnBlur: 3 }); // Initiate the autoNumeric input
            expect(console.warn).toHaveBeenCalled();
            const localANInputSettings = localANInput.getSettings();

            expect(localANInputSettings.decimalPlaces).toEqual('2');
            expect(localANInputSettings.decimalPlacesShownOnBlur).toEqual('3');
            expect(localANInputSettings.decimalPlacesRawValue).toEqual(3);
        });
    });

    describe('autoNumeric `getSettings` options and the `rawValue`', () => {
        let aNInput;
        let newInput;
        const anOptions = { decimalCharacter: ',', digitGroupSeparator: '.' };

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
            aNInput = new AutoNumeric(newInput, anOptions); // Initiate the autoNumeric input
        });

        afterEach(() => { // Un-initialization
            aNInput.remove();
            document.body.removeChild(newInput);
        });

        it('should return a correct raw value with a point as a decimal character', () => {
            aNInput.set('1234.56');
            expect(aNInput.get()).toEqual('1234.56');
            expect(aNInput.getNumber()).toEqual(1234.56);
            expect(aNInput.rawValue).toEqual('1234.56');

            aNInput.set('-1234.56');
            expect(aNInput.get()).toEqual('-1234.56');
            expect(aNInput.getNumber()).toEqual(-1234.56);
            expect(aNInput.rawValue).toEqual('-1234.56');

            aNInput.set('1234');
            expect(aNInput.get()).toEqual('1234');
            expect(aNInput.getNumber()).toEqual(1234);
            expect(aNInput.rawValue).toEqual('1234');

            aNInput.set('-1234');
            expect(aNInput.get()).toEqual('-1234');
            expect(aNInput.getNumber()).toEqual(-1234);
            expect(aNInput.rawValue).toEqual('-1234');
        });
    });

    describe('provides public methods', () => {
        let aNInput;
        let newInput;

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
            aNInput = new AutoNumeric(newInput); // Initiate the autoNumeric input
        });

        afterEach(() => { // Un-initialization
            aNInput.remove();
            document.body.removeChild(newInput);
        });

        it('should recognize only a specific list of methods', () => {
            const otherDomElement = document.createElement('input');
            document.body.appendChild(otherDomElement);

            // The 'init' method is implicit tested since we use that to setup those tests
            expect(() => aNInput.update({})).not.toThrow();
            expect(() => aNInput.getSettings()).not.toThrow();
            expect(() => aNInput.set(1234)).not.toThrow();
            expect(() => aNInput.set(1234.56)).not.toThrow();
            expect(() => aNInput.setUnformatted(123456.789)).not.toThrow();
            expect(() => aNInput.get()).not.toThrow();
            expect(() => aNInput.getNumericString()).not.toThrow();
            expect(() => aNInput.getFormatted()).not.toThrow();
            expect(() => aNInput.getNumber()).not.toThrow();
            expect(() => aNInput.getLocalized()).not.toThrow();
            expect(() => aNInput.getLocalized('number')).not.toThrow();
            expect(() => aNInput.reformat()).not.toThrow();
            expect(() => aNInput.unformat()).not.toThrow();
            expect(() => aNInput.unformatLocalized('number')).not.toThrow();
            expect(() => aNInput.isPristine()).not.toThrow();
            expect(() => aNInput.select()).not.toThrow();
            expect(() => aNInput.selectNumber()).not.toThrow();
            expect(() => aNInput.selectInteger()).not.toThrow();
            expect(() => aNInput.selectDecimal()).not.toThrow();
            expect(() => aNInput.node()).not.toThrow();
            expect(() => aNInput.parent()).not.toThrow();
            expect(() => aNInput.detach()).not.toThrow();

            const yetAnotherDomElement = document.createElement('input');
            document.body.appendChild(yetAnotherDomElement);
            const anYetAnotherDomElement = new AutoNumeric(yetAnotherDomElement);
            expect(() => aNInput.attach(anYetAnotherDomElement)).not.toThrow();

            expect(() => aNInput.formatOther(27368)).not.toThrow();
            expect(() => aNInput.unformatOther('1.234.789,89 €')).not.toThrow();
            expect(() => aNInput.init(otherDomElement)).not.toThrow();
            // Check that `getAutoNumericElement()` transparently selects the same object when passed a DOM element or a selector string
            otherDomElement.id = 'idOtherDomElement';
            expect(AutoNumeric.getAutoNumericElement(otherDomElement)).toEqual(AutoNumeric.getAutoNumericElement('#idOtherDomElement'));
            AutoNumeric.getAutoNumericElement(otherDomElement).remove(); // This prevent reinitializing an already initialized DOM element
            expect(() => aNInput.init(otherDomElement, false)).not.toThrow();

            // Calling the pre-defined options
            expect(() => aNInput.french()).not.toThrow();
            expect(() => aNInput.northAmerican()).not.toThrow();
            expect(() => aNInput.british()).not.toThrow();
            expect(() => aNInput.swiss()).not.toThrow();
            expect(() => aNInput.japanese()).not.toThrow();
            expect(() => aNInput.spanish()).not.toThrow();
            expect(() => aNInput.chinese()).not.toThrow();
            expect(() => aNInput.brazilian()).not.toThrow();

            document.body.removeChild(yetAnotherDomElement);
            document.body.removeChild(otherDomElement);
        });

        it(`should recognize the 'form*' methods`, () => {
            // Create a form element, 3 inputs, and only 2 autoNumeric ones
            const theForm = document.createElement('form');
            document.body.appendChild(theForm);
            const input1 = document.createElement('input');
            const input2 = document.createElement('input');
            const input3 = document.createElement('input');
            theForm.appendChild(input1);
            theForm.appendChild(input2);
            theForm.appendChild(input3);
            // Initialize the two autoNumeric inputs
            const aNInput1 = new AutoNumeric(input1);
            const aNInput3 = new AutoNumeric(input3);
            // Set their value (and the option at the same time)
            aNInput1.set(13567.897, AutoNumeric.getPredefinedOptions().French);
            expect(aNInput1.getFormatted()).toEqual('13.567,90\u202f€');
            aNInput3.set(2987367.0262, AutoNumeric.getPredefinedOptions().NorthAmerican);
            expect(aNInput3.getFormatted()).toEqual('$2,987,367.03');
            input2.value = 666;

            // Create a dummy form submit callback in order to prevent the code to really submit
            spyOn(theForm, 'submit').and.callFake(() => false);

            // Use the from* functions
            expect(() => aNInput1.form()).not.toThrow();
            expect(() => aNInput1.formNumericString()).not.toThrow();
            expect(() => aNInput1.formFormatted()).not.toThrow();
            expect(() => aNInput1.formLocalized()).not.toThrow();
            expect(() => aNInput1.formArrayNumericString()).not.toThrow();
            expect(() => aNInput1.formArrayFormatted()).not.toThrow();
            expect(() => aNInput1.formArrayLocalized()).not.toThrow();
            expect(() => aNInput1.formJsonNumericString()).not.toThrow();
            expect(() => aNInput1.formJsonFormatted()).not.toThrow();
            expect(() => aNInput1.formJsonLocalized()).not.toThrow();
            expect(() => aNInput1.formUnformat()).not.toThrow();
            expect(() => aNInput1.formReformat()).not.toThrow();
            expect(() => aNInput1.formSubmitNumericString()).not.toThrow();
            expect(() => aNInput1.formSubmitFormatted()).not.toThrow();
            expect(() => aNInput1.formSubmitLocalized()).not.toThrow();
            expect(() => aNInput1.formSubmitArrayNumericString(() => {})).not.toThrow();
            expect(() => aNInput1.formSubmitArrayFormatted(() => {})).not.toThrow();
            expect(() => aNInput1.formSubmitArrayLocalized(() => {})).not.toThrow();
            expect(() => aNInput1.formSubmitJsonNumericString(() => {})).not.toThrow();
            expect(() => aNInput1.formSubmitJsonFormatted(() => {})).not.toThrow();
            expect(() => aNInput1.formSubmitJsonLocalized(() => {})).not.toThrow();

            expect(theForm.submit).toHaveBeenCalled();

            // Test the behavior of some of those form* functions
            expect(aNInput1.form()).toEqual(theForm);

            // Remove the 3 inputs and the form elements
            theForm.removeChild(input1);
            theForm.removeChild(input2);
            theForm.removeChild(input3);
            document.body.removeChild(theForm);
        });

        /*
        xit('should not allow to call private methods', () => {
            //TODO In an ideal world, JS would allow us to declare attributes and methodes `private` (or `protected`), in order to provide a clear API (cf. http://stackoverflow.com/a/33533611/2834898). This is unfortunately not the case so until this is fixed, the following function will be visible...
            expect(() => aNInput._createEventListeners()).toThrow();
            expect(() => aNInput._getChildANInputElement()).toThrow();
            expect(() => aNInput._createGlobalList()).toThrow();
            expect(() => aNInput._doesGlobalListExists()).toThrow();
            expect(() => aNInput._addToGlobalList()).toThrow();
            expect(() => aNInput._removeFromGlobalList()).toThrow();
            expect(() => aNInput._isInGlobalList()).toThrow();
            expect(() => aNInput._createLocalList()).toThrow();
            expect(() => aNInput._addToLocalList()).toThrow();
            expect(() => aNInput._removeFromLocalList()).toThrow();
            expect(() => aNInput._runCallbacksFoundInTheSettingsObject()).toThrow();
            expect(() => aNInput._maximumVMinAndVMaxDecimalLength()).toThrow();
            expect(() => aNInput._stripAllNonNumberCharactersFull()).toThrow();
            expect(() => aNInput._stripAllNonNumberCharactersExceptCustomDecimalChar()).toThrow();
            expect(() => aNInput._toggleNegativeBracket()).toThrow();
            expect(() => aNInput._convertToNumericString()).toThrow();
            expect(() => aNInput._toLocale()).toThrow();
            expect(() => aNInput._modifyNegativeSignAndDecimalCharacterForRawValue()).toThrow();
            expect(() => aNInput._modifyNegativeSignAndDecimalCharacterForFormattedValue()).toThrow();
            expect(() => aNInput._checkEmpty()).toThrow();
            expect(() => aNInput._addGroupSeparators()).toThrow();
            expect(() => aNInput._truncateZeros()).toThrow();
            expect(() => aNInput._roundValue()).toThrow();
            expect(() => aNInput._truncateDecimalPlaces()).toThrow();
            expect(() => aNInput._checkIfInRangeWithOverrideOption()).toThrow();
            expect(() => aNInput._getCurrentElement()).toThrow(); //FIXME à terminer
            expect(() => aNInput._keepAnOriginalSettingsCopy()).toThrow();
            expect(() => aNInput._readCookie()).toThrow();
            expect(() => aNInput._storageTest()).toThrow();
            expect(() => aNInput._isInputTypeSupported()).toThrow();
            expect(() => aNInput._trimLeadingAndTrailingZeros()).toThrow();
            expect(() => aNInput._trimPaddedZerosFromDecimalPlaces()).toThrow();
            expect(() => aNInput._saveValueToPersistentStorage()).toThrow();
            expect(() => aNInput._getStringOrArray()).toThrow();
            expect(() => aNInput._onFocusInAndMouseEnter()).toThrow();
            expect(() => aNInput._onFocus()).toThrow();
            expect(() => aNInput._onKeydown()).toThrow();
            expect(() => aNInput._onKeypress()).toThrow();
            expect(() => aNInput._onKeyup()).toThrow();
            expect(() => aNInput._onFocusOutAndMouseLeave()).toThrow();
            expect(() => aNInput._onPaste()).toThrow();
            expect(() => aNInput._onBlur()).toThrow();
            expect(() => aNInput._onWheel()).toThrow();
            expect(() => aNInput._onFormSubmit()).toThrow();
            expect(() => aNInput._onFormReset()).toThrow();
            expect(() => aNInput._isElementSupported()).toThrow();
            expect(() => aNInput._formatDefaultValueOnPageLoad()).toThrow();
            expect(() => aNInput._correctNegativePositiveSignPlacementOption()).toThrow();
            expect(() => aNInput._calculateVMinAndVMaxIntegerSizes()).toThrow();
            expect(() => aNInput._correctDecimalPlacesOverrideOption()).toThrow();
            expect(() => aNInput._setAlternativeDecimalSeparatorCharacter()).toThrow();
            expect(() => aNInput._cachesUsualRegularExpressions()).toThrow();
            expect(() => aNInput._transformOptionsValuesToDefaultTypes()).toThrow();
            expect(() => aNInput._convertOldOptionsToNewOnes()).toThrow();
            expect(() => aNInput._setSettings()).toThrow();
            expect(() => aNInput._toNumericValue()).toThrow();
            expect(() => aNInput._preparePastedText()).toThrow();
            expect(() => aNInput._checkIfInRange()).toThrow();
            expect(() => aNInput._updateInternalProperties()).toThrow();
            expect(() => aNInput._updateEventKeycode()).toThrow();
            expect(() => aNInput._saveCancellableValue()).toThrow();
            expect(() => aNInput._setSelection()).toThrow();
            expect(() => aNInput._setCaretPosition()).toThrow();
            expect(() => aNInput._getLeftAndRightPartAroundTheSelection()).toThrow();
            expect(() => aNInput._getUnformattedLeftAndRightPartAroundTheSelection()).toThrow();
            expect(() => aNInput._normalizeParts()).toThrow();
            expect(() => aNInput._setValueParts()).toThrow();
            expect(() => aNInput._getSignPosition()).toThrow();
            expect(() => aNInput._expandSelectionOnSign()).toThrow();
            expect(() => aNInput._checkPaste()).toThrow();
            expect(() => aNInput._processNonPrintableKeysAndShortcuts()).toThrow();
            expect(() => aNInput._defaultSelectAll()).toThrow();
            expect(() => aNInput._processCharacterDeletionIfTrailingNegativeSign()).toThrow();
            expect(() => aNInput._processCharacterDeletion()).toThrow();
            expect(() => aNInput._processCharacterInsertion()).toThrow();
            expect(() => aNInput._formatValue()).toThrow();
            expect(() => aNInput._getParentForm()).toThrow();
        });
        */

        it(`should recognize the 'clear' method`, () => {
            // Special case that needs to be done alone since it reset the AutoNumeric element content
            expect(() => aNInput.clear()).not.toThrow();
            expect(() => aNInput.clear(true)).not.toThrow();
        });

        it(`should recognize the 'remove' method`, () => {
            // Special case that needs to be done alone since it remove the AutoNumeric object
            expect(() => aNInput.remove()).not.toThrow();
        });

        it(`should recognize the 'wipe' method`, () => {
            // Special case that needs to be done alone since it remove the AutoNumeric object
            expect(() => aNInput.wipe()).not.toThrow();
        });

        it(`should recognize the 'nuke' method`, () => {
            const anotherInput = document.createElement('input');
            anotherInput.id = 'randomStringThatIsUnique_eech6Ohv';
            document.body.appendChild(anotherInput);
            const anotherAnInput = new AutoNumeric(anotherInput); // Initiate the autoNumeric input

            // Special case that needs to be done alone since it remove the AutoNumeric object
            expect(() => anotherAnInput.nuke()).not.toThrow();
            // Test that the anInput.node() element is no more
            const verifNoMoreElement = document.getElementById('randomStringThatIsUnique_eech6Ohv');
            expect(verifNoMoreElement).toBeNull();
        });

        it('should not recognize non-existant methods', () => {
            expect(() => aNInput(1)).toThrow();
            expect(() => aNInput(-10)).toThrow();
            expect(() => aNInput.foobar('foobar')).toThrow();
        });
    });

    describe('initialization methods', () => {
        let newInput;
        const options = { decimalCharacter: ',', digitGroupSeparator: '.' };

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
        });

        afterEach(() => { // Un-initialization
            document.body.removeChild(newInput);
        });

        it('should correctly initialize non-input elements', () => {
            // Create elements
            const p1 = document.createElement('p');
            p1.textContent = '0.0214';
            document.body.appendChild(p1);
            const p2 = document.createElement('p');
            document.body.appendChild(p2);
            const code = document.createElement('code');
            code.textContent = '12345.67';
            document.body.appendChild(code);
            const div = document.createElement('div');
            div.textContent = '12345.67';
            document.body.appendChild(div);
            const h5 = document.createElement('h5');
            h5.textContent = '12345.67';
            document.body.appendChild(h5);
            const label = document.createElement('label');
            label.textContent = '12345.67';
            document.body.appendChild(label);
            const span = document.createElement('span');
            span.textContent = '12345.67';
            document.body.appendChild(span);

            expect(() => new AutoNumeric(newInput)).not.toThrow();
            expect(new AutoNumeric(p1, { decimalPlacesShownOnBlur: 3, decimalPlacesRawValue: 4, divisorWhenUnfocused: 0.01, symbolWhenUnfocused: '%' }).getFormatted()).toEqual('2.140%');
            expect(new AutoNumeric(p2, 666.42).french().getFormatted()).toEqual('666,42 €');
            expect(new AutoNumeric(code, AutoNumeric.getPredefinedOptions().Japanese).getFormatted()).toEqual('¥12,345.67');
            expect(new AutoNumeric(div).northAmerican().getFormatted()).toEqual('$12,345.67');
            expect(new AutoNumeric(h5, 666.42).swiss().getFormatted()).toEqual('666.42 CHF');
            expect(new AutoNumeric(label).getFormatted()).toEqual('12,345.67');
            expect(new AutoNumeric(span, '').getFormatted()).toEqual('');

            // Remove the elements
            document.body.removeChild(p1);
            document.body.removeChild(p2);
            document.body.removeChild(code);
            document.body.removeChild(div);
            document.body.removeChild(h5);
            document.body.removeChild(label);
            document.body.removeChild(span);
        });

        it('should fail initializing an input element of type `number`', () => {
            // Create the element
            const inputNumber = document.createElement('input');
            inputNumber.type = 'number';
            inputNumber.value = '663241800.0214';
            document.body.appendChild(inputNumber);

            expect(() => new AutoNumeric(inputNumber)).toThrow();

            // Remove the element
            document.body.removeChild(inputNumber);
        });

        it('should correctly initialize input element of type `tel`', () => {
            // Create the element
            const inputTel = document.createElement('input');
            inputTel.type = 'tel';
            inputTel.value = '663241800.0214';
            document.body.appendChild(inputTel);

            expect(new AutoNumeric(inputTel).french().getFormatted()).toEqual('663.241.800,02 €');

            // Remove the element
            document.body.removeChild(inputTel);
        });

        it('should correctly initialize input element of type `hidden`', () => {
            // Create the element
            const inputHidden = document.createElement('input');
            inputHidden.type = 'hidden';
            inputHidden.value = '663241800.0214';
            document.body.appendChild(inputHidden);

            expect(new AutoNumeric(inputHidden).french().getFormatted()).toEqual('663.241.800,02 €');

            // Remove the element
            document.body.removeChild(inputHidden);
        });

        it('should correctly initialize the AutoNumeric element with only a DOM element', () => {
            expect(() => new AutoNumeric(newInput)).not.toThrow();
        });

        it('should correctly initialize the AutoNumeric element with one option object', () => {
            expect(() => new AutoNumeric(newInput, options)).not.toThrow();
        });

        it('should correctly initialize the AutoNumeric element when passed a pre-defined option name and a DOM element', () => {
            let anElement = null;

            // new AutoNumeric(domElement, 'euroPos'); // With one pre-defined option name
            expect(() => anElement = new AutoNumeric(newInput, 'euro')).not.toThrow();
            expect(anElement.set(1234567.89).getFormatted()).toEqual('1.234.567,89 €');
            anElement.wipe();
            expect(() => anElement = new AutoNumeric(newInput, 'dollar')).not.toThrow();
            expect(anElement.set(1234567.89).getFormatted()).toEqual('$1,234,567.89');
            anElement.wipe();
            expect(() => anElement = new AutoNumeric(newInput, 'foobar')).toThrow();

            // new AutoNumeric(domElement, 12345.789, 'euroPos');
            anElement.wipe();
            expect(() => anElement = new AutoNumeric(newInput, 1234567.89, 'euro')).not.toThrow();
            expect(anElement.getFormatted()).toEqual('1.234.567,89 €');
            anElement.wipe();
            expect(() => anElement = new AutoNumeric(newInput, 1234567.89, 'dollar')).not.toThrow();
            expect(anElement.getFormatted()).toEqual('$1,234,567.89');
            anElement.wipe();
            expect(() => anElement = new AutoNumeric(newInput, 1234567.89, 'foobar')).toThrow();
        });

        it('should correctly initialize the AutoNumeric element when passed an array of options', () => {
            let anElement = null;
            expect(() => anElement = new AutoNumeric(newInput, [
                options,
                {
                    currencySymbol     : '#',
                    digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.apostrophe,
                },
                {
                    digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.thinSpace,
                    decimalCharacter   : AutoNumeric.options.decimalCharacter.middleDot,
                },
            ])).not.toThrow(); // With multiple option objects
            expect(anElement.set(1234567.89).getFormatted()).toEqual('#1 234 567·89');
        });

        it('should correctly initialize the AutoNumeric element when passed an array of options with pre-defined option names', () => {
            let anElement = null;
            expect(() => anElement = new AutoNumeric(newInput, [
                options,
                {
                    currencySymbol     : '#',
                    digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.apostrophe,
                },
                'euro',
                {
                    currencySymbol     : '!',
                },
            ])).not.toThrow(); // With multiple option objects
            expect(anElement.set(1234567.89).getFormatted()).toEqual('1.234.567,89!');
        });

        it('should ignore unknown pre-defined option name when initializing the AutoNumeric element with an array of options with pre-defined option names', () => {
            spyOn(console, 'warn');
            let anElement = null;
            expect(() => anElement = new AutoNumeric(newInput, [
                options,
                {
                    currencySymbol     : '#',
                    digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.apostrophe,
                },
                'euro',
                {
                    currencySymbol     : '!',
                },
                'foobar',
            ])).not.toThrow(); // With multiple option objects
            expect(console.warn).toHaveBeenCalled();
            expect(console.warn).toHaveBeenCalledTimes(1);
            expect(anElement.set(1234567.89).getFormatted()).toEqual('1.234.567,89!');
        });

        it('should correctly initialize the AutoNumeric element with one option object and a null initial value', () => {
            expect(() => new AutoNumeric(newInput, null, options)).not.toThrow();
        });

        it('should correctly initialize the AutoNumeric element when passed an array of options', () => {
            let anElement = null;
            expect(() => anElement = new AutoNumeric(newInput, null, [
                options,
                {
                    currencySymbol     : '#',
                    digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.apostrophe,
                },
                {
                    digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.thinSpace,
                    decimalCharacter   : AutoNumeric.options.decimalCharacter.middleDot,
                },
            ])).not.toThrow(); // With multiple option objects
            expect(anElement.set(1234567.89).getFormatted()).toEqual('#1 234 567·89');
        });

        it('should correctly initialize the AutoNumeric element when passed an array of options, and an initial value', () => {
            let anElement = null;
            expect(() => anElement = new AutoNumeric(newInput, 1234567.89, [
                options,
                {
                    currencySymbol     : '#',
                    digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.apostrophe,
                },
                {
                    digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.thinSpace,
                    decimalCharacter   : AutoNumeric.options.decimalCharacter.middleDot,
                },
            ])).not.toThrow(); // With multiple option objects
            expect(anElement.getFormatted()).toEqual('#1 234 567·89');


            anElement.wipe();
            expect(() => anElement = new AutoNumeric(newInput, '1234567.89', [
                options,
                {
                    currencySymbol     : '#',
                    digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.apostrophe,
                },
                {
                    digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.thinSpace,
                    decimalCharacter   : AutoNumeric.options.decimalCharacter.middleDot,
                },
            ])).not.toThrow(); // With multiple option objects
            expect(anElement.getFormatted()).toEqual('#1 234 567·89');


            anElement.wipe();
            expect(() => anElement = new AutoNumeric(newInput, '', [
                options,
                {
                    currencySymbol     : '#',
                    digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.apostrophe,
                },
                {
                    digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.thinSpace,
                    decimalCharacter   : AutoNumeric.options.decimalCharacter.middleDot,
                },
            ])).not.toThrow(); // With multiple option objects
            expect(anElement.getFormatted()).toEqual('');
            expect(anElement.set(1234567.89).getFormatted()).toEqual('#1 234 567·89');
        });

        it('should correctly initialize the AutoNumeric element with one option object and an empty initial value', () => {
            expect(() => new AutoNumeric(newInput, '', options)).not.toThrow();
        });

        it('should correctly initialize the AutoNumeric element with one pre-defined language object', () => {
            expect(() => new AutoNumeric(newInput).french()).not.toThrow();
        });

        it('should correctly initialize the AutoNumeric element with one pre-defined language object and additional options that will override the defaults', () => {
            expect(() => new AutoNumeric(newInput).french(options)).not.toThrow();
        });

        it('should correctly initialize the AutoNumeric element with the default options and an initial value', () => {
            expect(() => new AutoNumeric(newInput, 12345.789)).not.toThrow();
        });

        it('should correctly initialize the AutoNumeric element with an number as the initial value and some options', () => {
            expect(() => new AutoNumeric(newInput, 12345.789, options)).not.toThrow();
        });

        it('should correctly initialize the AutoNumeric element with a numeric string as the initial value and some options', () => {
            expect(() => new AutoNumeric(newInput, '12345.789', options)).not.toThrow();
        });

        it('should correctly initialize the AutoNumeric element with a number as the initial value, then gets its options updated', () => {
            expect(() => new AutoNumeric(newInput, 12345.789).french(options)).not.toThrow();
        });

        it('should correctly initialize the AutoNumeric element with the default options and an initial value, then gets its options updated', () => {
            expect(() => new AutoNumeric(newInput, 12345.789, options).french(options)).not.toThrow();
        });

        it('should correctly initialize the AutoNumeric element with a DOM selector and the default options', () => {
            // The AutoNumeric constructor class can also accept a string as a css selector. Under the hood this use `QuerySelector` and limit itself to only the first element it finds.
            expect(() => new AutoNumeric('input')).not.toThrow();
        });

        it('should correctly initialize the AutoNumeric element with a DOM selector and custom options', () => {
            expect(() => new AutoNumeric('input', options)).not.toThrow();
        });

        it('should correctly initialize the AutoNumeric element when passed an array of options', () => {
            let anElement = null;
            expect(() => anElement = new AutoNumeric('input', [
                options,
                {
                    currencySymbol     : '#',
                    digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.apostrophe,
                },
                {
                    digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.thinSpace,
                    decimalCharacter   : AutoNumeric.options.decimalCharacter.middleDot,
                },
            ])).not.toThrow(); // With multiple option objects
            expect(anElement.set(1234567.89).getFormatted()).toEqual('#1 234 567·89');
        });

        it('should correctly initialize the AutoNumeric element with a DOM selector and an initial value', () => {
            expect(() => new AutoNumeric('input', 12345.789)).not.toThrow();
        });

        it('should correctly initialize the AutoNumeric element when passed a pre-defined option name and a query selector', () => {
            let anElement = null;

            // new AutoNumeric('.myCssClass > input', 'euroPos'); // With one pre-defined option name
            expect(() => anElement = new AutoNumeric('input', 'euro')).not.toThrow();
            expect(anElement.set(1234567.89).getFormatted()).toEqual('1.234.567,89 €');
            anElement.wipe();
            expect(() => anElement = new AutoNumeric('input', 'dollar')).not.toThrow();
            expect(anElement.set(1234567.89).getFormatted()).toEqual('$1,234,567.89');

            anElement.wipe();
            expect(() => anElement = new AutoNumeric('input', 'foobar')).toThrow();

            // new AutoNumeric('.myCssClass > input', 12345.789, 'euroPos');
            anElement.wipe();
            expect(() => anElement = new AutoNumeric('input', 1234567.89, 'euro')).not.toThrow();
            expect(anElement.getFormatted()).toEqual('1.234.567,89 €');
            anElement.wipe();
            expect(() => anElement = new AutoNumeric('input', 1234567.89, 'dollar')).not.toThrow();
            expect(anElement.getFormatted()).toEqual('$1,234,567.89');
            anElement.wipe();
            expect(() => anElement = new AutoNumeric('input', 1234567.89, 'foobar')).toThrow();
        });

        it('should correctly initialize the AutoNumeric element with a DOM selector, an initial value and custom options', () => {
            expect(() => new AutoNumeric('input', 12345.789, options)).not.toThrow();
        });

        it('should correctly initialize the AutoNumeric element when passed an array of options', () => {
            let anElement = null;
            expect(() => anElement = new AutoNumeric('input', null, [
                options,
                {
                    currencySymbol     : '#',
                    digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.apostrophe,
                },
                {
                    digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.thinSpace,
                    decimalCharacter   : AutoNumeric.options.decimalCharacter.middleDot,
                },
            ])).not.toThrow(); // With multiple option objects
            expect(anElement.set(1234567.89).getFormatted()).toEqual('#1 234 567·89');
        });

        it('should correctly initialize the AutoNumeric element', () => {
            const an = new AutoNumeric('input', 12300.789); //FIXME Move those tests in another test suite
            an.node().id = 'idInputNode';
            expect(AutoNumeric.test('#idInputNode')).toEqual(true); // Check that `test()` accept either a DOM element or a selector string
            expect(AutoNumeric.test(an.node())).toEqual(true);
            expect(an.getFormatted()).toEqual('12,300.79');
            an.french();
            expect(an.getFormatted()).toEqual('12.300,79 €');
            an.french({ currencySymbol : '#' });
            expect(an.getFormatted()).toEqual('12.300,79#');
            an.remove(); // This prevent reinitializing an already initialized DOM element
            expect(() => new AutoNumeric('input', 12300.789).french(options)).not.toThrow();
        });

        it('should correctly initialize the AutoNumeric element with a DOM selector, an initial value and custom options, then gets its options updated', () => {
            expect(() => new AutoNumeric('input', 12345.789, options).french(options)).not.toThrow();
        });

        it('should not correctly initialize the AutoNumeric element and throw', () => {
            expect(() => new AutoNumeric(0)).toThrow();
            expect(() => new AutoNumeric(null)).toThrow();
            expect(() => new AutoNumeric(undefined)).toThrow();
            expect(() => new AutoNumeric([])).toThrow();
            expect(() => new AutoNumeric({})).toThrow();
            expect(() => new AutoNumeric('42')).toThrow();
            expect(() => new AutoNumeric('foobar')).toThrow();

            expect(() => new AutoNumeric('input', 'foobar')).toThrow();
            expect(() => new AutoNumeric('input', 1235, 'foobar')).toThrow();
            expect(() => new AutoNumeric('input', [])).toThrow();
        });

        it('should correctly initialize the AutoNumeric element when the `formatOnPageLoad` option is set', () => {
            let aNInput;

            // No format on load
            aNInput = new AutoNumeric(newInput, 12234678.321, { currencySymbol:'$', formatOnPageLoad: false }); // An initial value, but not formatted on load
            expect(aNInput.getNumericString()).toEqual('12234678.321');
            expect(aNInput.getFormatted()).toEqual('12234678.321');
            aNInput.node().focus();
            expect(aNInput.getFormatted()).toEqual('$12,234,678.32');
            aNInput.wipe();

            aNInput = new AutoNumeric(newInput, null, { currencySymbol:'$', formatOnPageLoad: false }); // No initial value
            expect(aNInput.getNumericString()).toEqual('');
            expect(aNInput.getFormatted()).toEqual('');
            aNInput.wipe();

            aNInput = new AutoNumeric(newInput, { currencySymbol:'$', formatOnPageLoad: false }); // No initial value
            expect(aNInput.getNumericString()).toEqual('');
            expect(aNInput.getFormatted()).toEqual('');
            aNInput.wipe();

            aNInput = new AutoNumeric(newInput, null, { currencySymbol:'$', formatOnPageLoad: false, emptyInputBehavior: AutoNumeric.options.emptyInputBehavior.null });
            expect(aNInput.getNumericString()).toEqual('');
            expect(aNInput.getFormatted()).toEqual('');
            aNInput.set(null);
            expect(aNInput.getNumericString()).toEqual(null);
            expect(aNInput.getFormatted()).toEqual('');
            aNInput.wipe();


            // Format on load
            aNInput = new AutoNumeric(newInput, 12234678.321, { currencySymbol:'$', formatOnPageLoad: true }); // An initial value formatted on load
            expect(aNInput.getNumericString()).toEqual('12234678.32');
            expect(aNInput.getFormatted()).toEqual('$12,234,678.32');
            aNInput.wipe();

            aNInput = new AutoNumeric(newInput, null, { currencySymbol:'$', formatOnPageLoad: true });
            expect(aNInput.getNumericString()).toEqual('');
            expect(aNInput.getFormatted()).toEqual('');
            aNInput.wipe();

            aNInput = new AutoNumeric(newInput, null, { currencySymbol:'$', formatOnPageLoad: true, emptyInputBehavior: AutoNumeric.options.emptyInputBehavior.null });
            expect(aNInput.getNumericString()).toEqual('');
            expect(aNInput.getFormatted()).toEqual('');
            aNInput.set(null);
            expect(aNInput.getNumericString()).toEqual(null);
            expect(aNInput.getFormatted()).toEqual('');
            aNInput.wipe();
        });

        it('should correctly initialize the AutoNumeric element when the `formatOnPageLoad` option is set and the html `value` attribute has a whitespace on the left', () => {
            newInput.setAttribute('value', ' 42.34');
            expect(newInput.getAttribute('value')).toEqual(' 42.34');
            const aNInput = new AutoNumeric(newInput);
            expect(aNInput.getNumericString()).toEqual('42.34');
            expect(aNInput.getFormatted()).toEqual('42.34');
        });

        it('should correctly initialize the AutoNumeric element when the `formatOnPageLoad` option is set and the html `value` attribute has a whitespace on the right', () => {
            newInput.setAttribute('value', '24.78 ');
            expect(newInput.getAttribute('value')).toEqual('24.78 ');
            const aNInput = new AutoNumeric(newInput);
            expect(aNInput.getNumericString()).toEqual('24.78');
            expect(aNInput.getFormatted()).toEqual('24.78');
        });

        it('should correctly initialize the AutoNumeric element when the `formatOnPageLoad` option is set and the html `value` attribute  has whitespaces on both sides', () => {
            newInput.setAttribute('value', ' 1222.7993 ');
            expect(newInput.getAttribute('value')).toEqual(' 1222.7993 ');
            const aNInput = new AutoNumeric(newInput);
            expect(aNInput.getNumericString()).toEqual('1222.8');
            expect(aNInput.getFormatted()).toEqual('1,222.80');
        });
    });
});

describe('autoNumeric options and `options.*` methods', () => {
    describe('`options.*` methods', () => {
        let aNInput;
        let newInput;

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
        });

        afterEach(() => { // Un-initialization
            aNInput.remove();
            document.body.removeChild(newInput);
        });

        it('should correctly update the minimum and maximum range values', () => {
            //XXX Note: The user cannot modify the `minimumValue` and `maximumValue` option if the current value is out of range with those updated options. This attempt will throw an error, and the `minimumValue` or `maximumValue` option will be reverted to the previous valid ones.
            spyOn(console, 'warn');

            // Initialize the range
            aNInput = new AutoNumeric(newInput, AutoNumeric.predefinedOptions.French);
            aNInput.options.minimumValue(-1000);
            aNInput.options.maximumValue(1000);

            // Test setting the value, without changing the range
            // Test ----------Min-----[Val]-----Max----------
            expect(() => aNInput.set(-1000)).not.toThrow();
            expect(() => aNInput.set(1000)).not.toThrow();
            expect(() => aNInput.set(200)).not.toThrow();
            expect(() => aNInput.set(-400)).not.toThrow();

            // Test ----------Min----------Max-----[Val]-----
            expect(() => aNInput.set(99999)).toThrow();
            // Test -----[Val]-----Min----------Max----------
            expect(() => aNInput.set(-99999)).toThrow();

            // Now, instead of trying to change the value directly, let's change the range while the value stays the same
            expect(aNInput.getFormatted()).toEqual('-400,00\u202f€');
            // Test ----------Min-----[Val]-----Max----------
            expect(() => aNInput.options.maximumValue(200)).not.toThrow();
            expect(() => aNInput.options.maximumValue(-399)).not.toThrow();
            expect(() => aNInput.options.minimumValue(-500)).not.toThrow();
            expect(() => aNInput.options.minimumValue(-401)).not.toThrow();
            expect(() => aNInput.options.minimumValue(-400)).not.toThrow();

            // Reset the range and value to make the following tests more readable
            aNInput.options.minimumValue(-1000);
            aNInput.options.maximumValue(1000);
            aNInput.set('');

            // Then make the tests fails by trying to move the ranges at the 'wrong' places
            // Test ----------Max----------Min----------
            expect(() => aNInput.options.minimumValue(2000)).toThrow();
            expect(aNInput.getSettings().minimumValue).toEqual('-1000');

            aNInput.set(222);
            expect(aNInput.getFormatted()).toEqual('222,00\u202f€');

            // Test -----[Val]-----Min----------Max----------
            expect(() => aNInput.options.minimumValue(400)).toThrow();
            expect(aNInput.getSettings().minimumValue).toEqual('-1000');
            aNInput.set(224);
            expect(aNInput.getFormatted()).toEqual('224,00\u202f€');
            expect(() => aNInput.set(-1001)).toThrow();

            // Test ----------Min----------Max-----[Val]-----
            expect(() => aNInput.options.maximumValue(200)).toThrow();
            expect(aNInput.getSettings().maximumValue).toEqual('1000');
            aNInput.set(225);
            expect(aNInput.getFormatted()).toEqual('225,00\u202f€');
            expect(() => aNInput.set(1001)).toThrow();
        });

        it('should correctly update single options and `reset()` all', () => {
            aNInput = new AutoNumeric(newInput, 1146789.02, AutoNumeric.predefinedOptions.French);
            expect(aNInput.getNumericString()).toEqual('1146789.02');
            expect(aNInput.getFormatted()).toEqual('1.146.789,02\u202f€');
            expect(aNInput.getSettings().decimalPlaces).toEqual('2');
            expect(aNInput.getSettings().decimalPlacesRawValue).toEqual(2);
            expect(aNInput.getSettings().decimalPlacesShownOnFocus).toEqual('2');
            expect(aNInput.getSettings().decimalPlacesShownOnBlur).toEqual('2');

            aNInput.options.digitGroupSeparator(AutoNumeric.options.digitGroupSeparator.apostrophe);
            expect(aNInput.getFormatted()).toEqual(`1'146'789,02\u202f€`);
            aNInput.options.digitalGroupSpacing(AutoNumeric.options.digitalGroupSpacing.two);
            expect(aNInput.getFormatted()).toEqual(`11'46'789,02\u202f€`);
            aNInput.options.decimalCharacter(AutoNumeric.options.decimalCharacter.middleDot);
            expect(aNInput.getFormatted()).toEqual(`11'46'789·02\u202f€`);
            aNInput.options.currencySymbol(AutoNumeric.options.currencySymbol.franc);
            expect(aNInput.getFormatted()).toEqual(`11'46'789·02₣`);
            aNInput.options.currencySymbolPlacement(AutoNumeric.options.currencySymbolPlacement.prefix);
            expect(aNInput.getFormatted()).toEqual(`₣11'46'789·02`);
            aNInput.options.showPositiveSign(AutoNumeric.options.showPositiveSign.show);
            expect(aNInput.getFormatted()).toEqual(`+₣11'46'789·02`);

            aNInput.options.reset().french().set(-1234567.89);
            expect(aNInput.getSettings().decimalPlaces).toEqual('2');
            expect(aNInput.getSettings().decimalPlacesRawValue).toEqual('2');
            expect(aNInput.getSettings().originalDecimalPlacesRawValue).toEqual(null);
            expect(aNInput.getSettings().decimalPlacesShownOnFocus).toEqual('2');
            expect(aNInput.getSettings().decimalPlacesShownOnBlur).toEqual('2');

            expect(aNInput.getFormatted()).toEqual('-1.234.567,89\u202f€');
            aNInput.options.negativePositiveSignPlacement(AutoNumeric.options.negativePositiveSignPlacement.suffix);
            expect(aNInput.getFormatted()).toEqual('1.234.567,89\u202f€-');
            aNInput.options.suffixText(AutoNumeric.options.suffixText.percentage);
            expect(aNInput.getFormatted()).toEqual('1.234.567,89\u202f€-%');
            aNInput.options.suffixText(AutoNumeric.options.suffixText.none);
            expect(aNInput.getFormatted()).toEqual('1.234.567,89\u202f€-');

            expect(aNInput.getSettings().historySize).toEqual('20');
            aNInput.options.historySize(30);
            expect(aNInput.getSettings().historySize).toEqual(30);

            expect(aNInput.getSettings().decimalPlacesRawValue).toEqual('2');
            expect(aNInput.getSettings().originalDecimalPlacesRawValue).toEqual(null);
            expect(() => aNInput.options.rawValueDivisor(0)).toThrow();
            expect(aNInput.getSettings().decimalPlacesRawValue).toEqual('2');
            expect(aNInput.getSettings().originalDecimalPlacesRawValue).toEqual(null);
            expect(() => aNInput.options.rawValueDivisor(1)).toThrow();
            expect(aNInput.getSettings().decimalPlacesRawValue).toEqual('2');
            expect(aNInput.getSettings().originalDecimalPlacesRawValue).toEqual(null);
            expect(() => aNInput.options.rawValueDivisor(AutoNumeric.options.rawValueDivisor.none)).not.toThrow();
            expect(aNInput.getSettings().decimalPlacesRawValue).toEqual('2');
            expect(() => aNInput.options.rawValueDivisor(AutoNumeric.options.rawValueDivisor.percentage)).not.toThrow();
            expect(aNInput.getSettings().decimalPlacesRawValue).toEqual('4');

            aNInput.options.reset().french().set(-1234567.89);
            spyOn(console, 'warn');
            aNInput.options.decimalPlaces(4);
            expect(console.warn).toHaveBeenCalledTimes(1);
            expect(aNInput.getSettings().decimalPlaces).toEqual('4');
            expect(aNInput.getSettings().decimalPlacesRawValue).toEqual('4');
            expect(aNInput.getSettings().decimalPlacesShownOnFocus).toEqual('4');
            expect(aNInput.getSettings().decimalPlacesShownOnBlur).toEqual('4');

            expect(aNInput.getFormatted()).toEqual('-1.234.567,8900\u202f€');
            aNInput.options.divisorWhenUnfocused(AutoNumeric.options.divisorWhenUnfocused.percentage);
            aNInput.options.decimalPlacesShownOnBlur(3);
            aNInput.options.symbolWhenUnfocused(AutoNumeric.options.symbolWhenUnfocused.percentage);
            expect(aNInput.getFormatted()).toEqual('-12.345,679\u202f€%');

            aNInput.options.reset().french();
            expect(aNInput.node().classList.contains('neg')).toEqual(false);
            expect(aNInput.node().classList.contains('pos')).toEqual(false);
            aNInput.options.styleRules({ positive: 'pos', negative: 'neg' }).set(-10);
            expect(aNInput.getFormatted()).toEqual('-10,00\u202f€');
            expect(aNInput.node().classList.contains('neg')).toEqual(true);
            expect(aNInput.node().classList.contains('pos')).toEqual(false);
            aNInput.set(10);
            expect(aNInput.node().classList.contains('neg')).toEqual(false);
            expect(aNInput.node().classList.contains('pos')).toEqual(true);

            aNInput.options.reset().french().set(-1234567.846);
            expect(aNInput.getFormatted()).toEqual('-1.234.567,85\u202f€');
            aNInput.options.roundingMethod(AutoNumeric.options.roundingMethod.downRoundTowardZero);
            aNInput.set(-1234567.846);
            expect(aNInput.getFormatted()).toEqual('-1.234.567,84\u202f€');

            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.always);
            aNInput.set(-1234567);
            expect(aNInput.getFormatted()).toEqual('-1.234.567,00\u202f€');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.never);
            expect(console.warn).toHaveBeenCalledTimes(2);
            expect(aNInput.getFormatted()).toEqual('-1.234.567\u202f€');
            aNInput.set(-1234567.8);
            expect(aNInput.getFormatted()).toEqual('-1.234.567,8\u202f€');
            aNInput.set(-1234567);
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.floats);
            expect(console.warn).toHaveBeenCalledTimes(2);
            expect(aNInput.getFormatted()).toEqual('-1.234.567\u202f€');
            aNInput.set(-1234567.8);
            expect(aNInput.getFormatted()).toEqual('-1.234.567,80\u202f€');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.always);

            aNInput.options.emptyInputBehavior(AutoNumeric.options.emptyInputBehavior.null);
            aNInput.set(null);
            expect(aNInput.getNumericString()).toEqual(null);
            expect(aNInput.getFormatted()).toEqual('');
            expect(aNInput.getNumber()).toEqual(null);
            // Special case where changing the `emptyInputBehavior` option to something different from `AutoNumeric.options.emptyInputBehavior.null` while the rawValue is equal to `null`, modify that rawValue to '' automatically
            aNInput.options.emptyInputBehavior(AutoNumeric.options.emptyInputBehavior.focus);
            expect(console.warn).toHaveBeenCalledTimes(3);
            expect(aNInput.getFormatted()).toEqual('');
            expect(aNInput.getNumber()).toEqual(0);

            aNInput.options.reset().french().set('');
            aNInput.options.emptyInputBehavior(AutoNumeric.options.emptyInputBehavior.press);
            expect(aNInput.getFormatted()).toEqual('');
            aNInput.options.reset().french().set('');
            aNInput.options.emptyInputBehavior(AutoNumeric.options.emptyInputBehavior.focus);
            expect(aNInput.getFormatted()).toEqual('');
            aNInput.options.reset().french().set('');
            aNInput.options.emptyInputBehavior(AutoNumeric.options.emptyInputBehavior.always);
            expect(aNInput.getFormatted()).toEqual('\u202f€');
            aNInput.options.reset().french().set('');
            aNInput.options.emptyInputBehavior(AutoNumeric.options.emptyInputBehavior.min);
            expect(aNInput.getFormatted()).toEqual('-10.000.000.000.000,00\u202f€');
            expect(aNInput.getNumericString()).toEqual('-10000000000000');
            aNInput.options.reset().french().set('');
            aNInput.options.emptyInputBehavior(AutoNumeric.options.emptyInputBehavior.max);
            expect(aNInput.getFormatted()).toEqual('10.000.000.000.000,00\u202f€');
            expect(aNInput.getNumericString()).toEqual('10000000000000');
            aNInput.options.reset().french().set('');
            aNInput.options.emptyInputBehavior(AutoNumeric.options.emptyInputBehavior.zero);
            expect(aNInput.getFormatted()).toEqual('0,00\u202f€');
            expect(aNInput.getNumericString()).toEqual('0');
            aNInput.options.reset().french().set('');
            aNInput.options.emptyInputBehavior(-1);
            expect(aNInput.getFormatted()).toEqual('-1,00\u202f€');
            expect(aNInput.getNumericString()).toEqual('-1');
            aNInput.options.reset().french().set('');
            aNInput.options.emptyInputBehavior('-1');
            expect(aNInput.getFormatted()).toEqual('-1,00\u202f€');
            expect(aNInput.getNumericString()).toEqual('-1');
            aNInput.options.emptyInputBehavior(-42.6283).set('');
            expect(aNInput.getFormatted()).toEqual('-42,63\u202f€');
            expect(aNInput.getNumericString()).toEqual('-42.63');
            aNInput.options.emptyInputBehavior(67242.6283).set('');
            expect(aNInput.getFormatted()).toEqual('67.242,63\u202f€');
            expect(aNInput.getNumericString()).toEqual('67242.63');
            aNInput.options.emptyInputBehavior(-222).set('');
            expect(aNInput.getFormatted()).toEqual('-222,00\u202f€');
            expect(aNInput.getNumericString()).toEqual('-222');

            aNInput.options.reset().french().set(-1234567.89);
            aNInput.options.leadingZero(AutoNumeric.options.leadingZero.deny);
            aNInput.set('000001.2345');
            expect(aNInput.getFormatted()).toEqual('1,23\u202f€');
            aNInput.options.leadingZero(AutoNumeric.options.leadingZero.keep);
            expect(aNInput.getFormatted()).toEqual('1,23\u202f€');
            aNInput.set('000001.2345');
            expect(aNInput.getFormatted()).toEqual('000.001,23\u202f€');

            aNInput.set(-12356.78);
            expect(aNInput.getLocalized()).toEqual('-12356.78');
            aNInput.options.outputFormat(AutoNumeric.options.outputFormat.dotNegative);
            expect(aNInput.getLocalized()).toEqual('12356.78-');
            aNInput.options.outputFormat(AutoNumeric.options.outputFormat.negativeComma);
            expect(aNInput.getLocalized()).toEqual('-12356,78');

            expect(aNInput.getFormatted()).toEqual('-12.356,78\u202f€');
            aNInput.options.negativeSignCharacter('#');
            expect(aNInput.getFormatted()).toEqual('#12.356,78\u202f€');
            aNInput.options.positiveSignCharacter('¤');
            aNInput.set(2202, { showPositiveSign: true });
            expect(aNInput.getFormatted()).toEqual('¤2.202,00\u202f€');

            // Test function chaining on `options.*`
            aNInput.options.reset().french().set(6666);
            expect(aNInput.getFormatted()).toEqual('6.666,00\u202f€');
            aNInput.options.digitGroupSeparator(AutoNumeric.options.digitGroupSeparator.narrowNoBreakSpace)
                .options.decimalCharacter(AutoNumeric.options.decimalCharacter.decimalSeparatorKeySymbol);
            expect(aNInput.getFormatted()).toEqual('6\u202f666⎖00\u202f€');

            //FIXME Add the WheelOn tests
        });

        it('should correctly update the `decimalPlacesShownOnFocus` option', () => {
            aNInput = new AutoNumeric(newInput, AutoNumeric.predefinedOptions.French);
            expect(aNInput.getSettings().decimalPlacesRawValue).toEqual(2);
            aNInput.update({ decimalPlacesShownOnFocus : 4 }); // Note: You do not need to set `decimalPlacesRawValue`, it is taken care of automatically
            expect(aNInput.getSettings().decimalPlacesRawValue).toEqual('4');
            aNInput.set(2222.12345);
            expect(aNInput.getFormatted()).toEqual('2.222,12\u202f€');
            aNInput.node().focus();
            expect(aNInput.getFormatted()).toEqual('2.222,1235\u202f€');
        });
    });

    describe('`eventBubbles` option', () => {
        let form;
        let input;
        let aNInput;
        let customFunction;

        beforeEach(() => { // Initialization
            form = document.createElement('form');
            input = document.createElement('input');

            document.body.appendChild(form);
            form.appendChild(input);

            // Setup the spying functions
            customFunction = { // Dummy function used for spying
                testingFunc(event) {
                    console.log(`testingFunc() called from ${event.target.tagName} on ${event.currentTarget.tagName}.`); //DEBUG

                    return event;
                },
            };

            // Setup the event listeners
            form.addEventListener('click', customFunction.testingFunc);
            input.addEventListener('click', customFunction.testingFunc);
        });

        afterEach(() => { // Un-initialization
            aNInput.remove();
            form.removeChild(input);
            document.body.removeChild(form);
        });

        xit('should not modify how non-AutoNumeric or input event bubble up', () => { //FIXME The `testingFunc()` is called, but somehow Jasmine spy does not pick that up
            const spy = spyOn(customFunction, 'testingFunc');
            aNInput = new AutoNumeric(input, { eventBubbles: AutoNumeric.options.eventBubbles.doesNotBubble });
            aNInput.node().click();
            expect(customFunction.testingFunc).toHaveBeenCalledTimes(2);

            spy.calls.reset();
            expect(customFunction.testingFunc).toHaveBeenCalledTimes(0);
            aNInput.options.eventBubbles(AutoNumeric.options.eventBubbles.bubbles);
            aNInput.node().click();
            expect(customFunction.testingFunc).toHaveBeenCalledTimes(2);
        });

        it('should allow the AutoNumeric events to bubble up', () => {
            const spy = spyOn(customFunction, 'testingFunc');
            aNInput = new AutoNumeric(input, { eventBubbles: AutoNumeric.options.eventBubbles.bubbles });
            // Add the custom event listeners
            form.addEventListener(AutoNumeric.events.formatted, e => customFunction.testingFunc(e));
            input.addEventListener(AutoNumeric.events.formatted, e => customFunction.testingFunc(e));

            // Trigger the AutoNumeric event
            aNInput.set(2000);
            expect(customFunction.testingFunc).toHaveBeenCalledTimes(2);

            // Check that modifying the `eventBubbles` option on the fly works as intended
            spy.calls.reset();
            aNInput.options.eventBubbles(AutoNumeric.options.eventBubbles.doesNotBubble);
            aNInput.set(666);
            expect(customFunction.testingFunc).toHaveBeenCalledTimes(1);

            // And back
            spy.calls.reset();
            aNInput.options.eventBubbles(AutoNumeric.options.eventBubbles.bubbles);
            aNInput.set(400);
            expect(customFunction.testingFunc).toHaveBeenCalledTimes(2);
        });

        it('should not allow the AutoNumeric events to bubble up', () => {
            const spy = spyOn(customFunction, 'testingFunc');
            aNInput = new AutoNumeric(input, { eventBubbles: AutoNumeric.options.eventBubbles.doesNotBubble });
            // Add the custom event listeners
            form.addEventListener(AutoNumeric.events.formatted, e => customFunction.testingFunc(e));
            input.addEventListener(AutoNumeric.events.formatted, e => customFunction.testingFunc(e));

            // Trigger the AutoNumeric event
            aNInput.set(2000);
            expect(customFunction.testingFunc).toHaveBeenCalledTimes(1);

            // Check that modifying the `eventBubbles` option on the fly works as intended
            spy.calls.reset();
            aNInput.options.eventBubbles(AutoNumeric.options.eventBubbles.bubbles);
            aNInput.set(666);
            expect(customFunction.testingFunc).toHaveBeenCalledTimes(2);

            // And back
            spy.calls.reset();
            aNInput.options.eventBubbles(AutoNumeric.options.eventBubbles.doesNotBubble);
            aNInput.set(400);
            expect(customFunction.testingFunc).toHaveBeenCalledTimes(1);
        });
    });

    describe('`eventIsCancelable` option', () => {
        let form;
        let input;
        let aNInput;
        let customFunction;

        beforeEach(() => { // Initialization
            form = document.createElement('form');
            input = document.createElement('input');

            document.body.appendChild(form);
            form.appendChild(input);

            // Setup the spying functions
            customFunction = { // Dummy function used for spying
                testingCancelableFunc(event) {
                    // console.log('event.cancelable:', event.cancelable); //DEBUG
                    // event.preventDefault(); //XXX The important bit to test if this is allowed. This should throw an error when the event is not cancelable.
                    //XXX The documentation contradicts itself on that part. It says that calling `preventDefault()` on a non-cancelable event throws an error here (https://developer.mozilla.org/en-US/docs/Web/API/Event/cancelable), but also says that it's just ignored here (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)...
                    // console.log(`testingCancelableFunc() called from ${event.target.tagName} on ${event.currentTarget.tagName}.`); //DEBUG

                    return event.cancelable;
                },

                resetTestVariables() {
                    return { cancelableResultForm: 'foo', cancelableResultInput: 'foo' };
                },
            };
        });

        afterEach(() => { // Un-initialization
            aNInput.remove();
            form.removeChild(input);
            document.body.removeChild(form);
        });

        it('should allow the AutoNumeric events to be cancelled', () => {
            aNInput = new AutoNumeric(input, { eventIsCancelable: AutoNumeric.options.eventIsCancelable.isCancelable });
            // Add the custom event listeners
            let cancelableResultForm;
            let cancelableResultInput;
            ({ cancelableResultForm, cancelableResultInput } = customFunction.resetTestVariables());
            form.addEventListener(AutoNumeric.events.formatted, e => {
                cancelableResultForm = customFunction.testingCancelableFunc(e);
            });
            input.addEventListener(AutoNumeric.events.formatted, e => {
                cancelableResultInput = customFunction.testingCancelableFunc(e);
            });

            // Trigger the AutoNumeric event
            aNInput.set(2000);
            expect(cancelableResultForm).toEqual(true);
            expect(cancelableResultInput).toEqual(true);

            // Check that modifying the `eventIsCancelable` option on the fly works as intended
            ({ cancelableResultForm, cancelableResultInput } = customFunction.resetTestVariables());
            aNInput.options.eventIsCancelable(AutoNumeric.options.eventIsCancelable.isNotCancelable);
            aNInput.set(666);
            expect(cancelableResultForm).toEqual(false);
            expect(cancelableResultInput).toEqual(false);

            // And back
            ({ cancelableResultForm, cancelableResultInput } = customFunction.resetTestVariables());
            aNInput.options.eventIsCancelable(AutoNumeric.options.eventIsCancelable.isCancelable);
            aNInput.set(400);
            expect(cancelableResultForm).toEqual(true);
            expect(cancelableResultInput).toEqual(true);
        });

        it('should not allow the AutoNumeric events to be cancelled', () => {
            aNInput = new AutoNumeric(input, { eventIsCancelable: AutoNumeric.options.eventIsCancelable.isNotCancelable });
            // Add the custom event listeners
            let cancelableResultForm;
            let cancelableResultInput;
            ({ cancelableResultForm, cancelableResultInput } = customFunction.resetTestVariables());
            form.addEventListener(AutoNumeric.events.formatted, e => {
                cancelableResultForm = customFunction.testingCancelableFunc(e);
            });
            input.addEventListener(AutoNumeric.events.formatted, e => {
                cancelableResultInput = customFunction.testingCancelableFunc(e);
            });

            // Trigger the AutoNumeric event
            aNInput.set(2000);
            expect(cancelableResultForm).toEqual(false);
            expect(cancelableResultInput).toEqual(false);

            // Check that modifying the `eventIsCancelable` option on the fly works as intended
            ({ cancelableResultForm, cancelableResultInput } = customFunction.resetTestVariables());
            aNInput.options.eventIsCancelable(AutoNumeric.options.eventIsCancelable.isCancelable);
            aNInput.set(666);
            expect(cancelableResultForm).toEqual(true);
            expect(cancelableResultInput).toEqual(true);

            // And back
            ({ cancelableResultForm, cancelableResultInput } = customFunction.resetTestVariables());
            aNInput.options.eventIsCancelable(AutoNumeric.options.eventIsCancelable.isNotCancelable);
            aNInput.set(400);
            expect(cancelableResultForm).toEqual(false);
            expect(cancelableResultInput).toEqual(false);
        });
    });

    describe('`roundingMethod` option', () => {
        let aNInput;
        let newInput;

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
            aNInput = new AutoNumeric(newInput); // Initiate the autoNumeric input
        });

        afterEach(() => { // Un-initialization
            aNInput.remove();
            document.body.removeChild(newInput);
        });

        it('should round correctly with the method halfUpSymmetric', () => {
            expect(aNInput.getSettings().roundingMethod).toEqual(AutoNumeric.options.roundingMethod.halfUpSymmetric);
            // Positive values
            aNInput.set(1119.444);
            expect(aNInput.getFormatted()).toEqual('1,119.44');
            aNInput.set(1119.445);
            expect(aNInput.getFormatted()).toEqual('1,119.45');
            aNInput.set(1119.995);
            expect(aNInput.getFormatted()).toEqual('1,120.00');
            // Negative values
            aNInput.set(-1119.444);
            expect(aNInput.getFormatted()).toEqual('-1,119.44');
            aNInput.set(-1119.445);
            expect(aNInput.getFormatted()).toEqual('-1,119.45');
            aNInput.set(-1119.995);
            expect(aNInput.getFormatted()).toEqual('-1,120.00');
        });

        it('should round correctly with the method halfUpAsymmetric', () => {
            aNInput.update({ roundingMethod: AutoNumeric.options.roundingMethod.halfUpAsymmetric });
            // Positive values
            aNInput.set(1119.444);
            expect(aNInput.getFormatted()).toEqual('1,119.44');
            aNInput.set(1119.445);
            expect(aNInput.getFormatted()).toEqual('1,119.45');
            aNInput.set(1119.995);
            expect(aNInput.getFormatted()).toEqual('1,120.00');
            // Negative values
            aNInput.set(-1119.444);
            expect(aNInput.getFormatted()).toEqual('-1,119.44');
            aNInput.set(-1119.445);
            expect(aNInput.getFormatted()).toEqual('-1,119.44');
            aNInput.set(-1119.995);
            expect(aNInput.getFormatted()).toEqual('-1,119.99');
        });

        it('should round correctly with the method halfUpAsymmetric and a custom negative sign', () => {
            aNInput.update({
                roundingMethod       : AutoNumeric.options.roundingMethod.halfUpAsymmetric,
                negativeSignCharacter: '@',
            });
            // Positive values
            aNInput.set(1119.444);
            expect(aNInput.getFormatted()).toEqual('1,119.44');
            aNInput.set(1119.445);
            expect(aNInput.getFormatted()).toEqual('1,119.45');
            aNInput.set(1119.995);
            expect(aNInput.getFormatted()).toEqual('1,120.00');
            // Negative values
            aNInput.set(-1119.444);
            expect(aNInput.getFormatted()).toEqual('@1,119.44');
            aNInput.set(-1119.445);
            expect(aNInput.getFormatted()).toEqual('@1,119.44');
            aNInput.set(-1119.995);
            expect(aNInput.getFormatted()).toEqual('@1,119.99');
        });

        it('should round correctly with the method halfDownSymmetric', () => {
            aNInput.update({ roundingMethod: AutoNumeric.options.roundingMethod.halfDownSymmetric });
            // Positive values
            aNInput.set(1119.444);
            expect(aNInput.getFormatted()).toEqual('1,119.44');
            aNInput.set(1119.445);
            expect(aNInput.getFormatted()).toEqual('1,119.44');
            aNInput.set(1119.995);
            expect(aNInput.getFormatted()).toEqual('1,119.99');
            // Negative values
            aNInput.set(-1119.444);
            expect(aNInput.getFormatted()).toEqual('-1,119.44');
            aNInput.set(-1119.445);
            expect(aNInput.getFormatted()).toEqual('-1,119.44');
            aNInput.set(-1119.995);
            expect(aNInput.getFormatted()).toEqual('-1,119.99');
        });

        it('should round correctly with the method halfDownAsymmetric', () => {
            aNInput.update({ roundingMethod: AutoNumeric.options.roundingMethod.halfDownAsymmetric });
            // Positive values
            aNInput.set(1119.444);
            expect(aNInput.getFormatted()).toEqual('1,119.44');
            aNInput.set(1119.445);
            expect(aNInput.getFormatted()).toEqual('1,119.44');
            aNInput.set(1119.995);
            expect(aNInput.getFormatted()).toEqual('1,119.99');
            // Negative values
            aNInput.set(-1119.444);
            expect(aNInput.getFormatted()).toEqual('-1,119.44');
            aNInput.set(-1119.445);
            expect(aNInput.getFormatted()).toEqual('-1,119.45');
            aNInput.set(-1119.995);
            expect(aNInput.getFormatted()).toEqual('-1,120.00');
        });

        it('should round correctly with the method halfDownAsymmetric and a custom negative sign', () => {
            aNInput.update({
                roundingMethod       : AutoNumeric.options.roundingMethod.halfDownAsymmetric,
                negativeSignCharacter: '@',
            });
            // Positive values
            aNInput.set(1119.444);
            expect(aNInput.getFormatted()).toEqual('1,119.44');
            aNInput.set(1119.445);
            expect(aNInput.getFormatted()).toEqual('1,119.44');
            aNInput.set(1119.995);
            expect(aNInput.getFormatted()).toEqual('1,119.99');
            // Negative values
            aNInput.set(-1119.444);
            expect(aNInput.getFormatted()).toEqual('@1,119.44');
            aNInput.set(-1119.445);
            expect(aNInput.getFormatted()).toEqual('@1,119.45');
            aNInput.set(-1119.995);
            expect(aNInput.getFormatted()).toEqual('@1,120.00');
        });

        it('should round correctly with the method halfEvenBankersRounding', () => {
            aNInput.update({ roundingMethod: AutoNumeric.options.roundingMethod.halfEvenBankersRounding });
            // Positive values
            aNInput.set(1119.444);
            expect(aNInput.getFormatted()).toEqual('1,119.44');
            aNInput.set(1119.445);
            expect(aNInput.getFormatted()).toEqual('1,119.44');
            aNInput.set(1119.446);
            expect(aNInput.getFormatted()).toEqual('1,119.45');
            aNInput.set(1119.454);
            expect(aNInput.getFormatted()).toEqual('1,119.45');
            aNInput.set(1119.455);
            expect(aNInput.getFormatted()).toEqual('1,119.46');
            aNInput.set(1119.456);
            expect(aNInput.getFormatted()).toEqual('1,119.46');
            aNInput.set(1119.994);
            expect(aNInput.getFormatted()).toEqual('1,119.99');
            aNInput.set(1119.995);
            expect(aNInput.getFormatted()).toEqual('1,120.00');
            // Negative values
            aNInput.set(-1119.444);
            expect(aNInput.getFormatted()).toEqual('-1,119.44');
            aNInput.set(-1119.445);
            expect(aNInput.getFormatted()).toEqual('-1,119.44');
            aNInput.set(-1119.446);
            expect(aNInput.getFormatted()).toEqual('-1,119.45');
            aNInput.set(-1119.454);
            expect(aNInput.getFormatted()).toEqual('-1,119.45');
            aNInput.set(-1119.455);
            expect(aNInput.getFormatted()).toEqual('-1,119.46');
            aNInput.set(-1119.456);
            expect(aNInput.getFormatted()).toEqual('-1,119.46');
            aNInput.set(-1119.994);
            expect(aNInput.getFormatted()).toEqual('-1,119.99');
            aNInput.set(-1119.995);
            expect(aNInput.getFormatted()).toEqual('-1,120.00');
        });

        it('should round correctly with the method upRoundAwayFromZero', () => {
            aNInput.update({ roundingMethod: AutoNumeric.options.roundingMethod.upRoundAwayFromZero });
            // Positive values
            aNInput.set(1119.444);
            expect(aNInput.getFormatted()).toEqual('1,119.45');
            aNInput.set(1119.445);
            expect(aNInput.getFormatted()).toEqual('1,119.45');
            aNInput.set(1119.995);
            expect(aNInput.getFormatted()).toEqual('1,120.00');
            // Negative values
            aNInput.set(-1119.444);
            expect(aNInput.getFormatted()).toEqual('-1,119.45');
            aNInput.set(-1119.445);
            expect(aNInput.getFormatted()).toEqual('-1,119.45');
            aNInput.set(-1119.995);
            expect(aNInput.getFormatted()).toEqual('-1,120.00');
        });

        it('should round correctly with the method downRoundTowardZero', () => {
            aNInput.update({ roundingMethod: AutoNumeric.options.roundingMethod.downRoundTowardZero });
            // Positive values
            aNInput.set(1119.444);
            expect(aNInput.getFormatted()).toEqual('1,119.44');
            aNInput.set(1119.445);
            expect(aNInput.getFormatted()).toEqual('1,119.44');
            aNInput.set(1119.995);
            expect(aNInput.getFormatted()).toEqual('1,119.99');
            // Negative values
            aNInput.set(-1119.444);
            expect(aNInput.getFormatted()).toEqual('-1,119.44');
            aNInput.set(-1119.445);
            expect(aNInput.getFormatted()).toEqual('-1,119.44');
            aNInput.set(-1119.995);
            expect(aNInput.getFormatted()).toEqual('-1,119.99');
        });

        it('should round correctly with the method toCeilingTowardPositiveInfinity', () => {
            aNInput.update({ roundingMethod: AutoNumeric.options.roundingMethod.toCeilingTowardPositiveInfinity });
            // Positive values
            aNInput.set(1119.444);
            expect(aNInput.getFormatted()).toEqual('1,119.45');
            aNInput.set(1119.445);
            expect(aNInput.getFormatted()).toEqual('1,119.45');
            aNInput.set(1119.995);
            expect(aNInput.getFormatted()).toEqual('1,120.00');
            // Negative values
            aNInput.set(-1119.444);
            expect(aNInput.getFormatted()).toEqual('-1,119.44');
            aNInput.set(-1119.445);
            expect(aNInput.getFormatted()).toEqual('-1,119.44');
            aNInput.set(-1119.995);
            expect(aNInput.getFormatted()).toEqual('-1,119.99');
        });

        it('should round correctly with the method toCeilingTowardPositiveInfinity and a custom negative sign', () => {
            aNInput.update({
                roundingMethod       : AutoNumeric.options.roundingMethod.toCeilingTowardPositiveInfinity,
                negativeSignCharacter: '@',
            });
            // Positive values
            aNInput.set(1119.444);
            expect(aNInput.getFormatted()).toEqual('1,119.45');
            aNInput.set(1119.445);
            expect(aNInput.getFormatted()).toEqual('1,119.45');
            aNInput.set(1119.995);
            expect(aNInput.getFormatted()).toEqual('1,120.00');
            // Negative values
            aNInput.set(-1119.444);
            expect(aNInput.getFormatted()).toEqual('@1,119.44');
            aNInput.set(-1119.445);
            expect(aNInput.getFormatted()).toEqual('@1,119.44');
            aNInput.set(-1119.995);
            expect(aNInput.getFormatted()).toEqual('@1,119.99');
        });

        it('should round correctly with the method toFloorTowardNegativeInfinity', () => {
            aNInput.update({ roundingMethod: AutoNumeric.options.roundingMethod.toFloorTowardNegativeInfinity });
            // Positive values
            aNInput.set(1119.444);
            expect(aNInput.getFormatted()).toEqual('1,119.44');
            aNInput.set(1119.445);
            expect(aNInput.getFormatted()).toEqual('1,119.44');
            aNInput.set(1119.995);
            expect(aNInput.getFormatted()).toEqual('1,119.99');
            // Negative values
            aNInput.set(-1119.444);
            expect(aNInput.getFormatted()).toEqual('-1,119.45');
            aNInput.set(-1119.445);
            expect(aNInput.getFormatted()).toEqual('-1,119.45');
            aNInput.set(-1119.995);
            expect(aNInput.getFormatted()).toEqual('-1,120.00');
        });

        it('should round correctly with the method toFloorTowardNegativeInfinity', () => {
            aNInput.update({
                roundingMethod       : AutoNumeric.options.roundingMethod.toFloorTowardNegativeInfinity,
                negativeSignCharacter: '@',
            });
            // Positive values
            aNInput.set(1119.444);
            expect(aNInput.getFormatted()).toEqual('1,119.44');
            aNInput.set(1119.445);
            expect(aNInput.getFormatted()).toEqual('1,119.44');
            aNInput.set(1119.995);
            expect(aNInput.getFormatted()).toEqual('1,119.99');
            // Negative values
            aNInput.set(-1119.444);
            expect(aNInput.getFormatted()).toEqual('@1,119.45');
            aNInput.set(-1119.445);
            expect(aNInput.getFormatted()).toEqual('@1,119.45');
            aNInput.set(-1119.995);
            expect(aNInput.getFormatted()).toEqual('@1,120.00');
        });

        it('should round correctly with the method toNearest05Alt', () => {
            aNInput.update({ roundingMethod: AutoNumeric.options.roundingMethod.toNearest05Alt });
            // Positive values
            aNInput.set(1119.474);
            expect(aNInput.getFormatted()).toEqual('1,119.45');
            aNInput.set(1119.475);
            expect(aNInput.getFormatted()).toEqual('1,119.50');
            aNInput.set(1119.995);
            expect(aNInput.getFormatted()).toEqual('1,120.00');
            // Negative values
            aNInput.set(-1119.474);
            expect(aNInput.getFormatted()).toEqual('-1,119.45');
            aNInput.set(-1119.475);
            expect(aNInput.getFormatted()).toEqual('-1,119.45');
            aNInput.set(-1119.476);
            expect(aNInput.getFormatted()).toEqual('-1,119.50');
            aNInput.set(-1119.995);
            expect(aNInput.getFormatted()).toEqual('-1,120.00');
        });

        it('should round correctly with the method toNearest05', () => {
            aNInput.update({ roundingMethod: AutoNumeric.options.roundingMethod.toNearest05 });
            // Positive values
            aNInput.set(1119.474);
            expect(aNInput.getFormatted()).toEqual('1,119.45');
            aNInput.set(1119.475);
            expect(aNInput.getFormatted()).toEqual('1,119.50');
            aNInput.set(1119.995);
            expect(aNInput.getFormatted()).toEqual('1,120.00');
            // Negative values
            aNInput.set(-1119.474);
            expect(aNInput.getFormatted()).toEqual('-1,119.45');
            aNInput.set(-1119.475);
            expect(aNInput.getFormatted()).toEqual('-1,119.45');
            aNInput.set(-1119.476);
            expect(aNInput.getFormatted()).toEqual('-1,119.50');
            aNInput.set(-1119.995);
            expect(aNInput.getFormatted()).toEqual('-1,120.00');
        });

        it('should round correctly with the method upToNext05', () => {
            aNInput.update({ roundingMethod: AutoNumeric.options.roundingMethod.upToNext05 });
            // Positive values
            aNInput.set(1119.44);
            expect(aNInput.getFormatted()).toEqual('1,119.45');
            aNInput.set(1119.45);
            expect(aNInput.getFormatted()).toEqual('1,119.45');
            aNInput.set(1119.451);
            expect(aNInput.getFormatted()).toEqual('1,119.50');
            aNInput.set(1119.46);
            expect(aNInput.getFormatted()).toEqual('1,119.50');
            aNInput.set(1119.99);
            expect(aNInput.getFormatted()).toEqual('1,120.00');
            // Negative values
            aNInput.set(-1119.44);
            expect(aNInput.getFormatted()).toEqual('-1,119.40');
            aNInput.set(-1119.449);
            expect(aNInput.getFormatted()).toEqual('-1,119.40');
            aNInput.set(-1119.45);
            expect(aNInput.getFormatted()).toEqual('-1,119.45');
            aNInput.set(-1119.46);
            expect(aNInput.getFormatted()).toEqual('-1,119.45');
            aNInput.set(-1119.47);
            expect(aNInput.getFormatted()).toEqual('-1,119.45');
            aNInput.set(-1119.48);
            expect(aNInput.getFormatted()).toEqual('-1,119.45');
            aNInput.set(-1119.499);
            expect(aNInput.getFormatted()).toEqual('-1,119.45');
            aNInput.set(-1119.999);
            expect(aNInput.getFormatted()).toEqual('-1,119.95');
        });

        it('should round correctly with the method downToNext05', () => {
            aNInput.update({ roundingMethod: AutoNumeric.options.roundingMethod.downToNext05 });
            // Positive values
            aNInput.set(1119.44);
            expect(aNInput.getFormatted()).toEqual('1,119.40');
            aNInput.set(1119.45);
            expect(aNInput.getFormatted()).toEqual('1,119.45');
            aNInput.set(1119.451);
            expect(aNInput.getFormatted()).toEqual('1,119.45');
            aNInput.set(1119.46);
            expect(aNInput.getFormatted()).toEqual('1,119.45');
            aNInput.set(1119.499);
            expect(aNInput.getFormatted()).toEqual('1,119.45');
            aNInput.set(1119.99);
            expect(aNInput.getFormatted()).toEqual('1,119.95');
            aNInput.set(1119.999);
            expect(aNInput.getFormatted()).toEqual('1,119.95');
            // Negative values
            aNInput.set(-1119.44);
            expect(aNInput.getFormatted()).toEqual('-1,119.45');
            aNInput.set(-1119.449);
            expect(aNInput.getFormatted()).toEqual('-1,119.45');
            aNInput.set(-1119.45);
            expect(aNInput.getFormatted()).toEqual('-1,119.45');
            aNInput.set(-1119.451);
            expect(aNInput.getFormatted()).toEqual('-1,119.50');
            aNInput.set(-1119.46);
            expect(aNInput.getFormatted()).toEqual('-1,119.50');
            aNInput.set(-1119.47);
            expect(aNInput.getFormatted()).toEqual('-1,119.50');
            aNInput.set(-1119.48);
            expect(aNInput.getFormatted()).toEqual('-1,119.50');
            aNInput.set(-1119.499);
            expect(aNInput.getFormatted()).toEqual('-1,119.50');
            aNInput.set(-1119.999);
            expect(aNInput.getFormatted()).toEqual('-1,120.00');
        });
    });

    describe('`allowDecimalPadding` option', () => {
        let aNInput;
        let newInput;

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
        });

        afterEach(() => { // Un-initialization
            aNInput.remove();
            document.body.removeChild(newInput);
        });

        it('should show / hide decimal places correctly on positive numbers without a currency sign', () => {
            spyOn(console, 'warn');
            aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().float);

            aNInput.set(15.001);
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.always);
            expect(aNInput.getFormatted()).toEqual('15.00');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.never);
            expect(aNInput.getFormatted()).toEqual('15');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.floats);
            expect(aNInput.getFormatted()).toEqual('15');

            aNInput.set(15.20);
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.always);
            expect(aNInput.getFormatted()).toEqual('15.20');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.never);
            expect(aNInput.getFormatted()).toEqual('15.2');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.floats);
            expect(aNInput.getFormatted()).toEqual('15.20');

            aNInput.set(15);
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.always);
            expect(aNInput.getFormatted()).toEqual('15.00');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.never);
            expect(aNInput.getFormatted()).toEqual('15');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.floats);
            expect(aNInput.getFormatted()).toEqual('15');

            aNInput.set(0);
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.always);
            expect(aNInput.getFormatted()).toEqual('0.00');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.never);
            expect(aNInput.getFormatted()).toEqual('0');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.floats);
            expect(aNInput.getFormatted()).toEqual('0');

            aNInput.set('');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.always);
            expect(aNInput.getFormatted()).toEqual('');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.never);
            expect(aNInput.getFormatted()).toEqual('');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.floats);
            expect(aNInput.getFormatted()).toEqual('');
        });

        it('should show / hide decimal places correctly on negative numbers without a currency sign', () => {
            spyOn(console, 'warn');
            aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().float);

            aNInput.set(-15.001);
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.always);
            expect(aNInput.getFormatted()).toEqual('-15.00');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.never);
            expect(aNInput.getFormatted()).toEqual('-15');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.floats);
            expect(aNInput.getFormatted()).toEqual('-15');

            aNInput.set(-15.20);
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.always);
            expect(aNInput.getFormatted()).toEqual('-15.20');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.never);
            expect(aNInput.getFormatted()).toEqual('-15.2');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.floats);
            expect(aNInput.getFormatted()).toEqual('-15.20');

            aNInput.set(-15);
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.always);
            expect(aNInput.getFormatted()).toEqual('-15.00');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.never);
            expect(aNInput.getFormatted()).toEqual('-15');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.floats);
            expect(aNInput.getFormatted()).toEqual('-15');
        });

        it('should show / hide decimal places correctly on positive numbers with a currency sign', () => {
            spyOn(console, 'warn');
            aNInput = new AutoNumeric(newInput).french();

            aNInput.set(15.001);
            expect(aNInput.getSettings().decimalPlacesRawValue).toEqual('2');
            expect(aNInput.rawValue).toEqual('15');
            expect(aNInput.getNumericString()).toEqual('15'); // Note: `getNumericString()` do not pad decimals
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.always);
            expect(aNInput.getFormatted()).toEqual('15,00\u202f€');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.never);
            expect(aNInput.getFormatted()).toEqual('15\u202f€');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.floats);
            expect(aNInput.getFormatted()).toEqual('15\u202f€');

            aNInput.set(15.20);
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.always);
            expect(aNInput.getFormatted()).toEqual('15,20\u202f€');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.never);
            expect(aNInput.getFormatted()).toEqual('15,2\u202f€');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.floats);
            expect(aNInput.getFormatted()).toEqual('15,20\u202f€');

            aNInput.set(15);
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.always);
            expect(aNInput.getFormatted()).toEqual('15,00\u202f€');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.never);
            expect(aNInput.getFormatted()).toEqual('15\u202f€');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.floats);
            expect(aNInput.getFormatted()).toEqual('15\u202f€');

            aNInput.set(0);
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.always);
            expect(aNInput.getFormatted()).toEqual('0,00\u202f€');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.never);
            expect(aNInput.getFormatted()).toEqual('0\u202f€');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.floats);
            expect(aNInput.getFormatted()).toEqual('0\u202f€');

            aNInput.set('');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.always);
            expect(aNInput.getFormatted()).toEqual('');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.never);
            expect(aNInput.getFormatted()).toEqual('');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.floats);
            expect(aNInput.getFormatted()).toEqual('');
        });

        it('should show / hide decimal places correctly on negative numbers with a currency sign', () => {
            spyOn(console, 'warn');
            aNInput = new AutoNumeric(newInput).french();

            aNInput.set(-15.001);
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.always);
            expect(aNInput.getFormatted()).toEqual('-15,00\u202f€');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.never);
            expect(aNInput.getFormatted()).toEqual('-15\u202f€');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.floats);
            expect(aNInput.getFormatted()).toEqual('-15\u202f€');

            aNInput.set(-15.20);
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.always);
            expect(aNInput.getFormatted()).toEqual('-15,20\u202f€');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.never);
            expect(aNInput.getFormatted()).toEqual('-15,2\u202f€');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.floats);
            expect(aNInput.getFormatted()).toEqual('-15,20\u202f€');

            aNInput.set(-15);
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.always);
            expect(aNInput.getFormatted()).toEqual('-15,00\u202f€');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.never);
            expect(aNInput.getFormatted()).toEqual('-15\u202f€');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.floats);
            expect(aNInput.getFormatted()).toEqual('-15\u202f€');
        });
    });

    describe('`emptyInputBehavior` option', () => {
        it('should fail the validation when `zero` is used in a range that does not contain this value (cf. issue #425)', () => {
            spyOn(console, 'warn');

            // Initialization
            const newInput = document.createElement('input');
            document.body.appendChild(newInput);

            // minimumValue side errors
            expect(() => new AutoNumeric(newInput, {
                emptyInputBehavior: AutoNumeric.options.emptyInputBehavior.zero,
                minimumValue: 1,
                maximumValue: 10,
            })).toThrow();

            // maximumValue side errors
            expect(() => new AutoNumeric(newInput, {
                emptyInputBehavior: AutoNumeric.options.emptyInputBehavior.zero,
                minimumValue: -10,
                maximumValue: -1,
            })).toThrow();

            // minimumValue side
            expect(() => new AutoNumeric(newInput, {
                emptyInputBehavior: AutoNumeric.options.emptyInputBehavior.zero,
                minimumValue: -1,
                maximumValue: 10,
            })).not.toThrow();

            expect(() => new AutoNumeric(newInput, {
                emptyInputBehavior: AutoNumeric.options.emptyInputBehavior.zero,
                minimumValue: 0,
                maximumValue: 10,
            })).not.toThrow();

            // maximumValue side
            expect(() => new AutoNumeric(newInput, {
                emptyInputBehavior: AutoNumeric.options.emptyInputBehavior.zero,
                minimumValue: -10,
                maximumValue: 1,
            })).not.toThrow();

            expect(() => new AutoNumeric(newInput, {
                emptyInputBehavior: AutoNumeric.options.emptyInputBehavior.zero,
                minimumValue: -10,
                maximumValue: 0,
            })).not.toThrow();

            // Special case
            expect(() => new AutoNumeric(newInput, {
                emptyInputBehavior: AutoNumeric.options.emptyInputBehavior.zero,
                minimumValue: 0,
                maximumValue: 0,
            })).not.toThrow();

            // Un-initialization
            document.body.removeChild(newInput);
        });

        it('should fail the validation when a number is used in a range that does not contain this value', () => {
            spyOn(console, 'warn');

            // Initialization
            const newInput = document.createElement('input');
            document.body.appendChild(newInput);

            // minimumValue side errors
            expect(() => new AutoNumeric(newInput, {
                emptyInputBehavior: -1,
                minimumValue: 1,
                maximumValue: 10,
            })).toThrow();

            expect(() => new AutoNumeric(newInput, {
                emptyInputBehavior: -1,
                minimumValue: 1,
                maximumValue: 10,
            })).toThrow();

            // maximumValue side errors
            expect(() => new AutoNumeric(newInput, {
                emptyInputBehavior: '-1',
                minimumValue: -10,
                maximumValue: -2,
            })).toThrow();

            // minimumValue side
            expect(() => new AutoNumeric(newInput, {
                emptyInputBehavior: -1,
                minimumValue: -2,
                maximumValue: 10,
            })).not.toThrow();

            expect(() => new AutoNumeric(newInput, {
                emptyInputBehavior: -1,
                minimumValue: -1,
                maximumValue: 10,
            })).not.toThrow();

            // maximumValue side
            expect(() => new AutoNumeric(newInput, {
                emptyInputBehavior: '-1',
                minimumValue: -10,
                maximumValue: 1,
            })).not.toThrow();

            expect(() => new AutoNumeric(newInput, {
                emptyInputBehavior: '-1',
                minimumValue: -10,
                maximumValue: -1,
            })).not.toThrow();

            // Special case
            expect(() => new AutoNumeric(newInput, {
                emptyInputBehavior: '-1',
                minimumValue: -1,
                maximumValue: -1,
            })).not.toThrow();

            // Un-initialization
            document.body.removeChild(newInput);
        });

        describe('used with the `null` value (cf. issue #447 and #446)', () => {
            let aNInput;
            let newInput;

            beforeEach(() => { // Initialization
                newInput = document.createElement('input');
                document.body.appendChild(newInput);
            });

            afterEach(() => { // Un-initialization
                aNInput.nuke();
            });

            it('should allow for `null` value if set to `\'null\'`', () => {
                aNInput = new AutoNumeric(newInput, { emptyInputBehavior: AutoNumeric.options.emptyInputBehavior.null });
                aNInput.set(null);
                expect(aNInput.getFormatted()).toEqual('');
                expect(aNInput.getNumber()).toEqual(null);
            });

            it('should not allow for `null` value if set to something different than `\'null\'`', () => {
                spyOn(console, 'warn');

                aNInput = new AutoNumeric(newInput, { emptyInputBehavior: AutoNumeric.options.emptyInputBehavior.focus });
                aNInput.set(null);
                expect(aNInput.getFormatted()).toEqual('');
                expect(aNInput.getNumber()).toEqual(0);
                expect(console.warn).toHaveBeenCalled();
                expect(console.warn).toHaveBeenCalledTimes(1);
            });

            it(`should modify the rawValue to \`''\` when switching from \`null\` to a different option value`, () => {
                spyOn(console, 'warn');

                aNInput = new AutoNumeric(newInput, { emptyInputBehavior: AutoNumeric.options.emptyInputBehavior.null });
                aNInput.set(null);
                expect(aNInput.getFormatted()).toEqual('');
                expect(aNInput.getNumber()).toEqual(null);

                // Modify the options while `rawValue` is `null`
                aNInput.options.emptyInputBehavior(AutoNumeric.options.emptyInputBehavior.always);
                expect(aNInput.getFormatted()).toEqual('');
                expect(aNInput.getNumber()).toEqual(0);
                expect(console.warn).toHaveBeenCalled();
                expect(console.warn).toHaveBeenCalledTimes(1);
            });

            it('should not allow initializing an AutoNumeric object with the `null` value, but will default to the `\'\'` value', () => {
                // This is not allowed since using `null` for the initial value means that AutoNumeric needs to use the current html value instead of `null`
                aNInput = new AutoNumeric(newInput, null, { emptyInputBehavior: AutoNumeric.options.emptyInputBehavior.null });
                expect(aNInput.getFormatted()).toEqual('');
                expect(aNInput.getNumber()).toEqual(0);

                // Verification when setting the rawValue after the initialization
                aNInput.set(null);
                expect(aNInput.getFormatted()).toEqual('');
                expect(aNInput.getNumber()).toEqual(null);
            });
        });
    });

    describe('`valuesToStrings` option', () => {
        let aNInput;
        let newInput;

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
        });

        afterEach(() => { // Un-initialization
            aNInput.nuke();
        });

        it('should display the given string when the rawValue is set to a specific value', () => {
            spyOn(console, 'warn');
            aNInput = new AutoNumeric(newInput, { valuesToStrings: AutoNumeric.options.valuesToStrings.zeroDash });
            aNInput.set(10);
            expect(aNInput.getFormatted()).toEqual('10.00');
            expect(aNInput.getNumber()).toEqual(10);

            aNInput.set(0);
            expect(aNInput.getFormatted()).toEqual('-');
            expect(aNInput.getNumber()).toEqual(0);

            aNInput.set(100);
            expect(aNInput.getFormatted()).toEqual('100.00');
            expect(aNInput.getNumber()).toEqual(100);

            // Update the settings for other values
            aNInput.update({
                minimumValue   : 100,
                maximumValue   : 400,
            });
            aNInput.options.valuesToStrings({
                0  : 'zero',
                100: 'Min',
                200: 'Ok',
                400: 'Max',
            });
            expect(aNInput.getFormatted()).toEqual('Min');
            expect(aNInput.getNumber()).toEqual(100);

            aNInput.set(101);
            expect(aNInput.getFormatted()).toEqual('101.00');
            expect(aNInput.getNumber()).toEqual(101);

            aNInput.set(200);
            expect(aNInput.getFormatted()).toEqual('Ok');
            expect(aNInput.getNumber()).toEqual(200);

            aNInput.set(201);
            expect(aNInput.getFormatted()).toEqual('201.00');
            expect(aNInput.getNumber()).toEqual(201);

            aNInput.set(400);
            expect(aNInput.getFormatted()).toEqual('Max');
            expect(aNInput.getNumber()).toEqual(400);
        });
    });

    describe('`styleRules` option', () => {
        let aNInput;
        let newInput;

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
        });

        afterEach(() => { // Un-initialization
            aNInput.nuke();
        });

        it('should add / remove the positive CSS class', () => {
            aNInput = new AutoNumeric(newInput, {
                styleRules: {
                    positive: 'autoNumeric-positive',
                    negative: null,
                },
            });

            aNInput.set(10);
            expect(aNInput.node().classList.contains('autoNumeric-positive')).toEqual(true);
            aNInput.set(-10);
            expect(aNInput.node().classList.contains('autoNumeric-positive')).toEqual(false);
            aNInput.set(-0.01);
            expect(aNInput.node().classList.contains('autoNumeric-positive')).toEqual(false);
            aNInput.set(0.01);
            expect(aNInput.node().classList.contains('autoNumeric-positive')).toEqual(true);
            aNInput.set(0);
            expect(aNInput.node().classList.contains('autoNumeric-positive')).toEqual(true);
        });

        it('should add / remove the negative CSS class', () => {
            aNInput = new AutoNumeric(newInput, {
                styleRules: {
                    positive: null,
                    negative: 'autoNumeric-negative',
                },
            });

            aNInput.set(10);
            expect(aNInput.node().classList.contains('autoNumeric-negative')).toEqual(false);
            aNInput.set(-10);
            expect(aNInput.node().classList.contains('autoNumeric-negative')).toEqual(true);
            aNInput.set(-0.01);
            expect(aNInput.node().classList.contains('autoNumeric-negative')).toEqual(true);
            aNInput.set(0.01);
            expect(aNInput.node().classList.contains('autoNumeric-negative')).toEqual(false);
            aNInput.set(0);
            expect(aNInput.node().classList.contains('autoNumeric-negative')).toEqual(false);
        });

        it('should add / remove CSS classes based on multiple ranges', () => {
            aNInput = new AutoNumeric(newInput, {
                styleRules: {
                    positive: null,
                    negative: null,
                    ranges     : [
                        { min: 0, max: 25, class: 'autoNumeric-red' },
                        { min: 25, max: 50, class: 'autoNumeric-orange' },
                        { min: 50, max: 75, class: 'autoNumeric-yellow' },
                        { min: 75, max: Number.MAX_SAFE_INTEGER, class: 'autoNumeric-green' },
                    ],
                },
            });

            aNInput.set(-10);
            expect(aNInput.node().classList.contains('autoNumeric-red')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-orange')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-yellow')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-green')).toEqual(false);
            aNInput.set(0);
            expect(aNInput.node().classList.contains('autoNumeric-red')).toEqual(true);
            expect(aNInput.node().classList.contains('autoNumeric-orange')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-yellow')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-green')).toEqual(false);
            aNInput.set(0.01);
            expect(aNInput.node().classList.contains('autoNumeric-red')).toEqual(true);
            expect(aNInput.node().classList.contains('autoNumeric-orange')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-yellow')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-green')).toEqual(false);
            aNInput.set(24.99);
            expect(aNInput.node().classList.contains('autoNumeric-red')).toEqual(true);
            expect(aNInput.node().classList.contains('autoNumeric-orange')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-yellow')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-green')).toEqual(false);
            aNInput.set(25);
            expect(aNInput.node().classList.contains('autoNumeric-red')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-orange')).toEqual(true);
            expect(aNInput.node().classList.contains('autoNumeric-yellow')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-green')).toEqual(false);
            aNInput.set(25.01);
            expect(aNInput.node().classList.contains('autoNumeric-red')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-orange')).toEqual(true);
            expect(aNInput.node().classList.contains('autoNumeric-yellow')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-green')).toEqual(false);
            aNInput.set(49.99);
            expect(aNInput.node().classList.contains('autoNumeric-red')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-orange')).toEqual(true);
            expect(aNInput.node().classList.contains('autoNumeric-yellow')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-green')).toEqual(false);
            aNInput.set(50);
            expect(aNInput.node().classList.contains('autoNumeric-red')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-orange')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-yellow')).toEqual(true);
            expect(aNInput.node().classList.contains('autoNumeric-green')).toEqual(false);
            aNInput.set(50.01);
            expect(aNInput.node().classList.contains('autoNumeric-red')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-orange')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-yellow')).toEqual(true);
            expect(aNInput.node().classList.contains('autoNumeric-green')).toEqual(false);
            aNInput.set(74.99);
            expect(aNInput.node().classList.contains('autoNumeric-red')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-orange')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-yellow')).toEqual(true);
            expect(aNInput.node().classList.contains('autoNumeric-green')).toEqual(false);
            aNInput.set(75);
            expect(aNInput.node().classList.contains('autoNumeric-red')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-orange')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-yellow')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-green')).toEqual(true);
            aNInput.set(75.01);
            expect(aNInput.node().classList.contains('autoNumeric-red')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-orange')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-yellow')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-green')).toEqual(true);
            aNInput.set(100);
            expect(aNInput.node().classList.contains('autoNumeric-red')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-orange')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-yellow')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-green')).toEqual(true);
        });

        it('should add / remove the CSS class based on user defined callbacks', () => {
            aNInput = new AutoNumeric(newInput, {
                styleRules: {
                    ranges  : null,
                    userDefined: [
                        // If 'classes' is a string, set it if `true`, remove it if `false`
                        { callback: rawValue => (8.25 < rawValue && rawValue <= 8.42), classes: 'between8AndDecimals' },

                        // If 'classes' is an array with only 2 elements, set the first class if `true`, the second if `false`
                        { callback: rawValue => rawValue % 2 === 0, classes: ['autoNumeric-even', 'autoNumeric-odd'] },

                        // Return a single array index to use
                        {
                            callback: rawValue => {
                                if (10 <= rawValue && rawValue < 12) {
                                    return 0;
                                }
                                if (24 <= rawValue && rawValue < 26) {
                                    return 1;
                                }
                                if (42 <= rawValue && rawValue < 69) {
                                    return 2;
                                }

                                return null;  // In case the rawValue is outside those ranges
                            },
                            classes: ['one1', 'one2', 'one3'],
                        },

                        // Return an array of array indexes to use
                        {
                            callback: rawValue => {
                                if (90 <= rawValue && rawValue < 100) {
                                    return [0, 1];
                                }
                                if (rawValue >= 120) {
                                    return [1, 2];
                                }

                                return null; // In case the rawValue is not valid
                            },
                            classes: ['multiple1', 'multiple2', 'multiple3'],
                        },

                        // If 'classes' is `undefined` or `null`, then the callback is called with the AutoNumeric object as a parameter
                        {
                            callback: anElement => {
                                if (anElement.getNumber() === 666) {
                                    if (anElement.getFormatted() !== '666.00') {
                                        AutoNumericHelper.throwError('Whoops, the formatted value has not been updated correctly!');
                                    }

                                    // Make sure that `set()` called within a callback is correctly taken into account.
                                    // The `set()` method organisation make sure that all changes are already made when `_setRawValue` is called and the raw value or element value are not changed afterward
                                    // This allows the user to modify the AutoNumeric object within this callback, without having to first wait for the `set()` method to finish
                                    anElement.set(667);
                                    if (anElement.getFormatted() !== '667.00') {
                                        AutoNumericHelper.throwError('Whoops, the formatted value has not been updated correctly!');
                                    }

                                    if (anElement.getNumber() !== 667) {
                                        AutoNumericHelper.throwError('Whoops, the raw value has not been updated correctly!');
                                    }
                                }
                            },
                        },
                    ],
                },
            });

            // If 'classes' is a string, set it if `true`, remove it if `false`
            aNInput.set(8.249);
            expect(aNInput.node().classList.contains('between8AndDecimals')).toEqual(false);
            aNInput.set(8.25);
            expect(aNInput.node().classList.contains('between8AndDecimals')).toEqual(false);
            aNInput.set(8.26);
            expect(aNInput.node().classList.contains('between8AndDecimals')).toEqual(true);
            aNInput.set(8.42);
            expect(aNInput.node().classList.contains('between8AndDecimals')).toEqual(true);
            aNInput.set(8.424);
            expect(aNInput.node().classList.contains('between8AndDecimals')).toEqual(true); // Rounding happens!
            aNInput.set(8.43);
            expect(aNInput.node().classList.contains('between8AndDecimals')).toEqual(false);

            // If 'classes' is an array with only 2 elements, set the first class if `true`, the second if `false`
            aNInput.set(1);
            expect(aNInput.node().classList.contains('autoNumeric-even')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-odd')).toEqual(true);
            aNInput.set(2);
            expect(aNInput.node().classList.contains('autoNumeric-even')).toEqual(true);
            expect(aNInput.node().classList.contains('autoNumeric-odd')).toEqual(false);
            aNInput.set(3);
            expect(aNInput.node().classList.contains('autoNumeric-even')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-odd')).toEqual(true);
            aNInput.set(4);
            expect(aNInput.node().classList.contains('autoNumeric-even')).toEqual(true);
            expect(aNInput.node().classList.contains('autoNumeric-odd')).toEqual(false);

            // return a single array index to use
            aNInput.set(9);
            expect(aNInput.node().classList.contains('one1')).toEqual(false);
            expect(aNInput.node().classList.contains('one2')).toEqual(false);
            expect(aNInput.node().classList.contains('one3')).toEqual(false);
            aNInput.set(10);
            expect(aNInput.node().classList.contains('one1')).toEqual(true);
            expect(aNInput.node().classList.contains('one2')).toEqual(false);
            expect(aNInput.node().classList.contains('one3')).toEqual(false);
            aNInput.set(11);
            expect(aNInput.node().classList.contains('one1')).toEqual(true);
            expect(aNInput.node().classList.contains('one2')).toEqual(false);
            expect(aNInput.node().classList.contains('one3')).toEqual(false);
            aNInput.set(12);
            expect(aNInput.node().classList.contains('one1')).toEqual(false);
            expect(aNInput.node().classList.contains('one2')).toEqual(false);
            expect(aNInput.node().classList.contains('one3')).toEqual(false);
            aNInput.set(23.99);
            expect(aNInput.node().classList.contains('one1')).toEqual(false);
            expect(aNInput.node().classList.contains('one2')).toEqual(false);
            expect(aNInput.node().classList.contains('one3')).toEqual(false);
            aNInput.set(24);
            expect(aNInput.node().classList.contains('one1')).toEqual(false);
            expect(aNInput.node().classList.contains('one2')).toEqual(true);
            expect(aNInput.node().classList.contains('one3')).toEqual(false);
            aNInput.set(25);
            expect(aNInput.node().classList.contains('one1')).toEqual(false);
            expect(aNInput.node().classList.contains('one2')).toEqual(true);
            expect(aNInput.node().classList.contains('one3')).toEqual(false);
            aNInput.set(25.99);
            expect(aNInput.node().classList.contains('one1')).toEqual(false);
            expect(aNInput.node().classList.contains('one2')).toEqual(true);
            expect(aNInput.node().classList.contains('one3')).toEqual(false);
            aNInput.set(26);
            expect(aNInput.node().classList.contains('one1')).toEqual(false);
            expect(aNInput.node().classList.contains('one2')).toEqual(false);
            expect(aNInput.node().classList.contains('one3')).toEqual(false);
            aNInput.set(41.99);
            expect(aNInput.node().classList.contains('one1')).toEqual(false);
            expect(aNInput.node().classList.contains('one2')).toEqual(false);
            expect(aNInput.node().classList.contains('one3')).toEqual(false);
            aNInput.set(42);
            expect(aNInput.node().classList.contains('one1')).toEqual(false);
            expect(aNInput.node().classList.contains('one2')).toEqual(false);
            expect(aNInput.node().classList.contains('one3')).toEqual(true);
            aNInput.set(68);
            expect(aNInput.node().classList.contains('one1')).toEqual(false);
            expect(aNInput.node().classList.contains('one2')).toEqual(false);
            expect(aNInput.node().classList.contains('one3')).toEqual(true);
            aNInput.set(69);
            expect(aNInput.node().classList.contains('one1')).toEqual(false);
            expect(aNInput.node().classList.contains('one2')).toEqual(false);
            expect(aNInput.node().classList.contains('one3')).toEqual(false);

            // return an array of array indexes to use
            aNInput.set(89);
            expect(aNInput.node().classList.contains('multiple1')).toEqual(false);
            expect(aNInput.node().classList.contains('multiple2')).toEqual(false);
            expect(aNInput.node().classList.contains('multiple3')).toEqual(false);
            aNInput.set(90);
            expect(aNInput.node().classList.contains('multiple1')).toEqual(true);
            expect(aNInput.node().classList.contains('multiple2')).toEqual(true);
            expect(aNInput.node().classList.contains('multiple3')).toEqual(false);
            aNInput.set(99.99);
            expect(aNInput.node().classList.contains('multiple1')).toEqual(true);
            expect(aNInput.node().classList.contains('multiple2')).toEqual(true);
            expect(aNInput.node().classList.contains('multiple3')).toEqual(false);
            aNInput.set(100);
            expect(aNInput.node().classList.contains('multiple1')).toEqual(false);
            expect(aNInput.node().classList.contains('multiple2')).toEqual(false);
            expect(aNInput.node().classList.contains('multiple3')).toEqual(false);
            aNInput.set(119.99);
            expect(aNInput.node().classList.contains('multiple1')).toEqual(false);
            expect(aNInput.node().classList.contains('multiple2')).toEqual(false);
            expect(aNInput.node().classList.contains('multiple3')).toEqual(false);
            aNInput.set(120);
            expect(aNInput.node().classList.contains('multiple1')).toEqual(false);
            expect(aNInput.node().classList.contains('multiple2')).toEqual(true);
            expect(aNInput.node().classList.contains('multiple3')).toEqual(true);
            aNInput.set(2000);
            expect(aNInput.node().classList.contains('multiple1')).toEqual(false);
            expect(aNInput.node().classList.contains('multiple2')).toEqual(true);
            expect(aNInput.node().classList.contains('multiple3')).toEqual(true);

            // If 'classes' is `undefined` or `null`, then the callback is called with the AutoNumeric object as a parameter
            expect(() => aNInput.set(666)).not.toThrow();
            expect(aNInput.getFormatted()).toEqual('667.00'); // This is normal, the value has been changed within the callback
        });

        it('should add / remove the CSS class based on the userDefined `range0To100With4Steps` callback', () => {
            aNInput = new AutoNumeric(newInput, { styleRules: AutoNumeric.options.styleRules.range0To100With4Steps });

            aNInput.set(-1);
            expect(aNInput.node().classList.contains('autoNumeric-red')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-orange')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-yellow')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-green')).toEqual(false);
            aNInput.set(0);
            expect(aNInput.node().classList.contains('autoNumeric-red')).toEqual(true);
            expect(aNInput.node().classList.contains('autoNumeric-orange')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-yellow')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-green')).toEqual(false);
            aNInput.set(24);
            expect(aNInput.node().classList.contains('autoNumeric-red')).toEqual(true);
            expect(aNInput.node().classList.contains('autoNumeric-orange')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-yellow')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-green')).toEqual(false);
            aNInput.set(25);
            expect(aNInput.node().classList.contains('autoNumeric-red')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-orange')).toEqual(true);
            expect(aNInput.node().classList.contains('autoNumeric-yellow')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-green')).toEqual(false);
            aNInput.set(49);
            expect(aNInput.node().classList.contains('autoNumeric-red')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-orange')).toEqual(true);
            expect(aNInput.node().classList.contains('autoNumeric-yellow')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-green')).toEqual(false);
            aNInput.set(50);
            expect(aNInput.node().classList.contains('autoNumeric-red')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-orange')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-yellow')).toEqual(true);
            expect(aNInput.node().classList.contains('autoNumeric-green')).toEqual(false);
            aNInput.set(74);
            expect(aNInput.node().classList.contains('autoNumeric-red')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-orange')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-yellow')).toEqual(true);
            expect(aNInput.node().classList.contains('autoNumeric-green')).toEqual(false);
            aNInput.set(75);
            expect(aNInput.node().classList.contains('autoNumeric-red')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-orange')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-yellow')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-green')).toEqual(true);
            aNInput.set(99);
            expect(aNInput.node().classList.contains('autoNumeric-red')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-orange')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-yellow')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-green')).toEqual(true);
            aNInput.set(100);
            expect(aNInput.node().classList.contains('autoNumeric-red')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-orange')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-yellow')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-green')).toEqual(false);
        });

        it('should add / remove the CSS class based on the userDefined `positiveNegative` callback', () => {
            aNInput = new AutoNumeric(newInput, { styleRules: AutoNumeric.options.styleRules.positiveNegative });

            aNInput.set(-1);
            expect(aNInput.node().classList.contains('autoNumeric-positive')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-negative')).toEqual(true);
            aNInput.set(0);
            expect(aNInput.node().classList.contains('autoNumeric-positive')).toEqual(true);
            expect(aNInput.node().classList.contains('autoNumeric-negative')).toEqual(false);
            aNInput.set(1);
            expect(aNInput.node().classList.contains('autoNumeric-positive')).toEqual(true);
            expect(aNInput.node().classList.contains('autoNumeric-negative')).toEqual(false);
        });

        it('should add / remove the CSS class based on the userDefined `evenOdd` callback', () => {
            aNInput = new AutoNumeric(newInput, { styleRules: AutoNumeric.options.styleRules.evenOdd });

            aNInput.set(1);
            expect(aNInput.node().classList.contains('autoNumeric-even')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-odd')).toEqual(true);
            aNInput.set(2);
            expect(aNInput.node().classList.contains('autoNumeric-even')).toEqual(true);
            expect(aNInput.node().classList.contains('autoNumeric-odd')).toEqual(false);
        });

        it('should add / remove the CSS class based on the userDefined `rangeSmallAndZero` callback', () => {
            aNInput = new AutoNumeric(newInput, { styleRules: AutoNumeric.options.styleRules.rangeSmallAndZero });

            aNInput.set(-2);
            expect(aNInput.node().classList.contains('autoNumeric-small-negative')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-zero'          )).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-small-positive')).toEqual(false);
            aNInput.set(-1);
            expect(aNInput.node().classList.contains('autoNumeric-small-negative')).toEqual(true);
            expect(aNInput.node().classList.contains('autoNumeric-zero'          )).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-small-positive')).toEqual(false);
            aNInput.set(-0.01);
            expect(aNInput.node().classList.contains('autoNumeric-small-negative')).toEqual(true);
            expect(aNInput.node().classList.contains('autoNumeric-zero'          )).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-small-positive')).toEqual(false);
            aNInput.set(0);
            expect(aNInput.node().classList.contains('autoNumeric-small-negative')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-zero'          )).toEqual(true);
            expect(aNInput.node().classList.contains('autoNumeric-small-positive')).toEqual(false);
            aNInput.set(0.01);
            expect(aNInput.node().classList.contains('autoNumeric-small-negative')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-zero'          )).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-small-positive')).toEqual(true);
            aNInput.set(1);
            expect(aNInput.node().classList.contains('autoNumeric-small-negative')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-zero'          )).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-small-positive')).toEqual(true);
            aNInput.set(2);
            expect(aNInput.node().classList.contains('autoNumeric-small-negative')).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-zero'          )).toEqual(false);
            expect(aNInput.node().classList.contains('autoNumeric-small-positive')).toEqual(false);
        });
    });

    describe('`createLocalList` option', () => {
        let aNInput;
        let newInput;

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
        });

        afterEach(() => { // Un-initialization
            aNInput.remove();
            document.body.removeChild(newInput);
        });

        it('should allow or disallow the creation of a local list', () => {
            aNInput = new AutoNumeric(newInput, { createLocalList: false });
            expect(aNInput._getLocalList()).toBeUndefined();

            aNInput.remove();
            aNInput = new AutoNumeric(newInput, { createLocalList: true });
            expect(aNInput._getLocalList() instanceof Map).toEqual(true);
        });

        it('should update the creation or destruction of the local list', () => {
            aNInput = new AutoNumeric(newInput, { createLocalList: false });
            expect(aNInput._getLocalList()).toBeUndefined();
            aNInput.options.createLocalList(true);
            expect(aNInput._getLocalList() instanceof Map).toEqual(true);
            aNInput.options.createLocalList(false);
            expect(aNInput._getLocalList()).toBeUndefined();
        });
    });

    describe('`negativeBracketsTypeOnBlur` option', () => {
        let aNInput;
        let newInput;

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
        });

        afterEach(() => { // Un-initialization
            aNInput.nuke();
        });

        it('should show brackets on negative numbers', () => {
            aNInput = new AutoNumeric(newInput, { negativeBracketsTypeOnBlur: AutoNumeric.options.negativeBracketsTypeOnBlur.angleBrackets });
            aNInput.french();
            aNInput.set(2500.01);
            expect(aNInput.getFormatted()).toEqual('2.500,01\u202f€');
            aNInput.set(-2500.01);
            expect(aNInput.getFormatted()).toEqual('〈2.500,01\u202f€〉');

            // Update the option
            aNInput.options.negativeBracketsTypeOnBlur(AutoNumeric.options.negativeBracketsTypeOnBlur.parentheses);
            expect(aNInput.getFormatted()).toEqual('(2.500,01\u202f€)');
            aNInput.options.negativeBracketsTypeOnBlur(AutoNumeric.options.negativeBracketsTypeOnBlur.brackets);
            expect(aNInput.getFormatted()).toEqual('[2.500,01\u202f€]');
            aNInput.options.negativeBracketsTypeOnBlur(AutoNumeric.options.negativeBracketsTypeOnBlur.chevrons);
            expect(aNInput.getFormatted()).toEqual('<2.500,01\u202f€>');
            aNInput.options.negativeBracketsTypeOnBlur(AutoNumeric.options.negativeBracketsTypeOnBlur.curlyBraces);
            expect(aNInput.getFormatted()).toEqual('{2.500,01\u202f€}');
            aNInput.options.negativeBracketsTypeOnBlur(AutoNumeric.options.negativeBracketsTypeOnBlur.japaneseQuotationMarks);
            expect(aNInput.getFormatted()).toEqual('｢2.500,01\u202f€｣');
            aNInput.options.negativeBracketsTypeOnBlur(AutoNumeric.options.negativeBracketsTypeOnBlur.halfBrackets);
            expect(aNInput.getFormatted()).toEqual('⸤2.500,01\u202f€⸥');
            aNInput.options.negativeBracketsTypeOnBlur(AutoNumeric.options.negativeBracketsTypeOnBlur.whiteSquareBrackets);
            expect(aNInput.getFormatted()).toEqual('⟦2.500,01\u202f€⟧');
            aNInput.options.negativeBracketsTypeOnBlur(AutoNumeric.options.negativeBracketsTypeOnBlur.quotationMarks);
            expect(aNInput.getFormatted()).toEqual('‹2.500,01\u202f€›');
            aNInput.options.negativeBracketsTypeOnBlur(AutoNumeric.options.negativeBracketsTypeOnBlur.guillemets);
            expect(aNInput.getFormatted()).toEqual('«2.500,01\u202f€»');

            aNInput.set(1234.70);
            expect(aNInput.getFormatted()).toEqual('1.234,70\u202f€');
        });
    });

    describe('`negativeSignCharacter` option', () => {
        let aNInput;
        let newInput;

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
        });

        afterEach(() => { // Un-initialization
            aNInput.nuke();
        });

        it('should show the custom negative sign, on the prefix position', () => {
            aNInput = new AutoNumeric(newInput).french({ negativeSignCharacter: AutoNumeric.options.negativeSignCharacter.not });
            aNInput.set(2500.01);
            expect(aNInput.getFormatted()).toEqual('2.500,01\u202f€');
            aNInput.set(-2500.01);
            expect(aNInput.getFormatted()).toEqual('¬2.500,01\u202f€');

            // Update the option
            aNInput.options.negativeSignCharacter(AutoNumeric.options.negativeSignCharacter.hyphen);
            expect(aNInput.getFormatted()).toEqual('-2.500,01\u202f€');
            aNInput.options.negativeSignCharacter(AutoNumeric.options.negativeSignCharacter.minus);
            expect(aNInput.getFormatted()).toEqual('−2.500,01\u202f€');
            aNInput.options.negativeSignCharacter(AutoNumeric.options.negativeSignCharacter.heavyMinus);
            expect(aNInput.getFormatted()).toEqual('➖2.500,01\u202f€');
            aNInput.options.negativeSignCharacter(AutoNumeric.options.negativeSignCharacter.fullWidthHyphen);
            expect(aNInput.getFormatted()).toEqual('－2.500,01\u202f€');
            aNInput.options.negativeSignCharacter(AutoNumeric.options.negativeSignCharacter.circledMinus);
            expect(aNInput.getFormatted()).toEqual('⊖2.500,01\u202f€');
            aNInput.options.negativeSignCharacter(AutoNumeric.options.negativeSignCharacter.squaredMinus);
            expect(aNInput.getFormatted()).toEqual('⊟2.500,01\u202f€');
            aNInput.options.negativeSignCharacter(AutoNumeric.options.negativeSignCharacter.triangleMinus);
            expect(aNInput.getFormatted()).toEqual('⨺2.500,01\u202f€');
            aNInput.options.negativeSignCharacter(AutoNumeric.options.negativeSignCharacter.plusMinus);
            expect(aNInput.getFormatted()).toEqual('±2.500,01\u202f€');
            aNInput.options.negativeSignCharacter(AutoNumeric.options.negativeSignCharacter.minusPlus);
            expect(aNInput.getFormatted()).toEqual('∓2.500,01\u202f€');
            aNInput.options.negativeSignCharacter(AutoNumeric.options.negativeSignCharacter.dotMinus);
            expect(aNInput.getFormatted()).toEqual('∸2.500,01\u202f€');
            aNInput.options.negativeSignCharacter(AutoNumeric.options.negativeSignCharacter.minusTilde);
            expect(aNInput.getFormatted()).toEqual('≂2.500,01\u202f€');

            aNInput.set(1234.70);
            expect(aNInput.getFormatted()).toEqual('1.234,70\u202f€');
        });
    });

    describe('`positiveSignCharacter` option', () => {
        let aNInput;
        let newInput;

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
        });

        afterEach(() => { // Un-initialization
            aNInput.nuke();
        });

        it('should show brackets on negative numbers', () => {
            aNInput = new AutoNumeric(newInput).french();
            aNInput.set(2500.01);
            expect(aNInput.getFormatted()).toEqual('2.500,01\u202f€');
            aNInput.update({ showPositiveSign: AutoNumeric.options.showPositiveSign.show });
            expect(aNInput.getFormatted()).toEqual('+2.500,01\u202f€');

            // Update the option
            aNInput.options.positiveSignCharacter(AutoNumeric.options.positiveSignCharacter.plus);
            expect(aNInput.getFormatted()).toEqual('+2.500,01\u202f€');
            aNInput.options.positiveSignCharacter(AutoNumeric.options.positiveSignCharacter.fullWidthPlus);
            expect(aNInput.getFormatted()).toEqual('＋2.500,01\u202f€');
            aNInput.options.positiveSignCharacter(AutoNumeric.options.positiveSignCharacter.heavyPlus);
            expect(aNInput.getFormatted()).toEqual('➕2.500,01\u202f€');
            aNInput.options.positiveSignCharacter(AutoNumeric.options.positiveSignCharacter.doublePlus);
            expect(aNInput.getFormatted()).toEqual('⧺2.500,01\u202f€');
            aNInput.options.positiveSignCharacter(AutoNumeric.options.positiveSignCharacter.triplePlus);
            expect(aNInput.getFormatted()).toEqual('⧻2.500,01\u202f€');
            aNInput.options.positiveSignCharacter(AutoNumeric.options.positiveSignCharacter.circledPlus);
            expect(aNInput.getFormatted()).toEqual('⊕2.500,01\u202f€');
            aNInput.options.positiveSignCharacter(AutoNumeric.options.positiveSignCharacter.squaredPlus);
            expect(aNInput.getFormatted()).toEqual('⊞2.500,01\u202f€');
            aNInput.options.positiveSignCharacter(AutoNumeric.options.positiveSignCharacter.trianglePlus);
            expect(aNInput.getFormatted()).toEqual('⨹2.500,01\u202f€');
            aNInput.options.positiveSignCharacter(AutoNumeric.options.positiveSignCharacter.plusMinus);
            expect(aNInput.getFormatted()).toEqual('±2.500,01\u202f€');
            aNInput.options.positiveSignCharacter(AutoNumeric.options.positiveSignCharacter.minusPlus);
            expect(aNInput.getFormatted()).toEqual('∓2.500,01\u202f€');
            aNInput.options.positiveSignCharacter(AutoNumeric.options.positiveSignCharacter.dotPlus);
            expect(aNInput.getFormatted()).toEqual('∔2.500,01\u202f€');
            aNInput.options.positiveSignCharacter(AutoNumeric.options.positiveSignCharacter.altHebrewPlus);
            expect(aNInput.getFormatted()).toEqual('﬩2.500,01\u202f€');
            aNInput.options.positiveSignCharacter(AutoNumeric.options.positiveSignCharacter.normalSpace);
            expect(aNInput.getFormatted()).toEqual(' 2.500,01\u202f€');
            aNInput.options.positiveSignCharacter(AutoNumeric.options.positiveSignCharacter.thinSpace);
            expect(aNInput.getFormatted()).toEqual('\u20092.500,01\u202f€');
            aNInput.options.positiveSignCharacter(AutoNumeric.options.positiveSignCharacter.narrowNoBreakSpace);
            expect(aNInput.getFormatted()).toEqual('\u202f2.500,01\u202f€');
            aNInput.options.positiveSignCharacter(AutoNumeric.options.positiveSignCharacter.noBreakSpace);
            expect(aNInput.getFormatted()).toEqual('\u00a02.500,01\u202f€');

            aNInput.set(1234.70);
            expect(aNInput.getFormatted()).toEqual('\u00a01.234,70\u202f€');
        });
    });

    describe('`digitalGroupSpacing` option', () => {
        let aNInput;
        let newInput;

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
        });

        afterEach(() => { // Un-initialization
            aNInput.nuke();
        });

        it('should group the numbers with the allowed grouping choices', () => {
            aNInput = new AutoNumeric(newInput, { digitalGroupSpacing: 2, maximumValue : '999999999999999' });
            aNInput.set(12345678901234.5678);
            expect(aNInput.getFormatted()).toEqual('1,23,45,67,89,01,234.57');
            aNInput.update({ digitalGroupSpacing: '2s' });
            expect(aNInput.getFormatted()).toEqual('12,34,567,89,01,234.57');

            // Update the option
            aNInput.options.digitalGroupSpacing(AutoNumeric.options.digitalGroupSpacing.two);
            expect(aNInput.getFormatted()).toEqual('1,23,45,67,89,01,234.57');
            aNInput.options.digitalGroupSpacing(AutoNumeric.options.digitalGroupSpacing.three);
            expect(aNInput.getFormatted()).toEqual('12,345,678,901,234.57');
            aNInput.options.digitalGroupSpacing(AutoNumeric.options.digitalGroupSpacing.four);
            expect(aNInput.getFormatted()).toEqual('12,3456,7890,1234.57');

            aNInput.options.digitalGroupSpacing(2);
            expect(aNInput.getFormatted()).toEqual('1,23,45,67,89,01,234.57');
            aNInput.options.digitalGroupSpacing(3);
            expect(aNInput.getFormatted()).toEqual('12,345,678,901,234.57');
            aNInput.options.digitalGroupSpacing(4);
            expect(aNInput.getFormatted()).toEqual('12,3456,7890,1234.57');

            expect(() => aNInput.options.digitalGroupSpacing(5)).toThrow();
            expect(() => aNInput.options.digitalGroupSpacing(1)).toThrow();
            expect(() => aNInput.options.digitalGroupSpacing(10)).toThrow();
        });
    });

    /*
    describe('`unformatOnSubmit` option', () => {
        //XXX This test cannot be activated since reloading the page in Jasmine test is not allowed
        it('should unformat on submit', () => {
            // Create the form elements
            const newInput = document.createElement('input');
            const formElement = document.createElement('form');
            const submitButton = document.createElement('input');
            submitButton.type = 'submit';
            document.body.appendChild(formElement);
            formElement.appendChild(newInput);
            formElement.appendChild(submitButton);

            // Init the AutoNumeric element
            const aNInput = new AutoNumeric(newInput, { unformatOnSubmit: AutoNumeric.options.unformatOnSubmit.unformat }).french();
            aNInput.set(12345.67);
            expect(aNInput.getFormatted()).toEqual('12.345,67\u202f€');

            // Testing the submit event
            formElement.onsubmit = function(e) {
                console.log('form submitted!');
                e.preventDefault();
            };

            // Submit and test the unformatted value
            formElement.submit(); //XXX In most browsers, the 'submit' event is only sent when the submit button is *clicked*, so this does not work, yet
            expect(aNInput.getFormatted()).toEqual('12345.67');

            // Remove the elements
            aNInput.nuke();
            formElement.removeChild(submitButton);
            document.body.removeChild(formElement);
        });
    });
    */

    //TODO Complete the tests in order to test every single option separately:
    /*
     caretPositionOnFocus
     decimalCharacterAlternative -> cf. end-to-end tests
     decimalPlacesShownOnFocus
     defaultValueOverride
     failOnUnknownOption
     formulaMode
     historySize
     invalidClass
     isCancellable
     modifyValueOnWheel
     noEventListeners
     showOnlyNumbersOnFocus
     onInvalidPaste
     overrideMinMaxLimits
     readOnly
     saveValueToSessionStorage
     selectNumberOnly
     selectOnFocus
     serializeSpaces
     showWarnings
     unformatOnHover
     watchExternalChanges
     wheelOn
     wheelStep
     */
});

describe('Initialization calls', () => {
    describe(`Initialize a single AutoNumeric object`, () => {
        let aNInput;
        let newInput;

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
        });

        afterEach(() => { // Un-initialization
            aNInput.remove();
            document.body.removeChild(newInput);
        });

        it('should init the element with the correct settings (Euro)', () => {
            newInput.value = '6789,02';
            aNInput = new AutoNumeric(newInput, autoNumericOptionsEuro);
            expect(aNInput.getNumericString()).toEqual('6789.02');
            expect(aNInput.getFormatted()).toEqual('6.789,02 €');

            aNInput.update(autoNumericOptionsEuro);
            expect(aNInput.getFormatted()).toEqual('6.789,02 €');
        });

        it('should init the element with the correct settings (Dollar)', () => {
            newInput.value = '6789.02';
            aNInput = new AutoNumeric(newInput, autoNumericOptionsDollar);
            expect(aNInput.getNumericString()).toEqual('6789.02');
            expect(aNInput.getFormatted()).toEqual('$6,789.02');

            aNInput.update(autoNumericOptionsDollar);
            expect(aNInput.getFormatted()).toEqual('$6,789.02');
        });

        it('should init the element with the correct settings (no methods, Euro)', () => {
            newInput.value = '256789,02';
            aNInput = new AutoNumeric(newInput, autoNumericOptionsEuro);
            expect(aNInput.getNumericString()).toEqual('256789.02');
            expect(aNInput.getFormatted()).toEqual('256.789,02 €');

            aNInput.update(autoNumericOptionsEuro);
            expect(aNInput.getFormatted()).toEqual('256.789,02 €');
        });

        it('should init the element with the correct settings (no methods, Dollar)', () => {
            newInput.value = '256789.02';
            aNInput = new AutoNumeric(newInput, autoNumericOptionsDollar);
            expect(aNInput.getNumericString()).toEqual('256789.02');
            expect(aNInput.getFormatted()).toEqual('$256,789.02');

            aNInput.update(autoNumericOptionsDollar);
            expect(aNInput.getFormatted()).toEqual('$256,789.02');
        });

        it('should init and update the <input> element with the readOnly option', () => {
            aNInput = new AutoNumeric(newInput, 12345.67, {
                readOnly               : true,
                currencySymbol         : ' Rp',
                currencySymbolPlacement: 's',
            });
            expect(aNInput.getNumericString()).toEqual('12345.67');
            expect(aNInput.getFormatted()).toEqual('12,345.67 Rp');

            expect(aNInput.node().hasAttribute('readonly')).toEqual(true);
            aNInput.update({ readOnly : false });
            expect(aNInput.node().hasAttribute('readonly')).toEqual(false);
            aNInput.update({ readOnly : true });
            expect(aNInput.node().hasAttribute('readonly')).toEqual(true);

            aNInput.options.readOnly(false);
            expect(aNInput.node().hasAttribute('readonly')).toEqual(false);
            aNInput.options.readOnly(true);
            expect(aNInput.node().hasAttribute('readonly')).toEqual(true);
        });

        it('should init and update the non-<input> element with the readOnly option', () => {
            // Element initialization
            const newDiv = document.createElement('div');
            newDiv.setAttribute('contenteditable', true);
            expect(newDiv.getAttribute('contenteditable')).toEqual('true');
            document.body.appendChild(newDiv);

            // The test
            const aNDiv = new AutoNumeric(newDiv, 12345.67, {
                readOnly               : true,
                currencySymbol         : ' Rp',
                currencySymbolPlacement: 's',
            });
            expect(aNDiv.getNumericString()).toEqual('12345.67');
            expect(aNDiv.getFormatted()).toEqual('12,345.67 Rp');

            expect(aNDiv.node().getAttribute('contenteditable')).toEqual('false');
            aNDiv.update({ readOnly : false });
            expect(aNDiv.node().getAttribute('contenteditable')).toEqual('true');
            aNDiv.update({ readOnly : true });
            expect(aNDiv.node().getAttribute('contenteditable')).toEqual('false');

            aNDiv.options.readOnly(false);
            expect(aNDiv.node().getAttribute('contenteditable')).toEqual('true');
            aNDiv.options.readOnly(true);
            expect(aNDiv.node().getAttribute('contenteditable')).toEqual('false');

            // Destroy the elements
            aNDiv.remove();
            document.body.removeChild(newDiv);
        });

        it('should init and update the element with the correct predefined settings', () => {
            newInput.value = '1256789.02';
            aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().dotDecimalCharCommaSeparator);
            expect(aNInput.getNumericString()).toEqual('1256789.02');
            expect(aNInput.getFormatted()).toEqual('1,256,789.02');

            aNInput.update(AutoNumeric.getPredefinedOptions().commaDecimalCharDotSeparator);
            expect(aNInput.getFormatted()).toEqual('1.256.789,02');

            aNInput.update(AutoNumeric.getPredefinedOptions().euro);
            expect(aNInput.getFormatted()).toEqual('1.256.789,02\u202f€');

            aNInput.update(AutoNumeric.getPredefinedOptions().euroSpace);
            expect(aNInput.getFormatted()).toEqual('1 256 789,02\u202f€');

            aNInput.update(AutoNumeric.getPredefinedOptions().dollar);
            expect(aNInput.getFormatted()).toEqual('$1,256,789.02');
        });

        it('should modify differently the `rawValue` and the formatted value when the `rawValueDivisor` option is set', () => {
            aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().percentageEU2dec);

            // Programmatically modifying the raw value result in a multiplied formatted value (when using `rawValueDivisor`)
            aNInput.set(0.012345);
            expect(aNInput.getSettings().decimalPlacesRawValue).toEqual(4);
            expect(aNInput.getNumericString()).toEqual('0.0123');
            expect(aNInput.getFormatted()).toEqual('1,23\u202f%');

            aNInput.set(0.012);
            expect(aNInput.getSettings().decimalPlacesRawValue).toEqual(4);
            expect(aNInput.getNumericString()).toEqual('0.012');
            expect(aNInput.getFormatted()).toEqual('1,20\u202f%');

            aNInput.set(0.01);
            expect(aNInput.getNumericString()).toEqual('0.01');
            expect(aNInput.getFormatted()).toEqual('1,00\u202f%');

            aNInput.set(0.0);
            expect(aNInput.getNumericString()).toEqual('0');
            expect(aNInput.getFormatted()).toEqual('0,00\u202f%');

            // Updating the settings should keep the right amount of rawValue decimal places
            expect(aNInput.getSettings().decimalPlacesRawValue).toEqual(4);
            aNInput.options.emptyInputBehavior(AutoNumeric.options.emptyInputBehavior.null);
            expect(aNInput.getSettings().decimalPlacesRawValue).toEqual('4');
            aNInput.set(null);
            expect(aNInput.getNumericString()).toEqual(null);
            expect(aNInput.getFormatted()).toEqual('');
            aNInput.set(0); // Prevent the warning message on the next line when trying to change `emptyInputBehavior` to 'focus' while the rawValue is `null`
            aNInput.options.emptyInputBehavior(AutoNumeric.options.emptyInputBehavior.focus);
            expect(aNInput.getSettings().decimalPlacesRawValue).toEqual('4');

            aNInput.set('14,68\u202f%'); // Here every suffix text/currency sign are removed, whatever they are, and only the bare value is kept
            expect(aNInput.getNumericString()).toEqual('14.68');
            expect(aNInput.getFormatted()).toEqual('1.468,00\u202f%');

            aNInput.set(2.341376);
            expect(aNInput.getNumericString()).toEqual('2.3414');
            expect(aNInput.getFormatted()).toEqual('234,14\u202f%');

            aNInput.update(AutoNumeric.getPredefinedOptions().percentageUS2dec);
            expect(aNInput.getNumericString()).toEqual('2.3414');
            expect(aNInput.getFormatted()).toEqual('234.14%');

            aNInput.update(AutoNumeric.getPredefinedOptions().percentageEU3dec);
            expect(aNInput.getNumericString()).toEqual('2.3414');
            expect(aNInput.getFormatted()).toEqual('234,140\u202f%');
            aNInput.set(2.34137689);
            expect(aNInput.getNumericString()).toEqual('2.34138');
            expect(aNInput.getFormatted()).toEqual('234,138\u202f%');
        });

        it('should init and update the element with the correct predefined settings, limiting to a positive value', () => {
            newInput.value = '1256789.02';
            aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().euroPos);
            expect(aNInput.getNumericString()).toEqual('1256789.02');
            expect(aNInput.getFormatted()).toEqual('1.256.789,02\u202f€');
            expect(() => aNInput.set(999999.99)).not.toThrow();
            expect(() => aNInput.set(-1)).toThrow();
            expect(aNInput.getFormatted()).toEqual('999.999,99\u202f€');
        });

        it('should fail to init when the default value is outside of the min and max limits', () => {
            newInput.value = '-1256789.02';
            expect(() => new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().euroPos)).toThrow();
        });

        it('should init and update the element with the correct predefined settings, limiting to a negative value', () => {
            newInput.value = '-1256789.02';
            aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().euroNeg);
            expect(aNInput.getNumericString()).toEqual('-1256789.02');
            expect(aNInput.getFormatted()).toEqual('-1.256.789,02\u202f€');
            expect(() => aNInput.set(1)).toThrow();
            expect(() => aNInput.set(-999999.99)).not.toThrow();
            expect(aNInput.getFormatted()).toEqual('-999.999,99\u202f€');
        });

        it('should init and update the element with the correct predefined settings (and `rawValueDivisor`), limiting to a positive value', () => {
            newInput.value = '0.06246';
            aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().percentageEU2decPos);
            expect(aNInput.getNumericString()).toEqual('0.0625');
            expect(aNInput.getFormatted()).toEqual('6,25\u202f%');
            expect(() => aNInput.set(-0.001)).toThrow();
            expect(() => aNInput.set(0.712)).not.toThrow();
            expect(aNInput.getFormatted()).toEqual('71,20\u202f%');
        });

        it('should init and update the element with the correct predefined settings (and `rawValueDivisor`), limiting to a negative value', () => {
            newInput.value = '-0.06246';
            aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().percentageEU2decNeg);
            expect(aNInput.getNumericString()).toEqual('-0.0625');
            expect(aNInput.getFormatted()).toEqual('-6,25\u202f%');
            expect(() => aNInput.set(0.001)).toThrow();
            expect(() => aNInput.set(-0.712)).not.toThrow();
            expect(aNInput.getFormatted()).toEqual('-71,20\u202f%');
        });

        it('should init and update the element with the correct predefined settings, using integers only', () => {
            newInput.value = '-6.246';
            aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().integer);
            expect(aNInput.getNumericString()).toEqual('-6');
            expect(aNInput.getFormatted()).toEqual('-6');
            expect(() => aNInput.set(15.001)).not.toThrow();
            expect(aNInput.getFormatted()).toEqual('15');
            expect(() => aNInput.set(-0.712)).not.toThrow();
            expect(aNInput.getFormatted()).toEqual('-1');
            aNInput.set(13256.678);
            expect(aNInput.getFormatted()).toEqual('13,257');
        });

        it('should init and update the element with the correct predefined settings, using positive integers only', () => {
            newInput.value = '6.246';
            aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().integerPos);
            expect(aNInput.getNumericString()).toEqual('6');
            expect(aNInput.getFormatted()).toEqual('6');
            expect(() => aNInput.set(15.001)).not.toThrow();
            expect(aNInput.getFormatted()).toEqual('15');
            expect(() => aNInput.set(-0.712)).toThrow();
            expect(aNInput.getFormatted()).toEqual('15');
            aNInput.set(13256.678);
            expect(aNInput.getFormatted()).toEqual('13,257');
        });

        it('should init and update the element with the correct predefined settings, using negative integers only', () => {
            newInput.value = '-6.246';
            aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().integerNeg);
            expect(aNInput.getNumericString()).toEqual('-6');
            expect(aNInput.getFormatted()).toEqual('-6');
            expect(() => aNInput.set(15.001)).toThrow();
            expect(aNInput.getFormatted()).toEqual('-6');
            expect(() => aNInput.set(-0.712)).not.toThrow();
            expect(aNInput.getFormatted()).toEqual('-1');
            aNInput.set(-13256.678);
            expect(aNInput.getFormatted()).toEqual('-13,257');
        });

        it('should init and update the element with the correct predefined settings, using floats only', () => {
            spyOn(console, 'warn');
            newInput.value = '-6.246';
            aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().float);
            expect(aNInput.getNumericString()).toEqual('-6.25');
            expect(aNInput.getFormatted()).toEqual('-6.25');
            expect(() => aNInput.set(15.021)).not.toThrow();
            expect(aNInput.getFormatted()).toEqual('15.02');
            expect(() => aNInput.set(-0.712)).not.toThrow();
            expect(aNInput.getFormatted()).toEqual('-0.71');
            aNInput.set(13256.678);
            expect(aNInput.getFormatted()).toEqual('13,256.68');

            aNInput.set(15.001);
            expect(aNInput.getFormatted()).toEqual('15');
            aNInput.options.allowDecimalPadding(AutoNumeric.options.allowDecimalPadding.always);
            expect(aNInput.getFormatted()).toEqual('15.00');
        });

        it('should init and update the element with the correct predefined settings, using positive floats only', () => {
            spyOn(console, 'warn');
            newInput.value = '6.246';
            aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().floatPos);
            expect(aNInput.getNumericString()).toEqual('6.25');
            expect(aNInput.getFormatted()).toEqual('6.25');
            expect(() => aNInput.set(15.021)).not.toThrow();
            expect(aNInput.getFormatted()).toEqual('15.02');
            expect(() => aNInput.set(-0.712)).toThrow();
            expect(aNInput.getFormatted()).toEqual('15.02');
            aNInput.set(13256.678);
            expect(aNInput.getFormatted()).toEqual('13,256.68');
        });

        it('should init and update the element with the correct predefined settings, using negative floats only', () => {
            spyOn(console, 'warn');
            newInput.value = '-6.246';
            aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().floatNeg);
            expect(aNInput.getNumericString()).toEqual('-6.25');
            expect(aNInput.getFormatted()).toEqual('-6.25');
            expect(() => aNInput.set(15.021)).toThrow();
            expect(aNInput.getFormatted()).toEqual('-6.25');
            expect(() => aNInput.set(-0.712)).not.toThrow();
            expect(aNInput.getFormatted()).toEqual('-0.71');
            aNInput.set(-13256.678);
            expect(aNInput.getFormatted()).toEqual('-13,256.68');
        });

        it('should init and update the element with the correct predefined settings, formatting numeric strings', () => {
            newInput.value = '-72376.246';
            aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().numeric);
            expect(aNInput.getNumericString()).toEqual('-72376.25');
            expect(aNInput.getFormatted()).toEqual('-72376.25');
            expect(() => aNInput.set(15.001)).not.toThrow();
            expect(aNInput.getFormatted()).toEqual('15.00');
            expect(() => aNInput.set(-0.712)).not.toThrow();
            expect(aNInput.getFormatted()).toEqual('-0.71');
            aNInput.set(13256.678);
            expect(aNInput.getFormatted()).toEqual('13256.68');
        });

        it('should init and update the element with the correct predefined settings, formatting positive numeric strings', () => {
            newInput.value = '72376.246';
            aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().numericPos);
            expect(aNInput.getNumericString()).toEqual('72376.25');
            expect(aNInput.getFormatted()).toEqual('72376.25');
            expect(() => aNInput.set(15.001)).not.toThrow();
            expect(aNInput.getFormatted()).toEqual('15.00');
            expect(() => aNInput.set(-0.712)).toThrow();
            expect(aNInput.getFormatted()).toEqual('15.00');
            aNInput.set(13256.678);
            expect(aNInput.getFormatted()).toEqual('13256.68');
        });

        it('should init and update the element with the correct predefined settings, formatting negative numeric strings', () => {
            newInput.value = '-72376.246';
            aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().numericNeg);
            expect(aNInput.getNumericString()).toEqual('-72376.25');
            expect(aNInput.getFormatted()).toEqual('-72376.25');
            expect(() => aNInput.set(15.001)).toThrow();
            expect(aNInput.getFormatted()).toEqual('-72376.25');
            expect(() => aNInput.set(-0.712)).not.toThrow();
            expect(aNInput.getFormatted()).toEqual('-0.71');
            aNInput.set(-13256.678);
            expect(aNInput.getFormatted()).toEqual('-13256.68');
        });

        it('should init the element with an initial value in scientific notation', () => {
            // Test the `scientificToDecimal` function directly
            function testFunc(value) {
                const decimalValue = AutoNumericHelper.scientificToDecimal(value);
                if (isNaN(Number(value))) {
                    expect(decimalValue).toBeNaN();
                } else {
                    expect(Number(decimalValue)).toEqual(Number(value));
                }
            }
            const valuesToTest = [
                '12345E1',
                '12345e3',
                '7342.56e40',
                '7342.561e40',
                '7342.561E40',
                '73.42561e42',
                '7.342561e43',
                '12345e-3',
                '12345.67e-3',
                '-123.4567e-6',
                '6.1349392e-13',
                '6.1349392E-13',
                '6.13FOO2e-13',
                '1e3',
                '-1e3',
                '-1e8',
                '-1e76',
                '-1E76',
                '-1e',
                '-e12',
                '1.2345e4',
                '1.23456789e4',
                '1.e4',
                '.234e4',
                '1.234e10',
                '12345e3',
                '12345e1',
                '1.23456789e-4',
                '1.234e-6',
                '12.34e-2',
                '.123e-5',
                '123.456e-6',
                '12345e-1',
                '12345e-2',
                '12345e-3',
                '12345.67e-3',
                '-12345e3',
                '123e-6',
                '-123.4567e-6',
                '-1e8',
                'foobar',
            ];
            valuesToTest.map(testFunc);

            // Then test it in the AutoNumeric context
            // When initialized with a value on the html
            newInput.value = '12345E1';
            aNInput = new AutoNumeric(newInput);
            expect(aNInput.getNumericString()).toEqual('123450');
            aNInput.remove();

            // When initialized with a given value
            aNInput = new AutoNumeric(newInput, '12345E1', {
                maximumValue : '100000000000000000000000000000000000000000000',
                decimalPlaces: 40,
            });
            expect(aNInput.getNumericString()).toEqual('123450');

            // Also check that using `set()` with a scientific value is supported
            aNInput.set('12345e3');
            expect(aNInput.getNumericString()).toEqual('12345000');
            aNInput.set('7342.561e40');
            expect(aNInput.getNumericString()).toEqual('73425610000000000000000000000000000000000000');
            aNInput.set('73.42561e42');
            expect(aNInput.getNumericString()).toEqual('73425610000000000000000000000000000000000000');
            aNInput.set('7.342561e43');
            expect(aNInput.getNumericString()).toEqual('73425610000000000000000000000000000000000000');
            aNInput.set('12345.67e-3');
            expect(aNInput.getNumericString()).toEqual('12.34567');
            aNInput.set('6.1349392e-13');
            expect(aNInput.getNumericString()).toEqual('0.00000000000061349392');
            aNInput.set('-1e8');
            expect(aNInput.getNumericString()).toEqual('-100000000');
            aNInput.set('1.23456789e4');
            expect(aNInput.getNumericString()).toEqual('12345.6789');

            aNInput.update({ decimalPlaces: 2 });
            aNInput.set('1.23e-13');
            expect(aNInput.getNumericString()).toEqual('0');
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
            aNInput = new AutoNumeric(newInput, noneLeft);
            expect(aNInput.getNumericString()).toEqual('1234567.89');
            expect(aNInput.getFormatted()).toEqual('+1.234.567,89');
        });

        it('should format with showPositiveSign, no currency sign, suffix placement', () => {
            newInput.value = '1234567.89';
            aNInput = new AutoNumeric(newInput, noneSuffix);
            expect(aNInput.getNumericString()).toEqual('1234567.89');
            expect(aNInput.getFormatted()).toEqual('1.234.567,89+');
        });

        it('should format with showPositiveSign, left currency sign, right placement', () => {
            newInput.value = '1234567.89';
            aNInput = new AutoNumeric(newInput, leftRight);
            expect(aNInput.getNumericString()).toEqual('1234567.89');
            expect(aNInput.getFormatted()).toEqual('€\u00a0+1.234.567,89');
        });

        it('should format with showPositiveSign, left currency sign, left placement', () => {
            newInput.value = '1234567.89';
            aNInput = new AutoNumeric(newInput, leftLeft);
            expect(aNInput.getNumericString()).toEqual('1234567.89');
            expect(aNInput.getFormatted()).toEqual('+€\u00a01.234.567,89');
        });

        it('should format with showPositiveSign, left currency sign, suffix placement', () => {
            newInput.value = '1234567.89';
            aNInput = new AutoNumeric(newInput, leftSuffix);
            expect(aNInput.getNumericString()).toEqual('1234567.89');
            expect(aNInput.getFormatted()).toEqual('€\u00a01.234.567,89+');
        });

        it('should format with showPositiveSign, right currency sign, left placement', () => {
            newInput.value = '1234567.89';
            aNInput = new AutoNumeric(newInput, rightLeft);
            expect(aNInput.getNumericString()).toEqual('1234567.89');
            expect(aNInput.getFormatted()).toEqual('1.234.567,89+\u00a0€');
        });

        it('should format with showPositiveSign, right currency sign, right placement', () => {
            newInput.value = '1234567.89';
            aNInput = new AutoNumeric(newInput, rightRight);
            expect(aNInput.getNumericString()).toEqual('1234567.89');
            expect(aNInput.getFormatted()).toEqual('1.234.567,89\u00a0€+');
        });

        it('should format with showPositiveSign, right currency sign, prefix placement', () => {
            newInput.value = '1234567.89';
            aNInput = new AutoNumeric(newInput, rightPrefix);
            expect(aNInput.getNumericString()).toEqual('1234567.89');
            expect(aNInput.getFormatted()).toEqual('+1.234.567,89\u00a0€');
        });
    });

    describe('`init` method should init with predefined options', () => {
        let aNInput;
        let newInput;

        it('with French', () => {
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
            aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().French); // Initiate the autoNumeric input

            aNInput.set('1234567.89');
            expect(aNInput.get()).toEqual('1234567.89');
            expect(aNInput.getNumericString()).toEqual('1234567.89');
            expect(aNInput.getNumber()).toEqual(1234567.89);
            expect(aNInput.getFormatted()).toEqual('1.234.567,89\u202f€');

            aNInput.remove();
            document.body.removeChild(newInput);
        });

        it('with North American', () => {
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
            aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().NorthAmerican); // Initiate the autoNumeric input

            aNInput.set('1234567.89');
            expect(aNInput.get()).toEqual('1234567.89');
            expect(aNInput.getNumericString()).toEqual('1234567.89');
            expect(aNInput.getNumber()).toEqual(1234567.89);
            expect(aNInput.getFormatted()).toEqual('$1,234,567.89');

            aNInput.remove();
            document.body.removeChild(newInput);
        });

        it('with Japanese', () => {
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
            aNInput = new AutoNumeric(newInput, AutoNumeric.getPredefinedOptions().Japanese); // Initiate the autoNumeric input

            aNInput.set('1234567.89');
            expect(aNInput.get()).toEqual('1234567.89');
            expect(aNInput.getNumericString()).toEqual('1234567.89');
            expect(aNInput.getNumber()).toEqual(1234567.89);
            expect(aNInput.getFormatted()).toEqual('¥1,234,567.89');

            aNInput.remove();
            document.body.removeChild(newInput);
        });
    });

    describe('Initialize multiple AutoNumeric objects with one call to `AutoNumeric.multiple`', () => {
        describe('initialization methods with the `multiple()` function', () => {
            let newInput1;
            let newInput2;
            let newInput3;
            let newInput4;
            let newInput5;
            const options = { currencySymbol: ' €', currencySymbolPlacement: 's', decimalCharacter: ',', digitGroupSeparator: ' ' };

            beforeEach(() => { // Initialization
                newInput1 = document.createElement('input');
                newInput2 = document.createElement('input');
                newInput3 = document.createElement('input');
                newInput4 = document.createElement('input');
                newInput5 = document.createElement('input');
                document.body.appendChild(newInput1);
                document.body.appendChild(newInput2);
                document.body.appendChild(newInput3);
                document.body.appendChild(newInput4);
                document.body.appendChild(newInput5);
            });

            afterEach(() => { // Un-initialization
                document.body.removeChild(newInput1);
                document.body.removeChild(newInput2);
                document.body.removeChild(newInput3);
                document.body.removeChild(newInput4);
                document.body.removeChild(newInput5);
            });

            it('should throw when calling `multiple()` the wrong way', () => {
                expect(() => AutoNumeric.multiple([newInput1])).not.toThrow();
                expect(() => AutoNumeric.multiple(newInput1)).toThrow();
                expect(() => AutoNumeric.multiple(42)).toThrow();
                expect(() => AutoNumeric.multiple(true)).toThrow();
            });

            it('should show a warning when calling `multiple()` with an empty array', () => {
                spyOn(console, 'warn');
                AutoNumeric.multiple([]);
                expect(console.warn).toHaveBeenCalled();
            });

            it('should correctly initialize multiple AutoNumeric elements, with an array of elements', () => {
                const [anElement2, anElement3, anElement4, anElement5] = AutoNumeric.multiple([newInput2, newInput3, newInput4, newInput5]);
                expect(anElement2.getFormatted()).toEqual('');
                expect(anElement3.getFormatted()).toEqual('');
                expect(anElement4.getFormatted()).toEqual('');
                expect(anElement5.getFormatted()).toEqual('');

                expect(anElement2.set(13568.243).getFormatted()).toEqual('13,568.24');
                expect(anElement3.set(187568.243).getFormatted()).toEqual('187,568.24');
                expect(anElement4.set(21613568.243).getFormatted()).toEqual('21,613,568.24');
                expect(anElement5.set(1028.005).getFormatted()).toEqual('1,028.01');

                //TODO Use .global.update() here instead of manually changing each option object one by one -->
                expect(anElement2.update(options).getFormatted()).toEqual('13 568,24 €');
                expect(anElement3.update(options).getFormatted()).toEqual('187 568,24 €');
                expect(anElement4.update(options).getFormatted()).toEqual('21 613 568,24 €');
                expect(anElement5.update(options).getFormatted()).toEqual('1 028,01 €');
            });

            it('should correctly initialize multiple AutoNumeric elements, with an array of one element', () => {
                const [anElement4] = AutoNumeric.multiple([newInput4]);
                expect(anElement4.getFormatted()).toEqual('');
                expect(anElement4.set(21613568.243).getFormatted()).toEqual('21,613,568.24');

                //TODO Use .global.update() here instead of manually changing each option object one by one -->
                expect(anElement4.update(options).getFormatted()).toEqual('21 613 568,24 €');
            });

            it('should correctly initialize multiple AutoNumeric elements, with an empty array', () => {
                spyOn(console, 'warn'); // Suppress the warning message
                const result = AutoNumeric.multiple([]);
                expect(Array.isArray(result)).toEqual(true);
                expect(result.length).toEqual(0);
            });

            it('should correctly initialize multiple AutoNumeric elements, with an array of elements with options', () => {
                const [anElement2, anElement3, anElement4, anElement5] = AutoNumeric.multiple([newInput2, newInput3, newInput4, newInput5], null, options);
                expect(anElement2.getFormatted()).toEqual('');
                expect(anElement3.getFormatted()).toEqual('');
                expect(anElement4.getFormatted()).toEqual('');
                expect(anElement5.getFormatted()).toEqual('');

                expect(anElement2.set(13568.243).getFormatted()).toEqual('13 568,24 €');
                expect(anElement3.set(187568.243).getFormatted()).toEqual('187 568,24 €');
                expect(anElement4.set(21613568.243).getFormatted()).toEqual('21 613 568,24 €');
                expect(anElement5.set(1028.005).getFormatted()).toEqual('1 028,01 €');
            });

            it('should correctly initialize multiple AutoNumeric elements, with a selector string that select nothing', () => {
                spyOn(console, 'warn'); // Suppress the warning message
                const result = AutoNumeric.multiple('.randomSelectThatDoesNotExists_Ge6coo5a > input');
                expect(Array.isArray(result)).toEqual(true);
                expect(result.length).toEqual(0);
            });

            it('should correctly initialize multiple AutoNumeric elements, with a selector string that select only one element', () => {
                newInput4.classList.add('id_multiple_pieb5Aex');
                const result = AutoNumeric.multiple('.id_multiple_pieb5Aex');
                expect(result.length).toEqual(1);
                const [anElement4] = result;

                expect(anElement4.getFormatted()).toEqual('');
                expect(anElement4.set(-21613968.243).getFormatted()).toEqual('-21,613,968.24');
                expect(anElement4.update(options).getFormatted()).toEqual('21 613 968,24- €');
            });

            it('should correctly initialize multiple AutoNumeric elements, with a selector string that select multiple elements', () => {
                newInput1.classList.add('id_multiple_toh1og1I');
                newInput2.classList.add('id_multiple_toh1og1I');
                newInput4.classList.add('id_multiple_toh1og1I');
                const result = AutoNumeric.multiple('.id_multiple_toh1og1I');
                expect(result.length).toEqual(3);
                const [anElement1, anElement2, anElement4] = result;

                expect(anElement1.getFormatted()).toEqual('');
                expect(anElement2.getFormatted()).toEqual('');
                expect(anElement4.getFormatted()).toEqual('');

                expect(anElement1.set(187568.243).getFormatted()).toEqual('187,568.24');
                expect(anElement2.set(13568.243).getFormatted()).toEqual('13,568.24');
                expect(anElement4.set(21613568.243).getFormatted()).toEqual('21,613,568.24');

                //TODO Use .global.update() here instead of manually changing each option object one by one -->
                expect(anElement1.update(options).getFormatted()).toEqual('187 568,24 €');
                expect(anElement2.update(options).getFormatted()).toEqual('13 568,24 €');
                expect(anElement4.update(options).getFormatted()).toEqual('21 613 568,24 €');
            });

            it('should correctly initialize multiple AutoNumeric elements, with a selector string that select multiple elements, and options', () => {
                newInput1.classList.add('id_multiple_ahXee8je');
                newInput2.classList.add('id_multiple_ahXee8je');
                newInput4.classList.add('id_multiple_ahXee8je');
                const result = AutoNumeric.multiple('.id_multiple_ahXee8je', options);
                expect(result.length).toEqual(3);
                const [anElement1, anElement2, anElement4] = result;

                expect(anElement1.set(187568.243).getFormatted()).toEqual('187 568,24 €');
                expect(anElement2.set(13568.243).getFormatted()).toEqual('13 568,24 €');
                expect(anElement4.set(21613568.243).getFormatted()).toEqual('21 613 568,24 €');
            });

            it('should correctly initialize multiple AutoNumeric elements, with an array of elements and one initial value', () => {
                const [anElement2, anElement3, anElement4, anElement5] = AutoNumeric.multiple([newInput2, newInput3, newInput4, newInput5]);
                expect(anElement2.getFormatted()).toEqual('');
                expect(anElement3.getFormatted()).toEqual('');
                expect(anElement4.getFormatted()).toEqual('');
                expect(anElement5.getFormatted()).toEqual('');

                expect(anElement2.set(13568.243).getFormatted()).toEqual('13,568.24');
                expect(anElement3.set(187568.243).getFormatted()).toEqual('187,568.24');
                expect(anElement4.set(21613568.243).getFormatted()).toEqual('21,613,568.24');
                expect(anElement5.set(1028.005).getFormatted()).toEqual('1,028.01');

                //TODO Use .global.update() here instead of manually changing each option object one by one -->
                expect(anElement2.update(options).getFormatted()).toEqual('13 568,24 €');
                expect(anElement3.update(options).getFormatted()).toEqual('187 568,24 €');
                expect(anElement4.update(options).getFormatted()).toEqual('21 613 568,24 €');
                expect(anElement5.update(options).getFormatted()).toEqual('1 028,01 €');
            });

            it('should correctly initialize multiple AutoNumeric elements, with multiple elements, one initial value, and options', () => {
                newInput1.classList.add('id_multiple_Gur0hei6');
                newInput2.classList.add('id_multiple_Gur0hei6');
                newInput4.classList.add('id_multiple_Gur0hei6');
                const result = AutoNumeric.multiple('.id_multiple_Gur0hei6', 187568.243, options);
                expect(result.length).toEqual(3);
                const [anElement1, anElement2, anElement4] = result;

                expect(anElement1.getFormatted()).toEqual('187 568,24 €');
                expect(anElement2.getFormatted()).toEqual('187 568,24 €');
                expect(anElement4.getFormatted()).toEqual('187 568,24 €');
            });

            it('should correctly initialize multiple AutoNumeric elements, with multiple elements, multiple initial values (complete), and options', () => {
                newInput1.classList.add('id_multiple_Gaet4zaa');
                newInput2.classList.add('id_multiple_Gaet4zaa');
                newInput4.classList.add('id_multiple_Gaet4zaa');
                const result = AutoNumeric.multiple('.id_multiple_Gaet4zaa', [187568.243, 13568.243, 21613568.243], options);
                expect(result.length).toEqual(3);
                const [anElement1, anElement2, anElement4] = result;

                expect(anElement1.getFormatted()).toEqual('187 568,24 €');
                expect(anElement2.getFormatted()).toEqual('13 568,24 €');
                expect(anElement4.getFormatted()).toEqual('21 613 568,24 €');
            });

            it('should correctly initialize multiple AutoNumeric elements, with multiple elements, multiple initial values (incomplete), and options', () => {
                newInput1.classList.add('id_multiple_RaePhut1');
                newInput2.classList.add('id_multiple_RaePhut1');
                newInput4.classList.add('id_multiple_RaePhut1');
                const result = AutoNumeric.multiple('.id_multiple_RaePhut1', [187568.243, 13568.243], options);
                expect(result.length).toEqual(3);
                const [anElement1, anElement2, anElement4] = result;

                expect(anElement1.getFormatted()).toEqual('187 568,24 €');
                expect(anElement2.getFormatted()).toEqual('13 568,24 €');
                expect(anElement4.getFormatted()).toEqual('');
            });

            it('should correctly initialize multiple AutoNumeric elements, with an array of elements and an array of options as the second argument', () => {
                const [anElement2, anElement3, anElement4, anElement5] = AutoNumeric.multiple(
                    [newInput2, newInput3, newInput4, newInput5],
                    [
                        'dollar',
                        {
                            currencySymbol: AutoNumeric.options.currencySymbol.franc,
                            currencySymbolPlacement: AutoNumeric.options.currencySymbolPlacement.suffix,
                        },
                    ],
                );
                expect(anElement2.getFormatted()).toEqual('');
                expect(anElement3.getFormatted()).toEqual('');
                expect(anElement4.getFormatted()).toEqual('');
                expect(anElement5.getFormatted()).toEqual('');

                expect(anElement2.set(13568.243).getFormatted()).toEqual('13,568.24₣');
                expect(anElement3.set(187568.243).getFormatted()).toEqual('187,568.24₣');
                expect(anElement4.set(21613568.243).getFormatted()).toEqual('21,613,568.24₣');
                expect(anElement5.set(1028.005).getFormatted()).toEqual('1,028.01₣');
            });

            it('should correctly initialize multiple AutoNumeric elements, with an array of elements and an array of options as the third argument', () => {
                const [anElement2, anElement3, anElement4, anElement5] = AutoNumeric.multiple(
                    [newInput2, newInput3, newInput4, newInput5],
                    null, // Initial values
                    [
                        'dollar',
                        {
                            currencySymbol: AutoNumeric.options.currencySymbol.franc,
                            currencySymbolPlacement: AutoNumeric.options.currencySymbolPlacement.suffix,
                        },
                    ],
                );
                expect(anElement2.getFormatted()).toEqual('');
                expect(anElement3.getFormatted()).toEqual('');
                expect(anElement4.getFormatted()).toEqual('');
                expect(anElement5.getFormatted()).toEqual('');

                expect(anElement2.set(13568.243).getFormatted()).toEqual('13,568.24₣');
                expect(anElement3.set(187568.243).getFormatted()).toEqual('187,568.24₣');
                expect(anElement4.set(21613568.243).getFormatted()).toEqual('21,613,568.24₣');
                expect(anElement5.set(1028.005).getFormatted()).toEqual('1,028.01₣');
            });
        });

        describe('initialization methods with the `multiple()` function and the `parentElement`/`exclude` object', () => {
            let formElement;
            let newInput1;
            let newInput2;
            let newInput3;
            let newInput4;
            let newInput5;
            const options = { currencySymbol: ' €', currencySymbolPlacement: 's', decimalCharacter: ',', digitGroupSeparator: ' ' };

            beforeEach(() => { // Initialization
                formElement = document.createElement('form');
                newInput1 = document.createElement('input');
                newInput2 = document.createElement('input');
                newInput3 = document.createElement('input');
                newInput4 = document.createElement('input');
                newInput5 = document.createElement('input');
                document.body.appendChild(newInput5);
                document.body.appendChild(formElement);
                formElement.appendChild(newInput1);
                formElement.appendChild(newInput2);
                formElement.appendChild(newInput3);
                formElement.appendChild(newInput4);
            });

            afterEach(() => { // Un-initialization
                formElement.removeChild(newInput1);
                formElement.removeChild(newInput2);
                formElement.removeChild(newInput3);
                formElement.removeChild(newInput4);
                document.body.removeChild(newInput5);
                document.body.removeChild(formElement);
            });

            it('should correctly initialize multiple AutoNumeric elements, with only the `parentElement` attribute initialized, and without options', () => {
                const result = AutoNumeric.multiple({ rootElement: formElement });
                expect(result.length).toEqual(4);
                const [anElement1, anElement2, anElement3, anElement4] = result;

                expect(anElement1.getFormatted()).toEqual('');
                expect(anElement2.getFormatted()).toEqual('');
                expect(anElement3.getFormatted()).toEqual('');
                expect(anElement4.getFormatted()).toEqual('');

                expect(anElement1.set(1028.005).getFormatted()).toEqual('1,028.01');
                expect(anElement2.set(13568.243).getFormatted()).toEqual('13,568.24');
                expect(anElement3.set(187568.243).getFormatted()).toEqual('187,568.24');
                expect(anElement4.set(21613568.243).getFormatted()).toEqual('21,613,568.24');
            });

            it('should correctly initialize multiple AutoNumeric elements, with only the `parentElement` attribute initialized, with options', () => {
                const result = AutoNumeric.multiple({ rootElement: formElement }, options);
                expect(result.length).toEqual(4);
                const [anElement1, anElement2, anElement3, anElement4] = result;

                expect(anElement1.getFormatted()).toEqual('');
                expect(anElement2.getFormatted()).toEqual('');
                expect(anElement3.getFormatted()).toEqual('');
                expect(anElement4.getFormatted()).toEqual('');

                expect(anElement1.set(1028.005).getFormatted()).toEqual('1 028,01 €');
                expect(anElement2.set(13568.243).getFormatted()).toEqual('13 568,24 €');
                expect(anElement3.set(187568.243).getFormatted()).toEqual('187 568,24 €');
                expect(anElement4.set(21613568.243).getFormatted()).toEqual('21 613 568,24 €');
            });

            it('should correctly initialize multiple AutoNumeric elements, with the `parentElement` and `exclude` attributes initialized, and without options', () => {
                const result = AutoNumeric.multiple({ rootElement: formElement, exclude: [newInput2, newInput3] });
                expect(result.length).toEqual(2);
                const [anElement1, anElement4] = result;

                expect(anElement1.getFormatted()).toEqual('');
                expect(anElement4.getFormatted()).toEqual('');

                expect(anElement1.set(1028.005).getFormatted()).toEqual('1,028.01');
                expect(anElement4.set(21613568.243).getFormatted()).toEqual('21,613,568.24');
            });

            it('should correctly initialize multiple AutoNumeric elements, with the `parentElement` and `exclude` attributes initialized, with options', () => {
                const result = AutoNumeric.multiple({ rootElement: formElement, exclude: [newInput2, newInput3] }, options);
                expect(result.length).toEqual(2);
                const [anElement1, anElement4] = result;

                expect(anElement1.getFormatted()).toEqual('');
                expect(anElement4.getFormatted()).toEqual('');

                expect(anElement1.set(1028.005).getFormatted()).toEqual('1 028,01 €');
                expect(anElement4.set(21613568.243).getFormatted()).toEqual('21 613 568,24 €');
            });

            it('should throw when trying to initialize multiple AutoNumeric elements, with an invalide `exclude` attributes', () => {
                expect(() => AutoNumeric.multiple({ rootElement: formElement, exclude: 'foobar' })).toThrow();
            });
        });
    });
});

describe('Modifying the options after initialization', () => {
    describe(`Options updates`, () => {
        let aNInput;
        let newInput;
        const basicOptions = {
            digitGroupSeparator: '٬',
            decimalPlaces      : 2,
            currencySymbol     : '#',
        };

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
            aNInput = new AutoNumeric(newInput, 12345678.912, basicOptions);
            expect(aNInput.getNumericString()).toEqual('12345678.91');
            expect(aNInput.getFormatted()).toEqual('#12٬345٬678.91');
        });

        afterEach(() => { // Un-initialization
            aNInput.wipe();
            document.body.removeChild(newInput);
        });

        it('should allow updating the options with a custom object', () => {
            aNInput.update({
                digitGroupSeparator: '˙',
                decimalPlaces      : 1,
                currencySymbol     : 'K',
            });
            expect(aNInput.getNumericString()).toEqual('12345678.9');
            expect(aNInput.getFormatted()).toEqual('K12˙345˙678.9');
        });

        it('should allow updating the options with a predefined object', () => {
            aNInput.update(AutoNumeric.getPredefinedOptions().euro);
            expect(aNInput.getNumericString()).toEqual('12345678.91');
            expect(aNInput.getFormatted()).toEqual('12.345.678,91\u202f€');
        });

        it('should allow updating the options with a predefined option name', () => {
            aNInput.update('euro');
            expect(aNInput.getNumericString()).toEqual('12345678.91');
            expect(aNInput.getFormatted()).toEqual('12.345.678,91\u202f€');
        });

        it('should allow updating the options with many options objects, including a predefined option name', () => {
            aNInput.update(
                'euro',
                {
                    digitGroupSeparator: '˙',
                    decimalPlaces      : 1,
                    currencySymbol     : 'K',
                },
                {
                    currencySymbol: 'L',
                },
            );
            expect(aNInput.getNumericString()).toEqual('12345678.9');
            expect(aNInput.getFormatted()).toEqual('12˙345˙678,9L');
        });

        it('should allow updating the options with an array of options objects, including a predefined option name', () => { // Issue #556
            aNInput.update([
                'euro',
                {
                    digitGroupSeparator: '˙',
                    decimalPlaces      : 1,
                    currencySymbol     : 'K',
                },
                {
                    currencySymbol: 'L',
                },
            ]);
            expect(aNInput.getNumericString()).toEqual('12345678.9');
            expect(aNInput.getFormatted()).toEqual('12˙345˙678,9L');
        });
    });
});

xdescribe('Managing external changes', () => { //XXX This test is deactivated since PhantomJS is failing when defining some properties with `Object.defineProperty`. See issue https://github.com/ariya/phantomjs/issues/13895
    it(`should watch for external change to the input 'value' attribute`, () => {
        // Initialization
        const inputElement = document.createElement('input');
        document.body.appendChild(inputElement);

        // Test the external modification
        let aNInput = new AutoNumeric(inputElement, [autoNumericOptionsEuro, { watchExternalChanges: AutoNumeric.options.watchExternalChanges.watch }]);
        aNInput.set(6789.02);
        expect(aNInput.getNumericString()).toEqual('6789.02');
        expect(aNInput.getFormatted()).toEqual('6.789,02 €');

        aNInput.node().value = '1234567.2345';
        expect(aNInput.getNumericString()).toEqual('1234567.23');
        expect(aNInput.getFormatted()).toEqual('1.234.567,23 €');

        // Remove the AutoNumeric object
        aNInput.remove();

        // Test that the default getter and setters are ok
        const testingGetter = inputElement.value;
        expect(testingGetter).toEqual('1.234.567,23 €');
        inputElement.value = '42';
        expect(inputElement.value).toEqual('42');

        // Add back the AutoNumeric object and check that there are no errors shown
        aNInput = new AutoNumeric(inputElement, [autoNumericOptionsEuro, { watchExternalChanges: AutoNumeric.options.watchExternalChanges.watch }]);
        expect(aNInput.getNumericString()).toEqual('42');
        expect(aNInput.getFormatted()).toEqual('42,00 €');
        aNInput.set(116789.02);
        expect(aNInput.getNumericString()).toEqual('116789.02');
        expect(aNInput.getFormatted()).toEqual('116.789,02 €');

        // Un-initialization
        aNInput.remove();
        document.body.removeChild(inputElement);
    });

    it(`should not watch for external change to the input 'value' attribute`, () => {
        // Initialization
        const inputElement = document.createElement('input');
        document.body.appendChild(inputElement);

        // Test the external modification
        let aNInput = new AutoNumeric(inputElement, [autoNumericOptionsEuro, { watchExternalChanges: AutoNumeric.options.watchExternalChanges.doNotWatch }]);
        aNInput.set(6789.02);
        expect(aNInput.getNumericString()).toEqual('6789.02');
        expect(aNInput.getFormatted()).toEqual('6.789,02 €');

        aNInput.node().value = '1234567.2345';
        expect(aNInput.getNumericString()).toEqual('6789.02');
        expect(aNInput.getFormatted()).toEqual('1234567.2345');

        // Remove the AutoNumeric object
        aNInput.remove();

        // Test that the default getter and setters are ok
        const testingGetter = inputElement.value;
        expect(testingGetter).toEqual('1234567.2345');
        inputElement.value = '42';
        expect(inputElement.value).toEqual('42');

        // Add back the AutoNumeric object and check that there are no errors shown
        aNInput = new AutoNumeric(inputElement, [autoNumericOptionsEuro, { watchExternalChanges: AutoNumeric.options.watchExternalChanges.doNotWatch }]);
        expect(aNInput.getNumericString()).toEqual('42');
        expect(aNInput.getFormatted()).toEqual('42,00 €');
        aNInput.set(116789.02);
        expect(aNInput.getNumericString()).toEqual('116789.02');
        expect(aNInput.getFormatted()).toEqual('116.789,02 €');

        // Un-initialization
        aNInput.remove();
        document.body.removeChild(inputElement);
    });

    it(`should watch for external change to the input 'textContent' attribute`, () => {
        // Initialization
        const pElement = document.createElement('p');
        document.body.appendChild(pElement);

        // Test the external modification
        let aNElement = new AutoNumeric(pElement, [autoNumericOptionsEuro, { watchExternalChanges: AutoNumeric.options.watchExternalChanges.watch }]);
        aNElement.set(6789.02);
        expect(aNElement.getNumericString()).toEqual('6789.02');
        expect(aNElement.getFormatted()).toEqual('6.789,02 €');

        aNElement.node().textContent = '1234567.2345'; //FIXME Fails since `this.getterSetter` is undefined when trying to getOwnPropertyDescriptor the `textContent` attribute
        expect(aNElement.getNumericString()).toEqual('1234567.23');
        expect(aNElement.getFormatted()).toEqual('1.234.567,23 €');

        // Remove the AutoNumeric object
        aNElement.remove();

        // Test that the default getter and setters are ok
        const testingGetter = pElement.textContent;
        expect(testingGetter).toEqual('1.234.567,23 €');
        pElement.textContent = '42';
        expect(pElement.textContent).toEqual('42');

        // Add back the AutoNumeric object and check that there are no errors shown
        aNElement = new AutoNumeric(pElement, [autoNumericOptionsEuro, { watchExternalChanges: AutoNumeric.options.watchExternalChanges.watch }]);
        expect(aNElement.getNumericString()).toEqual('42');
        expect(aNElement.getFormatted()).toEqual('42,00 €');
        aNElement.set(116789.02);
        expect(aNElement.getNumericString()).toEqual('116789.02');
        expect(aNElement.getFormatted()).toEqual('116.789,02 €');

        // Un-initialization
        aNElement.remove();
        document.body.removeChild(pElement);
    });

    it(`should not watch for external change to the input 'textContent' attribute`, () => {
        // Initialization
        const pElement = document.createElement('p');
        document.body.appendChild(pElement);

        // Test the external modification
        let aNElement = new AutoNumeric(pElement, [autoNumericOptionsEuro, { watchExternalChanges: AutoNumeric.options.watchExternalChanges.doNotWatch }]);
        aNElement.set(6789.02);
        expect(aNElement.getNumericString()).toEqual('6789.02');
        expect(aNElement.getFormatted()).toEqual('6.789,02 €');

        aNElement.node().textContent = '1234567.2345'; //FIXME Fails since `this.getterSetter` is undefined when trying to getOwnPropertyDescriptor the `textContent` attribute
        expect(aNElement.getNumericString()).toEqual('6789.02');
        expect(aNElement.getFormatted()).toEqual('1234567.2345');

        // Remove the AutoNumeric object
        aNElement.remove();

        // Test that the default getter and setters are ok
        const testingGetter = pElement.textContent;
        expect(testingGetter).toEqual('1234567.2345');
        pElement.textContent = '42';
        expect(pElement.textContent).toEqual('42');

        // Add back the AutoNumeric object and check that there are no errors shown
        aNElement = new AutoNumeric(pElement, [autoNumericOptionsEuro, { watchExternalChanges: AutoNumeric.options.watchExternalChanges.doNotWatch }]);
        expect(aNElement.getNumericString()).toEqual('42');
        expect(aNElement.getFormatted()).toEqual('42,00 €');
        aNElement.set(116789.02);
        expect(aNElement.getNumericString()).toEqual('116789.02');
        expect(aNElement.getFormatted()).toEqual('116.789,02 €');

        // Un-initialization
        aNElement.remove();
        document.body.removeChild(pElement);
    });
});

describe('Instantiated autoNumeric functions', () => {
    describe('`getNumericString`, `getLocalized` and `getNumber` methods', () => {
        let aNInput;
        let newInput;

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
            aNInput = new AutoNumeric(newInput); // Initiate the autoNumeric input
        });

        afterEach(() => { // Un-initialization
            aNInput.remove();
            document.body.removeChild(newInput);
        });

        it('should return an unformatted value, (without having any option specified)', () => {
            // With an integer
            aNInput.set(0);
            expect(aNInput.get()).toEqual('0');
            expect(aNInput.getNumericString()).toEqual('0');
            expect(aNInput.getLocalized()).toEqual('0');
            expect(aNInput.getNumber()).toEqual(0);

            aNInput.set(-42);
            expect(aNInput.get()).toEqual('-42');
            expect(aNInput.getNumericString()).toEqual('-42');
            aNInput.update({ outputFormat: ',-' });
            expect(aNInput.getNumericString()).toEqual('-42');
            expect(aNInput.getLocalized()).toEqual('42-');
            expect(aNInput.getNumber()).toEqual(-42);
            aNInput.update({ outputFormat: '-,' });
            expect(aNInput.getLocalized()).toEqual('-42');
            expect(aNInput.getNumber()).toEqual(-42);
            aNInput.update({ outputFormat: '.-' });
            expect(aNInput.getLocalized()).toEqual('42-');
            expect(aNInput.getNumber()).toEqual(-42);
            aNInput.update({ outputFormat: null });
            expect(aNInput.getLocalized()).toEqual('-42');
            expect(aNInput.getNumber()).toEqual(-42);
            aNInput.update({ outputFormat: 'number' });
            expect(aNInput.getLocalized()).toEqual(-42);
            expect(aNInput.getNumber()).toEqual(-42);
            aNInput.update({ outputFormat: 'string' });
            expect(aNInput.getLocalized()).toEqual('-42');
            expect(aNInput.getNumber()).toEqual(-42);

            // With a float
            aNInput.set(-42.76);
            expect(aNInput.getNumericString()).toEqual('-42.76');
            aNInput.update({ outputFormat: ',-' });
            expect(aNInput.getNumericString()).toEqual('-42.76');
            expect(aNInput.getLocalized()).toEqual('42,76-');
            expect(aNInput.getNumber()).toEqual(-42.76);

            aNInput.update({ outputFormat: '-,' });
            expect(aNInput.getLocalized()).toEqual('-42,76');
            expect(aNInput.getNumber()).toEqual(-42.76);
            aNInput.update({ outputFormat: '.-' });
            expect(aNInput.getLocalized()).toEqual('42.76-');
            expect(aNInput.getNumber()).toEqual(-42.76);
            aNInput.update({ outputFormat: null });
            expect(aNInput.getLocalized()).toEqual('-42.76');
            expect(aNInput.getNumber()).toEqual(-42.76);
            aNInput.update({ outputFormat: 'number' });
            expect(aNInput.getLocalized()).toEqual(-42.76);
            expect(aNInput.getNumber()).toEqual(-42.76);
            aNInput.update({ outputFormat: 'string' });
            expect(aNInput.getLocalized()).toEqual('-42.76');
            expect(aNInput.getNumber()).toEqual(-42.76);
        });

        it('should return an unformatted value (with some options set)', () => {
            // Euros
            aNInput.update(autoNumericOptionsEuro);
            aNInput.update({ outputFormat: ',-' });
            aNInput.set(0);
            expect(aNInput.getFormatted()).toEqual('0,00 €');
            expect(aNInput.getNumericString()).toEqual('0');
            expect(aNInput.getLocalized()).toEqual('0');
            expect(aNInput.getNumber()).toEqual(0);
            aNInput.update({ leadingZero: 'keep' });
            expect(aNInput.getLocalized()).toEqual('0');
            expect(aNInput.getNumber()).toEqual(0);

            aNInput.set(-42);
            expect(aNInput.getFormatted()).toEqual('42,00- €');
            expect(aNInput.getNumericString()).toEqual('-42');
            expect(aNInput.getLocalized()).toEqual('42-');
            expect(aNInput.getNumber()).toEqual(-42);
            aNInput.update({ outputFormat: '-,' });
            expect(aNInput.getLocalized()).toEqual('-42');
            expect(aNInput.getNumber()).toEqual(-42);
            aNInput.update({ outputFormat: '.-' });
            expect(aNInput.getLocalized()).toEqual('42-');
            expect(aNInput.getNumber()).toEqual(-42);
            aNInput.update({ outputFormat: null });
            expect(aNInput.getLocalized()).toEqual('-42');
            expect(aNInput.getNumber()).toEqual(-42);
            aNInput.update({ outputFormat: 'number' });
            expect(aNInput.getLocalized()).toEqual(-42);
            expect(aNInput.getNumber()).toEqual(-42);
            aNInput.update({ outputFormat: 'string' });
            expect(aNInput.getLocalized()).toEqual('-42');
            expect(aNInput.getNumber()).toEqual(-42);

            aNInput.set(1234.56); // Here I also test that setting a positive value after a negative one works ok
            expect(aNInput.getNumericString()).toEqual('1234.56');
            expect(aNInput.getNumber()).toEqual(1234.56);
            aNInput.set(6789012.345);
            expect(aNInput.getNumericString()).toEqual('6789012.35'); // Rounding happens here
            expect(aNInput.getNumber()).toEqual(6789012.35);

            // Dollars
            aNInput.update(autoNumericOptionsDollar);
            expect(aNInput.getNumericString()).toEqual('6789012.35'); // First check if updating the options changed the results accordingly
            expect(aNInput.getNumber()).toEqual(6789012.35);
            aNInput.set(1234.56);
            expect(aNInput.getNumericString()).toEqual('1234.56');
            expect(aNInput.getNumber()).toEqual(1234.56);
            aNInput.set(6789012.345);
            expect(aNInput.getNumericString()).toEqual('6789012.35');
            expect(aNInput.getNumber()).toEqual(6789012.35);
            aNInput.set(0);
            expect(aNInput.getNumericString()).toEqual('0');
            expect(aNInput.getNumber()).toEqual(0);
            aNInput.set(-42);
            expect(aNInput.getNumericString()).toEqual('-42');
            expect(aNInput.getNumber()).toEqual(-42);
        });

        it('should return an unformatted value even if the number is bigger than Number.MAX_SAFE_INTEGER', () => {
            if (Number.MAX_SAFE_INTEGER === void(0)) { // Special polyfill case for PhantomJS
                // console.log(`Setting the Number.MAX_SAFE_INTEGER polyfill...`); //DEBUG
                //noinspection JSPrimitiveTypeWrapperUsage
                Number.MAX_SAFE_INTEGER = 9007199254740991;
            }

            aNInput.update({ maximumValue: '9007199254740991000000' });
            aNInput.set(Number.MAX_SAFE_INTEGER); // The exact highest safe integer
            expect(aNInput.getNumericString()).toEqual(`${Number.MAX_SAFE_INTEGER}`);
            aNInput.set('9007199254740996'); // A bit higher than the biggest safest integer
            expect(aNInput.getNumericString()).toEqual('9007199254740996');
            // Add a test where the user set a very big number (bigger than Number.MAX_SAFE_INTEGER), and check if `get` return the correct number
            aNInput.set('9007199254740991000000'); // A very big number
            expect(aNInput.getNumericString()).toEqual('9007199254740991000000');
        });

        it('should execute the given callback with the `get*` methods result', () => {
            let counter = 0;
            function incrementCounter() {
                counter++;
            }

            aNInput.set(42);
            expect(aNInput.getNumericString()).toEqual('42');
            expect(aNInput.getNumber()).toEqual(42);

            expect(counter).toEqual(0);
            expect(aNInput.get(incrementCounter)).toEqual('42');
            expect(counter).toEqual(1);
            expect(aNInput.getNumericString(incrementCounter)).toEqual('42');
            expect(counter).toEqual(2);
            expect(aNInput.getFormatted(incrementCounter)).toEqual('42.00');
            expect(counter).toEqual(3);
            expect(aNInput.getNumber(incrementCounter)).toEqual(42);
            expect(counter).toEqual(4);
            expect(aNInput.getLocalized(null, incrementCounter)).toEqual('42');
            expect(counter).toEqual(5);
            expect(aNInput.getLocalized(incrementCounter)).toEqual('42');
            expect(counter).toEqual(6);
            aNInput.set(42.61);
            expect(aNInput.getLocalized(AutoNumeric.options.outputFormat.comma, incrementCounter)).toEqual('42,61');
            expect(counter).toEqual(7);
        });

        it('should execute the given callback with the `global.get*` methods result', () => {
            // Initialization
            const newInput1 = document.createElement('input');
            const newInput2 = document.createElement('input');
            const newInput3 = document.createElement('input');
            document.body.appendChild(newInput1);
            document.body.appendChild(newInput2);
            document.body.appendChild(newInput3);

            let concatenate = 0;
            let callCount = 0;
            function concatenateAndCallCount(arrValues) {
                concatenate = arrValues.reduce((count, val) => count + val);
                callCount++;
            }

            // Setting the default value
            const anElement1 = new AutoNumeric(newInput1).french();
            const [anElement2, anElement3] = anElement1.init([newInput2, newInput3]);
            anElement1.set(111);
            anElement2.set(222);
            anElement3.set(333);

            // Testing the callback
            expect(callCount).toEqual(0);
            expect(concatenate).toEqual(0);
            const resultNumber = anElement1.global.getNumber();
            expect(resultNumber).toEqual([111, 222, 333]);
            expect(callCount).toEqual(0);
            expect(concatenate).toEqual(0);
            expect(anElement1.global.getNumber(concatenateAndCallCount)).toEqual([111, 222, 333]);
            expect(callCount).toEqual(1);
            expect(concatenate).toEqual(666); // 111+222+333

            anElement1.set(1);
            anElement2.set(2);
            anElement3.set(3);
            expect(anElement1.global.get(concatenateAndCallCount)).toEqual(['1', '2', '3']);
            expect(callCount).toEqual(2);
            expect(concatenate).toEqual('123');

            anElement1.set(-1);
            anElement2.set(0);
            anElement3.set(6);
            expect(anElement1.global.getNumericString(concatenateAndCallCount)).toEqual(['-1', '0', '6']);
            expect(callCount).toEqual(3);
            expect(concatenate).toEqual('-106');

            expect(anElement1.global.getFormatted(concatenateAndCallCount)).toEqual(['-1,00\u202f€', '0,00\u202f€', '6,00\u202f€']);
            expect(callCount).toEqual(4);
            expect(concatenate).toEqual('-1,00\u202f€0,00\u202f€6,00\u202f€');

            anElement1.set(22.67);
            anElement2.set(-20.07).options.outputFormat(AutoNumeric.options.outputFormat.commaNegative);
            anElement3.set(14.06);
            expect(anElement1.global.getLocalized(concatenateAndCallCount)).toEqual(['22.67', '20,07-', '14.06']);
            expect(callCount).toEqual(5);
            expect(concatenate).toEqual('22.6720,07-14.06');

            // Un-initialization
            document.body.removeChild(newInput1);
            document.body.removeChild(newInput2);
            document.body.removeChild(newInput3);
        });
    });

    describe(`getNumericString`, () => {
        let aNInput;
        let newInput;

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
        });

        afterEach(() => { // Un-initialization
            aNInput.nuke();
        });

        it(`should return an empty string as the default value`, () => {
            aNInput = new AutoNumeric(newInput); // Initiate the autoNumeric input
            expect(aNInput.getNumericString()).toEqual('');
        });

        it(`should return '0' as the default value`, () => {
            aNInput = new AutoNumeric(newInput, { emptyInputBehavior : 'zero' }); // Initiate the autoNumeric input
            expect(aNInput.getNumericString()).toEqual('0');
        });

        it('should return the number from the `emptyInputBehavior` setting as the default value', () => {
            aNInput = new AutoNumeric(newInput, { emptyInputBehavior : 1.12345 }); // Initiate the autoNumeric input
            expect(aNInput.getNumericString()).toEqual('1.12');
        });

        it('should return the `minimumValue` as the default value', () => {
            aNInput = new AutoNumeric(newInput, { emptyInputBehavior : 'min' }); // Initiate the autoNumeric input
            expect(aNInput.getNumericString()).toEqual('-10000000000000');
        });

        it('should return the `maximumValue` as the default value', () => {
            aNInput = new AutoNumeric(newInput, { emptyInputBehavior : 'max' }); // Initiate the autoNumeric input
            expect(aNInput.getNumericString()).toEqual('10000000000000');
        });

        it(`should not return a negative value when inputting a positive one and minimumValue is equal to '0' (cf. issue #284)`, () => {
            aNInput = new AutoNumeric(newInput, { minimumValue: '0', maximumValue: '9999', decimalPlaces: 2 }); // Initiate the autoNumeric input

            expect(aNInput.getNumericString()).toEqual('');
            aNInput.set(1234);
            expect(aNInput.getNumericString()).toEqual('1234');
            aNInput.set(0);
            expect(aNInput.getNumericString()).toEqual('0');
            aNInput.set(-0);
            expect(aNInput.getNumericString()).toEqual('0');
        });

        it(`should not return a negative value when inputting a positive one and minimumValue is superior to '0' (cf. issue #284)`, () => {
            spyOn(console, 'warn');
            aNInput = new AutoNumeric(newInput, { minimumValue: '1', maximumValue: '9999', decimalPlaces: 2 }); // Initiate the autoNumeric input

            expect(aNInput.getNumericString()).toEqual('');
            aNInput.set(1234);
            expect(aNInput.getNumericString()).toEqual('1234');
        });
    });

    describe(`set`, () => {
        let aNInput;
        let newInput;

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
            aNInput = new AutoNumeric(newInput); // Initiate the autoNumeric input
        });

        afterEach(() => { // Un-initialization
            aNInput.remove();
            document.body.removeChild(newInput);
        });

        it('should set a raw value and result in a formatted value', () => {
            // Euros
            aNInput.update(autoNumericOptionsEuro);
            aNInput.set(1234.56);
            expect(aNInput.getFormatted()).toEqual('1.234,56 €');
            aNInput.set(6789012.345);
            expect(aNInput.getFormatted()).toEqual('6.789.012,35 €'); // Rounding happens here

            aNInput.set('1234.56');
            expect(aNInput.getFormatted()).toEqual('1.234,56 €');
            aNInput.set('6789012.345');
            expect(aNInput.getFormatted()).toEqual('6.789.012,35 €'); // Rounding happens here

            // Dollars
            aNInput.update(autoNumericOptionsDollar);
            expect(aNInput.getFormatted()).toEqual('$6,789,012.35'); // First check if updating the options changed the results accordingly
            aNInput.set(1234.56);
            expect(aNInput.getFormatted()).toEqual('$1,234.56');
            aNInput.set(6789012.345);
            expect(aNInput.getFormatted()).toEqual('$6,789,012.35');

            aNInput.set('1234.56');
            expect(aNInput.getFormatted()).toEqual('$1,234.56');
            aNInput.set('6789012.345');
            expect(aNInput.getFormatted()).toEqual('$6,789,012.35');
        });

        it('should set a formatted value and result in a formatted value', () => {
            // Euros
            aNInput.update(autoNumericOptionsEuro);
            aNInput.set('1.234,56');
            expect(aNInput.getFormatted()).toEqual('1.234,56 €');
            aNInput.set('6.789.012,345');
            expect(aNInput.getFormatted()).toEqual('6.789.012,35 €'); // Rounding happens here

            // Dollars
            aNInput.update(autoNumericOptionsDollar);
            expect(aNInput.getFormatted()).toEqual('$6,789,012.35'); // First check if updating the options changed the results accordingly
            aNInput.set('1,234.56');
            expect(aNInput.getFormatted()).toEqual('$1,234.56');
            aNInput.set('6,789,012.345');
            expect(aNInput.getFormatted()).toEqual('$6,789,012.35');
        });

        it('should respect the minimumValue and maximumValue settings', () => {
            spyOn(console, 'warn');
            aNInput.update({ minimumValue: '999999.99', maximumValue: '1111111111111.11' });
            expect(() => aNInput.set(999999.99)).not.toThrow();
            expect(() => aNInput.set(1111111111111.11)).not.toThrow();

            expect(() => aNInput.set(999999.984)).toThrow(); // Min, with rounding up
            expect(() => aNInput.set(999999.989)).toThrow(); // Min, even without rounding
            expect(() => aNInput.set(999999.991)).not.toThrow();
            expect(() => aNInput.set(1111111111111.109)).not.toThrow();
            expect(() => aNInput.set(1111111111111.111)).toThrow(); // Max
        });

        it('should respect the minimumValue and maximumValue settings when one of the limit is equal to zero', () => {
            aNInput.update({ minimumValue: '0', maximumValue: '2000' });
            expect(() => aNInput.set(0)).not.toThrow();
            expect(() => aNInput.set(2000)).not.toThrow();
            expect(() => aNInput.set(-0)).not.toThrow();
            expect(() => aNInput.set(0.01)).not.toThrow();

            expect(() => aNInput.set(-0.01)).toThrow();
            expect(() => aNInput.set(2000.01)).toThrow();
        });

        it('should respect the minimumValue and maximumValue settings when one of the limit is negative', () => {
            aNInput.update({ minimumValue: '-666', maximumValue: '100' });
            expect(() => aNInput.set(-666)).not.toThrow();
            expect(() => aNInput.set(100)).not.toThrow();

            expect(() => aNInput.set(-666.01)).toThrow();
            expect(() => aNInput.set(100.01)).toThrow();
        });

        it('should respect the minimumValue and maximumValue settings when both limits are negative', () => {
            spyOn(console, 'warn');
            aNInput.update({ minimumValue: '-4400', maximumValue: '-4200' });
            expect(() => aNInput.set(-4400)).not.toThrow();
            expect(() => aNInput.set(-4200)).not.toThrow();

            expect(() => aNInput.set(-4400.01)).toThrow();
            expect(() => aNInput.set(-4199.99)).toThrow();
            expect(() => aNInput.set(-4199.994)).toThrow();
            expect(() => aNInput.set(-4199.995)).toThrow();
            expect(() => aNInput.set(-4199.995, { roundingMethod: AutoNumeric.options.roundingMethod.toFloorTowardNegativeInfinity })).toThrow();
        });

        it('should respect the minimumValue and maximumValue settings, when setting arabic numbers', () => {
            aNInput.update({ minimumValue: '-1234', maximumValue: '789' });
            expect(() => aNInput.set('-۱۲۳۴')).not.toThrow();
            expect(aNInput.getNumber()).toEqual(-1234);
            expect(() => aNInput.set('٧٨٩')).not.toThrow();
            expect(aNInput.getNumber()).toEqual(789);

            expect(() => aNInput.set('-۱۲۳۴.۰۱')).toThrow();
            expect(() => aNInput.set('٧٨٩.۰۱')).toThrow();
        });

        it('should throw when the minimumValue and maximumValue settings are inverted', () => {
            spyOn(console, 'warn');
            expect(() => aNInput.update({ minimumValue: '100', maximumValue: '-666' })).toThrow();
        });
    });

    describe('`set` and non-ascii numbers', () => {
        let aNInput;
        let newInput;

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
            aNInput = new AutoNumeric(newInput, { digitGroupSeparator : ',', decimalCharacter : '.' }); // Initiate the autoNumeric input
        });

        afterEach(() => { // Un-initialization
            aNInput.remove();
            document.body.removeChild(newInput);
        });

        it('should accepts Arabic numbers', () => {
            expect(aNInput.getNumericString()).toEqual('');
            aNInput.set('١٠٢٣٤٥٦٧.٨٩');
            expect(aNInput.getNumericString()).toEqual('10234567.89');
            expect(aNInput.getNumber()).toEqual(10234567.89);
            expect(aNInput.getFormatted()).toEqual('10,234,567.89');
        });

        it('should accepts Persian numbers', () => {
            expect(aNInput.getNumericString()).toEqual('');
            aNInput.set('۱٠۲۳۴۵۶۷.۸۹');
            expect(aNInput.getNumericString()).toEqual('10234567.89');
            expect(aNInput.getNumber()).toEqual(10234567.89);
            expect(aNInput.getFormatted()).toEqual('10,234,567.89');
        });
    });

    describe(`setUnformatted`, () => {
        let aNInput;
        let newInput;

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
            aNInput = new AutoNumeric(newInput); // Initiate the autoNumeric input
        });

        afterEach(() => { // Un-initialization
            aNInput.remove();
            document.body.removeChild(newInput);
        });

        it('should set the given value as is, without formatting it', () => {
            aNInput.french();
            aNInput.setUnformatted(1234.56);
            expect(aNInput.getFormatted()).toEqual('1234.56');
            aNInput.setUnformatted(6789012.345);
            expect(aNInput.getFormatted()).toEqual('6789012.345');
            aNInput.setUnformatted('2.172.834,23\u202f€');
            expect(aNInput.getFormatted()).toEqual('2.172.834,23\u202f€');

            aNInput.set(500);
            aNInput.options.negativeBracketsTypeOnBlur(AutoNumeric.options.negativeBracketsTypeOnBlur.curlyBraces);
            aNInput.setUnformatted('{1234.56}');
            expect(aNInput.getFormatted()).toEqual('{1234.56}');

            aNInput.set(500);
            aNInput.options.suffixText(AutoNumeric.options.suffixText.percentage);
            aNInput.setUnformatted('1234.56%');
            expect(aNInput.getFormatted()).toEqual('1234.56%');
        });

        it('should fail when trying to set a value outside the range limits', () => {
            aNInput.french({ minimumValue: -50, maximumValue: 200, decimalPlaces: 0 });

            expect(() => aNInput.setUnformatted(-51)).toThrow();
            expect(() => aNInput.setUnformatted(-50)).not.toThrow();
            expect(() => aNInput.setUnformatted(0)).not.toThrow();
            expect(() => aNInput.setUnformatted(10)).not.toThrow();
            expect(() => aNInput.setUnformatted(200)).not.toThrow();
            expect(() => aNInput.setUnformatted(201)).toThrow();
        });

        it('should fail when trying to set an invalid value', () => {
            expect(() => aNInput.setUnformatted('foobar')).toThrow();
        });

        it('should not set anything when the given value is null or undefined', () => {
            aNInput.french();
            aNInput.set(2222.22);
            expect(aNInput.getFormatted()).toEqual('2.222,22\u202f€');
            aNInput.setUnformatted(null);
            expect(aNInput.getFormatted()).toEqual('2.222,22\u202f€');
            aNInput.setUnformatted();
            expect(aNInput.getFormatted()).toEqual('2.222,22\u202f€');
        });
    });

    describe(`setValue`, () => {
        let aNInput;
        let newInput;

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
            aNInput = new AutoNumeric(newInput); // Initiate the autoNumeric input
        });

        afterEach(() => { // Un-initialization
            aNInput.remove();
            document.body.removeChild(newInput);
        });

        it('should set the given value without formatting it, and without checking it', () => {
            aNInput.french();
            aNInput.setValue(1234.56);
            expect(aNInput.getFormatted()).toEqual('1234.56');
            aNInput.setValue(6789012.345);
            expect(aNInput.getFormatted()).toEqual('6789012.345');

            aNInput.setValue('foobar');
            expect(aNInput.getFormatted()).toEqual('foobar');
        });
    });

    describe(`_setElementAndRawValue`, () => {
        let aNInput;
        let newInput;

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
            aNInput = new AutoNumeric(newInput); // Initiate the autoNumeric input
        });

        afterEach(() => { // Un-initialization
            aNInput.remove();
            document.body.removeChild(newInput);
        });

        it('should set the given values (element and raw value) without formatting it, and without checking it', () => {
            aNInput.french();
            aNInput._setElementAndRawValue('newElementValue', 'rawValue');
            expect(aNInput.getFormatted()).toEqual('newElementValue');
            expect(aNInput.rawValue).toEqual('rawValue');

            aNInput._setElementAndRawValue('sameValue');
            expect(aNInput.getFormatted()).toEqual('sameValue');
            expect(aNInput.rawValue).toEqual('sameValue');

            aNInput._setElementAndRawValue('sameValueAgain', false);
            expect(aNInput.getFormatted()).toEqual('sameValueAgain');
            expect(aNInput.rawValue).toEqual('sameValueAgain');
        });
    });

    describe('`update`', () => {
        let aNInput;
        let newInput;

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
            aNInput = new AutoNumeric(newInput).french(); // Initiate the autoNumeric input
        });

        afterEach(() => { // Un-initialization
            aNInput.nuke();
        });

        it('should update the options with one option object', () => {
            aNInput.set(2172834.234);
            expect(aNInput.getFormatted()).toEqual('2.172.834,23\u202f€');

            aNInput.update({ currencySymbol: AutoNumeric.options.currencySymbol.pound });
            expect(aNInput.getFormatted()).toEqual('2.172.834,23£');
        });

        it('should update the options with multiple option objects', () => {
            aNInput.set(2172834.234);
            expect(aNInput.getFormatted()).toEqual('2.172.834,23\u202f€');

            // Objects overwriting themselves
            aNInput.update({ currencySymbol: AutoNumeric.options.currencySymbol.pound },
                           { currencySymbol:  AutoNumeric.options.currencySymbol.franc });
            expect(aNInput.getFormatted()).toEqual('2.172.834,23₣');

            // Objects completing themselves
            aNInput.update(AutoNumeric.getPredefinedOptions().NorthAmerican,
                           {
                               currencySymbol     : AutoNumeric.options.currencySymbol.currencySign,
                               digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.apostrophe,
                           },
                           {
                               decimalCharacter       : AutoNumeric.options.decimalCharacter.decimalSeparatorKeySymbol,
                               currencySymbolPlacement: AutoNumeric.options.currencySymbolPlacement.suffix,
                           });
            expect(aNInput.getFormatted()).toEqual("2'172'834⎖23¤");
        });
    });

    describe('`selectDecimal`', () => {
        let aNInput;
        let newInput;

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
            aNInput = new AutoNumeric(newInput).french(); // Initiate the autoNumeric input
        });

        afterEach(() => { // Un-initialization
            aNInput.remove();
            document.body.removeChild(newInput);
        });

        it('should select only the decimal part', () => {
            expect(aNInput.getNumericString()).toEqual('');
            aNInput.set(2172834.234);
            expect(aNInput.getNumericString()).toEqual('2172834.23');
            expect(aNInput.getNumber()).toEqual(2172834.23);
            expect(aNInput.getFormatted()).toEqual('2.172.834,23\u202f€');

            aNInput.select();
            expect(aNInput.node().selectionStart).toEqual(0);
            expect(aNInput.node().selectionEnd).toEqual(12);

            aNInput.options.selectNumberOnly(AutoNumeric.options.selectNumberOnly.selectAll);
            aNInput.select();
            expect(aNInput.node().selectionStart).toEqual(0);
            expect(aNInput.node().selectionEnd).toEqual(14);

            aNInput.selectDecimal();
            expect(aNInput.node().selectionStart).toEqual(10);
            expect(aNInput.node().selectionEnd).toEqual(12);

            // Bigger number of decimals
            aNInput.set(12266.1234567, { minimumValue: '0', maximumValue: '9999999', decimalPlaces: 7 });
            expect(aNInput.getFormatted()).toEqual('12.266,1234567\u202f€');
            aNInput.selectDecimal();
            expect(aNInput.node().selectionStart).toEqual(7);
            expect(aNInput.node().selectionEnd).toEqual(14);

            // No decimal part
            aNInput.set(12266, { minimumValue: '0', maximumValue: '9999999', decimalPlaces: 0 });
            expect(aNInput.getFormatted()).toEqual('12.266\u202f€');
            aNInput.selectDecimal();
            expect(aNInput.node().selectionStart).toEqual(0);
            expect(aNInput.node().selectionEnd).toEqual(0);

            // Decimal places shown on focus //FIXME Move this test to the end-to-end tests
            /*aNInput.set(12266.1234567, { minimumValue: '0', maximumValue: '9999999.9999999', decimalPlaces: 3, decimalPlacesShownOnFocus: 6 });
            expect(aNInput.getFormatted()).toEqual('12.266,123\u202f€');
            aNInput.selectDecimal();
            expect(aNInput.node().selectionStart).toEqual(7);
            expect(aNInput.node().selectionEnd).toEqual(10);
            aNInput.node().focus();
            expect(aNInput.getFormatted()).toEqual('12.266,123456\u202f€'); //FIXME à terminer
            // aNInput.node().select();
            aNInput.selectDecimal();
            expect(aNInput.node().selectionStart).toEqual(7);
            expect(aNInput.node().selectionEnd).toEqual(13); //FIXME à terminer*/
        });
    });

    describe('`selectInteger`', () => {
        let aNInput;
        let newInput;

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
            aNInput = new AutoNumeric(newInput).french(); // Initiate the autoNumeric input
        });

        afterEach(() => { // Un-initialization
            aNInput.remove();
            document.body.removeChild(newInput);
        });

        it('should select only the decimal part', () => {
            expect(aNInput.getNumericString()).toEqual('');
            aNInput.set(2172834.234);
            expect(aNInput.getNumericString()).toEqual('2172834.23');
            expect(aNInput.getNumber()).toEqual(2172834.23);
            expect(aNInput.getFormatted()).toEqual('2.172.834,23\u202f€');

            aNInput.select();
            expect(aNInput.node().selectionStart).toEqual(0);
            expect(aNInput.node().selectionEnd).toEqual(12);

            aNInput.options.selectNumberOnly(AutoNumeric.options.selectNumberOnly.selectAll);
            aNInput.select();
            expect(aNInput.node().selectionStart).toEqual(0);
            expect(aNInput.node().selectionEnd).toEqual(14);

            aNInput.selectInteger();
            expect(aNInput.node().selectionStart).toEqual(0);
            expect(aNInput.node().selectionEnd).toEqual(9);

            // Changing the number of integer places
            aNInput.set(12266.1);
            expect(aNInput.getFormatted()).toEqual('12.266,10\u202f€');
            aNInput.selectInteger();
            expect(aNInput.node().selectionStart).toEqual(0);
            expect(aNInput.node().selectionEnd).toEqual(6);
            aNInput.set(352.1);
            expect(aNInput.getFormatted()).toEqual('352,10\u202f€');
            aNInput.selectInteger();
            expect(aNInput.node().selectionStart).toEqual(0);
            expect(aNInput.node().selectionEnd).toEqual(3);

            // A small integer part
            aNInput.set(0.234, { minimumValue: '0', maximumValue: '9999999', decimalPlaces: 3 });
            expect(aNInput.getFormatted()).toEqual('0,234\u202f€');
            aNInput.selectInteger();
            expect(aNInput.node().selectionStart).toEqual(0);
            expect(aNInput.node().selectionEnd).toEqual(1);

            // Decimal places shown on focus
            aNInput.set(12266.1234567, { minimumValue: '0', maximumValue: '9999999', decimalPlaces: 3, decimalPlacesShownOnFocus: 6 });
            expect(aNInput.getSettings().decimalPlacesRawValue).toEqual('6');
            expect(aNInput.getSettings().decimalPlacesShownOnFocus).toEqual('6');
            expect(aNInput.getSettings().decimalPlacesShownOnBlur).toEqual('3');
            expect(aNInput.getFormatted()).toEqual('12.266,123\u202f€');
            aNInput.selectDecimal();
            expect(aNInput.node().selectionStart).toEqual(7);
            expect(aNInput.node().selectionEnd).toEqual(10);

            aNInput.node().focus();
            expect(aNInput.getFormatted()).toEqual('12.266,123457\u202f€');
            aNInput.selectDecimal();
            expect(aNInput.node().selectionStart).toEqual(7);
            expect(aNInput.node().selectionEnd).toEqual(13);

            aNInput.selectInteger();
            expect(aNInput.node().selectionStart).toEqual(0);
            expect(aNInput.node().selectionEnd).toEqual(6);

            //TODO Test the decimalPlacesShownOnBlur with the selections

            // Common configuration
            aNInput.update({ suffixText: 'suffixText', minimumValue: '-9999999', maximumValue: '9999999', decimalPlaces: 2 });

            // Test each possible combination

            // -1.234,57suffixText
            aNInput.set(1234.57, { negativePositiveSignPlacement: null, currencySymbol: '', showPositiveSign: false });
            expect(aNInput.getFormatted()).toEqual('1.234,57suffixText');
            aNInput.selectInteger();
            expect(aNInput.node().selectionStart).toEqual(0);
            expect(aNInput.node().selectionEnd).toEqual(5);

            aNInput.update({ showPositiveSign: true, negativePositiveSignPlacement: AutoNumeric.options.negativePositiveSignPlacement.prefix });
            expect(aNInput.getFormatted()).toEqual('+1.234,57suffixText');
            aNInput.selectInteger();
            expect(aNInput.node().selectionStart).toEqual(1);
            expect(aNInput.node().selectionEnd).toEqual(6);

            expect(aNInput.set(-1234.57).getFormatted()).toEqual('-1.234,57suffixText');
            aNInput.selectInteger();
            expect(aNInput.node().selectionStart).toEqual(0);
            expect(aNInput.node().selectionEnd).toEqual(6);

            // € +1.234,57suffixText
            aNInput.set(1234.57).update({ currencySymbol: '€ ', currencySymbolPlacement: AutoNumeric.options.currencySymbolPlacement.prefix, showPositiveSign: true, negativePositiveSignPlacement: AutoNumeric.options.negativePositiveSignPlacement.right });
            expect(aNInput.getFormatted()).toEqual('€ +1.234,57suffixText');
            aNInput.selectInteger();
            expect(aNInput.node().selectionStart).toEqual(3);
            expect(aNInput.node().selectionEnd).toEqual(8);

            aNInput.update({ showPositiveSign: false });
            expect(aNInput.getFormatted()).toEqual('€ 1.234,57suffixText');
            aNInput.selectInteger();
            expect(aNInput.node().selectionStart).toEqual(2);
            expect(aNInput.node().selectionEnd).toEqual(7);

            expect(aNInput.set(-1234.57).getFormatted()).toEqual('€ -1.234,57suffixText');
            aNInput.selectInteger();
            expect(aNInput.node().selectionStart).toEqual(2);
            expect(aNInput.node().selectionEnd).toEqual(8);

            // +€ 1.234,57suffixText
            aNInput.set(1234.57).update({ showPositiveSign: true, negativePositiveSignPlacement: AutoNumeric.options.negativePositiveSignPlacement.left });
            expect(aNInput.getFormatted()).toEqual('+€ 1.234,57suffixText');
            aNInput.selectInteger();
            expect(aNInput.node().selectionStart).toEqual(3);
            expect(aNInput.node().selectionEnd).toEqual(8);

            aNInput.update({ showPositiveSign: false });
            expect(aNInput.getFormatted()).toEqual('€ 1.234,57suffixText');
            aNInput.selectInteger();
            expect(aNInput.node().selectionStart).toEqual(2);
            expect(aNInput.node().selectionEnd).toEqual(7);

            expect(aNInput.set(-1234.57).getFormatted()).toEqual('-€ 1.234,57suffixText'); // Selecting the integer part here is problematic, due to the currency sign
            aNInput.selectInteger();
            expect(aNInput.node().selectionStart).toEqual(3);
            expect(aNInput.node().selectionEnd).toEqual(8);

            // 1.234,57+ €suffixText
            aNInput.set(1234.57).update({ showPositiveSign: true, negativePositiveSignPlacement: AutoNumeric.options.negativePositiveSignPlacement.left, currencySymbolPlacement: AutoNumeric.options.currencySymbolPlacement.suffix, currencySymbol: ' €' });
            expect(aNInput.getFormatted()).toEqual('1.234,57+ €suffixText');
            aNInput.selectInteger();
            expect(aNInput.node().selectionStart).toEqual(0);
            expect(aNInput.node().selectionEnd).toEqual(5);

            aNInput.update({ showPositiveSign: false });
            expect(aNInput.getFormatted()).toEqual('1.234,57 €suffixText');
            aNInput.selectInteger();
            expect(aNInput.node().selectionStart).toEqual(0);
            expect(aNInput.node().selectionEnd).toEqual(5);

            expect(aNInput.set(-1234.57).getFormatted()).toEqual('1.234,57- €suffixText'); // Selecting the integer part here is problematic, due to the currency sign
            aNInput.selectInteger();
            expect(aNInput.node().selectionStart).toEqual(0);
            expect(aNInput.node().selectionEnd).toEqual(5);

            // 1.234,57 €+suffixText
            aNInput.set(1234.57).update({ showPositiveSign: true, negativePositiveSignPlacement: AutoNumeric.options.negativePositiveSignPlacement.right });
            expect(aNInput.getFormatted()).toEqual('1.234,57 €+suffixText');
            aNInput.selectInteger();
            expect(aNInput.node().selectionStart).toEqual(0);
            expect(aNInput.node().selectionEnd).toEqual(5);

            aNInput.update({ showPositiveSign: false });
            expect(aNInput.getFormatted()).toEqual('1.234,57 €suffixText');
            aNInput.selectInteger();
            expect(aNInput.node().selectionStart).toEqual(0);
            expect(aNInput.node().selectionEnd).toEqual(5);

            expect(aNInput.set(-1234.57).getFormatted()).toEqual('1.234,57 €-suffixText'); // Selecting the integer part here is problematic, due to the currency sign
            aNInput.selectInteger();
            expect(aNInput.node().selectionStart).toEqual(0);
            expect(aNInput.node().selectionEnd).toEqual(5);

            // +1.234,57 €suffixText
            aNInput.set(1234.57).update({ showPositiveSign: true, negativePositiveSignPlacement: AutoNumeric.options.negativePositiveSignPlacement.prefix });
            expect(aNInput.getFormatted()).toEqual('+1.234,57 €suffixText');
            aNInput.selectInteger();
            expect(aNInput.node().selectionStart).toEqual(1);
            expect(aNInput.node().selectionEnd).toEqual(6);

            aNInput.update({ showPositiveSign: false });
            expect(aNInput.getFormatted()).toEqual('1.234,57 €suffixText');
            aNInput.selectInteger();
            expect(aNInput.node().selectionStart).toEqual(0);
            expect(aNInput.node().selectionEnd).toEqual(5);

            expect(aNInput.set(-1234.57).getFormatted()).toEqual('-1.234,57 €suffixText'); // Selecting the integer part here is problematic, due to the currency sign
            aNInput.selectInteger();
            expect(aNInput.node().selectionStart).toEqual(0);
            expect(aNInput.node().selectionEnd).toEqual(6);
        });
    });

    describe('`reformat`, `unformat` and `unformatLocalized` methods', () => {
        let aNInput;
        let newInput;

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            document.body.appendChild(newInput);
            aNInput = new AutoNumeric(newInput).french(); // Initiate the autoNumeric input
        });

        afterEach(() => { // Un-initialization
            aNInput.remove();
            document.body.removeChild(newInput);
        });

        it('should `unformat` the element value, then `reformat` it correctly', () => {
            aNInput.set(1234567.89);
            expect(aNInput.getFormatted()).toEqual('1.234.567,89\u202f€');
            expect(aNInput.unformat().getFormatted()).toEqual('1234567.89');
            expect(aNInput.reformat().getFormatted()).toEqual('1.234.567,89\u202f€');
            /* eslint newline-per-chained-call: 0 */
            expect(aNInput.northAmerican().getFormatted()).toEqual('$1,234,567.89');
            expect(aNInput.unformat().getFormatted()).toEqual('1234567.89');
        });

        it('should `unformatLocalized` the element value, then `reformat` it correctly', () => {
            aNInput.set(-1234567.89, { outputFormat: AutoNumeric.options.outputFormat.commaNegative });
            expect(aNInput.getFormatted()).toEqual('-1.234.567,89\u202f€');
            expect(aNInput.unformatLocalized().getFormatted()).toEqual('1234567,89-');
            expect(aNInput.reformat().getFormatted()).toEqual('-1.234.567,89\u202f€');
            /* eslint newline-per-chained-call: 0 */
            expect(aNInput.northAmerican().getFormatted()).toEqual('$-1,234,567.89');
            expect(aNInput.unformatLocalized().getFormatted()).toEqual('1234567,89-');
            expect(aNInput.unformatLocalized(AutoNumeric.options.outputFormat.number).getFormatted()).toEqual('-1234567.89');
            expect(aNInput.unformatLocalized().getFormatted()).toEqual('1234567,89-');
            expect(aNInput.reformat().getFormatted()).toEqual('$-1,234,567.89');
        });
    });

    describe(`'form*' methods`, () => {
        let form;
        let input1;
        let input2;
        let input3;
        let input4;
        let input5;
        let input6;
        let input7;
        let anInput1;
        let anInput2;
        let anInput3;
        let anInput6;

        beforeEach(() => { // Initialization
            form   = document.createElement('form');
            input1 = document.createElement('input');
            input2 = document.createElement('input');
            input3 = document.createElement('input');
            input4 = document.createElement('input');
            input5 = document.createElement('input');
            input6 = document.createElement('input');
            input7 = document.createElement('input');

            document.body.appendChild(form);
            form.appendChild(input1);
            form.appendChild(input2);
            form.appendChild(input3);
            form.appendChild(input4);
            form.appendChild(input5);
            form.appendChild(input6);
            form.appendChild(input7);

            input1.name = 'aa';
            input2.name = 'bb';
            input3.name = 'cc';
            input4.name = 'ab';
            input5.name = 'bc';
            input6.name = 'empty';
            input7.name = 'zero';

            input1.value = '1111.11';
            expect(input1.value).toEqual('1111.11');
            input2.value = '-2222.22';
            input3.value = '3333.33';
            input4.value = 'not autoNumeric test';
            expect(input4.value).toEqual('not autoNumeric test');
            input5.value = 'not autoNumeric $1,234.567';
            expect(input5.value).toEqual('not autoNumeric $1,234.567');
            expect(input6.value).toEqual('');
            input7.value = 0;
            expect(input7.value).toEqual('0');

            // Initiate only 3 autoNumeric inputs
            const anOptions = { digitGroupSeparator: '.', decimalCharacter: ',', currencySymbol: '€ ' };
            anInput1 = new AutoNumeric(input1, anOptions);
            anInput2 = new AutoNumeric(input2, anOptions);
            anInput3 = new AutoNumeric(input3, anOptions);
            anInput6 = new AutoNumeric(input6, anOptions); // Check that an AutoNumeric-managed input does not show a `0` when the input is empty

            expect(input1.value).toEqual('€ 1.111,11');
            expect(anInput1.getFormatted()).toEqual('€ 1.111,11');
            anInput1.update(anOptions);
            expect(anInput1.getFormatted()).toEqual('€ 1.111,11');
        });

        afterEach(() => { // Un-initialization
            anInput1.remove();
            anInput2.remove();
            anInput3.remove();
            anInput6.remove();
            form.removeChild(input1);
            form.removeChild(input2);
            form.removeChild(input3);
            form.removeChild(input4);
            form.removeChild(input5);
            form.removeChild(input6);
            form.removeChild(input7);
            document.body.removeChild(form);
        });

        it(`'formNumericString()' should return the correct string, with unformatted values`, () => {
            expect(anInput1.formNumericString()).toEqual('aa=1111.11&bb=-2222.22&cc=3333.33&ab=not+autoNumeric+test&bc=not+autoNumeric+%241%2C234.567&empty=&zero=0');
            anInput1.update({ serializeSpaces: '%20' });
            expect(anInput1.formNumericString()).toEqual('aa=1111.11&bb=-2222.22&cc=3333.33&ab=not%20autoNumeric%20test&bc=not%20autoNumeric%20%241%2C234.567&empty=&zero=0');
        });

        it(`'formFormatted()' should return the correct string, with formatted values`, () => {
            expect(anInput1.formFormatted()).toEqual('aa=%E2%82%AC+1.111%2C11&bb=-%E2%82%AC+2.222%2C22&cc=%E2%82%AC+3.333%2C33&ab=not+autoNumeric+test&bc=not+autoNumeric+%241%2C234.567&empty=&zero=0');
            anInput1.update({ serializeSpaces: '%20' });
            expect(anInput1.formFormatted()).toEqual('aa=%E2%82%AC%201.111%2C11&bb=-%E2%82%AC%202.222%2C22&cc=%E2%82%AC%203.333%2C33&ab=not%20autoNumeric%20test&bc=not%20autoNumeric%20%241%2C234.567&empty=&zero=0');
        });

        it(`'formLocalized()' should return the correct string, with formatted values`, () => {
            anInput1.update({ outputFormat: null });
            expect(anInput1.formLocalized()).toEqual('aa=1111.11&bb=-2222.22&cc=3333.33&ab=not+autoNumeric+test&bc=not+autoNumeric+%241%2C234.567&empty=&zero=0');
            anInput1.update({ outputFormat: 'string' });
            expect(anInput1.formLocalized()).toEqual('aa=1111.11&bb=-2222.22&cc=3333.33&ab=not+autoNumeric+test&bc=not+autoNumeric+%241%2C234.567&empty=&zero=0');
            anInput1.update({ outputFormat: 'number' });
            expect(anInput1.formLocalized()).toEqual('aa=1111.11&bb=-2222.22&cc=3333.33&ab=not+autoNumeric+test&bc=not+autoNumeric+%241%2C234.567&empty=&zero=0');
            expect(anInput1.formLocalized(',-')).toEqual('aa=1111%2C11&bb=2222%2C22-&cc=3333%2C33&ab=not+autoNumeric+test&bc=not+autoNumeric+%241%2C234.567&empty=&zero=0');
            expect(anInput1.formLocalized()).toEqual('aa=1111.11&bb=-2222.22&cc=3333.33&ab=not+autoNumeric+test&bc=not+autoNumeric+%241%2C234.567&empty=&zero=0');
            anInput1.update({ outputFormat: ',-' });
            expect(anInput1.formLocalized()).toEqual('aa=1111%2C11&bb=2222%2C22-&cc=3333%2C33&ab=not+autoNumeric+test&bc=not+autoNumeric+%241%2C234.567&empty=&zero=0');
            anInput1.update({ outputFormat: '.-' });
            expect(anInput1.formLocalized()).toEqual('aa=1111.11&bb=2222.22-&cc=3333.33&ab=not+autoNumeric+test&bc=not+autoNumeric+%241%2C234.567&empty=&zero=0');
            anInput1.update({ outputFormat: '-,' });
            expect(anInput1.formLocalized()).toEqual('aa=1111%2C11&bb=-2222%2C22&cc=3333%2C33&ab=not+autoNumeric+test&bc=not+autoNumeric+%241%2C234.567&empty=&zero=0');
            anInput1.update({ outputFormat: '-.' });
            expect(anInput1.formLocalized()).toEqual('aa=1111.11&bb=-2222.22&cc=3333.33&ab=not+autoNumeric+test&bc=not+autoNumeric+%241%2C234.567&empty=&zero=0');
        });

        it(`'formArrayNumericString()' should return the correct array`, () => {
            const arrayResult = [
                {
                    name : 'aa',
                    value: '1111.11',
                },
                {
                    name : 'bb',
                    value: '-2222.22',
                },
                {
                    name : 'cc',
                    value: '3333.33',
                },
                {
                    name : 'ab',
                    value: 'not autoNumeric test',
                },
                {
                    name : 'bc',
                    value: 'not autoNumeric $1,234.567',
                },
                {
                    name : 'empty',
                    value: '',
                },
                {
                    name : 'zero',
                    value: '0',
                },
            ];
            expect(anInput1.formArrayNumericString()).toEqual(arrayResult);
        });

        it(`'formArrayFormatted()' should return the correct array`, () => {
            const arrayResult = [
                {
                    name : 'aa',
                    value: '€ 1.111,11',
                },
                {
                    name : 'bb',
                    value: '-€ 2.222,22',
                },
                {
                    name : 'cc',
                    value: '€ 3.333,33',
                },
                {
                    name : 'ab',
                    value: 'not autoNumeric test',
                },
                {
                    name : 'bc',
                    value: 'not autoNumeric $1,234.567',
                },
                {
                    name : 'empty',
                    value: '',
                },
                {
                    name : 'zero',
                    value: '0',
                },
            ];
            expect(anInput1.formArrayFormatted()).toEqual(arrayResult);
        });

        it(`'formArrayLocalized()' should return the correct array`, () => {
            const arrayResult1 = [
                {
                    name : 'aa',
                    value: '1111.11',
                },
                {
                    name : 'bb',
                    value: '-2222.22',
                },
                {
                    name : 'cc',
                    value: '3333.33',
                },
                {
                    name : 'ab',
                    value: 'not autoNumeric test',
                },
                {
                    name : 'bc',
                    value: 'not autoNumeric $1,234.567',
                },
                {
                    name : 'empty',
                    value: '',
                },
                {
                    name : 'zero',
                    value: '0',
                },
            ];
            expect(anInput1.formArrayLocalized()).toEqual(arrayResult1);
            const arrayResult2 = [
                {
                    name : 'aa',
                    value: '1111,11',
                },
                {
                    name : 'bb',
                    value: '2222,22-',
                },
                {
                    name : 'cc',
                    value: '3333,33',
                },
                {
                    name : 'ab',
                    value: 'not autoNumeric test',
                },
                {
                    name : 'bc',
                    value: 'not autoNumeric $1,234.567',
                },
                {
                    name : 'empty',
                    value: '',
                },
                {
                    name : 'zero',
                    value: '0',
                },
            ];
            expect(anInput1.formArrayLocalized(',-')).toEqual(arrayResult2);
            anInput1.update({ outputFormat: ',-' });
            expect(anInput1.formArrayLocalized()).toEqual(arrayResult2);
        });

        it(`'formJsonNumericString()' should return the correct JSON object`, () => {
            const jsonResult = JSON.stringify([
                {
                    name : 'aa',
                    value: '1111.11',
                },
                {
                    name : 'bb',
                    value: '-2222.22',
                },
                {
                    name : 'cc',
                    value: '3333.33',
                },
                {
                    name : 'ab',
                    value: 'not autoNumeric test',
                },
                {
                    name : 'bc',
                    value: 'not autoNumeric $1,234.567',
                },
                {
                    name : 'empty',
                    value: '',
                },
                {
                    name : 'zero',
                    value: '0',
                },
            ]);
            expect(anInput1.formJsonNumericString()).toEqual(jsonResult);
        });

        it(`'formJsonFormatted()' should return the correct JSON object`, () => {
            const jsonResult = JSON.stringify([
                {
                    name : 'aa',
                    value: '€ 1.111,11',
                },
                {
                    name : 'bb',
                    value: '-€ 2.222,22',
                },
                {
                    name : 'cc',
                    value: '€ 3.333,33',
                },
                {
                    name : 'ab',
                    value: 'not autoNumeric test',
                },
                {
                    name : 'bc',
                    value: 'not autoNumeric $1,234.567',
                },
                {
                    name : 'empty',
                    value: '',
                },
                {
                    name : 'zero',
                    value: '0',
                },
            ]);
            expect(anInput1.formJsonFormatted()).toEqual(jsonResult);
        });

        it(`'formJsonLocalized()' should return the correct JSON object`, () => {
            const jsonResult1 = JSON.stringify([
                {
                    name : 'aa',
                    value: '1111.11',
                },
                {
                    name : 'bb',
                    value: '-2222.22',
                },
                {
                    name : 'cc',
                    value: '3333.33',
                },
                {
                    name : 'ab',
                    value: 'not autoNumeric test',
                },
                {
                    name : 'bc',
                    value: 'not autoNumeric $1,234.567',
                },
                {
                    name : 'empty',
                    value: '',
                },
                {
                    name : 'zero',
                    value: '0',
                },
            ]);
            expect(anInput1.formJsonLocalized()).toEqual(jsonResult1);
            const jsonResult2 = JSON.stringify([
                {
                    name : 'aa',
                    value: '1111,11',
                },
                {
                    name : 'bb',
                    value: '2222,22-',
                },
                {
                    name : 'cc',
                    value: '3333,33',
                },
                {
                    name : 'ab',
                    value: 'not autoNumeric test',
                },
                {
                    name : 'bc',
                    value: 'not autoNumeric $1,234.567',
                },
                {
                    name : 'empty',
                    value: '',
                },
                {
                    name : 'zero',
                    value: '0',
                },
            ]);
            expect(anInput1.formJsonLocalized(',-')).toEqual(jsonResult2);
            anInput1.update({ outputFormat: ',-' });
            expect(anInput1.formJsonLocalized()).toEqual(jsonResult2);
        });

        it(`should modify the parent form reference if it's changed and \`form()\` is 'forced'`, () => {
            // Get the initial parent form element reference
            const initialForm = anInput1.form();
            initialForm.id = 'initialForm';

            // Modify the parent form
            const secondForm = document.createElement('form');
            secondForm.id = 'secondForm';
            document.body.appendChild(secondForm);
            secondForm.appendChild(input1);

            // Get the parent form reference
            const sameInitialParentForm = anInput1.form();
            expect(initialForm.id).toEqual(sameInitialParentForm.id);
            const newParentForm = anInput1.form(true);
            expect(initialForm.id).not.toEqual(newParentForm.id);
            expect(newParentForm.id).toEqual(secondForm.id);

            // Un-initialize the form element
            form.appendChild(input1);
            document.body.removeChild(secondForm);
        });

        it(`should only add a single 'submit' and 'reset' event listener handler name, and remove it when all the AutoNumeric element are removed`, () => {
            // Get the initial parent form element reference
            const initialForm = anInput1.form();
            const formHandlerName = initialForm.dataset.anFormHandler;
            expect(Number(initialForm.dataset.anCount)).toEqual(4);

            anInput1.wipe();
            expect(Number(initialForm.dataset.anCount)).toEqual(3);
            expect(initialForm.dataset.anFormHandler).toEqual(formHandlerName);
            anInput2.wipe();
            expect(Number(initialForm.dataset.anCount)).toEqual(2);
            expect(initialForm.dataset.anFormHandler).toEqual(formHandlerName);

            anInput2 = new AutoNumeric(input2);
            expect(Number(initialForm.dataset.anCount)).toEqual(3);
            expect(initialForm.dataset.anFormHandler).toEqual(formHandlerName);
            anInput2.wipe();
            expect(Number(initialForm.dataset.anCount)).toEqual(2);
            expect(initialForm.dataset.anFormHandler).toEqual(formHandlerName);
            anInput6.wipe();
            expect(Number(initialForm.dataset.anCount)).toEqual(1);
            expect(initialForm.dataset.anFormHandler).toEqual(formHandlerName);
            expect(window.aNFormHandlerMap.has(formHandlerName)).toEqual(true);

            // Remove the very last from child AutoNumeric element
            anInput3.wipe();
            expect(initialForm.dataset.anCount).toBeUndefined();
            expect(initialForm.dataset.anFormHandler).toBeUndefined();

            // Also check that the name does not exist as key in the global map window.aNFormHandlerMap
            expect(window.aNFormHandlerMap.has(formHandlerName)).toEqual(false);

            // Reinitialize the AutoNumeric object for the `afterEach` un-initialization step
            anInput1 = new AutoNumeric(input1);
            anInput2 = new AutoNumeric(input2);
            anInput3 = new AutoNumeric(input3);
            anInput6 = new AutoNumeric(input6);
        });

        //FIXME Add the tests for : formUnformat, formReformat, formSubmit*
    });

    //TODO Complete the tests in order to test every single method separately:
    /*
     isPristine
     select
     selectNumber
     selectInteger
     selectDecimal
     clear

     remove
     wipe
     nuke

     node
     parent
     detach
     attach

     formatOther
     unformatOther

     init
     */
});

describe('`global.*` functions', () => {
    describe('provides public methods (size, set, setUnformatted, update, reformat, unformat, unformatLocalized, isPristine, get, getNumericString, getFormatted, getNumber, getLocalized, clear, remove, wipe, has, addObject, removeObject, empty, elements and getList) for modifying multiple AutoNumeric objects sharing the same local list at once', () => {
        let newInput1;
        let newInput2;
        let newInput3;
        let newInput4;
        let newInput5;
        const options = { currencySymbol: ' €', currencySymbolPlacement: 's', decimalCharacter: ',', digitGroupSeparator: ' ', outputFormat: ',-' };

        beforeEach(() => { // Initialization
            newInput1 = document.createElement('input');
            newInput2 = document.createElement('input');
            newInput3 = document.createElement('input');
            newInput4 = document.createElement('input');
            newInput5 = document.createElement('input');
            document.body.appendChild(newInput1);
            document.body.appendChild(newInput2);
            document.body.appendChild(newInput3);
            document.body.appendChild(newInput4);
            document.body.appendChild(newInput5);
            newInput1.name = 'nameInput1';
            newInput2.name = 'nameInput2';
            newInput3.name = 'nameInput3';
            newInput4.name = 'nameInput4';
            newInput5.name = 'nameInput5';
        });

        afterEach(() => { // Un-initialization
            document.body.removeChild(newInput1);
            document.body.removeChild(newInput2);
            document.body.removeChild(newInput3);
            document.body.removeChild(newInput4);
            document.body.removeChild(newInput5);
        });

        it('should initialize multiple DOM elements stored in an Array, from an existing AutoNumeric object', () => {
            const anElement1 = new AutoNumeric(newInput1, options);
            const newAnElements = anElement1.init([newInput2, newInput3, newInput4, newInput5]);
            const [anElement2, anElement3, anElement4, anElement5] = newAnElements;

            expect(anElement1.set(22).getFormatted()).toEqual('22,00 €');
            expect(anElement2.set(13568.243).getFormatted()).toEqual('13 568,24 €');
            expect(anElement3.set(187568.243).getFormatted()).toEqual('187 568,24 €');
            expect(anElement4.set(21613568.243).getFormatted()).toEqual('21 613 568,24 €');
            expect(anElement5.set(1028.005).getFormatted()).toEqual('1 028,01 €');
            expect(anElement4.global.size()).toEqual(5);

            // Then test that those elements share the same local list
            anElement2.global.set(1223355.66);
            expect(anElement1.getFormatted()).toEqual('1 223 355,66 €');
            expect(anElement2.getFormatted()).toEqual('1 223 355,66 €');
            expect(anElement3.getFormatted()).toEqual('1 223 355,66 €');
            expect(anElement4.getFormatted()).toEqual('1 223 355,66 €');
            expect(anElement5.getFormatted()).toEqual('1 223 355,66 €');

            // ...and that removing one from the list is taken into account
            anElement3.global.removeObject(newInput3);
            expect(anElement4.global.size()).toEqual(4);
            anElement2.global.set(42);
            expect(anElement1.getFormatted()).toEqual('42,00 €');
            expect(anElement2.getFormatted()).toEqual('42,00 €');
            expect(anElement3.getFormatted()).toEqual('1 223 355,66 €');
            expect(anElement4.getFormatted()).toEqual('42,00 €');
            expect(anElement5.getFormatted()).toEqual('42,00 €');
        });

        it('should initialize multiple DOM elements selected with a CSS selector, from an existing AutoNumeric object', () => {
            const anElement1 = new AutoNumeric(newInput1, options);
            newInput2.classList.add('testingCSSSelector');
            newInput3.classList.add('testingCSSSelector');
            newInput4.classList.add('testingCSSSelector');
            newInput5.classList.add('testingCSSSelector');
            const newAnElements = anElement1.init('.testingCSSSelector');
            const [anElement2, anElement3, anElement4, anElement5] = newAnElements;

            expect(anElement1.set(22).getFormatted()).toEqual('22,00 €');
            expect(anElement2.set(13568.243).getFormatted()).toEqual('13 568,24 €');
            expect(anElement3.set(187568.243).getFormatted()).toEqual('187 568,24 €');
            expect(anElement4.set(21613568.243).getFormatted()).toEqual('21 613 568,24 €');
            expect(anElement5.set(1028.005).getFormatted()).toEqual('1 028,01 €');
            expect(anElement4.global.size()).toEqual(5);

            // Then test that those elements share the same local list
            anElement2.global.set(1223355.66);
            expect(anElement1.getFormatted()).toEqual('1 223 355,66 €');
            expect(anElement2.getFormatted()).toEqual('1 223 355,66 €');
            expect(anElement3.getFormatted()).toEqual('1 223 355,66 €');
            expect(anElement4.getFormatted()).toEqual('1 223 355,66 €');
            expect(anElement5.getFormatted()).toEqual('1 223 355,66 €');

            // ...and that removing one from the list is taken into account
            anElement3.global.removeObject(newInput3);
            expect(anElement4.global.size()).toEqual(4);
            anElement2.global.set(42);
            expect(anElement1.getFormatted()).toEqual('42,00 €');
            expect(anElement2.getFormatted()).toEqual('42,00 €');
            expect(anElement3.getFormatted()).toEqual('1 223 355,66 €');
            expect(anElement4.getFormatted()).toEqual('42,00 €');
            expect(anElement5.getFormatted()).toEqual('42,00 €');
        });

        it('should initialize other DOM element from an existing AutoNumeric object, and `set` the values globally across those elements', () => {
            const anElement1 = new AutoNumeric(newInput1, options);
            const anElement2 = anElement1.init(newInput2);
            const anElement3 = anElement1.init(newInput3);
            const anElement4 = anElement2.init(newInput4);
            const anElement5 = anElement2.init(newInput5);

            expect(anElement1.set(22).getFormatted()).toEqual('22,00 €');
            expect(anElement2.set(13568.243).getFormatted()).toEqual('13 568,24 €');
            expect(anElement3.set(187568.243).getFormatted()).toEqual('187 568,24 €');
            expect(anElement4.set(21613568.243).getFormatted()).toEqual('21 613 568,24 €');
            expect(anElement5.set(1028.005).getFormatted()).toEqual('1 028,01 €');
            expect(anElement4.global.size()).toEqual(5);

            // Then test that those elements share the same local list
            anElement2.global.set(1223355.66);
            expect(anElement1.getFormatted()).toEqual('1 223 355,66 €');
            expect(anElement2.getFormatted()).toEqual('1 223 355,66 €');
            expect(anElement3.getFormatted()).toEqual('1 223 355,66 €');
            expect(anElement4.getFormatted()).toEqual('1 223 355,66 €');
            expect(anElement5.getFormatted()).toEqual('1 223 355,66 €');

            // ...and that removing one from the list is taken into account
            anElement3.global.removeObject(newInput3);
            expect(anElement4.global.size()).toEqual(4);
            anElement2.global.set(42);
            expect(anElement1.getFormatted()).toEqual('42,00 €');
            expect(anElement2.getFormatted()).toEqual('42,00 €');
            expect(anElement3.getFormatted()).toEqual('1 223 355,66 €');
            expect(anElement4.getFormatted()).toEqual('42,00 €');
            expect(anElement5.getFormatted()).toEqual('42,00 €');
        });

        it('should update the settings globally', () => {
            const anElement1 = new AutoNumeric(newInput1, options);
            const anElement2 = anElement1.init(newInput2);
            const anElement3 = anElement1.init(newInput3);
            const anElement4 = anElement2.init(newInput4);
            const anElement5 = anElement2.init(newInput5);

            expect(anElement1.set(22).getFormatted()).toEqual('22,00 €');
            expect(anElement2.set(13568.243).getFormatted()).toEqual('13 568,24 €');
            expect(anElement3.set(187568.243).getFormatted()).toEqual('187 568,24 €');
            expect(anElement4.set(21613568.243).getFormatted()).toEqual('21 613 568,24 €');
            expect(anElement5.set(1028.005).getFormatted()).toEqual('1 028,01 €');
            expect(anElement4.global.size()).toEqual(5);

            // Then test that those elements share the same local list
            anElement2.global.set(1223355.66);
            expect(anElement1.getFormatted()).toEqual('1 223 355,66 €');
            expect(anElement2.getFormatted()).toEqual('1 223 355,66 €');
            expect(anElement3.getFormatted()).toEqual('1 223 355,66 €');
            expect(anElement4.getFormatted()).toEqual('1 223 355,66 €');
            expect(anElement5.getFormatted()).toEqual('1 223 355,66 €');

            // Update the elements with one option object
            anElement3.global.update({ currencySymbol: AutoNumeric.options.currencySymbol.franc });
            expect(anElement1.getFormatted()).toEqual('1 223 355,66₣');
            expect(anElement2.getFormatted()).toEqual('1 223 355,66₣');
            expect(anElement3.getFormatted()).toEqual('1 223 355,66₣');
            expect(anElement4.getFormatted()).toEqual('1 223 355,66₣');
            expect(anElement5.getFormatted()).toEqual('1 223 355,66₣');

            // Update the elements with multiple option objects
            anElement3.global.update({ currencySymbol: AutoNumeric.options.currencySymbol.pound },
                                     {
                                         currencySymbol: AutoNumeric.options.currencySymbol.dollar,
                                         digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.apostrophe,
                                     },
            );
            expect(anElement1.getFormatted()).toEqual("1'223'355,66$");
            expect(anElement2.getFormatted()).toEqual("1'223'355,66$");
            expect(anElement3.getFormatted()).toEqual("1'223'355,66$");
            expect(anElement4.getFormatted()).toEqual("1'223'355,66$");
            expect(anElement5.getFormatted()).toEqual("1'223'355,66$");
        });

        it('should `setUnformatted` the values globally across those elements', () => {
            newInput5.value = '88764.24';
            const anElement1 = new AutoNumeric(newInput1, options);
            const anElement2 = anElement1.init(newInput2);
            const anElement3 = anElement1.init(newInput3);
            const anElement4 = anElement2.init(newInput4);
            const anElement5 = anElement2.init(newInput5);

            expect(anElement1.set(22).getFormatted()).toEqual('22,00 €');
            expect(anElement2.set(13568.243).getFormatted()).toEqual('13 568,24 €');
            expect(anElement3.set(187568.243).getFormatted()).toEqual('187 568,24 €');
            expect(anElement4.set(21613568.243).getFormatted()).toEqual('21 613 568,24 €');
            expect(anElement5.getFormatted()).toEqual('88 764,24 €');

            // Test that those elements share the same local list
            anElement2.global.setUnformatted(1223355.66);
            expect(anElement1.getFormatted()).toEqual('1223355.66');
            expect(anElement2.getFormatted()).toEqual('1223355.66');
            expect(anElement3.getFormatted()).toEqual('1223355.66');
            expect(anElement4.getFormatted()).toEqual('1223355.66');
            expect(anElement5.getFormatted()).toEqual('1223355.66');

            // The unformatted value can be formatted using `reformat`. This does not affect the other elements.
            expect(anElement3.reformat().getFormatted()).toEqual('1 223 355,66 €');
            expect(anElement4.getFormatted()).toEqual('1223355.66');
        });

        it('should `reformat` the values globally across those elements', () => {
            const anElement1 = new AutoNumeric(newInput1, options);
            const anElement2 = anElement1.init(newInput2);
            const anElement3 = anElement1.init(newInput3);
            const anElement4 = anElement2.init(newInput4);
            const anElement5 = anElement2.init(newInput5);

            expect(anElement1.set(22).getFormatted()).toEqual('22,00 €');
            expect(anElement2.set(13568.243).getFormatted()).toEqual('13 568,24 €');
            expect(anElement3.set(187568.243).getFormatted()).toEqual('187 568,24 €');
            expect(anElement4.set(21613568.243).getFormatted()).toEqual('21 613 568,24 €');
            expect(anElement5.getFormatted()).toEqual('');

            // Test that those elements share the same local list
            anElement2.global.setUnformatted(20241.08);
            expect(anElement1.getFormatted()).toEqual('20241.08');
            expect(anElement2.getFormatted()).toEqual('20241.08');
            expect(anElement3.getFormatted()).toEqual('20241.08');
            expect(anElement4.getFormatted()).toEqual('20241.08');
            expect(anElement5.getFormatted()).toEqual('20241.08');

            // Reformat the elements globally
            anElement3.global.reformat();
            expect(anElement1.getFormatted()).toEqual('20 241,08 €');
            expect(anElement2.getFormatted()).toEqual('20 241,08 €');
            expect(anElement3.getFormatted()).toEqual('20 241,08 €');
            expect(anElement4.getFormatted()).toEqual('20 241,08 €');
            expect(anElement5.getFormatted()).toEqual('20 241,08 €');
        });

        it('should `unformat` the values globally across those elements', () => {
            const anElement1 = new AutoNumeric(newInput1, options);
            const anElement2 = anElement1.init(newInput2);
            const anElement3 = anElement1.init(newInput3);
            const anElement4 = anElement2.init(newInput4);
            const anElement5 = anElement2.init(newInput5);

            expect(anElement1.set(22).getFormatted()).toEqual('22,00 €');
            expect(anElement2.set(13568.243).getFormatted()).toEqual('13 568,24 €');
            expect(anElement3.set(187568.243).getFormatted()).toEqual('187 568,24 €');
            expect(anElement4.set(21613568.243).getFormatted()).toEqual('21 613 568,24 €');
            expect(anElement5.getFormatted()).toEqual('');

            // Unformat the elements globally
            anElement3.global.unformat();
            expect(anElement1.getFormatted()).toEqual('22');
            expect(anElement2.getFormatted()).toEqual('13568.24');
            expect(anElement3.getFormatted()).toEqual('187568.24');
            expect(anElement4.getFormatted()).toEqual('21613568.24');
            expect(anElement5.getFormatted()).toEqual('');
        });

        it('should `unformatLocalized` the values globally across those elements', () => {
            const anElement1 = new AutoNumeric(newInput1, options);
            const anElement2 = anElement1.init(newInput2);
            const anElement3 = anElement1.init(newInput3);
            const anElement4 = anElement2.init(newInput4);
            const anElement5 = anElement2.init(newInput5);

            expect(anElement1.set(22).getFormatted()).toEqual('22,00 €');
            expect(anElement2.set(13568.243).getFormatted()).toEqual('13 568,24 €');
            expect(anElement3.set(-187568.243).getFormatted()).toEqual('-187 568,24 €');
            expect(anElement4.set(21613568.243).getFormatted()).toEqual('21 613 568,24 €');
            expect(anElement5.getFormatted()).toEqual('');

            // Unformat the elements globally
            anElement3.global.unformatLocalized();
            expect(anElement1.getFormatted()).toEqual('22');
            expect(anElement2.getFormatted()).toEqual('13568,24');
            expect(anElement3.getFormatted()).toEqual('187568,24-');
            expect(anElement4.getFormatted()).toEqual('21613568,24');
            expect(anElement5.getFormatted()).toEqual('');
        });

        it('should `unformatLocalized` the values globally across those elements, while forcing the output format', () => {
            const anElement1 = new AutoNumeric(newInput1, options);
            const anElement2 = anElement1.init(newInput2);
            const anElement3 = anElement1.init(newInput3);
            const anElement4 = anElement2.init(newInput4);
            const anElement5 = anElement2.init(newInput5);

            expect(anElement1.set(22).getFormatted()).toEqual('22,00 €');
            expect(anElement2.set(13568.243).getFormatted()).toEqual('13 568,24 €');
            expect(anElement3.set(-187568.243).getFormatted()).toEqual('-187 568,24 €');
            expect(anElement4.set(21613568.243).getFormatted()).toEqual('21 613 568,24 €');
            expect(anElement5.getFormatted()).toEqual('');

            // Unformat the elements globally
            anElement3.global.unformatLocalized('-.');
            expect(anElement1.getFormatted()).toEqual('22');
            expect(anElement2.getFormatted()).toEqual('13568.24');
            expect(anElement3.getFormatted()).toEqual('-187568.24');
            expect(anElement4.getFormatted()).toEqual('21613568.24');
            expect(anElement5.getFormatted()).toEqual('');
        });

        it('should check if the values have not changed with `isPristine`', () => {
            newInput5.value = '88764.24';
            const anElement1 = new AutoNumeric(newInput1, options);
            const anElement2 = anElement1.init(newInput2);
            const anElement3 = anElement1.init(newInput3);
            const anElement4 = anElement2.init(newInput4);
            const anElement5 = anElement2.init(newInput5);

            // Check each element individually
            expect(anElement1.isPristine()).toBe(true);
            expect(anElement2.isPristine()).toBe(true);
            expect(anElement3.isPristine()).toBe(true);
            expect(anElement4.isPristine()).toBe(true);

            expect(anElement1.isPristine(false)).toBe(true);
            expect(anElement2.isPristine(false)).toBe(true);
            expect(anElement3.isPristine(false)).toBe(true);
            expect(anElement4.isPristine(false)).toBe(true);

            expect(anElement5.isPristine(false)).toBe(false); // During initialization, the format changed
            expect(anElement5.isPristine()).toBe(true);

            // Then check all the elements globally
            expect(anElement5.global.isPristine()).toBe(true);
            expect(anElement1.set(22).getFormatted()).toEqual('22,00 €');
            expect(anElement1.isPristine()).toBe(false);
            expect(anElement1.isPristine(false)).toBe(false);
            expect(anElement5.global.isPristine()).toBe(false);
            //FIXME Test the case where the raw value have not changed, but the formatting has
        });

        it('should return the correct values with `getNumericString`, `getFormatted`, `getNumber` and `getLocalized`', () => {
            const anElement1 = new AutoNumeric(newInput1, options);
            anElement1.options.outputFormat(AutoNumeric.options.outputFormat.commaNegative);
            const anElement2 = anElement1.init(newInput2);
            const anElement3 = anElement1.init(newInput3);
            const anElement4 = anElement2.init(newInput4);
            const anElement5 = anElement2.init(newInput5);

            anElement1.set(22);
            anElement2.set(13568.243);
            anElement3.set(187568.243);
            anElement4.set(21613568.243);
            anElement5.set(1028.005);

            expect(anElement1.global.get()).toEqual(['22', '13568.24', '187568.24', '21613568.24', '1028.01']);
            expect(anElement1.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '21613568.24', '1028.01']);
            expect(anElement1.global.getFormatted()).toEqual(['22,00 €', '13 568,24 €', '187 568,24 €', '21 613 568,24 €', '1 028,01 €']);
            expect(anElement1.global.getNumber()).toEqual([22, 13568.24, 187568.24, 21613568.24, 1028.01]);
            expect(anElement1.global.getLocalized()).toEqual(['22', '13568,24', '187568,24', '21613568,24', '1028,01']);

            // Then test that those elements share the same local list
            anElement4.global.set(1223355.66);

            expect(anElement1.global.get()).toEqual(['1223355.66', '1223355.66', '1223355.66', '1223355.66', '1223355.66']);
            expect(anElement1.global.getNumericString()).toEqual(['1223355.66', '1223355.66', '1223355.66', '1223355.66', '1223355.66']);
            expect(anElement1.global.getFormatted()).toEqual(['1 223 355,66 €', '1 223 355,66 €', '1 223 355,66 €', '1 223 355,66 €', '1 223 355,66 €']);
            expect(anElement1.global.getNumber()).toEqual([1223355.66, 1223355.66, 1223355.66, 1223355.66, 1223355.66]);
            expect(anElement1.global.getLocalized()).toEqual(['1223355,66', '1223355,66', '1223355,66', '1223355,66', '1223355,66']);

            anElement1.set(-22);
            anElement2.set(-13568.243);
            anElement3.set(-187568.243);
            anElement4.set(21613568.243);
            anElement5.set(-1028.005);
            expect(anElement1.global.getLocalized()).toEqual(['22-', '13568,24-', '187568,24-', '21613568,24', '1028,01-']);
            anElement1.options.outputFormat(AutoNumeric.options.outputFormat.dotNegative);
            expect(anElement1.global.getLocalized()).toEqual(['22-', '13568,24-', '187568,24-', '21613568,24', '1028,01-']);
            anElement3.options.outputFormat(AutoNumeric.options.outputFormat.dotNegative);
            expect(anElement1.global.getLocalized()).toEqual(['22-', '13568,24-', '187568.24-', '21613568,24', '1028,01-']);
            anElement5.global.update({ outputFormat: AutoNumeric.options.outputFormat.negativeDot });
            expect(anElement1.global.getLocalized()).toEqual(['-22', '-13568.24', '-187568.24', '21613568.24', '-1028.01']);
            anElement5.global.update({ outputFormat: AutoNumeric.options.outputFormat.number });
            expect(anElement1.global.getLocalized()).toEqual([-22, -13568.24, -187568.24, 21613568.24, -1028.01]);
        });

        it('should `clear` the input values', () => {
            const anElement1 = new AutoNumeric(newInput1, options);
            anElement1.options.outputFormat(AutoNumeric.options.outputFormat.commaNegative);
            anElement1.options.emptyInputBehavior(AutoNumeric.options.emptyInputBehavior.always);
            const anElement2 = anElement1.init(newInput2);
            const anElement3 = anElement1.init(newInput3);
            const anElement4 = anElement2.init(newInput4);
            const anElement5 = anElement2.init(newInput5);

            anElement1.set(22);
            anElement2.set(13568.243);
            anElement3.set(187568.243);
            anElement4.set(21613568.243);
            anElement5.set(1028.005);

            expect(anElement1.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '21613568.24', '1028.01']);
            expect(anElement1.global.getFormatted()).toEqual(['22,00 €', '13 568,24 €', '187 568,24 €', '21 613 568,24 €', '1 028,01 €']);

            // Clear only one element
            expect(anElement3.clear().global.getNumericString()).toEqual(['22', '13568.24', '', '21613568.24', '1028.01']);
            expect(anElement1.global.getFormatted()).toEqual(['22,00 €', '13 568,24 €', ' €', '21 613 568,24 €', '1 028,01 €']);

            // Then clear all elements
            anElement3.global.clear();
            expect(anElement1.global.getNumericString()).toEqual(['', '', '', '', '']);
            expect(anElement1.global.getFormatted()).toEqual([' €', ' €', ' €', ' €', ' €']);
            anElement3.global.clear(true);
            expect(anElement1.global.getFormatted()).toEqual(['', '', '', '', '']);
        });

        it('should `remove` the elements correctly, either one by one or globally', () => {
            const anElement1 = new AutoNumeric(newInput1, options);
            const anElement2 = anElement1.init(newInput2);
            const anElement3 = anElement1.init(newInput3);
            const anElement4 = anElement2.init(newInput4);
            const anElement5 = anElement2.init(newInput5);

            anElement1.set(22);
            anElement2.set(13568.243);
            anElement3.set(187568.243);
            anElement4.set(21613568.243);
            anElement5.set(1028.005);

            expect(anElement1.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '21613568.24', '1028.01']);
            expect(anElement1.global.getFormatted()).toEqual(['22,00 €', '13 568,24 €', '187 568,24 €', '21 613 568,24 €', '1 028,01 €']);

            // Remove only one element
            expect(newInput3.value).toEqual('187 568,24 €');
            anElement3.remove();
            expect(newInput3.value).toEqual('187 568,24 €');

            expect(anElement1.global.getNumericString()).toEqual(['22', '13568.24', '21613568.24', '1028.01']);
            expect(anElement1.global.getFormatted()).toEqual(['22,00 €', '13 568,24 €', '21 613 568,24 €', '1 028,01 €']);
            // Test that anElement3 is no more in the global AutoNumeric element list
            expect(AutoNumeric.test(newInput3)).toBe(false);

            // Then remove all elements
            anElement1.global.remove();
            expect(AutoNumeric.test(newInput1)).toBe(false);
            expect(AutoNumeric.test(newInput2)).toBe(false);
            expect(AutoNumeric.test(newInput4)).toBe(false);
            expect(AutoNumeric.test(newInput5)).toBe(false);

            // Here we can still access the .global.* functions since the garbage collector has not passed yet
            expect(anElement1.global.getNumericString()).toEqual([]);
            expect(anElement1.global.getFormatted()).toEqual([]);
        });

        it('should `wipe` the elements correctly, either one by one or globally', () => {
            const anElement1 = new AutoNumeric(newInput1, options);
            const anElement2 = anElement1.init(newInput2);
            const anElement3 = anElement1.init(newInput3);
            const anElement4 = anElement2.init(newInput4);
            const anElement5 = anElement2.init(newInput5);

            anElement1.set(22);
            anElement2.set(13568.243);
            anElement3.set(187568.243);
            anElement4.set(21613568.243);
            anElement5.set(1028.005);

            expect(anElement1.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '21613568.24', '1028.01']);
            expect(anElement1.global.getFormatted()).toEqual(['22,00 €', '13 568,24 €', '187 568,24 €', '21 613 568,24 €', '1 028,01 €']);

            // Wipe only one element
            expect(newInput3.value).toEqual('187 568,24 €');
            anElement3.wipe();
            expect(newInput3.value).toEqual('');

            expect(anElement1.global.getNumericString()).toEqual(['22', '13568.24', '21613568.24', '1028.01']);
            expect(anElement1.global.getFormatted()).toEqual(['22,00 €', '13 568,24 €', '21 613 568,24 €', '1 028,01 €']);

            // Test that anElement3 is no more in the global AutoNumeric element list
            expect(AutoNumeric.test(newInput3)).toBe(false);

            // Then wipe all elements
            anElement1.global.wipe();
            expect(AutoNumeric.test(newInput1)).toBe(false);
            expect(AutoNumeric.test(newInput2)).toBe(false);
            expect(AutoNumeric.test(newInput4)).toBe(false);
            expect(AutoNumeric.test(newInput5)).toBe(false);
            expect(newInput1.value).toEqual('');
            expect(newInput2.value).toEqual('');
            expect(newInput4.value).toEqual('');
            expect(newInput5.value).toEqual('');
        });

        it('should detect the DOM elements correctly using the `has` function', () => {
            const anElement1 = new AutoNumeric(newInput1, options);
            const anElement2 = anElement1.init(newInput2);
            const anElement3 = anElement1.init(newInput3);
            const anElement4 = new AutoNumeric(newInput4, options);
            const anElement5 = anElement4.init(newInput5);

            anElement1.set(22);
            anElement2.set(13568.243);
            anElement3.set(187568.243);
            anElement4.set(21613568.243);
            anElement5.set(1028.005);

            expect(anElement1.global.getNumericString()).toEqual(['22', '13568.24', '187568.24']);
            expect(anElement4.global.getNumericString()).toEqual(['21613568.24', '1028.01']);

            // Wipe only one element
            expect(anElement1.global.has(newInput1)).toBe(true);
            expect(anElement1.global.has(newInput2)).toBe(true);
            expect(anElement1.global.has(newInput3)).toBe(true);
            expect(anElement1.global.has(newInput4)).toBe(false);
            expect(anElement1.global.has(newInput5)).toBe(false);

            expect(anElement4.global.has(newInput1)).toBe(false);
            expect(anElement4.global.has(newInput2)).toBe(false);
            expect(anElement4.global.has(newInput3)).toBe(false);
            expect(anElement4.global.has(newInput4)).toBe(true);
            expect(anElement4.global.has(newInput5)).toBe(true);
        });

        it('should detect the AutoNumeric object correctly using the `has` function', () => {
            const anElement1 = new AutoNumeric(newInput1, options);
            const anElement2 = anElement1.init(newInput2);
            const anElement3 = anElement1.init(newInput3);
            const anElement4 = new AutoNumeric(newInput4, options);
            const anElement5 = anElement4.init(newInput5);

            anElement1.set(22);
            anElement2.set(13568.243);
            anElement3.set(187568.243);
            anElement4.set(21613568.243);
            anElement5.set(1028.005);

            expect(anElement1.global.getNumericString()).toEqual(['22', '13568.24', '187568.24']);
            expect(anElement4.global.getNumericString()).toEqual(['21613568.24', '1028.01']);

            // Wipe only one element
            expect(anElement1.global.has(anElement1)).toBe(true);
            expect(anElement1.global.has(anElement2)).toBe(true);
            expect(anElement1.global.has(anElement3)).toBe(true);
            expect(anElement1.global.has(anElement4)).toBe(false);
            expect(anElement1.global.has(anElement5)).toBe(false);

            expect(anElement4.global.has(anElement1)).toBe(false);
            expect(anElement4.global.has(anElement2)).toBe(false);
            expect(anElement4.global.has(anElement3)).toBe(false);
            expect(anElement4.global.has(anElement4)).toBe(true);
            expect(anElement4.global.has(anElement5)).toBe(true);
        });

        it('should add the given AutoNumeric object with the `addObject` function', () => {
            const anElement1 = new AutoNumeric(newInput1, options);
            const anElement2 = anElement1.init(newInput2);
            const anElement3 = anElement1.init(newInput3);
            const anElement4 = new AutoNumeric(newInput4, options);
            const anElement5 = new AutoNumeric(newInput5, options);

            anElement1.set(22);
            anElement2.set(13568.243);
            anElement3.set(187568.243);
            anElement4.set(21613568.243);
            anElement5.set(1028.005);

            expect(anElement1.global.getNumericString()).toEqual(['22', '13568.24', '187568.24']);
            expect(anElement4.global.getNumericString()).toEqual(['21613568.24']);
            expect(anElement5.global.getNumericString()).toEqual(['1028.01']);

            // Add an AutoNumeric object to the local list
            anElement2.global.addObject(anElement5);
            expect(anElement1.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '1028.01']);
            expect(anElement2.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '1028.01']);
            expect(anElement3.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '1028.01']);
            expect(anElement4.global.getNumericString()).toEqual(['21613568.24']);
            expect(anElement5.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '1028.01']);
            anElement5.global.addObject(anElement4);
            expect(anElement1.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '1028.01', '21613568.24']);
            expect(anElement2.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '1028.01', '21613568.24']);
            expect(anElement3.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '1028.01', '21613568.24']);
            expect(anElement4.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '1028.01', '21613568.24']);
            expect(anElement5.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '1028.01', '21613568.24']);
        });

        it('should add the given DOM element with the `addObject` function', () => {
            const anElement1 = new AutoNumeric(newInput1, options);
            const anElement2 = anElement1.init(newInput2);
            const anElement3 = anElement1.init(newInput3);
            const anElement4 = new AutoNumeric(newInput4, options);
            const anElement5 = new AutoNumeric(newInput5, options);

            anElement1.set(22);
            anElement2.set(13568.243);
            anElement3.set(187568.243);
            anElement4.set(21613568.243);
            anElement5.set(1028.005);

            expect(anElement1.global.getNumericString()).toEqual(['22', '13568.24', '187568.24']);
            expect(anElement4.global.getNumericString()).toEqual(['21613568.24']);
            expect(anElement5.global.getNumericString()).toEqual(['1028.01']);

            // Add a DOM element to the local list
            anElement2.global.addObject(newInput5);
            expect(anElement1.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '1028.01']);
            expect(anElement2.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '1028.01']);
            expect(anElement3.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '1028.01']);
            expect(anElement4.global.getNumericString()).toEqual(['21613568.24']);
            expect(anElement5.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '1028.01']);
            anElement5.global.addObject(newInput4);
            expect(anElement1.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '1028.01', '21613568.24']);
            expect(anElement2.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '1028.01', '21613568.24']);
            expect(anElement3.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '1028.01', '21613568.24']);
            expect(anElement4.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '1028.01', '21613568.24']);
            expect(anElement5.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '1028.01', '21613568.24']);
        });

        it('should add the given AutoNumeric object, and its other linked AutoNumeric objects, with the `addObject` function', () => {
            const anElement1 = new AutoNumeric(newInput1, options);
            const anElement2 = anElement1.init(newInput2);
            const anElement3 = anElement1.init(newInput3);
            const anElement4 = new AutoNumeric(newInput4, options);
            const anElement5 = anElement4.init(newInput5);

            anElement1.set(22);
            anElement2.set(13568.243);
            anElement3.set(187568.243);
            anElement4.set(21613568.243);
            anElement5.set(1028.005);

            expect(anElement1.global.getNumericString()).toEqual(['22', '13568.24', '187568.24']);
            expect(anElement2.global.getNumericString()).toEqual(['22', '13568.24', '187568.24']);
            expect(anElement3.global.getNumericString()).toEqual(['22', '13568.24', '187568.24']);
            expect(anElement4.global.getNumericString()).toEqual(['21613568.24', '1028.01']);
            expect(anElement5.global.getNumericString()).toEqual(['21613568.24', '1028.01']);

            // Add an AutoNumeric object to the local list
            // This manages the case where we use `addObject` on an AutoNumeric object that already has multiple elements in its local list
            anElement2.global.addObject(anElement4);
            expect(anElement1.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '21613568.24', '1028.01']);
            expect(anElement2.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '21613568.24', '1028.01']);
            expect(anElement3.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '21613568.24', '1028.01']);
            expect(anElement4.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '21613568.24', '1028.01']);
            expect(anElement5.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '21613568.24', '1028.01']);
        });

        it('should add the given DOM element, and its other linked AutoNumeric objects, with the `addObject` function', () => {
            const anElement1 = new AutoNumeric(newInput1, options);
            const anElement2 = anElement1.init(newInput2);
            const anElement3 = anElement1.init(newInput3);
            const anElement4 = new AutoNumeric(newInput4, options);
            const anElement5 = anElement4.init(newInput5);

            anElement1.set(22);
            anElement2.set(13568.243);
            anElement3.set(187568.243);
            anElement4.set(21613568.243);
            anElement5.set(1028.005);

            expect(anElement1.global.getNumericString()).toEqual(['22', '13568.24', '187568.24']);
            expect(anElement2.global.getNumericString()).toEqual(['22', '13568.24', '187568.24']);
            expect(anElement3.global.getNumericString()).toEqual(['22', '13568.24', '187568.24']);
            expect(anElement4.global.getNumericString()).toEqual(['21613568.24', '1028.01']);
            expect(anElement5.global.getNumericString()).toEqual(['21613568.24', '1028.01']);

            // Add a DOM element to the local list
            // This manages the case where `addObject` is used on an AutoNumeric object that already has multiple elements in its local list.
            anElement2.global.addObject(newInput4);
            expect(anElement1.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '21613568.24', '1028.01']);
            expect(anElement2.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '21613568.24', '1028.01']);
            expect(anElement3.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '21613568.24', '1028.01']);
            expect(anElement4.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '21613568.24', '1028.01']);
            expect(anElement5.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '21613568.24', '1028.01']);
        });

        it('should remove the given AutoNumeric object with the `removeObject` function', () => {
            const anElement1 = new AutoNumeric(newInput1, options);
            const anElement2 = anElement1.init(newInput2);
            const anElement3 = anElement1.init(newInput3);
            const anElement4 = new AutoNumeric(newInput4, options);

            anElement1.set(22);
            anElement2.set(13568.243);
            anElement3.set(187568.243);
            anElement4.set(21613568.243);

            expect(anElement1.global.getNumericString()).toEqual(['22', '13568.24', '187568.24']);
            expect(anElement2.global.getNumericString()).toEqual(['22', '13568.24', '187568.24']);
            expect(anElement3.global.getNumericString()).toEqual(['22', '13568.24', '187568.24']);
            expect(anElement4.global.getNumericString()).toEqual(['21613568.24']);

            // Remove an AutoNumeric object from the local list
            anElement2.global.removeObject(anElement1);
            expect(anElement1.global.getNumericString()).toEqual(['22']); // The element got removed by another one, it keeps itself in its own local list
            expect(anElement2.global.getNumericString()).toEqual(['13568.24', '187568.24']);
            expect(anElement3.global.getNumericString()).toEqual(['13568.24', '187568.24']);
            anElement3.global.removeObject(anElement3);
            expect(anElement1.global.getNumericString()).toEqual(['22']);
            expect(anElement2.global.getNumericString()).toEqual(['13568.24']);
            expect(anElement3.global.getNumericString()).toEqual([]); // The element removed itself

            anElement4.global.removeObject(anElement4, true);
            expect(anElement4.global.getNumericString()).toEqual(['21613568.24']);
            anElement4.global.removeObject(anElement4);
            expect(anElement4.global.getNumericString()).toEqual([]);

            // Then make sure an object with an empty local list can add other AutoNumeric objects back (without having to add itself into it)
            anElement4.global.addObject(anElement3);
            expect(anElement3.global.getNumericString()).toEqual(['21613568.24', '187568.24']);
            expect(anElement4.global.getNumericString()).toEqual(['21613568.24', '187568.24']);
        });

        it('should remove the given DOM element with the `removeObject` function', () => {
            const anElement1 = new AutoNumeric(newInput1, options);
            const anElement2 = anElement1.init(newInput2);
            const anElement3 = anElement1.init(newInput3);
            const anElement4 = new AutoNumeric(newInput4, options);

            anElement1.set(22);
            anElement2.set(13568.243);
            anElement3.set(187568.243);
            anElement4.set(21613568.243);

            expect(anElement1.global.getNumericString()).toEqual(['22', '13568.24', '187568.24']);
            expect(anElement2.global.getNumericString()).toEqual(['22', '13568.24', '187568.24']);
            expect(anElement3.global.getNumericString()).toEqual(['22', '13568.24', '187568.24']);
            expect(anElement4.global.getNumericString()).toEqual(['21613568.24']);

            // Remove a DOM element from the local list
            anElement2.global.removeObject(newInput1);
            expect(anElement1.global.getNumericString()).toEqual(['22']); // The element got removed by another one, it keeps itself in its own local list
            expect(anElement2.global.getNumericString()).toEqual(['13568.24', '187568.24']);
            expect(anElement3.global.getNumericString()).toEqual(['13568.24', '187568.24']);
            anElement3.global.removeObject(newInput3);
            expect(anElement1.global.getNumericString()).toEqual(['22']);
            expect(anElement2.global.getNumericString()).toEqual(['13568.24']);
            expect(anElement3.global.getNumericString()).toEqual([]); // The element removed itself

            anElement4.global.removeObject(newInput4, true);
            expect(anElement4.global.getNumericString()).toEqual(['21613568.24']);
            anElement4.global.removeObject(newInput4);
            expect(anElement4.global.getNumericString()).toEqual([]);

            // Then make sure an object with an empty local list can add other DOM elements back (without having to add itself into it)
            anElement4.global.addObject(newInput3);
            expect(anElement3.global.getNumericString()).toEqual(['21613568.24', '187568.24']);
            expect(anElement4.global.getNumericString()).toEqual(['21613568.24', '187568.24']);
        });

        it('should empty the local AutoNumeric objects list, with the `empty` function', () => {
            const anElement1 = new AutoNumeric(newInput1, options);
            const anElement2 = anElement1.init(newInput2);
            const anElement3 = anElement1.init(newInput3);
            const anElement4 = new AutoNumeric(newInput4, options);
            const anElement5 = anElement4.init(newInput5);

            anElement1.set(22);
            anElement2.set(13568.243);
            anElement3.set(187568.243);
            anElement4.set(21613568.243);
            anElement5.set(1028.005);

            expect(anElement1.global.getNumericString()).toEqual(['22', '13568.24', '187568.24']);
            expect(anElement2.global.getNumericString()).toEqual(['22', '13568.24', '187568.24']);
            expect(anElement3.global.getNumericString()).toEqual(['22', '13568.24', '187568.24']);
            expect(anElement4.global.getNumericString()).toEqual(['21613568.24', '1028.01']);
            expect(anElement5.global.getNumericString()).toEqual(['21613568.24', '1028.01']);

            // Empty the local list
            anElement2.global.empty();
            expect(anElement1.global.getNumericString()).toEqual([]);
            expect(anElement2.global.getNumericString()).toEqual([]);
            expect(anElement3.global.getNumericString()).toEqual([]);
            expect(anElement4.global.getNumericString()).toEqual(['21613568.24', '1028.01']);
            expect(anElement5.global.getNumericString()).toEqual(['21613568.24', '1028.01']);
            anElement4.global.empty(true);
            expect(anElement4.global.getNumericString()).toEqual(['21613568.24']);
            expect(anElement5.global.getNumericString()).toEqual(['1028.01']);
            anElement4.global.empty();
            expect(anElement4.global.getNumericString()).toEqual([]);
            expect(anElement5.global.getNumericString()).toEqual(['1028.01']);
            anElement5.global.empty();
            expect(anElement5.global.getNumericString()).toEqual([]);
            anElement5.global.empty();
            expect(anElement5.global.getNumericString()).toEqual([]);
        });

        it('should return the DOM elements from the local AutoNumeric objects list, with the `elements` function', () => {
            const anElement1 = new AutoNumeric(newInput1, options);
            const anElement2 = anElement1.init(newInput2);
            const anElement3 = anElement1.init(newInput3);
            const anElement4 = new AutoNumeric(newInput4, options);
            const anElement5 = anElement4.init(newInput5);

            anElement1.set(22);
            anElement2.set(13568.243);
            anElement3.set(187568.243);
            anElement4.set(21613568.243);
            anElement5.set(1028.005);

            expect(anElement1.global.getNumericString()).toEqual(['22', '13568.24', '187568.24']);
            expect(anElement2.global.getNumericString()).toEqual(['22', '13568.24', '187568.24']);
            expect(anElement3.global.getNumericString()).toEqual(['22', '13568.24', '187568.24']);
            expect(anElement4.global.getNumericString()).toEqual(['21613568.24', '1028.01']);
            expect(anElement5.global.getNumericString()).toEqual(['21613568.24', '1028.01']);

            // Get the DOM elements form the local lists
            expect(anElement2.global.elements()).toEqual([
                newInput1,
                newInput2,
                newInput3,
            ]);
            expect(anElement4.global.elements()).toEqual([
                newInput4,
                newInput5,
            ]);
        });

        it('should return the local AutoNumeric objects list with the `getList` function, and get its size with `size`', () => {
            const anElement1 = new AutoNumeric(newInput1, options);
            const anElement2 = anElement1.init(newInput2);
            const anElement3 = anElement1.init(newInput3);
            const anElement4 = new AutoNumeric(newInput4, options);
            const anElement5 = anElement4.init(newInput5);

            anElement1.set(22);
            anElement2.set(13568.243);
            anElement3.set(187568.243);
            anElement4.set(21613568.243);
            anElement5.set(1028.005);

            expect(anElement1.global.getNumericString()).toEqual(['22', '13568.24', '187568.24']);
            expect(anElement2.global.getNumericString()).toEqual(['22', '13568.24', '187568.24']);
            expect(anElement3.global.getNumericString()).toEqual(['22', '13568.24', '187568.24']);
            expect(anElement4.global.getNumericString()).toEqual(['21613568.24', '1028.01']);
            expect(anElement5.global.getNumericString()).toEqual(['21613568.24', '1028.01']);

            // Get the local list
            expect(anElement1.global.getList()).toEqual(anElement1.autoNumericLocalList);
            expect(anElement2.global.getList()).toEqual(anElement1.autoNumericLocalList);
            expect(anElement3.global.getList()).toEqual(anElement1.autoNumericLocalList);
            expect(anElement4.global.getList()).toEqual(anElement4.autoNumericLocalList);
            expect(anElement5.global.getList()).toEqual(anElement4.autoNumericLocalList);

            // Get the local list sizes
            expect(anElement1.global.size()).toEqual(3);
            expect(anElement5.global.size()).toEqual(2);

            anElement2.global.removeObject(anElement3);
            expect(anElement1.global.size()).toEqual(2);
        });
    });

    describe('initialization methods with the multiple `nuke` function', () => {
        it('should `nuke` the elements correctly, either one by one or globally', () => {
            // Initialize the DOM elements
            const options = { currencySymbol: ' €', currencySymbolPlacement: 's', decimalCharacter: ',', digitGroupSeparator: ' ', outputFormat: ',-' };
            const newInput1 = document.createElement('input');
            const newInput2 = document.createElement('input');
            const newInput3 = document.createElement('input');
            const newInput4 = document.createElement('input');
            const newInput5 = document.createElement('input');
            document.body.appendChild(newInput1);
            document.body.appendChild(newInput2);
            document.body.appendChild(newInput3);
            document.body.appendChild(newInput4);
            document.body.appendChild(newInput5);
            newInput1.name = 'nameInput1';
            newInput2.name = 'nameInput2';
            newInput3.name = 'nameInput3';
            newInput4.name = 'nameInput4';
            newInput5.name = 'nameInput5';
            newInput1.id = 'uniqueId1';
            newInput2.id = 'uniqueId2';
            newInput3.id = 'uniqueId3';
            newInput4.id = 'uniqueId4';
            newInput5.id = 'uniqueId5';

            expect(document.querySelector('#uniqueId1')).not.toBeNull();
            expect(document.querySelector('#uniqueId2')).not.toBeNull();
            expect(document.querySelector('#uniqueId3')).not.toBeNull();
            expect(document.querySelector('#uniqueId4')).not.toBeNull();
            expect(document.querySelector('#uniqueId5')).not.toBeNull();

            // Initialize the AutoNumeric elements
            const anElement1 = new AutoNumeric(newInput1, options);
            const anElement2 = anElement1.init(newInput2);
            const anElement3 = anElement1.init(newInput3);
            const anElement4 = anElement2.init(newInput4);
            const anElement5 = anElement2.init(newInput5);

            anElement1.set(22);
            anElement2.set(13568.243);
            anElement3.set(187568.243);
            anElement4.set(21613568.243);
            anElement5.set(1028.005);

            expect(anElement1.global.getNumericString()).toEqual(['22', '13568.24', '187568.24', '21613568.24', '1028.01']);
            expect(anElement1.global.getFormatted()).toEqual(['22,00 €', '13 568,24 €', '187 568,24 €', '21 613 568,24 €', '1 028,01 €']);

            // Nuke only one element
            expect(newInput3.value).toEqual('187 568,24 €');
            anElement3.nuke();
            expect(document.querySelector('#uniqueId3')).toBeNull();

            expect(anElement1.global.getNumericString()).toEqual(['22', '13568.24', '21613568.24', '1028.01']);
            expect(anElement1.global.getFormatted()).toEqual(['22,00 €', '13 568,24 €', '21 613 568,24 €', '1 028,01 €']);

            // Test that anElement3 is no more in the global AutoNumeric element list
            expect(AutoNumeric.test(newInput3)).toBe(false);

            // Then nuke all elements
            anElement1.global.nuke();
            expect(AutoNumeric.test(newInput1)).toBe(false);
            expect(AutoNumeric.test(newInput2)).toBe(false);
            expect(AutoNumeric.test(newInput4)).toBe(false);
            expect(AutoNumeric.test(newInput5)).toBe(false);
            expect(document.querySelector('#uniqueId1')).toBeNull();
            expect(document.querySelector('#uniqueId2')).toBeNull();
            expect(document.querySelector('#uniqueId4')).toBeNull();
            expect(document.querySelector('#uniqueId5')).toBeNull();

            expect(anElement1.global.getFormatted()).toEqual([]);
        });
    });
});

describe('Static autoNumeric functions', () => {
    describe('`test`', () => {
        it('should test for AutoNumeric objects', () => {
            const input1 = document.createElement('input');
            const input2 = document.createElement('input');
            const input3 = document.createElement('input');
            const input4 = document.createElement('input');
            document.body.appendChild(input1);
            document.body.appendChild(input2);
            document.body.appendChild(input3);
            document.body.appendChild(input4);

            // AutoNumeric initialization
            const anInput1 = new AutoNumeric(input1);
            const anInput3 = new AutoNumeric(input3);

            expect(AutoNumeric.test(input1)).toEqual(true);
            expect(AutoNumeric.test(input2)).toEqual(false);
            expect(AutoNumeric.test(input3)).toEqual(true);
            expect(AutoNumeric.test(input4)).toEqual(false);

            // Un-initialization
            anInput1.remove();
            anInput3.remove();
            document.body.removeChild(input1);
            document.body.removeChild(input2);
            document.body.removeChild(input3);
            document.body.removeChild(input4);
        });
    });

    describe('`unformat`', () => {
        it('should unformat with default options', () => {
            expect(AutoNumeric.unformat('')).toEqual('');
            expect(AutoNumeric.unformat('$1,234,567.89')).toEqual(NaN);
            expect(AutoNumeric.unformat('$1,234.56')).toEqual(NaN);
            expect(AutoNumeric.unformat('$123.45')).toEqual(NaN);
            expect(AutoNumeric.unformat('$0.00')).toEqual(NaN);
            expect(AutoNumeric.unformat(0)).not.toEqual('0.00'); //XXX This is false because 'real' non-numeric numbers are directly returned
            expect(AutoNumeric.unformat(0)).toEqual(0);
            expect(AutoNumeric.unformat('-123.45')).toEqual('-123.45');
            expect(AutoNumeric.unformat(-123.45)).toEqual(-123.45);

            expect(AutoNumeric.unformat('$1,234.56', { outputFormat : 'number' })).toEqual(NaN);
            expect(AutoNumeric.unformat('$123.45', { outputFormat : 'number' })).toEqual(NaN);
            expect(AutoNumeric.unformat('$0.00', { outputFormat : 'number' })).toEqual(NaN);
            expect(AutoNumeric.unformat(null)).toEqual(null);
            expect(AutoNumeric.unformat(1234.56, { outputFormat : 'number' })).toEqual(1234.56);
            expect(AutoNumeric.unformat(0, { outputFormat : 'number' })).toEqual(0);
        });

        it('should unformat the value retrieved from a DOM element, with default options', () => {
            // Create the DOM element
            const newInput = document.createElement('input');
            document.body.appendChild(newInput);

            // Run the tests
            expect(AutoNumeric.unformat(newInput)).toEqual(''); // By default when an input value is not defined, `unformat` return the empty string. This allows to be coherent when serializing forms with empty inputs.
            newInput.value = '$1,234,567.89';
            expect(AutoNumeric.unformat(newInput)).toEqual(NaN);
            newInput.value = '$1,234.56';
            expect(AutoNumeric.unformat(newInput)).toEqual(NaN);
            newInput.value = '$123.45';
            expect(AutoNumeric.unformat(newInput)).toEqual(NaN);
            newInput.value = '$0.00';
            expect(AutoNumeric.unformat(newInput)).toEqual(NaN);
            newInput.value = 0;
            expect(AutoNumeric.unformat(newInput)).toEqual('0.00'); // This behave differently than if we passed the `0` directly since retrieving the value from the DOM element converts its to a string
            newInput.value = '-123.45';
            expect(AutoNumeric.unformat(newInput)).toEqual('-123.45');
            newInput.value = -123.45;
            expect(AutoNumeric.unformat(newInput)).toEqual('-123.45');
            newInput.value = '$1,234.56';
            expect(AutoNumeric.unformat(newInput, { outputFormat : 'number' })).toEqual(NaN);
            newInput.value = '$123.45';
            expect(AutoNumeric.unformat(newInput, { outputFormat : 'number' })).toEqual(NaN);
            newInput.value = '$0.00';
            expect(AutoNumeric.unformat(newInput, { outputFormat : 'number' })).toEqual(NaN);
            newInput.value = null;
            expect(AutoNumeric.unformat(newInput)).toEqual(''); // An input value cannot be equal to 'null', but is transformed into ''
            newInput.value = 1234.56;
            expect(AutoNumeric.unformat(newInput, { outputFormat : 'number' })).toEqual(1234.56);
            newInput.value = 0;
            expect(AutoNumeric.unformat(newInput, { outputFormat : 'number' })).toEqual(0);

            // Delete the DOM element
            document.body.removeChild(newInput);
        });

        it('should unformat the value retrieved from a DOM element, with custom options', () => {
            // Create the DOM element
            const newInput = document.createElement('input');
            document.body.appendChild(newInput);

            // Run the tests
            expect(AutoNumeric.unformat(newInput)).toEqual(''); // By default when an input value is not defined, `unformat` return the empty string. This allows to be coherent when serializing forms with empty inputs.
            newInput.value = '$1,234,567.89';
            expect(AutoNumeric.unformat(newInput, { currencySymbol: '$' })).toEqual('1234567.89');
            newInput.value = '$1,234.56';
            expect(AutoNumeric.unformat(newInput, { currencySymbol: '$' })).toEqual('1234.56');
            newInput.value = '$123.45';
            expect(AutoNumeric.unformat(newInput, { currencySymbol: '$' })).toEqual('123.45');
            newInput.value = '$0.00';
            expect(AutoNumeric.unformat(newInput, { currencySymbol: '$' })).toEqual('0.00');
            newInput.value = 0;
            expect(AutoNumeric.unformat(newInput, { currencySymbol: '$' })).toEqual('0.00'); // This behave differently than if we passed the `0` directly since retrieving the value from the DOM element converts its to a string
            newInput.value = '-123.45';
            expect(AutoNumeric.unformat(newInput)).toEqual('-123.45');
            newInput.value = -123.45;
            expect(AutoNumeric.unformat(newInput)).toEqual('-123.45');
            newInput.value = '$1,234.56';
            expect(AutoNumeric.unformat(newInput, { outputFormat : 'number', currencySymbol: '$' })).toEqual(1234.56);
            newInput.value = '$123.45';
            expect(AutoNumeric.unformat(newInput, { outputFormat : 'number', currencySymbol: '$' })).toEqual(123.45);
            newInput.value = '$0.00';
            expect(AutoNumeric.unformat(newInput, { outputFormat : 'number', currencySymbol: '$' })).toEqual(0);
            newInput.value = null;
            expect(AutoNumeric.unformat(newInput, { outputFormat : 'number', currencySymbol: '$' })).toEqual(''); // An input value cannot be equal to 'null', but is transformed into ''
            newInput.value = 1234.56;
            expect(AutoNumeric.unformat(newInput, { outputFormat : 'number', currencySymbol: '$' })).toEqual(1234.56);
            newInput.value = 0;
            expect(AutoNumeric.unformat(newInput, { outputFormat : 'number', currencySymbol: '$' })).toEqual(0);

            // Delete the DOM element
            document.body.removeChild(newInput);
        });

        it('should unformat with a currency symbol options', () => {
            expect(AutoNumeric.unformat('', { currencySymbol: '$' })).toEqual('');
            expect(AutoNumeric.unformat('$1,234,567.89', { currencySymbol: '$' })).toEqual('1234567.89');
            expect(AutoNumeric.unformat('$1,234.56', { currencySymbol: '$' })).toEqual('1234.56');
            expect(AutoNumeric.unformat('$123.45', { currencySymbol: '$' })).toEqual('123.45');
            expect(AutoNumeric.unformat('$0.00', { currencySymbol: '$' })).toEqual('0.00');
            expect(AutoNumeric.unformat(0, { currencySymbol: '$' })).not.toEqual('0.00'); //XXX This is false because 'real' non-numeric numbers are directly returned
            expect(AutoNumeric.unformat(0, { currencySymbol: '$' })).toEqual(0);

            expect(AutoNumeric.unformat('$1,234.56', { outputFormat : 'number', currencySymbol: '$' })).toEqual(1234.56);
            expect(AutoNumeric.unformat('$123.45', { outputFormat : 'number', currencySymbol: '$' })).toEqual(123.45);
            expect(AutoNumeric.unformat('$0.00', { outputFormat : 'number', currencySymbol: '$' })).toEqual(0);
            expect(AutoNumeric.unformat(null)).toEqual(null);
            expect(AutoNumeric.unformat(1234.56, { outputFormat : 'number', currencySymbol: '$' })).toEqual(1234.56);
            expect(AutoNumeric.unformat(0, { outputFormat : 'number', currencySymbol: '$' })).toEqual(0);
        });

        it('should unformat with user options', () => {
            expect(AutoNumeric.unformat('1.234.567,89 €', autoNumericOptionsEuroNumber)).toEqual(1234567.89);
            expect(AutoNumeric.unformat('1.234.567,86123 €', autoNumericOptionsEuroNumber)).toEqual(1234567.86);
            expect(AutoNumeric.unformat('1.234,56 €', autoNumericOptionsEuroNumber)).toEqual(1234.56);
            expect(AutoNumeric.unformat('123,45 €', autoNumericOptionsEuroNumber)).toEqual(123.45);
            expect(AutoNumeric.unformat('0,00 €', autoNumericOptionsEuroNumber)).toEqual(0);

            expect(AutoNumeric.unformat('1.234,56\u202f€', AutoNumeric.getPredefinedOptions().euro)).toEqual('1234.56');
            expect(AutoNumeric.unformat('1.234,56\u202f€', 'euro')).toEqual('1234.56');
            expect(AutoNumeric.unformat('1.234,56\u202f€', ['euro'])).toEqual('1234.56');
            expect(AutoNumeric.unformat('1.234,56 CFP', ['euro', { currencySymbol: ' CFP' }])).toEqual('1234.56');
            expect(AutoNumeric.unformat('1.234,56 CFP', 'euro', { currencySymbol: ' CFP' })).toEqual('1234.56');
            expect(AutoNumeric.unformat('72.687,41\u202f€', AutoNumeric.getPredefinedOptions().euro)).toEqual('72687.41');
            expect(AutoNumeric.unformat('72.687,41\u202f€', 'euro')).toEqual('72687.41');
            expect(AutoNumeric.unformat('72.687,41\u202f€', ['euro'])).toEqual('72687.41');

            expect(AutoNumeric.unformat('1.234,56 €', autoNumericOptionsEuro)).toEqual('1234.56');
            expect(AutoNumeric.unformat('123,45 €', autoNumericOptionsEuro)).toEqual('123.45');
            expect(AutoNumeric.unformat('0,00 €', autoNumericOptionsEuro)).toEqual('0.00');
            expect(AutoNumeric.unformat(null, autoNumericOptionsEuro)).toEqual(null);

            expect(AutoNumeric.unformat('4,797\u202f%', AutoNumeric.getPredefinedOptions().percentageEU3dec)).toEqual('0.04797');
            expect(AutoNumeric.unformat('-2,541\u202f%', AutoNumeric.getPredefinedOptions().percentageEU3dec)).toEqual('-0.02541');
            expect(AutoNumeric.unformat('0,480\u202f%', AutoNumeric.getPredefinedOptions().percentageEU3dec)).toEqual('0.00480');
            expect(AutoNumeric.unformat('0,474\u202f%', AutoNumeric.getPredefinedOptions().percentageEU3dec)).toEqual('0.00474');
            expect(AutoNumeric.unformat('-0,254\u202f%', AutoNumeric.getPredefinedOptions().percentageEU3dec)).toEqual('-0.00254');
        });

        it('should correctly format `valuesToStrings` values', () => {
            expect(AutoNumeric.unformat('1.234,56\u202f€', ['euro'])).toEqual('1234.56');
            expect(AutoNumeric.unformat('1.234,56\u202f€', ['euro', { valuesToStrings: AutoNumeric.options.valuesToStrings.zeroDash }])).toEqual('1234.56');
            expect(AutoNumeric.unformat('-', ['euro', { valuesToStrings: AutoNumeric.options.valuesToStrings.zeroDash }])).toEqual('0');
            expect(AutoNumeric.unformat('-', ['euro', { valuesToStrings: { 42: '-' } }])).toEqual('42');
            expect(AutoNumeric.unformat('Min', ['euro', { valuesToStrings: AutoNumeric.options.valuesToStrings.oneAroundZero }])).toEqual('-1');
            expect(AutoNumeric.unformat('0,00\u202f€', ['euro', { valuesToStrings: AutoNumeric.options.valuesToStrings.oneAroundZero }])).toEqual('0.00');
            expect(AutoNumeric.unformat('Max', ['euro', { valuesToStrings: AutoNumeric.options.valuesToStrings.oneAroundZero }])).toEqual('1');
        });

        it('should fail when trying to format unknown `valuesToStrings` values', () => {
            expect(AutoNumeric.unformat('Min', 'euro')).toBeNaN();
        });

        it('should unformat with multiple user options overwriting each other in the right order', () => {
            expect(AutoNumeric.unformat('241800,02 €', AutoNumeric.getPredefinedOptions().French, { digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.noSeparator })).toEqual('241800.02');
            expect(AutoNumeric.unformat('241800,02 $',
                                        AutoNumeric.getPredefinedOptions().French,
                                        { digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.noSeparator },
                                        { currencySymbol     : AutoNumeric.options.currencySymbol.pound },
                                        { currencySymbol     : AutoNumeric.options.currencySymbol.dollar },
            )).toEqual('241800.02');
        });

        it('should unformat with multiple user options in one array, overwriting each other in the right order', () => {
            expect(AutoNumeric.unformat('241800,02 €',
                                        [
                                            AutoNumeric.getPredefinedOptions().French,
                                            { digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.noSeparator },
                                        ])).toEqual('241800.02');

            expect(AutoNumeric.unformat('241800,02 $',
                                        [
                                            AutoNumeric.getPredefinedOptions().French,
                                            { digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.noSeparator },
                                            { currencySymbol     : AutoNumeric.options.currencySymbol.pound },
                                            { currencySymbol     : AutoNumeric.options.currencySymbol.dollar },
                                        ],
            )).toEqual('241800.02');

            spyOn(console, 'warn');
            expect(AutoNumeric.unformat('-24',
                                        [
                                            'integerPos',
                                            { wheelStep: 6 },
                                            {
                                                overrideMinMaxLimits: AutoNumeric.options.overrideMinMaxLimits.ignore,
                                                minimumValue        : AutoNumeric.options.minimumValue.tenTrillions,
                                                maximumValue        : AutoNumeric.options.maximumValue.tenTrillions,
                                            },
                                        ],
            )).toEqual('-24');
        });

        it('should unformat with multiple user options in one array, with named pre-defined options', () => {
            expect(AutoNumeric.unformat('241800,02 €',
                                        [
                                            'euro',
                                            { digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.noSeparator },
                                        ])).toEqual('241800.02');
            expect(AutoNumeric.unformat('241800,02 $',
                                        [
                                            'euro',
                                            { digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.noSeparator },
                                            { currencySymbol     : AutoNumeric.options.currencySymbol.pound },
                                            { currencySymbol     : AutoNumeric.options.currencySymbol.dollar },
                                        ],
            )).toEqual('241800.02');
        });

        it(`should return a 'real' number, whatever options are passed as an argument`, () => {
            expect(AutoNumeric.unformat(1234.56)).toEqual(1234.56);
            expect(AutoNumeric.unformat(0)).toEqual(0);

            // Giving an unformatted value should return the same unformatted value, whatever the options passed as a parameter
            expect(AutoNumeric.unformat(1234.56, autoNumericOptionsEuro)).toEqual(1234.56);
        });

        it('should only send a warning, and not throw', () => {
            spyOn(console, 'warn');
            expect(() => AutoNumeric.validate({ decimalPlaces: '3', decimalPlacesShownOnFocus: '2' })).not.toThrow();
            expect(console.warn).toHaveBeenCalled();
        });

        it('should fail unformatting wrong parameters', () => {
            expect(AutoNumeric.unformat('foobar')).toEqual(NaN);
            expect(() => AutoNumeric.unformat([1234])).toThrow();
            expect(() => AutoNumeric.unformat({})).toThrow();
            expect(() => AutoNumeric.unformat({ val: 1234 })).toThrow();
            expect(() => AutoNumeric.unformat([])).toThrow();
        });

        it('should unformat brackets and negative (localized) values', () => {
            // Negative values
            expect(AutoNumeric.unformat('-1.234,56 €', autoNumericOptionsEuroNumber)).toEqual(-1234.56);
            expect(AutoNumeric.unformat('-123,45 €', autoNumericOptionsEuroNumber)).toEqual(-123.45);
            expect(AutoNumeric.unformat('0,00 €', autoNumericOptionsEuroNumber)).toEqual(0);

            expect(AutoNumeric.unformat('-1.234,56 €', autoNumericOptionsEuro)).toEqual('-1234.56');
            expect(AutoNumeric.unformat('-123,45 €', autoNumericOptionsEuro)).toEqual('-123.45');
            expect(AutoNumeric.unformat('0,00 €', autoNumericOptionsEuro)).toEqual('0.00');

            expect(AutoNumeric.unformat('-1234.56')).toEqual('-1234.56');
            expect(AutoNumeric.unformat('-123.45')).toEqual('-123.45');
            expect(AutoNumeric.unformat('0.00')).toEqual('0.00');

            // Negative values with brackets
            const options = {
                digitGroupSeparator        : '.',
                decimalCharacter           : ',',
                decimalCharacterAlternative: '.',
                currencySymbol             : ' €',
                currencySymbolPlacement    : 's',
                roundingMethod             : 'U',
                outputFormat               : 'number',
                negativeBracketsTypeOnBlur : AutoNumeric.options.negativeBracketsTypeOnBlur.parentheses,
            };
            expect(AutoNumeric.unformat('(1.234,56 €)', options)).toEqual(-1234.56);
            expect(AutoNumeric.unformat('(123,45 €)', options)).toEqual(-123.45);
            expect(AutoNumeric.unformat('(0,00 €)', options)).toEqual(0);
        });

        it('should unformat correctly when there are no decimal places', () => {
            const options1 = {
                maximumValue : '9999',
                minimumValue : '0',
                decimalPlaces: 2,
            };
            expect(AutoNumeric.unformat('4000', options1)).toEqual('4000.00');
            expect(AutoNumeric.unformat(4000, options1)).toEqual(4000);
            expect(AutoNumeric.unformat('4000.123', options1)).toEqual('4000.12');
            expect(AutoNumeric.unformat(4000.123, options1)).toEqual(4000.123);

            const options2 = {
                maximumValue : '9999',
                minimumValue : '0',
                decimalPlaces: 0,
            };
            expect(AutoNumeric.unformat('4000', options2)).toEqual('4000');
            expect(AutoNumeric.unformat(4000, options2)).toEqual(4000);
            expect(AutoNumeric.unformat('4000.123', options2)).toEqual('4000');
            expect(AutoNumeric.unformat(4000.123, options2)).toEqual(4000.123);
        });

        it('should handle multiple digit group separators', () => { // cf. issue #449
            expect(AutoNumeric.unformat('$12,345,678.90', AutoNumeric.getPredefinedOptions().dollar)).toEqual('12345678.90');
        });

        //TODO Add the tests for the localized values (positive and negative)
    });

    describe('`unformat` should unformat correctly when a decimal character or group separator is defined in the `options` (cf. issue #427)', () => {
        it('with a `digitGroupSeparator` found in the source', () => {
            const options1 = {
                digitGroupSeparator: '.',
                decimalCharacter: ',',
                maximumValue: '9999',
                minimumValue: '0',
            };
            expect(AutoNumeric.unformat('4.000', options1)).toEqual('4000.00');
            expect(AutoNumeric.unformat(4000, options1)).toEqual(4000);

            const options2a = {
                digitGroupSeparator: '.',
                decimalCharacter: ',',
                maximumValue: '9999',
                minimumValue: '0',
                allowDecimalPadding: AutoNumeric.options.allowDecimalPadding.never,
            };
            expect(AutoNumeric.unformat('4.000', options2a)).toEqual('4000');
            expect(AutoNumeric.unformat('4.000,6', options2a)).toEqual('4000.6');

            const options2b = {
                digitGroupSeparator: '.',
                decimalCharacter: ',',
                maximumValue: '9999',
                minimumValue: '0',
                allowDecimalPadding: AutoNumeric.options.allowDecimalPadding.floats,
            };
            expect(AutoNumeric.unformat('4.000', options2b)).toEqual('4000');
            expect(AutoNumeric.unformat('4.000,6', options2b)).toEqual('4000.60');

            const options2c = {
                digitGroupSeparator: '.',
                decimalCharacter: ',',
                maximumValue: '9999',
                minimumValue: '0',
                allowDecimalPadding: AutoNumeric.options.allowDecimalPadding.always,
            };
            expect(AutoNumeric.unformat('4.000', options2c)).toEqual('4000.00');
            expect(AutoNumeric.unformat('4.000,6', options2c)).toEqual('4000.60');

            const options3 = {
                digitGroupSeparator: '.',
                decimalCharacter: ',',
                maximumValue: '9999',
                minimumValue: '0',
                outputFormat: AutoNumeric.options.outputFormat.number,
            };
            expect(AutoNumeric.unformat('4.000', options3)).toEqual(4000);
            expect(AutoNumeric.unformat(4000, options3)).toEqual(4000);
        });

        it('with a `decimalCharacter` found in the source', () => {
            const options1 = {
                digitGroupSeparator: '.',
                decimalCharacter: ',',
                maximumValue: '99999',
                minimumValue: '0',
            };
            expect(AutoNumeric.unformat('4,123', options1)).toEqual('4.12');
            expect(AutoNumeric.unformat(4.12, options1)).toEqual(4.12);

            const options2 = {
                digitGroupSeparator: '.',
                decimalCharacter: ',',
                maximumValue: '99999',
                minimumValue: '0',
                outputFormat: AutoNumeric.options.outputFormat.number,
            };
            expect(AutoNumeric.unformat('4,123', options2)).toEqual(4.12);
            expect(AutoNumeric.unformat(4.12, options2)).toEqual(4.12);
        });

        it('with a `leadingZero` set to `keep` in the options', () => {
            const options1 = {
                digitGroupSeparator: '.',
                decimalCharacter: ',',
                maximumValue: '99999',
                minimumValue: '0',
                leadingZero: AutoNumeric.options.leadingZero.keep,
            };
            expect(AutoNumeric.unformat('00004', options1)).toEqual('00004.00');

            const options2 = {
                digitGroupSeparator: '.',
                decimalCharacter: ',',
                decimalPlaces: 0,
                maximumValue: '99999',
                minimumValue: '0',
                leadingZero: AutoNumeric.options.leadingZero.keep,
            };
            expect(AutoNumeric.unformat('00004', options2)).toEqual('00004');

            const options1Deny = {
                digitGroupSeparator: '.',
                decimalCharacter: ',',
                maximumValue: '99999',
                minimumValue: '0',
                leadingZero: AutoNumeric.options.leadingZero.deny,
            };
            expect(AutoNumeric.unformat('00004', options1Deny)).toEqual('4.00');

            const options2Deny = {
                digitGroupSeparator: '.',
                decimalCharacter: ',',
                decimalPlaces: 0,
                maximumValue: '99999',
                minimumValue: '0',
                leadingZero: AutoNumeric.options.leadingZero.deny,
            };
            expect(AutoNumeric.unformat('00004', options2Deny)).toEqual('4');
        });
    });

    describe('`format`', () => {
        it('should format with default options', () => {
            expect(AutoNumeric.format(1234.56)).toEqual('1,234.56');
            expect(AutoNumeric.format('1234.56')).toEqual('1,234.56');
            expect(AutoNumeric.format(123.45)).toEqual('123.45');
            expect(AutoNumeric.format('1234,56')).toEqual('123,456.00'); // By default, ',' is a group separator, which gets removed
            expect(AutoNumeric.format('1.234,56')).toEqual('1.23'); // By default, '.' is the decimal separator
            expect(AutoNumeric.format(0)).toEqual('0.00');
            expect(AutoNumeric.format('-123.45')).toEqual('-123.45');
            expect(AutoNumeric.format(-123.45)).toEqual('-123.45');
            expect(AutoNumeric.format(null)).toEqual(null);
            expect(AutoNumeric.format(undefined)).toEqual(null);
        });

        it('should format the value retrieved from a DOM element', () => {
            // Create the DOM element
            const newInput = document.createElement('input');
            document.body.appendChild(newInput);

            // Run the tests
            expect(AutoNumeric.format(newInput)).toEqual('0.00'); // An input value cannot be equal to `undefined`, but is transformed into '' when trying to retrieve the not defined `value` attribute
            newInput.value = 1234.56;
            expect(AutoNumeric.format(newInput)).toEqual('1,234.56');
            newInput.value = '1234.56';
            expect(AutoNumeric.format(newInput)).toEqual('1,234.56');
            newInput.value = 123.45;
            expect(AutoNumeric.format(newInput)).toEqual('123.45');
            newInput.value = '1234,56';
            expect(AutoNumeric.format(newInput)).toEqual('123,456.00'); // By default, ',' is a group separator, which gets removed
            newInput.value = '1.234,56';
            expect(AutoNumeric.format(newInput)).toEqual('1.23'); // By default, '.' is the decimal separator
            newInput.value = 0;
            expect(AutoNumeric.format(newInput)).toEqual('0.00');
            newInput.value = '-123.45';
            expect(AutoNumeric.format(newInput)).toEqual('-123.45');
            newInput.value = -123.45;
            expect(AutoNumeric.format(newInput)).toEqual('-123.45');
            newInput.value = null;
            expect(AutoNumeric.format(newInput)).toEqual('0.00'); // An input value cannot be equal to 'null', but is transformed into ''

            // Delete the DOM element
            document.body.removeChild(newInput);
        });

        it('should format with user options', () => {
            expect(AutoNumeric.format(1234.56, autoNumericOptionsEuro)).toEqual('1.234,56 €');
            expect(AutoNumeric.format(1234.56123, autoNumericOptionsEuro)).toEqual('1.234,56 €');
            expect(AutoNumeric.format('1.234,56 €', autoNumericOptionsEuro)).toEqual('1.234,56 €');
            expect(AutoNumeric.format('1234.56', autoNumericOptionsEuro)).toEqual('1.234,56 €');
            expect(AutoNumeric.format(123.45, autoNumericOptionsEuro)).toEqual('123,45 €');
            expect(AutoNumeric.format('123,45 €', autoNumericOptionsEuro)).toEqual('123,45 €');
            expect(AutoNumeric.format(0, autoNumericOptionsEuro)).toEqual('0,00 €');

            expect(AutoNumeric.format(1234.56, AutoNumeric.getPredefinedOptions().euro)).toEqual('1.234,56\u202f€');
            expect(AutoNumeric.format(1234.56, 'euro')).toEqual('1.234,56\u202f€');
            expect(AutoNumeric.format(1234.56, ['euro'])).toEqual('1.234,56\u202f€');
            expect(AutoNumeric.format(1234.56, ['euro', { currencySymbol: ' CFP' }])).toEqual('1.234,56 CFP');
            expect(AutoNumeric.format(1234.56, 'euro', { currencySymbol: ' CFP' })).toEqual('1.234,56 CFP');
            expect(AutoNumeric.format(72687.408552029, AutoNumeric.getPredefinedOptions().euro)).toEqual('72.687,41\u202f€');
            expect(AutoNumeric.format(72687.408552029, 'euro')).toEqual('72.687,41\u202f€');
            expect(AutoNumeric.format(72687.408552029, ['euro'])).toEqual('72.687,41\u202f€');

            expect(AutoNumeric.format(1234.56, autoNumericOptionsDollar)).toEqual('$1,234.56');
            expect(AutoNumeric.format(123.45, autoNumericOptionsDollar)).toEqual('$123.45');
            expect(AutoNumeric.format('$1,234.56', autoNumericOptionsDollar)).toEqual('$1,234.56');
            expect(AutoNumeric.format('$123.45', autoNumericOptionsDollar)).toEqual('$123.45');

            expect(AutoNumeric.format(null, autoNumericOptionsEuro)).toEqual(null);
            expect(AutoNumeric.format(undefined, autoNumericOptionsEuro)).toEqual(null);

            expect(AutoNumeric.format(0.04796656, AutoNumeric.getPredefinedOptions().percentageEU3dec)).toEqual('4,797\u202f%');
            expect(AutoNumeric.format(-0.02541148, AutoNumeric.getPredefinedOptions().percentageEU3dec)).toEqual('-2,541\u202f%');
            expect(AutoNumeric.format(0.004796656, AutoNumeric.getPredefinedOptions().percentageEU3dec)).toEqual('0,480\u202f%');
            expect(AutoNumeric.format(0.004742656, AutoNumeric.getPredefinedOptions().percentageEU3dec)).toEqual('0,474\u202f%');
            expect(AutoNumeric.format(-0.002541148, AutoNumeric.getPredefinedOptions().percentageEU3dec)).toEqual('-0,254\u202f%');
        });

        it('should correctly format `valuesToStrings` values', () => {
            expect(AutoNumeric.format(1234.56, ['euro'])).toEqual('1.234,56\u202f€');
            expect(AutoNumeric.format(1234.56, ['euro', { valuesToStrings: AutoNumeric.options.valuesToStrings.zeroDash }])).toEqual('1.234,56\u202f€');
            expect(AutoNumeric.format(0, ['euro', { valuesToStrings: AutoNumeric.options.valuesToStrings.zeroDash }])).toEqual('-');
            expect(AutoNumeric.format(-1, ['euro', { valuesToStrings: AutoNumeric.options.valuesToStrings.oneAroundZero }])).toEqual('Min');
            expect(AutoNumeric.format(0, ['euro', { valuesToStrings: AutoNumeric.options.valuesToStrings.oneAroundZero }])).toEqual('0,00\u202f€');
            expect(AutoNumeric.format(1, ['euro', { valuesToStrings: AutoNumeric.options.valuesToStrings.oneAroundZero }])).toEqual('Max');
        });

        it('should format with multiple user options overwriting each other in the right order', () => {
            expect(AutoNumeric.format(241800.02, [
                AutoNumeric.getPredefinedOptions().French,
                { digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.noSeparator },
            ])).toEqual('241800,02 €');
            expect(AutoNumeric.format(241800.02, [
                AutoNumeric.getPredefinedOptions().French,
                { digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.noSeparator },
                { currencySymbol     : AutoNumeric.options.currencySymbol.pound },
                { currencySymbol     : AutoNumeric.options.currencySymbol.dollar },
            ])).toEqual('241800,02$');
        });

        it('should format with multiple user options in one array, overwriting each other in the right order', () => {
            expect(AutoNumeric.format(241800.02,
                                      [
                                          AutoNumeric.getPredefinedOptions().French,
                                          { digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.noSeparator },
                                      ])).toEqual('241800,02 €');

            expect(AutoNumeric.format(241800.02,
                                      [
                                          AutoNumeric.getPredefinedOptions().French,
                                          { digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.noSeparator },
                                          { currencySymbol     : AutoNumeric.options.currencySymbol.pound },
                                          { currencySymbol     : AutoNumeric.options.currencySymbol.dollar },
                                      ],
            )).toEqual('241800,02$');

            expect(AutoNumeric.format(-24,
                                      [
                                          'integerPos',
                                          { wheelStep: 6 },
                                          {
                                              overrideMinMaxLimits: AutoNumeric.options.overrideMinMaxLimits.ignore,
                                              minimumValue        : AutoNumeric.options.minimumValue.tenTrillions,
                                              maximumValue        : AutoNumeric.options.maximumValue.tenTrillions,
                                          },
                                      ],
            )).toEqual('-24');
        });

        it('should format with multiple options, with named pre-defined options', () => {
            expect(AutoNumeric.format(241800.02, [
                'euro',
                { digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.noSeparator },
            ])).toEqual('241800,02 €');
            expect(AutoNumeric.format(241800.02, [
                'euro',
                { digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.noSeparator },
                { currencySymbol: AutoNumeric.options.currencySymbol.pound },
                { currencySymbol: AutoNumeric.options.currencySymbol.dollar },
            ])).toEqual('241800,02$');
        });

        it('should format values wrote in scientific notation', () => {
            const bigNumber = {
                maximumValue : '100000000000000000000000000000000000000000000',
            };
            expect(AutoNumeric.format(12345e3)).toEqual('12,345,000.00');
            expect(AutoNumeric.format('7342.561e40', bigNumber)).toEqual('73,425,610,000,000,000,000,000,000,000,000,000,000,000,000.00');
            expect(AutoNumeric.format('73.42561e42', bigNumber)).toEqual('73,425,610,000,000,000,000,000,000,000,000,000,000,000,000.00');
            expect(AutoNumeric.format('7.342561e43', bigNumber)).toEqual('73,425,610,000,000,000,000,000,000,000,000,000,000,000,000.00');
            expect(AutoNumeric.format('12345.67e-3', { decimalPlaces: 7 })).toEqual('12.3456700');
            expect(AutoNumeric.format('6.1349392e-13', { decimalPlaces: 24 })).toEqual('0.000000000000613493920000');
            expect(AutoNumeric.format('-1e8', { decimalPlaces: 0 })).toEqual('-100,000,000');
            expect(AutoNumeric.format('1.23456789e4', { decimalPlaces: 4 })).toEqual('12,345.6789');
            expect(AutoNumeric.format('1.23e-13')).toEqual('0.00');
        });

        it('should format negative values with brackets', () => {
            expect(AutoNumeric.format(-20, AutoNumeric.predefinedOptions.dollarNegBrackets)).toEqual('($20.00)');
            expect(AutoNumeric.format(-0.024, { negativeBracketsTypeOnBlur: AutoNumeric.options.negativeBracketsTypeOnBlur.japaneseQuotationMarks })).toEqual('｢0.02｣');
            expect(AutoNumeric.format(123.4578, { negativeBracketsTypeOnBlur: AutoNumeric.options.negativeBracketsTypeOnBlur.chevrons })).toEqual('123.46');
        });

        it('should only send a warning, and not throw', () => {
            spyOn(console, 'warn');
            expect(() => AutoNumeric.validate({ decimalPlaces: 3, decimalPlacesShownOnFocus: 2 })).not.toThrow();
            expect(console.warn).toHaveBeenCalled();
        });

        it('should fail formatting wrong parameters', () => {
            spyOn(console, 'warn');
            expect(() => AutoNumeric.format('foobar')).toThrow();
            expect(() => AutoNumeric.format([1234])).toThrow();
            expect(() => AutoNumeric.format({})).toThrow();
            expect(() => AutoNumeric.format({ val: 1234 })).toThrow();
            expect(() => AutoNumeric.format([])).toThrow();
            expect(console.warn).toHaveBeenCalledTimes(1);
        });

        it('should fail when trying to format a localized string with the wrong options', () => {
            spyOn(console, 'warn');
            expect(() => AutoNumeric.format('$1,234.56', autoNumericOptionsEuro)).toThrow();
            expect(() => AutoNumeric.format('$123.45', autoNumericOptionsEuro)).toThrow();
            expect(() => AutoNumeric.format('1.234,56 €', autoNumericOptionsDollar)).toThrow();
            expect(() => AutoNumeric.format('123,45 €', autoNumericOptionsDollar)).toThrow();
            expect(console.warn).toHaveBeenCalledTimes(4);
        });
    });

    describe('`set`', () => {
        it('should set the given value on the AutoNumeric element', () => {
            // Create a form element, 3 inputs, and only 2 autoNumeric ones
            const theForm = document.createElement('form');
            document.body.appendChild(theForm);
            const input1 = document.createElement('input');
            input1.id = 'inputSet1';
            const input2 = document.createElement('input');
            input2.id = 'inputSet2';
            theForm.appendChild(input1);
            theForm.appendChild(input2);
            
            // Initialize the two autoNumeric inputs
            const aNInput1 = new AutoNumeric(input1);
            const aNInput2 = new AutoNumeric(input2);
            
            expect(aNInput1.getNumericString()).toEqual('');
            expect(aNInput2.getNumericString()).toEqual('');
            AutoNumeric.set('#inputSet1', 1234578.32);
            expect(aNInput1.getNumericString()).toEqual('1234578.32');

            spyOn(console, 'warn');
            AutoNumeric.set('#inputSet2', null);
            expect(console.warn).toHaveBeenCalledTimes(1);
            expect(aNInput2.getNumericString()).toEqual('');
            AutoNumeric.set('#inputSet2', null, { emptyInputBehavior: AutoNumeric.options.emptyInputBehavior.null });
            expect(aNInput2.getNumericString()).toEqual(null);

            // Remove the 3 inputs and the form elements
            theForm.removeChild(input1);
            theForm.removeChild(input2);
            document.body.removeChild(theForm);
        });

        it('should not set any value on non-AutoNumeric elements', () => {
            // Create a form element and one non-AutoNumeric input
            const theForm = document.createElement('form');
            document.body.appendChild(theForm);
            const theInput = document.createElement('input');
            theInput.id = 'inputSet';
            theForm.appendChild(theInput);

            expect(theInput.value).toEqual('');
            spyOn(console, 'warn');
            AutoNumeric.set('#inputSet3', 42);
            expect(console.warn).toHaveBeenCalledTimes(1);
            expect(theInput.value).toEqual('');
            expect(AutoNumeric.set('#inputSet', 42)).toBeNull();
            expect(console.warn).toHaveBeenCalledTimes(2);

            // Remove the input and the form elements
            theForm.removeChild(theInput);
            document.body.removeChild(theForm);
        });
    });

    describe('static `get*` functions', () => {
        let aNInput;
        let newInput;
        let anotherInput;

        beforeEach(() => { // Initialization
            newInput = document.createElement('input');
            newInput.id = 'theNewInputId';
            document.body.appendChild(newInput);
            aNInput = new AutoNumeric(newInput).french(); // Initiate the autoNumeric input

            anotherInput = document.createElement('input');
            anotherInput.id = 'anotherInputId';
            document.body.appendChild(anotherInput);
        });

        afterEach(() => { // Un-initialization
            aNInput.remove();
            document.body.removeChild(newInput);
            document.body.removeChild(anotherInput);
        });

        it('`getNumericString` should return the numeric string', () => {
            aNInput.set(1234567.89);
            expect(AutoNumeric.getNumericString('#theNewInputId')).toEqual(aNInput.getNumericString());
            aNInput.set(0);
            expect(AutoNumeric.getNumericString('#theNewInputId')).toEqual(aNInput.getNumericString());
        });

        it('`getFormatted` should return the formatted value', () => {
            aNInput.set(1234567.89);
            expect(AutoNumeric.getFormatted('#theNewInputId')).toEqual(aNInput.getFormatted());
            aNInput.set(0);
            expect(AutoNumeric.getFormatted('#theNewInputId')).toEqual(aNInput.getFormatted());
        });

        it('`getNumber` should return a number', () => {
            aNInput.set(1234567.89);
            expect(AutoNumeric.getNumber('#theNewInputId')).toEqual(aNInput.getNumber());
            aNInput.set(0);
            expect(AutoNumeric.getNumber('#theNewInputId')).toEqual(aNInput.getNumber());
        });

        it('`getLocalized` should return a localized string', () => {
            aNInput.set(1234567.89);
            expect(AutoNumeric.getLocalized('#theNewInputId')).toEqual(aNInput.getLocalized());
            aNInput.set(0);
            expect(AutoNumeric.getLocalized('#theNewInputId')).toEqual(aNInput.getLocalized());
        });

        it('`getNumericString` should throw when trying to get a non-AutoNumeric-managed element', () => {
            expect(() => AutoNumeric.getNumericString('#anotherInputId')).toThrow();
            expect(() => AutoNumeric.getNumericString('#nonExistentId')).toThrow();
        });

        it('`getFormatted` should throw when trying to get a non-AutoNumeric-managed element', () => {
            expect(() => AutoNumeric.getFormatted('#anotherInputId')).toThrow();
            expect(() => AutoNumeric.getFormatted('#nonExistentId')).toThrow();
        });

        it('`getNumber` should throw when trying to get a non-AutoNumeric-managed element', () => {
            expect(() => AutoNumeric.getNumber('#anotherInputId')).toThrow();
            expect(() => AutoNumeric.getNumber('#nonExistentId')).toThrow();
        });

        it('`getLocalized` should throw when trying to get a non-AutoNumeric-managed element', () => {
            expect(() => AutoNumeric.getLocalized('#anotherInputId')).toThrow();
            expect(() => AutoNumeric.getLocalized('#nonExistentId')).toThrow();
        });
    });

    describe('`validate`', () => {
        it('should validate any old setting name, while outputting a warning', () => {
            const oldOptionObject = { aSep: ' ' };
            // Test if a warning is written in the console
            spyOn(console, 'warn');
            expect(() => AutoNumeric.validate(oldOptionObject)).not.toThrow();
            expect(AutoNumeric.areSettingsValid(oldOptionObject)).toEqual(true);
            /* eslint no-console: 0 */
            expect(console.warn).toHaveBeenCalled();

            // We make sure that the initial option object is modified accordingly
            expect(oldOptionObject).toEqual({ digitGroupSeparator: ' ' });
        });

        it('should validate multiple old setting names, while outputting as many warnings as needed', () => {
            const oldOptionObject = { aSep: ' ', aDec: ',', altDec: '.', aSign: ' €' };
            // Test if a warning is written in the console
            spyOn(console, 'warn');
            expect(() => AutoNumeric.validate(oldOptionObject)).not.toThrow();
            expect(AutoNumeric.areSettingsValid(oldOptionObject)).toEqual(true);
            /* eslint no-console: 0 */
            expect(console.warn).toHaveBeenCalled();
            expect(console.warn).toHaveBeenCalledTimes(4);

            // We make sure that the initial option object is modified accordingly
            expect(oldOptionObject).toEqual({ digitGroupSeparator: ' ', decimalCharacter: ',', decimalCharacterAlternative: '.', currencySymbol: ' €' });
        });

        it('should throw when using a unknown option name, if `failOnUnknownOption` is set to `TRUE`', () => {
            expect(() => AutoNumeric.validate({ failOnUnknownOption: true, foobar: '.' })).toThrow();
            expect(AutoNumeric.areSettingsValid({ failOnUnknownOption: true, foobar: '.' })).toEqual(false);
        });

        it('should not throw when using a unknown option name, if `failOnUnknownOption` is set to `FALSE`', () => {
            expect(() => AutoNumeric.validate({ foobar: '.' })).not.toThrow();
            expect(AutoNumeric.areSettingsValid({ foobar: '.' })).toEqual(true);
        });

        it('should validate', () => {
            expect(() => AutoNumeric.validate({})).not.toThrow();
            expect(() => AutoNumeric.validate(autoNumericOptionsEuro)).not.toThrow();
            expect(() => AutoNumeric.validate(autoNumericOptionsDollar)).not.toThrow();

            expect(() => AutoNumeric.validate({ caretPositionOnFocus: 'start' })).not.toThrow();
            expect(() => AutoNumeric.validate({ caretPositionOnFocus: 'end' })).not.toThrow();
            expect(() => AutoNumeric.validate({ caretPositionOnFocus: 'decimalLeft' })).not.toThrow();
            expect(() => AutoNumeric.validate({ caretPositionOnFocus: 'decimalRight' })).not.toThrow();
            expect(() => AutoNumeric.validate({ caretPositionOnFocus: null })).not.toThrow();

            expect(() => AutoNumeric.validate({ digitGroupSeparator: ',' })).not.toThrow();
            expect(() => AutoNumeric.validate({ digitGroupSeparator: '.',  decimalCharacter: ',' })).not.toThrow();
            expect(() => AutoNumeric.validate({ digitGroupSeparator: ' ' })).not.toThrow();
            expect(() => AutoNumeric.validate({ digitGroupSeparator: '\u2009' })).not.toThrow(); // Thin-space
            expect(() => AutoNumeric.validate({ digitGroupSeparator: '\u202f' })).not.toThrow(); // Narrow no-break space
            expect(() => AutoNumeric.validate({ digitGroupSeparator: '\u00a0' })).not.toThrow(); // No-break space
            expect(() => AutoNumeric.validate({ digitGroupSeparator: '' })).not.toThrow();
            expect(() => AutoNumeric.validate({ digitGroupSeparator: "'" })).not.toThrow();
            expect(() => AutoNumeric.validate({ digitGroupSeparator: '٬' })).not.toThrow();
            expect(() => AutoNumeric.validate({ digitGroupSeparator: '˙' })).not.toThrow();

            expect(() => AutoNumeric.validate({ alwaysAllowDecimalCharacter: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ alwaysAllowDecimalCharacter: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ alwaysAllowDecimalCharacter: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ alwaysAllowDecimalCharacter: 'false' })).not.toThrow();

            expect(() => AutoNumeric.validate({ createLocalList: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ createLocalList: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ createLocalList: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ createLocalList: 'false' })).not.toThrow();

            expect(() => AutoNumeric.validate({ showOnlyNumbersOnFocus: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ showOnlyNumbersOnFocus: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ showOnlyNumbersOnFocus: 'false' })).not.toThrow();
            expect(() => AutoNumeric.validate({ showOnlyNumbersOnFocus: 'true' })).not.toThrow();

            expect(() => AutoNumeric.validate({ digitalGroupSpacing: '2' })).not.toThrow();
            expect(() => AutoNumeric.validate({ digitalGroupSpacing: 2 })).not.toThrow();
            expect(() => AutoNumeric.validate({ digitalGroupSpacing: '2s' })).not.toThrow();
            expect(() => AutoNumeric.validate({ digitalGroupSpacing: '3' })).not.toThrow();
            expect(() => AutoNumeric.validate({ digitalGroupSpacing: 3 })).not.toThrow();
            expect(() => AutoNumeric.validate({ digitalGroupSpacing: '4' })).not.toThrow();
            expect(() => AutoNumeric.validate({ digitalGroupSpacing: 4 })).not.toThrow();

            expect(() => AutoNumeric.validate({ decimalCharacter: ',', digitGroupSeparator: ' ' })).not.toThrow();
            expect(() => AutoNumeric.validate({ decimalCharacter: '.' })).not.toThrow();
            expect(() => AutoNumeric.validate({ decimalCharacter: '·' })).not.toThrow();
            expect(() => AutoNumeric.validate({ decimalCharacter: '٫' })).not.toThrow();
            expect(() => AutoNumeric.validate({ decimalCharacter: '⎖' })).not.toThrow();

            expect(() => AutoNumeric.validate({ decimalCharacterAlternative: null })).not.toThrow();
            expect(() => AutoNumeric.validate({ decimalCharacterAlternative: 'longSeparator' })).not.toThrow();

            expect(() => AutoNumeric.validate({ currencySymbol: ' €' })).not.toThrow();
            expect(() => AutoNumeric.validate({ currencySymbol: '' })).not.toThrow();
            expect(() => AutoNumeric.validate({ currencySymbol: 'foobar' })).not.toThrow();

            expect(() => AutoNumeric.validate({ currencySymbolPlacement: 'p' })).not.toThrow();
            expect(() => AutoNumeric.validate({ currencySymbolPlacement: 's' })).not.toThrow();

            expect(() => AutoNumeric.validate({ negativePositiveSignPlacement: 'p' })).not.toThrow();
            expect(() => AutoNumeric.validate({ negativePositiveSignPlacement: 's' })).not.toThrow();
            expect(() => AutoNumeric.validate({ negativePositiveSignPlacement: 'l' })).not.toThrow();
            expect(() => AutoNumeric.validate({ negativePositiveSignPlacement: 'r' })).not.toThrow();
            expect(() => AutoNumeric.validate({ negativePositiveSignPlacement: null })).not.toThrow();

            expect(() => AutoNumeric.validate({ showPositiveSign: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ showPositiveSign: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ showPositiveSign: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ showPositiveSign: 'false' })).not.toThrow();

            expect(() => AutoNumeric.validate({ styleRules: null })).not.toThrow();
            expect(() => AutoNumeric.validate({ styleRules: { positive: null } })).not.toThrow();
            expect(() => AutoNumeric.validate({ styleRules: { negative: null } })).not.toThrow();
            expect(() => AutoNumeric.validate({ styleRules: { ranges: null } })).not.toThrow();
            expect(() => AutoNumeric.validate({ styleRules: { userDefined: null } })).not.toThrow();
            expect(() => AutoNumeric.validate({
                styleRules: {
                    userDefined: [
                        { callback: () => {} },
                    ],
                },
            })).not.toThrow();

            expect(() => AutoNumeric.validate({ suffixText: '' })).not.toThrow();
            expect(() => AutoNumeric.validate({ suffixText: 'foobar' })).not.toThrow();
            expect(() => AutoNumeric.validate({ suffixText: ' foobar' })).not.toThrow();
            expect(() => AutoNumeric.validate({ suffixText: 'foo bar' })).not.toThrow();
            expect(() => AutoNumeric.validate({ suffixText: 'foobar ' })).not.toThrow();

            expect(() => AutoNumeric.validate({ overrideMinMaxLimits: null })).not.toThrow();
            expect(() => AutoNumeric.validate({ overrideMinMaxLimits: 'ceiling' })).not.toThrow();
            expect(() => AutoNumeric.validate({ overrideMinMaxLimits: 'floor' })).not.toThrow();
            expect(() => AutoNumeric.validate({ overrideMinMaxLimits: 'ignore' })).not.toThrow();
            expect(() => AutoNumeric.validate({ overrideMinMaxLimits: 'invalid' })).not.toThrow();

            spyOn(console, 'warn');
            expect(() => AutoNumeric.validate({ maximumValue: '42' })).not.toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: '42.4' })).not.toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: '42.42' })).not.toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: '-42' })).not.toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: '-42.4' })).not.toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: '-42.42' })).not.toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: '10000000000000' })).not.toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: '-10000000000000' })).not.toThrow();

            expect(() => AutoNumeric.validate({ minimumValue: '42' })).not.toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '42.4' })).not.toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '42.42' })).not.toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '-42' })).not.toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '-42.4' })).not.toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '-42.42' })).not.toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '10000000000000' })).not.toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '-10000000000000' })).not.toThrow();

            expect(() => AutoNumeric.validate({ minimumValue: '-10', maximumValue: '-5' })).not.toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '-10', maximumValue:  '0' })).not.toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '-10', maximumValue: '20' })).not.toThrow();
            expect(() => AutoNumeric.validate({ minimumValue:   '0', maximumValue: '20' })).not.toThrow();
            expect(() => AutoNumeric.validate({ minimumValue:  '10', maximumValue: '20' })).not.toThrow();

            expect(() => AutoNumeric.validate({ decimalPlaces: '0' })).not.toThrow();
            expect(() => AutoNumeric.validate({ decimalPlaces: '2' })).not.toThrow();
            expect(() => AutoNumeric.validate({ decimalPlaces: 5 })).not.toThrow();
            expect(() => AutoNumeric.validate({ decimalPlaces: '10' })).not.toThrow();
            expect(() => AutoNumeric.validate({ decimalPlaces: '2', minimumValue: '0', maximumValue: '20' })).not.toThrow();

            expect(() => AutoNumeric.validate({ decimalPlacesRawValue: null })).not.toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesRawValue: '2' })).not.toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesRawValue: 5 })).not.toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesRawValue: '10' })).not.toThrow();

            expect(() => AutoNumeric.validate({ decimalPlacesShownOnFocus: null })).not.toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesShownOnFocus: '2' })).not.toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesShownOnFocus: 5 })).not.toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesShownOnFocus: '15' })).not.toThrow();

            expect(() => AutoNumeric.validate({ decimalPlaces: '2', decimalPlacesShownOnFocus: '2' })).not.toThrow();
            expect(() => AutoNumeric.validate({ decimalPlaces: '2', decimalPlacesShownOnFocus: '3' })).not.toThrow();

            expect(() => AutoNumeric.validate({ rawValueDivisor: null })).not.toThrow();
            expect(() => AutoNumeric.validate({ rawValueDivisor: '100' })).not.toThrow();
            expect(() => AutoNumeric.validate({ rawValueDivisor: 100 })).not.toThrow();
            expect(() => AutoNumeric.validate({ rawValueDivisor: 45.89 })).not.toThrow();

            expect(() => AutoNumeric.validate({ divisorWhenUnfocused: null })).not.toThrow();
            expect(() => AutoNumeric.validate({ divisorWhenUnfocused: '100' })).not.toThrow();
            expect(() => AutoNumeric.validate({ divisorWhenUnfocused: 100 })).not.toThrow();
            expect(() => AutoNumeric.validate({ divisorWhenUnfocused: 45.89 })).not.toThrow();

            expect(() => AutoNumeric.validate({ decimalPlacesShownOnBlur: null })).not.toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesShownOnBlur: 0 })).not.toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesShownOnBlur: 2 })).not.toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesShownOnBlur: '5' })).not.toThrow();

            expect(() => AutoNumeric.validate({ symbolWhenUnfocused: null })).not.toThrow();
            expect(() => AutoNumeric.validate({ symbolWhenUnfocused: '' })).not.toThrow();
            expect(() => AutoNumeric.validate({ symbolWhenUnfocused: 'foobar' })).not.toThrow();
            expect(() => AutoNumeric.validate({ symbolWhenUnfocused: 'foo bar' })).not.toThrow();
            expect(() => AutoNumeric.validate({ symbolWhenUnfocused: ' foobar' })).not.toThrow();
            expect(() => AutoNumeric.validate({ symbolWhenUnfocused: 'foobar ' })).not.toThrow();

            expect(() => AutoNumeric.validate({ saveValueToSessionStorage: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ saveValueToSessionStorage: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ saveValueToSessionStorage: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ saveValueToSessionStorage: 'false' })).not.toThrow();

            expect(() => AutoNumeric.validate({ onInvalidPaste: 'error' })).not.toThrow();
            expect(() => AutoNumeric.validate({ onInvalidPaste: 'ignore' })).not.toThrow();
            expect(() => AutoNumeric.validate({ onInvalidPaste: 'clamp' })).not.toThrow();
            expect(() => AutoNumeric.validate({ onInvalidPaste: 'truncate' })).not.toThrow();
            expect(() => AutoNumeric.validate({ onInvalidPaste: 'replace' })).not.toThrow();

            expect(() => AutoNumeric.validate({ roundingMethod: 'S' })).not.toThrow();
            expect(() => AutoNumeric.validate({ roundingMethod: 'A' })).not.toThrow();
            expect(() => AutoNumeric.validate({ roundingMethod: 's' })).not.toThrow();
            expect(() => AutoNumeric.validate({ roundingMethod: 'a' })).not.toThrow();
            expect(() => AutoNumeric.validate({ roundingMethod: 'B' })).not.toThrow();
            expect(() => AutoNumeric.validate({ roundingMethod: 'U' })).not.toThrow();
            expect(() => AutoNumeric.validate({ roundingMethod: 'D' })).not.toThrow();
            expect(() => AutoNumeric.validate({ roundingMethod: 'C' })).not.toThrow();
            expect(() => AutoNumeric.validate({ roundingMethod: 'F' })).not.toThrow();
            expect(() => AutoNumeric.validate({ roundingMethod: 'N05' })).not.toThrow();
            expect(() => AutoNumeric.validate({ roundingMethod: 'CHF' })).not.toThrow();
            expect(() => AutoNumeric.validate({ roundingMethod: 'U05' })).not.toThrow();
            expect(() => AutoNumeric.validate({ roundingMethod: 'D05' })).not.toThrow();

            expect(() => AutoNumeric.validate({ allowDecimalPadding: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ allowDecimalPadding: 'true' })).not.toThrow();
            // The allowDecimalPadding tests with the `false` value is done in the next test, since it outputs a warning

            expect(() => AutoNumeric.validate({ negativeBracketsTypeOnBlur: null })).not.toThrow();
            expect(() => AutoNumeric.validate({ negativeBracketsTypeOnBlur: '(,)' })).not.toThrow();
            expect(() => AutoNumeric.validate({ negativeBracketsTypeOnBlur: '[,]' })).not.toThrow();
            expect(() => AutoNumeric.validate({ negativeBracketsTypeOnBlur: '<,>' })).not.toThrow();
            expect(() => AutoNumeric.validate({ negativeBracketsTypeOnBlur: '{,}' })).not.toThrow();
            expect(() => AutoNumeric.validate({ negativeBracketsTypeOnBlur: '〈,〉' })).not.toThrow();
            expect(() => AutoNumeric.validate({ negativeBracketsTypeOnBlur: '｢,｣' })).not.toThrow();
            expect(() => AutoNumeric.validate({ negativeBracketsTypeOnBlur: '⸤,⸥' })).not.toThrow();
            expect(() => AutoNumeric.validate({ negativeBracketsTypeOnBlur: '⟦,⟧' })).not.toThrow();
            expect(() => AutoNumeric.validate({ negativeBracketsTypeOnBlur: '‹,›' })).not.toThrow();
            expect(() => AutoNumeric.validate({ negativeBracketsTypeOnBlur: '«,»' })).not.toThrow();

            expect(() => AutoNumeric.validate({ negativeSignCharacter: '-' })).not.toThrow();
            expect(() => AutoNumeric.validate({ negativeSignCharacter: '+', positiveSignCharacter: '∅' })).not.toThrow(); // Not recommended, but possible
            expect(() => AutoNumeric.validate({ negativeSignCharacter: '_' })).not.toThrow();
            expect(() => AutoNumeric.validate({ negativeSignCharacter: ' ' })).not.toThrow();
            expect(() => AutoNumeric.validate({ negativeSignCharacter: 'a' })).not.toThrow();
            expect(() => AutoNumeric.validate({ negativeSignCharacter: AutoNumeric.options.negativeSignCharacter.not })).not.toThrow();

            expect(() => AutoNumeric.validate({ positiveSignCharacter: '+' })).not.toThrow();
            expect(() => AutoNumeric.validate({ positiveSignCharacter: '-', negativeSignCharacter: '∅' })).not.toThrow(); // Not recommended, but possible
            expect(() => AutoNumeric.validate({ positiveSignCharacter: '_' })).not.toThrow();
            expect(() => AutoNumeric.validate({ positiveSignCharacter: ' ' })).not.toThrow();
            expect(() => AutoNumeric.validate({ positiveSignCharacter: 'a' })).not.toThrow();
            expect(() => AutoNumeric.validate({ positiveSignCharacter: AutoNumeric.options.positiveSignCharacter.plusMinus })).not.toThrow();

            expect(() => AutoNumeric.validate({ emptyInputBehavior: 'focus' })).not.toThrow();
            expect(() => AutoNumeric.validate({ emptyInputBehavior: 'press' })).not.toThrow();
            expect(() => AutoNumeric.validate({ emptyInputBehavior: 'always' })).not.toThrow();
            expect(() => AutoNumeric.validate({ emptyInputBehavior: 'zero' })).not.toThrow();
            expect(() => AutoNumeric.validate({ emptyInputBehavior: 'null' })).not.toThrow();
            expect(() => AutoNumeric.validate({ emptyInputBehavior: 'min' })).not.toThrow();
            expect(() => AutoNumeric.validate({ emptyInputBehavior: 'max' })).not.toThrow();
            expect(() => AutoNumeric.validate({ emptyInputBehavior: '-5' })).not.toThrow();
            expect(() => AutoNumeric.validate({ emptyInputBehavior: 5 })).not.toThrow();
            expect(() => AutoNumeric.validate({ emptyInputBehavior: -5 })).not.toThrow();

            expect(() => AutoNumeric.validate({ eventBubbles: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ eventBubbles: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ eventBubbles: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ eventBubbles: 'false' })).not.toThrow();

            expect(() => AutoNumeric.validate({ eventIsCancelable: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ eventIsCancelable: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ eventIsCancelable: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ eventIsCancelable: 'false' })).not.toThrow();

            expect(() => AutoNumeric.validate({ leadingZero: 'allow' })).not.toThrow();
            expect(() => AutoNumeric.validate({ leadingZero: 'deny' })).not.toThrow();
            expect(() => AutoNumeric.validate({ leadingZero: 'keep' })).not.toThrow();

            expect(() => AutoNumeric.validate({ formatOnPageLoad: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ formatOnPageLoad: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ formatOnPageLoad: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ formatOnPageLoad: 'false' })).not.toThrow();

            expect(() => AutoNumeric.validate({ formulaMode: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ formulaMode: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ formulaMode: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ formulaMode: 'false' })).not.toThrow();

            expect(() => AutoNumeric.validate({ historySize: 1 })).not.toThrow();
            expect(() => AutoNumeric.validate({ historySize: 10 })).not.toThrow();
            expect(() => AutoNumeric.validate({ historySize: 1000 })).not.toThrow();

            expect(() => AutoNumeric.validate({ historySize: '1' })).not.toThrow();
            expect(() => AutoNumeric.validate({ historySize: '10' })).not.toThrow();
            expect(() => AutoNumeric.validate({ historySize: '1000' })).not.toThrow();

            expect(() => AutoNumeric.validate({ selectNumberOnly: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ selectNumberOnly: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ selectNumberOnly: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ selectNumberOnly: 'false' })).not.toThrow();

            expect(() => AutoNumeric.validate({ selectOnFocus: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ selectOnFocus: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ selectOnFocus: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ selectOnFocus: 'false' })).not.toThrow();

            expect(() => AutoNumeric.validate({ defaultValueOverride: null })).not.toThrow();
            expect(() => AutoNumeric.validate({ defaultValueOverride: '' })).not.toThrow();
            expect(() => AutoNumeric.validate({ defaultValueOverride: '42' })).not.toThrow();
            expect(() => AutoNumeric.validate({ defaultValueOverride: '-42' })).not.toThrow();
            expect(() => AutoNumeric.validate({ defaultValueOverride: '42.99' })).not.toThrow();
            expect(() => AutoNumeric.validate({ defaultValueOverride: '-42.99' })).not.toThrow();
            expect(() => AutoNumeric.validate({ defaultValueOverride: 5 })).not.toThrow();
            expect(() => AutoNumeric.validate({ defaultValueOverride: -5 })).not.toThrow();

            expect(() => AutoNumeric.validate({ unformatOnSubmit: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ unformatOnSubmit: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ unformatOnSubmit: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ unformatOnSubmit: 'false' })).not.toThrow();

            expect(() => AutoNumeric.validate({ outputFormat: null })).not.toThrow();
            expect(() => AutoNumeric.validate({ outputFormat: 'string' })).not.toThrow();
            expect(() => AutoNumeric.validate({ outputFormat: 'number' })).not.toThrow();
            expect(() => AutoNumeric.validate({ outputFormat: '.' })).not.toThrow();
            expect(() => AutoNumeric.validate({ outputFormat: '-.' })).not.toThrow();
            expect(() => AutoNumeric.validate({ outputFormat: ',' })).not.toThrow();
            expect(() => AutoNumeric.validate({ outputFormat: '-,' })).not.toThrow();
            expect(() => AutoNumeric.validate({ outputFormat: '.-' })).not.toThrow();
            expect(() => AutoNumeric.validate({ outputFormat: ',-' })).not.toThrow();

            expect(() => AutoNumeric.validate({ invalidClass: 'an-invalid' })).not.toThrow();
            expect(() => AutoNumeric.validate({ invalidClass: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ invalidClass: 'false' })).not.toThrow();
            expect(() => AutoNumeric.validate({ invalidClass: 'foobar' })).not.toThrow();

            expect(() => AutoNumeric.validate({ isCancellable: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ isCancellable: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ isCancellable: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ isCancellable: 'false' })).not.toThrow();

            expect(() => AutoNumeric.validate({ modifyValueOnWheel: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ modifyValueOnWheel: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ modifyValueOnWheel: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ modifyValueOnWheel: 'false' })).not.toThrow();

            expect(() => AutoNumeric.validate({ wheelOn: 'focus' })).not.toThrow();
            expect(() => AutoNumeric.validate({ wheelOn: 'hover' })).not.toThrow();

            expect(() => AutoNumeric.validate({ wheelStep: 'progressive' })).not.toThrow();
            expect(() => AutoNumeric.validate({ wheelStep: '1000' })).not.toThrow();
            expect(() => AutoNumeric.validate({ wheelStep: '422.345' })).not.toThrow();
            expect(() => AutoNumeric.validate({ wheelStep: 1000 })).not.toThrow();
            expect(() => AutoNumeric.validate({ wheelStep: 422.345 })).not.toThrow();

            expect(() => AutoNumeric.validate({ serializeSpaces: '+' })).not.toThrow();
            expect(() => AutoNumeric.validate({ serializeSpaces: '%20' })).not.toThrow();

            expect(() => AutoNumeric.validate({ showWarnings: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ showWarnings: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ showWarnings: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ showWarnings: 'false' })).not.toThrow();

            expect(() => AutoNumeric.validate({ noEventListeners: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ noEventListeners: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ noEventListeners: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ noEventListeners: 'false' })).not.toThrow();

            expect(() => AutoNumeric.validate({ readOnly: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ readOnly: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ readOnly: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ readOnly: 'false' })).not.toThrow();

            expect(() => AutoNumeric.validate({ unformatOnHover: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ unformatOnHover: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ unformatOnHover: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ unformatOnHover: 'false' })).not.toThrow();

            expect(() => AutoNumeric.validate({ failOnUnknownOption: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ failOnUnknownOption: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ failOnUnknownOption: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ failOnUnknownOption: 'false' })).not.toThrow();

            expect(() => AutoNumeric.validate({ valuesToStrings: null })).not.toThrow();
            expect(() => AutoNumeric.validate({ valuesToStrings: {} })).not.toThrow();
            expect(() => AutoNumeric.validate({ valuesToStrings: { 0: null } })).not.toThrow();
            expect(() => AutoNumeric.validate({ valuesToStrings: { 0: '-' } })).not.toThrow();
            expect(() => AutoNumeric.validate({ valuesToStrings: { 0: 'zero' } })).not.toThrow();
            expect(() => AutoNumeric.validate({ valuesToStrings: { '-225.34': 'foobar' } })).not.toThrow();

            expect(() => AutoNumeric.validate({ watchExternalChanges: true })).not.toThrow();
            expect(() => AutoNumeric.validate({ watchExternalChanges: false })).not.toThrow();
            expect(() => AutoNumeric.validate({ watchExternalChanges: 'true' })).not.toThrow();
            expect(() => AutoNumeric.validate({ watchExternalChanges: 'false' })).not.toThrow();
        });

        it('should validate, with warnings', () => {
            spyOn(console, 'warn');
            expect(() => AutoNumeric.validate({ decimalPlaces: '3', decimalPlacesShownOnFocus: '2' })).not.toThrow();
            expect(console.warn).toHaveBeenCalledTimes(1);
            expect(() => AutoNumeric.validate({ allowDecimalPadding: AutoNumeric.options.allowDecimalPadding.never, decimalPlaces: '2' })).not.toThrow();
            expect(console.warn).toHaveBeenCalledTimes(2);

            expect(() => AutoNumeric.validate({ selectOnFocus: AutoNumeric.options.selectOnFocus.select, caretPositionOnFocus: AutoNumeric.options.caretPositionOnFocus.decimalLeft })).not.toThrow();
            expect(console.warn).toHaveBeenCalledTimes(3);
            expect(() => AutoNumeric.validate({}, true, { selectOnFocus: AutoNumeric.options.selectOnFocus.select, caretPositionOnFocus: AutoNumeric.options.caretPositionOnFocus.decimalLeft })).not.toThrow();
            expect(console.warn).toHaveBeenCalledTimes(4);

            expect(() => AutoNumeric.validate({ decimalPlacesRawValue: '0' })).not.toThrow();
            expect(console.warn).toHaveBeenCalledTimes(5);
            expect(() => AutoNumeric.validate({ decimalPlacesShownOnFocus: '0' })).not.toThrow();
            expect(console.warn).toHaveBeenCalledTimes(6);

            expect(() => AutoNumeric.validate({ allowDecimalPadding: false })).not.toThrow();
            expect(console.warn).toHaveBeenCalledTimes(7);
            expect(() => AutoNumeric.validate({ allowDecimalPadding: 'false' })).not.toThrow();
            expect(console.warn).toHaveBeenCalledTimes(8);
        });

        it('should validate, without warnings', () => {
            expect(() => AutoNumeric.validate({ allowDecimalPadding: AutoNumeric.options.allowDecimalPadding.floats })).not.toThrow();
            expect(() => AutoNumeric.validate({ allowDecimalPadding: AutoNumeric.options.allowDecimalPadding.floats, decimalPlaces: '2' })).not.toThrow();
        });

        it('should not validate', () => {
            expect(() => AutoNumeric.validate(0)).toThrow();
            expect(() => AutoNumeric.validate(undefined)).toThrow();
            expect(() => AutoNumeric.validate(null)).toThrow();
            expect(() => AutoNumeric.validate('')).toThrow();
            expect(() => AutoNumeric.validate([])).toThrow();
            expect(() => AutoNumeric.validate([{ digitGroupSeparator: '.' }])).toThrow();
            expect(() => AutoNumeric.validate('foobar')).toThrow();
            expect(() => AutoNumeric.validate(42)).toThrow();

            expect(() => AutoNumeric.validate({ caretPositionOnFocus: 42 })).toThrow();
            expect(() => AutoNumeric.validate({ caretPositionOnFocus: -42 })).toThrow();
            expect(() => AutoNumeric.validate({ caretPositionOnFocus: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ caretPositionOnFocus: '-' })).toThrow();
            expect(() => AutoNumeric.validate({ caretPositionOnFocus: 'a' })).toThrow();
            expect(() => AutoNumeric.validate({ caretPositionOnFocus: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ caretPositionOnFocus: true })).toThrow();

            expect(() => AutoNumeric.validate({ digitGroupSeparator: '-' })).toThrow();
            expect(() => AutoNumeric.validate({ digitGroupSeparator: '"' })).toThrow();
            expect(() => AutoNumeric.validate({ digitGroupSeparator: 'a' })).toThrow();
            expect(() => AutoNumeric.validate({ digitGroupSeparator: 42 })).toThrow();
            expect(() => AutoNumeric.validate({ digitGroupSeparator: '.' })).toThrow(); // Since the default 'decimalCharacter' is '.' too
            expect(() => AutoNumeric.validate({ digitGroupSeparator: true })).toThrow();
            expect(() => AutoNumeric.validate({ digitGroupSeparator: null })).toThrow();

            expect(() => AutoNumeric.validate({ alwaysAllowDecimalCharacter: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ alwaysAllowDecimalCharacter: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ alwaysAllowDecimalCharacter: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ alwaysAllowDecimalCharacter: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ alwaysAllowDecimalCharacter: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ createLocalList: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ createLocalList: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ createLocalList: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ createLocalList: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ createLocalList: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ showOnlyNumbersOnFocus: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ showOnlyNumbersOnFocus: 42 })).toThrow();
            expect(() => AutoNumeric.validate({ showOnlyNumbersOnFocus: null })).toThrow();

            expect(() => AutoNumeric.validate({ digitalGroupSpacing: '-2' })).toThrow();
            expect(() => AutoNumeric.validate({ digitalGroupSpacing: -2 })).toThrow();
            expect(() => AutoNumeric.validate({ digitalGroupSpacing: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ digitalGroupSpacing: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ digitalGroupSpacing: '5' })).toThrow();
            expect(() => AutoNumeric.validate({ digitalGroupSpacing: 5 })).toThrow();
            expect(() => AutoNumeric.validate({ digitalGroupSpacing: '10' })).toThrow();
            expect(() => AutoNumeric.validate({ digitalGroupSpacing: 10 })).toThrow();
            expect(() => AutoNumeric.validate({ digitalGroupSpacing: '2ss' })).toThrow();
            expect(() => AutoNumeric.validate({ digitalGroupSpacing: 'a37' })).toThrow();
            expect(() => AutoNumeric.validate({ digitalGroupSpacing: '37foo' })).toThrow();
            expect(() => AutoNumeric.validate({ digitalGroupSpacing: null })).toThrow();
            expect(() => AutoNumeric.validate({ digitalGroupSpacing: [] })).toThrow();
            expect(() => AutoNumeric.validate({ digitalGroupSpacing: {} })).toThrow();

            expect(() => AutoNumeric.validate({ decimalCharacter: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ decimalCharacter: true })).toThrow();
            expect(() => AutoNumeric.validate({ decimalCharacter: 42 })).toThrow();
            expect(() => AutoNumeric.validate({ decimalCharacter: '.', digitGroupSeparator: '.' })).toThrow();
            expect(() => AutoNumeric.validate({ decimalCharacter: ',', digitGroupSeparator: ',' })).toThrow();

            expect(() => AutoNumeric.validate({ decimalCharacterAlternative: 42 })).toThrow();
            expect(() => AutoNumeric.validate({ decimalCharacterAlternative: true })).toThrow();
            expect(() => AutoNumeric.validate({ decimalCharacterAlternative: ['foobar'] })).toThrow();

            expect(() => AutoNumeric.validate({ currencySymbol: [] })).toThrow();
            expect(() => AutoNumeric.validate({ currencySymbol: 42 })).toThrow();
            expect(() => AutoNumeric.validate({ currencySymbol: true })).toThrow();
            expect(() => AutoNumeric.validate({ currencySymbol: null })).toThrow();

            expect(() => AutoNumeric.validate({ currencySymbolPlacement: ['s'] })).toThrow();
            expect(() => AutoNumeric.validate({ currencySymbolPlacement: 42 })).toThrow();
            expect(() => AutoNumeric.validate({ currencySymbolPlacement: true })).toThrow();
            expect(() => AutoNumeric.validate({ currencySymbolPlacement: null })).toThrow();
            expect(() => AutoNumeric.validate({ currencySymbolPlacement: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ negativePositiveSignPlacement: ['r'] })).toThrow();
            expect(() => AutoNumeric.validate({ negativePositiveSignPlacement: 42 })).toThrow();
            expect(() => AutoNumeric.validate({ negativePositiveSignPlacement: true })).toThrow();
            expect(() => AutoNumeric.validate({ negativePositiveSignPlacement: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ showPositiveSign: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ showPositiveSign: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ showPositiveSign: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ showPositiveSign: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ showPositiveSign: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ styleRules: { } })).toThrow();
            expect(() => AutoNumeric.validate({ styleRules: true })).toThrow();
            expect(() => AutoNumeric.validate({ styleRules: 42 })).toThrow();
            expect(() => AutoNumeric.validate({ styleRules: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({
                styleRules: {
                    userDefined: [
                        { callback: 'foobar' },
                    ],
                },
            })).toThrow();

            expect(() => AutoNumeric.validate({ suffixText: '-foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ suffixText: 'foo-bar' })).toThrow();
            expect(() => AutoNumeric.validate({ suffixText: 'foo42bar' })).toThrow();
            expect(() => AutoNumeric.validate({ suffixText: '42foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ suffixText: 'foobar42' })).toThrow();
            expect(() => AutoNumeric.validate({ suffixText: 42 })).toThrow();
            expect(() => AutoNumeric.validate({ suffixText: -42 })).toThrow();
            expect(() => AutoNumeric.validate({ suffixText: true })).toThrow();
            expect(() => AutoNumeric.validate({ suffixText: null })).toThrow();

            expect(() => AutoNumeric.validate({ overrideMinMaxLimits: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ overrideMinMaxLimits: 42 })).toThrow();
            expect(() => AutoNumeric.validate({ overrideMinMaxLimits: true })).toThrow();

            spyOn(console, 'warn');
            expect(() => AutoNumeric.validate({ maximumValue: true })).toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: null })).toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: 42 })).toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: 42.42 })).toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: -42 })).toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: -42.42 })).toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: '42.' })).toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: '-42.' })).toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: '.42' })).toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: '-42foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: '9999999999999,99' })).toThrow();
            expect(() => AutoNumeric.validate({ maximumValue: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ minimumValue: true })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: null })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: 42 })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: 42.42 })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: -42 })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: -42.42 })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '42.' })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '-42.' })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '.42' })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '-42foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '9999999999999,99' })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ minimumValue: '20', maximumValue: '-10' })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '-5', maximumValue: '-10' })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue:  '0', maximumValue: '-10' })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '20', maximumValue: '-10' })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '20', maximumValue:   '0' })).toThrow();
            expect(() => AutoNumeric.validate({ minimumValue: '20', maximumValue:  '10' })).toThrow();

            expect(() => AutoNumeric.validate({ decimalPlaces: [] })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlaces: true })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlaces: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlaces: '22foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlaces: '-5' })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlaces: -5 })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlaces: null })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlaces: 2.3 })).toThrow();

            expect(() => AutoNumeric.validate({ decimalPlacesRawValue: [] })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesRawValue: true })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesRawValue: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesRawValue: '22foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesRawValue: '-5' })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesRawValue: -5 })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesRawValue: 2.3 })).toThrow();

            expect(() => AutoNumeric.validate({ decimalPlacesShownOnFocus: [] })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesShownOnFocus: true })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesShownOnFocus: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesShownOnFocus: '22foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesShownOnFocus: '-5' })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesShownOnFocus: -5 })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesShownOnFocus: 2.3 })).toThrow();

            expect(() => AutoNumeric.validate({ rawValueDivisor: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ rawValueDivisor: true })).toThrow();
            expect(() => AutoNumeric.validate({ rawValueDivisor: -1000 })).toThrow();
            expect(() => AutoNumeric.validate({ rawValueDivisor: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ rawValueDivisor: 1 })).toThrow();

            expect(() => AutoNumeric.validate({ divisorWhenUnfocused: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ divisorWhenUnfocused: true })).toThrow();
            expect(() => AutoNumeric.validate({ divisorWhenUnfocused: -1000 })).toThrow();
            expect(() => AutoNumeric.validate({ divisorWhenUnfocused: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ divisorWhenUnfocused: 1 })).toThrow();

            expect(() => AutoNumeric.validate({ decimalPlacesShownOnBlur: [] })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesShownOnBlur: true })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesShownOnBlur: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesShownOnBlur: '22foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesShownOnBlur: '-5' })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesShownOnBlur: -5 })).toThrow();
            expect(() => AutoNumeric.validate({ decimalPlacesShownOnBlur: 2.3 })).toThrow();

            expect(() => AutoNumeric.validate({ symbolWhenUnfocused: true })).toThrow();
            expect(() => AutoNumeric.validate({ symbolWhenUnfocused: 42 })).toThrow();
            expect(() => AutoNumeric.validate({ symbolWhenUnfocused: [] })).toThrow();

            expect(() => AutoNumeric.validate({ saveValueToSessionStorage: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ saveValueToSessionStorage: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ saveValueToSessionStorage: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ saveValueToSessionStorage: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ saveValueToSessionStorage: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ onInvalidPaste: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ onInvalidPaste: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ onInvalidPaste: -42 })).toThrow();
            expect(() => AutoNumeric.validate({ onInvalidPaste: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ onInvalidPaste: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ onInvalidPaste: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ onInvalidPaste: 0.5 })).toThrow();
            expect(() => AutoNumeric.validate({ onInvalidPaste: true })).toThrow();
            expect(() => AutoNumeric.validate({ onInvalidPaste: null })).toThrow();
            expect(() => AutoNumeric.validate({ onInvalidPaste: [] })).toThrow();

            expect(() => AutoNumeric.validate({ roundingMethod: 0.5 })).toThrow();
            expect(() => AutoNumeric.validate({ roundingMethod: true })).toThrow();
            expect(() => AutoNumeric.validate({ roundingMethod: null })).toThrow();
            expect(() => AutoNumeric.validate({ roundingMethod: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ allowDecimalPadding: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ allowDecimalPadding: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ allowDecimalPadding: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ allowDecimalPadding: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ allowDecimalPadding: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ negativeBracketsTypeOnBlur: [] })).toThrow();
            expect(() => AutoNumeric.validate({ negativeBracketsTypeOnBlur: true })).toThrow();
            expect(() => AutoNumeric.validate({ negativeBracketsTypeOnBlur: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ negativeBracketsTypeOnBlur: '22foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ negativeBracketsTypeOnBlur: '-5' })).toThrow();
            expect(() => AutoNumeric.validate({ negativeBracketsTypeOnBlur: 5 })).toThrow();
            expect(() => AutoNumeric.validate({ negativeBracketsTypeOnBlur: -5 })).toThrow();

            expect(() => AutoNumeric.validate({ negativeSignCharacter: 'ab' })).toThrow();
            expect(() => AutoNumeric.validate({ negativeSignCharacter: true })).toThrow();
            expect(() => AutoNumeric.validate({ negativeSignCharacter: [] })).toThrow();
            expect(() => AutoNumeric.validate({ negativeSignCharacter: {} })).toThrow();
            expect(() => AutoNumeric.validate({ negativeSignCharacter: null })).toThrow();
            expect(() => AutoNumeric.validate({ negativeSignCharacter: '' })).toThrow();
            expect(() => AutoNumeric.validate({ negativeSignCharacter: 2 })).toThrow();
            expect(() => AutoNumeric.validate({ negativeSignCharacter: 2.5 })).toThrow();

            expect(() => AutoNumeric.validate({ positiveSignCharacter: 'ab' })).toThrow();
            expect(() => AutoNumeric.validate({ positiveSignCharacter: true })).toThrow();
            expect(() => AutoNumeric.validate({ positiveSignCharacter: [] })).toThrow();
            expect(() => AutoNumeric.validate({ positiveSignCharacter: {} })).toThrow();
            expect(() => AutoNumeric.validate({ positiveSignCharacter: null })).toThrow();
            expect(() => AutoNumeric.validate({ positiveSignCharacter: '' })).toThrow();
            expect(() => AutoNumeric.validate({ positiveSignCharacter: 2 })).toThrow();
            expect(() => AutoNumeric.validate({ positiveSignCharacter: 2.5 })).toThrow();

            expect(() => AutoNumeric.validate({ emptyInputBehavior: [] })).toThrow();
            expect(() => AutoNumeric.validate({ emptyInputBehavior: true })).toThrow();
            expect(() => AutoNumeric.validate({ emptyInputBehavior: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ emptyInputBehavior: '22foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ emptyInputBehavior: null })).toThrow();

            expect(() => AutoNumeric.validate({ eventBubbles: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ eventBubbles: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ eventBubbles: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ eventBubbles: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ eventBubbles: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ eventIsCancelable: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ eventIsCancelable: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ eventIsCancelable: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ eventIsCancelable: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ eventIsCancelable: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ leadingZero: [] })).toThrow();
            expect(() => AutoNumeric.validate({ leadingZero: true })).toThrow();
            expect(() => AutoNumeric.validate({ leadingZero: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ leadingZero: '22foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ leadingZero: '-5' })).toThrow();
            expect(() => AutoNumeric.validate({ leadingZero: 5 })).toThrow();
            expect(() => AutoNumeric.validate({ leadingZero: -5 })).toThrow();

            expect(() => AutoNumeric.validate({ formatOnPageLoad: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ formatOnPageLoad: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ formatOnPageLoad: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ formatOnPageLoad: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ formatOnPageLoad: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ formulaMode: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ formulaMode: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ formulaMode: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ formulaMode: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ formulaMode: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ historySize: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ historySize: -1 })).toThrow();
            expect(() => AutoNumeric.validate({ historySize: 5.34 })).toThrow();
            expect(() => AutoNumeric.validate({ historySize: -5.34 })).toThrow();
            expect(() => AutoNumeric.validate({ historySize: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ historySize: true })).toThrow();
            expect(() => AutoNumeric.validate({ historySize: false })).toThrow();
            expect(() => AutoNumeric.validate({ historySize: [] })).toThrow();
            expect(() => AutoNumeric.validate({ historySize: null })).toThrow();

            expect(() => AutoNumeric.validate({ selectNumberOnly: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ selectNumberOnly: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ selectNumberOnly: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ selectNumberOnly: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ selectNumberOnly: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ selectOnFocus: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ selectOnFocus: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ selectOnFocus: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ selectOnFocus: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ selectOnFocus: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ defaultValueOverride: [] })).toThrow();
            expect(() => AutoNumeric.validate({ defaultValueOverride: true })).toThrow();
            expect(() => AutoNumeric.validate({ defaultValueOverride: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ defaultValueOverride: '22foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ unformatOnSubmit: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ unformatOnSubmit: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ unformatOnSubmit: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ unformatOnSubmit: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ unformatOnSubmit: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ outputFormat: [] })).toThrow();
            expect(() => AutoNumeric.validate({ outputFormat: true })).toThrow();
            expect(() => AutoNumeric.validate({ outputFormat: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ outputFormat: '22foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ outputFormat: '-5' })).toThrow();
            expect(() => AutoNumeric.validate({ outputFormat: 5 })).toThrow();
            expect(() => AutoNumeric.validate({ outputFormat: -5 })).toThrow();

            expect(() => AutoNumeric.validate({ invalidClass: true })).toThrow();
            expect(() => AutoNumeric.validate({ invalidClass: false })).toThrow();
            expect(() => AutoNumeric.validate({ invalidClass: 42 })).toThrow();
            expect(() => AutoNumeric.validate({ invalidClass: '123foo' })).toThrow();
            expect(() => AutoNumeric.validate({ invalidClass: '---234' })).toThrow();

            expect(() => AutoNumeric.validate({ isCancellable: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ isCancellable: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ isCancellable: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ isCancellable: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ isCancellable: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ modifyValueOnWheel: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ modifyValueOnWheel: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ modifyValueOnWheel: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ modifyValueOnWheel: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ modifyValueOnWheel: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ wheelOn: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ wheelOn: true })).toThrow();
            expect(() => AutoNumeric.validate({ wheelOn: false })).toThrow();
            expect(() => AutoNumeric.validate({ wheelOn: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ wheelOn: -42 })).toThrow();
            expect(() => AutoNumeric.validate({ wheelOn: '-42.67' })).toThrow();

            expect(() => AutoNumeric.validate({ wheelStep: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ wheelStep: true })).toThrow();
            expect(() => AutoNumeric.validate({ wheelStep: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ wheelStep: -42 })).toThrow();
            expect(() => AutoNumeric.validate({ wheelStep: '-42' })).toThrow();
            expect(() => AutoNumeric.validate({ wheelStep: -1000.02 })).toThrow();
            expect(() => AutoNumeric.validate({ wheelStep: '-1000.02' })).toThrow();
            expect(() => AutoNumeric.validate({ wheelStep: '1000foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ serializeSpaces: true })).toThrow();
            expect(() => AutoNumeric.validate({ serializeSpaces: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ serializeSpaces: -42 })).toThrow();
            expect(() => AutoNumeric.validate({ serializeSpaces: '-42' })).toThrow();
            expect(() => AutoNumeric.validate({ serializeSpaces: '++' })).toThrow();
            expect(() => AutoNumeric.validate({ serializeSpaces: ' ' })).toThrow();
            expect(() => AutoNumeric.validate({ serializeSpaces: 'foobar' })).toThrow();
            expect(() => AutoNumeric.validate({ serializeSpaces: ' foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ showWarnings: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ showWarnings: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ showWarnings: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ showWarnings: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ showWarnings: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ noEventListeners: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ noEventListeners: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ noEventListeners: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ noEventListeners: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ noEventListeners: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ readOnly: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ readOnly: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ readOnly: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ readOnly: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ readOnly: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ unformatOnHover: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ unformatOnHover: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ unformatOnHover: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ unformatOnHover: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ unformatOnHover: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ failOnUnknownOption: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ failOnUnknownOption: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ failOnUnknownOption: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ failOnUnknownOption: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ failOnUnknownOption: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ valuesToStrings: true })).toThrow();
            expect(() => AutoNumeric.validate({ valuesToStrings: [] })).toThrow();
            expect(() => AutoNumeric.validate({ valuesToStrings: 42 })).toThrow();
            expect(() => AutoNumeric.validate({ valuesToStrings: 'foobar' })).toThrow();

            expect(() => AutoNumeric.validate({ watchExternalChanges: 0 })).toThrow();
            expect(() => AutoNumeric.validate({ watchExternalChanges: 1 })).toThrow();
            expect(() => AutoNumeric.validate({ watchExternalChanges: '0' })).toThrow();
            expect(() => AutoNumeric.validate({ watchExternalChanges: '1' })).toThrow();
            expect(() => AutoNumeric.validate({ watchExternalChanges: 'foobar' })).toThrow();
        });

        it('should not allow the `negativeSignCharacter` and `positiveSignCharacter` to be equal', () => {
            expect(() => AutoNumeric.validate({
                negativeSignCharacter: '¼',
                positiveSignCharacter: '¼',
            })).toThrow();
        });

        it('should not validate the `negativeSignCharacter` in specific conditions', () => {
            expect(() => AutoNumeric.validate({ negativeSignCharacter: ' ', digitGroupSeparator: ' ' })).toThrow();
            expect(() => AutoNumeric.validate({ negativeSignCharacter: '.', decimalCharacter: '.' })).toThrow();
            expect(() => AutoNumeric.validate({ negativeSignCharacter: ',', decimalCharacterAlternative: ',' })).toThrow();
            // Test that the neg/pos sign can be the 'comma' (when the brackets are defined, ie. with a comma separator in the option definition)
            expect(() => AutoNumeric.validate({ negativeSignCharacter: ',', negativeBracketsTypeOnBlur: '(,)', digitGroupSeparator: '' })).not.toThrow();
            expect(() => AutoNumeric.validate({ negativeSignCharacter: '(', negativeBracketsTypeOnBlur: '(,)' })).toThrow();
            expect(() => AutoNumeric.validate({ negativeSignCharacter: ')', negativeBracketsTypeOnBlur: '(,)' })).toThrow();
            expect(() => AutoNumeric.validate({ negativeSignCharacter: 'B', suffixText: 'Bar' })).toThrow();
            expect(() => AutoNumeric.validate({ negativeSignCharacter: 'a', suffixText: 'Bar' })).toThrow();
            expect(() => AutoNumeric.validate({ negativeSignCharacter: 'r', suffixText: 'Bar' })).toThrow();
            expect(() => AutoNumeric.validate({ negativeSignCharacter: 'b', suffixText: 'Bar' })).not.toThrow();
            expect(() => AutoNumeric.validate({ negativeSignCharacter: 'A', suffixText: 'Bar' })).not.toThrow();
            expect(() => AutoNumeric.validate({ negativeSignCharacter: 'R', suffixText: 'Bar' })).not.toThrow();
        });

        it('should not validate the `positiveSignCharacter` in specific conditions', () => {
            expect(() => AutoNumeric.validate({ positiveSignCharacter: ' ', digitGroupSeparator: ' ' })).toThrow();
            expect(() => AutoNumeric.validate({ positiveSignCharacter: '.', decimalCharacter: '.' })).toThrow();
            expect(() => AutoNumeric.validate({ positiveSignCharacter: ',', decimalCharacterAlternative: ',' })).toThrow();
            expect(() => AutoNumeric.validate({ positiveSignCharacter: ',', negativeBracketsTypeOnBlur: '(,)', digitGroupSeparator: '' })).not.toThrow();
            expect(() => AutoNumeric.validate({ positiveSignCharacter: '(', negativeBracketsTypeOnBlur: '(,)' })).toThrow();
            expect(() => AutoNumeric.validate({ positiveSignCharacter: ')', negativeBracketsTypeOnBlur: '(,)' })).toThrow();
            expect(() => AutoNumeric.validate({ positiveSignCharacter: 'B', suffixText: 'Bar' })).toThrow();
            expect(() => AutoNumeric.validate({ positiveSignCharacter: 'a', suffixText: 'Bar' })).toThrow();
            expect(() => AutoNumeric.validate({ positiveSignCharacter: 'r', suffixText: 'Bar' })).toThrow();
            expect(() => AutoNumeric.validate({ positiveSignCharacter: 'b', suffixText: 'Bar' })).not.toThrow();
            expect(() => AutoNumeric.validate({ positiveSignCharacter: 'A', suffixText: 'Bar' })).not.toThrow();
            expect(() => AutoNumeric.validate({ positiveSignCharacter: 'R', suffixText: 'Bar' })).not.toThrow();
        });

        it('should only send a warning, and not throw', () => {
            spyOn(console, 'warn');
            expect(() => AutoNumeric.validate({ decimalPlaces: '3', decimalPlacesShownOnFocus: '2' })).not.toThrow();
            expect(console.warn).toHaveBeenCalled();
        });

        it('should only send a warning, and not throw', () => {
            spyOn(console, 'warn');
            expect(() => AutoNumeric.validate({ decimalPlaces: '3', decimalPlacesShownOnFocus: '2' })).not.toThrow();
            expect(console.warn).toHaveBeenCalled();
        });
    });

    //TODO Complete the tests in order to test every single static method separately:
    /*
     areSettingsValid
     getDefaultConfig
     getPredefinedOptions
     formatAndSet
     unformatAndSet
     reformatAndSet
     localize
     localizeAndSet
     version
     */
});

describe(`The static options object`, () => {
    it('should give access to the options enumeration', () => {
        expect(AutoNumeric.options.onInvalidPaste.error).toEqual('error');
        expect(AutoNumeric.options.currencySymbolPlacement.suffix).toEqual('s');
        expect(AutoNumeric.options.digitGroupSeparator.apostrophe).toEqual("'");
        expect(AutoNumeric.options.decimalCharacter.middleDot).toEqual('·');
        expect(AutoNumeric.options.decimalCharacterAlternative.none).toBeNull();
        expect(AutoNumeric.options.currencySymbol.none).toEqual('');
    });
});

describe(`The AutoNumeric event lifecycle`, () => {
    let aNInput;
    let newInput;
    let customFunction;

    beforeEach(() => { // Initialization
        newInput = document.createElement('input');
        document.body.appendChild(newInput);
        aNInput = new AutoNumeric(newInput); // Initiate the autoNumeric input

        customFunction = { // Dummy function used for spying
            formattedEvent(event) {
                // console.log(`formattedEvent called!`); //DEBUG
                return event;
            },
            testFormattedEvent(event) {
                expect(Object.prototype.hasOwnProperty.call(event.detail, 'oldValue')).toEqual(true);
                expect(Object.prototype.hasOwnProperty.call(event.detail, 'newValue')).toEqual(true);
                expect(Object.prototype.hasOwnProperty.call(event.detail, 'oldRawValue')).toEqual(true);
                expect(Object.prototype.hasOwnProperty.call(event.detail, 'newRawValue')).toEqual(true);
                expect(Object.prototype.hasOwnProperty.call(event.detail, 'isPristine')).toEqual(true);
                expect(Object.prototype.hasOwnProperty.call(event.detail, 'error')).toEqual(true);
                expect(event.detail.error).toEqual(null);
                expect(Object.prototype.hasOwnProperty.call(event.detail, 'aNElement')).toEqual(true);
            },
            rawValueModifiedEvent(event) {
                // console.log(`rawValueModified called!`); //DEBUG
                return event;
            },
            testRawValueModifiedEvent(event) {
                expect(Object.prototype.hasOwnProperty.call(event.detail, 'oldValue')).toEqual(false);
                expect(Object.prototype.hasOwnProperty.call(event.detail, 'newValue')).toEqual(false);
                expect(Object.prototype.hasOwnProperty.call(event.detail, 'oldRawValue')).toEqual(true);
                expect(Object.prototype.hasOwnProperty.call(event.detail, 'newRawValue')).toEqual(true);
                expect(Object.prototype.hasOwnProperty.call(event.detail, 'isPristine')).toEqual(true);
                expect(Object.prototype.hasOwnProperty.call(event.detail, 'error')).toEqual(true);
                expect(event.detail.error).toEqual(null);
                expect(Object.prototype.hasOwnProperty.call(event.detail, 'aNElement')).toEqual(true);
            },
        };
    });

    afterEach(() => { // Un-initialization
        aNInput.nuke();
    });

    it(`should send the 'autoNumeric:formatted' event when formatting is done`, () => {
        newInput.addEventListener(AutoNumeric.events.formatted, e => customFunction.formattedEvent(e));
        newInput.addEventListener(AutoNumeric.events.formatted, e => customFunction.testFormattedEvent(e));
        spyOn(customFunction, 'formattedEvent');

        aNInput.set(2000);
        expect(customFunction.formattedEvent).toHaveBeenCalled();
        aNInput.french();
        expect(customFunction.formattedEvent).toHaveBeenCalledTimes(2);
        aNInput.set('');
        expect(customFunction.formattedEvent).toHaveBeenCalledTimes(3);
        aNInput.set(-5600.78);
        expect(customFunction.formattedEvent).toHaveBeenCalledTimes(4);
        expect(aNInput.getFormatted()).toEqual('-5.600,78 €');
        aNInput.options.negativeBracketsTypeOnBlur(AutoNumeric.options.negativeBracketsTypeOnBlur.curlyBraces);
        expect(aNInput.getFormatted()).toEqual('{5.600,78 €}');
        expect(customFunction.formattedEvent).toHaveBeenCalledTimes(5);
        aNInput.node().focus(); //TODO This fails under Chrome _only_ when the tests are run with PhantomJS and Firefox. That test does not fail when running only the `test:unitc` task!?
        expect(customFunction.formattedEvent).toHaveBeenCalledTimes(6);
        expect(aNInput.getFormatted()).toEqual('-5.600,78 €');
    });

    it(`should send the 'autoNumeric:formatted' event with the old and new values`, () => {
        aNInput.set(1234.56);
        newInput.addEventListener(AutoNumeric.events.formatted, event => {
            expect(event.detail.oldValue).toEqual('1,234.56');
            expect(event.detail.newValue).toEqual('2,000.00');
            expect(event.detail.isPristine).toEqual(false);
            expect(event.detail.error).toEqual(null);
            expect(event.detail.aNElement).toEqual(aNInput);
        });
        aNInput.set(2000);
    });

    it(`should send the 'autoNumeric:rawValueModified' event when the rawValue is modified`, () => {
        newInput.addEventListener(AutoNumeric.events.rawValueModified, e => customFunction.rawValueModifiedEvent(e));
        newInput.addEventListener(AutoNumeric.events.rawValueModified, e => customFunction.testRawValueModifiedEvent(e));
        spyOn(customFunction, 'rawValueModifiedEvent');

        aNInput.set(2000);
        expect(customFunction.rawValueModifiedEvent).toHaveBeenCalled();
        aNInput.french();
        expect(customFunction.rawValueModifiedEvent).toHaveBeenCalledTimes(1);
        aNInput.set('');
        expect(customFunction.rawValueModifiedEvent).toHaveBeenCalledTimes(2);
        aNInput.set(-5600.78);
        expect(customFunction.rawValueModifiedEvent).toHaveBeenCalledTimes(3);
        expect(aNInput.getFormatted()).toEqual('-5.600,78 €');
        aNInput.options.negativeBracketsTypeOnBlur(AutoNumeric.options.negativeBracketsTypeOnBlur.curlyBraces);
        expect(aNInput.getFormatted()).toEqual('{5.600,78 €}');
        expect(customFunction.rawValueModifiedEvent).toHaveBeenCalledTimes(3);
        aNInput.node().focus(); //TODO This fails under Chrome _only_ when the tests are run with PhantomJS and Firefox. That test does not fail when running only the `test:unitc` task!?
        expect(customFunction.rawValueModifiedEvent).toHaveBeenCalledTimes(3);
    });

    it(`should send the 'autoNumeric:rawValueModified' event with the old and new values`, () => {
        aNInput.set(1234.56);
        newInput.addEventListener(AutoNumeric.events.rawValueModified, event => {
            expect(event.detail.oldRawValue).toEqual('1234.56');
            expect(event.detail.newRawValue).toEqual('2000');
            expect(event.detail.isPristine).toEqual(false);
            expect(event.detail.error).toEqual(null);
            expect(event.detail.aNElement).toEqual(aNInput);
        });
        aNInput.set(2000);
    });
});

describe(`The Math expression lexer and parser`, () => {
    it(`should correctly tokenize the math expressions`, () => {
        function testTokenizer(text) {
            const lexer = new Lexer(text);
            const tokens = [];
            let token;

            do {
                token = lexer.getNextToken();
                tokens.push(token);
            } while (token.type !== 'EOT');

            return tokens;
        }

        expect(testTokenizer('2 + 6').length).toEqual(4);
        expect(testTokenizer('2 - 6').length).toEqual(4);
        expect(testTokenizer('(4+1) * 2').length).toEqual(8);
        expect(testTokenizer('(4+1) * 2 ').length).toEqual(8);
        expect(testTokenizer('    (4+1) * 2 ').length).toEqual(8);
        expect(testTokenizer('(4+1) * 2 - (104587.23 * 8 - (-7))').length).toEqual(19);
        expect(testTokenizer('-(7 * 4)').length).toEqual(7);
        expect(testTokenizer('-7 * 4').length).toEqual(5);
        expect(testTokenizer('-7 * -4').length).toEqual(6);
        expect(testTokenizer('7 * -4').length).toEqual(5);
        expect(testTokenizer('8 * -12.46').length).toEqual(5);
        expect(testTokenizer('7 + -4').length).toEqual(5);
        expect(testTokenizer('1.6').length).toEqual(2);
        expect(testTokenizer('-1.6').length).toEqual(3);
        expect(testTokenizer('-1.6 - 1.2').length).toEqual(5);
        expect(testTokenizer('(1+2)+(5-3)').length).toEqual(12);
        expect(testTokenizer('(1+2)+(5-3) + 4').length).toEqual(14);
        expect(testTokenizer('(1+2) + 1').length).toEqual(8);
        expect(testTokenizer('(1+2) + 1 - (1+3)').length).toEqual(14);
        expect(testTokenizer('22+ 10').length).toEqual(4);
        expect(testTokenizer('22+ (10 * 2)').length).toEqual(8);
        expect(testTokenizer('22+ (10 * 2) + 1').length).toEqual(10);
        expect(testTokenizer('22+ (10 * 2)-2.5').length).toEqual(10);
        expect(testTokenizer('22+ (10 * 2)-2').length).toEqual(10);
        expect(testTokenizer('22+ (10 * 2)-1.5').length).toEqual(10);
        expect(testTokenizer('22+ (10 * 2)-1.5- -0.5').length).toEqual(13);
        expect(testTokenizer('22+ (10 * 2)-2- -6').length).toEqual(13);
        expect(testTokenizer('2 - -6').length).toEqual(5);
        expect(testTokenizer('2 + -6').length).toEqual(5);
        expect(testTokenizer('-2 + -6').length).toEqual(6);
        expect(testTokenizer('2 * -6').length).toEqual(5);
        expect(testTokenizer('22/2').length).toEqual(4);
        expect(testTokenizer('-47/2').length).toEqual(5);
        expect(testTokenizer('5').length).toEqual(2);
        expect(testTokenizer('(5)').length).toEqual(4);
        expect(testTokenizer('(-5)').length).toEqual(5);
        expect(testTokenizer('-(5)').length).toEqual(5);
        expect(testTokenizer('((5))').length).toEqual(6);
        expect(testTokenizer('')[0].type).toEqual('EOT');

        expect(() => testTokenizer('22+ (10 * 2)+foobar')).toThrow();
        expect(() => testTokenizer('foobar')).toThrow();
        expect(() => testTokenizer('(foobar)')).toThrow();
        expect(() => testTokenizer('(45foo)')).toThrow();
    });

    it(`should correctly parse the math expressions`, () => {
        function testParser(text) {
            const ast = new Parser(text);
            const result = (new Evaluator()).evaluate(ast);

            return Number(result);
        }

        expect(testParser('2 + 6')).toEqual(8);
        expect(testParser('2 - 6')).toEqual(-4);
        expect(testParser('(4+1) * 2')).toEqual(10);
        expect(testParser('(4+1) * 2 ')).toEqual(10);
        expect(testParser('    (4+1) * 2 ')).toEqual(10);
        expect(testParser('(4+1) * 2 - (104587.23 * 8 - (-7))')).toEqual(-836694.84);
        expect(testParser('-(7 * 4)')).toEqual(-28);
        expect(testParser('-7 * 4')).toEqual(-28);
        expect(testParser('-7 * -4')).toEqual(28);
        expect(testParser('7 * -4')).toEqual(-28);
        expect(testParser('8 * -12.46')).toEqual(-99.68);
        expect(testParser('7 + -4')).toEqual(3);
        expect(testParser('1.6')).toEqual(1.6);
        expect(testParser('-1.6')).toEqual(-1.6);
        expect(testParser('-1.6 - 1.2')).toEqual(-2.8);
        expect(testParser('(1+2)+(5-3)')).toEqual(5);
        expect(testParser('(5-3) + 4')).toEqual(6);
        expect(testParser('(2) + (1)')).toEqual(3);
        expect(testParser('(2) + (1) + (5)')).toEqual(8);
        expect(testParser('(2) - (1) + (5)')).toEqual(6);
        expect(testParser('(2) + (1) - (5)')).toEqual(-2);
        expect(testParser('2+1')).toEqual(3);
        expect(testParser('2+1+5')).toEqual(8);
        expect(testParser('2 + 1 +5')).toEqual(8);
        expect(testParser('(2) + 1 +5')).toEqual(8);
        expect(testParser('(2) + (1) +5')).toEqual(8);
        expect(testParser('(2) - (1) +5')).toEqual(6);
        expect(testParser('(2) + (1) -5')).toEqual(-2);
        expect(testParser('(1+2)+(5-3) + 4')).toEqual(9);
        expect(testParser('(1+2) + 1')).toEqual(4);
        expect(testParser('(1+2) + 1 - (1+3)')).toEqual(0);
        expect(testParser('22+ 10')).toEqual(32);
        expect(testParser('22+ (10 * 2)')).toEqual(42);
        expect(testParser('22+ (10 * 2) + 1')).toEqual(43);
        expect(testParser('22+ (10 * 2)-2.5')).toEqual(39.5);
        expect(testParser('22+ (10 * 2)-2')).toEqual(40);
        expect(testParser('22+ (10 * 2)-1.5')).toEqual(40.5);
        expect(testParser('22+ (10 * 2)-1.5- -0.5')).toEqual(41);
        expect(testParser('22+ (10 * 2)-2- -6')).toEqual(46);
        expect(testParser('2 - -6')).toEqual(8);
        expect(testParser('2 + -6')).toEqual(-4);
        expect(testParser('-2 + -6')).toEqual(-8);
        expect(testParser('2 * -6')).toEqual(-12);
        expect(testParser('22/2')).toEqual(11);
        expect(testParser('-47/2')).toEqual(-23.5);
        expect(testParser('5')).toEqual(5);
        expect(testParser('(5)')).toEqual(5);
        expect(testParser('(-5)')).toEqual(-5);
        expect(testParser('-(5)')).toEqual(-5);
        expect(testParser('((5))')).toEqual(5);

        expect(() => testParser('22+ (10 * 2)+foobar')).toThrow();
        expect(() => testParser('')).toThrow();
        expect(() => testParser('foobar')).toThrow();
        expect(() => testParser('(foobar)')).toThrow();
        expect(() => testParser('(45foo)')).toThrow();
    });

    it(`should correctly parse the math expressions with a custom decimal character`, () => {
        function testParser(text) {
            const ast = new Parser(text, ',');
            const result = (new Evaluator()).evaluate(ast);

            return Number(result);
        }

        expect(testParser('(4+1) * 2 - (104587,23 * 8 - (-7))')).toEqual(-836694.84);
        expect(testParser('8 * -12,46')).toEqual(-99.68);
        expect(testParser('1,6')).toEqual(1.6);
        expect(testParser('-1,6')).toEqual(-1.6);
        expect(testParser('-1,6 - 1,2')).toEqual(-2.8);
        expect(testParser('22+ (10 * 2)-2,5')).toEqual(39.5);
        expect(testParser('22+ (10 * 2)-1,5')).toEqual(40.5);
        expect(testParser('22+ (10 * 2)-1,5- -0,5')).toEqual(41);

        expect(() => testParser('(4+1) * 2 - (104587.23 * 8 - (-7))')).toThrow();
    });
});
