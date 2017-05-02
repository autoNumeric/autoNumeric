/**
 * Pre-defined options for autoNumeric.js
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

import AutoNumeric from './AutoNumeric';
import AutoNumericHelper from './AutoNumericHelper';

/**
 * Predefined options for the most common languages
 */
AutoNumeric.predefinedOptions = {
    French       : { // Français
        digitGroupSeparator          : AutoNumeric.options.digitGroupSeparator.dot, // or '\u202f'
        decimalCharacter             : AutoNumeric.options.decimalCharacter.comma,
        decimalCharacterAlternative  : AutoNumeric.options.decimalCharacterAlternative.dot,
        currencySymbol               : '\u202f€',
        currencySymbolPlacement      : AutoNumeric.options.currencySymbolPlacement.suffix,
        negativePositiveSignPlacement: AutoNumeric.options.negativePositiveSignPlacement.prefix,
    },
    NorthAmerican: {
        digitGroupSeparator          : AutoNumeric.options.digitGroupSeparator.comma,
        decimalCharacter             : AutoNumeric.options.decimalCharacter.dot,
        currencySymbol               : AutoNumeric.options.currencySymbol.dollar,
        currencySymbolPlacement      : AutoNumeric.options.currencySymbolPlacement.prefix,
        negativePositiveSignPlacement: AutoNumeric.options.negativePositiveSignPlacement.right,
    },
    British      : {
        digitGroupSeparator          : AutoNumeric.options.digitGroupSeparator.comma,
        decimalCharacter             : AutoNumeric.options.decimalCharacter.dot,
        currencySymbol               : AutoNumeric.options.currencySymbol.pound,
        currencySymbolPlacement      : AutoNumeric.options.currencySymbolPlacement.prefix,
        negativePositiveSignPlacement: AutoNumeric.options.negativePositiveSignPlacement.right,
    },
    Swiss        : { // Suisse
        digitGroupSeparator          : AutoNumeric.options.digitGroupSeparator.apostrophe,
        decimalCharacter             : AutoNumeric.options.decimalCharacter.dot,
        currencySymbol               : '\u202fCHF',
        currencySymbolPlacement      : AutoNumeric.options.currencySymbolPlacement.suffix,
        negativePositiveSignPlacement: AutoNumeric.options.negativePositiveSignPlacement.prefix,
    },
    Japanese     : { // 日本語
        digitGroupSeparator          : AutoNumeric.options.digitGroupSeparator.comma,
        decimalCharacter             : AutoNumeric.options.decimalCharacter.dot,
        currencySymbol               : AutoNumeric.options.currencySymbol.yen,
        currencySymbolPlacement      : AutoNumeric.options.currencySymbolPlacement.prefix,
        negativePositiveSignPlacement: AutoNumeric.options.negativePositiveSignPlacement.right,
    },
    Brazilian      : {
        digitGroupSeparator          : AutoNumeric.options.digitGroupSeparator.dot,
        decimalCharacter             : AutoNumeric.options.decimalCharacter.comma,
        currencySymbol               : AutoNumeric.options.currencySymbol.real,
        currencySymbolPlacement      : AutoNumeric.options.currencySymbolPlacement.prefix,
        negativePositiveSignPlacement: AutoNumeric.options.negativePositiveSignPlacement.right,
    },
    dotDecimalCharCommaSeparator: {
        digitGroupSeparator          : AutoNumeric.options.digitGroupSeparator.comma,
        decimalCharacter             : AutoNumeric.options.decimalCharacter.dot,
    },
    commaDecimalCharDotSeparator: {
        digitGroupSeparator          : AutoNumeric.options.digitGroupSeparator.dot,
        decimalCharacter             : AutoNumeric.options.decimalCharacter.comma,
        decimalCharacterAlternative  : AutoNumeric.options.decimalCharacterAlternative.dot,
    },
    integer:    { minimumValue: AutoNumeric.options.minimumValue.tenTrillionsNoDecimals, maximumValue: AutoNumeric.options.maximumValue.tenTrillionsNoDecimals },
    integerPos: { minimumValue: AutoNumeric.options.minimumValue.zero                  , maximumValue: AutoNumeric.options.maximumValue.tenTrillionsNoDecimals },
    integerNeg: { minimumValue: AutoNumeric.options.minimumValue.tenTrillionsNoDecimals, maximumValue: AutoNumeric.options.maximumValue.zero                   },
    float:      { allowDecimalPadding: AutoNumeric.options.allowDecimalPadding.never },
    floatPos:   { allowDecimalPadding: AutoNumeric.options.allowDecimalPadding.never, minimumValue: AutoNumeric.options.minimumValue.zero        , maximumValue: AutoNumeric.options.maximumValue.tenTrillions },
    floatNeg:   { allowDecimalPadding: AutoNumeric.options.allowDecimalPadding.never, minimumValue: AutoNumeric.options.minimumValue.tenTrillions, maximumValue: AutoNumeric.options.maximumValue.zero         },
    numeric: {
        digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.noSeparator,
        decimalCharacter   : AutoNumeric.options.decimalCharacter.dot,
        currencySymbol     : AutoNumeric.options.currencySymbol.none,
    },
    numericPos: {
        digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.noSeparator,
        decimalCharacter   : AutoNumeric.options.decimalCharacter.dot,
        currencySymbol     : AutoNumeric.options.currencySymbol.none,
        minimumValue       : AutoNumeric.options.minimumValue.zero,
        maximumValue       : AutoNumeric.options.maximumValue.tenTrillions,
    },
    numericNeg: {
        digitGroupSeparator: AutoNumeric.options.digitGroupSeparator.noSeparator,
        decimalCharacter   : AutoNumeric.options.decimalCharacter.dot,
        currencySymbol     : AutoNumeric.options.currencySymbol.none,
        minimumValue       : AutoNumeric.options.minimumValue.tenTrillions,
        maximumValue       : AutoNumeric.options.maximumValue.zero,
    },
};

