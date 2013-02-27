# autoNumeric-1.8.6 

visit my home page for extensive demos and documentation [http://www.decorplanit.com/plugin/ ](http://www.decorplanit.com/plugin/)

Is a jQuery plugin that automatically formats currency and numbers as you type on form inputs. It supports most International numeric formats and currency signs including those used in Europe, North and South America, Asia and India lakhs (Lakhs values supported below 1 billion). 

Any number of currency formats can reside on the same page and are configured by settings/options that can be placed as HTML5 data attribute or passed as an argument. These settings can easily be changed at any time using the new ‘update’ method or via the callback feature. autoNumeric to many other elements, allowing you to place formatted numbers and currency on just about any part of the page.

Seven built in methods gives you the flexibility needed to use autoNumeric to its maximum potential. You can now easily start and stop autoNumeric, update the settings and remove the formatting from multiple inputs, preparing the values for manipulation or form submission.

There are fifteen settings/options which controls the behavior and format of the form input field. These setting are easy to implement with the HTML5 data or options passed as argument.

The settings can also be modified via callback function allows the returned value to be taken as parameter to the default/options settings. You can pass the callback function via options or HTML5 data and can be used on any of the 15 options.

If you are developing sites that span across International lines that use different currency symbols and formats you will find autoNumeric the ideal tool to shorten your development time.

****

The following is a list of the methods and settings/options the control autoNumeric - please my home page for a complete demo and documentation [http://www.decorplanit.com/plugin/](http://www.decorplanit.com/plugin/)

****

###  Methods that are supported:
    
**'init'** - *initializes autoNumeric*

+	$(selector).autoNumeric('init', {options});

**'destroy'** - *stops autoNumeric*

+	$(selector).autoNumeric('destroy');

**'update'** - *updates autoNumeric's settings*

+	$(selector).autoNumeric('update', {options});

**'set'** - *returns a formatted string via jQuery's ".val()" or ".text' methods to the selected tag(s)*

+	$(selector).autoNumeric('set', value);

**'get'** - *allows you to easily remove the formatting from a string on a autoNumeric controlled element and returns a value*

+	$(selector).autoNumeric('get');

**'getString'** - *this basically uses jQuery's .serialize() method which creates a text string (URL-encoded notation) from a set of form elements that is ready for submission. The extra step taken here is the string is split and iterated through and the formatted values are replaced with unformatted values. The string is then joined back together and returned*

+	$(selector).autoNumeric('getString');

**'getArray'** - *this basically uses jQuery's .serializeArray() method which returns a Javascript array of objects, ready to be encoded as a JSON string*

+	$(selector).autoNumeric('getArray');

**'getSettings'** - *this returns an object that shows the autoNumeric settings for the field. You may find this helpful when developing a page*

+	$(selector).autoNumeric('getSettings');

****

###  Settings / options that are supported: 
[visit my home page for an easy to use settings and option code generator ](http://www.decorplanit.com/plugin/)

**"aSep"** - controls the thousand character

+	aSep: ','	comma (default)
+	aSep: '\''	apostrophe (note: the apostrophe is escaped)
+	aSep: '.'	period
+	aSep: ' '	space
+	aSep: ''	none

**"dGroup"** - controls the digital grouping and the placement of the thousand separator

+	dGroup: '3'	 produces 333,333,333   (default)
+	dGroup: '2'	 produces 22,22,22,333 (India's lakhs format on values below 1 billion)
+	dGroup: '4'	 produces 4,4444,4444 used in some Asian country's

**"aDec"** - controls the decmial character

+	aDec: '.'	period   (default)
+	aDec: ','	comma

**"altDec"** - this was developed to accommodate for different keyboard layouts. altDec allows you to declare an alternative key to enter the decimal separator assigned in aDec

+	altDec: null   (default)

**"aSign"** - displays the desired currency symbol (examples: € or EUR). Note: other symbols can be used, such as %, °C, °F, km/h & MPH the possibilities are endless

+	aSign: '' none   (default)

**"pSign"** - controls the placement of the currency symbol (prefix or suffix)

+	pSign: 'p' prefix to the left   (default)

**"vMin"** - controls the minimum value allowed

+	vMin: '0.00'   (default)

**"vMax"** - controls the maximum value allowed

+	vMax: '999999999.99'   (default)

*Note - setting the vMin and vMax to both positive or negative with situations that limits the users ability to enter the proper values*  

**"mDec"** - overrides the decimal places that that are set via the vMin/vMax values

+ 	mDec: null   (default method)

**"mRound"** - sets the rounding method used (9 different available)

+ 	mRound: 'S'	Round-Half-Up Symmetric   (default)
+ 	mRound: 'A'	Round-Half-Up Asymmetric
+ 	mRound: 's'	Round-Half-Down Symmetric (lower case s)
+ 	mRound: 'a'	Round-Half-Down Asymmetric (lower case a)
+ 	mRound: 'B'	Round-Half-Even "Bankers Rounding"
+ 	mRound: 'U'	Round Up "Round-Away-From-Zero"
+ 	mRound: 'D'	Round Down "Round-Toward-Zero" - same as truncate
+ 	mRound: 'C'	Round to Ceiling "Toward Positive Infinity"
+ 	mRound: 'F'	Round to Floor "Toward Negative Infinity"

**"aPad"** - controls padding of the decimal places

+ aPad: true	always pads the decimal with zeros (default)

**"nBracket"** - controls if negative values are display with brackets when the input does not have focus

+	nBracket:null	 no brackets use for negative values (default)
	+Allowed options
	+nBracket: '(,)'
	+nBracket: '[,]'
	+nBracket: '{,}'
	+nBracket: '<,>'

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

**"wEmpty"** - controls input display behavior

+	wEmpty: 'empty'	allows input to be empty   (default)
+	wEmpty: 'zero'	input field will have at least a zero value
+	wEmpty: 'sign'	the currency symbol is always present

**"lZero"** - controls leading zeros behavior

+	lZero: 'allow'	allows leading zero to be entered. They are removed on focusout event (default)
+	lZero: 'deny'	leading zeros not allowed.
+	lZero: 'keep'	leading zeros allowed and will be retained on the focusout event

**"aForm"** - controls if default values are formatted on page ready (load)

+	aForm: true	default values are formatted on page ready (default)
+	aForm: false	default values are NOT formatted on page ready

****

**Changing the defaults via options**
  
You can change the defaults with options via the "init" method or the "update" method after autoNUmeric has been initialized - example:

&lt;input type="text" id="someID" class="someClass"&gt;

$('#someId').autoNumeric('**init**', {aSign: '€ ', vMax: '-999999999.99', nBracket: '()'});

+ Initializes autoNumeric 
+ Adds the Euro sign
+ Allows negative value of -999999999.99
+ Allows brackets on negative values

**Changing the defaults via HTML5 data attribute**
  
You can also change the defaults with HTML5 data attributes - example:


&lt;input type="text" id="someID" class="someClass  data-a-sign="€ " data-v-max="-999999999.99" data-n-bracket"()"&gt;

$('#someId').autoNumeric('**init**');

+ Initializes autoNumeric 
+ Adds the Euro sign
+ Allows negative value of -999999999.99
+ Allows brackets on negative values

*Note: By convention the data attribute is written in lowercase. Compound words (example: "aDec") need to be split and separated by a dash. The equal sign separates the name and value. The value should be enclosed with quote marks. If multiple options are being used they each need to have the own data attribute.*


 