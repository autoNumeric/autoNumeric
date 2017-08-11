## *(Old)* Documentation

**Disclaimer** : This documentation may be outdated.<br>Please consider using the [Readme](../README.md) that always has up-to-date information.

### Changing the defaults options

The complete list of options are below

There are multiple ways for changing the options. To format "123456789.00" to "&#8364; 123.456.789,00" you could do the following:

**options** - *pass when initializing autoNumeric*
```javascript
$(document).ready(function(){
   $(selector).autoNumeric("init", {
		digitGroupSeparator: '.',
		decimalCharacter: ',', 
		currencySymbol: '€ '
	});
});
```

**HTML5 data** - *By convention the data attribute is written in lower-case. Compound words (example: "decimalCharacter") need to be split and separated by a dash. The equal sign separates the name and value. The value should be enclosed with quote marks. If multiple options are being used they each need to have the own data attribute.

```html
<input type='text' name="someName" value="1234.56" data-a-sep="." data-a-dec="," data-a-sign="€ "/>
```


**$.extend method** - in this example <span style="color:red;">ASP.NET</span> current culture settings are passed.

note: - *this can change defaults globally*


```javascript
<script type="text/javascript">  
    
	$(document).ready(function() {          
		$.extend($.fn.autoNumeric.defaults, {              
			digitGroupSeparator: '@System.Threading.Thread.CurrentThread.CurrentCulture.NumberFormat.NumberGroupSeparator',              
			decimalCharacter: '@System.Threading.Thread.CurrentThread.CurrentCulture.NumberFormat.NumberDecimalSeparator',
                        currencySymbol: '@System.Threading.Thread.CurrentThread.CurrentCulture.NumberFormat.CurrencySymbol'
		});      
		
		$('selector').autoNumeric('init'); 
		 
	});
  
</script>
```
**Callback function** - *this example changes the number of decimal places.*

```javascript
 <script type="text/javascript">
 
 /* the callback function must be defined prior to initiating autoNumeric */ 
 
 var functionName = function() {
    /* your code here */  
    var value = 4; /* example only */
    return value; 
 }

 /* initiates autoNumeric and passes a function */	
																				
 $('selector').autoNumeric('init', { decimalPlaces: functionName }) 
``` 

****

### Values - locale formats that autoNumeric can properly handle as a numeric value 

By default autoNumeric formats the default values on page ready. The values should be sent as text. autoNumeric supports the use on locale formats with the following rules:

* Numeric values should be send as text
* The first comma or period will be considered the decimal character
* Any additional commas or periods will cause an error to be thrown
* The sign (minus only) can be proceeding or trailing
* Currency symbols or other non-numeric characters will throw an error
* Quick visual guide:

| value / text  | valid?       |
| ------------- | ------------ |
|"123456"       | true         |
|"123456.78"    | true         |
|"123456,78"    | true         |
|"-123456"      | true         |
|"-123456.78"   | true         |
|"-123456,78"   | true         |
|"123456-"      | true         |
|"123456.78-"   | true         |
|"123456,78-"   | true         |
|"123,456.78"   | false        |
|"123.456.78"   | false        |
|"-123456.78-"  | false        |
|"€ 123456.78"  | false        |
|"2.034E23"     | false        |

Default values and values being "set" need to fall with the min/max range.

If you do not want the default values formatted on set the option from "formatOnPageLoad: true" to "formatOnPageLoad: false" 

****

### ASP.NET default value and post-back

During page load / re-load autoNumeric compares the value of the input "$this[0].value" and the "$this.prop('defaultValue')" value. If they are equal and "formatOnPageLoad: true" the value is formatted.

What happens during ASP.NET form post-back is the input tag is re-rendered. An example Page loaded 

```html
<input type='text' name="someName"  id="someID" class='someClass' value="" />

// user enters "1234.56" => "1,234.56" with default settings
// during post-back the input is re-rendered and is now showing the new default value. 

<input type='text' name="someName"  id="someID" class='someClass' value="1,234.56" />
```

Once the page is reloaded on post-back and autoNumeric compares $this[0].value" and the "$this.prop('defaultValue')" and sees they are equal it attenpts to format the values. From the above valid value table the "1,234.56" would be invalid. 