AutoNumeric.predefinedOptions.Spanish = AutoNumeric.predefinedOptions.French; // Español (idem French)
AutoNumeric.predefinedOptions.Chinese = AutoNumeric.predefinedOptions.Japanese; // 中国語 (Chinese)

AutoNumeric.predefinedOptions.euro = AutoNumeric.predefinedOptions.French;
AutoNumeric.predefinedOptions.euroPos = AutoNumericHelper.cloneObject(AutoNumeric.predefinedOptions.French);
AutoNumeric.predefinedOptions.euroPos.minimumValue = '0.00'; // Here we need to clone the initial object in order to be able to edit it without affecting the initial object
AutoNumeric.predefinedOptions.euroNeg = AutoNumericHelper.cloneObject(AutoNumeric.predefinedOptions.French);
AutoNumeric.predefinedOptions.euroNeg.maximumValue = '0.00';
AutoNumeric.predefinedOptions.euroNeg.negativePositiveSignPlacement = AutoNumeric.options.negativePositiveSignPlacement.prefix;

AutoNumeric.predefinedOptions.euroSpace = AutoNumericHelper.cloneObject(AutoNumeric.predefinedOptions.French);
AutoNumeric.predefinedOptions.euroSpace.digitGroupSeparator = AutoNumeric.options.digitGroupSeparator.normalSpace;
AutoNumeric.predefinedOptions.euroSpacePos = AutoNumericHelper.cloneObject(AutoNumeric.predefinedOptions.euroSpace);
AutoNumeric.predefinedOptions.euroSpacePos.minimumValue = '0.00';
AutoNumeric.predefinedOptions.euroSpaceNeg = AutoNumericHelper.cloneObject(AutoNumeric.predefinedOptions.euroSpace);
AutoNumeric.predefinedOptions.euroSpaceNeg.maximumValue = '0.00';
AutoNumeric.predefinedOptions.euroSpaceNeg.negativePositiveSignPlacement = AutoNumeric.options.negativePositiveSignPlacement.prefix;

AutoNumeric.predefinedOptions.percentageEU2dec = AutoNumericHelper.cloneObject(AutoNumeric.predefinedOptions.French);
AutoNumeric.predefinedOptions.percentageEU2dec.currencySymbol = AutoNumeric.options.currencySymbol.none;
AutoNumeric.predefinedOptions.percentageEU2dec.suffixText = `\u202f${AutoNumeric.options.suffixText.percentage}`;
AutoNumeric.predefinedOptions.percentageEU2dec.wheelStep = 0.01;
AutoNumeric.predefinedOptions.percentageEU2decPos = AutoNumericHelper.cloneObject(AutoNumeric.predefinedOptions.percentageEU2dec);
AutoNumeric.predefinedOptions.percentageEU2decPos.minimumValue = '0.00';
AutoNumeric.predefinedOptions.percentageEU2decNeg = AutoNumericHelper.cloneObject(AutoNumeric.predefinedOptions.percentageEU2dec);
AutoNumeric.predefinedOptions.percentageEU2decNeg.maximumValue = '0.00';
AutoNumeric.predefinedOptions.percentageEU2decNeg.negativePositiveSignPlacement = AutoNumeric.options.negativePositiveSignPlacement.prefix;

