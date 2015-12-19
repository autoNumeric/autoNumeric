[autoNumeric-1.9.43](http://www.decorplanit.com/plugin/)
================================
Copyright (c) 2010 - 2015 Robert Knothe Licensed under the [MIT-license](http://opensource.org/licenses/mit-license.php)

updated 2015-12-19

[![NPM Version][npm-image]][npm-url] [![Dependency Status][david-image]][david-url]


### International currency formatting

autoNumeric is a jQuery plugin that automatically formats currency and numbers as you type on form inputs. 

**Highlights:**
- Easy to use and configure
- Supports most International numeric formats and currency signs including those used in Europe, North and South America, Asia and India lakhs
- Any number of currency formats can reside on the same page and are configured by settings/options that can be placed as HTML5 data attribute or passed as an argument
- The settings can easily be changed at any time using the update method or via the callback feature
- autoNumeric supports most text elements, allowing you to place formatted numbers and currency on just about any part of the page.
- Seven built in methods gives you the flexibility needed to use autoNumeric to its maximum potential
- There are 16 settings/options which controls the behavior and format of the form input field

Below is a quick tutorial - for demo's documentation and option code generator  [http://www.decorplanit.com/plugin/ ](http://www.decorplanit.com/plugin/)

[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=NCW5699RY8NN2)


****
###  Getting started:

**Note**: For integration into rails projects, see [autonumeric-rails](https://github.com/randoum/autonumeric-rails)

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
### Options


The complete list of options are below

There are multiple ways of changing the options. To format "123456789.00" to "&#8364; 123.456.789,00" you could do the following:

Pass **options** when initializing autoNumeric 
```javascript
$(document).ready(function(){
   $(selector).autoNumeric("init",{
		aSep: '.',
		aDec: ',', 
		aSign: '€ '
	});
});
```

Passed options as **HTML5 data**

```html
<input type='text' name="someName" ' value="1234.56" data-a-sep="." data-a-dec="," data-a-sign="€ "/>
```
Pass options via **jQuery's $.extend method** - in this example <span style="color:red;">ASP.NET</span> current culture settings are passed.

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
Pass options via a **Callback function** - this example changes the number of decimal places.

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
### Values

By default autoNumeric formats the default values on page ready. The values should be sent as text. To accommodate locale formats autoNumeric will treat the first period "." or comma "," as the decimal point. So the following rules apply:

| value / text  | valid?       |
| ------------- | ------------ |
|"123456"       | true         |
|"-123456"      | true         |
|"123456.78"    | true         |
|"-123456.78"   | true         |
|"123456,78"    | true         |
|"-123456,78"   | true         |
|"123,456.78"   | false        |
|"123.456.78"   | false        |
|"€ 123456.78"  | false        |

All values being "set" need to fall with the min/max rules.

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

Once the page is reloaded on post-back and autoNumeric compares $this[0].value" and the "$this.prop('defaultValue')" and sees they are equal it attenpts to format the values. From the above valid value table the "1,234.56" would be invalid. Luckily there are multiple ways to address the post-back event:

**1) Change the "aForm" option to "aForm: false" and then use the 'set" as follows**

```javascript
<script type="text/javascript">  
  jQuery(function($) {
  	$('selector').autoNumeric('init', {aForm: false});    
    $('selector').autoNumeric('set', '1234.56'); // produces "1,234.56"    
  });
</script>
```
**2) Change the "aForm" option to "aForm: false" and then pre-format the default value as follows:**

```html
<input type='text' name="someName" value="1,234.56" data-a-form: false data-a-sep="." data-a-dec=","/>
```

**3) Use the "anDefault" option that was created to help ASP.NET postabck. When "aForm: true" then "anDefault" option should be equal to the default in the following:

```javascript
<script type="text/javascript">  
  jQuery(function($) {
  	$('selector').autoNumeric('init', {anDefault: "123.45"});       
  });
</script>
```

**4) Change the "aForm" option to "aForm: false" and then pre-format the default value as follows:**

