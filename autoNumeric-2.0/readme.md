[autoNumeric-2.0](http://www.decorplanit.com/plugin/)
================================

### International currency formatting - Updated 2016-06-13 5:00pm 19:00

autoNumeric is a jQuery plugin that automatically formats currency and numbers as you type on form inputs. 

**Highlights:**
- Easy to use and configure
- Supports most International numeric formats and currency signs including those used in Europe, North and South America, Asia and India lakhs
- Any number of currency formats can reside on the same page and are configured by settings/options that can be placed as HTML5 data attribute or passed as an argument
- The settings can easily be changed at any time using the update method or via the callback feature
- autoNumeric supports most text elements, allowing you to place formatted numbers and currency on just about any part of the page.
- Eleven (11) built in methods gives you the flexibility needed to use autoNumeric to its maximum potential
- There are twenty three (23) settings/options which controls the behavior and format of the form input field

Below is a quick tutorial - for demo's documentation and option code generator  [http://www.decorplanit.com/plugin/ ](http://www.decorplanit.com/plugin/)

[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=NCW5699RY8NN2)


****
###  Getting started:


Include jQuery and autoNumeric js-files in your header. No other files or library are required.

```html
<script src="jquery.js" type="text/javascript"></script>
<script src="autoNumeric.js" type="text/javascript"></script>
```

Initialize autoNumeric and pass and options

```javascript
$(document).ready(function(){
   $(selector).autoNumeric('init');  //autoNumeric with defaults
});

$(document).ready(function(){
   $(selector).autoNumeric('init', {options});  //autoNumeric with options being passed
});
```

Input types supported:
- "text"
- "tel"
- "hidden"
- no type specified
- Number type is NOT supported - this is not autoNumeric it is because this "&#8364; 123.456.789,00" is not a number.

```html
<input type='text' name="someName"  id="someID" class='someClass' value="1234.56"/>
```

****
### Changing the defaults / options


The complete list of options are below

There are multiple ways of changing the options. To format "123456789.00" to "&#8364; 123.456.789,00" you could do the following:

**options** - *pass when initializing autoNumeric*
```javascript
$(document).ready(function(){
   $(selector).autoNumeric("init", {
		aSep: '.',
		aDec: ',', 
		aSign: '€ '
	});
});
```

**HTML5 data** - *By convention the data attribute is written in lower-case. Compound words (example: "aDec") need to be split and separated by a dash. The equal sign separates the name and value. The value should be enclosed with quote marks. If multiple options are being used they each need to have the own data attribute.

```html
<input type='text' name="someName" value="1234.56" data-a-sep="." data-a-dec="," data-a-sign="€ "/>
```


**$.extend method** - in this example <span style="color:red;">ASP.NET</span> current culture settings are passed.

note: - *this can change defaults globally*


```javascript
<script type="text/javascript">  
    
	$(document).ready(function () {          
		$.extend($.fn.autoNumeric.defaults, {              
			aSep: '@System.Threading.Thread.CurrentThread.CurrentCulture.NumberFormat.NumberGroupSeparator',              
			aDec: '@System.Threading.Thread.CurrentThread.CurrentCulture.NumberFormat.NumberDecimalSeparator',
            aSign: '@System.Threading.Thread.CurrentThread.CurrentCulture.NumberFormat.CurrencySymbol'
		});      
	});

  jQuery(function($) {
      $('selector').autoNumeric('init');    
  });
  
</script>
```
**Callback function** - *this example changes the number of decimal places.*

```javascript
 <script type="text/javascript">
 
 /* the callback function must be defined prior to initiating autoNumeric */ 
 
 var functionName = function(){
    /* your code here */  
    var value = 4; /* example only */
    return value; 
 }

 /* initiates autoNumeric and passes a function */	
																				
 $('selector').autoNumeric('init', {mDec: functionName}) 
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

If you do not want the default values formatted on set the option from "aForm: true" to "aForm: false" 

****

### ASP.NET default value and post-back

During page load / re-load autoNumeric compares the value of the input "$this[0].value" and the "$this.prop('defaultValue')" value. If they are equal and "aForm: true" the value is formatted.

What happens during ASP.NET form post-back is the input tag is re-rendered. An example Page loaded 

```html
<input type='text' name="someName"  id="someID" class='someClass' value="" />

// user enters "1234.56" => "1,234.56" with default settings
// during post-back the input is re-rendered and is now showing the new default value. 

<input type='text' name="someName"  id="someID" class='someClass' value="1,234.56" />
```

Once the page is reloaded on post-back and autoNumeric compares $this[0].value" and the "$this.prop('defaultValue')" and sees they are equal it attenpts to format the values. From the above valid value table the "1,234.56" would be invalid. 

**There are two options that can handle the postback event "aForm" &#38; "anDefault":**

**1) "aForm option"** - this option controls if default values are formatted on page load. By default it is set to "aForm: true"

Change the "aForm" option to ***"aForm: false"*** - this can be done when initalizing "init" the element as an option or as HTML5 data attribute

If there are no default value(vs) simply initialize 'init' the element 

```javascript
<script type="text/javascript">  
  jQuery(function($) {
  	$('selector').autoNumeric('init', {aForm: false});    
  });
</script>
```
If there is a default value you will need to pre-format the default value as shown 
```html
<!-- it is important that a prefomatted default values match the optings/settings
      missmatches could cause errors -->
<input type='text' name="someName" value="1,234.56"/>
```

**2) "anDefault"** option was created to help ASP.NET postabck and is used if ***"aForm: true"*** is set 'true'.

Note: "anDefault" option should be the same value as the default value

```html
<input type='text' name="someName" value="1234.56"/>
```

```javascript
<script type="text/javascript"> 
  // 'anDefault' is the value of the defaul value above 
  jQuery(function($) {
  	$('selector').autoNumeric('init', {anDefault: "1234.56"});       
  });
</script>
```
Please note that "aForm" and "anDefault" can be set by either {options} or HTML5 data attribute

****

### Min / Max settings and decimal places

The minimum and maximum values and decimal places are set via vMin: '-9999999999999.99' and vMax: '9999999999999.99' option. The decimal places are determined be the number of characters following the "." decimal point.  


| vMin:         | vMax:         | decimal places |
| :------------ | :------------ | :-----------:  |
| "0"           | "9999999999"  | 0              |
| "0.00"        | "99999999.99" | 2              |
| "0.00"        | "9999999999"  | 2              |
| "-9999999"    | "9999999.999" | 3              |


Notes:
- vMin should always be a lower value than vMax!
- vMin and vMax can be both positive or negative but do so with caution.
- If the range of the vMin &#38; vMax is small or you make them numbers other then "9" nines (example "1000) you could create a situation where the uses will need to delete characters before the can obtain the vMin / vMax limits. 

****

The following is a list of the methods and settings/options that control autoNumeric - for demo's, documentation and the option code generator please see [http://www.decorplanit.com/plugin/](http://www.decorplanit.com/plugin/)

****

### Methods supported by autoNumeric 2.0


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
-	$('someSelector').autoNumeric('getSettings').aDec; // returns the 'aDec' value 	
- 	any individual setting can be returned by replacing 'aDec' with the desired settings / option name		


****


###  Default settings &#38; supported options: 
[visit autoNumeric's home page for an easy to use settings and option code generator ](http://www.decorplanit.com/plugin/)

**"aSep"** - *controls the thousand separator character*
-	aSep: ','	comma (default)
-	aSep: '\''	apostrophe (note: the apostrophe is escaped)
-	aSep: '.'	period
-	aSep: ' '	space
-	aSep: ''	none

**"nSep"** - *When true only numbers and the decimal character is visible while the input has focus*
-	nSep: false (default)
-	nSep: true 	removes currency sign and thousand seperator while the input has focus. Help on some mobile devices 

**"dGroup"** - *controls the digital grouping and the placement of the thousand separator*
-	dGroup: '3'	 produces 333,333,333   (default)
-	dGroup: '2'	 produces 22,22,22,333 India's Lakhs
-	dGroup: '2s' produces 22,333,22,22,333 scaled version of India Lakhs
-	dGroup: '4'	 produces 4,4444,4444 used in some Asian country's

**"aDec"** - *controls the decimal character*
-	aDec: '.'	period   (default)
-	aDec: ','	comma

**"altDec"**   *this was developed to accommodate for different keyboard layouts. altDec allows you to declare an alternative key to enter the decimal separator assigned in aDec*
-	altDec: null   (default)

**"aSign"**		*displays the desired currency symbol (examples: &#8364; or EUR). Note: other symbols can be used, such as %, &deg;C, &deg;F, km/h &#38; MPH the possibilities are endless*
-	aSign: '' 	none   (default)
- 	examples:  	aSign: 'U$D' or aSign: 'EUR' 

**"pSign"** 	*controls the placement of the currency symbol (prefix or suffix)*
-	pSign: 'p' 	prefix to the left   (default)
-	pSign: 's' 	suffix to the right

**"pNeg"**		*placement of the negative sign. This position is relative to the aSign position*
 - 	pNeg: 'l'	(default) left of currency sign
 - 	pNeg: 'r'	right of currency sign
 - 	pNeg: 's'	suffix places the sign to the right of the numbers
 - 	pNeg: 'p'	prfix places the sign(-) to the felt of the numbers
 - 	Examples:

	| format	    | options to achieve format      						|
	| :------------:| :------------------------------------ | 
	|  -1,234.56    | defaults      						|
	|   1,234.56-   | {pNeg: 's'}   						|
    | -$1,234.56	| {aSign: '$'}  						|
    | $-1,234.56 	| {aSign: '$', pNeg: 'r'} 				|
    |  $1,234.56- 	| {aSign: '$', pNeg: 's'}       		|
    |   1,234.56-$	| {aSign: '$', pSign: 's'}      		|
    |   1,234.56$- 	| {aSign: '$', pSign: 's', pNeg: 'r'}	|
    |  -1,234.56$	| {aSign: '$', pSign: 's', pNeg: 'p'}	|


**"aSuffix"** 		*Allows additional text as a suffix*
-	aSuffix: ''		(default) no suffix defined
-	aSuffix: 'test' example: 123,4.56 test
-	Numbers and minus sign (-) are not allowed and will cause an error

**"vMin"**	*controls the minimum value allowed*
-	vMin: '-9999999999999.99'   (default)
- 	Must be set as text
- 	Can be negative or positive but must be less than 'vMax'

**"vMax"**	*controls the maximum value allowed*
-	vMax: '9999999999999.99'   (default)
-	Must be set as text
-	Can be positive or negative but must be greater than 'vMin'

*Note: setting the vMin and vMax to both positive or negative with situations that limits the users ability to enter the proper values*  

**"mDec"** 	*overrides the decimal places that that are set via the vMin/vMax values*
- 	mDec: null  (default method) 
- 	mDec: '4'	overides the default and allows 4 decimal places

**"mRound"**	*sets the rounding method used (12 different available - case senitive)*
| option	    	| Rounding method	                            		|
| :---------------- | :---------------------------------------------------- |
|	mRound: 'S'		|	Round-Half-Up Symmetric   (default)					|
| 	mRound: 'A'		|	Round-Half-Up Asymmetric							|
| 	mRound: 's'		|	Round-Half-Down Symmetric (lower case s)			|
| 	mRound: 'a'		|	Round-Half-Down Asymmetric (lower case a)			|
| 	mRound: 'B'		|	Round-Half-Even "Bankers Rounding"					|
| 	mRound: 'U'		|	Round Up "Round-Away-From-Zero"						|
| 	mRound: 'D'		|	Round Down "Round-Toward-Zero" - same as truncate	|
| 	mRound: 'C'		|	Round to Ceiling "Toward Positive Infinity"			| 																		|
| 	mRound: 'F'		|	Round to Floor "Toward Negative Infinity"			|
| 	mRound: 'N05'	|   Rounding "to the nearest .00 or .05"				|
| 	mRound: 'U05' 	|   Rounds up to next .00 or .05						|
|	mRound: 'D05' 	|	Rounds down to next .00 or .05						|


**"aPad"**	*controls padding of the decimal places*
- 	aPad: true		always pads the decimal with zeros (default)
- 	aPad: false  	no padding


**"nBracket"** 	*controls if negative values are display with brackets when the input does not have focus*
-	nBracket: null	 no brackets use for negative values (default)
-	nBracket: '(,)'
-	nBracket: '[,]'
-	nBracket: '{,}'
-	nBracket: '&#60;,&#62;'


**"wEmpty"**	*controls input currency sign display behavior when the input does not have a value ''*
-	wEmpty: 'focus'		(default) the currency symbol will be displayed on focus
-	wEmpty: 'press'		currency symbol will not be displayed until the first key is pressed
-	wEmpty: 'always'	currency symbol is always displayed with or without a value
    

**"lZero"**		*controls leading zeros behavior*
-	lZero: 'allow'	allows leading zero to be entered. They are removed on focusout event (default)
-	lZero: 'deny'	leading zeros not allowed.
-	lZero: 'keep'	leading zeros allowed and will be retained on the focusout event

**"sNumber"** *controls the 'alt' &#38; 'a' select key combination
-	sNumber: false	(default) selects all characters within the input
-	sNumber: true 	selects only the numbers
-	note: if the currency symbol is between the numeric value and the negative sign only the numeric characters will be selected
      

**"aForm"**		*controls if default values are formatted on page ready (load)*
-	aForm: true		default values are formatted on page ready (default)
-	aForm: false	default values are NOT formatted on page ready

**"anDefault"**	*helper option for ASP.NET post-back*
- 	should be the value of the un-formatted default value
-	this can be set as an option when initializing autoNumeric or as HTML5 data
-	examples:
-	no default value='' {anDefault: ''}
-	value=1234.56 {anDefault: '1234.56'}

**"unSetOnSubmit"**	*removes the format on the submit event*
- 	unSetOnSubmit: false (default) does not remove the formatting
- 	unSetOnSubmit: true - removes the formatting on the submit event
- 	this can be done globally via the extend method or by elemnt via the jQuery selector
- 	output is always "nnnn.nn" or negative "-nnnn.nn". n = 0-9 

**"debug"**	*error handling function*
- 	debug: true - (default) throws errors - helpful during developing.
-	debug: false - stops most errors from being thrown.

****