**There are two options that can handle the postback event "formatOnPageLoad" &#38; "defaultValueOverride":**

**1) "formatOnPageLoad option"** - this option controls if default values are formatted on page load. By default it is set to "formatOnPageLoad: true"

Change the "formatOnPageLoad" option to ***"formatOnPageLoad: false"*** - this can be done when initalizing "init" the element as an option or as HTML5 data attribute

If there are no default value(vs) simply initialize 'init' the element 

```js
$('selector').autoNumeric('init', {formatOnPageLoad: false});    
```
If there is a default value you will need to pre-format the default value as shown 
```html
<!-- it is important that a preformatted default values match the options/settings.
      mismatches could cause errors -->
<input type='text' name="someName" value="1,234.56"/>
```

**2) "defaultValueOverride"** option was created to help ASP.NET postabck and is used if ***"formatOnPageLoad: true"*** is set 'true'.

Note: "defaultValueOverride" option should be the same value as the default value

```html
<input type='text' name="someName" value="1234.56"/>
```

```js
// 'defaultValueOverride' is the value of the default value above 
$('selector').autoNumeric('init', {defaultValueOverride: "1234.56"});       
```
Please note that "formatOnPageLoad" and "defaultValueOverride" can be set by either {options} or HTML5 data attribute

****

### Min / Max settings and decimal places

The minimum and maximum values and decimal places are set via minimumValue: '-9999999999999.99' and maximumValue: '9999999999999.99' option. The decimal places are determined be the number of characters following the "." decimal point.  


| minimumValue:         | maximumValue:         | decimal places |
| :------------ | :------------ | :-----------:  |
| "0"           | "9999999999"  | 0              |
| "0.00"        | "99999999.99" | 2              |
| "0.00"        | "9999999999"  | 2              |
| "-9999999"    | "9999999.999" | 3              |


Notes:
- minimumValue should always be a lower value than maximumValue!
- minimumValue and maximumValue can be both positive or negative but do so with caution.
- If the range of the minimumValue &#38; maximumValue is small or you make them numbers other then "9" nines (example "1000) you could create a situation where the uses will need to delete characters before the can obtain the minimumValue / maximumValue limits. 

****

The following is an uncomplete list of the methods and settings/options that control autoNumeric 2.0.* :

**'init'** - *initializes autoNumeric* Must be run before other methods can be called 
-	$('someSelector').autoNumeric();
-	$('someSelector').autoNumeric('init');
-	$('someSelector').autoNumeric({options});
-	$('someSelector').autoNumeric('init', {options});

**'destroy'** - *stops autoNumeric and removes jQuery data*
-	$('someSelector').autoNumeric('destroy');

**'wipe'** - removes session storage and cookies from memory - only needed if the 'aStor' option is true
-   $(someSelector).autoNumeric('wipe');

**'update'** - *updates autoNumeric's settings*
-	$('someSelector').autoNumeric('update', {options});
- 	Can be run multiple times
- 	Overrides the default settings and HTML5 data

**'set'** - *returns a formatted string via jQuery's ".val()" or ".text' methods to the selected tag(s)*
-	$('someSelector').autoNumeric('set', value); // see 

**'unSet'** - *method to un-format inputs - handy to use right before form submission*
-  $(someSelector).autoNumeric('unSet'); // returns "nnnn.nn" or "-nnnn.nn"
-  $(someSelector).autoNumeric('unSet', '.-'); // returns "nnnn.nn" or "nnnn.nn-"  // trailing negative sign
-  $(someSelector).autoNumeric('unSet', ','); // returns "nnnn,nn" or "-nnnn,nn"  // comma as decimal seperator
-  $(someSelector).autoNumeric('unSet', ',-'); // returns "nnnn,nn" or "nnnn,nn-" // comma as decimal separator &#38; trailing negative sign

**'reSet'** - *method to re-format inputs - handy to use right after form submission*
-   $(someSelector).autoNumeric('reSet');

