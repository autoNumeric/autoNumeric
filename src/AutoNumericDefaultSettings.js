/**
 * Default settings for autoNumeric.js
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
import AutoNumericOptions from './AutoNumericOptions';

/* eslint no-unused-vars: 0 */

/**
 * The defaults options.
 * These can be overridden by the following methods:
 * - HTML5 data attributes (ie. `<input type="text" data-currency-symbol=" €">`)
 * - Options passed to the `update` method (ie. `anElement.update({ currencySymbol: ' €' });`), or simply during the initialization (ie. `new AutoNumeric(domElement, { options });`)
 */
AutoNumeric.defaultSettings = {
    allowDecimalPadding          : AutoNumeric.options.allowDecimalPadding.always,
    alwaysAllowDecimalCharacter  : AutoNumeric.options.alwaysAllowDecimalCharacter.doNotAllow,
    caretPositionOnFocus         : AutoNumeric.options.caretPositionOnFocus.doNoForceCaretPosition,
    createLocalList              : AutoNumeric.options.createLocalList.createList,
    currencySymbol               : AutoNumeric.options.currencySymbol.none,
    currencySymbolPlacement      : AutoNumeric.options.currencySymbolPlacement.prefix,
    decimalCharacter             : AutoNumeric.options.decimalCharacter.dot,
    decimalCharacterAlternative  : AutoNumeric.options.decimalCharacterAlternative.none,
    decimalPlaces                : AutoNumeric.options.decimalPlaces.two,
    decimalPlacesRawValue        : AutoNumeric.options.decimalPlacesRawValue.useDefault,
    decimalPlacesShownOnBlur     : AutoNumeric.options.decimalPlacesShownOnBlur.useDefault,
    decimalPlacesShownOnFocus    : AutoNumeric.options.decimalPlacesShownOnFocus.useDefault,
    defaultValueOverride         : AutoNumeric.options.defaultValueOverride.doNotOverride,
    digitalGroupSpacing          : AutoNumeric.options.digitalGroupSpacing.three,
    digitGroupSeparator          : AutoNumeric.options.digitGroupSeparator.comma,
    divisorWhenUnfocused         : AutoNumeric.options.divisorWhenUnfocused.none,
    emptyInputBehavior           : AutoNumeric.options.emptyInputBehavior.focus,
    eventBubbles                 : AutoNumeric.options.eventBubbles.bubbles,
    eventIsCancelable            : AutoNumeric.options.eventIsCancelable.isCancelable,
    failOnUnknownOption          : AutoNumeric.options.failOnUnknownOption.ignore,
    formatOnPageLoad             : AutoNumeric.options.formatOnPageLoad.format,
    formulaMode                  : AutoNumeric.options.formulaMode.disabled,
    historySize                  : AutoNumeric.options.historySize.medium,
    invalidClass                 : AutoNumeric.options.invalidClass,
    isCancellable                : AutoNumeric.options.isCancellable.cancellable,
    leadingZero                  : AutoNumeric.options.leadingZero.deny,
    maximumValue                 : AutoNumeric.options.maximumValue.tenTrillions,
    minimumValue                 : AutoNumeric.options.minimumValue.tenTrillions,
    modifyValueOnWheel           : AutoNumeric.options.modifyValueOnWheel.modifyValue,
    negativeBracketsTypeOnBlur   : AutoNumeric.options.negativeBracketsTypeOnBlur.none,
    negativePositiveSignPlacement: AutoNumeric.options.negativePositiveSignPlacement.none,
    negativeSignCharacter        : AutoNumeric.options.negativeSignCharacter.hyphen,
    noEventListeners             : AutoNumeric.options.noEventListeners.addEvents,
    //TODO Shouldn't we use `truncate` as the default value?
    onInvalidPaste               : AutoNumeric.options.onInvalidPaste.error,
    outputFormat                 : AutoNumeric.options.outputFormat.none,
    overrideMinMaxLimits         : AutoNumeric.options.overrideMinMaxLimits.doNotOverride,
    positiveSignCharacter        : AutoNumeric.options.positiveSignCharacter.plus,
    rawValueDivisor              : AutoNumeric.options.rawValueDivisor.none,
    readOnly                     : AutoNumeric.options.readOnly.readWrite,
    roundingMethod               : AutoNumeric.options.roundingMethod.halfUpSymmetric,
    saveValueToSessionStorage    : AutoNumeric.options.saveValueToSessionStorage.doNotSave,
    selectNumberOnly             : AutoNumeric.options.selectNumberOnly.selectNumbersOnly,
    selectOnFocus                : AutoNumeric.options.selectOnFocus.select,
    serializeSpaces              : AutoNumeric.options.serializeSpaces.plus,
    showOnlyNumbersOnFocus       : AutoNumeric.options.showOnlyNumbersOnFocus.showAll,
    showPositiveSign             : AutoNumeric.options.showPositiveSign.hide,
    showWarnings                 : AutoNumeric.options.showWarnings.show,
    styleRules                   : AutoNumeric.options.styleRules.none,
    suffixText                   : AutoNumeric.options.suffixText.none,
    symbolWhenUnfocused          : AutoNumeric.options.symbolWhenUnfocused.none,
    unformatOnHover              : AutoNumeric.options.unformatOnHover.unformat,
    unformatOnSubmit             : AutoNumeric.options.unformatOnSubmit.keepCurrentValue,
    valuesToStrings              : AutoNumeric.options.valuesToStrings.none,
    watchExternalChanges         : AutoNumeric.options.watchExternalChanges.doNotWatch,
    wheelOn                      : AutoNumeric.options.wheelOn.focus,
    wheelStep                    : AutoNumeric.options.wheelStep.progressive,
};

Object.freeze(AutoNumeric.defaultSettings);
Object.defineProperty(AutoNumeric, 'defaultSettings', { configurable: false, writable: false });
