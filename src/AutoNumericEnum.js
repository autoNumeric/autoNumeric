/**
 * Enumerations for autoNumeric.js
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

/**
 * Object that store the helper enumerations
 * @type {{ allowedTagList: [string], keyCode: {}, fromCharCodeKeyCode: [string], keyName: {} }}
 */
const AutoNumericEnum = {};

/**
 * List of allowed tag on which autoNumeric can be used.
 */
AutoNumericEnum.allowedTagList = [
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
    'input',
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
Object.freeze(AutoNumericEnum.allowedTagList);
Object.defineProperty(AutoNumericEnum, 'allowedTagList', { configurable: false, writable: false });

/**
 * Wrapper variable that hold named keyboard keys with their respective keyCode as seen in DOM events.
 * cf. https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
 *
 * This deprecated information is used for obsolete browsers.
 * @deprecated
 */
AutoNumericEnum.keyCode = {
    Backspace     : 8,
    Tab           : 9,
    // No 10, 11
    // 12 === NumpadEqual on Windows
    // 12 === NumLock on Mac
    Enter         : 13,
    // 14 reserved, but not used
    // 15 does not exists
    Shift         : 16,
    Ctrl          : 17,
    Alt           : 18,
    Pause         : 19,
    CapsLock      : 20,
    // 21, 22, 23, 24, 25 : Asiatic key codes
    // 26 does not exists
    Esc           : 27,
    // 28, 29, 30, 31 : Convert, NonConvert, Accept and ModeChange keys
    Space         : 32,
    PageUp        : 33,
    PageDown      : 34,
    End           : 35,
    Home          : 36,
    LeftArrow     : 37,
    UpArrow       : 38,
    RightArrow    : 39,
    DownArrow     : 40,
    Insert        : 45,
    Delete        : 46,
    num0          : 48,
    num1          : 49,
    num2          : 50,
    num3          : 51,
    num4          : 52,
    num5          : 53,
    num6          : 54,
    num7          : 55,
    num8          : 56,
    num9          : 57,
    a             : 65,
    b             : 66,
    c             : 67,
    d             : 68,
    e             : 69,
    f             : 70,
    g             : 71,
    h             : 72,
    i             : 73,
    j             : 74,
    k             : 75,
    l             : 76,
    m             : 77,
    n             : 78,
    o             : 79,
    p             : 80,
    q             : 81,
    r             : 82,
    s             : 83,
    t             : 84,
    u             : 85,
    v             : 86,
    w             : 87,
    x             : 88,
    y             : 89,
    z             : 90,
    OSLeft        : 91,
    OSRight       : 92,
    ContextMenu   : 93,
    numpad0       : 96,
    numpad1       : 97,
    numpad2       : 98,
    numpad3       : 99,
    numpad4       : 100,
    numpad5       : 101,
    numpad6       : 102,
    numpad7       : 103,
    numpad8       : 104,
    numpad9       : 105,
    MultiplyNumpad: 106,
    PlusNumpad    : 107,
    MinusNumpad   : 109,
    DotNumpad     : 110,
    SlashNumpad   : 111,
    F1            : 112,
    F2            : 113,
    F3            : 114,
    F4            : 115,
    F5            : 116,
    F6            : 117,
    F7            : 118,
    F8            : 119,
    F9            : 120,
    F10           : 121,
    F11           : 122,
    F12           : 123,
    NumLock       : 144,
    ScrollLock    : 145,
    HyphenFirefox : 173, // On the latest Linux and Windows OS, cf. https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode and https://bugzilla.mozilla.org/show_bug.cgi?id=787504 and https://stackoverflow.com/a/35473259/2834898
    MyComputer    : 182,
    MyCalculator  : 183,
    Semicolon     : 186,
    Equal         : 187,
    Comma         : 188,
    Hyphen        : 189,
    Dot           : 190,
    Slash         : 191,
    Backquote     : 192,
    LeftBracket   : 219,
    Backslash     : 220,
    RightBracket  : 221,
    Quote         : 222,
    Command       : 224,
    AltGraph      : 225,
    AndroidDefault: 229, // Android Chrome returns the same keycode number 229 for all keys pressed
};
Object.freeze(AutoNumericEnum.keyCode);
Object.defineProperty(AutoNumericEnum, 'keyCode', { configurable: false, writable: false });

/**
 * This object is the reverse of `keyCode`, and is used to translate the key code to named keys when no valid characters can be obtained by `String.fromCharCode`.
 * This object keys correspond to the `event.keyCode` number, and returns the corresponding key name (à la event.key)
 */
AutoNumericEnum.fromCharCodeKeyCode = {
    0  : 'LaunchCalculator',
    8  : 'Backspace',
    9  : 'Tab',
    13 : 'Enter',
    16 : 'Shift',
    17 : 'Ctrl',
    18 : 'Alt',
    19 : 'Pause',
    20 : 'CapsLock',
    27 : 'Escape',
    32 : ' ',
    33 : 'PageUp',
    34 : 'PageDown',
    35 : 'End',
    36 : 'Home',
    37 : 'ArrowLeft',
    38 : 'ArrowUp',
    39 : 'ArrowRight',
    40 : 'ArrowDown',
    45 : 'Insert',
    46 : 'Delete',
    48 : '0',
    49 : '1',
    50 : '2',
    51 : '3',
    52 : '4',
    53 : '5',
    54 : '6',
    55 : '7',
    56 : '8',
    57 : '9',
    // 65: 'a',
    // 66: 'b',
    // 67: 'c',
    // 68: 'd',
    // 69: 'e',
    // 70: 'f',
    // 71: 'g',
    // 72: 'h',
    // 73: 'i',
    // 74: 'j',
    // 75: 'k',
    // 76: 'l',
    // 77: 'm',
    // 78: 'n',
    // 79: 'o',
    // 80: 'p',
    // 81: 'q',
    // 82: 'r',
    // 83: 's',
    // 84: 't',
    // 85: 'u',
    // 86: 'v',
    // 87: 'w',
    // 88: 'x',
    // 89: 'y',
    // 90: 'z',
    91 : 'OS', // Note: Firefox and Chrome reports 'OS' instead of 'OSLeft'
    92 : 'OSRight',
    93 : 'ContextMenu',
    96 : '0',
    97 : '1',
    98 : '2',
    99 : '3',
    100: '4',
    101: '5',
    102: '6',
    103: '7',
    104: '8',
    105: '9',
    106: '*',
    107: '+',
    109: '-', // The 'NumpadSubtract' code
    110: '.',
    111: '/',
    112: 'F1',
    113: 'F2',
    114: 'F3',
    115: 'F4',
    116: 'F5',
    117: 'F6',
    118: 'F7',
    119: 'F8',
    120: 'F9',
    121: 'F10',
    122: 'F11',
    123: 'F12',
    144: 'NumLock',
    145: 'ScrollLock',
    173: '-', // The 'Minus' sign on Firefox. This is only needed when using the Selenium bot though.
    182: 'MyComputer',
    183: 'MyCalculator',
    186: ';',
    187: '=',
    188: ',',
    189: '-', // The 'Minus' sign on all other browsers
    190: '.',
    191: '/',
    192: '`',
    219: '[',
    220: '\\',
    221: ']',
    222: '\'',
    224: 'Meta',
    225: 'AltGraph',
};
Object.freeze(AutoNumericEnum.fromCharCodeKeyCode);
Object.defineProperty(AutoNumericEnum, 'fromCharCodeKeyCode', { configurable: false, writable: false });

/**
 * Wrapper variable that hold named keyboard keys with their respective key name (as set in KeyboardEvent.key).
 * Those names are listed here :
 * @link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
 */
AutoNumericEnum.keyName = {
    // Special values
    Unidentified  : 'Unidentified',
    AndroidDefault: 'AndroidDefault',

    // Modifier keys
    Alt       : 'Alt',
    AltGr     : 'AltGraph',
    CapsLock  : 'CapsLock', // Under Chrome, e.key is empty for CapsLock
    Ctrl      : 'Control',
    Fn        : 'Fn',
    FnLock    : 'FnLock',
    Hyper     : 'Hyper', // 'OS' under Firefox
    Meta      : 'Meta',
    OSLeft    : 'OS',
    OSRight   : 'OS',
    Command   : 'OS',
    NumLock   : 'NumLock',
    ScrollLock: 'ScrollLock',
    Shift     : 'Shift',
    Super     : 'Super', // 'OS' under Firefox
    Symbol    : 'Symbol',
    SymbolLock: 'SymbolLock',

    // Whitespace keys
    Enter: 'Enter',
    Tab  : 'Tab',
    Space: ' ', // 'Spacebar' for Firefox <37, and IE9

    // Navigation keys
    LeftArrow : 'ArrowLeft', // 'Left' for Firefox <=36, and IE9
    UpArrow   : 'ArrowUp', // 'Up' for Firefox <=36, and IE9
    RightArrow: 'ArrowRight', // 'Right' for Firefox <=36, and IE9
    DownArrow : 'ArrowDown', // 'Down' for Firefox <=36, and IE9
    End       : 'End',
    Home      : 'Home',
    PageUp    : 'PageUp',
    PageDown  : 'PageDown',

    // Editing keys
    Backspace: 'Backspace',
    Clear    : 'Clear',
    Copy     : 'Copy',
    CrSel    : 'CrSel', // 'Crsel' for Firefox <=36, and IE9
    Cut      : 'Cut',
    Delete   : 'Delete', // 'Del' for Firefox <=36, and IE9
    EraseEof : 'EraseEof',
    ExSel    : 'ExSel', // 'Exsel' for Firefox <=36, and IE9
    Insert   : 'Insert',
    Paste    : 'Paste',
    Redo     : 'Redo',
    Undo     : 'Undo',

    // UI keys
    Accept     : 'Accept',
    Again      : 'Again',
    Attn       : 'Attn', // 'Unidentified' for Firefox, Chrome, and IE9 ('KanaMode' when using the Japanese keyboard layout)
    Cancel     : 'Cancel',
    ContextMenu: 'ContextMenu', // 'Apps' for Firefox <=36, and IE9
    Esc        : 'Escape', // 'Esc' for Firefox <=36, and IE9
    Execute    : 'Execute',
    Find       : 'Find',
    Finish     : 'Finish', // 'Unidentified' for Firefox, Chrome, and IE9 ('Katakana' when using the Japanese keyboard layout)
    Help       : 'Help',
    Pause      : 'Pause',
    Play       : 'Play',
    Props      : 'Props',
    Select     : 'Select',
    ZoomIn     : 'ZoomIn',
    ZoomOut    : 'ZoomOut',

    // Device keys
    BrightnessDown: 'BrightnessDown',
    BrightnessUp  : 'BrightnessUp',
    Eject         : 'Eject',
    LogOff        : 'LogOff',
    Power         : 'Power',
    PowerOff      : 'PowerOff',
    PrintScreen   : 'PrintScreen',
    Hibernate     : 'Hibernate', // 'Unidentified' for Firefox <=37
    Standby       : 'Standby', // 'Unidentified' for Firefox <=36, and IE9
    WakeUp        : 'WakeUp',

    // IME and composition keys
    Compose: 'Compose',
    Dead   : 'Dead',

    // Function keys
    F1 : 'F1',
    F2 : 'F2',
    F3 : 'F3',
    F4 : 'F4',
    F5 : 'F5',
    F6 : 'F6',
    F7 : 'F7',
    F8 : 'F8',
    F9 : 'F9',
    F10: 'F10',
    F11: 'F11',
    F12: 'F12',

    // Document keys
    Print: 'Print',

    // 'Normal' keys
    num0            : '0',
    num1            : '1',
    num2            : '2',
    num3            : '3',
    num4            : '4',
    num5            : '5',
    num6            : '6',
    num7            : '7',
    num8            : '8',
    num9            : '9',
    a               : 'a',
    b               : 'b',
    c               : 'c',
    d               : 'd',
    e               : 'e',
    f               : 'f',
    g               : 'g',
    h               : 'h',
    i               : 'i',
    j               : 'j',
    k               : 'k',
    l               : 'l',
    m               : 'm',
    n               : 'n',
    o               : 'o',
    p               : 'p',
    q               : 'q',
    r               : 'r',
    s               : 's',
    t               : 't',
    u               : 'u',
    v               : 'v',
    w               : 'w',
    x               : 'x',
    y               : 'y',
    z               : 'z',
    A               : 'A',
    B               : 'B',
    C               : 'C',
    D               : 'D',
    E               : 'E',
    F               : 'F',
    G               : 'G',
    H               : 'H',
    I               : 'I',
    J               : 'J',
    K               : 'K',
    L               : 'L',
    M               : 'M',
    N               : 'N',
    O               : 'O',
    P               : 'P',
    Q               : 'Q',
    R               : 'R',
    S               : 'S',
    T               : 'T',
    U               : 'U',
    V               : 'V',
    W               : 'W',
    X               : 'X',
    Y               : 'Y',
    Z               : 'Z',
    Semicolon       : ';',
    Equal           : '=',
    Comma           : ',',
    Hyphen          : '-',
    Minus           : '-',
    Plus            : '+',
    Dot             : '.',
    Slash           : '/',
    Backquote       : '`',
    LeftParenthesis : '(',
    RightParenthesis: ')',
    LeftBracket     : '[',
    RightBracket    : ']',
    Backslash       : '\\',
    Quote           : '\'',

    // Numeric keypad keys
    numpad0                       : '0',
    numpad1                       : '1',
    numpad2                       : '2',
    numpad3                       : '3',
    numpad4                       : '4',
    numpad5                       : '5',
    numpad6                       : '6',
    numpad7                       : '7',
    numpad8                       : '8',
    numpad9                       : '9',
    NumpadDot                     : '.',
    NumpadDotAlt                  : ',', // Modern browsers automatically adapt the character sent by this key to the decimal character of the current language
    NumpadMultiply                : '*',
    NumpadPlus                    : '+',
    NumpadMinus                   : '-',
    NumpadSubtract                : '-',
    NumpadSlash                   : '/',
    NumpadDotObsoleteBrowsers     : 'Decimal',
    NumpadMultiplyObsoleteBrowsers: 'Multiply',
    NumpadPlusObsoleteBrowsers    : 'Add',
    NumpadMinusObsoleteBrowsers   : 'Subtract',
    NumpadSlashObsoleteBrowsers   : 'Divide',

    // Special arrays for quicker tests
    _allFnKeys           : ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
    _someNonPrintableKeys: ['Tab', 'Enter', 'Shift', 'ShiftLeft', 'ShiftRight', 'Control', 'ControlLeft', 'ControlRight', 'Alt', 'AltLeft', 'AltRight', 'Pause', 'CapsLock', 'Escape'],
    _directionKeys       : ['PageUp', 'PageDown', 'End', 'Home', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp'],
};
Object.freeze(AutoNumericEnum.keyName._allFnKeys);
Object.freeze(AutoNumericEnum.keyName._someNonPrintableKeys);
Object.freeze(AutoNumericEnum.keyName._directionKeys);
Object.freeze(AutoNumericEnum.keyName);
Object.defineProperty(AutoNumericEnum, 'keyName', { configurable: false, writable: false });

Object.freeze(AutoNumericEnum);

export default AutoNumericEnum;