**'get'** - *allows you to easily remove the formatting from a string on a autoNumeric controlled element and returns a string*
-  $(someSelector).autoNumeric('get'); // returns "nnnn.nn" or "-nnnn.nn"
-  $(someSelector).autoNumeric('get', '.-'); // returns "nnnn.nn" or "nnnn.nn-" // trailing negative sign
-  $(someSelector).autoNumeric('get', ','); // returns "nnnn,nn" or "-nnnn,nn" // comma as decimal seperator
-  $(someSelector).autoNumeric('get', ',-'); // returns "nnnn,nn" or "nnnn,nn-" // comma as decimal separator &#38; trailing negative sign

**'getString'** - *this basically uses jQuery's .serialize() method which creates a text string (URL-encoded notation) from a set of form elements that is ready for submission. The extra step taken here is the string is split and iterated through and the formatted values are replaced with unformatted values. The string is then joined back together and returned*
-  $(someSelector).autoNumeric('getString'); // returns "nnnn.nn" or "-nnnn.nn"
-  $(someSelector).autoNumeric('getString', '.-'); // returns "nnnn.nn" or "nnnn.nn-" // trailing negative sign
-  $(someSelector).autoNumeric('getString', ','); // returns "nnnn,nn" or "-nnnn,nn" // comma as decimal seperator
-  $(someSelector).autoNumeric('getString', ',-'); // returns "nnnn,nn" or "nnnn,nn-" // comma as decimal separator &#38; trailing negative sign

**'getArray'** - *this basically uses jQuery's .serializeArray() method which returns a JavaScript array of objects, ready to be encoded as a JSON string. Again autoNumeric iterated through the array object and replaces the formatted values with unformatted values.*
-  $(someSelector).autoNumeric('getArray'); // returns "nnnn.nn" or "-nnnn.nn"
-  $(someSelector).autoNumeric('getArray', '.-'); // returns "nnnn.nn" or "nnnn.nn-" // trailing negative sign
-  $(someSelector).autoNumeric('getArray', ','); // returns "nnnn,nn" or "-nnnn,nn" // comma as decimal seperator
-  $(someSelector).autoNumeric('getArray', ',-'); // returns "nnnn,nn" or "nnnn,nn-" // comma as decimal separator &#38; trailing negative sign

**'getSettings'** - *this returns an object that shows the autoNumeric settings for the field. You may find this helpful when developing a page*
-	$('someSelector').autoNumeric('getSettings'); // returns the jQuery data opbect with settings 
-	$('someSelector').autoNumeric('getSettings').decimalCharacter; // returns the 'decimalCharacter' value 	
- 	any individual setting can be returned by replacing 'decimalCharacter' with the desired settings / option name		

