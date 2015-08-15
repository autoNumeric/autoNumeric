### Change log autoNumeric-2.0-BETA.js:

### 2015-08-15
+ Added option "unSetOnSubmit" to unformat input on the submit event
+ Added option "debug" to turn on and off error being thrown

### 2015-08-09
+ Added support for rbitrary-precision decimal arithmetic. This was adapted from Big.js https://github.com/MikeMcl/big.js/ Many thanks to Mike
+ Added support for trailing minus signs
+ Added rounding methods for currencys with smallest coin being $0.05
+ Added modified sNumber option that selects only numbers ctr & a keys thanks Zayter
+ Added support for return values to have locale formats
+ Added debug option to turn off errors
+ Added option anDefault to help ASP.NETR postback erros
+ Modified the wEmpty option
+ Removed oRide option

### 2015-03-30
+ Modified the 'init' && 'set' methods
+ General code clean up

### 2015-03-08
+ Modified the 'set', 'getString' & 'getArray' methods
+ Modified the 'nBracket' function
+ General code clean up

### 2015-02-17 GMT 7:30 PM
+ Modified the oRide option
+ Fixed the "update" method when it is called during the "onfocus" event
+ Fixed the "getString" & "getArray" methods when multiple inputs share the same name - Thanks Retromax
+ Fixed bug in "ctrl + v" paste event to properly round 
+ Merged a mod that makes the defaults public and over ridable - Thanks Peter Boccia
+ Fixed page reload when the thousand separator is a period "."

### 2014-10-07 GMT 9:00 PM
+ Merged mod from Zayter that adds option to highlight only the numbers when select all from keyboard
+ Fixed "getString" & "getArray" methods when multiple forms having some shared named inputs

### 2014-08-02 GMT 11:00 AM
+ Fixed mRound option "round-half-even"

### 2014-07-27 GMT 10:00 PM
+ Default values and Values being 'set' can use either the period '.' or Komma ',' as the decimal character
+ Added a parameter to the 'unSet', 'get', 'getString' & 'getArray' methods
+ 'unSet' method
	+ $(selector).autoNumeric('unSet'); - returns a numeric string as 'nnnn.nn' with the period '.' as the decimal character
	+ $(selector).autoNumeric('unSet', 'asKomma'); - returns numeric string 'nnnn,nn' with the comma / Komma ',' as the decimal character
	+ $(selector).autoNumeric('unSet', 'checkOptions'); - checks the options for the input and returns numeric string 'nnnn.nn' or 'nnnn,nn' based on the settings.
+ 'get' method
	+ $(selector).autoNumeric('get'); - returns a numeric string as 'nnnn.nn' with the period '.' as the decimal character
	+ $(selector).autoNumeric('get', 'asKomma'); - returns numeric string 'nnnn,nn' with the comma / Komma ',' as the decimal character
	+ $(selector).autoNumeric('get', 'checkOptions'); - checks the options for the input and returns numeric string 'nnnn.nn' or 'nnnn,nn' based on the settings.	
+ 'getString' method
	+ $(selector).autoNumeric('getString'); - returns a numeric string as 'nnnn.nn' with the period '.' as the decimal character
	+ $(selector).autoNumeric('getString', 'asKomma'); - returns numeric string 'nnnn,nn' with the comma / Komma ',' as the decimal character
	+ $(selector).autoNumeric('getString', 'checkOptions'); - checks the options for the input and returns numeric string 'nnnn.nn' or 'nnnn,nn' based on the settings.	
+ 'getArray' method
	+ $(selector).autoNumeric('getArray'); - returns a numeric string as 'nnnn.nn' with the period '.' as the decimal character
	+ $(selector).autoNumeric('getArray', 'asKomma'); - returns numeric string 'nnnn,nn' with the comma / Komma ',' as the decimal character
	+ $(selector).autoNumeric('getArray', 'checkOptions'); - checks the options for the input and returns numeric string 'nnnn.nn' or 'nnnn,nn' based on the settings.	
+ Modified the 'oRide' option
	+ example oRide: '6,0' allows positive values only with 6 integers with zero decimal places
	+ example oRide: '-8,2' allows positive and negative values with 8 integers and 2 decimal places
	+ Note - do not use the 'mDec' option whem using "oRide"
+ Fixed the bug that prevent negative values from being entered
+ Modified the 'set' so null values will not cause an error

#### 2014-07-02
+ Changed the case on the supported elements
+ This was required because jQuery.prop('tagName') returns upper-case on html5 pages and returns lower-case on xmhtl pages

#### 2014-06-21
+ Fixed the oRide option