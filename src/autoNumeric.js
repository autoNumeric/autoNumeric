/**
 *               autoNumeric.js
 *
 * @version      2.0.13
 * @date         2017-07-21 UTC 19:30
 *
 * @author       Bob Knothe
 * @contributors Alexandre Bonneau, Sokolov Yura and other Github users,
 *               cf. AUTHORS.md.
 * @copyright    2009 Robert J. Knothe http://www.decorplanit.com/plugin/
 * @since        2009-08-09
 *
 * @summary      autoNumeric is a library that provides live as-you-type
 *               formatting for international numbers and currencies.
 *
 *               Note : Some functions are borrowed from big.js
 * @link         https://github.com/MikeMcl/big.js/
 *
 * Please report any bugs to https://github.com/autoNumeric/autoNumeric
 *
 * @license      Released under the MIT License
 * @link         http://www.opensource.org/licenses/mit-license.php
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


/* global module, require, define */

// Functions names for ES6 exports
let autoFormat;
let autoUnFormat;
let getDefaultConfig;
let getLanguages;
let validate;
let areSettingsValid;

// AutoNumeric default settings
/**
 * List of allowed tag on which autoNumeric can be used.
 */
const allowedTagList = [
    'b',
    'caption',
    'cite',
    'code',
    'const',
    'dd',
    'del',
    'div',
    'dfn',
    'dt',
    'em',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ins',
    'kdb',
    'label',
    'li',
    'option',
    'output',
    'p',
    'q',
    's',
    'sample',
    'span',
    'strong',
    'td',
    'th',
    'u',
];

/**
 * Defaults options are public - these can be overridden by the following method:
 * - HTML5 data attributes (ie. `<input type="text" data-currency-symbol=" €">`)
 * - Options passed by the 'init' or 'update' methods (ie. `aNInput.autoNumeric('update', { currencySymbol: ' €' });`)
 * - Use jQuery's `$.extend` method for global changes - also a great way to pass ASP.NET current culture settings
 */
const defaultSettings = {
    /* Allowed thousand grouping separator characters :
     * ','      // Comma
     * '.'      // Dot
     * ' '      // Normal space
     * '\u2009' // Thin-space
     * '\u202f' // Narrow no-break space
     * '\u00a0' // No-break space
     * ''       // No separator
     * "'"      // Apostrophe
     * '٬'      // Arabic thousands separator
     * '˙'      // Dot above
     * Deprecated older option name : aSep
     */
    digitGroupSeparator: ',',

    /* Remove the thousand separator on focus, currency symbol and suffix on focus
     * example if the input value "$ 1,999.88 suffix"
     * on "focusin" it becomes "1999.88" and back to "$ 1,999.88 suffix" on focus out.
     * Deprecated older option name : nSep
     */
    noSeparatorOnFocus: false,

    /* Digital grouping for the thousand separator used in Format
     * digitalGroupSpacing: "2", results in 99,99,99,999 India's lakhs
     * digitalGroupSpacing: "2s", results in 99,999,99,99,999 India's lakhs scaled
     * digitalGroupSpacing: "3", results in 999,999,999 default
     * digitalGroupSpacing: "4", results in 9999,9999,9999 used in some Asian countries
     * Deprecated older option name : dGroup
     */
    digitalGroupSpacing: '3',

    /* Allowed decimal separator characters :
     * ',' : Comma
     * '.' : Dot
     * '·' : Middle-dot
     * '٫' : Arabic decimal separator
     * '⎖' : Decimal separator key symbol
     * Deprecated older option name : aDec
     */
    decimalCharacter: '.',

    /* Allow to declare an alternative decimal separator which is automatically replaced by `decimalCharacter` when typed.
     * This is used by countries that use a comma "," as the decimal character and have keyboards\numeric pads that have
     * a period 'full stop' as the decimal characters (France or Spain for instance).
     * Deprecated older option name : altDec
     */
    decimalCharacterAlternative: null,

    /* currencySymbol = allowed currency symbol
     * Must be in quotes currencySymbol: "$"
     * space to the right of the currency symbol currencySymbol: '$ '
     * space to the left of the currency symbol currencySymbol: ' $'
     * Deprecated older option name : aSign
     */
    currencySymbol: '',

    /* currencySymbolPlacement = placement of currency sign as a p=prefix or s=suffix
     * for prefix currencySymbolPlacement: "p" (default)
     * for suffix currencySymbolPlacement: "s"
     * Deprecated older option name : pSign
     */
    //TODO Rename the options to more explicit names ('p' => 'prefix', etc.)
    currencySymbolPlacement: 'p',

    /* Placement of negative/positive sign relative to the currencySymbol option l=left, r=right, p=prefix & s=suffix
     * -1,234.56  => default no options required
     * -$1,234.56 => {currencySymbol: "$"} or {currencySymbol: "$", negativePositiveSignPlacement: "l"}
     * $-1,234.56 => {currencySymbol: "$", negativePositiveSignPlacement: "r"} // Default if negativePositiveSignPlacement is 'null' and currencySymbol is not empty
     * -1,234.56$ => {currencySymbol: "$", currencySymbolPlacement: "s", negativePositiveSignPlacement: "p"} // Default if negativePositiveSignPlacement is 'null' and currencySymbol is not empty
     * 1,234.56-  => {negativePositiveSignPlacement: "s"}
     * $1,234.56- => {currencySymbol: "$", negativePositiveSignPlacement: "s"}
     * 1,234.56-$ => {currencySymbol: "$", currencySymbolPlacement: "s"}
     * 1,234.56$- => {currencySymbol: "$", currencySymbolPlacement: "s", negativePositiveSignPlacement: "r"}
     * Deprecated older option name : pNeg
     */
    //TODO Rename the options to more explicit names ('p' => 'prefix', etc.)
    negativePositiveSignPlacement: null,


    /* Allow the positive sign symbol `+` to be displayed for positive numbers.
     * By default, this positive sign is not shown.
     * The sign placement is controlled by the 'negativePositiveSignPlacement' option, mimicking the negative sign placement rules.
     */
    showPositiveSign: false,

    /* Additional suffix
     * Must be in quotes suffixText: 'gross', a space is allowed suffixText: ' dollars'
     * Numeric characters and negative sign not allowed'
     * Deprecated older option name : aSuffix
     */
    suffixText: '',

    /* Override min max limits
     * overrideMinMaxLimits: "ceiling" adheres to maximumValue and ignores minimumValue settings
     * overrideMinMaxLimits: "floor" adheres to minimumValue and ignores maximumValue settings
     * overrideMinMaxLimits: "ignore" ignores both minimumValue & maximumValue
     * Deprecated older option name : oLimits
     */
    overrideMinMaxLimits: null,

    /* Maximum possible value
     * value must be enclosed in quotes and use the period for the decimal point
     * value must be larger than minimumValue
     * Deprecated older option name : vMax
     */
    maximumValue: '9999999999999.99', // 9.999.999.999.999,99 ~= 10000 billions

    /* Minimum possible value
     * value must be enclosed in quotes and use the period for the decimal point
     * value must be smaller than maximumValue
     * Deprecated older option name : vMin
     */
    minimumValue: '-9999999999999.99', // -9.999.999.999.999,99 ~= 10000 billions

    /* Maximum number of decimal places = used to override decimal places set by the minimumValue & maximumValue values
     * Deprecated older option name : mDec
     */
    decimalPlacesOverride: null,

    /* Expanded decimal places visible when input has focus - example:
     * {decimalPlacesShownOnFocus: "5"} and the default 2 decimal places with focus "1,000.12345" without focus "1,000.12" the results depends on the rounding method used
     * the "get" method returns the extended decimal places
     * Deprecated older option name : eDec
     */
    decimalPlacesShownOnFocus: null,

    /* The next three options (scaleDivisor, scaleDecimalPlaces & scaleSymbol) handle scaling of the input when the input does not have focus
     * Please note that the non-scaled value is held in data and it is advised that you use the "saveValueToSessionStorage" option to ensure retaining the value
     * ["divisor", "decimal places", "symbol"]
     * Example: with the following options set {scaleDivisor: '1000', scaleDecimalPlaces: '1', scaleSymbol: ' K'}
     * Example: focusin value "1,111.11" focusout value "1.1 K"
     */

    /* The `scaleDivisor` decides the on focus value and places the result in the input on focusout
     * Example {scaleDivisor: '1000'} or <input data-scale-divisor="1000">
     * The divisor value - does not need to be whole number but please understand that Javascript has limited accuracy in math
     * The "get" method returns the full value, including the 'hidden' decimals.
     */
    scaleDivisor: null,

    /*
     * The `scaleDecimalPlaces` option is the number of decimal place when not in focus - for this to work, `scaledDivisor` must not be `null`.
     * This is optional ; if omitted the decimal places will be the same when the input has the focus.
     * Deprecated older option name : scaleDecimal
     */
    scaleDecimalPlaces: null,

    /*
     * The `scaleSymbol` option is a symbol placed as a suffix when not in focus.
     * This is optional too.
     */
    scaleSymbol: null,

    /* Set to true to allow the decimalPlacesShownOnFocus value to be saved with sessionStorage
     * if ie 6 or 7 the value will be saved as a session cookie
     * Deprecated older option name : aStor
     */
    saveValueToSessionStorage: false,

    /*
     * Manage how autoNumeric react when the user tries to paste an invalid number.
     * - 'error'    : (This is the default behavior) The input value is not changed and an error is output in the console.
     * - 'ignore'   : idem than 'error', but fail silently without outputting any error/warning in the console.
     * - 'clamp'    : if the pasted value is either too small or too big regarding the minimumValue and maximumValue range, then the result is clamped to those limits.
     * - 'truncate' : autoNumeric will insert as many pasted numbers it can at the initial caret/selection, until everything is pasted, or the range limit is hit.
     *                The non-pasted numbers are dropped and therefore not used at all.
     * - 'replace'  : autoNumeric will first insert as many pasted numbers it can at the initial caret/selection, then if the range limit is hit, it will try
     *                to replace one by one the remaining initial numbers (on the right side of the caret) with the rest of the pasted numbers.
     *
     * Note 1 : A paste content starting with a negative sign '-' will be accepted anywhere in the input, and will set the resulting value as a negative number
     * Note 2 : A paste content starting with a number will be accepted, even if the rest is gibberish (ie. '123foobar456').
     *          Only the first number will be used (here '123').
     * Note 3 : The paste event works with the `decimalPlacesShownOnFocus` option too.
     */
    //TODO Shouldn't we use `truncate` as the default value?
    onInvalidPaste: 'error',

    /* method used for rounding
     * roundingMethod: "S", Round-Half-Up Symmetric (default)
     * roundingMethod: "A", Round-Half-Up Asymmetric
     * roundingMethod: "s", Round-Half-Down Symmetric (lower case s)
     * roundingMethod: "a", Round-Half-Down Asymmetric (lower case a)
     * roundingMethod: "B", Round-Half-Even "Bankers Rounding"
     * roundingMethod: "U", Round Up "Round-Away-From-Zero"
     * roundingMethod: "D", Round Down "Round-Toward-Zero" - same as truncate
     * roundingMethod: "C", Round to Ceiling "Toward Positive Infinity"
     * roundingMethod: "F", Round to Floor "Toward Negative Infinity"
     * roundingMethod: "N05" Rounds to the nearest .05 => same as "CHF" used in 1.9X and still valid
     * roundingMethod: "U05" Rounds up to next .05
     * roundingMethod: "D05" Rounds down to next .05
     * Deprecated older option name : mRound
     */
    //TODO Rename the options to more explicit names ('S' => 'RoundHalfUpSymmetric', etc.)
    //TODO Add an `an.roundingMethod` object that enum those options clearly
    roundingMethod: 'S',

    /* Allow padding the decimal places with zeros
     * allowDecimalPadding: true - always Pad decimals with zeros
     * allowDecimalPadding: false - does not pad with zeros.
     * Note: setting allowDecimalPadding to 'false' will override the 'decimalPlacesOverride' setting.
     *
     * thanks to Jonas Johansson for the suggestion
     * Deprecated older option name : aPad
     */
    allowDecimalPadding: true,

    /* Adds brackets on negative values (ie. transforms '-$ 999.99' to '(999.99)')
     * Those brackets are visible only when the field does NOT have the focus.
     * The left and right symbols should be enclosed in quotes and separated by a comma
     * This option can be of the following values :
     * null, // This is the default value, which deactivate this feature
     * '(,)',
     * '[,]',
     * '<,>' or
     * '{,}'
     * Deprecated older option name : nBracket
     */
    //TODO Rename the options to more explicit names ('(,)' => 'parentheses', etc.)
    negativeBracketsTypeOnBlur: null,

    /* Displayed on empty string ""
     * emptyInputBehavior: "focus" - (default) currency sign displayed and the input receives focus
     * emptyInputBehavior: "press" - currency sign displays on any key being pressed
     * emptyInputBehavior: "always" - always displays the currency sign only
     * emptyInputBehavior: "zero" - if the input has no value on focus out displays a zero "rounded" with or without a currency sign
     * Deprecated older option name : wEmpty
     */
    emptyInputBehavior: 'focus',

    /* Controls leading zero behavior
     * leadingZero: "allow", - allows leading zeros to be entered. Zeros will be truncated when entering additional digits. On focusout zeros will be deleted.
     * leadingZero: "deny", - allows only one leading zero on values less than one
     * leadingZero: "keep", - allows leading zeros to be entered. on focusout zeros will be retained.
     * Deprecated older option name : lZero
     */
    leadingZero: 'deny',

    /* Determine if the default value will be formatted on initialization.
     * true = automatically formats the default value on initialization
     * false = will not format the default value on initialization
     * Deprecated older option name : aForm
     */
    formatOnPageLoad: true,

    /* Determine if the select all keyboard command will select the complete input text, or only the input numeric value
     * Note : If the currency symbol is between the numeric value and the negative sign, only the numeric value will selected
     * Deprecated older option name : sNumber
     */
    selectNumberOnly: false,

    /* Helper option for ASP.NET postback
     * should be the value of the unformatted default value
     * examples:
     * no default value="" {defaultValueOverride: ""}
     * value=1234.56 {defaultValueOverride: '1234.56'}
     * Deprecated older option name : anDefault
     */
    defaultValueOverride: null,

    /* Removes formatting on submit event
     * this output format: positive nnnn.nn, negative -nnnn.nn
     * review the 'unSet' method for other formats
     * Deprecated older option name : unSetOnSubmit
     */
    unformatOnSubmit: false,

    /* Allows the output to be in the locale format via the "get", "getString" & "getArray" methods
     * null or 'string' => 'nnnn.nn' or '-nnnn.nn' as text type. This is the default behavior.
     * 'number'         => nnnn.nn or -nnnn.nn as a Number (Warning: this works only for integers inferior to Number.MAX_SAFE_INTEGER)
     * ',' or '-,'      => 'nnnn,nn' or '-nnnn,nn'
     * '.-'             => 'nnnn.nn' or 'nnnn.nn-'
     * ',-'             => 'nnnn,nn' or 'nnnn,nn-'
     * Deprecated older option name : outputType
     */
    outputFormat: null,

    /* Defines if warnings should be shown
     * Error handling function
     * true => all warning are shown
     * false => no warnings are shown, only the thrown errors
     * Deprecated older option name : debug
     */
    showWarnings: true,

    /*
     * This option is the 'strict mode' (aka 'debug' mode), which allows autoNumeric to strictly analyse the options passed, and fails if an unknown options is used in the settings object.
     * You should set that to 'TRUE' if you want to make sure you are only using 'pure' autoNumeric settings objects in your code.
     * If you see uncaught errors in the console and your code starts to fail, this means somehow those options gets corrupted by another program.
     */
    failOnUnknownOption: false,
};

/**
 * Wrapper variable that hold named keyboard keys with their respective keyCode as seen in DOM events.
 * //TODO Replace every call to this object with a call to `keyName`
 * @deprecated
 */
const keyCode = {
    Backspace:      8,
    Tab:            9,
    Enter:          13,
    Shift:          16,
    Ctrl:           17,
    Alt:            18,
    PauseBreak:     19,
    CapsLock:       20,
    Esc:            27,
    Space:          32,
    PageUp:         33,
    PageDown:       34,
    End:            35,
    Home:           36,
    LeftArrow:      37,
    UpArrow:        38,
    RightArrow:     39,
    DownArrow:      40,
    Insert:         45,
    Delete:         46,
    num0:           48,
    num1:           49,
    num2:           50,
    num3:           51,
    num4:           52,
    num5:           53,
    num6:           54,
    num7:           55,
    num8:           56,
    num9:           57,
    a:              65,
    b:              66,
    c:              67,
    d:              68,
    e:              69,
    f:              70,
    g:              71,
    h:              72,
    i:              73,
    j:              74,
    k:              75,
    l:              76,
    m:              77,
    n:              78,
    o:              79,
    p:              80,
    q:              81,
    r:              82,
    s:              83,
    t:              84,
    u:              85,
    v:              86,
    w:              87,
    x:              88,
    y:              89,
    z:              90,
    Windows:        91,
    RightClick:     93,
    numpad0:        96,
    numpad1:        97,
    numpad2:        98,
    numpad3:        99,
    numpad4:        100,
    numpad5:        101,
    numpad6:        102,
    numpad7:        103,
    numpad8:        104,
    numpad9:        105,
    MultiplyNumpad: 106,
    PlusNumpad:     107,
    MinusNumpad:    109,
    DotNumpad:      110,
    SlashNumpad:    111,
    F1:             112,
    F2:             113,
    F3:             114,
    F4:             115,
    F5:             116,
    F6:             117,
    F7:             118,
    F8:             119,
    F9:             120,
    F10:            121,
    F11:            122,
    F12:            123,
    NumLock:        144,
    ScrollLock:     145,
    MyComputer:     182,
    MyCalculator:   183,
    Semicolon:      186,
    Equal:          187,
    Comma:          188,
    Hyphen:         189,
    Dot:            190,
    Slash:          191,
    Backquote:      192,
    LeftBracket:    219,
    Backslash:      220,
    RightBracket:   221,
    Quote:          222,
    Command:        224,
    AndroidDefault: 229, // Android Chrome returns the same keycode number 229 for all keys pressed
};

/**
 * Wrapper variable that hold named keyboard keys with their respective key name (as set in KeyboardEvent.key).
 * Those names are listed here :
 * @link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
 */
const keyName = {
    // Special values
    Unidentified:   'Unidentified',

    // Modifier keys
    Alt:            'Alt',
    AltGr:          'AltGraph',
    CapsLock:       'CapsLock', // Under Chrome, e.key is empty for CapsLock
    Ctrl:           'Control',
    Fn:             'Fn',
    FnLock:         'FnLock',
    Hyper:          'Hyper', // 'OS' under Firefox
    Meta:           'Meta', // The Windows, Command or ⌘ key // 'OS' under Firefox and IE9
    Windows:        'Meta', // This is a non-official key name
    Command:        'Meta', // This is a non-official key name
    NumLock:        'NumLock',
    ScrollLock:     'ScrollLock',
    Shift:          'Shift',
    Super:          'Super', // 'OS' under Firefox
    Symbol:         'Symbol',
    SymbolLock:     'SymbolLock',

    // Whitespace keys
    Enter:          'Enter',
    Tab:            'Tab',
    Space:          ' ', // 'Spacebar' for Firefox <37, and IE9

    // Navigation keys
    DownArrow:      'ArrowDown', // 'Down' for Firefox <=36, and IE9
    LeftArrow:      'ArrowLeft', // 'Left' for Firefox <=36, and IE9
    RightArrow:     'ArrowRight', // 'Right' for Firefox <=36, and IE9
    UpArrow:        'ArrowUp', // 'Up' for Firefox <=36, and IE9
    End:            'End',
    Home:           'Home',
    PageDown:       'PageDown',
    PageUp:         'PageUp',

    // Editing keys
    Backspace:      'Backspace',
    Clear:          'Clear',
    Copy:           'Copy',
    CrSel:          'CrSel', // 'Crsel' for Firefox <=36, and IE9
    Cut:            'Cut',
    Delete:         'Delete', // 'Del' for Firefox <=36, and IE9
    EraseEof:       'EraseEof',
    ExSel:          'ExSel', // 'Exsel' for Firefox <=36, and IE9
    Insert:         'Insert',
    Paste:          'Paste',
    Redo:           'Redo',
    Undo:           'Undo',

    // UI keys
    Accept:         'Accept',
    Again:          'Again',
    Attn:           'Attn', // 'Unidentified' for Firefox, Chrome, and IE9 ('KanaMode' when using the Japanese keyboard layout)
    Cancel:         'Cancel',
    ContextMenu:    'ContextMenu', // 'Apps' for Firefox <=36, and IE9
    Esc:            'Escape', // 'Esc' for Firefox <=36, and IE9
    Execute:        'Execute',
    Find:           'Find',
    Finish:         'Finish', // 'Unidentified' for Firefox, Chrome, and IE9 ('Katakana' when using the Japanese keyboard layout)
    Help:           'Help',
    Pause:          'Pause',
    Play:           'Play',
    Props:          'Props',
    Select:         'Select',
    ZoomIn:         'ZoomIn',
    ZoomOut:        'ZoomOut',

    // Device keys
    BrightnessDown: 'BrightnessDown',
    BrightnessUp:   'BrightnessUp',
    Eject:          'Eject',
    LogOff:         'LogOff',
    Power:          'Power',
    PowerOff:       'PowerOff',
    PrintScreen:    'PrintScreen',
    Hibernate:      'Hibernate', // 'Unidentified' for Firefox <=37
    Standby:        'Standby', // 'Unidentified' for Firefox <=36, and IE9
    WakeUp:         'WakeUp',

    // IME and composition keys
    Compose:        'Compose',
    Dead:           'Dead',

    // Function keys
    F1:             'F1',
    F2:             'F2',
    F3:             'F3',
    F4:             'F4',
    F5:             'F5',
    F6:             'F6',
    F7:             'F7',
    F8:             'F8',
    F9:             'F9',
    F10:            'F10',
    F11:            'F11',
    F12:            'F12',

    // Document keys
    Print:          'Print',

    // 'Normal' keys
    num0:           '0',
    num1:           '1',
    num2:           '2',
    num3:           '3',
    num4:           '4',
    num5:           '5',
    num6:           '6',
    num7:           '7',
    num8:           '8',
    num9:           '9',
    numpad0:        '0',
    numpad1:        '1',
    numpad2:        '2',
    numpad3:        '3',
    numpad4:        '4',
    numpad5:        '5',
    numpad6:        '6',
    numpad7:        '7',
    numpad8:        '8',
    numpad9:        '9',
    a:              'a',
    b:              'b',
    c:              'c',
    d:              'd',
    e:              'e',
    f:              'f',
    g:              'g',
    h:              'h',
    i:              'i',
    j:              'j',
    k:              'k',
    l:              'l',
    m:              'm',
    n:              'n',
    o:              'o',
    p:              'p',
    q:              'q',
    r:              'r',
    s:              's',
    t:              't',
    u:              'u',
    v:              'v',
    w:              'w',
    x:              'x',
    y:              'y',
    z:              'z',
    MultiplyNumpad: '*',
    PlusNumpad:     '+',
    MinusNumpad:    '-',
    DotNumpad:      '.',
    SlashNumpad:    '/',
    Semicolon:      ';',
    Equal:          '=',
    Comma:          ',',
    Hyphen:         '-',
    Minus:          '-',
    Plus:           '+',
    Dot:            '.',
    Slash:          '/',
    Backquote:      '`',
    LeftBracket:    '[',
    RightBracket:   ']',
    Backslash:      '\\',
    Quote:          "'",
    NumpadDot:      '.',
    NumpadDotAlt:   ',', // Modern browsers automatically adapt the character sent by this key to the decimal character of the current language
    NumpadMultiply: '*',
    NumpadPlus:     '+',
    NumpadMinus:    '-',
    NumpadSlash:    '/',
    NumpadDotObsoleteBrowsers:      'Decimal',
    NumpadMultiplyObsoleteBrowsers: 'Multiply',
    NumpadPlusObsoleteBrowsers:     'Add',
    NumpadMinusObsoleteBrowsers:    'Subtract',
    NumpadSlashObsoleteBrowsers:    'Divide',
};

const defaultMinimumValue     = '-999999999999.99';
const defaultMaximumValue     = '999999999999.99';
const defaultRoundingMethod   = 'U';
const defaultLeadingZero      = 'deny';
const defaultSelectNumberOnly = true;

/**
 * Predefined options for the most common languages
 */
