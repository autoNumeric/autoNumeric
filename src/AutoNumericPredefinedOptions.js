/**
 * Pre-defined options for autoNumeric.js
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

import AutoNumeric from './AutoNumeric';
import AutoNumericHelper from './AutoNumericHelper';

const euro = { // Français
    digitGroupSeparator          : AutoNumeric.options.digitGroupSeparator.dot, // or '\u202f'
    decimalCharacter             : AutoNumeric.options.decimalCharacter.comma,
    decimalCharacterAlternative  : AutoNumeric.options.decimalCharacterAlternative.dot,
    currencySymbol               : '\u202f€',
    currencySymbolPlacement      : AutoNumeric.options.currencySymbolPlacement.suffix,
    negativePositiveSignPlacement: AutoNumeric.options.negativePositiveSignPlacement.prefix,
};

const dollar = {
    digitGroupSeparator          : AutoNumeric.options.digitGroupSeparator.comma,
    decimalCharacter             : AutoNumeric.options.decimalCharacter.dot,
    currencySymbol               : AutoNumeric.options.currencySymbol.dollar,
    currencySymbolPlacement      : AutoNumeric.options.currencySymbolPlacement.prefix,
    negativePositiveSignPlacement: AutoNumeric.options.negativePositiveSignPlacement.right,
};

const japanese = { // 日本語
    digitGroupSeparator          : AutoNumeric.options.digitGroupSeparator.comma,
    decimalCharacter             : AutoNumeric.options.decimalCharacter.dot,
    currencySymbol               : AutoNumeric.options.currencySymbol.yen,
    currencySymbolPlacement      : AutoNumeric.options.currencySymbolPlacement.prefix,
    negativePositiveSignPlacement: AutoNumeric.options.negativePositiveSignPlacement.right,
};


// Here we need to clone the initial objects in order to be able to edit the clones without affecting the originals
const euroF                           = AutoNumericHelper.cloneObject(euro);
euroF.formulaMode                     = AutoNumeric.options.formulaMode.enabled;
const euroPos                         = AutoNumericHelper.cloneObject(euro);
euroPos.minimumValue                  = 0;
const euroNeg                         = AutoNumericHelper.cloneObject(euro);
euroNeg.maximumValue                  = 0;
euroNeg.negativePositiveSignPlacement = AutoNumeric.options.negativePositiveSignPlacement.prefix;

const euroSpace                            = AutoNumericHelper.cloneObject(euro);
euroSpace.digitGroupSeparator              = AutoNumeric.options.digitGroupSeparator.normalSpace;
const euroSpacePos                         = AutoNumericHelper.cloneObject(euroSpace);
euroSpacePos.minimumValue                  = 0;
const euroSpaceNeg                         = AutoNumericHelper.cloneObject(euroSpace);
euroSpaceNeg.maximumValue                  = 0;
euroSpaceNeg.negativePositiveSignPlacement = AutoNumeric.options.negativePositiveSignPlacement.prefix;

const percentageEU2dec                            = AutoNumericHelper.cloneObject(euro);
percentageEU2dec.currencySymbol                   = AutoNumeric.options.currencySymbol.none;
percentageEU2dec.suffixText                       = `\u202f${AutoNumeric.options.suffixText.percentage}`;
percentageEU2dec.wheelStep                        = 0.0001; // This targets the `rawValue`, not the formatted one
percentageEU2dec.rawValueDivisor                  = AutoNumeric.options.rawValueDivisor.percentage;
const percentageEU2decPos                         = AutoNumericHelper.cloneObject(percentageEU2dec);
percentageEU2decPos.minimumValue                  = 0;
const percentageEU2decNeg                         = AutoNumericHelper.cloneObject(percentageEU2dec);
percentageEU2decNeg.maximumValue                  = 0;
percentageEU2decNeg.negativePositiveSignPlacement = AutoNumeric.options.negativePositiveSignPlacement.prefix;

const percentageEU3dec            = AutoNumericHelper.cloneObject(percentageEU2dec);
percentageEU3dec.decimalPlaces    = 3;
const percentageEU3decPos         = AutoNumericHelper.cloneObject(percentageEU2decPos);
percentageEU3decPos.decimalPlaces = 3;
const percentageEU3decNeg         = AutoNumericHelper.cloneObject(percentageEU2decNeg);
percentageEU3decNeg.decimalPlaces = 3;

const dollarF                                = AutoNumericHelper.cloneObject(dollar);
dollarF.formulaMode                          = AutoNumeric.options.formulaMode.enabled;
const dollarPos                              = AutoNumericHelper.cloneObject(dollar);
dollarPos.minimumValue                       = 0;
const dollarNeg                              = AutoNumericHelper.cloneObject(dollar);
dollarNeg.maximumValue                       = 0;
dollarNeg.negativePositiveSignPlacement      = AutoNumeric.options.negativePositiveSignPlacement.prefix;
const dollarNegBrackets                      = AutoNumericHelper.cloneObject(dollarNeg);
dollarNegBrackets.negativeBracketsTypeOnBlur = AutoNumeric.options.negativeBracketsTypeOnBlur.parentheses;

const percentageUS2dec                            = AutoNumericHelper.cloneObject(dollar);
percentageUS2dec.currencySymbol                   = AutoNumeric.options.currencySymbol.none;
percentageUS2dec.suffixText                       = AutoNumeric.options.suffixText.percentage;
percentageUS2dec.wheelStep                        = 0.0001;
percentageUS2dec.rawValueDivisor                  = AutoNumeric.options.rawValueDivisor.percentage;
const percentageUS2decPos                         = AutoNumericHelper.cloneObject(percentageUS2dec);
percentageUS2decPos.minimumValue                  = 0;
const percentageUS2decNeg                         = AutoNumericHelper.cloneObject(percentageUS2dec);
percentageUS2decNeg.maximumValue                  = 0;
percentageUS2decNeg.negativePositiveSignPlacement = AutoNumeric.options.negativePositiveSignPlacement.prefix;

const percentageUS3dec            = AutoNumericHelper.cloneObject(percentageUS2dec);
percentageUS3dec.decimalPlaces    = 3;
const percentageUS3decPos         = AutoNumericHelper.cloneObject(percentageUS2decPos);
percentageUS3decPos.decimalPlaces = 3;
const percentageUS3decNeg         = AutoNumericHelper.cloneObject(percentageUS2decNeg);
percentageUS3decNeg.decimalPlaces = 3;

const turkish = AutoNumericHelper.cloneObject(euro);
turkish.currencySymbol = AutoNumeric.options.currencySymbol.lira;

/**
 * Predefined options for the most common languages
 */