```html
<input type='text' name="someName" value="1234.56" data-an-default="1234.56" false data-a-sep="." data-a-dec=","/>
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
- vMin should always be a lower value tham vMax!
- vMin and vMax can be both positive or negative. But do so with caution.
- If the range of the vMin & vMax is small or you make them numbers other then "9" nines (example "1000) you could create a situation where the uses will need to delete characters before the can obtain the vMin / vMax limits. 
- If there are no decimal places the decimal character cannot be entered.

****

The following is a list of the methods and settings/options that control autoNumeric - for demo's, documentation and the option code generator please see [http://www.decorplanit.com/plugin/](http://www.decorplanit.com/plugin/)

****


**'init'** - *initializes autoNumeric* Must be run before other methods can be called 

-	$('someSelector').autoNumeric();
-	$('someSelector').autoNumeric('init');
-	$('someSelector').autoNumeric({options});
-	$('someSelector').autoNumeric('init', {options});

**'destroy'** - *stops autoNumeric*

-	$('someSelector').autoNumeric('destroy');

**'update'** - *updates autoNumeric's settings*

-	$('someSelector').autoNumeric('update', {options});
	- Can be run multiple times
	- Overrides the default settings and HTML5 data

**'set'** - *returns a formatted string via jQuery's ".val()" or ".text' methods to the selected tag(s)*

-	$('someSelector').autoNumeric('set', value);

**'get'** - *allows you to easily remove the formatting from a string on a autoNumeric controlled element and returns a string*

- 	$(selector).autoNumeric('get'); - always returns value as 'nnnn.nn' with the period as the decimal point.

**'getString'** - *this basically uses jQuery's .serialize() method which creates a text string (URL-encoded notation) from a set of form elements that is ready for submission. The extra step taken here is the string is split and iterated through and the formatted values are replaced with unformatted values. The string is then joined back together and returned*

- 	$(selector).autoNumeric('getString'); - always returns the value as 'nnnn.nn' with the period as the decimal point.


**'getArray'** - *this basically uses jQuery's .serializeArray() method which returns a JavaScript array of objects, ready to be encoded as a JSON string*

-	$('someSelector').autoNumeric('getArray'); - always returns the value as 'nnnn.nn' with the period as the decimal point.

**'getSettings'** - *this returns an object that shows the autoNumeric settings for the field. You may find this helpful when developing a page*

-	$('someSelector').autoNumeric('getSettings');

****

###  Default settings & supported options: 
[visit autoNumeric's home page for an easy to use settings and option code generator ](http://www.decorplanit.com/plugin/)

**"aSep"** - controls the thousand separator character

-	aSep: ','	comma (default)
-	aSep: '\''	apostrophe (note: the apostrophe is escaped)
-	aSep: '.'	period
-	aSep: ' '	space
-	aSep: ''	none

**"dGroup"** - controls the digital grouping and the placement of the thousand separator

-	dGroup: '3'	 produces 333,333,333   (default)
-	dGroup: '2'	 produces 22,22,22,333 (India's Lakhs format on values below 1 billion)
-	dGroup: '4'	 produces 4,4444,4444 used in some Asian country's

**"aDec"** - controls the decimal character

-	aDec: '.'	period   (default)
-	aDec: ','	comma

**"altDec"** - this was developed to accommodate for different keyboard layouts. altDec allows you to declare an alternative key to enter the decimal separator assigned in aDec

-	altDec: null   (default)

**"aSign"** - displays the desired currency symbol (examples: &#8364; or EUR). Note: other symbols can be used, such as %, &deg;C, &deg;F, km/h & MPH the possibilities are endless

-	aSign: '' none   (default)
	- example - aSign: 'U$D' 

**"pSign"** - controls the placement of the currency symbol (prefix or suffix)

-	pSign: 'p' prefix to the left   (default)
-	pSign: 's' suffix to the right

**"vMin"** - controls the minimum value allowed

-	vMin: '-9999999999999.99'   (default)
	- example - vMin: '0.00'

**"vMax"** - controls the maximum value allowed

-	vMax: '9999999999999.99'   (default)

*Note - setting the vMin and vMax to both positive or negative with situations that limits the users ability to enter the proper values*  

**"mDec"** - overrides the decimal places that that are set via the vMin/vMax values

- 	mDec: null   (default method) 
	- example - mDec: '4'

**"mRound"** - sets the rounding method used (10 different available)

- 	mRound: 'S'	Round-Half-Up Symmetric   (default)
- 	mRound: 'A'	Round-Half-Up Asymmetric
- 	mRound: 's'	Round-Half-Down Symmetric (lower case s)
- 	mRound: 'a'	Round-Half-Down Asymmetric (lower case a)
- 	mRound: 'B'	Round-Half-Even "Bankers Rounding"
- 	mRound: 'U'	Round Up "Round-Away-From-Zero"
- 	mRound: 'D'	Round Down "Round-Toward-Zero" - same as truncate
- 	mRound: 'C'	Round to Ceiling "Toward Positive Infinity"
- 	mRound: 'F'	Round to Floor "Toward Negative Infinity"
- 	mRound: 'CHF'	Rounding for Swiss currency "to the nearest .00 or .05"

**"aPad"** - controls padding of the decimal places

- 	aPad: true		always pads the decimal with zeros (default)
- 	aPad: false  	no padding

**"nBracket"** - controls if negative values are display with brackets when the input does not have focus

-	nBracket: null	 no brackets use for negative values (default)
-	nBracket: '(,)'
-	nBracket: '[,]'
-	nBracket: '{,}'
-	nBracket: '<,>'

**"wEmpty"** - controls input display behavior

-	wEmpty: 'empty'	allows input to be empty   (default)
-	wEmpty: 'zero'	input field will have at least a zero value
-	wEmpty: 'sign'	the currency symbol is always present###  Methods that are supported:
    

**"lZero"** - controls leading zeros behavior

-	lZero: 'allow'	allows leading zero to be entered. They are removed on focusout event (default)
-	lZero: 'deny'	leading zeros not allowed.
-	lZero: 'keep'	leading zeros allowed and will be retained on the focusout event

**"aForm"** - controls if default values are formatted on page ready (load)

-	aForm: true	default values are formatted on page ready (default)
-	aForm: false	default values are NOT formatted on page ready

**"anDefault"** - helper option for ASP.NET post-back

- 	should be the value of the un-formatted default value
-	this can be set as an option or HTML5 data
-	examples:
-	no default value='' {anDefault: ''}
-	value=1234.56 {anDefault: '1234.56'}

****

**Changing the defaults via options**
  
You can change the defaults with options via the "init" method or the "update" method after autoNUmeric has been initialized - example:

&lt;input type="text" id="someID" class="someClass"&gt;

$('someSelector').autoNumeric('init', {aSign: '&#8364; ', vMax: '-999999999.99', nBracket: '(,)'});

+ Initializes autoNumeric 
+ Adds the Euro sign
+ Allows negative value of -999999999.99
+ Allows brackets on negative values

**Changing the defaults via HTML5 data attribute**
  
You can also change the defaults with HTML5 data attributes - example:


&lt;input type="text" id="someID" class="someClass  data-a-sign="&#8364; " data-v-max="-999999999.99" data-n-bracket"(,)"&gt;

$('someSelector').autoNumeric('init');

+ Initializes autoNumeric 
+ Adds the Euro sign
+ Allows negative value of -999999999.99
+ Allows brackets on negative values

*Note: By convention the data attribute is written in lower-case. Compound words (example: "aDec") need to be split and separated by a dash. The equal sign separates the name and value. The value should be enclosed with quote marks. If multiple options are being used they each need to have the own data attribute.*

[npm-url]: https://npmjs.org/package/autonumeric
[npm-image]: https://img.shields.io/npm/v/autonumeric.svg
[david-url]: https://david-dm.org/BobKnothe/autoNumeric#info=dependencies
[david-image]: https://img.shields.io/david/BobKnothe/autoNumeric.svg
 
