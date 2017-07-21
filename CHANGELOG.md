### Change log for autoNumeric:

### "2.0.13"
+ Merge the fix from issue #440 Pasting does not work in IE11 from `next` to `master`.
  This fix the issue #465 "Unable to get property 'getData' of undefined or null reference" on paste in IE11
+ Merge the fix from issue #449 `AutoNumeric.unformat()` only removes the first instance of `settings.digitGroupSeparator` from `next` to `master`.

### "2.0.12"
+ Add Android Chrome mobile (version 57) support (note: so far, not all android browsers are supported)
+ Fix issue #404 On the Android browser, inserted numbers are doubled if the user press the keys quickly on the virtual keyboard
+ Fix issue #250 The `maximumValue` and `minimumValue` options are not taken into account on Android
+ Fix issue #264 Entering the `decimalCharacterAlternative` is not taken into account on Android Chrome
+ Add the special keyCode 229 used by Android browsers as `keyCode.AndroidDefault`
+ Fix the `onPaste` handler throwing an error for uninitialized variables
+ Complete the `arabicToLatinNumbers()` function to return more quickly if not arabic numbers are found

### "2.0.11"
+ Fix issue #248 Create the `autoNumeric` organization, and move the repository to it

### "2.0.10"
+ Fix issue #417 Error thrown in PhantomJS 2.1.1 on Linux under CI Environment
+ Fix the end-to-end tests for issue #403
+ Fix the webdriver.io configuration for the links to jQuery and AutoNumeric libraries

### "2.0.9"
+ Fix issue #401 autoNumeric 2.0.8 prevents IE11 from entering the decimal character from the numpad
+ Fix issue #403 autoNumeric 2.0.8 scaling option when the divisor is less than zero and the input receives focus multiple times  

### "2.0.8"
+ Fix issue #389 autoNumeric 2.0.7 npm packages causes build error with typescriptify + browserify

### "2.0.5", "2.0.6" & "2.0.7"
+ Fix issue #384 `npm install` for version 2.0.4 does not work on Windows machines

### "2.0.2", "2.0.3" & "2.0.4"
+ Fix issue #377 The `dist` files in the last publish to npmjs were not rebuilt with the fixes pushed to 2.0.1
+ Fix issue #373 The `dist` files are not included when publishing to npmjs
+ Fix issue #371 The currency symbol is not removed on blur with the default `emptyInputBehavior` value `focus`
+ Fix issue #367 The package.json "postinstall" task does not find the target file when not using the dev dependencies

### "2.0.1"
+ Fix issue #373 The `dist` files are not included when publishing to npmjs