For more examples, documentation and the option code generator please take a look at [http://www.decorplanit.com/plugin/](http://www.decorplanit.com/plugin/).

****

Additionally, autoNumeric now supports formatting and unformatting directly without having to first initiate a DOM element :

**'autoUnformat'** : *this returns an Number given the formatted string and the autoNumeric options passed as arguments*
For instance, to *unformat*, you would use :
```
let autoNumericOptions = { digitGroupSeparator: '.', decimalCharacter: ',', decimalCharacterAlternative: '.', currencySymbol: ' €', currencySymbolPlacement: 's', roundingMethod: 'U' };
let formattedString = "1.234,56 €";
$.fn.autoUnformat(formattedString, autoNumericOptions); // Returns 1234.56
```

**'autoFormat'** : *this returns a formatted string given a Number and the autoNumeric options passed as arguments*
For instance, to *format*, you would use :
```
let autoNumericOptions = { digitGroupSeparator: '.', decimalCharacter: ',', decimalCharacterAlternative: '.', currencySymbol: ' €', currencySymbolPlacement: 's', roundingMethod: 'U' };
let number = 1234.56;
$.fn.autoFormat(number, autoNumericOptions); // Returns "1.234,56 €"
```


****


###  Default settings &#38; supported options
[visit autoNumeric's home page for an easy to use settings and option code generator ](http://www.decorplanit.com/plugin/)

Disclaimer : This may be outdated. Please refer to the [Readme](../README.md) or directly in the detailed comments in the source code for the `defaultSettings` object.

##### digitGroupSeparator
*controls the thousand separator character*
-	digitGroupSeparator: ','      // Comma
-	digitGroupSeparator: '.'      // Dot
-	digitGroupSeparator: ' '      // Normal space
-	digitGroupSeparator: '\u2009' // Thin-space
-	digitGroupSeparator: '\u202f' // Narrow no-break space
-	digitGroupSeparator: '\u00a0' // No-break space
-	digitGroupSeparator: ''       // No separator
-	digitGroupSeparator: "'"      // Apostrophe
-	digitGroupSeparator: '٬'      // Arabic thousands separator
-	digitGroupSeparator: '˙'      // Dot above

##### showOnlyNumbersOnFocus
*When true only numbers and the decimal character is visible while the input has focus*
-	showOnlyNumbersOnFocus: false (default)
-	showOnlyNumbersOnFocus: true 	removes currency sign and thousand seperator while the input has focus. Help on some mobile devices 

##### digitalGroupSpacing
*controls the digital grouping and the placement of the thousand separator*
-	digitalGroupSpacing: '3'	 produces 333,333,333   (default)
-	digitalGroupSpacing: '2'	 produces 22,22,22,333 India's Lakhs
-	digitalGroupSpacing: '2s' produces 22,333,22,22,333 scaled version of India Lakhs
-	digitalGroupSpacing: '4'	 produces 4,4444,4444 used in some Asian country's

##### decimalCharacter
*controls the decimal character*
-	decimalCharacter: ',' // Comma
-	decimalCharacter: '.' // Dot
-	decimalCharacter: '·' // Middle-dot
-	decimalCharacter: '٫' // Arabic decimal separator
-	decimalCharacter: '⎖' // Decimal separator key symbol

##### decimalCharacterAlternative
*this was developed to accommodate for different keyboard layouts. decimalCharacterAlternative allows you to declare an alternative key to enter the decimal separator assigned in decimalCharacter*
-	decimalCharacterAlternative: null   (default)

##### currencySymbol
*displays the desired currency symbol (examples: &#8364; or EUR). Note: other symbols can be used, such as %, &deg;C, &deg;F, km/h &#38; MPH the possibilities are endless*
-	currencySymbol: '' 	none   (default)
- 	examples:  	currencySymbol: 'U$D' or currencySymbol: 'EUR' 

##### currencySymbolPlacement
*controls the placement of the currency symbol (prefix or suffix)*
-	currencySymbolPlacement: 'p' 	prefix to the left   (default)
-	currencySymbolPlacement: 's' 	suffix to the right

##### negativePositiveSignPlacement
*placement of the negative sign. This position is relative to the currencySymbol position*
 - 	negativePositiveSignPlacement: 'l'	(default) left of currency sign
 - 	negativePositiveSignPlacement: 'r'	right of currency sign
 - 	negativePositiveSignPlacement: 's'	suffix places the sign to the right of the numbers
 - 	negativePositiveSignPlacement: 'p'	prefix places the sign(-) to the felt of the numbers
 - 	Examples:

| format	    | options to achieve format    |
| :------------:| :------------------------------------: | 
|  -1,234.56    | defaults      						|
|   1,234.56-   | {negativePositiveSignPlacement: 's'}   						|
| -$1,234.56	| {currencySymbol: '$'}  						|
| $-1,234.56 	| {currencySymbol: '$', negativePositiveSignPlacement: 'r'} 				|
|  $1,234.56- 	| {currencySymbol: '$', negativePositiveSignPlacement: 's'}       		|
|   1,234.56-$	| {currencySymbol: '$', currencySymbolPlacement: 's'}      		|
|   1,234.56$- 	| {currencySymbol: '$', currencySymbolPlacement: 's', negativePositiveSignPlacement: 'r'}	|
|  -1,234.56$	| {currencySymbol: '$', currencySymbolPlacement: 's', negativePositiveSignPlacement: 'p'}	|


##### suffixText
*Allows additional text as a suffix*
-	suffixText: ''		(default) no suffix defined
-	suffixText: 'test' example: 123,4.56 test
-	Numbers and minus sign (-) are not allowed and will cause an error

##### minimumValue
*controls the minimum value allowed*
-	minimumValue: '-9999999999999.99'   (default)
- 	Must be set as text
- 	Can be negative or positive but must be less than 'maximumValue'

##### maximumValue
*controls the maximum value allowed*
-	maximumValue: '9999999999999.99'   (default)
-	Must be set as text
-	Can be positive or negative but must be greater than 'minimumValue'

*Note: setting the minimumValue and maximumValue to both positive or negative with situations that limits the users ability to enter the proper values*  

##### decimalPlacesOverride
**Note: This has been deprecated in `v4`**
*overrides the decimal places that that are set via the minimumValue/maximumValue values*
- 	decimalPlacesOverride: null  (default method) 
- 	decimalPlacesOverride: '4'	overides the default and allows 4 decimal places

##### roundingMethod
*sets the rounding method used (12 different available - case sensitive)*

| option | Rounding method |
| :---------------- | :---------------------------------------------------- |
| 'S'		|	Round-Half-Up Symmetric **(default)**					|
| 'A'		|	Round-Half-Up Asymmetric							|
| 's'		|	Round-Half-Down Symmetric (lower case s)			|
| 'a'		|	Round-Half-Down Asymmetric (lower case a)			|
| 'B'		|	Round-Half-Even "Bankers Rounding"					|
| 'U'		|	Round Up "Round-Away-From-Zero"						|
| 'D'		|	Round Down "Round-Toward-Zero" - same as truncate	|
| 'C'		|	Round to Ceiling "Toward Positive Infinity"			| 																		|
| 'F'		|	Round to Floor "Toward Negative Infinity"			|
| 'N05'	|   Rounding "to the nearest .00 or .05"				|
| 'U05' 	|   Rounds up to next .00 or .05						|
| 'D05' 	|	Rounds down to next .00 or .05						|


##### allowDecimalPadding
*controls padding of the decimal places*
- 	allowDecimalPadding: true		always pads the decimal with zeros (default)
- 	allowDecimalPadding: false  	no padding


##### negativeBracketsTypeOnBlur
*controls if negative values are display with brackets when the input does not have focus*
-	negativeBracketsTypeOnBlur: null	 no brackets use for negative values (default)
-	negativeBracketsTypeOnBlur: '(,)'
-	negativeBracketsTypeOnBlur: '[,]'
-	negativeBracketsTypeOnBlur: '{,}'
-	negativeBracketsTypeOnBlur: '&#60;,&#62;'


##### emptyInputBehavior
*controls input currency sign display behavior when the input does not have a value ''*
-	emptyInputBehavior: 'focus'		(default) the currency symbol will be displayed on focus
-	emptyInputBehavior: 'press'		currency symbol will not be displayed until the first key is pressed
-	emptyInputBehavior: 'always'	currency symbol is always displayed with or without a value
    

##### leadingZero
*controls leading zeros behavior*
-	leadingZero: 'allow'	allows leading zero to be entered. They are removed on focusout event (default)
-	leadingZero: 'deny'	leading zeros not allowed.
-	leadingZero: 'keep'	leading zeros allowed and will be retained on the focusout event

##### selectNumberOnly
*controls the 'alt' &#38; 'a' select key combination*
-	selectNumberOnly: false	(default) selects all characters within the input
-	selectNumberOnly: true 	selects only the numbers
-	note: if the currency symbol is between the numeric value and the negative sign only the numeric characters will be selected
      

##### formatOnPageLoad
*controls if default values are formatted on page ready (load)*
-	formatOnPageLoad: true		default values are formatted on page ready (default)
-	formatOnPageLoad: false	default values are NOT formatted on page ready

##### defaultValueOverride
*helper option for ASP.NET post-back*
- 	should be the value of the un-formatted default value
-	this can be set as an option when initializing autoNumeric or as HTML5 data
-	examples:
-	no default value='' {defaultValueOverride: ''}
-	value=1234.56 {defaultValueOverride: '1234.56'}

##### unformatOnSubmit
*removes the format on the submit event*
- 	unformatOnSubmit: false (default) does not remove the formatting
- 	unformatOnSubmit: true - removes the formatting on the submit event
- 	this can be done globally via the extend method or by elemnt via the jQuery selector
- 	output is always "nnnn.nn" or negative "-nnnn.nn". n = 0-9 

##### showWarnings
*error handling function*
- 	showWarnings: true - (default) throws errors - helpful during developing.
-	showWarnings: false - stops most errors from being thrown.
