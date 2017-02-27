## What is [autoNumeric](http://www.decorplanit.com/plugin/)?

autoNumeric is a standalone Javascript library that provides live *as-you-type* formatting for international numbers and currencies.

[![NPM][nodei-image]][nodei-url]
<br>
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![Coverage Status][coveralls-image]][coveralls-url]
<br>
[![Gitter chat][gitter-image]][gitter-url]

The latest stable branch is [3.*](https://github.com/BobKnothe/autoNumeric/tree/master).<br>For older stable versions, please take a look [here](#older-versions), while for the latest development version, check the `next` [branch](https://github.com/BobKnothe/autoNumeric/tree/next).<br><br>
Moreover, you can take a look at what could be the next features coming to autoNumeric on our [project](https://github.com/BobKnothe/autoNumeric/projects) page *(feel free to participate!)*.

#### Highlights
autoNumeric main features are :
- Easy to use and configure
```js
// Initialization
new AutoNumeric('.myInput', { currencySymbol : '$' });
```
- Very high configurability (more than 38 [options](#options) available)
```js
// The options are...optional :)
const autoNumericOptionsEuro = {
    digitGroupSeparator        : '.',
    decimalCharacter           : ',',
    decimalCharacterAlternative: '.',
    currencySymbol             : '\u202f€',
    currencySymbolPlacement    : AutoNumeric.options.currencySymbolPlacement.suffix,
    roundingMethod             : 'U',
};

// Initialization
new AutoNumeric(domElement, autoNumericOptionsEuro);
```
- User experience oriented ; using autoNumeric just feels right and natural
- Supports most international numeric formats and currencies<br>*(If the one you use is not supported yet, open an [issue](https://github.com/BobKnothe/autoNumeric/issues/new) and we'll add it as soon as possible!)*

*And also:*
- Any number of different formats can be used at the same time on the same page.<br>Each input can be configured by either setting the options as HTML5 data attributes, or directly passed as an argument in the Javascript code
- The settings can easily be changed at *any* time using the `update` method or via a callback
- autoNumeric supports `input` elements as well as most text elements, allowing you to place formatted numbers and currencies on just about any part of your page
- AutoNumeric elements can be linked together allowing you to perform one action on multiple elements at once
- 7 pre-defined [currency options](#predefined-language-options) allows you to directly use autoNumeric by skipping the option configuration step
- 26 built-in [methods](#methods) gives you the flexibility needed to use autoNumeric to its maximum potential
- 21 additional [methods](#methods) specialized for managing form submission
- More than 38 [options](#options) allows you to customize the output format

With that said, autoNumeric supports most international numeric formats and currencies including those used in Europe, Asia, and North and South America.

****

## Getting started

### Installation
You can install autoNumeric with your preferred dependency manager:
```bash
# with `yarn` :
yarn add autonumeric
# or with `npm` :
npm install autonumeric
```

### How to use?

#### In the browser
Simply include **autoNumeric** in your html `<header>` tag.<br>No other files or libraries are required ; autoNumeric has **no dependency**.

```html
<script src="autoNumeric.min.js" type="text/javascript"></script>
<!-- ...or, you may also directly use a CDN :-->
<script src="https://cdn.jsdelivr.net/autonumeric/3.0.0/autoNumeric.min.js"></script>
```

#### In another script
If you want to use AutoNumeric in your code, you can import the `src/autoNumeric.js` file as an ES6 module using:
```js
import AutoNumeric from 'autoNumeric';
```

Then you can initialize autoNumeric with or without options :
```js
// autoNumeric with the defaults options
anElement = new AutoNumeric(domElement);

// autoNumeric with specific options being passed
anElement = new AutoNumeric(domElement, { options });

// autoNumeric with a css selector and a pre-defined language options
anElement = new AutoNumeric('.myCssClass > input').french();
```
*(See the available language list [here](#predefined-language-options))*

You're done!

*Note : an AutoNumeric object can be initialized in various ways, check those out [here](#initialization)*

### On which elements can it be used?

autoNumeric can be used in two ways ;
- with event listeners when used on `<input>` elements making them reactive (in a *read/write* mode), or
- without event listeners when used on other DOM elements types, essentially acting as a *format-once-and-forget*-*read only* mode.

#### On `<input>` elements
When used on an `<input>` element, you'll be able to interact with its value and get a formatted input value *as-you-type*, using the full power of autoNumeric.

Only the following supported `<input>` types are supported :
- `text`,
- `tel`,
- `hidden`, or
- no type specified at all

```html
<input type='text' value="1234.56">
<input type='tel' value="1234.56">
<input type='hidden' value="1234.56">
<input value="1234.56">
```

Note : the `number` type is **not** supported simply because autoNumeric formats numbers as strings (ie. `'123.456.789,00 &#8364;'`) that this input type does not allow.

#### On other DOM elements

You can use autoNumeric to format a DOM element value **once** on load.<br>
This means it will then not react to any user interaction.

The following elements are accepted :
```js
const allowedTagList = [
    'b', 'caption', 'cite', 'code', 'const', 'dd', 'del', 'div', 'dfn', 'dt', 'em', 'h1', 'h2', 'h3',
    'h4', 'h5', 'h6', 'ins', 'kdb', 'label', 'li', 'option', 'output', 'p', 'q', 's', 'sample',
    'span', 'strong', 'td', 'th', 'u'
]
```

## Options
Multiple options allow you to customize precisely how a form input will format your key strokes as you type :

| Option           | Description | Default Value |
| :---------------- | :-----------:  | :-----------:  |
| `allowDecimalPadding`| Allow padding the decimal places with zeros | `true` |
| `currencySymbol` | Currency symbol | `''` |
| `currencySymbolPlacement` | Placement of the currency sign, relative to the number (as a prefix or a suffix) | `'p'` |
| `decimalCharacter` | Decimal separator character | `'.'` |
| `decimalCharacterAlternative` | Allow to declare alternative decimal separator which is automatically replaced by the *real* decimal character (useful in countries where the keyboard numeric pad have a period as the decimal character) | `null` |
| `decimalPlacesOverride` | Maximum number of decimal places (used to override decimal places set by the minimumValue & maximumValue values) | `null` |
| `decimalPlacesShownOnFocus`| Expanded decimal places visible when input has focus | `null` |
| `defaultValueOverride`| Helper option for the ASP.NET-specific postback issue | `null` |
| `digitalGroupSpacing` | Digital grouping for the thousand separator | `'3'` |
| `digitGroupSeparator` | Thousand separator character  | `','` |
| `emptyInputBehavior`| Define what to display when the input value is empty (possible options are `focus`, `press`, `always` and `zero`) | `'focus'` |
| `failOnUnknownOption `| This option is the 'strict mode' (aka 'debug' mode), which allows autoNumeric to strictly analyse the options passed, and fails if an unknown options is used in the settings object. | `false` |
| `formatOnPageLoad`| Determine if the default value will be formatted on initialization | `true` |
| `isCancellable`| Determine if the user can *'cancel'* the last modifications done to the element value when using the `Escape` key | `true` |
| `leadingZero`| Controls the leading zero behavior (possible options are `allow`, `deny` and `keep`) | `'deny'` |
| `maximumValue` | Maximum possible value | `'9999999999999.99'` |
| `minimumValue` | Minimum possible value | `'-9999999999999.99'` |
| `modifyValueOnWheel`| Determine if the element value can be incremented / decremented with the mouse wheel. The wheel behavior is modified with the `wheelStep` option. | `true` |
| `negativeBracketsTypeOnBlur`| Adds brackets `[]`, parenthesis `()`, curly braces `{}` or `<>` on negative values when unfocused | `null` |
| `negativePositiveSignPlacement` | Placement of negative/positive sign relative to the currency symbol (possible options are `l` (left), `r` (right), `p` (prefix) and `s` (suffix)) | `null` |
| `noEventListeners` | Defines if the element should have event listeners activated on it | `false` |
| `noSeparatorOnFocus` | Remove the thousand separator, currency symbol and suffix on focus | `false` |
| `onInvalidPaste`| Manage how autoNumeric react when the user tries to paste an invalid number (possible options are `error`, `ignore`, `clamp`, `truncate` or `replace`) | `'error'` |
| `outputFormat`| Defines the localized output format of the `get`, `getString` & `getArray` methods | `null` |
| `overrideMinMaxLimits` | Override minimum and maximum limits (possible options are `ceiling`, `floor` and `ignore`) | `null` |
| `readOnly` | Defines if the `<input>` element should be set as read only on initialization | `false` |
| `roundingMethod`| Method used for rounding (possible options are `S`, `A`, `s`, `a`, `B`, `U`, `D`, `C`, `F`, `N05`, `U05` or `D05`) | `'S'` |
| `saveValueToSessionStorage`| Allow the `decimalPlacesShownOnFocus` value to be saved into session storage | `false` |
| `scaleDecimalPlaces`| The number of decimal places when unfocused | `null` |
| `scaleDivisor`| This option decides the onfocus value and places the result in the input on focusout | `null` |
| `scaleSymbol`| Symbol placed as a suffix when unfocused | `null` |
| `serializeSpaces`| Defines how the serialize functions should treat spaces when serializing (convert them to `'%20'` or `'+'`) | `'+'` |
| `selectNumberOnly`| Determine if the select all keyboard command will select the complete input text, or only the input numeric value | `false` |
| `showPositiveSign` | Allow the positive sign symbol `+` to be displayed for positive numbers | `false` |
| `showWarnings`| Defines if warnings should be shown | `true` |
| `suffixText` | Additional text suffix that is added after the number | `''` |
| `unformatOnSubmit`| Removes formatting on submit event | `false` |
| `wheelStep`| Used in conjonction with the `modifyValueOnWheel` option, this allow to either define a *fixed* step (ie. `1000`), or a *progressive* one | `'progressive'` |


###### noEventListeners
Using the `noEventListeners` option allow autoNumeric to only format without adding any event listeners to an input, or any other DOM elements (that the function would accept as a parameter). This would be useful for read-only values for instance.
```js
// Initialize without setting up any event listeners
anElement = new AutoNumeric(domElement, 12345.789, { options }).remove(); // This is the default existing way of doing that...
// ...but you can also directly pass a special option `noEventListeners` to prevent the initial creation of those event listeners
anElement = new AutoNumeric(domElement, 12345.789, { noEventListeners: true });
```
In the latter case, it initialize the AutoNumeric element, except it does not add any event listeners. Which means it format the value only once and then let the user modify it freely.<br>*Note: The value can then be formatted via a call to `set`.*

###### readOnly
AutoNumeric can initialize an `<input>` element with the `readonly` property by setting the `readOnly` option to `true` in the settings:
```js
anElement = new AutoNumeric(domElement, 12345.789, { readOnly: true });
```

For more detail on how to use each options, please take a look at the detailed comments in the source code for the `defaultSettings` object.

#### Predefined language options

Sometime you do not want to have to configure every single aspect of your format, specially if it's a common one.<br>Hence, we provide multiple default options for the most common currencies.

You can use those pre-defined language option like so :
```js
new AutoNumeric('.mySelector > input').french();
```

Currently, the predefined options are :

| | Option name |
| :---------------- | :---------------- |
| :fr: | `French` |
| :es: | `Spanish` |
| :us: | `NorthAmerican` |
| :uk: | `British` |
| <span>&#x1f1e8;&#x1f1ed;</span> | `Swiss` |
| :jp: | `Japanese` |
| :cn: | `Chinese` |

If you feel a common currency option is missing, please create a pull request and we'll add it!

## Initialization

An AutoNumeric object can be initialized in various ways.

### Initialize one AutoNumeric object

It always takes either a DOM element reference as its first argument, or a css string selector.<br>
*Note: only one element can be selected this way, since under the hood `document.querySelector` is called, and this only return one element.*<br>
*If you need to be able to select and initialize multiple elements in one call, then consider using the static `AutoNumeric.multiple()` function*

```js
anElement = new AutoNumeric(domElement); // With the default options
anElement = new AutoNumeric(domElement, { options }); // With one option object
anElement = new AutoNumeric(domElement).french(); // With one pre-defined language object
anElement = new AutoNumeric(domElement).french({ options });// With one pre-defined language object and additional options that will override those defaults

// ...or init and set the value in one call :
anElement = new AutoNumeric(domElement, 12345.789); // With the default options, and an initial value
anElement = new AutoNumeric(domElement, 12345.789, { options });
anElement = new AutoNumeric(domElement, '12345.789', { options });
anElement = new AutoNumeric(domElement, null, { options }); // With a null initial value
anElement = new AutoNumeric(domElement, 12345.789).french({ options });
anElement = new AutoNumeric(domElement, 12345.789, { options }).french({ options }); // Not really helpful, but possible

// The AutoNumeric constructor class can also accept a string as a css selector. Under the hood this use `QuerySelector` and limit itself to only the first element it finds.
anElement = new AutoNumeric('.myCssClass > input');
anElement = new AutoNumeric('.myCssClass > input', { options });
anElement = new AutoNumeric('.myCssClass > input', 12345.789);
anElement = new AutoNumeric('.myCssClass > input', 12345.789, { options });
anElement = new AutoNumeric('.myCssClass > input', null, { options }); // With a null initial value
anElement = new AutoNumeric('.myCssClass > input', 12345.789).french({ options });
```
*Note: AutoNumeric also accepts a limited tag list that it will format on page load, but without adding any event listeners*

### Initialize multiple AutoNumeric objects at once
If you know you want to initialize multiple elements in one call, you must then use the static `AutoNumeric.multiple()` function:
```js
// Init multiple DOM elements in one call (and possibly pass multiple values that will be mapped to each DOM element)
[anElement1, anElement2, anElement3] = AutoNumeric.multiple([domElement1, domElement2, domElement3], { options });
[anElement1, anElement2, anElement3] = AutoNumeric.multiple([domElement1, domElement2, domElement3], 12345.789, { options });
[anElement1, anElement2, anElement3] = AutoNumeric.multiple.french([domElement1, domElement2, domElement3], [12345.789, 234.78, null], { options });

// Special case, if a <form> element is passed (or any other 'parent' (or 'root') DOM element), then autoNumeric will initialize each child `<input>` elements recursively, ignoring those referenced in the `exclude` attribute
[anElement1, anElement2] = AutoNumeric.multiple({ rootElement: formElement }, { options });
[anElement1, anElement2] = AutoNumeric.multiple({ rootElement: formElement, exclude : [hiddenElement, tokenElement] }, { options });
[anElement1, anElement2] = AutoNumeric.multiple({ rootElement: formElement, exclude : [hiddenElement, tokenElement] }, [12345.789, null], { options });

// If you want to select multiple elements via a css selector, then you must use the `multiple` function. Under the hood `QuerySelectorAll` is used.
[anElement1, anElement2] = AutoNumeric.multiple('.myCssClass > input', { options }); // This always return an Array, even if there is only one element selected
[anElement1, anElement2] = AutoNumeric.multiple('.myCssClass > input', [null, 12345.789], { options }); // Idem above, but with passing the initial values too
```

## Options update
Options can be added and/or modified after the initialization has been done.

Either by passing an options object that contains multiple options...
```js
anElement.update({ moreOptions });
anElement.update(AutoNumeric.getLanguages().NorthAmerican); // Update the settings (and immediately reformat the element accordingly)
```

...or by changing the options one by one (or by calling a pre-defined option object)
```js
anElement.options.minimumValue('12343567.89');
anElement.options.allowDecimalPadding(false);
```

Lastly, the option object can be accessed directly, thus allowing to query each options globally too
```js
anElement.getSettings(); // Return the options object containing all the current autoNumeric settings in effect
```

## Methods
autoNumeric provides numerous methods to access and modify the element value, formatted or unformatted, at any point in time.
<br>It does so by providing access to those [methods](#instantiated-methods) via the AutoNumeric object class (declared as an ES6 Module).

First. you need to get a reference to the AutoNumeric module that you need to import:
```js
import AutoNumeric from 'autoNumeric.min';
```

Then you'll be able to access either the methods on the instantiated AutoNumeric object, or the [static functions](#static-methods) directly by using the `AutoNumeric` class.

#### Instantiated methods

##### Usual functions on each autoNumeric-managed element

| Method           | Description | Call example |
| :----------------: | :-----------:  | :-----------:  |
| `set` | Set the value (that will be formatted immediately) | `anElement.set(42.76);` |
| `set` | Set the value and update the setting in one go | `anElement.set(42.76, { options });` |
| `setUnformatted` | Set the value (that will not be formatted immediately) | `anElement.setUnformatted(42.76);` |
| `setUnformatted` | Set the value and update the setting in one go (the value will not be formatted immediately) | `anElement.setUnformatted(42.76, { options });` |
| `getNumericString` | Return the unformatted number as a string | `anElement.getNumericString();` |
| `get` | Alias for the `.getNumericString()` method | `anElement.get();` |
| `getFormatted` | Return the formatted string | `anElement.getFormatted();` |
| `getNumber` | Return the unformatted number as a number | `anElement.getNumber();` |
| `getLocalized` | Return the localized unformatted number as a string | `anElement.getLocalized();` |
| `getLocalized` | Return the localized unformatted number as a string, using the outputFormat option override passed as a parameter | `anElement.getLocalized(forcedOutputFormat);` |
| `reformat` | Force the element to reformat its value again (in case the formatting has been lost) | `anElement.reformat();` |
| `unformat` | Remove the formatting and keep only the raw unformatted value in the element (as a numeric string) | `anElement.unformat();` |
| `unformatLocalized` | Remove the formatting and keep only the localized unformatted value in the element | `anElement.unformatLocalized();` |
| `unformatLocalized` | Idem above, but using the outputFormat option override passed as a parameter | `anElement.unformatLocalized(forcedOutputFormat);` |
| `isPristine` | Return `true` if the current value is the same as when the element got initialized | `anElement.isPristine();` |
| `select` | Select the formatted element content, based on the `selectNumberOnly` option | `anElement.select();` |
| `selectNumber` | Select only the numbers in the formatted element content, leaving out the currency symbol, whatever the value of the `selectNumberOnly` option | `anElement.selectNumber();` |
| `selectInteger` | Select only the integer part in the formatted element content, whatever the value of `selectNumberOnly` | `anElement.selectInteger(); ` |
| `selectDecimal` | Select only the decimal part in the formatted element content, whatever the value of `selectNumberOnly` | `anElement.selectDecimal();` |
| `clear` | Reset the element value to the empty string '' (or the currency sign, depending on the `emptyInputBehavior` option value) | `anElement.clear();` |
| `clear` | Reset the element value to the empty string '' as above, no matter the `emptyInputBehavior` option value | `anElement.clear(true);` |


##### Un-initialize the AutoNumeric element with the following methods

| Method           | Description | Call example |
| :----------------: | :-----------:  | :-----------:  |
| `remove` | Remove the autoNumeric listeners from the element (previous name : 'destroy'). Keep the element content intact. | `anElement.remove();` |
| `wipe` | Remove the autoNumeric listeners from the element, and reset its value to '' | `anElement.wipe();` |
| `nuke` | Remove the autoNumeric listeners from the element, and delete the DOM element altogether | `anElement.nuke();` |


##### Node manipulation

| Method           | Description | Call example |
| :----------------: | :-----------:  | :-----------:  |
| `node` | Return the DOM element reference of the autoNumeric-managed element | `anElement.node();` |
| `parent` | Return the DOM element reference of the parent node of the autoNumeric-managed element | `anElement.parent();` |
| `detach` | Detach the current AutoNumeric element from the shared 'init' list (which means any changes made on that local shared list will not be transmitted to that element anymore) | `anElement.detach();` |
| `detach` | Idem above, but detach the given AutoNumeric element, not the current one | `anElement.detach(otherAnElement);` |
| `attach` | Attach the given AutoNumeric element to the shared local 'init' list. When doing that, by default the DOM content is left untouched. The user can force a reformat with the new shared list options by passing a second argument to `true`. | `anElement.attach(otherAnElement, reFormat = true);` |


##### Use any AutoNumeric element to format/unformat other numbers or DOM elements

This allows to format or unformat numbers, strings or directly other DOM elements without having to specify the options each time, since the current AutoNumeric object already has those settings set.

| Method           | Description | Call example |
| :----------------: | :-----------:  | :-----------:  |
| `formatOther` | This use the same function signature that when using the static AutoNumeric method directly (cf. below: `AutoNumeric.format`), but without having to pass the options | `anElement.formatOther(12345, { options });` |
| `formatOther` | Idem above, but apply the formatting to the DOM element content directly | `anElement.formatOther(domElement5, { options }); ` |
| `unformatOther` | This use the same function signature that when using the static AutoNumeric method directly (cf. below: `AutoNumeric.unformat`), but without having to pass the options | `anElement.unformatOther('1.234,56 €', { options });` |
| `unformatOther` | Idem above, but apply the unformatting to the DOM element content directly | `anElement.unformatOther(domElement5, { options });` |


##### Initialize other DOM Elements

Once you have an AutoNumeric element already setup correctly with the right options, you can use it as many times you want to initialize as many other DOM elements as needed (this works only on elements that can be managed by autoNumeric).

Whenever `init` is used to initialize other DOM element, a shared 'local' list of those elements is stored in the AutoNumeric objects.<br>This allows for neat things like modifying all those *linked* AutoNumeric elements globally, with one call.

| Method           | Description | Call example |
| :----------------: | :-----------:  | :-----------:  |
| `init` | Use an existing AutoNumeric element to initialize another DOM element with the same options | `const anElement2 = anElement.init(domElement2);` |
| `init` | If `true` is set as the second argument, then the newly generated AutoNumeric element will not share the same local element list as `anElement` | `const anElement2 = anElement.init(domElement2, true);` |


##### Perform actions globally on a shared list of AutoNumeric elements

This local list can be used to perform global operations on all those AutoNumeric elements, with one function call.<br>
To do so, you must call the wanted function by prefixing `.global` before the method name (ie. `anElement.global.set(42)`).<br>
Below are listed all the supported methods than can be called globally:

```js
anElement.global.set(2000); // Set the value 2000 in all the autoNumeric-managed elements that are shared on this element
anElement.global.setUnformatted(69);
[result1, result2, result3] = anElement.global.get(); // Return an array of results
[result1, result2, result3] = anElement.global.getNumericString(); // Return an array of results
[result1, result2, result3] = anElement.global.getFormatted(); // Return an array of results
[result1, result2, result3] = anElement.global.getNumber(); // Return an array of results
[result1, result2, result3] = anElement.global.getLocalized(); // Return an array of results
anElement.global.reformat();
anElement.global.unformat();
anElement.global.unformatLocalized();
anElement.global.unformatLocalized(forcedOutputFormat);
anElement.global.isPristine(); // Return `true` is *all* the autoNumeric-managed elements are pristine, if their raw value hasn't changed
anElement.global.isPristine(false); // Idem as above, but also checks that the formatted value hasn't changed
anElement.global.clear(); // Clear the value in all the autoNumeric-managed elements that are shared on this element
anElement.global.remove();
anElement.global.wipe();
```

The shared local list also provide list-specific methods to manipulate it:
```js
anElement.global.has(domElementOrAutoNumericObject); // Return `true` if the given AutoNumeric object (or DOM element) is in the local AutoNumeric element list
anElement.global.addObject(domElementOrAutoNumericObject); // Add an existing AutoNumeric object (or DOM element) to the local AutoNumeric element list, using the DOM element as the key
anElement.global.removeObject(domElementOrAutoNumericObject); // Remove the given AutoNumeric object (or DOM element) from the local AutoNumeric element list, using the DOM element as the key
anElement.global.empty(); // Remove all elements from the shared list, effectively emptying it
[anElement0, anElement1, anElement2, anElement3] = anElement.global.elements(); // Return an array containing all the AutoNumeric elements that have been initialized by each other
anElement.global.getList(); // Return the `Map` object directly
anElement.global.size(); // Return the number of elements in the local AutoNumeric element list
```

##### Form functions

autoNumeric elements provide special functions to manipulate the form they are a part of.
Those special functions really work on the parent `<form>` element, instead of the `<input>` element itself. 

| Method           | Description | Call example |
| :----------------: | :-----------:  | :-----------:  |
| `form` | Return a reference to the parent <form> element, `null` if it does not exist | `anElement.form();` |
| `formNumericString` | Return a string in standard URL-encoded notation with the form input values being unformatted | `anElement.formNumericString();` |
| `formFormatted` | Return a string in standard URL-encoded notation with the form input values being formatted | `anElement.formFormatted();` |
| `formLocalized` | Return a string in standard URL-encoded notation with the form input values, with localized values | `anElement.formLocalized();` |
| `formLocalized(forcedOutputFormat)` | Idem above, but with the possibility of overriding the `outputFormat` option | `anElement.formLocalized(forcedOutputFormat);` |
| `formArrayNumericString` | Return an array containing an object for each form `<input>` element, with the values as numeric strings | `anElement.formArrayNumericString();` |
| `formArrayFormatted` | Return an array containing an object for each form `<input>` element, with the values as formatted strings | `anElement.formArrayFormatted();` |
| `formArrayLocalized` | Return an array containing an object for each form `<input>` element, with the values as localized numeric strings | `anElement.formArrayLocalized();` |
| `formArrayLocalized(forcedOutputFormat)` | Idem above, but with the possibility of overriding the `outputFormat` option | `anElement.formArrayLocalized(forcedOutputFormat);` |
| `formJsonNumericString` | Return a JSON string containing an object representing the form input values. This is based on the result of the `formArrayNumericString()` function. | `anElement.formJsonNumericString();` |
| `formJsonFormatted` | Return a JSON string containing an object representing the form input values. This is based on the result of the `formArrayFormatted()` function. | `anElement.formJsonFormatted();` |
| `formJsonLocalized` | Return a JSON string containing an object representing the form input values. This is based on the result of the `formArrayLocalized()` function. | `anElement.formJsonLocalized();` |
| `formJsonLocalized(forcedOutputFormat)` | Idem above, but with the possibility of overriding the `outputFormat` option | `anElement.formJsonLocalized(forcedOutputFormat);` |
| `formUnformat` | Unformat all the autoNumeric-managed elements that are a child to the parent <form> element of this `anElement` input, to numeric strings | `anElement.formUnformat();` |
| `formUnformatLocalized` | Unformat all the autoNumeric-managed elements that are a child to the parent <form> element of this `anElement` input, to localized strings | `anElement.formUnformatLocalized();` |
| `formReformat` | Reformat all the autoNumeric-managed elements that are a child to the parent <form> element of this `anElement` input | `anElement.formReformat();` |

The following functions can either take a callback, or not. If they don't, the default `form.submit()` function will be called.

| Method           | Description | Call example |
| :----------------: | :-----------:  | :-----------:  |
| `formSubmitNumericString(callback)` | Run the `callback(value)` with `value` being equal to the result of `formNumericString()` | `anElement.formSubmitNumericString(callback);` |
| `formSubmitFormatted(callback)` | Run the `callback(value)` with `value` being equal to the result of `formFormatted()` | `anElement.formSubmitFormatted(callback);` |
| `formSubmitLocalized(callback)` | Run the `callback(value)` with `value` being equal to the result of `formLocalized()` | `anElement.formSubmitLocalized(callback);` |
| `formSubmitLocalized(forcedOutputFormat, callback)` | Idem above, but with the possibility of overriding the `outputFormat` option | `anElement.formSubmitLocalized(forcedOutputFormat, callback);` |

For the following methods, the callback is mandatory:

| Method           | Description | Call example |
| :----------------: | :-----------:  | :-----------:  |
| `formSubmitArrayNumericString(callback)` | Run the `callback(value)` with `value` being equal to the result of `formArrayNumericString()` | `anElement.formSubmitArrayNumericString(callback);` |
| `formSubmitArrayFormatted(callback)` | Run the `callback(value)` with `value` being equal to the result of `formArrayFormatted()` | `anElement.formSubmitArrayFormatted(callback);` |
| `formSubmitArrayLocalized(callback, forcedOutputFormat)` | Idem above, but with the possibility of overriding the `outputFormat` option | `anElement.formSubmitArrayLocalized(callback, forcedOutputFormat);` |
| `formSubmitJsonNumericString(callback)` | Run the `callback(value)` with `value` being equal to the result of `formJsonNumericString()` | `anElement.formSubmitJsonNumericString(callback);` |
| `formSubmitJsonFormatted(callback)` | Run the `callback(value)` with `value` being equal to the result of `formJsonFormatted()` | `anElement.formSubmitJsonFormatted(callback);` |
| `formSubmitJsonLocalized(callback, forcedOutputFormat)` | Idem above, but with the possibility of overriding the `outputFormat` option | `anElement.formSubmitJsonLocalized(callback, forcedOutputFormat);` |


#### Function chaining

Most of those functions can be chained which allow to be less verbose and more concise.

```js
anElement.french()
         .set(42)
         .update({ options })
         .formSubmitJsonNumericString(callback)
         .clear();
```

#### Static methods

Without having to initialize any AutoNumeric object, you can directly use the static `AutoNumeric` class functions.

| Method           | Description | Call example |
| :---------------- | :-----------:  | :-----------:  |
| `validate` | Check if the given option object is valid, and that each option is valid as well. This throws an error if it's not. | `AutoNumeric.validate({ options })` |
| `areSettingsValid` | Return true in the settings are valid | `AutoNumeric.areSettingsValid({ options })` |
| `getDefaultConfig` | Return the default autoNumeric settings | `AutoNumeric.getDefaultConfig()` |
| `getLanguages` | Return all the predefined language options in one object | `AutoNumeric.getLanguages()` |
| `getLanguages` | Return a specific pre-defined language options object | `AutoNumeric.getLanguages().French` |
| `format` | Format the given number with the given options. This returns the formatted value as a string. | `AutoNumeric.format(12345.21, { options });` |
| `format` | Idem above, but using a numeric string as the first parameter | `AutoNumeric.format('12345.21', { options });` |
| `format` | Format the `domElement` *`value`* (or *`textContent`*) with the given options and returns the formatted value as a string. This does *not* update that element value. | `AutoNumeric.format(domElement, { options });` |
| `formatAndSet` | Format the `domElement` value with the given options and returns the formatted value as a string. This function does update that element value with the newly formatted value in the process. | `AutoNumeric.formatAndSet(domElement, { options });` |
| `unformat` | Unformat the given formatted string with the given options. This returns a numeric string. | `AutoNumeric.unformat('1.234,56 €', { options });` |
| `unformat` | Unformat the `domElement` value with the given options and returns the unformatted numeric string. This does *not* update that element value. | `AutoNumeric.unformat(domElement, { options });` |
| `unformatAndSet` | Unformat the `domElement` value with the given options and returns the unformatted value as a numeric string. This function does update that element value with the newly unformatted value in the process. | `AutoNumeric.unformatAndSet(domElement, { options });` |
| `unformatAndSet` | Recursively unformat all the autoNumeric-managed elements that are a child to the `referenceToTheDomElement` element given as a parameter (this is usually the parent `<form>` element) | `AutoNumeric.unformatAndSet(referenceToTheDomElement);` |
| `reformatAndSet` | Recursively format all the autoNumeric-managed elements that are a child to the `referenceToTheDomElement` element given as a parameter (this is usually the parent `<form>` element), with the settings of each AutoNumeric elements. | `AutoNumeric.reformatAndSet(referenceToTheDomElement);` |
| `localize` | Unformat and localize the given formatted string with the given options. This returns a string. | `AutoNumeric.localize('1.234,56 €', { options });` |
| `localize` | Idem as above, but return the localized DOM element value. This does *not* update that element value. | `AutoNumeric.localize(domElement, { options });` |
| `localizeAndSet` | Unformat and localize the `domElement` value with the given options and returns the localized value as a string. This function does update that element value with the newly localized value in the process. | `AutoNumeric.localizeAndSet(domElement, { options });` |
| `test` | Test if the given domElement is already managed by AutoNumeric (if it is initialized) | `AutoNumeric.test(domElement);` |
| `version` | Return the AutoNumeric version number (for debugging purpose) | `AutoNumeric.version();` |


## Questions
For questions and support please use the [Gitter chat room](https://gitter.im/autoNumeric/Lobby) or IRC on Freenode #autoNumeric.<br>The issue list of this repository is **exclusively** for bug reports and feature requests.

****

## How to contribute?
Contributors and pull requests are welcome.<br>Feel free to [contact](#questions) us for any questions.

### Get the latest source
```sh
git clone -b next https://github.com/BobKnothe/autoNumeric.git
# or the following if you are authentified on github :
# `git clone -b next git@github.com:BobKnothe/autoNumeric.git`
```

### Make your changes
```sh
cd autoNumeric
```
First things first, in order to be able to compile the ES6 source to something that can be interpreted by the browsers, and get the tools (linter, test runners, etc.) used by the developers, you need to install them by doing :
```sh
yarn install
```

*Note: you need to have `yarn` installed before executing this command.<br>You can install `yarn` globally by doing `npm install -g yarn` as root.*

Once you made your changes, you can build the library with :
```sh
yarn build
```
This will generate the `autoNumeric.js` and `autoNumeric.min.js` files in the `dist` folder, that you'll then be able to use in the browsers.

If you want to clean the generated `.js` and `.min.js` files as well as development specific ones like coverage and log files, use :
```sh
yarn run clean
```
*Note: do **not** use `yarn clean` as it's a [different command](https://yarnpkg.com/en/docs/cli/clean) entirely.*

### Run the mandatory tools for linting and testing
We strive to keep the tests green at all times. Hence whenever you change the source, be sure to :

1. Write at least 2 tests for each change :
  - One that validate your changes
  - One that invalidate your changes
2. Make sure all tests passes on all supported browsers (PhantomJS, Firefox, and Chrome)
  - Write unit tests *and* end-to-end tests
3. Make sure `eslint` does not return any errors regarding the coding style.

#### How to test?
Tests **must always be green** :white_check_mark: before pushing. Any commit that make the tests fails will be ignored.<br>To run the tests, you have multiple options :
```sh
# Run unit testing as well as end-to-end testing
yarn test

# Run unit testing only
yarn test:unit

# Run end-to-end testing only
yarn test:e2e

# Run unit testing only...
yarn test:unitp   # ...with PhantomJS only
yarn test:unitf   # ...with Firefox only
yarn test:unitc   # ...with Chrome only
```

Behind the scene, all unit and end-to-end tests are written with [Jasmine](https://jasmine.github.io/).<br>[Karma](https://github.com/karma-runner/karma) is used to run the unit tests, while [Webdriver.io](https://github.com/webdriverio/webdriver.io) is used to run end-to-end tests.

#### How to lint?
Linting allow us to keep a coherent code style in all the source files.<br>In order to check that everything is well formatted, run [eslint](http://eslint.org/) with :
```sh
yarn lint
```
If any errors are shown, you can try to automatically correct them by running :
```sh
# Use the path of the faulty file there :
./node_modules/eslint/bin/eslint.js --fix src/autoNumeric.js
```

#### How to push?
Every changes that you pushed in its own branch in your personal autoNumeric copy should be based on the latest version of the `next` branch.

When you create a pull request, make sure to push against the `next` branch.

Your commit must not contain any generated files (ie. files in the `/dist/` directory or logs).<br>
*Note: Generated `dist` files (ie. `autoNumeric.js` and `autoNumeric.min.js`) are built and force-added to the git repository only once for each official release on `master`.*

### Dependencies
Currently, autoNumeric depends on jQuery (which is pretty logical since it's a jQuery plugin ;P).<br>
Some work is [in progress](https://github.com/BobKnothe/autoNumeric/issues/244) to provide a jQuery-free version of autoNumeric.

## Older versions
The previous stable autoNumeric version v1.9.46 can be found [here](https://github.com/BobKnothe/autoNumeric/releases/tag/1.9.46), and the v2 branch can be found [here](https://github.com/BobKnothe/autoNumeric/releases/tag/v2.0.7).

## Related projects
For integration into [Rails](http://rubyonrails.org/) projects, you can use the [autonumeric-rails](https://github.com/randoum/autonumeric-rails) project.

## Documentation
A more detailed documentation can be found in the [Documentation](Documentation.md) file.<br>
For more examples and an option code generator (that may be outdated), take a look [here](http://www.decorplanit.com/plugin/).

## Licence
autoNumeric is an [MIT](http://opensource.org/licenses/MIT)-licensed open source project, and its authors are credited in [AUTHORS.md](https://github.com/BobKnothe/autoNumeric/blob/master/AUTHORS.md).

****

Feel free to donate via Paypal [![Donate][paypal-image]][paypal-url] or [Patreon](https://www.patreon.com/user?u=4810062) to support autoNumeric development.


[downloads-image]: http://img.shields.io/npm/dm/autonumeric.svg
[downloads-url]: http://badge.fury.io/js/autonumeric
[gitter-image]: https://img.shields.io/badge/gitter-autonumeric%2Flobby-brightgreen.svg
[gitter-url]: https://gitter.im/autonumeric/lobby
[npm-image]: https://img.shields.io/npm/v/autonumeric.svg
[npm-url]: https://npmjs.org/package/autonumeric
[nodei-image]: https://nodei.co/npm/autonumeric.png?downloads=true&downloadRank=true&stars=true
[nodei-url]: https://nodei.co/npm/autonumeric
[travis-url]: https://travis-ci.org/BobKnothe/autoNumeric
[travis-image]: https://img.shields.io/travis/BobKnothe/autoNumeric.svg
[snyk-image]: https://snyk.io/test/github/BobKnothe/autoNumeric/badge.svg
[snyk-url]: https://snyk.io/test/github/BobKnothe/autoNumeric
[coveralls-image]: https://coveralls.io/repos/github/BobKnothe/autoNumeric/badge.svg?branch=next
[coveralls-url]: https://coveralls.io/github/BobKnothe/autoNumeric?branch=next
[paypal-image]: http://img.shields.io/badge/paypal-donate-brightgreen.svg
[paypal-url]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=NCW5699RY8NN2
[patreon-url]: https://www.patreon.com/user?u=4810062