### "2.0.0"
+ Release autoNumeric version `2.0.0`, enjoy! (¬‿¬) :tada:
+ The old options names are being deprecated, and will be removed *soon* ; update your scripts with the [new ones](README.md#options)!
+ Please be sure to read the updated [readme](README.md) in order to know what else has changed. 

### "2.0.0-beta.25"
+ Fix issue #310 Setup Webdriver.io for end-to-end (e2e) testing

### "2.0.0-beta.24"
+ Fix issue #326 Pasting a single decimal character into an input that has none does not work
+ Fix issue #322 Pasting a string containing a comma set the caret position at the wrong position

### "2.0.0-beta.23"
+ Fix issue #354 Setup automated coverage tests (with Coveralls)

### "2.0.0-beta.22"
+ Fix issue #345 Setup continuous integration testing (with Travis CI)

### "2.0.0-beta.21"
+ Fix issue #346 Add a `showPositiveSign` option to display the positive sign wherever needed

### "2.0.0-beta.20"
+ Fix issue #341 Add some default options in the `languageOption` object
+ Fix issue #328 Switch from `npm` to `yarn`

### "2.0.0-beta.19"
+ Allow using `set` with Arabic and Persian numbers (ie. `aNInput.autoNumeric('set', '١٠٢٣٤٥٦٧.٨٩');`)
+ Allow using Arabic and Persian numbers (used in Arabic languages) in the html `value` attribute
+ Allow pasting Arabic and Persian numbers (that will get converted to latin numbers on the fly)

### "2.0.0-beta.18"
+ Fix issue #330 The `negativePositiveSignPlacement` option can be ignored in some cases
+ Fix issue #339 `get` returns `'0'` when the input is empty even if `emptyInputBehavior` is not equal to `'zero'`

### "2.0.0-beta.17"
+ Fix issue #317 allow jumping over the decimal character when the caret is just left of the decimal character and the user enters the decimal character
+ Fix issue #319 so the 'get' method returns a negative value when there is a trailing negative sign.
+ Fix issue #327 so the entire content is selected when tabbing in. 

### "2.0.0-beta.16"
+ Fix issue #321 Allows more international decimal characters and grouping separators :
 + Allowed grouping separator : `','`, `'.'`, `'٬'`, `'˙'`, `"'"`, `' '`, `'\u2009'`, `'\u202f'`, `'\u00a0'` and `''`
 + Allowed decimal characters : `'.'`, `','`, `'·'`, `'⎖'` and `'٫'`

### "2.0.0-beta.15"
+ Fix FireFox on issue #306 that allows the caret to move right when all zero present in the decimals
+ Fix issue #318 `this.selection` can be uninitialized if you focus on an input via the `Tab` key.
+ Add the `keyName` object that list the key values as defined is the KeyboardEvent Key_Values.
+ Rename the `key()` function to `keyCodeNumber()`.
+ Split `_updateFieldProperties()` into `_updateAutoNumericHolderProperties()` and `_updateAutoNumericHolderEventKeycode()`.
+ `_updateAutoNumericHolderProperties()` only update the value and selection in each event handler, and resets the 'processed' and 'formatted' states.
+ `_updateAutoNumericHolderEventKeycode()` is called only once on `keypress`, and set the event keyCode into the AutoNumericHolder object.
+ Remove the need to save `this.ctrlKey`, `this.cmdKey` and `this.shiftKey` three times on each key stroke.
+ Rename `this.kdCode` into `this.eventKeyCode`, and use that variable globally in the AutoNumericHolder object.
+ Fix `_normalizeParts()` so that a '0' entered via the numpad is managed as well.
+ Complete the substitution of magic numbers with `keyCode` values.
+ Modify `_processCharacterInsertion()` so that it take the event as an argument, and therefore can directly use `e.key`.
+ Simplify `_formatValue()` tests.

### "2.0.0-beta.14"
+ Fix issue #306 when { leadingZero: 'deny' } and proper caret placement

### "2.0.0-beta.13"
+ Fix issue #228 Do not modify the current selection when trying to input an invalid character
+ Mass rename functions to gives them a more explicit name :

| Old name                    |          | New name |
| :---------------- | :------------ | :-----------:  |
| autoCheck()       | -> | checkIfInRangeWithOverrideOption()                       |
| autoRound()       | -> | roundValue()                                             |
| autoGroup()       | -> | addGroupSeparators()                                     |
| fixNumber()       | -> | modifyNegativeSignAndDecimalCharacterForRawValue()       |
| presentNumber()   | -> | modifyNegativeSignAndDecimalCharacterForFormattedValue() |
| negativeBracket() | -> | toggleNegativeBracket()                                  |
| autoGet()         | -> | getCurrentElement()                                      |
| getHolder()       | -> | getAutoNumericHolder()                                   |
| autoSave()        | -> | saveValueToPersistentStorage()                           |
| _setPosition()    | -> | _setCaretPosition()                                      |
| _signPosition()   | -> | _getSignPosition()                                       |
| _formatQuick()    | -> | _formatValue()                                           |

### "2.0.0-beta.12"
+ Modify the `validate()` function to show a warning when `decimalPlacesOverride` is greater than `decimalPlacesShownOnFocus`.
+ Implement feature request #183 that manage invalid results when trying to paste any number. This adds the `onInvalidPaste` option that can accept the `error`, `ignore`, `clamp`, `truncate` and `replace` value.
+ Rename `autoStrip()` to `stripAllNonNumberCharacters()`.
+ Upgrade the `setElementSelection()` function so that it can accept only one caret position.
+ Add a `failOnUnknownOption` option which allows autoNumeric to strictly analyse the options passed, and fails if an unknown options is used in the settings object.

### "2.0.0-beta.11"
+ Fix typos and missing characters that prevented building the library.

### "2.0.0-beta.10"
+ Fix issue #302 `leadingZero` option `deny` does not function correctly and deletes some of the zero to the right of the caret
+ Fix issue #303 When focusing on an input having `currencySymbolPlacement` set as `p` (prefix)

### "2.0.0-beta.9"
+ Rename the old options name to more explicit ones :

| Old name         |          | New name |
| :------------ | :------------ | :-----------:  |
| aSep          | -> | digitGroupSeparator           |
| nSep          | -> | noSeparatorOnFocus            |
| dGroup        | -> | digitalGroupSpacing           |
| aDec          | -> | decimalCharacter              |
| altDec        | -> | decimalCharacterAlternative   |
| aSign         | -> | currencySymbol                |
| pSign         | -> | currencySymbolPlacement       |
| pNeg          | -> | negativePositiveSignPlacement |
| aSuffix       | -> | suffixText                    |
| oLimits       | -> | overrideMinMaxLimits          |
| vMax          | -> | maximumValue                  |
| vMin          | -> | minimumValue                  |
| mDec          | -> | decimalPlacesOverride         |
| eDec          | -> | decimalPlacesShownOnFocus     |
| scaleDecimal  | -> | scaleDecimalPlaces            |
| aStor         | -> | saveValueToSessionStorage     |
| mRound        | -> | roundingMethod                |
| aPad          | -> | allowDecimalPadding           |
| nBracket      | -> | negativeBracketsTypeOnBlur    |
| wEmpty        | -> | emptyInputBehavior            |
| lZero         | -> | leadingZero                   |
| aForm         | -> | formatOnPageLoad              |
| sNumber       | -> | selectNumberOnly              |
| anDefault     | -> | defaultValueOverride          |
| unSetOnSubmit | -> | unformatOnSubmit              |
| outputType    | -> | outputFormat                  |
| debug         | -> | showWarnings                  |

+ Add a `convertOldOptionsToNewOnes()` function that automatically convert old options to new ones, to ease the evolution to v2.*.
+ Update `typings.d.ts` accordingly
+ Update `README.md` accordingly
+ Complete the tests to make sure using old option names will output a warning about them being deprecated

### "2.0.0-beta.8"
+ Fix issue #292 where native input and change events are not sent correctly.
+ Add a `isNumber()` helper function to test if a value is a number, or a string representing a number.
+ Add a `isInt()` helper function to test if a value is a 'real' integer.
+ Modify `decimalPlaces()` so that it always return the number of decimal places (ie. `0` instead of `null` if there is none). 
+ Add a `key()` helper function to retrieve an event keyCode.
+ Complete and improve some JSDoc.
+ Rename `runCallbacks()` into `runCallbacksFoundInTheSettingsObject()`.
+ Simplify `decLength()` function, as well as removing unnecessary code before each call to this function.
+ Rename `decLength()` to `maximumVMinAndVMaxDecimalLength()`.
+ Drastically improve performance by removing duplicated function calls.
+ Improve `autoCode()` call hierarchy.
+ Merge `autoCode()` into `getInitialSettings()`.
+ Caches an additional regex.
+ Rename some functions and variables to make them more explicit.
+ Refactor `autoGroup()` to use switch statements.
+ Refactor how `dPos` was used to make it more understandable.
+ Rename `keepOriginalSettings` into `keepAnOriginalSettingsCopy()`.
+ Simplify `autoSave()` so that it directly uses the element as an argument, instead of a jQuery reference.
+ Create an AutoNumericHolder ES6 class to store the field properties of an autoNumeric element.
+ Rename the AutoNumericHolder `init()` function to `_updateFieldProperties()`.
+ Rename the AutoNumericHolder functions that should be private.
+ Fix issue #283.
+ Rename `processAlways()` into `_processCharacterDeletion()`, and simplify it so that if does not do two things at the same time.
+ Rename `processKeypress()` into `_processCharacterInsertion()`, and simplify it so that if does not do two things at the same time.
+ Merge some conditions in `_formatQuick()`.
+ Remove the need for a jQuery dependency in the events listeners.
+ Convert some jQuery event listeners to pure JS event listeners.
+ Convert some jQuery-specific functions to native JS ones (ie. `$this.val()` to `e.target.value`).
+ Simplify the event listeners by removing any unused returns.
+ Remove unnecessary `getHolder()` calls in the event listeners.
+ Make the 'enter' key send a `change` event when used and the value has been changed.
+ Add an `onBlur` event listener, allowing us to trigger `change` events as needed.
+ Reduce `getInitialSettings()` length by a great deal, making it easier to read and understand.
+ The `getInitialSettings()` functions now calls the `calculateVMinAndVMaxIntegerSizes()`, `correctMDecOption()`, `setsAlternativeDecimalSeparatorCharacter()`, `cachesUsualRegularExpressions()` and `transformOptionsValuesToDefaultTypes()` functions.
+ Refactor the `update()` code into `getInitialSettings()`, which allows to remove the `autoCode()` calls from the AutoNumericHolder constructor and the `_updateFieldProperties()` function.
+ Remove the need for jQuery in `getSettings()`.
+ Modify the `validate()` test on the `mDec` option to allow for a positive integer too.
+ Allow the `autoFormat()` function to format numbers represented as a string.
+ Complete the `autoFormat()` tests and check for the value validity.
+ Remove the `sendCustomEvent()` function and replace it by the `triggerEvent()` one (and remove `createCustomEvent()` as well).
+ Complete the `autoUnFormat()` tests and check for the value validity.
+ Modify the `autoUnFormat()` behavior so that when given a number (a real one or a string representing one), the function always return a 'real' number, whatever the options passed.
+ Modify the eslint 'radix' rule to allow for always specifying a radix for the `parseInt` function.
+ Comment out the default Jasmine test in order to see a 100% success without any skipped tests.
+ Fix the `clean:build` npm script so that it does not try to remove an inexistant folder.

### "2.0.0-beta.7"
+ Add "mouseenter" & "mouseleave" handlers to enable viewing the extended values for "eDec", "scaleDivisor" & "nSep" options.
+ Add third parameter to the "autoGet" call in "onFocusOutAndMouseLeave" function

### "2.0.0-beta.6"
+ Rename the `localOutput` setting to `outputType`, and add an option 'number' that makes `getLocalized` always return a Number, instead of a string.
+ Modify the `get` function so that it always returns a valid Number or string representing a number that Javascript can interpret.
+ Add a `getLocalized` function that return the raw value of the input, but can also return the value localized with a decimal point and negative sign placement chosen by the user (basically, it replace the old `get` behavior if any user wants it back).
+ Modify the `pNeg` default value based on the `aSign` and `pSign` values. This leads to better user experience when setting a currency symbol without setting `pNeg`.
+ Errors are now always thrown. The `debug` option now only affects the warning messages (used for non-critical errors).

### "2.0.0-beta.5"
+ Add a `validate()` method that checks if the given options object is valid.
+ Reorganize the `init` function code to check for critical error first, before doing other calculus.
+ Add a `areSettingsValid()` method that return true if the options object is valid.
+ Add multiple helper functions `isBoolean`, `isNull`, `isTrueOrFalseString`, `isObject`, `isEmptyObj`, `hasDecimals`,  `decimalsPlaces`.
+ Add a `warning()` method that output warning message to the console.
+ Rename `originalSettings` to `keepOriginalSettings` to better convey what this function is doing.

### "2.0.0-beta.4"
+ Removed the index.html file
+ Additional mods/fixes to the scaling options
+ Additional mods/fixes to the "nSep" to also handle the "aSuffix"
+ Fixed the "mRound" default

### "2.0.0-beta.3"
+ fixed nSep option which removes the Currency symbom and thousand seperator on focusin
+ changed the defaulys of scaleDivisor, scaleDecimal & scaleSymbol to null

### "2.0.0-beta.2"
+ modified the scaling o[tiona and seperated the options
+ aScale - removed
+ scaleDivisor added
+ scaleDecimal added
+ scaleSymbol added

### Version 2.0.0-beta.0 released 2016-11-16
+ Prepare the code base for future Jasmine tests
+ Add initial babel support
+ Add uglify and npm-build-process support
+ Merge the 2.0 changes into master
+ Add npm support for building the minified version
+ Multiple small fixes
+ Fixed paste event on both context menu and `ctrl-v` // issue #251 special thanks to @rhyek
+ Fixed tab in key select all and deletion // issue #246
+ Fixed issue with Vue.js 2.0 // issue #247 
+ Fixed context menu paste event // issue #251
+ switch from jsLint to jsHint
+ Fixed tab in key // thanks movalz issue #212
+ Fixed the cursor position when tabbing in Chrome // thanks Dennis Smith issue #221
+ Fixed the destroy method // thanks brunoporto & Mabusto issue #225
+ Fixed the readme file to show correct `$.extend` defaults // thanks  gayan85 issue #229
+ Fixed bug in unSetOnSubmit option to handle non autoNumeric controlled inputs
+ Fixed bug in `get` method
+ Mods to the trailing minus sign code 
+ Added UMD support
+ Modified & improved the shim for throwing the `input` event
+ Added option `unSetOnSubmit` to unformat input on the submit event
+ Added option `debug` to turn on and off error being thrown
+ Added support for arbitrary-precision decimal arithmetic. This was adapted from Big.js https://github.com/MikeMcl/big.js/ Many thanks to Mike
+ Added support for trailing minus signs
+ Added rounding methods for currencies with smallest coin being $0.05
+ Added modified `sNumber` option that selects only numbers ctr & a keys thanks Zayter
+ Added support for return values to have locale formats
+ Added debug option to turn off errors
+ Added option `anDefault` to help ASP.NETR postback errors
+ Modified the `wEmpty` option
+ Modified the `init` && `set` methods
+ General code clean up
+ Modified the `set`, `getString` & `getArray` methods
+ Modified the `nBracket` function
+ Fixed the `update` method when it is called during the `onfocus` event
+ Fixed the `getString` & `getArray` methods when multiple inputs share the same name - Thanks Retromax
+ Fixed bug in `ctrl + v` paste event to properly round 
+ Merged a mod that makes the defaults public and overridable - Thanks Peter Boccia
+ Fixed page reload when the thousand separator is a period `.`

### Version 1.9.46 released 2016-09-11
+ Fixed tab in key // thanks movalz issue #212
+ Fixed the cusor position when tabbing in Chrome // thanks Dennis Smith issue #221
+ Fixed the destroy method // thanks brunoporto & Mabusto issue #225
+ Fixed the readme file to show correct $.extend defaults // thanks  gayan85 issue #229 

### Version 1.9.45 released 2016-06-13
+ Modified the "set" method to handle NaN

### Version 1.9.44 released 2016-06-06
+ Fixed destroy method
+ Added Typings support - thanks bcherny 

### Version 1.9.43 released 2015-12-19
+ UMD support

### Version 1.9.42 released 2015-11-20
+ Fixed bug when pasting using  ctrl & v keys

### Version 1.9.41 released 2015-11-2
+ Fixed bug that allowed two currency symbols - thanks Mic Biert

### Version 1.9.40 released 2015-10-25
+ Fixed bug when pasting value and the decimal seperator is a comma ","
+ Modified the "destroy" method so that an error is not thrown if the "init" method has not been called previously

### Version 1.9.39
+ Fixed 'aForm'option.
+ Updated the readme file

### Version 1.9.38
+ Added / fixed option to address asp.Net WebForm postback.
+ please see the readme section on default settings & options 

### Version 1.9.37
+ Added / fixed support for asp.Net WebForm postback.
+ During postback the default value is re-rendered showing the updated value
+ Because autoNumeric cannot distinguish between a page re-load and asp.net form postback, the following HTML data attribute is REQUIRED (data-an-default="same value as the value attribute") to prevent errors on postback
+ Example:
```html
<input type="text" id="someID" value="1234.56" data-an-default="1234.56">
```

### Version 1.9.36
+ Rewrote the "getString" & "getArray" methods to index successful elements and inputs that are controlled by autoNumeric. This ensures the proper input index is used when replacing the formatted value.
+ Added support for FireFox for Mac meta key "keycode 224" - Thanks Ney Estrabelli

### Version 1.9.35
+ Revert 'set' back to version 1.9.34

### Version 1.9.34
+ Modified the 'set', 'getString' & 'getArray' methods
+ Modified the 'nBracket' function
+ General code clean up

### Version 1.9.33
+ Fixed bug in "ctrl + v" paste event introduced in 1.9.32

### Version 1.9.32
+ Fixed bug when the "update" method is called in the "onfocus" event
+ Fixed the "getString" & "getArray" methods when multiple inputs share the same name - Thanks Retromax
+ Fixed bug in "ctrl + v" paste event to properly round

### Version 1.9.31
+ never officially release

### Version 1.9.30
+ Fixed bug introduced 1.9.29 too interested in Ohio State vs. Oregon

### Version 1.9.29
+ Fixed bug introduced in 1.9.27

### Version 1.9.28
+ Fixed focusout event when the thousand separator is a period "." and only one is present "x.xxx" with not other alpha characters.

### Version 1.9.27
+ Merged a mod that makes the defaults public and over ridable - Thanks Peter Boccia
+ Fixed page reload when the thousand separator is a period "."

### Version 1.9.26
+ Fixed "getString" & "getArray" methods when multiple forms having some shared named inputs

#### Version 1.9.25
+ Fixed mRound option "round-half-even"
+ Modified the "set" method to not throw an error when trying to "set" a null value

#### Version 1.9.24
+ Changed the case on the supported elements
+ This was required because jQuery.prop('tagName') returns upper-case on html5 pages and returns lower-case on xmhtl pages

#### Version 1.9.23
+ Merged mod on the "getString" method

#### Version 1.9.22
+ Fixed a bug when a negative value uses brackets and currency sign on page reload thanks to Allen Dumaine
+ Additional mods to the "set" method.
+ Eliminated lastSetValue setting

#### Version 1.9.21
+ Mod to checkValue function to handle empty string - thanks to jedichenbin.
+ If CHF rounding is used decimal is automatically set to 2 places

#### Version 1.9.20
+ Fixed issue for very small numbers - thanks to jedichenbin.

#### Version 1.9.18
+ Added input type="tel" support.
+ Added support for Swiss currency rounding to the nearest ".00 or .05"
+ Fixed bug in Round-Half-Even "Bankers Rounding"

#### Version 1.9.18
+ Fixed formatting on page load for text elements.

#### Version 1.9.17
+ Fixed leading zero on page load when option lZero is set to 'keep'.

#### Version 1.9.16
+ Fixed the checkValue function when vary small numbers in scientific notation are passed via the set method.
+ Modified the rounding method so zero value is not returned with a negative sign

#### Version 1.9.15
+ Fixed bug introduced in version 1.9.14

#### Version 1.9.14
+ Added additional supported tags ('b', 'caption', 'cite', 'code', 'dd', 'del', 'div', 'dfn', 'dt', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ins', 'kdb', 'label', 'li', 'output', 'p', 'q', 's', 'sample', 'span', 'strong', 'td', 'th', 'u', 'var')
+ Moved the routine that tests for supported tags
+ General code clean-up

#### Version 1.9.13
+ Fixed the "get" method when the input receives focus for a second time.

#### Version 1.9.12
+ Fixed brackets on page load when the decimal character is a comma.

#### Version 1.9.11
+ Another mod to the 'set' method.

#### Version 1.9.10
+ Fixed the 'set' method to handle page reload using the back button.

#### Version 1.9.9
+ Fixed how non-input tags default value is handled.  When the default is an empty string and aSign is not empty the return value is now and empty string.
+ Modified how default values are handled when the decimal character equals ',' comma. Your default value can now use either a a period '.' or comma ',' as the decimal separator
+ Modified the caret placement on focusin (tab in). If only the currency sign is visible the caret is placed in the proper location depending on the sign placement (prefix or suffix).

#### Version 1.9.8
+ Changed bind / unbind to on / off.
+ added lastSetValue to settings - this saves the unrounded value from the set method - $('selector').data('autoNumeric').lastSetValue; - helpful when you need to change the rounding accuracy

#### Version 1.9.7
+ Modified /fixed the format default values on page ready.
+ Fixed the caret position when jumping over the thousand separator with back arrow.

#### Version 1.9.6
+ Fixed bug introduced in 1.9.3 with shift key.
+ additional modification to the processKeypress function that automatically inserts a negative sign when vMax less tham or equal to 0 and vMin is less tham vMax.

#### Version 1.9.5
+ Modified processKeypress function to automatically insert a negative sign when vMax <=0 and vMin < 0.
+ Changed the getSting and getArray functions to use decodeURIComponent() instead of unescape() which is depreciated

#### Version 1.9.4
+ Merged issue #11 - Both getString and getArray were using escaped versions of the name from jQuery's serialization. So this change wraps the name finder with quotes and unescapes the name.Fixed a bug in autoCode that corrects the pasted values and page re-load - Thanks Cory.
+ Merged issue #12 - If a input is readonly during "init", autocomplete won't work if the input is enabled later. This commit should fix the Problem - Thanks Sven.

#### Version 1.9.3

+ Fixed a bug in autoCode function that corrects pasted values and page re-load
+ Added support for "shift" + "insert" paste key combination

#### Version 1.9.2

+ Modified the "checkValue" function - eliminated redundant code
+ Modified the "update" method include calling the "getHolder" function which updates the regular expressions
+ Modified the "getHolder function so the regular expressions are updated
+ Modified the "set" method to convert value from number to string

#### Version 1.9.1

+ Modified the checkValue function to handle values as text with the exception of values less than "0.000001 and greater than -1"

#### Version 1.9.0

+ Fixed a rounding error when the integers were 15 or more digits in length
+ Added "use strict";

#### version 1.8.9

+ Fixed the "get" and "set" methods by moving the settings.oEvent property to ensure the error message would be thrown if the element had not been inialized prior to calling the "get" and "set" methods

#### Version 1.8.8

+ Fixed the "init" when there is a default and value aForm=true and the aSep and aDec are not the defaults

#### Version 1.8.7

+ Fixed the "getSting" method - it use to returned an error when no values were entered
+ Modified the "init" method to better handle default and pre-existing values
+ Modified the "set" method - removed the routine that checked for values less than .000001 and greater than -1 and placed it in a separate function named checkValue()
+ Modified the "get" method:
    + Added a call to the checkValue() function - this corrects returned values example - when the input value was "12." the returned value was "12." - it now returns "12"
    + When no numeric character is entered the returned value is an empty string "".

#### Version 1.8.6

+ Removed the error message when calling the 'init' methods multiple times. This was done when using the class selector for the 'init' method and then dynamically adding input(s) it allows you to use the same selector to init autoNumeric. **Please note:** if the input is already been initialized no changes to the option will occur you still need to use the update method to change exisiting options.
+ Added support for brackets '[,]', parentheses '(,)', braces '{,}' and '<,>' to the nBracket setting. **Please note:** the following format nBracket: '(,)' that the left and right symbol used to represent negative numbers must be enclosed in quote marks and separated by a comma to function properly.

#### Version 1.8.5

+ Fixed readonly - this occured when you toggle the readonly attribute


#### Version 1.8.4

+ Fixed the getString and getArray methods under jQuery-1.9.1


#### version on 1.8.3

+ Added input[type=hidden] support - this was done mainly for backward compatibility.
+ The "get" method now returns a numeric string - this also was done for backward compatibility.


#### Version 1.8.2

+ Allowed dGroup settings to be passed as a numeric value or text representing a numeric value
+ Allows input fields without type that defaults to type text - Thanks Mathieu DEMONT


#### Version 1.8.1

+ Modified the 'get' method so when a field is blank and the setting wEmpty:'empty' a empty string('') is returned.


#### Version 1.8.0

+ autoNumeric() 1.8.0 is not compatible with earlier versions but I believe you will find version 1.8.0's new functionality and ease of use worth the effort to convert.
+ Changed autoNumeric structure to conform to jQuery's recommended plugin development.
+ Created a single namespace and added multiple methods.
+ Added HTML 5 data support and eliminated the metadata plugin dependency.
+ Added support for the following elements: 'DD', 'DT', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'input', 'LABEL', 'P', 'SPAN', 'TD', 'TH'.
+ Changed the settings loading order to defaults, HTML5 data then options. Now the defaults settings are overridden by HTML5 data and options overrides both defaults & HTML5 data.
+ Added "lZero" to the settings to control leading zero behavior.
+ Added "nBracket" to the settings which controls if negative values are display with brackets.
+ Changed the callback feature to accept functions only.
+ Improved the 'aForm' behavior that allows values to be automatically formatted on page ready.
+ Fixed the issue for numbers that are less than 1 and greater than -1 and have six or more decimal places.
+ Fixed 'crtl' + 'a' (select all) and 'ctrl' + 'c' (copy) combined key events.
+ Fixed a IE & FF bug on readonly attribute.
+ General code clean up