AutoNumeric.predefinedOptions.percentageEU3dec = AutoNumericHelper.cloneObject(AutoNumeric.predefinedOptions.percentageEU2dec);
AutoNumeric.predefinedOptions.percentageEU3dec.maximumValue = `${AutoNumeric.options.maximumValue.tenTrillions}9`;
AutoNumeric.predefinedOptions.percentageEU3dec.decimalPlacesOverride = 3;
AutoNumeric.predefinedOptions.percentageEU3decPos = AutoNumericHelper.cloneObject(AutoNumeric.predefinedOptions.percentageEU2decPos);
AutoNumeric.predefinedOptions.percentageEU3decPos.maximumValue = `${AutoNumeric.options.maximumValue.tenTrillions}9`;
AutoNumeric.predefinedOptions.percentageEU3decPos.decimalPlacesOverride = 3;
AutoNumeric.predefinedOptions.percentageEU3decNeg = AutoNumericHelper.cloneObject(AutoNumeric.predefinedOptions.percentageEU2decNeg);
AutoNumeric.predefinedOptions.percentageEU3decNeg.maximumValue = `${AutoNumeric.options.maximumValue.tenTrillions}9`;
AutoNumeric.predefinedOptions.percentageEU3decNeg.decimalPlacesOverride = 3;

AutoNumeric.predefinedOptions.dollar = AutoNumeric.predefinedOptions.NorthAmerican;
AutoNumeric.predefinedOptions.dollarPos = AutoNumericHelper.cloneObject(AutoNumeric.predefinedOptions.NorthAmerican);
AutoNumeric.predefinedOptions.dollarPos.minimumValue = '0.00';
AutoNumeric.predefinedOptions.dollarNeg = AutoNumericHelper.cloneObject(AutoNumeric.predefinedOptions.NorthAmerican);
AutoNumeric.predefinedOptions.dollarNeg.maximumValue = '0.00';
AutoNumeric.predefinedOptions.dollarNeg.negativePositiveSignPlacement = AutoNumeric.options.negativePositiveSignPlacement.prefix;
AutoNumeric.predefinedOptions.dollarNegBrackets = AutoNumericHelper.cloneObject(AutoNumeric.predefinedOptions.dollarNeg);
AutoNumeric.predefinedOptions.dollarNegBrackets.negativeBracketsTypeOnBlur = AutoNumeric.options.negativeBracketsTypeOnBlur.parentheses;

AutoNumeric.predefinedOptions.percentageUS2dec = AutoNumericHelper.cloneObject(AutoNumeric.predefinedOptions.NorthAmerican);
AutoNumeric.predefinedOptions.percentageUS2dec.currencySymbol = AutoNumeric.options.currencySymbol.none;
AutoNumeric.predefinedOptions.percentageUS2dec.suffixText = AutoNumeric.options.suffixText.percentage;
AutoNumeric.predefinedOptions.percentageUS2dec.wheelStep = 0.01;
AutoNumeric.predefinedOptions.percentageUS2decPos = AutoNumericHelper.cloneObject(AutoNumeric.predefinedOptions.percentageUS2dec);
AutoNumeric.predefinedOptions.percentageUS2decPos.minimumValue = '0.00';
AutoNumeric.predefinedOptions.percentageUS2decNeg = AutoNumericHelper.cloneObject(AutoNumeric.predefinedOptions.percentageUS2dec);
AutoNumeric.predefinedOptions.percentageUS2decNeg.maximumValue = '0.00';
AutoNumeric.predefinedOptions.percentageUS2decNeg.negativePositiveSignPlacement = AutoNumeric.options.negativePositiveSignPlacement.prefix;

AutoNumeric.predefinedOptions.percentageUS3dec = AutoNumericHelper.cloneObject(AutoNumeric.predefinedOptions.percentageUS2dec);
AutoNumeric.predefinedOptions.percentageUS3dec.maximumValue = `${AutoNumeric.options.maximumValue.tenTrillions}9`;
AutoNumeric.predefinedOptions.percentageUS3dec.decimalPlacesOverride = 3;
AutoNumeric.predefinedOptions.percentageUS3decPos = AutoNumericHelper.cloneObject(AutoNumeric.predefinedOptions.percentageUS2decPos);
AutoNumeric.predefinedOptions.percentageUS3decPos.maximumValue = `${AutoNumeric.options.maximumValue.tenTrillions}9`;
AutoNumeric.predefinedOptions.percentageUS3decPos.decimalPlacesOverride = 3;
AutoNumeric.predefinedOptions.percentageUS3decNeg = AutoNumericHelper.cloneObject(AutoNumeric.predefinedOptions.percentageUS2decNeg);
AutoNumeric.predefinedOptions.percentageUS3decNeg.maximumValue = `${AutoNumeric.options.maximumValue.tenTrillions}9`;
AutoNumeric.predefinedOptions.percentageUS3decNeg.decimalPlacesOverride = 3;