AutoNumeric.predefinedOptions = {
    euro,
    euroPos,
    euroNeg,
    euroSpace,
    euroSpacePos,
    euroSpaceNeg,
    percentageEU2dec,
    percentageEU2decPos,
    percentageEU2decNeg,
    percentageEU3dec,
    percentageEU3decPos,
    percentageEU3decNeg,
    dollar,
    dollarPos,
    dollarNeg,
    dollarNegBrackets,
    percentageUS2dec,
    percentageUS2decPos,
    percentageUS2decNeg,
    percentageUS3dec,
    percentageUS3decPos,
    percentageUS3decNeg,
    French                      : euro, // Français
    Spanish                     : euro, // Español
    NorthAmerican               : dollar,
    British                     : {
        digitGroupSeparator          : AutoNumeric.options.digitGroupSeparator.comma,
        decimalCharacter             : AutoNumeric.options.decimalCharacter.dot,
        currencySymbol               : AutoNumeric.options.currencySymbol.pound,
        currencySymbolPlacement      : AutoNumeric.options.currencySymbolPlacement.prefix,
        negativePositiveSignPlacement: AutoNumeric.options.negativePositiveSignPlacement.right,
    },
    Swiss                       : { // Suisse
        digitGroupSeparator          : AutoNumeric.options.digitGroupSeparator.apostrophe,
        decimalCharacter             : AutoNumeric.options.decimalCharacter.dot,
        currencySymbol               : '\u202fCHF',
        currencySymbolPlacement      : AutoNumeric.options.currencySymbolPlacement.suffix,
        negativePositiveSignPlacement: AutoNumeric.options.negativePositiveSignPlacement.prefix,
    },
    Japanese                    : japanese, // 日本語
    Chinese                     : japanese, // 中国語 (Chinese)
    Brazilian                   : {
        digitGroupSeparator          : AutoNumeric.options.digitGroupSeparator.dot,
        decimalCharacter             : AutoNumeric.options.decimalCharacter.comma,
        currencySymbol               : AutoNumeric.options.currencySymbol.real,
        currencySymbolPlacement      : AutoNumeric.options.currencySymbolPlacement.prefix,
        negativePositiveSignPlacement: AutoNumeric.options.negativePositiveSignPlacement.right,
    },
    Turkish                     : turkish,
    dotDecimalCharCommaSeparator: {
        digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.comma,
        decimalCharacter   : AutoNumeric.options.decimalCharacter.dot,
    },
    commaDecimalCharDotSeparator: {
        digitGroupSeparator        : AutoNumeric.options.digitGroupSeparator.dot,
        decimalCharacter           : AutoNumeric.options.decimalCharacter.comma,
        decimalCharacterAlternative: AutoNumeric.options.decimalCharacterAlternative.dot,
    },
    integer                     : {
        decimalPlaces: 0,
    },
    integerPos                  : {
        minimumValue : AutoNumeric.options.minimumValue.zero,
        decimalPlaces: 0,
    },
    integerNeg                  : {
        maximumValue : AutoNumeric.options.maximumValue.zero,
        decimalPlaces: 0,
    },
    float                       : {
        allowDecimalPadding: AutoNumeric.options.allowDecimalPadding.never,
    },
    floatPos                    : {
        allowDecimalPadding: AutoNumeric.options.allowDecimalPadding.never,
        minimumValue       : AutoNumeric.options.minimumValue.zero,
        maximumValue       : AutoNumeric.options.maximumValue.tenTrillions,
    },
    floatNeg                    : {
        allowDecimalPadding: AutoNumeric.options.allowDecimalPadding.never,
        minimumValue       : AutoNumeric.options.minimumValue.tenTrillions,
        maximumValue       : AutoNumeric.options.maximumValue.zero,
    },
    numeric                     : {
        digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.noSeparator,
        decimalCharacter   : AutoNumeric.options.decimalCharacter.dot,
        currencySymbol     : AutoNumeric.options.currencySymbol.none,
    },
    numericPos                  : {
        digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.noSeparator,
        decimalCharacter   : AutoNumeric.options.decimalCharacter.dot,
        currencySymbol     : AutoNumeric.options.currencySymbol.none,
        minimumValue       : AutoNumeric.options.minimumValue.zero,
        maximumValue       : AutoNumeric.options.maximumValue.tenTrillions,
    },
    numericNeg                  : {
        digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.noSeparator,
        decimalCharacter   : AutoNumeric.options.decimalCharacter.dot,
        currencySymbol     : AutoNumeric.options.currencySymbol.none,
        minimumValue       : AutoNumeric.options.minimumValue.tenTrillions,
        maximumValue       : AutoNumeric.options.maximumValue.zero,
    },
};

Object.getOwnPropertyNames(AutoNumeric.predefinedOptions).forEach(optionName => {
    Object.freeze(AutoNumeric.predefinedOptions[optionName]);
});
Object.freeze(AutoNumeric.predefinedOptions);
Object.defineProperty(AutoNumeric, 'predefinedOptions', { configurable: false, writable: false });
