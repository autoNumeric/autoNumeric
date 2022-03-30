## Upgrade from versions [`1.9.*`](https://github.com/autoNumeric/autoNumeric/releases/tag/1.9.46)/[`2.*`](https://github.com/autoNumeric/autoNumeric/releases/tag/v2.0.13) to version [`4.*`](https://github.com/autoNumeric/autoNumeric/tree/v4.0.0)

Version `4` has seen a [lots of improvements and new features](https://github.com/autoNumeric/autoNumeric/releases/tag/v4.0.0), but also introduce breaking changes if you are trying to use it with an old `v1.9` or `v2` configuration.

### Initialization

Initialization of an AutoNumeric object [has changed](https://github.com/autoNumeric/autoNumeric/#initialization) a bit.<br>
Since AutoNumeric is now an ES6 module, *`AutoNumeric` being the name of the `class`*, and since the jQuery dependency has been dropped, you now longer need to first select the DOM element with jQuery, then call the `$(yourElement).autoNumeric('init', { options })` method, but only need to instantiate an `AutoNumeric` object using `new AutoNumeric(yourElement, { options })` (or if you do not already have a reference to the DOM element, use `new AutoNumeric('myCSSSeletor', { options })`).

| <= `v2` (Before)          | `v4` (After) |
| :---------------- | :-----------  |
| `$('.myInput').autoNumeric('init', { options });` | If you want to initialize [only one element](https://github.com/autoNumeric/autoNumeric/#initialize-one-autonumeric-object): `new AutoNumeric('.myInput', { options });` |
|  | If you want to initialize [multiple elements](https://github.com/autoNumeric/autoNumeric/#initialize-multiple-autonumeric-objects-at-once): `AutoNumeric.multiple('.myCssClass > input', { options });` |

### Configuration

The old option names have changed and are now deprecated, in favor of the [new ones](https://github.com/autoNumeric/autoNumeric/#options).<br>
To help you switch to the new names, detailed warning messages are displayed in the console if an old option name is detected.

> Do note that the option `mDec` (or its new name `decimalPlacesOverride` if you used `v2`) **is no longer used**.<br>
If you want to specify the number of decimals, instead of relying on the maximum number of decimal places in `minimumValue` or `maximumValue` like before, you can now set `decimalPlaces` to set it globally.<br>
If you wish, you can also specify a different number of decimal places for the formatted value (with `decimalPlacesShownOnFocus` and `decimalPlacesShownOnFocus`) or the `rawValue` (with `decimalPlacesRawValue`).

| <= `v2` (Before)          | `v4` (After) |
| :---------------- | :-----------  |
| `aSep`          | `digitGroupSeparator` |
| `nSep`          | `showOnlyNumbersOnFocus` |
| `dGroup`        | `digitalGroupSpacing` |
| `aDec`          | `decimalCharacter` |
| `altDec`        | `decimalCharacterAlternative` |
| `aSign`         | `currencySymbol` |
| `pSign`         | `currencySymbolPlacement` |
| `pNeg`          | `negativePositiveSignPlacement` |
| `aSuffix`       | `suffixText` |
| `oLimits`       | `overrideMinMaxLimits` |
| `vMax`          | `maximumValue` |
| `vMin`          | `minimumValue` |
| `mDec`          | `decimalPlacesOverride`<br>(Deprecated) |
| `eDec`          | `decimalPlacesShownOnFocus` |
| `scaleDecimal`  | `decimalPlacesShownOnBlur` |
| `aStor`         | `saveValueToSessionStorage` |
| `mRound`        | `roundingMethod` |
| `aPad`          | `allowDecimalPadding` |
| `nBracket`      | `negativeBracketsTypeOnBlur` |
| `wEmpty`        | `emptyInputBehavior` |
| `lZero`         | `leadingZero` |
| `aForm`         | `formatOnPageLoad` |
| `sNumber`       | `selectNumberOnly` |
| `anDefault`     | `defaultValueOverride` |
| `unSetOnSubmit` | `unformatOnSubmit` |
| `outputType`    | `outputFormat` |
| `debug`         | `showWarnings` |

If you want more detail about the AutoNumeric options, feel free to browse the [AutoNumeric options source code](https://github.com/autoNumeric/autoNumeric/blob/master/src/AutoNumericOptions.js) which has detailed comment for each one.<br>
*Check out the new options on the official website [here](http://autonumeric.org/guide).*

### Method calls

Moreover, since we are now using an `AutoNumeric` object, we can now directly call its [methods](https://github.com/autoNumeric/autoNumeric/#methods) (and [chain](https://github.com/autoNumeric/autoNumeric/#function-chaining) them if needed).<br> 
In the following table, the `anElement` variable is created using `const anElement = new AutoNumeric('someSelector', { options })`.

The methods are now called like so:

| <= `v2` (Before)          | `v4` (After) |
| :---------------- | :-----------  |
| `$(someSelector).autoFormat('1234.56', { options });` | `AutoNumeric.format(1234.56, { options });` |
| `$(someSelector).autoUnFormat('1.234,56 €', { options });` | `AutoNumeric.unformat('1.234,56 €', { options });` |
| `$(someSelector).autoValidate({ options });` | `AutoNumeric.validate({ options })` |
| `$.fn.autoNumeric.defaults` | `AutoNumeric.getDefaultConfig()` |
| `$(someSelector).autoNumeric("destroy");` | `anElement.remove();` |
| `$(someSelector).autoNumeric('get');` | `anElement.getNumericString();` |
| `$(someSelector).autoNumeric('getArray');` | `anElement.formArrayNumericString();` |
| `$(someSelector).autoNumeric('getFormatted');` | `anElement.getFormatted();` |
| `$(someSelector).autoNumeric('getLocalized');` | `anElement.getLocalized();` |
| `$(someSelector).autoNumeric('getNumber');` | `anElement.getNumber();` |
| `$(someSelector).autoNumeric('getString');` | `anElement.formNumericString();` |
| `$.fn.autoNumeric.lang` | `AutoNumeric.getPredefinedOptions()` |
| `$(someSelector).autoNumeric('reSet');` | `anElement.reformat();` |
| `$(someSelector).autoNumeric('set', '12345.67');` | `anElement.set(12345.67);` |
| `$(someSelector).autoNumeric('unSet');` | `anElement.unformat();` |
| `$(someSelector).autoNumeric("update", { options });` | `anElement.update({ options });` |
| `$(someSelector).autoNumeric("wipe");` | `anElement.wipe();` |

Check the [methods documentation](https://github.com/autoNumeric/autoNumeric/#instantiated-methods) to see how some of those functions signatures changed.


If you encounter any problem upgrading to `v4`, feel free to contacts us on our [Gitter channel](https://gitter.im/autoNumeric/autoNumeric) or on IRC on Freenode `#autoNumeric`!