const languageOption = {
    French: { // Français
        digitGroupSeparator        : '.', // or '\u202f'
        decimalCharacter           : ',',
        decimalCharacterAlternative: '.',
        currencySymbol             : '\u202f€',
        currencySymbolPlacement    : 's',
        selectNumberOnly           : defaultSelectNumberOnly,
        roundingMethod             : defaultRoundingMethod,
        leadingZero                : defaultLeadingZero,
        minimumValue               : defaultMinimumValue,
        maximumValue               : defaultMaximumValue,
    },
    NorthAmerican: {
        digitGroupSeparator    : ',',
        decimalCharacter       : '.',
        currencySymbol         : '$',
        currencySymbolPlacement: 'p',
        selectNumberOnly       : defaultSelectNumberOnly,
        roundingMethod         : defaultRoundingMethod,
        leadingZero            : defaultLeadingZero,
        minimumValue           : defaultMinimumValue,
        maximumValue           : defaultMaximumValue,
    },
    British: {
        digitGroupSeparator    : ',',
        decimalCharacter       : '.',
        currencySymbol         : '£',
        currencySymbolPlacement: 'p',
        selectNumberOnly       : defaultSelectNumberOnly,
        roundingMethod         : defaultRoundingMethod,
        leadingZero            : defaultLeadingZero,
        minimumValue           : defaultMinimumValue,
        maximumValue           : defaultMaximumValue,
    },
    Swiss: { // Suisse
        digitGroupSeparator    : `'`,
        decimalCharacter       : '.',
        currencySymbol         : '\u202fCHF',
        currencySymbolPlacement: 's',
        selectNumberOnly       : defaultSelectNumberOnly,
        roundingMethod         : defaultRoundingMethod,
        leadingZero            : defaultLeadingZero,
        minimumValue           : defaultMinimumValue,
        maximumValue           : defaultMaximumValue,
    },
    Japanese: { // 日本語
        digitGroupSeparator    : ',',
        decimalCharacter       : '.',
        currencySymbol         : '¥',
        currencySymbolPlacement: 'p',
        selectNumberOnly       : defaultSelectNumberOnly,
        roundingMethod         : defaultRoundingMethod,
        leadingZero            : defaultLeadingZero,
        minimumValue           : defaultMinimumValue,
        maximumValue           : defaultMaximumValue,
    },
};
languageOption.Spanish = languageOption.French; // Español (idem French)
languageOption.Chinese = languageOption.Japanese; // 中国語 (Chinese)

/**
 * UMD structure
 */
(function(factory) {
    //TODO This surely can be improved by letting webpack take care of generating this UMD part
if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
    define(['jquery'], factory);
} else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
    module.exports = factory(require('jquery'));
} else {
        // Browser globals
    factory(window.jQuery);
}
}($ => {
    // Helper functions

    /**
     * Return TRUE if the `value` is null
     *
     * @static
     * @param {*} value The value to test
     * @returns {boolean} Return TRUE if the `value` is null, FALSE otherwise
     */
    function isNull(value) {
        return value === null;
    }

    /**
     * Return TRUE if the `value` is undefined
     *
     * @static
     * @param {*} value The value to test
     * @returns {boolean} Return TRUE if the `value` is undefined, FALSE otherwise
     */
    function isUndefined(value) {
        return value === void(0);
    }

    /**
     * Return TRUE if the `value` is undefined, null or empty
     *
     * @param {*} value
     * @returns {boolean}
     */
    function isUndefinedOrNullOrEmpty(value) {
        return value === null || value === void(0) || '' === value;
    }

    /**
     * Return TRUE if the given parameter is a String
     *
     * @param {*} str
     * @returns {boolean}
     */
    function isString(str) {
        return (typeof str === 'string' || str instanceof String);
    }

    /**
     * Return TRUE if the parameter is a boolean
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     */
    function isBoolean(value) {
        return typeof(value) === 'boolean';
    }

    /**
     * Return TRUE if the parameter is a string 'true' or 'false'
     *
     * This function accepts any cases for those strings.
     * @param {string} value
     * @returns {boolean}
     */
    function isTrueOrFalseString(value) {
        const lowercaseValue = String(value).toLowerCase();
        return lowercaseValue === 'true' || lowercaseValue === 'false';
    }

    /**
     * Return TRUE if the parameter is an object
     *
     * @param {*} reference
     * @returns {boolean}
     */
    function isObject(reference) {
        return typeof reference === 'object' && reference !== null && !Array.isArray(reference);
    }

    /**
     * Return TRUE if the given object is empty
     * cf. http://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object and http://jsperf.com/empty-object-test
     *
     * @param {object} obj
     * @returns {boolean}
     */
    function isEmptyObj(obj) {
        for (const prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Return TRUE if the parameter is a number (or a number written as a string).
     *
     * @param {*} n
     * @returns {boolean}
     */
    function isNumber(n) {
        return !isArray(n) && !isNaN(parseFloat(n)) && isFinite(n);
    }

    /**
     * Return TRUE if the parameter is an integer (and not a float).
     *
     * @param {*} n
     * @returns {boolean}
     */
    function isInt(n) {
        return typeof n === 'number' && parseFloat(n) === parseInt(n, 10) && !isNaN(n);
    }

    /**
     * Return the pasted text that will be used.
     *
     * @param {string} text
     * @param {AutoNumericHolder} holder
     * @returns {string|void|XML|*}
     */
    function preparePastedText(text, holder) {
        return stripAllNonNumberCharacters(text, holder.settingsClone, true).replace(holder.settingsClone.decimalCharacter, '.');
    }

    /**
     * Return TRUE is the string `str` contains the string `needle`
     * Note: this function does not coerce the parameters types
     *
     * @param {string} str
     * @param {string} needle
     * @returns {boolean}
     */
    function contains(str, needle) {
        if (!isString(str) || !isString(needle) || str === '' || needle === '') {
            return false;
        }

        return str.indexOf(needle) !== -1;
    }

    /**
     * Return TRUE if the `needle` is in the array
     *
     * @param {*} needle
     * @param {Array} array
     * @returns {boolean}
     */
    function isInArray(needle, array) {
        if (!isArray(array) || array === [] || isUndefined(needle)) {
            return false;
        }

        return array.indexOf(needle) !== -1;
    }

    /**
     * Return TRUE if the parameter is an Array
     *
     * @param {*} arr
     * @throws Error
     * @returns {*|boolean}
     */
    function isArray(arr) {
        if (Object.prototype.toString.call([]) === '[object Array]') { // Make sure an array has a class attribute of [object Array]
            // Test passed, now check if is an Array
            return Array.isArray(arr) || (typeof arr === 'object' && Object.prototype.toString.call(arr) === '[object Array]');
        }
        else {
            throw new Error('toString message changed for Object Array'); // Verify that the string returned by `toString` does not change in the future (cf. http://stackoverflow.com/a/8365215)
        }
    }

    /**
     * Return TRUE if the parameter is a string that represents a float number, and that number has a decimal part
     *
     * @param {string} str
     * @returns {boolean}
     */
    // function hasDecimals(str) {
    //     const [, decimalPart] = str.split('.');
    //     return !isUndefined(decimalPart);
    // }

    /**
     * Return the number of decimal places if the parameter is a string that represents a float number, and that number has a decimal part.
     *
     * @param {string} str
     * @returns {int}
     */
    function decimalPlaces(str) {
        const [, decimalPart] = str.split('.');
        if (!isUndefined(decimalPart)) {
            return decimalPart.length;
        }

        return 0;
    }

    /**
     * Return the code for the key used to generate the given event.
     *
     * @param {Event} event
     * @returns {string|Number}
     */
    function keyCodeNumber(event) {
        // `event.keyCode` and `event.which` are deprecated, `KeyboardEvent.key` (https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) must be used now
        return (typeof event.which === 'undefined')?event.keyCode:event.which;
    }

    /**
     * Return the character from the event key code.
     * @example character(50) => '2'
     *
     * @param {Event} event
     * @returns {string}
     */
    function character(event) {
        if (typeof event.key === 'undefined' || event.key === 'Unidentified') {
            return String.fromCharCode(keyCodeNumber(event));
        } else {
            // Special case for obsolete browsers like IE that return the old names
            let result;
            switch (event.key) {
                case 'Decimal':
                    result = keyName.NumpadDot;
                    break;
                case 'Multiply':
                    result = keyName.NumpadMultiply;
                    break;
                case 'Add':
                    result = keyName.NumpadPlus;
                    break;
                case 'Subtract':
                    result = keyName.NumpadMinus;
                    break;
                case 'Divide':
                    result = keyName.NumpadSlash;
                    break;
                case 'Del':
                    // Special workaround for the obsolete browser IE11 which output a 'Delete' key when using the numpad 'dot' one! This fixes issue #401 //FIXME à terminer
                    result = keyName.Dot; // as of version 2.0.8 the character() function is only called on keypress event. The 'Del' does not throw the keypress event.
                    break;
                default:
                    result = event.key;
            }

            return result;
        }
    }

    /**
     * Return TRUE if the given value (a number as a string) is within the range set in the settings `minimumValue` and `maximumValue`, FALSE otherwise.
     *
     * @param {string} value
     * @param {object} parsedMinValue Parsed via the `parseStr()` function
     * @param {object} parsedMaxValue Parsed via the `parseStr()` function
     * @returns {boolean}
     */
    function checkIfInRange(value, parsedMinValue, parsedMaxValue) {
        const parsedValue = parseStr(value);
        return testMinMax(parsedMinValue, parsedValue) > -1 && testMinMax(parsedMaxValue, parsedValue) < 1;
    }

    /**
     * Return TRUE if the given string contains a negative sign :
     * - everywhere in the string (by default), or
     * - on the first character only if the `checkEverywhere` parameter is set to `false`.
     *
     * @param {string} numericString A number represented by a string
     * @param {boolean} checkEverywhere If TRUE, then the negative sign is search everywhere in the numeric string (this is needed for instance if the string is '1234.56-')
     * @returns {boolean}
     */
    function isNegative(numericString, checkEverywhere = true) {
        //TODO Use the `negativeSignCharacter` from the settings here
        if (checkEverywhere) {
            return contains(numericString, '-');
        }

        return isNegativeStrict(numericString);
    }

    /**
     * Return TRUE if the given string contains a negative sign on the first character (on the far left).
     *
     * @example isNegativeStrict('1234.56')     => false
     * @example isNegativeStrict('1234.56-')    => false
     * @example isNegativeStrict('-1234.56')    => true
     * @example isNegativeStrict('-1,234.56 €') => true
     *
     * @param {string} numericString
     * @returns {boolean}
     */
    function isNegativeStrict(numericString) {
        //TODO Using the `negativeSignCharacter` from the settings here
        return numericString.charAt(0) === '-';
    }

    /**
     * Return TRUE if the formatted or unformatted numeric string represent the value 0 (ie. '0,00 €'), or is empty (' €').
     * This works since we test if there are any numbers from 1 to 9 in the string. If there is none, then the number is zero (or the string is empty).
     *
     * @param {string} numericString
     * @returns {boolean}
     */
    function isZeroOrHasNoValue(numericString) {
        return !(/[1-9]/g).test(numericString);
    }

    /**
     * Return the negative version of the value (represented as a string) given as a parameter.
     *
     * @param {string} value
     * @returns {*}
     */
    function setRawNegativeSign(value) {
        if (!isNegativeStrict(value)) {
            return `-${value}`;
        }

        return value;
    }

    /**
     * Replace the character at the position `index` in the string `string` by the character(s) `newCharacter`.
     *
     * @param {string} string
     * @param {int} index
     * @param {string} newCharacter
     * @returns {string}
     */
    function replaceCharAt(string, index, newCharacter) {
        return `${string.substr(0, index)}${newCharacter}${string.substr(index + newCharacter.length)}`;
    }

    /**
     * Return the value clamped to the nearest minimum/maximum value, as defined in the settings.
     *
     * @param {string|number} value
     * @param {object} settings
     * @returns {number}
     */
    function clampToRangeLimits(value, settings) {
        //XXX This function always assume `settings.minimumValue` is lower than `settings.maximumValue`
        return Math.max(settings.minimumValue, Math.min(settings.maximumValue, value));
    }

    /**
     * Return the number of number or dot characters on the left side of the caret, in a formatted number.
     *
     * @param {string} formattedNumberString
     * @param {int} caretPosition This must be a positive integer
     * @param {string} decimalCharacter
     * @returns {number}
     */
    function countNumberCharactersOnTheCaretLeftSide(formattedNumberString, caretPosition, decimalCharacter) {
        // Here we count the dot and report it as a number character too, since it will 'stay' in the Javascript number when unformatted
        const numberDotOrNegativeSign = new RegExp(`[0-9${decimalCharacter}-]`); // No need to escape the decimal character here, since it's in `[]`

        let numberDotAndNegativeSignCount = 0;
        for (let i = 0; i < caretPosition; i++) {
            // Test if the character is a number, a dot or an hyphen. If it is, count it, otherwise ignore it
            if (numberDotOrNegativeSign.test(formattedNumberString[i])) {
                numberDotAndNegativeSignCount++;
            }
        }

        return numberDotAndNegativeSignCount;
    }

    /**
     * Walk the `formattedNumberString` from left to right, one char by one, counting the `formattedNumberStringIndex`.
     * If the char is in the `rawNumberString` (starting at index 0), then `rawNumberStringIndex++`, and continue until
     * there is no more characters in `rawNumberString`) or that `rawNumberStringIndex === caretPositionInRawValue`.
     * When you stop, the `formattedNumberStringIndex` is the position where the caret should be set.
     *
     * @example
     * 1234567|89.01   : position 7 (rawNumberString)
     * 123.456.7|89,01 : position 9 (formattedNumberString)
     *
     * @param {string} rawNumberString
     * @param {int} caretPositionInRawValue
     * @param {string} formattedNumberString
     * @param {string} decimalCharacter
     * @returns {*}
     */
    function findCaretPositionInFormattedNumber(rawNumberString, caretPositionInRawValue, formattedNumberString, decimalCharacter) {
        const formattedNumberStringSize = formattedNumberString.length;
        const rawNumberStringSize = rawNumberString.length;

        let formattedNumberStringIndex;
        let rawNumberStringIndex = 0;
        for (formattedNumberStringIndex = 0;
             formattedNumberStringIndex < formattedNumberStringSize &&
             rawNumberStringIndex < rawNumberStringSize &&
             rawNumberStringIndex < caretPositionInRawValue;
             formattedNumberStringIndex++) {
            if (rawNumberString[rawNumberStringIndex] === formattedNumberString[formattedNumberStringIndex] ||
                (rawNumberString[rawNumberStringIndex] === '.' && formattedNumberString[formattedNumberStringIndex] === decimalCharacter)) {
                rawNumberStringIndex++;
            }
        }

        return formattedNumberStringIndex;
    }

    /**
     * Count the number of occurrence of the given character, in the given text.
     *
     * @param {string} character
     * @param {string} text
     * @returns {number}
     */
    function countCharInText(character, text) {
        let charCounter = 0;
        for (let i = 0; i < text.length; i++) {
            if (text[i] === character) {
                charCounter++;
            }
        }

        return charCounter;
    }

    /**
     * Return the index that can be used to set the caret position.
     * This takes into account that the position is starting at '0', not 1.
     *
     * @param {int} characterCount
     * @returns {number}
     */
    function convertCharacterCountToIndexPosition(characterCount) {
        return Math.max(characterCount, characterCount - 1);
    }

    /**
     * Cross browser routine for getting selected range/cursor position
     *
     * @param {HTMLElement|EventTarget} that
     * @returns {{}}
     */
    function getElementSelection(that) {
        const position = {};
        if (isUndefined(that.selectionStart)) {
            that.focus();
            const select = document.selection.createRange();
            position.length = select.text.length;
            select.moveStart('character', -that.value.length);
            position.end = select.text.length;
            position.start = position.end - position.length;
        } else {
            position.start = that.selectionStart;
            position.end = that.selectionEnd;
            position.length = position.end - position.start;
        }

        return position;
    }

    /**
     * Cross browser routine for setting selected range/cursor position
     *
     * @param {HTMLElement|EventTarget} that
     * @param {int} start
     * @param {int|null} end
     */
    function setElementSelection(that, start, end = null) {
        if (isUndefinedOrNullOrEmpty(end)) {
            end = start;
        }

        if (isUndefined(that.selectionStart)) {
            that.focus();
            const range = that.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        } else {
            that.selectionStart = start;
            that.selectionEnd = end;
        }
    }

    /**
     * Function that throw error messages
     *
     * @param {string} message
     */
    function throwError(message) {
        throw new Error(message);
    }

    /**
     * Function that display a warning messages, according to the debug level.
     *
     * @param {string} message
     * @param {boolean} showWarning If FALSE, then the warning message is not displayed
     */
    function warning(message, showWarning = true) {
        if (showWarning) {
            /* eslint no-console: 0 */
            console.warn(`Warning: ${message}`);
        }
    }

    // autoNumeric-specific functions

    /**
     * Run any callbacks found in the settings object.
     * Any parameter could be a callback:
     * - a function, which invoked with jQuery element, parameters and this parameter name and returns parameter value
     * - a name of function, attached to $(selector).autoNumeric.functionName(){} - which was called previously
     * @param {object} $this jQuery-selected DOM element
     * @param {object} settings
     */
    function runCallbacksFoundInTheSettingsObject($this, settings) {
        // Loops through the settings object (option array) to find the following
        $.each(settings, (k, val) => {
            if (typeof val === 'function') {
                settings[k] = val($this, settings, k);
            } else if (typeof $this.autoNumeric[val] === 'function') {
                // Calls the attached function from the html5 data example: data-a-sign="functionName"
                settings[k] = $this.autoNumeric[val]($this, settings, k);
            }
        });
    }

    /**
     * Determine the maximum decimal length from the minimumValue and maximumValue settings
     *
     * @param {string} minimumValue
     * @param {string} maximumValue
     * @returns {number}
     */
    function maximumVMinAndVMaxDecimalLength(minimumValue, maximumValue) {
        return Math.max(decimalPlaces(minimumValue), decimalPlaces(maximumValue));
    }

    /**
     * Strip all unwanted non-number characters.
     * This keeps the numbers, the negative sign as well as the custom decimal character.
     *
     * @param {string} s
     * @param {object} settings
     * @param {boolean} leftOrAll
     * @returns {string|*}
     */
    function stripAllNonNumberCharacters(s, settings, leftOrAll) {
        //TODO This function is called 10 times (sic!) on each key input, couldn't we lower that number? cf. issue #325
        //TODO Refactor this with `convertToNumericString()` if possible?
        if (settings.currencySymbol !== '') {
            // Remove currency sign
            s = s.replace(settings.currencySymbol, '');
        }
        if (settings.suffixText) {
            // Remove suffix
            while (contains(s, settings.suffixText)) {
                s = s.replace(settings.suffixText, '');
            }
        }

        // First replace anything before digits
        s = s.replace(settings.skipFirstAutoStrip, '$1$2');

        if ((settings.negativePositiveSignPlacement === 's' ||
            (settings.currencySymbolPlacement === 's' && settings.negativePositiveSignPlacement !== 'p')) &&
            isNegative(s) &&
            s !== '') {
            settings.trailingNegative = true;
        }

        // Then replace anything after digits
        s = s.replace(settings.skipLastAutoStrip, '$1');

        // Then remove any uninteresting characters
        s = s.replace(settings.allowedAutoStrip, '');
        if (settings.decimalCharacterAlternative) {
            s = s.replace(settings.decimalCharacterAlternative, settings.decimalCharacter);
        }

        // Get only number string
        const m = s.match(settings.numRegAutoStrip);
        s = m ? [m[1], m[2], m[3]].join('') : '';

        if (settings.leadingZero === 'allow' || settings.leadingZero === 'keep') {
            let nSign = '';
            const [integerPart, decimalPart] = s.split(settings.decimalCharacter);
            let modifiedIntegerPart = integerPart;
            if (contains(modifiedIntegerPart, settings.negativeSignCharacter)) {
                nSign = settings.negativeSignCharacter;
                modifiedIntegerPart = modifiedIntegerPart.replace(settings.negativeSignCharacter, '');
            }

            // Strip leading zero on positive value if need
            if (nSign === '' && modifiedIntegerPart.length > settings.mIntPos && modifiedIntegerPart.charAt(0) === '0') {
                modifiedIntegerPart = modifiedIntegerPart.slice(1);
            }

            // Strip leading zero on negative value if need
            if (nSign !== '' && modifiedIntegerPart.length > settings.mIntNeg && modifiedIntegerPart.charAt(0) === '0') {
                modifiedIntegerPart = modifiedIntegerPart.slice(1);
            }

            s = `${nSign}${modifiedIntegerPart}${isUndefined(decimalPart)?'':settings.decimalCharacter + decimalPart}`;
        }

        if ((leftOrAll && settings.leadingZero === 'deny') ||
            (!settings.hasFocus && settings.leadingZero === 'allow')) {
            s = s.replace(settings.stripReg, '$1$2');
        }

        return s;
    }

    /**
     * Sets or removes brackets on negative values, depending on the focus state.
     * The focus state is 'stored' in the settings object under the `settings.hasFocus` attribute.
     * //TODO Use another object to keep track of internal data that are not settings
     *
     * @param {string} s
     * @param {object} settings
     * @returns {*}
     */
    function toggleNegativeBracket(s, settings) {
        if ((settings.currencySymbolPlacement === 'p' && settings.negativePositiveSignPlacement === 'l') ||
            (settings.currencySymbolPlacement === 's' && settings.negativePositiveSignPlacement === 'p')) {
            //TODO Split the first and last bracket only once during the settings initialization
            const [firstBracket, lastBracket] = settings.negativeBracketsTypeOnBlur.split(',');
            if (!settings.hasFocus) {
                // Add brackets
                s = s.replace(settings.negativeSignCharacter, '');
                s = firstBracket + s + lastBracket;
            } else if (settings.hasFocus && s.charAt(0) === firstBracket) {
                // Remove brackets
                //TODO Quid if the negative sign is not on the left, shouldn't we replace the '-' sign at the right place?
                s = s.replace(firstBracket, settings.negativeSignCharacter);
                s = s.replace(lastBracket, '');
            }
        }

        return s;
    }

    /**
     * Return a number as a numeric string that can be typecast to a Number that Javascript will understand.
     *
     * This function return the given string by stripping the currency sign (currencySymbol), the grouping separators (digitalGroupSpacing) and by replacing the decimal character (decimalCharacter) by a dot.
     * Lastly, it also put the negative sign back to its normal position if needed.
     *
     * @param {string} s
     * @param {object} settings
     * @returns {string|void|XML|*}
     */
    function convertToNumericString(s, settings) {
        // Remove the currency symbol
        s = s.replace(settings.currencySymbol, '');

        // Remove the grouping separators (thousands separators usually)
        s = s.replace(new RegExp(`[${settings.digitGroupSeparator}]`, 'g'), '');

        // Replace the decimal character by a dot
        if (settings.decimalCharacter !== '.') {
            s = s.replace(settings.decimalCharacter, '.');
        }

        // Move the trailing negative sign to the right position, if any
        if (isNegative(s) && s.lastIndexOf('-') === s.length - 1) {
            s = s.replace('-', '');
            s = '-' + s;
        }

        // Convert any arabic numbers to latin ones
        const temp = arabicToLatinNumbers(s, true, false, false);
        if (!isNaN(temp)) {
            s = temp.toString();
        }

        return s;
    }

    /**
     * Converts the ISO numeric string to the locale decimal and minus sign placement.
     * See the "outputFormat" option definition for more details.
     *
     * @param {string|null} value
     * @param {string} locale
     * @returns {*}
     */
    function toLocale(value, locale) {
        if (isNull(locale) || locale === 'string') {
            return value;
        }

        let result;
        switch (locale) {
            case 'number':
                result = Number(value);
                break;
            case '.-':
                result = isNegative(value) ? value.replace('-', '') + '-' : value;
                break;
            case ',':
            case '-,':
                result = value.replace('.', ',');
                break;
            case ',-':
                result = value.replace('.', ',');
                result = isNegative(result) ? result.replace('-', '') + '-' : result;
                break;
            // The default case
            case '.':
            case '-.':
                result = value;
                break;
            default :
                throwError(`The given outputFormat [${locale}] option is not recognized.`);
        }

        return result;
    }

    /**
     * Modify the negative sign and the decimal character of the given string value to an hyphen (-) and a dot (.) in order to make that value 'typecastable' to a real number.
     *
     * @param {string} s
     * @param {object} settings
     * @returns {string}
     */
    function modifyNegativeSignAndDecimalCharacterForRawValue(s, settings) {
        if (settings.decimalCharacter !== '.') {
            s = s.replace(settings.decimalCharacter, '.');
        }
        if (settings.negativeSignCharacter !== '-' && settings.negativeSignCharacter !== '') {
            s = s.replace(settings.negativeSignCharacter, '-');
        }
        if (!s.match(/\d/)) {
            // The default value returned by `get` is not formatted with decimals
            s += '0';
        }

        return s;
    }

    /**
     * Modify the negative sign and the decimal character to use those defined in the settings.
     *
     * @param {string} s
     * @param {object} settings
     * @returns {string}
     */
    function modifyNegativeSignAndDecimalCharacterForFormattedValue(s, settings) {
        if (settings.negativeSignCharacter !== '-' && settings.negativeSignCharacter !== '') {
            s = s.replace('-', settings.negativeSignCharacter);
        }
        if (settings.decimalCharacter !== '.') {
            s = s.replace('.', settings.decimalCharacter);
        }

        return s;
    }

    /**
     * Private function to check for empty value
     * //TODO Modify this function so that it return either TRUE or FALSE if the value is empty. Then create another function to return the input value if it's not empty.
     *
     * @param {string} inputValue
     * @param {object} settings
     * @param {boolean} signOnEmpty
     * @returns {*}
     */
    function checkEmpty(inputValue, settings, signOnEmpty) {
        if (inputValue === '' || inputValue === settings.negativeSignCharacter) {
            if (settings.emptyInputBehavior === 'always' || signOnEmpty) {
                return (settings.negativePositiveSignPlacement === 'l') ? inputValue + settings.currencySymbol + settings.suffixText : settings.currencySymbol + inputValue + settings.suffixText;
            }

            return inputValue;
        }

        return null;
    }

    /**
     * Modify the input value by adding the group separators, as defined in the settings.
     *
     * @param {string} inputValue
     * @param {object} settings
     * @returns {*}
     */
    function addGroupSeparators(inputValue, settings) {
        if (settings.strip) {
            inputValue = stripAllNonNumberCharacters(inputValue, settings, false);
        }

        //TODO This function `addGroupSeparators()` add group separators. Adding the negative sign as well is out of its scope. Move that to another function.
        if (settings.trailingNegative && !isNegative(inputValue)) {
            inputValue = '-' + inputValue;
        }

        const empty = checkEmpty(inputValue, settings, true);
        const isValueNegative = isNegative(inputValue);
        const isZero = isZeroOrHasNoValue(inputValue);
        if (isValueNegative) {
            inputValue = inputValue.replace('-', '');
        }

        if (!isNull(empty)) {
            return empty;
        }

        settings.digitalGroupSpacing = settings.digitalGroupSpacing.toString();
        let digitalGroup;
        switch (settings.digitalGroupSpacing) {
            case '2':
                digitalGroup = /(\d)((\d)(\d{2}?)+)$/;
                break;
            case '2s':
                digitalGroup = /(\d)((?:\d{2}){0,2}\d{3}(?:(?:\d{2}){2}\d{3})*?)$/;
                break;
            case '4':
                digitalGroup = /(\d)((\d{4}?)+)$/;
                break;
            default :
                digitalGroup = /(\d)((\d{3}?)+)$/;
        }

        // Splits the string at the decimal string
        let [integerPart, decimalPart] = inputValue.split(settings.decimalCharacter);
        if (settings.decimalCharacterAlternative && isUndefined(decimalPart)) {
            [integerPart, decimalPart] = inputValue.split(settings.decimalCharacterAlternative);
        }

        if (settings.digitGroupSeparator !== '') {
            // Re-inserts the thousand separator via a regular expression
            while (digitalGroup.test(integerPart)) {
                integerPart = integerPart.replace(digitalGroup, `$1${settings.digitGroupSeparator}$2`);
            }
        }

        if (settings.decimalPlacesOverride !== 0 && !isUndefined(decimalPart)) {
            if (decimalPart.length > settings.decimalPlacesOverride) {
                decimalPart = decimalPart.substring(0, settings.decimalPlacesOverride);
            }

            // Joins the whole number with the decimal value
            inputValue = integerPart + settings.decimalCharacter + decimalPart;
        } else {
            // Otherwise if it's an integer
            inputValue = integerPart;
        }

        settings.trailingNegative = false;

        if (settings.currencySymbolPlacement === 'p') {
            if (isValueNegative) {
                switch (settings.negativePositiveSignPlacement) {
                    case 'l':
                        inputValue = `${settings.negativeSignCharacter}${settings.currencySymbol}${inputValue}`;
                        break;
                    case 'r':
                        inputValue = `${settings.currencySymbol}${settings.negativeSignCharacter}${inputValue}`;
                        break;
                    case 's':
                        inputValue = `${settings.currencySymbol}${inputValue}${settings.negativeSignCharacter}`;
                        settings.trailingNegative = true;
                        break;
                    default :
                    //
                }
            } else if (settings.showPositiveSign && !isZero) {
                switch (settings.negativePositiveSignPlacement) {
                    case 'l':
                        inputValue = `${settings.positiveSignCharacter}${settings.currencySymbol}${inputValue}`;
                        break;
                    case 'r':
                        inputValue = `${settings.currencySymbol}${settings.positiveSignCharacter}${inputValue}`;
                        break;
                    case 's':
                        inputValue = `${settings.currencySymbol}${inputValue}${settings.positiveSignCharacter}`;
                        break;
                    default :
                    //
                }
            } else {
                inputValue = settings.currencySymbol + inputValue;
            }
        }

        if (settings.currencySymbolPlacement === 's') {
            if (isValueNegative) {
                switch (settings.negativePositiveSignPlacement) {
                    case 'r':
                        inputValue = `${inputValue}${settings.currencySymbol}${settings.negativeSignCharacter}`;
                        settings.trailingNegative = true;
                        break;
                    case 'l':
                        inputValue = `${inputValue}${settings.negativeSignCharacter}${settings.currencySymbol}`;
                        settings.trailingNegative = true;
                        break;
                    case 'p':
                        inputValue = `${settings.negativeSignCharacter}${inputValue}${settings.currencySymbol}`;
                        break;
                    default :
                    //
                }
            } else if (settings.showPositiveSign && !isZero) {
                switch (settings.negativePositiveSignPlacement) {
                    case 'r':
                        inputValue = `${inputValue}${settings.currencySymbol}${settings.positiveSignCharacter}`;
                        break;
                    case 'l':
                        inputValue = `${inputValue}${settings.positiveSignCharacter}${settings.currencySymbol}`;
                        break;
                    case 'p':
                        inputValue = `${settings.positiveSignCharacter}${inputValue}${settings.currencySymbol}`;
                        break;
                    default :
                    //
                }
            } else {
                inputValue = inputValue + settings.currencySymbol;
            }
        }

        // Removes the negative sign and places brackets
        if (settings.negativeBracketsTypeOnBlur !== null && (settings.rawValue < 0 || isNegativeStrict(inputValue))) {
            inputValue = toggleNegativeBracket(inputValue, settings);
        }

        return inputValue + settings.suffixText;
    }

    /**
     * Truncate not needed zeros
     *
     * @param {string} roundedInputValue
     * @param {int} temporaryDecimalPlacesOverride
     * @returns {void|XML|string|*}
     */
    function truncateZeros(roundedInputValue, temporaryDecimalPlacesOverride) {
        let regex;
        switch (temporaryDecimalPlacesOverride) {
            case 0:
                // Prevents padding - removes trailing zeros until the first significant digit is encountered
                regex = /(\.(?:\d*[1-9])?)0*$/;
                break;
            case 1:
                // Allows padding when decimalPlacesOverride equals one - leaves one zero trailing the decimal character
                regex = /(\.\d(?:\d*[1-9])?)0*$/;
                break;
            default :
                // Removes access zeros to the decimalPlacesOverride length when allowDecimalPadding is set to true
                regex = new RegExp(`(\\.\\d{${temporaryDecimalPlacesOverride}}(?:\\d*[1-9])?)0*`);
        }

        // If there are no decimal places, we don't need a decimal point at the end
        roundedInputValue = roundedInputValue.replace(regex, '$1');
        if (temporaryDecimalPlacesOverride === 0) {
            roundedInputValue = roundedInputValue.replace(/\.$/, '');
        }

        return roundedInputValue;
    }

    /**
     * Round the input value using the rounding method defined in the settings.
     * This function accepts multiple rounding methods. See the documentation for more details about those.
     *
     * Note : This is handled as text since JavaScript math function can return inaccurate values.
     *
     * @param {string} inputValue
     * @param {object} settings
     * @returns {*}
     */
    function roundValue(inputValue, settings) {
        inputValue = (inputValue === '') ? '0' : inputValue.toString();
        if (settings.roundingMethod === 'N05' || settings.roundingMethod === 'CHF' || settings.roundingMethod === 'U05' || settings.roundingMethod === 'D05') {
            switch (settings.roundingMethod) {
                case 'N05':
                    inputValue = (Math.round(inputValue * 20) / 20).toString();
                    break;
                case 'U05':
                    inputValue = (Math.ceil(inputValue * 20) / 20).toString();
                    break;
                default :
                    inputValue = (Math.floor(inputValue * 20) / 20).toString();
            }

            let result;
            if (!contains(inputValue, '.')) {
                result = inputValue + '.00';
            } else if (inputValue.length - inputValue.indexOf('.') < 3) {
                result = inputValue + '0';
            } else {
                result = inputValue;
            }
            return result;
        }

        let ivRounded = '';
        let i = 0;
        let nSign = '';
        let temporaryDecimalPlacesOverride;

        // sets the truncate zero method
        if (settings.allowDecimalPadding) {
            temporaryDecimalPlacesOverride = settings.decimalPlacesOverride;
        } else {
            temporaryDecimalPlacesOverride = 0;
        }

        // Checks if the inputValue (input Value) is a negative value
        if (isNegativeStrict(inputValue)) {
            nSign = '-';

            // Removes the negative sign that will be added back later if required
            inputValue = inputValue.replace('-', '');
        }

        // Append a zero if the first character is not a digit (then it is likely to be a dot)
        if (!inputValue.match(/^\d/)) {
            inputValue = '0' + inputValue;
        }

        // Determines if the value is equal to zero. If it is, remove the negative sign
        if (Number(inputValue) === 0) {
            nSign = '';
        }

        // Trims leading zero's as needed
        if ((Number(inputValue) > 0 && settings.leadingZero !== 'keep') || (inputValue.length > 0 && settings.leadingZero === 'allow')) {
            inputValue = inputValue.replace(/^0*(\d)/, '$1');
        }

        const dPos = inputValue.lastIndexOf('.');
        const inputValueHasADot = dPos === -1;

        // Virtual decimal position
        const vdPos = inputValueHasADot ? inputValue.length - 1 : dPos;

        // Checks decimal places to determine if rounding is required :
        // Check if no rounding is required
        let cDec = (inputValue.length - 1) - vdPos;

        if (cDec <= settings.decimalPlacesOverride) {
            // Check if we need to pad with zeros
            ivRounded = inputValue;
            if (cDec < temporaryDecimalPlacesOverride) {
                if (inputValueHasADot) {
                    ivRounded += settings.decimalCharacter;
                }

                let zeros = '000000';
                while (cDec < temporaryDecimalPlacesOverride) {
                    zeros = zeros.substring(0, temporaryDecimalPlacesOverride - cDec);
                    ivRounded += zeros;
                    cDec += zeros.length;
                }
            } else if (cDec > temporaryDecimalPlacesOverride) {
                ivRounded = truncateZeros(ivRounded, temporaryDecimalPlacesOverride);
            } else if (cDec === 0 && temporaryDecimalPlacesOverride === 0) {
                ivRounded = ivRounded.replace(/\.$/, '');
            }

            return (Number(ivRounded) === 0) ? ivRounded : nSign + ivRounded;
        }

        // Rounded length of the string after rounding
        let rLength;
        if (inputValueHasADot) {
            rLength = settings.decimalPlacesOverride - 1;
        } else {
            rLength = settings.decimalPlacesOverride + dPos;
        }

        const tRound = Number(inputValue.charAt(rLength + 1));
        const odd = (inputValue.charAt(rLength) === '.') ? (inputValue.charAt(rLength - 1) % 2) : (inputValue.charAt(rLength) % 2);
        let ivArray = inputValue.substring(0, rLength + 1).split('');

        if ((tRound > 4 && settings.roundingMethod === 'S')                  || // Round half up symmetric
            (tRound > 4 && settings.roundingMethod === 'A' && nSign === '')  || // Round half up asymmetric positive values
            (tRound > 5 && settings.roundingMethod === 'A' && nSign === '-') || // Round half up asymmetric negative values
            (tRound > 5 && settings.roundingMethod === 's')                  || // Round half down symmetric
            (tRound > 5 && settings.roundingMethod === 'a' && nSign === '')  || // Round half down asymmetric positive values
            (tRound > 4 && settings.roundingMethod === 'a' && nSign === '-') || // Round half down asymmetric negative values
            (tRound > 5 && settings.roundingMethod === 'B')                  || // Round half even "Banker's Rounding"
            (tRound === 5 && settings.roundingMethod === 'B' && odd === 1)   || // Round half even "Banker's Rounding"
            (tRound > 0 && settings.roundingMethod === 'C' && nSign === '')  || // Round to ceiling toward positive infinite
            (tRound > 0 && settings.roundingMethod === 'F' && nSign === '-') || // Round to floor toward negative infinite
            (tRound > 0 && settings.roundingMethod === 'U')) {                  // Round up away from zero
            // Round up the last digit if required, and continue until no more 9's are found
            for (i = (ivArray.length - 1); i >= 0; i -= 1) {
                if (ivArray[i] !== '.') {
                    ivArray[i] = +ivArray[i] + 1;
                    if (ivArray[i] < 10) {
                        break;
                    }

                    if (i > 0) {
                        ivArray[i] = '0';
                    }
                }
            }
        }

        // Reconstruct the string, converting any 10's to 0's
        ivArray = ivArray.slice(0, rLength + 1);

        // Return the rounded value
        ivRounded = truncateZeros(ivArray.join(''), temporaryDecimalPlacesOverride);

        return (Number(ivRounded) === 0) ? ivRounded : nSign + ivRounded;
    }

    /**
     * Truncates the decimal part of a number.
     *
     * @param {string} s
     * @param {object} settings
     * @param {boolean} isPaste
     * @returns {*}
     */
    function truncateDecimal(s, settings, isPaste) {
        s = (isPaste) ? roundValue(s, settings) : s;

        if (settings.decimalCharacter && settings.decimalPlacesOverride) {
            const [integerPart, decimalPart] = s.split(settings.decimalCharacter);

            // truncate decimal part to satisfying length since we would round it anyway
            if (decimalPart && decimalPart.length > settings.decimalPlacesOverride) {
                if (settings.decimalPlacesOverride > 0) {
                    const modifiedDecimalPart = decimalPart.substring(0, settings.decimalPlacesOverride);
                    s = `${integerPart}${settings.decimalCharacter}${modifiedDecimalPart}`;
                } else {
                    s = integerPart;
                }
            }
        }

        return s;
    }

    /**
     * Function to parse minimumValue, maximumValue & the input value to prepare for testing to determine if the value falls within the min / max range.
     * Return an object example: minimumValue: "999999999999999.99" returns the following "{s: -1, e: 12, c: Array[15]}".
     *
     * This function is adapted from Big.js https://github.com/MikeMcl/big.js/. Many thanks to Mike.
     *
     * @param {number|string} n A numeric value.
     * @returns {{}}
     */
    function parseStr(n) {
        const x = {}; // A Big number instance.
        let e;
        let i;
        let nL;
        let j;

        // Minus zero?
        if (n === 0 && 1 / n < 0) {
            n = '-0';
        }

        // Determine sign. 1 positive, -1 negative
        n = n.toString();
        if (isNegativeStrict(n)) {
            n = n.slice(1);
            x.s = -1;
        } else {
            x.s = 1;
        }

        // Decimal point?
        e = n.indexOf('.');
        if (e > -1) {
            n = n.replace('.', '');
        }

        // length of string if no decimal character
        if (e < 0) {
            // Integer
            e = n.length;
        }

        // Determine leading zeros
        i = (n.search(/[1-9]/i) === -1) ? n.length : n.search(/[1-9]/i);
        nL = n.length;
        if (i === nL) {
            // Zero
            x.e = 0;
            x.c = [0];
        } else {
            // Determine trailing zeros
            for (j = nL - 1; n.charAt(j) === '0'; j -= 1) {
                nL -= 1;
            }
            nL -= 1;

            // Decimal location
            x.e = e - i - 1;
            x.c = [];

            // Convert string to array of digits without leading/trailing zeros
            for (e = 0; i <= nL; i += 1) {
                x.c[e] = +n.charAt(i);
                e += 1;
            }
        }

        return x;
    }

    /**
     * Function to test if the input value falls with the Min / Max settings.
     * This uses the parsed strings for the above parseStr function.
     *
     * This function is adapted from Big.js https://github.com/MikeMcl/big.js/. Many thanks to Mike.
     *
     * @param {object} y Big number instance
     * @param {object} x Big number instance
     * @returns {*}
     */
    function testMinMax(y, x) {
        const xc = x.c;
        const yc = y.c;
        let i = x.s;
        let j = y.s;
        let k = x.e;
        let l = y.e;

        // Either zero?
        if (!xc[0] || !yc[0]) {
            let result;
            if (!xc[0]) {
                result = !yc[0]?0:-j;
            } else {
                result = i;
            }
            return result;
        }

        // Signs differ?
        if (i !== j) {
            return i;
        }
        const xNeg = i < 0;

        // Compare exponents
        if (k !== l) {
            return (k > l ^ xNeg)?1:-1;
        }
        i = -1;
        k = xc.length;
        l = yc.length;
        j = (k < l) ? k : l;

        // Compare digit by digit
        for (i += 1; i < j; i += 1) {
            if (xc[i] !== yc[i]) {
                return (xc[i] > yc[i] ^ xNeg)?1:-1;
            }
        }

        // Compare lengths
        let result;
        if (k === l) {
            result = 0;
        } else {
            result = (k > l ^ xNeg)?1:-1;
        }

        return result;
    }

    /**
     * Check that the number satisfy the format conditions
     * and lays between settings.minimumValue and settings.maximumValue
     * and the string length does not exceed the digits in settings.minimumValue and settings.maximumValue
     *
     * @param {string} s
     * @param {object} settings
     * @returns {*}
     */
    function checkIfInRangeWithOverrideOption(s, settings) {
        s = s.toString();
        s = s.replace(',', '.');
        const minParse = parseStr(settings.minimumValue);
        const maxParse = parseStr(settings.maximumValue);
        const valParse = parseStr(s);

        let result;
        switch (settings.overrideMinMaxLimits) {
            case 'floor':
                result = [testMinMax(minParse, valParse) > -1, true];
                break;
            case 'ceiling':
                result = [true, testMinMax(maxParse, valParse) < 1];
                break;
            case 'ignore':
                result = [true, true];
                break;
            default:
                result = [testMinMax(minParse, valParse) > -1, testMinMax(maxParse, valParse) < 1];
        }

        return result;
    }

    /**
     * Thanks to Anthony & Evan C
     *
     * @param {Element|string} element
     * @returns {*|jQuery|HTMLElement}
     */
    function getCurrentElement(element) {
        /*
         * If the parameter is a string (and therefore is a CSS selector), then we need to modify this string in order
         * for jQuery to be able to parse the selector correctly.
         * cf. http://learn.jquery.com/using-jquery-core/faq/how-do-i-select-an-element-by-an-id-that-has-characters-used-in-css-notation/
         */
        if (isString(element)) {
            //TODO This block is apparently never entered. We should remove it after making sure that's 100% the case
            element = `#${element.replace(/(:|\.|\[|]|,|=)/g, '\\$1')}`;
        }

        return $(element);
    }

    /**
     * Function that attach the autoNumeric field properties to the DOM element via an AutoNumericHolder object.
     *
     * @param {object} $this jQuery-selected DOM element
     * @param {object} settings
     * @param {boolean} update
     * @returns {*}
     */
    function getAutoNumericHolder($this, settings, update = false) {
        let data = $this.data('autoNumeric');
        if (!data) {
            data = {};
            $this.data('autoNumeric', data);
        }

        let holder = data.holder;
        if (update || (isUndefined(holder) && settings)) {
            holder = new AutoNumericHolder($this.get(0), settings);
            data.holder = holder;
        }

        return holder;
    }

    /**
     * Original settings saved for use when decimalPlacesShownOnFocus & noSeparatorOnFocus options are being used.
     * Those original settings are used exclusively in the `focusin` and `focusout` event handlers.
     *
     * @param {object} settings
     */
    function keepAnOriginalSettingsCopy(settings) {
        //TODO Rename the old option names to the new ones
        settings.oDec     = settings.decimalPlacesOverride;
        settings.oPad     = settings.allowDecimalPadding;
        settings.oBracket = settings.negativeBracketsTypeOnBlur;
        settings.oSep     = settings.digitGroupSeparator;
        settings.oSign    = settings.currencySymbol;
        settings.oSuffix  = settings.suffixText;
    }

    /**
     * Original settings saved for use when `decimalPlacesShownOnFocus` & `noSeparatorOnFocus` options are being used.
     * This is taken from Quirksmode.
     *
     * @param {string} name
     * @returns {*}
     */
    function readCookie(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        let c = '';
        for (let i = 0; i < ca.length; i += 1) {
            c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }

        return null;
    }

    /**
     * Test if sessionStorage is supported.
     * This is taken from Modernizr.
     *
     * @returns {boolean}
     */
    function storageTest() {
        const mod = 'modernizr';
        try {
            sessionStorage.setItem(mod, mod);
            sessionStorage.removeItem(mod);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * properly formats the string to a numeric when leadingZero does not 'keep'.
     *
     * @param {string} value
     * @param {object} settings
     * @returns {string}
     */
    function cleanLeadingTrailingZeros(value, settings) {
        // Return the empty string is the value is already empty. This prevent converting that value to '0'.
        if (value === '') {
            return '';
        }

        // Return '0' if the value is zero
        if (Number(value) === 0 && settings.leadingZero !== 'keep') {
            return '0';
        }

        if (settings.leadingZero !== 'keep') {
            // Trim leading zero's - leaves one zero to the left of the decimal point
            value = value.replace(/^(-)?0+(?=\d)/g,'$1');

            //TODO remove this from that function and use `trimPaddedZerosFromDecimalPlaces()` instead. Also create a new `trailingZero` option.
            if (contains(value, '.')) {
                // Trims trailing zeros after the decimal point
                value = value.replace(/(\.[0-9]*?)0+$/, '$1');
            }
        }
        // Strips trailing decimal point
        value = value.replace(/\.$/, '');

        return value;
    }

    /**
     * Remove the trailing zeros in the decimal part of a number.
     *
     * @param {string} numericString
     * @returns {*}
     */
    function trimPaddedZerosFromDecimalPlaces(numericString) {
        const [integerPart, decimalPart] = numericString.split('.');
        if (isUndefinedOrNullOrEmpty(decimalPart)) {
            return integerPart;
        }

        const trimmedDecimalPart = decimalPart.replace(/0+$/g, '');

        let result;
        if (trimmedDecimalPart === '') {
            result = integerPart;
        } else {
            result = `${integerPart}.${trimmedDecimalPart}`;
        }

        return result;
    }

    /**
     * Creates or removes sessionStorage or cookie depending on what the browser is supporting.
     *
     * @param {Element|EventTarget} element
     * @param {object} settings
     * @param {string} action
     * @returns {*}
     */
    function saveValueToPersistentStorage(element, settings, action) {
        if (settings.saveValueToSessionStorage) {
            const storedName = (element.name !== '' && !isUndefined(element.name)) ?`AUTO_${decodeURIComponent(element.name)}` :`AUTO_${element.id}`;
            let date;
            let expires;

            // Sets cookie for browser that do not support sessionStorage IE 6 & IE 7
            if (storageTest() === false) {
                switch (action) {
                    case 'set':
                        document.cookie = `${storedName}=${settings.rawValue}; expires= ; path=/`;
                        break;
                    case 'wipe':
                        date = new Date();
                        date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));
                        expires = '; expires=' + date.toUTCString(); // Note : `toGMTString()` has been deprecated (cf. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toGMTString)
                        document.cookie = `${storedName}='' ;${expires}; path=/`;
                        break;
                    case 'get':
                        return readCookie(storedName);
                }
            } else {
                switch (action) {
                    case 'set':
                        sessionStorage.setItem(storedName, settings.rawValue);
                        break;
                    case 'wipe':
                        sessionStorage.removeItem(storedName);
                        break;
                    case 'get':
                        return sessionStorage.getItem(storedName);
                }
            }
        }
    }

    /**
     * Holder object for field properties
     */
    class AutoNumericHolder {
        /**
         * Class constructor
         *
         * @param {HTMLElement} that - A reference to the current DOM element
         * @param {object} settings
         */
        constructor(that, settings) {
            this.settings = settings;
            this.that = that;
            this.$that = $(that);
            this.formatted = false;
            this.settingsClone = settings;
            this.value = that.value;
        }

        /**
         * Update the value and the selection values inside the AutoNumericHolder object.
         * This keeps tracks of the input value, as well as the current selection.
         * This also resets the 'processed' and 'formatted' state.
         *
         * Note : Those two can change between the keydown, keypress and keyup events, that's why
         *        this function is called on each event handler.
         *
         * @private
         */
        _updateAutoNumericHolderProperties() {
            this.value = this.that.value;
            this.selection = getElementSelection(this.that);
            this.processed = false;
            this.formatted = false;
        }

        /**
         * Update the keycode of the key that triggered the given event.
         * Note : e.which is sometimes different than e.keyCode during the keypress event, when entering a printable character key (ie. 't'). `e.which` equals 0 for non-printable characters.
         *
         * //TODO Switch to the non-deprecated e.key attribute, instead of inconsistant e.which and e.keyCode.
         * e.key describe the key name used to trigger the event.
         * e.keyCode being deprecated : https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
         * How e.key works : https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
         * The key list is described here
         * @link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
         *
         * @param {Event} e
         * @private
         */
        _updateAutoNumericHolderEventKeycode(e) {
            // Note: the keypress event overwrites meaningful value of e.keyCode, hence we do not update that value on 'keypress'
            this.eventKeyCode = keyCodeNumber(e);
        }

        /**
         * Set the text selection inside the input with the given start and end position.
         *
         * @param {int} start
         * @param {int} end
         * @param {undefined|boolean} setReal
         * @private
         */
        _setSelection(start, end, setReal) {
            //TODO Modify setReal to be more explicit (and a boolean)
            start = Math.max(start, 0);
            end = Math.min(end, this.that.value.length); //TODO Replace `this.that.value.length` with `this.value.length`
            this.selection = {
                start,
                end,
                length: end - start,
            };

            if (isUndefined(setReal) || setReal) {
                setElementSelection(this.that, start, end);
            }
        }

        /**
         * Set the caret position inside the input at the given position.
         *
         * @param {int} pos
         * @param {undefined|boolean} setReal
         * @private
         */
        _setCaretPosition(pos, setReal) {
            //TODO Modify setReal to be more explicit (and a boolean)
            this._setSelection(pos, pos, setReal);
        }

        /**
         * Return an array containing the string parts located on the left and right side of the caret or selection.
         * Those parts are left 'untouched', ie. formatted by autoNumeric.
         *
         * @returns {[string, string]} The parts on the left and right of the caret or selection
         * @private
         */
        _getLeftAndRightPartAroundTheSelection() {
            const value = this.value;
            const left = value.substring(0, this.selection.start);
            const right = value.substring(this.selection.end, value.length);

            return [left, right];
        }

        /**
         * Return an array containing the string parts located on the left and right side of the caret or selection.
         * Those parts are unformatted (stripped) of any non-numbers characters.
         *
         * @returns {[string, string]} The parts on the left and right of the caret or selection, unformatted.
         * @private
         */
        _getUnformattedLeftAndRightPartAroundTheSelection() {
            const settingsClone = this.settingsClone;
            let [left, right] = this._getLeftAndRightPartAroundTheSelection();
            if (left === '' && right === '') {
                settingsClone.trailingNegative = false;
            }
            // if changing the sign and left is equal to the number zero - prevents stripping the leading zeros
            let stripZeros = true;
            if (this.eventKeyCode === keyCode.Hyphen && Number(left) === 0) {
                stripZeros = false;
            }
            left = stripAllNonNumberCharacters(left, this.settingsClone, stripZeros);
            right = stripAllNonNumberCharacters(right, this.settingsClone, false);

            if (settingsClone.trailingNegative && !isNegative(left)) {
                left = '-' + left;
                right = (right === '-') ? '' : right;
                settingsClone.trailingNegative = false;
            }

            return [left, right];
        }

        /**
         * Strip parts from excess characters and leading zeros.
         *
         * @param {string} left
         * @param {string} right
         * @returns {[*,*]}
         * @private
         */
        _normalizeParts(left, right) {
            const settingsClone = this.settingsClone;

            // if changing the sign and left is equal to the number zero - prevents stripping the leading zeros
            let stripZeros = true;
            if (this.eventKeyCode === keyCode.Hyphen && Number(left) === 0) {
                stripZeros = false;
            }
            left = stripAllNonNumberCharacters(left, settingsClone, stripZeros);

            // If right is not empty and first character is not decimalCharacter
            right = stripAllNonNumberCharacters(right, settingsClone, false);

            // Prevents multiple leading zeros from being entered
            if (settingsClone.leadingZero === 'deny' &&
                (this.eventKeyCode === keyCode.num0 || this.eventKeyCode === keyCode.numpad0) &&
                Number(left) === 0 &&
                !contains(left, settingsClone.decimalCharacter)  && right !== '') {
                left = left.substring(0, left.length - 1);
            }

            if (settingsClone.trailingNegative && !isNegative(left)) {
                left = '-' + left;
                settingsClone.trailingNegative = false;
            }

            // Insert zero if has leading dot
            this.newValue = left + right;
            if (settingsClone.decimalCharacter) {
                const m = this.newValue.match(new RegExp(`^${settingsClone.aNegRegAutoStrip}\\${settingsClone.decimalCharacter}`));
                if (m) {
                    left = left.replace(m[1], m[1] + '0');
                    this.newValue = left + right;
                }
            }

            return [left, right];
        }

        /**
         * Set part of number to value while keeping the cursor position. //TODO What about the cursor selection?
         *
         * @param {string} left
         * @param {string} right
         * @param {boolean} isPaste
         * @returns {boolean}
         * @private
         */
        _setValueParts(left, right, isPaste = false) {
            const settingsClone = this.settingsClone;
            const parts = this._normalizeParts(left, right);
            const [minTest, maxTest] = checkIfInRangeWithOverrideOption(this.newValue, settingsClone);
            let position = parts[0].length;
            this.newValue = parts.join('');

            if (minTest && maxTest) {
                this.newValue = truncateDecimal(this.newValue, settingsClone, isPaste);
                //TODO Check if we need to replace the hard-coded ',' with settings.decimalCharacter
                const testValue = (contains(this.newValue, ',')) ? this.newValue.replace(',', '.') : this.newValue;
                if (testValue === '' || testValue === settingsClone.negativeSignCharacter) {
                    settingsClone.rawValue = (settingsClone.emptyInputBehavior === 'zero') ? '0' : '';
                } else {
                    settingsClone.rawValue = cleanLeadingTrailingZeros(testValue, settingsClone);
                }

                if (position > this.newValue.length) {
                    position = this.newValue.length;
                }

                // Make sure when the user enter a '0' on the far left with a leading zero option set to 'deny', that the caret does not moves since the input is dropped (fix issue #283)
                if (position === 1 && parts[0] === '0' && settingsClone.leadingZero === 'deny') {
                    // If the user enter `0`, then the caret is put on the right side of it (Fix issue #299)
                    if (parts[1] === '' || parts[0] === '0' && parts[1] !== '') {
                        position = 1;
                    } else {
                        position = 0;
                    }
                }

                this.value = this.newValue;
                this._setCaretPosition(position, false);

                return true;
            }

            if (!minTest) {
                this.$that.trigger('autoNumeric:minExceeded');
            } else if (!maxTest) {
                this.$that.trigger('autoNumeric:maxExceeded');
            }

            return false;
        }

        /**
         * Helper function for `_expandSelectionOnSign()`.
         *
         * @returns {*} Sign position of a formatted value
         * @private
         */
        _getSignPosition() {
            const settingsClone = this.settingsClone;
            const currencySymbol = settingsClone.currencySymbol;
            const that = this.that;

            if (currencySymbol) {
                const currencySymbolLen = currencySymbol.length;
                if (settingsClone.currencySymbolPlacement === 'p') {
                    const hasNeg = settingsClone.negativeSignCharacter && that.value && that.value.charAt(0) === settingsClone.negativeSignCharacter;
                    return hasNeg ? [1, currencySymbolLen + 1] : [0, currencySymbolLen];
                }
                const valueLen = that.value.length;
                return [valueLen - currencySymbolLen, valueLen];
            }

            return [1000, -1];
        }

        /**
         * Expands selection to cover whole sign
         * Prevents partial deletion/copying/overwriting of a sign
         *
         * @param {undefined|boolean} setReal
         * @private
         */
        _expandSelectionOnSign(setReal) {
            //TODO Modify setReal to be more explicit (and a boolean only)
            //TODO Use array destructuring here to set signPosition to more explicit variables
            const signPosition = this._getSignPosition();
            const selection = this.selection;

            // If selection catches something except sign and catches only space from sign
            if (selection.start < signPosition[1] && selection.end > signPosition[0]) {
                // Then select without empty space
                if ((selection.start < signPosition[0] || selection.end > signPosition[1]) && this.value.substring(Math.max(selection.start, signPosition[0]), Math.min(selection.end, signPosition[1])).match(/^\s*$/)) {
                    if (selection.start < signPosition[0]) {
                        this._setSelection(selection.start, signPosition[0], setReal);
                    } else {
                        this._setSelection(signPosition[1], selection.end, setReal);
                    }
                } else {
                    // Else select with whole sign
                    this._setSelection(Math.min(selection.start, signPosition[0]), Math.max(selection.end, signPosition[1]), setReal);
                }
            }
        }

        /**
         * Try to strip pasted value to digits
         */
        _checkPaste() {
            if (!isUndefined(this.valuePartsBeforePaste)) {
                const oldParts = this.valuePartsBeforePaste;
                const [left, right] = this._getLeftAndRightPartAroundTheSelection();

                // Try to strip the pasted value first
                delete this.valuePartsBeforePaste;

                const modifiedLeftPart = left.substr(0, oldParts[0].length) + stripAllNonNumberCharacters(left.substr(oldParts[0].length), this.settingsClone, true);
                if (!this._setValueParts(modifiedLeftPart, right, true)) {
                    this.value = oldParts.join('');
                    this._setCaretPosition(oldParts[0].length, false);
                }
            }
        }

        /**
         * Process pasting, cursor moving and skipping of not interesting keys.
         * If this function returns TRUE, then further processing is not performed.
         *
         * @param {Event} e
         * @returns {boolean}
         * @private
         */
        _skipAlways(e) {
            // Catch the ctrl up on ctrl-v
            if (((e.ctrlKey || e.metaKey) && e.type === 'keyup' && !isUndefined(this.valuePartsBeforePaste)) || (e.shiftKey && this.eventKeyCode === keyCode.Insert)) {
                //TODO Move this test inside the `onKeyup` handler
                this._checkPaste();
                return false;
            }

            // Skip all function keys (F1-F12), Windows keys, tab and other special keys
            if ((this.eventKeyCode >= keyCode.F1 && this.eventKeyCode <= keyCode.F12) ||
                (this.eventKeyCode >= keyCode.Windows && this.eventKeyCode <= keyCode.RightClick) ||
                (this.eventKeyCode >= keyCode.Tab && this.eventKeyCode < keyCode.Space) ||
                // `e.which` is sometimes different than `this.eventKeyCode` during the keypress event when entering a printable character key (ie. 't'). Also, `e.which` equals 0 for non-printable characters.
                (this.eventKeyCode < keyCode.Backspace &&
                (e.which === 0 || e.which === this.eventKeyCode)) ||
                this.eventKeyCode === keyCode.NumLock ||
                this.eventKeyCode === keyCode.ScrollLock ||
                this.eventKeyCode === keyCode.Insert ||
                this.eventKeyCode === keyCode.Command) {
                return true;
            }

            // If a "Select all" keyboard shortcut is detected (ctrl + a)
            if ((e.ctrlKey || e.metaKey) && this.eventKeyCode === keyCode.a) {
                if (this.settings.selectNumberOnly) {
                    // `preventDefault()` is used here to prevent the browser to first select all the input text (including the currency sign), otherwise we would see that whole selection first in a flash, then the selection with only the number part without the currency sign.
                    e.preventDefault();
                    const valueLen = this.that.value.length;
                    const currencySymbolLen = this.settings.currencySymbol.length;
                    const negLen = (!isNegative(this.that.value))?0:1;
                    const suffixTextLen = this.settings.suffixText.length;
                    const currencySymbolPlacement = this.settings.currencySymbolPlacement;
                    const negativePositiveSignPlacement = this.settings.negativePositiveSignPlacement;

                    let start;
                    if (currencySymbolPlacement === 's') {
                        start = 0;
                    } else {
                        start = (negativePositiveSignPlacement === 'l' && negLen === 1 && currencySymbolLen > 0)?currencySymbolLen + 1:currencySymbolLen;
                    }

                    let end;
                    if (currencySymbolPlacement === 'p') {
                        end = valueLen - suffixTextLen;
                    } else {
                        switch (negativePositiveSignPlacement) {
                            case 'l':
                                end = valueLen - (suffixTextLen + currencySymbolLen);
                                break;
                            case 'r':
                                end = (currencySymbolLen > 0)?valueLen - (currencySymbolLen + negLen + suffixTextLen):valueLen - (currencySymbolLen + suffixTextLen);
                                break;
                            default :
                                end = valueLen - (currencySymbolLen + suffixTextLen);
                        }
                    }

                    setElementSelection(this.that, start, end);
                }

                return true;
            }

            // If a "Copy", "Paste" or "Cut" keyboard shortcut is detected (respectively 'ctrl + c', 'ctrl + v' or 'ctrl + x')
            if ((e.ctrlKey || e.metaKey) && (this.eventKeyCode === keyCode.c || this.eventKeyCode === keyCode.v || this.eventKeyCode === keyCode.x)) {
                if (e.type === 'keydown') {
                    this._expandSelectionOnSign();
                }

                // Try to prevent wrong paste
                if (this.eventKeyCode === keyCode.v || this.eventKeyCode === keyCode.Insert) {
                    if (e.type === 'keydown' || e.type === 'keypress') {
                        if (isUndefined(this.valuePartsBeforePaste)) {
                            this.valuePartsBeforePaste = this._getLeftAndRightPartAroundTheSelection();
                        }
                    } else {
                        this._checkPaste();
                    }
                }

                return e.type === 'keydown' || e.type === 'keypress' || this.eventKeyCode === keyCode.c;
            }

            if (e.ctrlKey || e.metaKey) {
                return true;
            }

            // Jump over thousand separator
            //TODO Move this test inside the `onKeydown` handler
            if (this.eventKeyCode === keyCode.LeftArrow || this.eventKeyCode === keyCode.RightArrow) {
                if (e.type === 'keydown' && !e.shiftKey) {
                    if (this.eventKeyCode === keyCode.LeftArrow &&
                        (this.that.value.charAt(this.selection.start - 2) === this.settingsClone.digitGroupSeparator ||
                        this.that.value.charAt(this.selection.start - 2) === this.settingsClone.decimalCharacter)) {
                        this._setCaretPosition(this.selection.start - 1);
                    } else if (this.eventKeyCode === keyCode.RightArrow &&
                        (this.that.value.charAt(this.selection.start + 1) === this.settingsClone.digitGroupSeparator ||
                        this.that.value.charAt(this.selection.start + 1) === this.settingsClone.decimalCharacter)) {
                        this._setCaretPosition(this.selection.start + 1);
                    }
                }
                return true;
            }

            return this.eventKeyCode >= keyCode.PageDown && this.eventKeyCode <= keyCode.DownArrow;
        }

        /**
         * Process deletion of characters when the minus sign is to the right of the numeric characters.
         *
         * @param {string} left The part on the left of the caret or selection
         * @param {string} right The part on the right of the caret or selection
         * @returns {[string, string]}
         * @private
         */
        _processCharacterDeletionIfTrailingNegativeSign([left, right]) {
            const settingsClone = this.settingsClone;
            if (settingsClone.currencySymbolPlacement === 'p' && settingsClone.negativePositiveSignPlacement === 's') {
                if (this.eventKeyCode === keyCode.Backspace) {
                    settingsClone.caretFix = (this.selection.start >= this.value.indexOf(settingsClone.suffixText) && settingsClone.suffixText !== '');
                    if (this.value.charAt(this.selection.start - 1) === '-') {
                        left = left.substring(1);
                    } else if (this.selection.start <= this.value.length - settingsClone.suffixText.length) {
                        left = left.substring(0, left.length - 1);
                    }
                } else {
                    settingsClone.caretFix = (this.selection.start >= this.value.indexOf(settingsClone.suffixText) && settingsClone.suffixText !== '');
                    if (this.selection.start >= this.value.indexOf(settingsClone.currencySymbol) + settingsClone.currencySymbol.length) {
                        right = right.substring(1, right.length);
                    }
                    if (isNegative(left) && this.value.charAt(this.selection.start) === '-') {
                        left = left.substring(1);
                    }
                }
            }

            //TODO Merge the two following 'if' blocks into one `if (settingsClone.currencySymbolPlacement === 's') {` and a switch on settingsClone.negativePositiveSignPlacement
            if (settingsClone.currencySymbolPlacement === 's' && settingsClone.negativePositiveSignPlacement === 'l') {
                settingsClone.caretFix = (this.selection.start >= this.value.indexOf(settingsClone.negativeSignCharacter) + settingsClone.negativeSignCharacter.length);
                if (this.eventKeyCode === keyCode.Backspace) {
                    if (this.selection.start === (this.value.indexOf(settingsClone.negativeSignCharacter) + settingsClone.negativeSignCharacter.length) && contains(this.value, settingsClone.negativeSignCharacter)) {
                        left = left.substring(1);
                    } else if (left !== '-' && ((this.selection.start <= this.value.indexOf(settingsClone.negativeSignCharacter)) || !contains(this.value, settingsClone.negativeSignCharacter))) {
                        left = left.substring(0, left.length - 1);
                    }
                } else {
                    if (left[0] === '-') {
                        right = right.substring(1);
                    }
                    if (this.selection.start === this.value.indexOf(settingsClone.negativeSignCharacter) && contains(this.value, settingsClone.negativeSignCharacter)) {
                        left = left.substring(1);
                    }
                }
            }

            if (settingsClone.currencySymbolPlacement === 's' && settingsClone.negativePositiveSignPlacement === 'r') {
                settingsClone.caretFix = (this.selection.start >= this.value.indexOf(settingsClone.negativeSignCharacter) + settingsClone.negativeSignCharacter.length);
                if (this.eventKeyCode === keyCode.Backspace) {
                    if (this.selection.start === (this.value.indexOf(settingsClone.negativeSignCharacter) + settingsClone.negativeSignCharacter.length)) {
                        left = left.substring(1);
                    } else if (left !== '-' && this.selection.start <= (this.value.indexOf(settingsClone.negativeSignCharacter) - settingsClone.currencySymbol.length)) {
                        left = left.substring(0, left.length - 1);
                    } else if (left !== '' && !contains(this.value, settingsClone.negativeSignCharacter)) {
                        left = left.substring(0, left.length - 1);
                    }
                } else {
                    settingsClone.caretFix = (this.selection.start >= this.value.indexOf(settingsClone.currencySymbol) && settingsClone.currencySymbol !== '');
                    if (this.selection.start === this.value.indexOf(settingsClone.negativeSignCharacter)) {
                        left = left.substring(1);
                    }
                    right = right.substring(1);
                }
            }

            return [left, right];
        }

        /**
         * Process the deletion of characters.
         */
        _processCharacterDeletion() {
            const settingsClone = this.settingsClone;

            let left;
            let right;

            if (!this.selection.length) {
                [left, right] = this._getUnformattedLeftAndRightPartAroundTheSelection();
                if (left === '' && right === '') {
                    settingsClone.throwInput = false;
                }

                if (((settingsClone.currencySymbolPlacement === 'p' && settingsClone.negativePositiveSignPlacement === 's') ||
                    (settingsClone.currencySymbolPlacement === 's' && (settingsClone.negativePositiveSignPlacement === 'l' || settingsClone.negativePositiveSignPlacement === 'r'))) &&
                    isNegative(this.value)) { //TODO Change `this.value` to `this.that.value`?
                    [left, right] = this._processCharacterDeletionIfTrailingNegativeSign([left, right]);
                } else {
                    if (this.eventKeyCode === keyCode.Backspace) {
                        left = left.substring(0, left.length - 1);
                    } else {
                        right = right.substring(1, right.length);
                    }
                }
            } else {
                this._expandSelectionOnSign(false);
                [left, right] = this._getUnformattedLeftAndRightPartAroundTheSelection();
            }

            this._setValueParts(left, right);
        }

        /**
         * This function decides if the key pressed should be dropped or accepted, and modify the value 'on-the-fly' accordingly.
         * Returns TRUE if the keycode is allowed.
         * This functions also modify the value on-the-fly. //FIXME This should use another function in order to separate the test and the modification
         *
         * @param {Event|string} eventOrChar The event object, or the character entered (from an android device)
         * @returns {boolean}
         */
        _processCharacterInsertion(eventOrChar) {
            const settingsClone = this.settingsClone;
            let [left, right] = this._getUnformattedLeftAndRightPartAroundTheSelection();

            let eventCharacter;
            if (isString(eventOrChar)) {
                // Android browsers
                eventCharacter = eventOrChar;
            } else {
                // Normal browsers
                settingsClone.throwInput = true;

                // Retrieve the real character that has been entered (ie. 'a' instead of the key code)
                eventCharacter = character(eventOrChar);
            }

            // Start rules when the decimal character key is pressed always use numeric pad dot to insert decimal separator
            // Do not allow decimal character if no decimal part allowed
            if (eventCharacter === settingsClone.decimalCharacter ||
                (settingsClone.decimalCharacterAlternative && eventCharacter === settingsClone.decimalCharacterAlternative) ||
                ((eventCharacter === '.' || eventCharacter === ',') && this.eventKeyCode === keyCode.DotNumpad)) {
                if (!settingsClone.decimalPlacesOverride || !settingsClone.decimalCharacter) {
                    return true;
                }

                // Do not allow decimal character before negativeSignCharacter character
                if (settingsClone.negativeSignCharacter && contains(right, settingsClone.negativeSignCharacter)) {
                    return true;
                }

                // Do not allow decimal character if other decimal character present
                if (contains(left, settingsClone.decimalCharacter)) {
                    return true;
                }

                if (right.indexOf(settingsClone.decimalCharacter) > 0) {
                    return true;
                }

                if (right.indexOf(settingsClone.decimalCharacter) === 0) {
                    right = right.substr(1);
                }

                this._setValueParts(left + settingsClone.decimalCharacter, right);

                return true;
            }

            // Prevent minus if not allowed
            if ((eventCharacter === '-' || eventCharacter === '+') && settingsClone.negativeSignCharacter === '-') {
                if (!settingsClone) {
                    return true;
                }

                // Caret is always after minus
                if ((settingsClone.currencySymbolPlacement === 'p' && settingsClone.negativePositiveSignPlacement === 's') || (settingsClone.currencySymbolPlacement === 's' && settingsClone.negativePositiveSignPlacement !== 'p')) {
                    if (left === '' && contains(right, settingsClone.negativeSignCharacter)) {
                        left = settingsClone.negativeSignCharacter;
                        right = right.substring(1, right.length);
                    }

                    // Change number sign, remove part if should
                    if (isNegativeStrict(left) || contains(left, settingsClone.negativeSignCharacter)) {
                        left = left.substring(1, left.length);
                    } else {
                        left = (eventCharacter === '-') ? settingsClone.negativeSignCharacter + left : left;
                    }
                } else {
                    if (left === '' && contains(right, settingsClone.negativeSignCharacter)) {
                        left = settingsClone.negativeSignCharacter;
                        right = right.substring(1, right.length);
                    }

                    // Change number sign, remove part if should
                    if (left.charAt(0) === settingsClone.negativeSignCharacter) {
                        left = left.substring(1, left.length);
                    } else {
                        left = (eventCharacter === '-') ? settingsClone.negativeSignCharacter + left : left;
                    }
                }

                this._setValueParts(left, right);

                return true;
            }

            // If the user tries to insert digit before minus sign
            const eventNumber = Number(eventCharacter);
            if (eventNumber >= 0 && eventNumber <= 9) {
                if (settingsClone.negativeSignCharacter && left === '' && contains(right, settingsClone.negativeSignCharacter)) {
                    left = settingsClone.negativeSignCharacter;
                    right = right.substring(1, right.length);
                }

                if (settingsClone.maximumValue <= 0 && settingsClone.minimumValue < settingsClone.maximumValue && !contains(this.value, settingsClone.negativeSignCharacter) && eventCharacter !== '0') {
                    left = settingsClone.negativeSignCharacter + left;
                }

                this._setValueParts(left + eventCharacter, right);

                return true;
            }

            // Prevent any other character
            settingsClone.throwInput = false;

            return false;
        }

        /**
         * Formatting of just processed value while keeping the cursor position
         *
         * @param {Event} e
         * @private
         */
        _formatValue(e) {
            const settingsClone = this.settingsClone;
            const leftLength = this.value;
            let [left] = this._getUnformattedLeftAndRightPartAroundTheSelection();

            // No grouping separator and no currency sign
            if ((settingsClone.digitGroupSeparator  === '' || (settingsClone.digitGroupSeparator !== ''  && !contains(leftLength, settingsClone.digitGroupSeparator))) &&
                (settingsClone.currencySymbol === '' || (settingsClone.currencySymbol !== '' && !contains(leftLength, settingsClone.currencySymbol)))) {
                let [subParts] = leftLength.split(settingsClone.decimalCharacter);
                let nSign = '';
                if (isNegative(subParts)) {
                    nSign = '-';
                    subParts = subParts.replace('-', '');
                    left = left.replace('-', '');
                }

                // Strip leading zero on positive value if needed
                if (nSign === '' && subParts.length > settingsClone.mIntPos && left.charAt(0) === '0') {
                    left = left.slice(1);
                }

                // Strip leading zero on negative value if needed
                if (nSign === '-' && subParts.length > settingsClone.mIntNeg && left.charAt(0) === '0') {
                    left = left.slice(1);
                }

                left = nSign + left;
            }

            const value = addGroupSeparators(this.value, this.settingsClone);
            let position = value.length;
            if (value) {
                // Prepare regexp which searches for cursor position from unformatted left part
                const leftAr = left.split('');

                // Fixes caret position with trailing minus sign
                if ((settingsClone.negativePositiveSignPlacement === 's' || (settingsClone.currencySymbolPlacement === 's' && settingsClone.negativePositiveSignPlacement !== 'p')) &&
                    leftAr[0] === '-' && settingsClone.negativeSignCharacter !== '') {
                    leftAr.shift();

                    if ((this.eventKeyCode === keyCode.Backspace || this.eventKeyCode === keyCode.Delete) &&
                        settingsClone.caretFix) {
                        if (settingsClone.currencySymbolPlacement === 's' && settingsClone.negativePositiveSignPlacement === 'l') {
                            leftAr.push('-');
                            settingsClone.caretFix = e.type === 'keydown';
                        }

                        if (settingsClone.currencySymbolPlacement === 'p' && settingsClone.negativePositiveSignPlacement === 's') {
                            leftAr.push('-');
                            settingsClone.caretFix = e.type === 'keydown';
                        }

                        if (settingsClone.currencySymbolPlacement === 's' && settingsClone.negativePositiveSignPlacement === 'r') {
                            const signParts = settingsClone.currencySymbol.split('');
                            const escapeChr = ['\\', '^', '$', '.', '|', '?', '*', '+', '(', ')', '['];
                            const escapedParts = [];
                            $.each(signParts, (i, miniParts) => {
                                miniParts = signParts[i];
                                if (isInArray(miniParts, escapeChr)) {
                                    escapedParts.push('\\' + miniParts);
                                } else {
                                    escapedParts.push(miniParts);
                                }
                            });

                            if (this.eventKeyCode === keyCode.Backspace) {
                                escapedParts.push('-');
                            }

                            // Pushing the escaped sign
                            leftAr.push(escapedParts.join(''));
                            settingsClone.caretFix = e.type === 'keydown';
                        }
                    }
                }

                for (let i = 0; i < leftAr.length; i++) {
                    if (!leftAr[i].match('\\d')) {
                        leftAr[i] = '\\' + leftAr[i];
                    }
                }

                const leftReg = new RegExp('^.*?' + leftAr.join('.*?'));

                // Search cursor position in formatted value
                const newLeft = value.match(leftReg);
                if (newLeft) {
                    position = newLeft[0].length;

                    // If the positive sign is shown, calculate the caret position accordingly
                    if (settingsClone.showPositiveSign) {
                        if (position === 0 && newLeft.input.charAt(0) === settingsClone.positiveSignCharacter) {
                            position = (newLeft.input.indexOf(settingsClone.currencySymbol) === 1) ? settingsClone.currencySymbol.length + 1 : 1;
                        }

                        if (position === 0 && newLeft.input.charAt(settingsClone.currencySymbol.length) === settingsClone.positiveSignCharacter) {
                            position = settingsClone.currencySymbol.length + 1;
                        }
                    }

                    // If we are just before the sign which is in prefix position
                    if (((position === 0 && value.charAt(0) !== settingsClone.negativeSignCharacter) || (position === 1 && value.charAt(0) === settingsClone.negativeSignCharacter)) && settingsClone.currencySymbol && settingsClone.currencySymbolPlacement === 'p') {
                        // Place caret after prefix sign
                        //TODO Should the test be 'isNegative' instead of 'isNegativeStrict' in order to search for '-' everywhere in the string?
                        position = this.settingsClone.currencySymbol.length + (isNegativeStrict(value) ? 1 : 0);
                    }
                } else {
                    if (settingsClone.currencySymbol && settingsClone.currencySymbolPlacement === 's') {
                        // If we could not find a place for cursor and have a sign as a suffix
                        // Place caret before suffix currency sign
                        position -= settingsClone.currencySymbol.length;
                    }

                    if (settingsClone.suffixText) {
                        // If we could not find a place for cursor and have a suffix
                        // Place caret before suffix
                        position -= settingsClone.suffixText.length;
                    }
                }
            }

            // Only update the value if it has changed. This prevents modifying the selection, if any.
            if (value !== this.that.value ||
                value === this.that.value && (this.eventKeyCode === keyCode.num0 || this.eventKeyCode === keyCode.numpad0)) {
                this.that.value = value;
                this._setCaretPosition(position);
            }

            if (settingsClone.androidSelectionStart !== null) {
                // If an Android browser is detected, fix the caret position
                // Unfortunately this does not fix all android browsers, only Android Chrome currently.
                // This is due to the fact those provide different order of events and/or keycodes thrown (this is a real mess :|).
                this._setCaretPosition(settingsClone.androidSelectionStart);
            }

            this.formatted = true; //TODO Rename `this.formatted` to `this._formatExecuted`, since it's possible this function does not need to format anything (in the case where the keycode is dropped for instance)
        }
    }

    /**
     * This function factorise the `getString()` and `getArray()` functions since they share quite a lot of code.
     *
     * The "getString" method uses jQuery's .serialize() method that creates a text string in standard URL-encoded notation.
     * The "getArray" method on the other hand uses jQuery's .serializeArray() method that creates array or objects that can be encoded as a JSON string.
     *
     * It then loops through the string and un-formats the inputs with autoNumeric.
     * By defaults values returned as ISO numeric string "1234.56" or "-1234.56" where the decimal character is a period
     * Locale formats are supported "1234.56-" or "1234,56" or "-1234,56 or "1234,56-", or even plain numbers => please see option "outputFormat" for more details
     *
     * @param {boolean} getArrayBehavior - If set to TRUE, then this function behave like `getArray()`, otherwise if set to FALSE, it behave like `getString()`
     * @param {HTMLElement} that - A reference to the current DOM element
     * @returns {*}
     * @private
     */
    function _getStringOrArray(getArrayBehavior = true, that) {
        const $this = getCurrentElement(that);
        const formIndex = $('form').index($this);
        const allFormElements = $(`form:eq(${formIndex})`)[0];
        const aiIndex = [];

        // all input index
        const scIndex = [];

        // successful control index
        const rSubmitterTypes = /^(?:submit|button|image|reset|file)$/i;

        // from jQuery serialize method
        const rSubmittable = /^(?:input|select|textarea|keygen)/i;

        // from jQuery serialize method
        const rCheckableType = /^(?:checkbox|radio)$/i;
        const rNonAutoNumericTypes = /^(?:button|checkbox|color|date|datetime|datetime-local|email|file|image|month|number|password|radio|range|reset|search|submit|time|url|week)/i;

        let count = 0;

        // index of successful elements
        $.each(allFormElements, (i, field) => {
            if (field.name !== '' && rSubmittable.test(field.localName) && !rSubmitterTypes.test(field.type) && !field.disabled && (field.checked || !rCheckableType.test(field.type))) {
                scIndex.push(count);
                count++;
            } else {
                scIndex.push(-1);
            }
        });

        // index of all inputs tags except checkbox
        count = 0;
        $.each(allFormElements, (i, field) => {
            if (field.localName === 'input' && (field.type === '' || field.type === 'text' || field.type === 'hidden' || field.type === 'tel')) {
                aiIndex.push(count);
                count++;
            } else {
                aiIndex.push(-1);
                if (field.localName === 'input' && rNonAutoNumericTypes.test(field.type)) {
                    count++;
                }
            }
        });

        if (getArrayBehavior) {
            const formFields = $this.serializeArray();

            $.each(formFields, (i, field) => {
                const scElement = scIndex.indexOf(i);

                if (scElement > -1 && aiIndex[scElement] > -1) {
                    const testInput = $(`form:eq(${formIndex}) input:eq(${aiIndex[scElement]})`);
                    const settings = testInput.data('autoNumeric');

                    if (typeof settings === 'object') {
                        field.value = testInput.autoNumeric('getLocalized').toString();
                    }
                }
            });

            return formFields;
        }
        else {
            // getString() behavior
            const formFields = $this.serialize();
            const formParts = formFields.split('&');

            $.each(formParts, i => {
                const [inputName, inputValue] = formParts[i].split('=');
                const scElement = scIndex.indexOf(i);

                // If the current element is a valid element
                if (scElement > -1 && aiIndex[scElement] > -1) {
                    const testInput = $(`form:eq(${formIndex}) input:eq(${aiIndex[scElement]})`);
                    const settings = testInput.data('autoNumeric');

                    if (typeof settings === 'object') {
                        if (inputValue !== null) {
                            const modifiedInputValue = testInput.autoNumeric('getLocalized').toString();
                            formParts[i] = `${inputName}=${modifiedInputValue}`;
                        }
                    }
                }
            });

            return formParts.join('&');
        }
    }

    /**
     * Handler for 'focusin' events
     *
     * @param {object} $this jQuery-selected DOM element
     * @param {AutoNumericHolder} holder
     * @param {Event} e
     */
    function onFocusInAndMouseEnter($this, holder, e) {
        const settings = holder.settingsClone;

        if (e.type === 'focusin' || e.type === 'mouseenter' && !$this.is(':focus') && settings.emptyInputBehavior === 'focus') {
            settings.hasFocus = true;

            if (settings.negativeBracketsTypeOnBlur !== null && settings.negativeSignCharacter !== '') {
                $this.val(toggleNegativeBracket(e.target.value, settings));
            }

            // clean the value to compare to rawValue
            let result = stripAllNonNumberCharacters(e.target.value, settings, true);
            result = convertToNumericString(result, settings);
            result = cleanLeadingTrailingZeros(result, settings);
            if (settings.trailingNegative) {
                result = '-' + result;
            }

            let roundedValue;
            if (settings.decimalPlacesShownOnFocus) {
                settings.decimalPlacesOverride = settings.decimalPlacesShownOnFocus;
                roundedValue = roundValue(settings.rawValue, settings);
                $this.val(addGroupSeparators(roundedValue, settings));
            } else if (settings.scaleDivisor) {
                settings.decimalPlacesOverride = Number(settings.oDec);
                roundedValue = roundValue(settings.rawValue, settings);
                $this.val(addGroupSeparators(roundedValue, settings));
            } else if (settings.noSeparatorOnFocus) {
                settings.digitGroupSeparator = '';
                settings.currencySymbol = '';
                settings.suffixText = '';
                roundedValue = roundValue(settings.rawValue, settings);
                $this.val(addGroupSeparators(roundedValue, settings));
            } else if (result !== settings.rawValue) {
                // updates the rawValue
                $this.autoNumeric('set', result);
            }

            // In order to send a 'native' change event when blurring the input, we need to first store the initial input value on focus.
            holder.valueOnFocus = e.target.value;
            holder.lastVal = holder.valueOnFocus;
            const onEmpty = checkEmpty(holder.valueOnFocus, settings, true);
            if ((onEmpty !== null && onEmpty !== '') && settings.emptyInputBehavior === 'focus') {
                $this.val(onEmpty);
                if (onEmpty === settings.currencySymbol && settings.currencySymbolPlacement === 's') {
                    setElementSelection(e.target, 0, 0);
                }
            }
        }
    }

    /**
     * Handler for 'keydown' events.
     * The user just started pushing any key, hence one event is sent.
     *
     * Note :
     * By default a 'normal' input output those events in the right order when inputting a character key (ie. 'a') :
     * - keydown
     * - keypress
     * - input
     * - keyup
     *
     * ...when inputting a modifier key (ie. 'ctrl') :
     * - keydown
     * - keyup
     *
     * If 'delete' or 'backspace' is entered, the following events are sent :
     * - keydown
     * - input
     * - keyup
     *
     * If 'enter' is entered and the value has not changed, the following events are sent :
     * - keydown
     * - keypress
     * - keyup
     *
     * If 'enter' is entered and the value has been changed, the following events are sent :
     * - keydown
     * - keypress
     * - change
     * - keyup
     *
     * When a paste is done, the following events are sent :
     * - input (if paste is done with the mouse)
     *
     * - keydown (if paste is done with ctrl+v)
     * - keydown
     * - input
     * - keyup
     * - keyup
     *
     * @param {AutoNumericHolder} holder
     * @param {Event} e
     */
    function onKeydown(holder, e) {
        //TODO Create a function that retrieve the element value (either by using `e.target.value` when the element is an <input>, or by using `element.textContent` when the element as its `contenteditable` set to true)
        holder._updateAutoNumericHolderEventKeycode(e);
        holder.initialValueOnKeydown = e.target.value; // This is needed in `onKeyup()` to check if the value as changed during the key press

        if (holder.that.readOnly) {
            holder.processed = true;

            return;
        }

        // The "enter" key throws a `change` event if the value has changed since the `focus` event
        if (holder.eventKeyCode === keyCode.Enter && holder.valueOnFocus !== e.target.value) {
            triggerEvent('change', e.target);
            holder.valueOnFocus = e.target.value;
        }

        holder._updateAutoNumericHolderProperties(e);

        if (holder._skipAlways(e)) {
            holder.processed = true;

            return;
        }

        // Check if the key is a delete/backspace key
        if (holder.eventKeyCode === keyCode.Backspace || holder.eventKeyCode === keyCode.Delete) {
            holder._processCharacterDeletion(); // Because backspace and delete only triggers keydown and keyup events, not keypress
            holder.processed = true;
            holder._formatValue(e);

            // If and only if the resulting value has changed after that backspace/delete, then we have to send an 'input' event like browsers normally do.
            if ((e.target.value !== holder.lastVal) && holder.settingsClone.throwInput) {
                // Throw an input event when a character deletion is detected
                triggerEvent('input', e.target);
                e.preventDefault(); // ...and immediately prevent the browser to delete a second character
            }

            holder.lastVal = e.target.value;
            holder.settingsClone.throwInput = true;

            return;
        }

        holder.formatted = false; //TODO Is this line needed?
    }

    /**
     * Handler for 'keypress' events.
     * The user is still pressing the key, which will output a character (ie. '2') continuously until it releases the key.
     * Note: 'keypress' events are not sent for delete keys like Backspace/Delete.
     *
     * @param {AutoNumericHolder} holder
     * @param {Event} e
     */
    function onKeypress(holder, e) {
        // Retrieve the real character that has been entered (ie. 'a' instead of the key code)
        const eventCharacter = character(e);

        // Firefox generate a 'keypress' event (e.keyCode === 0) for the keys that do not print a character (ie. 'Insert', 'Delete', 'Fn' keys, 'PageUp', 'PageDown' etc.). 'Shift' on the other hand does not generate a keypress event.
        if (eventCharacter === keyName.Insert) {
            return;
        }

        const processed = holder.processed;
        holder._updateAutoNumericHolderProperties(e);

        if (holder._skipAlways(e)) {
            return;
        }

        if (processed) {
            e.preventDefault();

            return;
        }

        const isCharacterInsertionAllowed = holder._processCharacterInsertion(e);
        if (isCharacterInsertionAllowed) {
            holder._formatValue(e);
            if ((e.target.value !== holder.lastVal) && holder.settingsClone.throwInput) {
                // Throws input event on adding a character
                triggerEvent('input', e.target);
                e.preventDefault(); // ...and immediately prevent the browser to add a second character
            }
            else {
                if ((eventCharacter === holder.settings.decimalCharacter || eventCharacter === holder.settings.decimalCharacterAlternative) &&
                    (getElementSelection(e.target).start === getElementSelection(e.target).end) &&
                    getElementSelection(e.target).start === e.target.value.indexOf(holder.settings.decimalCharacter)) {
                    const position = getElementSelection(e.target).start + 1;
                    setElementSelection(e.target, position, position);
                }
                e.preventDefault();
            }

            holder.lastVal = e.target.value;
            holder.settingsClone.throwInput = true;

            return;
        }

        e.preventDefault();

        holder.formatted = false;
    }

    /**
     * Handler for 'input' events.
     * added to support android devices with mobile chrome browsers and others
     * Has the potential to replace the keypress event.
     *
     * @param {AutoNumericHolder} holder
     * @param {Event} e
     */
    function onInput(holder, e) {
        const value = e.target.value;

        // Fix the caret position on keyup in the `_formatValue()` function
        holder.settings.androidSelectionStart = null;

        if (holder.eventKeyCode === keyCode.AndroidDefault) {
            // The keyCode is equal to the default Android Chrome one (which is always equal to `keyCode.AndroidDefault`)
            if (value.length > holder.lastVal.length || value.length >= holder.lastVal.length - holder.selection.length) {
                // Determine the keycode of the character that was entered, and overwrite the faulty `eventKeyCode` info with it
                holder.eventKeyCode = value.charCodeAt(holder.selection.start);

                // Capture the actual character entered
                const androidCharEntered = value.charAt(holder.selection.start);

                // Check if the given character should be inserted, and if so, do insert it into the current element value
                const isCharacterInsertionAllowed = holder._processCharacterInsertion(androidCharEntered);

                if (isCharacterInsertionAllowed) {
                    // Allowed character entered (number, decimal or plus/minus sign)
                    holder._formatValue(e);

                    // Capture the new caret position. This is required because on keyup, `_updateAutoNumericHolderEventKeycode()` captures the old caret position
                    //TODO Check if this is an Android bug or an autoNumeric one
                    holder.settings.androidSelectionStart = holder.selection.start;

                    const decimalCharacterPosition = e.target.value.indexOf(holder.settings.decimalCharacter);
                    const hasDecimalCharacter = decimalCharacterPosition === -1;

                    // Move the caret to the right if the `androidCharEntered` is the decimal character or if it's on the left of the caret position
                    if (androidCharEntered === holder.settings.decimalCharacter ||
                        !hasDecimalCharacter && decimalCharacterPosition < holder.settings.androidSelectionStart) {
                        holder.settings.androidSelectionStart = holder.selection.start + 1;
                    }

                    if (e.target.value.length > value.length) {
                        // Position the caret right now before the 'keyup' event in order to prevent the caret from jumping around
                        setElementSelection(e.target, holder.settings.androidSelectionStart, holder.settings.androidSelectionStart);
                    }

                    holder.lastVal = e.target.value;

                    return;
                } else {
                    // The entered character is not allowed ; overwrite the new invalid value with the previous valid one, and set back the caret/selection
                    e.target.value = holder.lastVal;
                    setElementSelection(e.target, holder.selection.start, holder.selection.end);
                    holder.settings.androidSelectionStart = holder.selection.start;
                }

                e.preventDefault(); //FIXME How does that affects the normal trigger of the input event?

                holder.formatted = false;
            } else {
                // Character deleted
                //TODO What about the `Delete` key?
                holder.eventKeyCode = keyCode.Backspace;
            }
        }
    }

    /**
     * Handler for 'keyup' events.
     * The user just released any key, hence one event is sent.
     *
     * @param {AutoNumericHolder} holder
     * @param {object} settings
     * @param {Event} e
     */
    function onKeyup(holder, settings, e) {
        holder._updateAutoNumericHolderProperties(e);

        const skip = holder._skipAlways(e);
        delete holder.valuePartsBeforePaste;
        const isOnAndroid = holder.settingsClone.androidSelectionStart !== null;
        if (skip && !isOnAndroid || e.target.value === '') {
            return;
        }

        // Added to properly place the caret when only the currency sign is present
        if (e.target.value === holder.settingsClone.currencySymbol) {
            if (holder.settingsClone.currencySymbolPlacement === 's') {
                setElementSelection(e.target, 0, 0);
            } else {
                setElementSelection(e.target, holder.settingsClone.currencySymbol.length, holder.settingsClone.currencySymbol.length);
            }
        } else if (holder.eventKeyCode === keyCode.Tab) {
            setElementSelection(e.target, 0, e.target.value.length);
        }

        if ((e.target.value === holder.settingsClone.suffixText) ||
            (holder.settingsClone.rawValue === '' && holder.settingsClone.currencySymbol !== '' && holder.settingsClone.suffixText !== '')) {
            setElementSelection(e.target, 0, 0);
        }

        // Saves the extended decimal to preserve the data when navigating away from the page
        if (holder.settingsClone.decimalPlacesShownOnFocus !== null && holder.settingsClone.saveValueToSessionStorage) {
            saveValueToPersistentStorage(e.target, settings, 'set');
        }

        if (!holder.formatted) {
            holder._formatValue(e);
        }

        // If the input value has changed during the key press event chain, an event is sent to alert that a formatting has been done (cf. Issue #187)
        if (e.target.value !== holder.initialValueOnKeydown) {
            triggerEvent('autoNumeric:formatted', e.target);
        }
    }

    /**
     * Handler for 'focusout' events
     *
     * @param {object} $this jQuery-selected DOM element
     * @param {AutoNumericHolder} holder
     * @param {Event} e
     */
    function onFocusOutAndMouseLeave($this, holder, e) {
        if (!$this.is(':focus')) {
            let value = e.target.value;
            const origValue = value;
            const settings = holder.settingsClone;
            settings.hasFocus = false;

            if (settings.saveValueToSessionStorage) {
                saveValueToPersistentStorage(e.target, settings, 'set');
            }

            if (settings.noSeparatorOnFocus === true) {
                settings.digitGroupSeparator = settings.oSep;
                settings.currencySymbol = settings.oSign;
                settings.suffixText = settings.oSuffix;
            }

            if (settings.decimalPlacesShownOnFocus !== null) {
                settings.decimalPlacesOverride = settings.oDec;
                settings.allowDecimalPadding = settings.oPad;
                settings.negativeBracketsTypeOnBlur = settings.oBracket;
            }

            value = stripAllNonNumberCharacters(value, settings, true);

            if (value !== '') {
                if (settings.trailingNegative && !isNegative(value)) {
                    value = '-' + value;
                    settings.trailingNegative = false;
                }

                const [minTest, maxTest] = checkIfInRangeWithOverrideOption(value, settings);
                if (checkEmpty(value, settings, false) === null && minTest && maxTest) {
                    value = modifyNegativeSignAndDecimalCharacterForRawValue(value, settings);
                    settings.rawValue = cleanLeadingTrailingZeros(value, settings);

                    if (settings.scaleDivisor) {
                        value = value / settings.scaleDivisor;
                        value = value.toString();
                    }

                    settings.decimalPlacesOverride = (settings.scaleDivisor && settings.scaleDecimalPlaces) ? Number(settings.scaleDecimalPlaces) : settings.decimalPlacesOverride;
                    value = roundValue(value, settings);
                    value = modifyNegativeSignAndDecimalCharacterForFormattedValue(value, settings);
                } else {
                    if (!minTest) {
                        $this.trigger('autoNumeric:minExceeded');
                    }
                    if (!maxTest) {
                        $this.trigger('autoNumeric:maxExceeded');
                    }

                    value = settings.rawValue;
                }
            } else {
                if (settings.emptyInputBehavior === 'zero') {
                    settings.rawValue = '0';
                    value = roundValue('0', settings);
                } else {
                    settings.rawValue = '';
                }
            }

            let groupedValue = checkEmpty(value, settings, false);
            if (groupedValue === null) {
                groupedValue = addGroupSeparators(value, settings);
            }

            if (groupedValue !== origValue) {
                groupedValue = (settings.scaleSymbol) ? groupedValue + settings.scaleSymbol : groupedValue;
                $this.val(groupedValue);
            }

            if (groupedValue !== holder.valueOnFocus) {
                $this.change();
                delete holder.valueOnFocus;
            }
        }
    }

    /**
     * Handler for 'paste' events
     *
     * @param {object} $this jQuery-selected DOM element
     * @param {AutoNumericHolder} holder
     * @param {Event} e
     */
    function onPaste($this, holder, e) {
        //TODO Using ctrl+z after a paste should cancel it -> How would that affect other frameworks/component built with that feature in mind though?
        //FIXME When pasting '000' on a thousand group selection, the whole selection gets deleted, and only one '0' is pasted (cf. issue #302)
        // The event is prevented by default, since otherwise the user would be able to paste invalid characters into the input
        e.preventDefault();

        let rawPastedText;
        if (window.clipboardData && window.clipboardData.getData) {
            // Special case for the obsolete and non-standard IE browsers 10 and 11
            rawPastedText = window.clipboardData.getData('Text');
        } else if (e.clipboardData && e.clipboardData.getData) {
            // Normal case with modern browsers
            rawPastedText = e.clipboardData.getData('text/plain');
        } else {
            throwError('Unable to retrieve the pasted value. Please use a modern browser (ie. Firefox or Chromium).');
        }

        // 0. Special case if the user has selected all the input text before pasting
        const initialFormattedValue = e.target.value;
        const selectionStart = e.target.selectionStart || 0;
        const selectionEnd = e.target.selectionEnd || 0;
        const selectionSize = selectionEnd - selectionStart;
        let isAllInputTextSelected = false;

        if (selectionSize === initialFormattedValue.length) {
            isAllInputTextSelected = true;
        }

        // 1. Check if the paste has a negative sign (only if it's the first character), and store that information for later use
        const isPasteNegative = isNegativeStrict(rawPastedText);
        if (isPasteNegative) {
            // 1a. Remove the negative sign from the pasted text
            rawPastedText = rawPastedText.slice(1, rawPastedText.length);
        }

        // 2. Strip all thousand separators, brackets and currency sign, and convert the decimal character to a dot
        const untranslatedPastedText = preparePastedText(rawPastedText, holder);

        let pastedText;
        if (untranslatedPastedText === '.') {
            // Special case : If the user tries to paste a single decimal character (that has been translated to '.' already)
            pastedText = '.';
        } else {
            // Normal case
            // Allow pasting arabic numbers
            pastedText = arabicToLatinNumbers(untranslatedPastedText, false, false, false);
        }

        // 3. Test if the paste is valid (only has numbers and eventually a decimal character). If it's not valid, stop here.
        if (pastedText !== '.' && (!isNumber(pastedText) || pastedText === '')) {
            if (holder.settings.onInvalidPaste === 'error') {
                //TODO Should we send a warning instead of throwing an error?
                throwError(`The pasted value '${rawPastedText}' is not a valid paste content.`);
            }

            return;
        }

        // 4. Calculate the paste result
        let caretPositionOnInitialTextAfterPasting;
        let initialUnformattedNumber;
        if (e.target.value === '') {
            // autoNumeric 'get' returns '0.00' if the input is empty, hence we need to store the 'real' empty initial value when needed
            //FIXME This has been fixed in a previous commit, get should return '' on an empty input. Remove this unneeded 'if'
            initialUnformattedNumber = '';
        } else {
            initialUnformattedNumber = $this.autoNumeric('get');
        }
        let isInitialValueNegative = isNegativeStrict(initialUnformattedNumber);
        let isPasteNegativeAndInitialValueIsPositive;
        let result;

        // If the pasted content is negative, then the result will be negative too
        if (isPasteNegative && !isInitialValueNegative) {
            initialUnformattedNumber = `-${initialUnformattedNumber}`;
            isInitialValueNegative = true;
            isPasteNegativeAndInitialValueIsPositive = true;
        }
        else {
            isPasteNegativeAndInitialValueIsPositive = false;
        }

        let leftPartContainedADot = false;
        let leftPart;
        let rightPart;
        switch (holder.settings.onInvalidPaste) {
            /* 4a. Truncate paste behavior:
             * Insert as many numbers as possible on the right hand side of the caret from the pasted text content, until the input reach its range limit.
             * If there is more characters in the clipboard once a limit is reached, drop the extraneous characters.
             * Otherwise paste all the numbers in the clipboard.
             * While doing so, we check if the result is within the minimum and maximum values allowed, and stop as soon as we encounter one of those.
             *
             * 4b. Replace paste behavior:
             * Idem than the 'truncate' paste behavior, except that when a range limit is hit, we try to replace the subsequent initial numbers with the pasted ones, until we hit the range limit a second (and last) time, or we run out of numbers to paste
             */
            /* eslint no-case-declarations: 0 */
            case 'truncate':
            case 'replace':
                const leftFormattedPart = initialFormattedValue.slice(0, selectionStart);
                const rightFormattedPart = initialFormattedValue.slice(selectionEnd, initialFormattedValue.length);

                if (selectionStart !== selectionEnd) {
                    // a. If there is a selection, remove the selected part, and return the left and right part
                    result = preparePastedText(leftFormattedPart + rightFormattedPart, holder);
                } else {
                    // b. Else if this is only one caret (and therefore no selection), then return the left and right part
                    result = preparePastedText(initialFormattedValue, holder);
                }

                // Add back the negative sign if needed
                if (isInitialValueNegative) {
                    result = setRawNegativeSign(result);
                }

                // Build the unformatted result string
                caretPositionOnInitialTextAfterPasting = convertCharacterCountToIndexPosition(countNumberCharactersOnTheCaretLeftSide(initialFormattedValue, selectionStart, holder.settings.decimalCharacter));
                if (isPasteNegativeAndInitialValueIsPositive) {
                    // If the initial paste is negative and the initial value is not, then I must offset the caret position by one place to the right to take the additional hyphen into account
                    caretPositionOnInitialTextAfterPasting++;
                    //TODO Quid if the negative sign is not on the left (negativePositiveSignPlacement and currencySymbolPlacement)?
                }

                leftPart = result.slice(0, caretPositionOnInitialTextAfterPasting);
                rightPart = result.slice(caretPositionOnInitialTextAfterPasting, result.length);
                if (pastedText === '.') {
                    if (contains(leftPart, '.')) {
                        // If I remove a dot here, then I need to update the caret position (decrement it by 1) when positioning it
                        // To do so, we keep that info in order to modify the caret position later
                        leftPartContainedADot = true;
                        leftPart = leftPart.replace('.', '');
                    }
                    rightPart = rightPart.replace('.', '');
                }
                // -- Here, we are good to go to continue on the same basis

                // c. Add numbers one by one at the caret position, while testing if the result is valid and within the range of the minimum and maximum value
                //    Continue until you either run out of numbers to paste, or that you get out of the range limits
                const minParse = parseStr(holder.settings.minimumValue);
                const maxParse = parseStr(holder.settings.maximumValue);
                let lastGoodKnownResult = result; // This is set as the default, in case we do not add even one number
                let pastedTextIndex = 0;
                let modifiedLeftPart = leftPart;

                while (pastedTextIndex < pastedText.length) {
                    // Modify the result with another pasted character
                    modifiedLeftPart += pastedText[pastedTextIndex];
                    result = modifiedLeftPart + rightPart;

                    // Check the range limits
                    if (!checkIfInRange(result, minParse, maxParse)) {
                        // The result is out of the range limits, stop the loop here
                        break;
                    }

                    // Save the last good known result
                    lastGoodKnownResult = result;

                    // Update the local variables for the next loop
                    pastedTextIndex++;
                }

                // Update the last caret position where to insert a new number
                caretPositionOnInitialTextAfterPasting += pastedTextIndex;

                //XXX Here we have the result for the `truncate` option
                if (holder.settings.onInvalidPaste === 'truncate') {
                    //TODO If the user as defined a truncate callback and there are still some numbers (that will be dropped), then call this callback with the initial paste as well as the remaining numbers
                    result = lastGoodKnownResult;

                    if (leftPartContainedADot) {
                        // If a dot has been removed for the part on the left of the caret, we decrement the caret index position
                        caretPositionOnInitialTextAfterPasting--;
                    }
                    break;
                }
                //XXX ...else we need to continue modifying the result for the 'replace' option

                // d. Until there are numbers to paste, replace the initial numbers one by one, and still do the range test.
                //    Stop when you have no more numbers to paste, or if you are out of the range limits.
                //    If you do get to the range limits, use the previous known good value within those limits.
                //    Note: The numbers are replaced one by one, in the integer then decimal part, while ignoring the decimal character
                //TODO What should happen if the user try to paste a decimal number? Should we override the current initial decimal character in favor of this new one? If we do, then we have to recalculate the vMin/vMax from the start in order to take into account this new decimal character position..
                let lastGoodKnownResultIndex = caretPositionOnInitialTextAfterPasting;
                const lastGoodKnownResultSize = lastGoodKnownResult.length;

                while (pastedTextIndex < pastedText.length && lastGoodKnownResultIndex < lastGoodKnownResultSize) {
                    if (lastGoodKnownResult[lastGoodKnownResultIndex] === '.') {
                        // We skip the decimal character 'replacement'. That way, we do not change the decimal character position regarding the remaining numbers.
                        lastGoodKnownResultIndex++;
                        continue;
                    }

                    // This replace one character at a time
                    result = replaceCharAt(lastGoodKnownResult, lastGoodKnownResultIndex, pastedText[pastedTextIndex]);

                    // Check the range limits
                    if (!checkIfInRange(result, minParse, maxParse)) {
                        // The result is out of the range limits, stop the loop here
                        break;
                    }

                    // Save the last good known result
                    lastGoodKnownResult = result;

                    // Update the local variables for the next loop
                    pastedTextIndex++;
                    lastGoodKnownResultIndex++;
                }

                // Update the last caret position where to insert a new number
                caretPositionOnInitialTextAfterPasting = lastGoodKnownResultIndex;

                if (leftPartContainedADot) {
                    // If a dot has been removed for the part on the left of the caret, we decrement the caret index position
                    caretPositionOnInitialTextAfterPasting--;
                }

                result = lastGoodKnownResult;

                break;
            /* 4c. Normal paste behavior:
             * Insert the pasted number inside the current unformatted text, at the right caret position or selection
             */
            case 'error':
            case 'ignore':
            case 'clamp':
            default:
                // 1. Generate the unformatted result
                const leftFormattedPart2 = initialFormattedValue.slice(0, selectionStart);
                const rightFormattedPart2 = initialFormattedValue.slice(selectionEnd, initialFormattedValue.length);

                if (selectionStart !== selectionEnd) {
                    // a. If there is a selection, remove the selected part, and return the left and right part
                    result = preparePastedText(leftFormattedPart2 + rightFormattedPart2, holder);
                } else {
                    // b. Else if this is only one caret (and therefore no selection), then return the left and right part
                    result = preparePastedText(initialFormattedValue, holder);
                }

                // Add back the negative sign if needed
                if (isInitialValueNegative) {
                    result = setRawNegativeSign(result);
                }

                // Build the unformatted result string
                caretPositionOnInitialTextAfterPasting = convertCharacterCountToIndexPosition(countNumberCharactersOnTheCaretLeftSide(initialFormattedValue, selectionStart, holder.settings.decimalCharacter));
                if (isPasteNegativeAndInitialValueIsPositive) {
                    // If the initial paste is negative and the initial value is not, then I must offset the caret position by one place to the right to take the additional hyphen into account
                    caretPositionOnInitialTextAfterPasting++;
                    //TODO Quid if the negative sign is not on the left (negativePositiveSignPlacement and currencySymbolPlacement)?
                }

                leftPart = result.slice(0, caretPositionOnInitialTextAfterPasting);
                rightPart = result.slice(caretPositionOnInitialTextAfterPasting, result.length);
                if (pastedText === '.') {
                    // If the user only paste a single decimal character, then we remove the previously existing one (if any)
                    if (contains(leftPart, '.')) {
                        // If I remove a dot here, then I need to update the caret position (decrement it by 1) when positioning it
                        // To do so, we keep that info in order to modify the caret position later
                        leftPartContainedADot = true;
                        leftPart = leftPart.replace('.', '');
                    }
                    rightPart = rightPart.replace('.', '');
                }
                // -- Here, we are good to go to continue on the same basis

                // Generate the unformatted result
                result = `${leftPart}${pastedText}${rightPart}`;

                // 2. Calculate the caret position in the unformatted value, for later use
                if (selectionStart === selectionEnd) {
                    // There is no selection, then the caret position is set after the pasted text
                    const indexWherePastedTextHasBeenInserted = convertCharacterCountToIndexPosition(countNumberCharactersOnTheCaretLeftSide(initialFormattedValue, selectionStart, holder.settings.decimalCharacter));
                    caretPositionOnInitialTextAfterPasting = indexWherePastedTextHasBeenInserted + pastedText.length; // I must not count the characters that have been removed from the pasted text (ie. '.')
                } else {
                    if (isAllInputTextSelected) {
                        // Special case when all the input text is selected before pasting, which means we'll completely erase its content and paste only the clipboard content
                        caretPositionOnInitialTextAfterPasting = result.length;
                    } else if (rightPart === '') {
                        // If the user selected from the caret position to the end of the input (on the far right)
                        caretPositionOnInitialTextAfterPasting = convertCharacterCountToIndexPosition(countNumberCharactersOnTheCaretLeftSide(initialFormattedValue, selectionStart, holder.settings.decimalCharacter)) + pastedText.length;
                    } else {
                        // Normal case
                        const indexSelectionEndInRawValue = convertCharacterCountToIndexPosition(countNumberCharactersOnTheCaretLeftSide(initialFormattedValue, selectionEnd, holder.settings.decimalCharacter));

                        // Here I must not count the characters that have been removed from the pasted text (ie. '.'), or the thousand separators in the initial selected text
                        const selectedText = e.target.value.slice(selectionStart, selectionEnd);
                        caretPositionOnInitialTextAfterPasting = indexSelectionEndInRawValue - selectionSize + countCharInText(holder.settings.digitGroupSeparator, selectedText) + pastedText.length;
                    }
                }

                // Modify the caret position for special cases, only if the whole input has not been selected
                if (!isAllInputTextSelected) {
                    if (isPasteNegativeAndInitialValueIsPositive) {
                        // If the pasted value has a '-' sign, but the initial value does not, offset the index by one
                        caretPositionOnInitialTextAfterPasting++;
                    }

                    if (leftPartContainedADot) {
                        // If a dot has been removed for the part on the left of the caret, we decrement the caret index position
                        caretPositionOnInitialTextAfterPasting--;
                    }
                }
        }

        // 5. Check if the result is a valid number, if not, drop the paste and do nothing.
        if (!isNumber(result) || result === '') {
            if (holder.settings.onInvalidPaste === 'error') {
                throwError(`The pasted value '${rawPastedText}' would result into an invalid content '${result}'.`); //TODO Should we send a warning instead of throwing an error?
                //TODO This is not DRY ; refactor with above
            }
            return;
        }

        // 6. If it's a valid number, check if it falls inside the minimum and maximum value. If this fails, modify the value following this procedure :
        /*
         * If 'error' (this is the default) :
         *      - Normal paste behavior.
         *      - Try to set the new value, if it fails, then throw an error in the console.
         *      - Do not change the input value, do not change the current selection.
         * If 'ignore' :
         *      - Normal paste behavior.
         *      - Try to set the new value, if it fails, do nothing more.
         *      - Do not change the input value, do not change the current selection.
         * If 'clamp' :
         *      - Normal paste behavior.
         *      - Try to set the new value, if it fails, set the value to the minimum or maximum limit, whichever is closest to the
         *        paste result.
         *      - Change the caret position to be positioned on the left hand side of the decimal character.
         * If 'truncate' :
         *      - Truncate paste behavior.
         *      - Try to set the new value, until it fails (if the result is out of the min and max value limits).
         *      - Drop the remaining non-pasted numbers, and keep the last known non-failing result.
         *      - Change the caret position to be positioned after the last pasted character.
         * If 'replace' :
         *      - Replace paste behavior.
         *      - Try to set the new value, until it fails (if the result is out of the min and max value limits).
         *     - Then try to replace as many numbers as possible with the pasted ones. Once it fails, keep the last known non-failing result.
         *      - Change the caret position to be positioned after the last pasted character.
         */
        let valueHasBeenSet = false;
        let valueHasBeenClamped = false;
        try {
            $this.autoNumeric('set', result);
            valueHasBeenSet = true;
        }
        catch (error) {
            let clampedValue;
            switch (holder.settings.onInvalidPaste) {
                case 'clamp':
                    clampedValue = clampToRangeLimits(result, holder.settings);
                    try {
                        $this.autoNumeric('set', clampedValue);
                    }
                    catch (error) {
                        throwError(`Fatal error: Unable to set the clamped value '${clampedValue}'.`);
                    }

                    valueHasBeenClamped = true;
                    valueHasBeenSet = true;
                    result = clampedValue; // This is used only for setting the caret position later
                    break;
                case 'error':
                case 'truncate':
                case 'replace':
                    // Throw an error message
                    throwError(`The pasted value '${rawPastedText}' results in a value '${result}' that is outside of the minimum [${holder.settings.minimumValue}] and maximum [${holder.settings.maximumValue}] value range.`);
                // falls through
                case 'ignore':
                // Do nothing
                // falls through
                default :
                    return; // ...and nothing else should be changed
            }
        }

        // 7. Then lastly, set the caret position at the right logical place
        let caretPositionInFormattedNumber;
        if (valueHasBeenSet) {
            switch (holder.settings.onInvalidPaste) {
                case 'clamp':
                    if (valueHasBeenClamped) {
                        if (holder.settings.currencySymbolPlacement === 's') {
                            setElementSelection(e.target, e.target.value.length - holder.settings.currencySymbol.length); // This puts the caret on the right of the last decimal place
                        } else {
                            setElementSelection(e.target, e.target.value.length); // ..and this on the far right
                        }

                        break;
                    } // else if the value has not been clamped, the default behavior is used...
                // falls through
                case 'error':
                case 'ignore':
                case 'truncate':
                case 'replace':
                default :
                    // Whenever one or multiple characters are pasted, this means we have to manage the potential thousand separators that could be added by the formatting
                    caretPositionInFormattedNumber = findCaretPositionInFormattedNumber(result, caretPositionOnInitialTextAfterPasting, e.target.value, holder.settings.decimalCharacter);
                    setElementSelection(e.target, caretPositionInFormattedNumber);
            }
        }

        // 8. We make sure we send an input event only if the result is different than the initial value before the paste
        if (valueHasBeenSet && initialFormattedValue !== e.target.value) {
            // On a 'normal' non-autoNumeric input, an `input` event is sent when a paste is done. We mimic that.
            triggerEvent('input', e.target);
        }
    }

    /**
     * When focusing out of the input, we check if the value has changed, and if it has, then we send a `change` event (since the native one would have been prevented by `e.preventDefault()` called in the other event listeners).
     *
     * @param {AutoNumericHolder} holder
     * @param {Event} e
     */
    function onBlur(holder, e) {
        if (e.target.value !== holder.valueOnFocus) {
            triggerEvent('change', e.target);
            // e.preventDefault(); // ...and immediately prevent the browser to send a second change event (that somehow gets picked up by jQuery, but not by `addEventListener()` //FIXME KNOWN BUG : This does not prevent the second change event to be picked up by jQuery, which adds '.00' at the end of an integer
        }
    }

    /**
     * Handler for 'submit' events
     *
     * @param {object} $this jQuery-selected DOM element
     * @param {AutoNumericHolder} holder
     */
    function onSubmit($this, holder) {
        $this.closest('form').on('submit.autoNumeric', () => {
            if (holder) {
                const $settings = holder.settingsClone;

                if ($settings.unformatOnSubmit) {
                    $this.val($settings.rawValue);
                }
            }
        });
    }

    /**
     * Return the jQuery selected input if the tag and type are supported by autoNumeric.
     *
     * @param {object} $this jQuery-selected DOM element
     * @returns {boolean|*}
     */
    function getInputIfSupportedTagAndType($this) {
        // Supported input type
        const $input = $this.is('input[type=text], input[type=hidden], input[type=tel], input:not([type])');

        // Checks for non-supported input types
        if (!$input && $this.prop('tagName').toLowerCase() === 'input') {
            throwError(`The input type "${$this.prop('type')}" is not supported by autoNumeric`);
        }

        // Checks for non-supported tags
        const currentElementTag = $this.prop('tagName').toLowerCase();
        if (currentElementTag !== 'input' && !isInArray(currentElementTag, allowedTagList)) {
            throwError(`The <${currentElementTag}> tag is not supported by autoNumeric`);
        }

        return $input;
    }

    /**
     * Formats the default value on page load.
     * This is called only if the `formatOnPageLoad` option is set to `true`.
     *
     * @param {object} settings
     * @param {object} $input jQuery-selected <input> element
     * @param {object} $this jQuery-selected DOM element
     */
    function formatDefaultValueOnPageLoad(settings, $input, $this) {
        let setValue = true;

        if ($input) {
            const currentValue = $this.val();
            /*
             * If the input value has been set by the dev, but not directly as an attribute in the html, then it takes
             * precedence and should get formatted on init (if this input value is a valid number and that the
             * developer wants it formatted on init (cf. `settings.formatOnPageLoad`)).
             * Note; this is true whatever the developer has set for `data-an-default` in the html (asp.net users).
             *
             * In other words : if `defaultValueOverride` is not null, it means the developer is trying to prevent postback problems.
             * But if `input.value` is set to a number, and `$this.attr('value')` is not set, then it means the dev has
             * changed the input value, and then it means we should not overwrite his own decision to do so.
             * Hence, if `defaultValueOverride` is not null, but `input.value` is a number and `$this.attr('value')` is not set,
             * we should ignore `defaultValueOverride` altogether.
             */
            const unLocalizedCurrentValue = toNumericValue(currentValue, settings); // This allows to use a localized value on startup oDec
            if (settings.formatOnPageLoad && currentValue !== '' && isUndefinedOrNullOrEmpty($this.attr('value'))) {
                // Check if the `value` is valid or not
                if (!isNaN(unLocalizedCurrentValue) && Infinity !== unLocalizedCurrentValue) {
                    $this.autoNumeric('set', unLocalizedCurrentValue);
                    setValue = false;
                } else {
                    // If not, inform the developer that nothing usable has been provided
                    throwError(`The value [${currentValue}] used in the input is not a valid value autoNumeric can work with.`);
                }
            } else {
                /* Checks for :
                 * - page reload from back button, and
                 * - ASP.net form post back
                 *      The following HTML data attribute is REQUIRED (data-an-default="same value as the value attribute")
                 *      example: <asp:TextBox runat="server" id="someID" text="1234.56" data-an-default="1234.56">
                 */
                if ((settings.defaultValueOverride !== null && settings.defaultValueOverride.toString() !== currentValue) ||
                    (settings.defaultValueOverride === null && currentValue !== '' && currentValue !== $this.attr('value')) ||
                    (currentValue !== '' && $this.attr('type') === 'hidden' && !isNumber(unLocalizedCurrentValue))) {
                    if ((settings.decimalPlacesShownOnFocus !== null && settings.saveValueToSessionStorage) ||
                        (settings.scaleDivisor && settings.saveValueToSessionStorage)) {
                        settings.rawValue = saveValueToPersistentStorage($this[0], settings, 'get');
                    }

                    // If the decimalPlacesShownOnFocus value should NOT be saved in sessionStorage
                    if (!settings.saveValueToSessionStorage) {
                        let toStrip;

                        if (settings.negativeBracketsTypeOnBlur !== null && settings.negativeSignCharacter !== '') {
                            settings.hasFocus = true;
                            toStrip = toggleNegativeBracket(currentValue, settings);
                        } else {
                            toStrip = currentValue;
                        }

                        if ((settings.negativePositiveSignPlacement === 's' ||
                            (settings.negativePositiveSignPlacement !== 'p' && settings.currencySymbolPlacement === 's')) &&
                            settings.negativeSignCharacter !== '' &&
                            isNegative(currentValue)) {
                            settings.rawValue = settings.negativeSignCharacter + stripAllNonNumberCharacters(toStrip, settings, true);
                        } else {
                            settings.rawValue = stripAllNonNumberCharacters(toStrip, settings, true);
                        }
                    }

                    setValue = false;
                }
            }

            if (currentValue === '') {
                switch (settings.emptyInputBehavior) {
                    case 'focus':
                        setValue = false;
                        break;
                    case 'always':
                        $this.val(settings.currencySymbol);
                        setValue = false;
                        break;
                    case 'zero':
                        $this.autoNumeric('set', '0');
                        setValue = false;
                        break;
                    default :
                    //
                }
            } else if (setValue && currentValue === $this.attr('value')) {
                $this.autoNumeric('set', currentValue);
            }
        }

        if (isInArray($this.prop('tagName').toLowerCase(), settings.tagList) && $this.text() !== '') {
            if (settings.defaultValueOverride !== null) {
                if (settings.defaultValueOverride === $this.text()) {
                    $this.autoNumeric('set', $this.text());
                }
            } else {
                $this.autoNumeric('set', $this.text());
            }
        }
    }

    /**
     * Enhance the user experience by modifying the default `negativePositiveSignPlacement` option depending on `currencySymbol` and `currencySymbolPlacement`.
     *
     * If the user has not set the placement of the negative sign (`negativePositiveSignPlacement`), but has set a currency symbol (`currencySymbol`),
     * then we modify the default value of `negativePositiveSignPlacement` in order to keep the resulting output logical by default :
     * - "$-1,234.56" instead of "-$1,234.56" ({currencySymbol: "$", negativePositiveSignPlacement: "r"})
     * - "-1,234.56$" instead of "1,234.56-$" ({currencySymbol: "$", currencySymbolPlacement: "s", negativePositiveSignPlacement: "p"})
     *
     * @param {object} settings
     */
    function correctNegativePositiveSignPlacementOption(settings) {
        // If negativePositiveSignPlacement is already set, we do not overwrite it
        if (!isNull(settings.negativePositiveSignPlacement)) {
            return;
        }

        if (!isUndefined(settings) &&
            isUndefinedOrNullOrEmpty(settings.negativePositiveSignPlacement) &&
            !isUndefinedOrNullOrEmpty(settings.currencySymbol)) {
            switch (settings.currencySymbolPlacement) {
                case 's':
                    settings.negativePositiveSignPlacement = 'p'; // Default -1,234.56 €
                    break;
                case 'p':
                    settings.negativePositiveSignPlacement = 'l'; // Default -$1,234.56
                    break;
                default :
                //
            }
        } else {
            // Sets the default value if `negativePositiveSignPlacement` is `null`
            settings.negativePositiveSignPlacement = 'l';
        }
    }

    /**
     * Analyze and save the minimumValue and maximumValue integer size for later uses
     *
     * @param {object} settings
     */
    function calculateVMinAndVMaxIntegerSizes(settings) {
        let [maximumValueIntegerPart] = settings.maximumValue.toString().split('.');
        let [minimumValueIntegerPart] = (!settings.minimumValue && settings.minimumValue !== 0)?[]:settings.minimumValue.toString().split('.');
        maximumValueIntegerPart = maximumValueIntegerPart.replace('-', '');
        minimumValueIntegerPart = minimumValueIntegerPart.replace('-', '');

        settings.mIntPos = Math.max(maximumValueIntegerPart.length, 1);
        settings.mIntNeg = Math.max(minimumValueIntegerPart.length, 1);
    }

    /**
     * Modify `decimalPlacesOverride` as needed
     *
     * @param {object} settings
     */
    function correctDecimalPlacesOverrideOption(settings) {
        if (isNull(settings.decimalPlacesOverride)) {
            settings.decimalPlacesOverride = maximumVMinAndVMaxDecimalLength(settings.minimumValue, settings.maximumValue);
        }
        settings.oDec = String(settings.decimalPlacesOverride);

        // Most calculus assume `decimalPlacesOverride` is an integer, the following statement makes it clear (otherwise having it as a string leads to problems in rounding for instance)
        settings.decimalPlacesOverride = Number(settings.decimalPlacesOverride);
    }

    /**
     * Sets the alternative decimal separator key.
     *
     * @param {object} settings
     */
    function setsAlternativeDecimalSeparatorCharacter(settings) {
        if (isNull(settings.decimalCharacterAlternative) && Number(settings.decimalPlacesOverride) > 0) {
            if (settings.decimalCharacter === '.' && settings.digitGroupSeparator !== ',') {
                settings.decimalCharacterAlternative = ',';
            } else if (settings.decimalCharacter === ',' && settings.digitGroupSeparator !== '.') {
                settings.decimalCharacterAlternative = '.';
            }
        }
    }

    /**
     * Caches regular expressions for stripAllNonNumberCharacters
     *
     * @param {object} settings
     */
    function cachesUsualRegularExpressions(settings) {
        const allNumbersReg = '[0-9]';
        const noAllNumbersReg = '[^0-9]';

        // Test if there is a negative character in the string
        const aNegReg = settings.negativeSignCharacter?`([-\\${settings.negativeSignCharacter}]?)`:'(-?)';
        settings.aNegRegAutoStrip = aNegReg;

        let negativeSignRegPart;
        if (settings.negativeSignCharacter) {
            negativeSignRegPart = `\\${settings.negativeSignCharacter}`;
        } else {
            negativeSignRegPart = '';
        }
        settings.skipFirstAutoStrip = new RegExp(`${aNegReg}[^-${negativeSignRegPart}\\${settings.decimalCharacter}${allNumbersReg}].*?(${allNumbersReg}|\\${settings.decimalCharacter}${allNumbersReg})`);
        settings.skipLastAutoStrip = new RegExp(`(${allNumbersReg}\\${settings.decimalCharacter}?)[^\\${settings.decimalCharacter}${allNumbersReg}]${noAllNumbersReg}*$`);

        const allowed = `-0123456789\\${settings.decimalCharacter}`;
        settings.allowedAutoStrip = new RegExp(`[^${allowed}]`, 'g');
        settings.numRegAutoStrip = new RegExp(`${aNegReg}(?:\\${settings.decimalCharacter}?(${allNumbersReg}+\\${settings.decimalCharacter}${allNumbersReg}+)|(${allNumbersReg}*(?:\\${settings.decimalCharacter}${allNumbersReg}*)?))`);

        // Using this regex version `^${settings.aNegRegAutoStrip}0*(\\d|$)` entirely clear the input on blur
        settings.stripReg = new RegExp(`^${settings.aNegRegAutoStrip}0*(${allNumbersReg})`);
    }

    /**
     * Modify the user settings to make them 'exploitable' later.
     *
     * @param {object} settings
     */
    function transformOptionsValuesToDefaultTypes(settings) {
        $.each(settings, (key, value) => {
            // Convert the string 'true' and 'false' to real Boolean
            if (value === 'true' || value === 'false') {
                settings[key] = value === 'true';
            }

            // Convert numbers in options to strings
            //TODO if a value is already of type 'Number', shouldn't we keep it as a number for further manipulation, instead of using a string?
            if (typeof value === 'number' && key !== 'aScale') {
                settings[key] = value.toString();
            }
        });
    }

    /**
     * Convert the old settings options name to new ones.
     *
     * @param {object} options
     */
    function convertOldOptionsToNewOnes(options) {
        //TODO Delete this function once the old options are not used anymore
        const oldOptionsConverter = {
            // Old option name, with their corresponding new option
            aSep                         : 'digitGroupSeparator',
            nSep                         : 'noSeparatorOnFocus',
            dGroup                       : 'digitalGroupSpacing',
            aDec                         : 'decimalCharacter',
            altDec                       : 'decimalCharacterAlternative',
            aSign                        : 'currencySymbol',
            pSign                        : 'currencySymbolPlacement',
            pNeg                         : 'negativePositiveSignPlacement',
            aSuffix                      : 'suffixText',
            oLimits                      : 'overrideMinMaxLimits',
            vMax                         : 'maximumValue',
            vMin                         : 'minimumValue',
            mDec                         : 'decimalPlacesOverride',
            eDec                         : 'decimalPlacesShownOnFocus',
            scaleDecimal                 : 'scaleDecimalPlaces',
            aStor                        : 'saveValueToSessionStorage',
            mRound                       : 'roundingMethod',
            aPad                         : 'allowDecimalPadding',
            nBracket                     : 'negativeBracketsTypeOnBlur',
            wEmpty                       : 'emptyInputBehavior',
            lZero                        : 'leadingZero',
            aForm                        : 'formatOnPageLoad',
            sNumber                      : 'selectNumberOnly',
            anDefault                    : 'defaultValueOverride',
            unSetOnSubmit                : 'unformatOnSubmit',
            outputType                   : 'outputFormat',
            debug                        : 'showWarnings',
            // Current options :
            digitGroupSeparator          : true,
            noSeparatorOnFocus           : true,
            digitalGroupSpacing          : true,
            decimalCharacter             : true,
            decimalCharacterAlternative  : true,
            currencySymbol               : true,
            currencySymbolPlacement      : true,
            negativePositiveSignPlacement: true,
            showPositiveSign             : true,
            suffixText                   : true,
            overrideMinMaxLimits         : true,
            maximumValue                 : true,
            minimumValue                 : true,
            decimalPlacesOverride        : true,
            decimalPlacesShownOnFocus    : true,
            scaleDivisor                 : true,
            scaleDecimalPlaces           : true,
            scaleSymbol                  : true,
            saveValueToSessionStorage    : true,
            onInvalidPaste               : true,
            roundingMethod               : true,
            allowDecimalPadding          : true,
            negativeBracketsTypeOnBlur   : true,
            emptyInputBehavior           : true,
            leadingZero                  : true,
            formatOnPageLoad             : true,
            selectNumberOnly             : true,
            defaultValueOverride         : true,
            unformatOnSubmit             : true,
            outputFormat                 : true,
            showWarnings                 : true,
            failOnUnknownOption          : true,
            //FIXME Find a way to exclude those internal data from the settings object (ideally by using another object, or better yet, class attributes) -->
            hasFocus             : true,
            runOnce              : true,
            rawValue             : true,
            trailingNegative     : true,
            caretFix             : true,
            throwInput           : true,
            strip                : true,
            tagList              : true,
            negativeSignCharacter: true,
            positiveSignCharacter: true,
            mIntPos              : true,
            mIntNeg              : true,
            oDec                 : true,
            oPad                 : true,
            oBracket             : true,
            oSep                 : true,
            oSign                : true,
            oSuffix              : true,
            aNegRegAutoStrip     : true,
            skipFirstAutoStrip   : true,
            skipLastAutoStrip    : true,
            allowedAutoStrip     : true,
            numRegAutoStrip      : true,
            stripReg             : true,
            holder               : true,
        };

        for (const option in options) {
            if (options.hasOwnProperty(option)) {
                if (oldOptionsConverter[option] === true) {
                    // If the option is a 'new' option, we continue looping
                    continue;
                }

                if (oldOptionsConverter.hasOwnProperty(option)) {
                    // Else we have an 'old' option name
                    warning(`You are using the deprecated option name '${option}'. Please use '${oldOptionsConverter[option]}' instead from now on. The old option name will be dropped soon.`, true);

                    // Then we modify the initial option object to use the new options instead of the old ones
                    options[oldOptionsConverter[option]] = options[option];
                    delete options[option];
                } else if (options.failOnUnknownOption) {
                    // ...or the option name is unknown. This means there is a problem with the options object, therefore we throw an error.
                    throwError(`Option name '${option}' is unknown. Please fix the options passed to autoNumeric`);
                }
            }
        }
    }

    /**
     * Analyse the settings/options passed by the user, validate and clean them, then return them.
     * Note: This returns `null` if somehow the settings returned by jQuery is not an object.
     *
     * @param {object} options
     * @param {object} $this jQuery-selected DOM element
     * @param {boolean} update - If TRUE, then the settings already exists and this function only updates them instead of recreating them from scratch
     * @returns {object|null}
     */
    function getInitialSettings(options, $this, update = false) {
        // Attempt to grab "autoNumeric" settings. If they do not exist, it returns "undefined".
        let settings = $this.data('autoNumeric');

        // If the user used old options, we convert them to new ones
        if (update || !isNull(options)) {
            convertOldOptionsToNewOnes(options);
        }

        if (update || isUndefined(settings)) {
            if (update) {
                // The settings are updated
                settings = $.extend(settings, options);
            } else {
                // If we couldn't grab any settings, create them from the default ones and combine them with the options passed
                // The settings are generated for the first time
                // This also attempt to grab the HTML5 data. If it doesn't exist, we'll get "undefined"
                const tagData = $this.data();
                settings = $.extend({}, defaultSettings, tagData, options, {
                    hasFocus             : false,
                    runOnce              : false,
                    rawValue             : '',
                    trailingNegative     : false,
                    caretFix             : false,
                    androidSelectionStart: null,
                    throwInput           : true, // Throw input event
                    strip                : true,
                    tagList              : allowedTagList,
                });
            }

            // Modify the user settings to make them 'exploitable'
            transformOptionsValuesToDefaultTypes(settings);

            // Improve the `negativePositiveSignPlacement` option if needed
            correctNegativePositiveSignPlacementOption(settings);

            // Set the negative and positive signs, as needed
            settings.negativeSignCharacter = settings.minimumValue < 0 ? '-' : '';
            settings.positiveSignCharacter = settings.maximumValue >= 0 ? '+' : '';

            // Additional changes to the settings object (from the original autoCode() function)
            runCallbacksFoundInTheSettingsObject($this, settings);
            calculateVMinAndVMaxIntegerSizes(settings);
            correctDecimalPlacesOverrideOption(settings);
            setsAlternativeDecimalSeparatorCharacter(settings);
            cachesUsualRegularExpressions(settings);

            // Validate the settings
            validate(settings, false); // Throws if necessary

            // Original settings saved for use when decimalPlacesShownOnFocus, scaleDivisor & noSeparatorOnFocus options are being used
            keepAnOriginalSettingsCopy(settings);

            // Save our new settings
            $this.data('autoNumeric', settings);

            return settings;
        } else {
            return null;
        }
    }

    /**
     * Convert the `value` parameter that can either be :
     * - a real number,
     * - a string representing a real number, or
     * - a string representing a localized number (with specific group separators and decimal character),
     * ...to a string representing a real 'javascript' number (ie. '1234' or '1234.567').
     *
     * This function returns `NaN` if such conversion fails.
     *
     * @param {int|float|string} value
     * @param {object} settings
     * @returns {string|NaN}
     */
    function toNumericValue(value, settings) {
        let result;
        if (isNumber(Number(value))) {
            // The value has either already been stripped, or a 'real' javascript number is passed as a parameter
            result = value;
        } else {
            // Else if it's a string that `Number()` cannot typecast, then we try to convert the localized numeric string to a numeric one
            // Convert the value to a numeric string, stripping unnecessary characters in the process
            result = convertToNumericString(value.toString(), settings);

            // If the result is still not a numeric string, then we throw a warning
            if (!isNumber(Number(result))) {
                warning(`The value "${value}" being "set" is not numeric and therefore cannot be used appropriately.`, settings.showWarnings);
                result = NaN;
            }
        }

        return result;
    }

    /**
     * Methods supported by autoNumeric
     */
    const methods = {
        /**
         * Method to initialize autoNumeric and attach the settings (options can be passed as a parameter)
         * The options passed as a parameter is an object that contains the settings (ie. {digitGroupSeparator: ".", decimalCharacter: ",", currencySymbol: '€ '})
         *
         * @example
         * $(someSelector).autoNumeric('init');            // Initiate autoNumeric with defaults
         * $(someSelector).autoNumeric();                  // Initiate autoNumeric with defaults
         * $(someSelector).autoNumeric('init', {options}); // Initiate autoNumeric with options
         * $(someSelector).autoNumeric({options});         // Initiate autoNumeric with options
         *
         * @param {object} options
         * @returns {*|{statements, branches, lines, functions, excludes, overrides}|{statements, branches, lines, functions, excludes}|{statements, lines, branches, functions, excludes}}
         */
        init(options) {
            return this.each(function() {
                const $this = $(this);
                const $input = getInputIfSupportedTagAndType($this);

                const settings = getInitialSettings(options, $this, false);
                if (isNull(settings)) {
                    return this;
                }

                // Create the AutoNumericHolder object that store the field properties
                const holder = getAutoNumericHolder($this, settings, false);

                if (!settings.runOnce && settings.formatOnPageLoad) {
                    formatDefaultValueOnPageLoad(settings, $input, $this);
                }

                settings.runOnce = true;

                // Add the events listeners to supported input types ("text", "hidden", "tel" and no type)
                if ($input) {
                    this.addEventListener('focusin', e => { onFocusInAndMouseEnter($this, holder, e); }, false);
                    this.addEventListener('mouseenter', e => { onFocusInAndMouseEnter($this, holder, e); }, false);
                    this.addEventListener('blur', e => { onFocusOutAndMouseLeave($this, holder, e); }, false);
                    this.addEventListener('mouseleave', e => { onFocusOutAndMouseLeave($this, holder, e); }, false);
                    this.addEventListener('keydown', e => { onKeydown(holder, e); }, false);
                    this.addEventListener('keypress', e => { onKeypress(holder, e); }, false);
                    this.addEventListener('input', e => { onInput(holder, e); }, false);
                    this.addEventListener('keyup', e => { onKeyup(holder, settings, e); }, false);
                    this.addEventListener('blur', e => { onBlur(holder, e); }, false);
                    this.addEventListener('paste', e => { onPaste($this, holder, e); }, false);
                    onSubmit($this, holder); //TODO Switch to `addEventListener'
                }
            });
        },

        /**
         * Method to stop and remove autoNumeric for the current element.
         * Note: this does not remove the formatting.
         *
         * @example $(someSelector).autoNumeric("destroy"); // Destroys autoNumeric on this selected element
         *
         * @returns {*|jQuery}
         */
        destroy() {
            return $(this).each(function() {
                const $this = getCurrentElement(this);
                const settings = $this.data('autoNumeric');
                if (typeof settings === 'object') {
                    $this.val('');
                    saveValueToPersistentStorage($this[0], settings, 'wipe');
                    $this.removeData('autoNumeric');
                    $this.off('.autoNumeric');
                }
            });
        },

        /**
         * Method to clear the value from sessionStorage (or cookie, depending on browser supports).
         *
         * @example $(someSelector).autoNumeric("wipe"); // Removes session storage and cookies from memory
         *
         * @returns {*|jQuery}
         */
        wipe() {
            return $(this).each(function() {
                const $this = getCurrentElement(this);
                const settings = $this.data('autoNumeric');
                if (typeof settings === 'object') {
                    $this.val('');
                    settings.rawValue = '';
                    saveValueToPersistentStorage($this[0], settings, 'wipe');
                }
            });
        },

        /**
         * Method that updates the autoNumeric settings.
         * It can be called multiple times if needed.
         * The options passed as a parameter is an object that contains the settings (ie. {digitGroupSeparator: ".", decimalCharacter: ",", currencySymbol: '€ '}).
         *
         * @example $(someSelector).autoNumeric("update", {options}); // Updates the settings
         *
         * @param {object} options
         * @returns {*|jQuery}
         */
        update(options) {
            return $(this).each(function() {
                // Retrieve the current unformatted input value
                const $this = getCurrentElement(this);
                const strip = $this.autoNumeric('get');

                // Update the settings
                const settings = getInitialSettings(options, $this, true);

                // Update the AutoNumericHolder object that store the field properties
                getAutoNumericHolder($this, settings, true);

                // Reformat the input value with the new settings
                if ($this.val() !== '' || $this.text() !== '') {
                    return $this.autoNumeric('set', strip);
                }
            });
        },

        /**
         * Method to format the value passed as a parameter.
         * If the value is passed as a string, it can be an integer '1234' or a double '1234.56789'
         * and must contain only numbers and one decimal (period) character
         *
         * @example $(someSelector).autoNumeric('set', '12345.67'); // Formats the value being passed as the second parameter
         *
         * @param {*} newValue
         * @returns {*|jQuery}
         */
        set(newValue) {
            return $(this).each(function() {
                if (newValue === null || isUndefined(newValue)) {
                    return;
                }

                //TODO This looks a lot like `getInputIfSupportedTagAndType()`. Is that necessary? Can the input element be changed since autoNumeric has been initialized?
                const $this = getCurrentElement(this);
                const settings = $this.data('autoNumeric');
                if (typeof settings !== 'object') {
                    throwError(`Initializing autoNumeric is required prior to calling the "set" method.`);
                }
                // Reset the trailing negative settings, since it's possible the previous value was negative, but not the newly set one
                settings.trailingNegative = false;

                const $input = $this.is('input[type=text], input[type=hidden], input[type=tel], input:not([type])');

                let value = toNumericValue(newValue, settings);
                if (isNaN(value)) {
                    return $this.val('');
                }

                if (value !== '') {
                    const [minTest, maxTest] = checkIfInRangeWithOverrideOption(value, settings);
                    // This test is needed by the showPositiveSign option
                    const isZero = isZeroOrHasNoValue(value);
                    if (isZero) {
                        value = '0';
                    }

                    if (minTest && maxTest) {
                        if ($input || isInArray($this.prop('tagName').toLowerCase(), settings.tagList)) {
                            // to ensure rounding does not happen twice
                            let hasBeenRounded = false;

                            // rounds the the extended decimal places
                            let tempDecimal;
                            if (settings.decimalPlacesShownOnFocus) {
                                tempDecimal = settings.decimalPlacesOverride;
                                settings.decimalPlacesOverride = Number(settings.decimalPlacesShownOnFocus);
                                value = roundValue(value, settings);
                                hasBeenRounded = true;
                                settings.decimalPlacesOverride = tempDecimal;
                            }

                            if (settings.scaleDivisor && !settings.onOff) {
                                value = roundValue(value, settings);
                                settings.rawValue = cleanLeadingTrailingZeros(value.replace(settings.decimalCharacter, '.'), settings);
                                value = toNumericValue(value, settings);
                                value = value / settings.scaleDivisor;
                                value = value.toString();
                                if (settings.scaleDecimalPlaces) {
                                    tempDecimal = settings.decimalPlacesOverride;
                                    settings.decimalPlacesOverride = Number(settings.scaleDecimalPlaces);
                                    value = roundValue(value, settings);
                                    hasBeenRounded = true;
                                }
                            }

                            // Rounds if this has not been done already
                            if (!hasBeenRounded) {
                                value = roundValue(value, settings);
                            }

                            // Stores rawValue including the decimalPlacesShownOnFocus
                            if (!settings.scaleDivisor) {
                                settings.rawValue = cleanLeadingTrailingZeros(value.replace(settings.decimalCharacter, '.'), settings);
                            }

                            value = modifyNegativeSignAndDecimalCharacterForFormattedValue(value, settings);
                            value = addGroupSeparators(value, settings);

                            if (settings.scaleDivisor && settings.scaleDecimalPlaces && !settings.onOff) {
                                settings.decimalPlacesOverride = tempDecimal;
                            }
                        }

                        if (settings.saveValueToSessionStorage && (settings.decimalPlacesShownOnFocus || settings.scaleDivisor)) {
                            saveValueToPersistentStorage($this[0], settings, 'set');
                        }
                    } else {
                        settings.rawValue = '';
                        saveValueToPersistentStorage($this[0], settings, 'wipe');
                        const attemptedValue = value;
                        value = '';
                        if (!minTest) {
                            $this.trigger('autoNumeric:minExceeded');
                        }

                        if (!maxTest) {
                            $this.trigger('autoNumeric:maxExceeded');
                        }

                        throwError(`The value [${attemptedValue}] being set falls outside of the minimumValue [${settings.minimumValue}] and maximumValue [${settings.maximumValue}] range set for this element`);

                        return $this.val('');
                    }
                } else {
                    return $this.val('');
                }

                if (!settings.hasFocus && settings.scaleSymbol) {
                    value = value + settings.scaleSymbol;
                }

                if ($input) {
                    return $this.val(value);
                }

                if (isInArray($this.prop('tagName').toLowerCase(), settings.tagList)) {
                    return $this.text(value);
                }

                return false;
            });
        },

        /**
         * Method to un-format inputs.
         * This is handy to use right before form submission.
         *
         * By default, values are returned as ISO numeric strings (ie. "1234.56" or "-1234.56"), where the decimal character is a period.
         * Locale formats are supported "1234.56-" or "1234,56" or "-1234,56 or "1234,56-", or even plain numbers.
         * Please see option "outputFormat" for more details
         *
         * @example $(someSelector).autoNumeric('unSet');
         *
         * @returns {*|jQuery}
         */
        unSet() {
            return $(this).each(function() {
                const $this = getCurrentElement(this);
                const settings = $this.data('autoNumeric');
                if (typeof settings === 'object') {
                    settings.hasFocus = true;
                    $this.val($this.autoNumeric('getLocalized'));
                }
            });
        },

        /**
         * Method to re-format inputs.
         * This is handy to use right after form submission.
         *
         * This is called after the 'unSet' method to reformat the input
         *
         * @example $(someSelector).autoNumeric('reSet');
         *
         * @returns {*|jQuery}
         */
        reSet() {
            return $(this).each(function() {
                const $this = getCurrentElement(this);
                const settings = $this.data('autoNumeric');
                if (typeof settings === 'object') {
                    $this.autoNumeric('set', $this.val());
                }
            });
        },

        /**
         * Return the unformatted value as a string.
         *
         * @usage $(someSelector).autoNumeric('get');
         *
         * @returns {string}
         */
        get() {
            //TODO Why would we need to get a new reference to $this since it has been done in `init()`?
            const $this = getCurrentElement(this);
            //TODO This looks a lot like `getInputIfSupportedTagAndType()`. Is that necessary? Can the input element be changed since autoNumeric has been initialized?
            const $input = $this.is('input[type=text], input[type=hidden], input[type=tel], input:not([type])');
            const settings = $this.data('autoNumeric');
            if (typeof settings !== 'object') {
                throwError(`Initializing autoNumeric is required prior to calling the "get" method.`);
            }

            // determine the element type then use .eq(0) selector to grab the value of the first element in selector
            let value = '';
            if ($input) {
                value = $this.eq(0).val();
            } else if (isInArray($this.prop('tagName').toLowerCase(), settings.tagList)) {
                value = $this.eq(0).text();
            } else {
                throwError(`The "<${$this.prop('tagName').toLowerCase()}>" tag is not supported by autoNumeric`);
            }

            if (settings.decimalPlacesShownOnFocus || settings.scaleDivisor) {
                value = settings.rawValue;
            } else {
                // Test if the value is negative
                const isValueNegative = isNegative(value);

                if (!(/\d/).test(value) && settings.emptyInputBehavior === 'focus') {
                    return '';
                }

                if (value !== '' && settings.negativeBracketsTypeOnBlur !== null) {
                    settings.hasFocus = true;
                    value = toggleNegativeBracket(value, settings);
                }

                if (settings.runOnce || settings.formatOnPageLoad === false) {
                    // Strips trailing negative symbol
                    value = stripAllNonNumberCharacters(value, settings, true);
                    // Trims leading and trailing zeros when leadingZero does NOT equal "keep".
                    value = cleanLeadingTrailingZeros(value.replace(settings.decimalCharacter, '.'), settings);

                    // Places the negative symbol in front of the trailing negative
                    if (settings.trailingNegative && isValueNegative && !isNegative(value) && Number(value) !== 0) {
                        value = '-' + value;
                    }
                }

                if (value !== '' || value === '' && settings.emptyInputBehavior === 'zero') {
                    value = modifyNegativeSignAndDecimalCharacterForRawValue(value, settings);
                }
            }

            // Always return a numeric string
            // This gets rid of the trailing zeros in the decimal places since `get` does not pad decimals
            return trimPaddedZerosFromDecimalPlaces(value);
        },

        /**
         * Returns the unformatted value, but following the `outputFormat` setting, which means the output can either be :
         * - a string (that could or could not represent a number (ie. "12345,67-")), or
         * - a plain number (if the setting 'number' is used).
         *
         * By default the returned values are an ISO numeric string "1234.56" or "-1234.56" where the decimal character is a period.
         * Check the "outputFormat" option definition for more details.
         *
         * @usage $(someSelector).autoNumeric('getLocalized');
         *
         * @returns {*}
         */
        getLocalized() {
            const $this = getCurrentElement(this);
            let value = $this.autoNumeric('get');
            const settings = $this.data('autoNumeric');

            if (Number(value) === 0 && settings.leadingZero !== 'keep') {
                value = '0';
            }

            return toLocale(value, settings.outputFormat);
        },

        /**
         * Return the input unformatted value as a real Javascript number.
         *
         * @usage $(someSelector).autoNumeric('getNumber');
         *
         * @returns {number}
         */
        getNumber() {
            const $this = getCurrentElement(this);
            const value = $this.autoNumeric('get');

            return toLocale(value, 'number');
        },

        /**
         * Return the current formatted value of the autoNumeric element.
         * @usage aNInput.autoNumeric('getFormatted'))
         *
         * @returns {string}
         */
        getFormatted() {
            // Make sure `this[0]` exists as well as `.value` before trying to access that property
            if (!this.hasOwnProperty('0') || !('value' in this[0])) {
                throwError('Unable to get the formatted string from the element.');
            }

            return this[0].value;
        },

        /**
         * The "getString" method uses jQuery's .serialize() method that creates a text string in standard URL-encoded notation.
         *
         * It then loops through the string and un-formats the inputs with autoNumeric.
         * By defaults values returned as ISO numeric string "1234.56" or "-1234.56" where the decimal character is a period
         * Locale formats are supported "1234.56-" or "1234,56" or "-1234,56 or "1234,56-" or plain numbers => please see option "outputFormat" for details
         *
         * @returns {string}
         */
        getString() {
            return _getStringOrArray(false, this);
        },

        /**
         * The "getArray" method on the other hand uses jQuery's .serializeArray() method that creates array or objects that can be encoded as a JSON string.
         *
         * It then loops through the string and un-formats the inputs with autoNumeric.
         * By defaults values returned as ISO numeric string "1234.56" or "-1234.56" where the decimal character is a period
         * Locale formats are supported "1234.56-" or "1234,56" or "-1234,56 or "1234,56-" or plain numbers => please see option "outputFormat" for details
         *
         * @returns {{}|[]}
         */
        getArray() {
            return _getStringOrArray(true, this);
        },

        /**
         * The 'getSettings' function returns an object containing all the current autoNumeric settings.
         *
         * @example
         * $(someSelector).autoNumeric('getSettings');
         * $(someSelector).autoNumeric('getSettings').decimalCharacter; // Return the decimalCharacter setting as a string - any valid option name can be used
         *
         * @returns {object}
         */
        getSettings() {
            //TODO Add an option argument `optionName` to this function so that it return only the value of that option, not the entire settings object
            return this.data('autoNumeric');
        },
    };

    /**
     * The autoNumeric function accepts methods names (in string format) and those method parameters if needed.
     * It initialize autoNumeric on the given element.
     *
     * @param {string} method The method name (ie. 'set', 'get', etc.)
     * @param {*} args
     * @returns {*}
     */
    $.fn.autoNumeric = function(method, ...args) {
        if (methods[method]) {
            return methods[method].apply(this, args);
        }

        if (typeof method === 'object' || !method) {
            // The options have been passed directly, without using a named method
            return methods.init.apply(this, [method]);
        }

        throwError(`Method "${method}" is not supported by autoNumeric`);
    };

    /**
     * Return the default autoNumeric settings.
     *
     * @returns {object}
     */
    getDefaultConfig = () => defaultSettings;

    $.fn.autoNumeric.defaults = defaultSettings; // Make those settings public via jQuery too.

    /**
     * Return all the predefined language options in one object.
     * You can also access a specific language object directly by using `an.getLanguages().French` for instance.
     *
     * @returns {object}
     */
    getLanguages = () => languageOption;

    $.fn.autoNumeric.lang = languageOption; // Make those predefined language options public via jQuery too.

    /**
     * Public function that allows formatting without an element trigger.
     *
     * @param {number|string} value A number, or a string that represent a javascript number
     * @param {object|null} options
     * @returns {*}
     */
    autoFormat = (value, options = null) => {
        if (isUndefined(value) || value === null) {
            return null;
        }

        if (!isString(value) && !isNumber(value)) {
            throwError(`The value "${value}" being "set" is not numeric and therefore cannot be used appropriately.`);
        }

        // Initiate a very basic settings object
        const settings = $.extend({}, defaultSettings, { strip: false }, options);
        if (value < 0) {
            settings.negativeSignCharacter = '-';
        }

        if (isNull(settings.decimalPlacesOverride)) {
            settings.decimalPlacesOverride = maximumVMinAndVMaxDecimalLength(settings.minimumValue, settings.maximumValue);
        }

        // Check the validity of the `value` parameter
        // Convert the value to a numeric string, stripping unnecessary characters in the process
        let valueString = toNumericValue(value, settings);
        if (isNaN(valueString)) {
            throwError(`The value [${valueString}] that you are trying to format is not a recognized number.`);
        }

        // Basic tests to check if the given valueString is valid
        const [minTest, maxTest] = checkIfInRangeWithOverrideOption(valueString, settings);
        if (!minTest || !maxTest) {
            // Throw a custom event
            triggerEvent('autoFormat.autoNumeric', document, `Range test failed`);
            throwError(`The value [${valueString}] being set falls outside of the minimumValue [${settings.minimumValue}] and maximumValue [${settings.maximumValue}] range set for this element`);
        }

        // Everything is ok, proceed to rounding, formatting and grouping
        valueString = roundValue(valueString, settings);
        valueString = modifyNegativeSignAndDecimalCharacterForFormattedValue(valueString, settings);
        valueString = addGroupSeparators(valueString, settings);

        return valueString;
    };

    $.fn.autoFormat = autoFormat; // The jQuery export

    /**
     * Public function that allows unformatting without an element.
     *
     * @param {string|number} value
     * @param {object} options
     * @returns {*}
     */
    autoUnFormat = (value, options) => {
        if (isUndefined(value) || value === null) {
            return null;
        }

        // Giving an unformatted value should return the same unformatted value, whatever the options passed as a parameter
        if (isNumber(value)) {
            return Number(value);
        }

        if (isArray(value) || isObject(value)) { //TODO Complete the test to throw when given a wrongly formatted number (ie. 'foobar')
            // Check the validity of the `value` parameter
            throwError(`A number or a string representing a number is needed to be able to unformat it, [${value}] given.`);
        }

        const settings = $.extend({}, defaultSettings, { strip: false }, options);
        const allowed = `-0123456789\\${settings.decimalCharacter}`;
        const autoStrip = new RegExp(`[^${allowed}]`, 'gi');
        value = value.toString();

        // This checks is a negative sign is anywhere in the `value`, not just on the very first character (ie. '12345.67-')
        if (isNegative(value)) {
            settings.negativeSignCharacter = '-';
        } else if (settings.negativeBracketsTypeOnBlur && settings.negativeBracketsTypeOnBlur.split(',')[0] === value.charAt(0)) {
            settings.negativeSignCharacter = '-';
            settings.hasFocus = true;
            value = toggleNegativeBracket(value, settings);
        }

        value = value.replace(autoStrip, '');
        value = value.replace(settings.decimalCharacter, '.');
        value = toLocale(value, settings.outputFormat);

        return value;
    };

    $.fn.autoUnformat = autoUnFormat; // The jQuery export

    /**
     * Validate the given option object.
     * If the options are valid, this function returns nothing, otherwise if the options are invalid, this function throws an error.
     *
     * This tests if the options are not conflicting and are well formatted.
     * This function is lenient since it only tests the settings properties ; it ignores any other properties the options object could have.
     *
     * @param {*} userOptions
     * @param {Boolean} shouldExtendDefaultOptions If TRUE, then this function will extends the `userOptions` passed by the user, with the default options.
     * @throws Error
     */
    validate = (userOptions, shouldExtendDefaultOptions = true) => {
        if (isUndefinedOrNullOrEmpty(userOptions) || !isObject(userOptions) || isEmptyObj(userOptions)) {
            throwError(`The userOptions are invalid ; it should be a valid object, [${userOptions}] given.`);
        }

        // If the user used old options, we convert them to new ones
        if (!isNull(userOptions)) {
            convertOldOptionsToNewOnes(userOptions);
        }

        // The user can choose if the `userOptions` has already been extended with the default options, or not
        let options;
        if (shouldExtendDefaultOptions) {
            options = $.extend({}, defaultSettings, userOptions);
        } else {
            options = userOptions;
        }

        // First things first, we test that the `showWarnings` option is valid
        if (!isTrueOrFalseString(options.showWarnings) && !isBoolean(options.showWarnings)) {
            throwError(`The debug option 'showWarnings' is invalid ; it should be either 'false' or 'true', [${options.showWarnings}] given.`);
        }

        // Define the regular expressions needed for the following tests
        const testPositiveInteger = /^[0-9]+$/;
        const testNumericalCharacters = /[0-9]+/;
        // const testFloatAndPossibleNegativeSign = /^-?[0-9]+(\.?[0-9]+)$/;
        const testFloatOrIntegerAndPossibleNegativeSign = /^-?[0-9]+(\.?[0-9]+)?$/;
        const testPositiveFloatOrInteger = /^[0-9]+(\.?[0-9]+)?$/;

        // Then tests the options individually
        if (!isInArray(options.digitGroupSeparator, [
            ',',      // Comma
            '.',      // Dot
            ' ',      // Normal space
            '\u2009', // Thin-space
            '\u202f', // Narrow no-break space
            '\u00a0', // No-break space
            '',       // No separator
            "'",      // Apostrophe
            '٬',      // Arabic thousands separator
            '˙',      // Dot above
        ])) {
            throwError(`The thousand separator character option 'digitGroupSeparator' is invalid ; it should be ',', '.', '٬', '˙', "'", ' ', '\u2009', '\u202f', '\u00a0' or empty (''), [${options.digitGroupSeparator}] given.`);
        }

        if (!isTrueOrFalseString(options.noSeparatorOnFocus) && !isBoolean(options.noSeparatorOnFocus)) {
            throwError(`The 'noSeparatorOnFocus' option is invalid ; it should be either 'false' or 'true', [${options.noSeparatorOnFocus}] given.`);
        }

        if (!testPositiveInteger.test(options.digitalGroupSpacing)) {
            throwError(`The digital grouping for thousand separator option 'digitalGroupSpacing' is invalid ; it should be a positive integer, [${options.digitalGroupSpacing}] given.`);
        }

        if (!isInArray(options.decimalCharacter, [
            ',', // Comma
            '.', // Dot
            '·', // Middle-dot
            '٫', // Arabic decimal separator
            '⎖', // Decimal separator key symbol
        ])) {
            throwError(`The decimal separator character option 'decimalCharacter' is invalid ; it should be '.', ',', '·', '⎖' or '٫', [${options.decimalCharacter}] given.`);
        }

        // Checks if the decimal and thousand characters are the same
        if (options.decimalCharacter === options.digitGroupSeparator) {
            throwError(`autoNumeric will not function properly when the decimal character 'decimalCharacter' [${options.decimalCharacter}] and the thousand separator 'digitGroupSeparator' [${options.digitGroupSeparator}] are the same character.`);
        }

        if (!isNull(options.decimalCharacterAlternative) && !isString(options.decimalCharacterAlternative)) {
            throwError(`The alternate decimal separator character option 'decimalCharacterAlternative' is invalid ; it should be a string, [${options.decimalCharacterAlternative}] given.`);
        }

        if (options.currencySymbol !== '' && !isString(options.currencySymbol)) {
            throwError(`The currency symbol option 'currencySymbol' is invalid ; it should be a string, [${options.currencySymbol}] given.`);
        }

        if (!isInArray(options.currencySymbolPlacement, ['p', 's'])) {
            throwError(`The placement of the currency sign option 'currencySymbolPlacement' is invalid ; it should either be 'p' (prefix) or 's' (suffix), [${options.currencySymbolPlacement}] given.`);
        }

        if (!isInArray(options.negativePositiveSignPlacement, ['p', 's', 'l', 'r', null])) {
            throwError(`The placement of the negative sign option 'negativePositiveSignPlacement' is invalid ; it should either be 'p' (prefix), 's' (suffix), 'l' (left), 'r' (right) or 'null', [${options.negativePositiveSignPlacement}] given.`);
        }

        if (!isTrueOrFalseString(options.showPositiveSign) && !isBoolean(options.showPositiveSign)) {
            throwError(`The show positive sign option 'showPositiveSign' is invalid ; it should be either 'false' or 'true', [${options.showPositiveSign}] given.`);
        }

        if (!isString(options.suffixText) || (options.suffixText !== '' && (isNegative(options.suffixText) || testNumericalCharacters.test(options.suffixText)))) {
            throwError(`The additional suffix option 'suffixText' is invalid ; it should not contains the negative sign '-' nor any numerical characters, [${options.suffixText}] given.`);
        }

        if (!isNull(options.overrideMinMaxLimits) && !isInArray(options.overrideMinMaxLimits, ['ceiling', 'floor', 'ignore'])) {
            throwError(`The override min & max limits option 'overrideMinMaxLimits' is invalid ; it should either be 'ceiling', 'floor' or 'ignore', [${options.overrideMinMaxLimits}] given.`);
        }

        if (!isString(options.maximumValue) || !testFloatOrIntegerAndPossibleNegativeSign.test(options.maximumValue)) {
            throwError(`The maximum possible value option 'maximumValue' is invalid ; it should be a string that represents a positive or negative number, [${options.maximumValue}] given.`);
        }

        if (!isString(options.minimumValue) || !testFloatOrIntegerAndPossibleNegativeSign.test(options.minimumValue)) {
            throwError(`The minimum possible value option 'minimumValue' is invalid ; it should be a string that represents a positive or negative number, [${options.minimumValue}] given.`);
        }

        if (parseFloat(options.minimumValue) > parseFloat(options.maximumValue)) {
            throwError(`The minimum possible value option is greater than the maximum possible value option ; 'minimumValue' [${options.minimumValue}] should be smaller than 'maximumValue' [${options.maximumValue}].`);
        }

        if (!(isNull(options.decimalPlacesOverride) ||
            (isInt(options.decimalPlacesOverride) && options.decimalPlacesOverride >= 0) || // If integer option
            (isString(options.decimalPlacesOverride) && testPositiveInteger.test(options.decimalPlacesOverride)))  // If string option
        ) {
            throwError(`The maximum number of decimal places option 'decimalPlacesOverride' is invalid ; it should be a positive integer, [${options.decimalPlacesOverride}] given.`);
        }

        // Write a warning message in the console if the number of decimal in minimumValue/maximumValue is overridden by decimalPlacesOverride (and not if decimalPlacesOverride is equal to the number of decimal used in minimumValue/maximumValue)
        const vMinAndVMaxMaximumDecimalPlaces = maximumVMinAndVMaxDecimalLength(options.minimumValue, options.maximumValue);
        if (!isNull(options.decimalPlacesOverride) && vMinAndVMaxMaximumDecimalPlaces !== Number(options.decimalPlacesOverride)) {
            warning(`Setting 'decimalPlacesOverride' to [${options.decimalPlacesOverride}] will override the decimals declared in 'minimumValue' [${options.minimumValue}] and 'maximumValue' [${options.maximumValue}].`, options.showWarnings);
        }

        if (!options.allowDecimalPadding && !isNull(options.decimalPlacesOverride)) {
            warning(`Setting 'allowDecimalPadding' to [false] will override the current 'decimalPlacesOverride' setting [${options.decimalPlacesOverride}].`, options.showWarnings);
        }

        if (!isNull(options.decimalPlacesShownOnFocus) && (!isString(options.decimalPlacesShownOnFocus) || !testPositiveInteger.test(options.decimalPlacesShownOnFocus))) {
            throwError(`The number of expanded decimal places option 'decimalPlacesShownOnFocus' is invalid ; it should be a positive integer, [${options.decimalPlacesShownOnFocus}] given.`);
        }

        // Checks if the extended decimal places "decimalPlacesShownOnFocus" is greater than the normal decimal places "decimalPlacesOverride"
        if (!isNull(options.decimalPlacesShownOnFocus) && !isNull(options.decimalPlacesOverride) && Number(options.decimalPlacesOverride) > Number(options.decimalPlacesShownOnFocus)) {
            warning(`The extended decimal places 'decimalPlacesShownOnFocus' [${options.decimalPlacesShownOnFocus}] should be greater than the 'decimalPlacesOverride' [${options.decimalPlacesOverride}] value. Currently, this will limit the ability of your client to manually change some of the decimal places. Do you really want to do that?`, options.showWarnings);
        }

        if (!isNull(options.scaleDivisor) && !testPositiveFloatOrInteger.test(options.scaleDivisor)) {
            throwError(`The scale divisor option 'scaleDivisor' is invalid ; it should be a positive number, preferably an integer, [${options.scaleDivisor}] given.`);
        }

        if (!isNull(options.scaleDecimalPlaces) && !testPositiveInteger.test(options.scaleDecimalPlaces)) {
            throwError(`The scale number of decimals option 'scaleDecimalPlaces' is invalid ; it should be a positive integer, [${options.scaleDecimalPlaces}] given.`);
        }

        if (!isNull(options.scaleSymbol) && !isString(options.scaleSymbol)) {
            throwError(`The scale symbol option 'scaleSymbol' is invalid ; it should be a string, [${options.scaleSymbol}] given.`);
        }

        if (!isTrueOrFalseString(options.saveValueToSessionStorage) && !isBoolean(options.saveValueToSessionStorage)) {
            throwError(`The save to session storage option 'saveValueToSessionStorage' is invalid ; it should be either 'false' or 'true', [${options.saveValueToSessionStorage}] given.`);
        }

        if (!isInArray(options.onInvalidPaste, [
            'error',
            'ignore',
            'clamp',
            'truncate',
            'replace',
        ])) {
            throwError(`The paste behavior option 'onInvalidPaste' is invalid ; it should either be 'error', 'ignore', 'clamp', 'truncate' or 'replace' (cf. documentation), [${options.onInvalidPaste}] given.`);
        }

        if (!isInArray(options.roundingMethod, [
            'S',
            'A',
            's',
            'a',
            'B',
            'U',
            'D',
            'C',
            'F',
            'N05',
            'CHF',
            'U05',
            'D05',
        ])) {
            throwError(`The rounding method option 'roundingMethod' is invalid ; it should either be 'S', 'A', 's', 'a', 'B', 'U', 'D', 'C', 'F', 'N05', 'CHF', 'U05' or 'D05' (cf. documentation), [${options.roundingMethod}] given.`);
        }

        if (!isTrueOrFalseString(options.allowDecimalPadding) && !isBoolean(options.allowDecimalPadding)) {
            throwError(`The control decimal padding option 'allowDecimalPadding' is invalid ; it should be either 'false' or 'true', [${options.allowDecimalPadding}] given.`);
        }

        if (!isNull(options.negativeBracketsTypeOnBlur) && !isInArray(options.negativeBracketsTypeOnBlur, ['(,)', '[,]', '<,>', '{,}'])) {
            throwError(`The brackets for negative values option 'negativeBracketsTypeOnBlur' is invalid ; it should either be '(,)', '[,]', '<,>' or '{,}', [${options.negativeBracketsTypeOnBlur}] given.`);
        }

        if (!isInArray(options.emptyInputBehavior, ['focus', 'press', 'always', 'zero'])) {
            throwError(`The display on empty string option 'emptyInputBehavior' is invalid ; it should either be 'focus', 'press', 'always' or 'zero', [${options.emptyInputBehavior}] given.`);
        }

        if (!isInArray(options.leadingZero, ['allow', 'deny', 'keep'])) {
            throwError(`The leading zero behavior option 'leadingZero' is invalid ; it should either be 'allow', 'deny' or 'keep', [${options.leadingZero}] given.`);
        }

        if (!isTrueOrFalseString(options.formatOnPageLoad) && !isBoolean(options.formatOnPageLoad)) {
            throwError(`The format on initialization option 'formatOnPageLoad' is invalid ; it should be either 'false' or 'true', [${options.formatOnPageLoad}] given.`);
        }

        if (!isTrueOrFalseString(options.selectNumberOnly) && !isBoolean(options.selectNumberOnly)) {
            throwError(`The select number only option 'selectNumberOnly' is invalid ; it should be either 'false' or 'true', [${options.selectNumberOnly}] given.`);
        }

        if (!isNull(options.defaultValueOverride) && (options.defaultValueOverride !== '' && !testFloatOrIntegerAndPossibleNegativeSign.test(options.defaultValueOverride))) {
            throwError(`The unformatted default value option 'defaultValueOverride' is invalid ; it should be a string that represents a positive or negative number, [${options.defaultValueOverride}] given.`);
        }

        if (!isTrueOrFalseString(options.unformatOnSubmit) && !isBoolean(options.unformatOnSubmit)) {
            throwError(`The remove formatting on submit option 'unformatOnSubmit' is invalid ; it should be either 'false' or 'true', [${options.unformatOnSubmit}] given.`);
        }

        if (!isNull(options.outputFormat) && !isInArray(options.outputFormat, [
            'string',
            'number',
            '.',
            '-.',
            ',',
            '-,',
            '.-',
            ',-',
        ])) {
            throwError(`The custom locale format option 'outputFormat' is invalid ; it should either be null, 'string', 'number', '.', '-.', ',', '-,', '.-' or ',-', [${options.outputFormat}] given.`);
        }

        if (!isTrueOrFalseString(options.failOnUnknownOption) && !isBoolean(options.failOnUnknownOption)) {
            throwError(`The debug option 'failOnUnknownOption' is invalid ; it should be either 'false' or 'true', [${options.failOnUnknownOption}] given.`);
        }
    };

    $.fn.autoValidate = validate;

    /**
     * Return TRUE is the settings/options are valid, FALSE otherwise.
     *
     * @param {object} options
     * @returns {boolean}
     */
    areSettingsValid = function(options) {
        let isValid = true;
        try {
            validate(options);
        }
        catch (error) {
            isValid = false;
        }

        return isValid;
    };

    /**
     * Take an arabic number as a string and return a javascript number.
     * By default, this function does not try to convert the arabic decimal and thousand separator characters.
     * This returns `NaN` is the conversion is not possible.
     * Based on http://stackoverflow.com/a/17025392/2834898
     *
     * @param {string} arabicNumbers
     * @param {boolean} returnANumber If `true`, return a Number, otherwise return a String
     * @param {boolean} parseDecimalCharacter
     * @param {boolean} parseThousandSeparator
     * @returns {string|number|NaN}
     */
    function arabicToLatinNumbers(arabicNumbers, returnANumber = true, parseDecimalCharacter = false, parseThousandSeparator = false) {
        let result = arabicNumbers.toString();
        if (result === '' || result.match(/[٠١٢٣٤٥٦٧٨٩۴۵۶]/g) === null) {
            // If no Arabic/Persian numbers are found, return the numeric string directly
            return arabicNumbers;
        }

        if (parseDecimalCharacter) {
            result = result.replace(/٫/, '.'); // Decimal character
        }

        if (parseThousandSeparator) {
            result = result.replace(/٬/g, ''); // Thousand separator
        }

        // Replace the numbers only
        result = result.replace(/[٠١٢٣٤٥٦٧٨٩]/g, d => d.charCodeAt(0) - 1632) // Arabic numbers
                       .replace(/[۰۱۲۳۴۵۶۷۸۹]/g, d => d.charCodeAt(0) - 1776); // Persian numbers

        // `NaN` has precedence over the string `'NaN'`
        const resultAsNumber = Number(result);
        if (isNaN(resultAsNumber)) {
            return resultAsNumber;
        }

        if (returnANumber) {
            result = resultAsNumber;
        }

        return result;
    }

    /**
     * Create a custom event and immediately sent it from the given element.
     * By default, if no element is given, the event is thrown from `document`.
     *
     * @param {string} eventName
     * @param {Element} element
     * @param {object} detail
     */
    function triggerEvent(eventName, element = document, detail = null) {
        let event;
        if (window.CustomEvent) {
            event = new CustomEvent(eventName, { detail, bubbles: false, cancelable: false }); // This is not supported by default by IE ; We use the polyfill for IE9 and later.
        } else {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent(eventName, true, true, { detail });
        }

        element.dispatchEvent(event);
    }

    /**
     * Polyfill from https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent for obsolete browsers (IE)
     */
    (function() {
        if (typeof window.CustomEvent === 'function') {
            return false;
        }

        function CustomEvent(event, params) {
            params = params || { bubbles: false, cancelable: false, detail: void(0) };
            const evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        }

        CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent = CustomEvent;
    })();
}));

/**
 * This exports the interface for the autoNumeric object
 */
export default {
    format  : autoFormat,
    unFormat: autoUnFormat,
    getDefaultConfig,
    getLanguages,
    validate, // an.validate(options) : throws if necessary
    areSettingsValid, // an.areSettingsValid(options) : return true or false //TODO Is this redundant? Should we let the developers wrap each autoNumeric.validate() calls in try/catch block? Or should we just facilitate their life by doing it already?

    //TODO Complete the interface with functions having the following signatures :
    //init         : an.init(options, input)
    //get          : an.get(input)
    //set          : an.set(value, input)
    //formString   : an.formString(form)
    //formArray    : an.formArray(form)
    //getFormatted : an.getFormatted(input)
    //unset        : an.unset(input) //to rename to 'unformat'? (and merge with autoUnFormat/unFormat?)
    //reformat     : an.reformat(input) // 'reSet' is very to close to 'reset' and therefore should be renamed. We could still expose 'reSet', but add a @deprecated tag on its declaration.
    //settings     : an.settings(input)
    //update       : an.update(options, input)
    //wipe         : an.wipe(input)
    //destroy      : an.destroy(input)

    //raw          : an.raw(input) // Return the unformatted value as a string
    //number       : an.number(input) // Return the unformatted value as a number (Warning: This can lead to precision problems with big numbers)
};
