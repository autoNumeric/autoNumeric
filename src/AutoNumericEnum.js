/**
 * Enumerations for autoNumeric.js
 * @author Alexandre Bonneau <alexandre.bonneau@linuxfr.eu>
 * @copyright © 2016 Alexandre Bonneau
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
const AutoNumericEnum = {
    /**
     * List of allowed tag on which autoNumeric can be used.
     */
    allowedTagList: [
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
    ],

    /**
     * Wrapper variable that hold named keyboard keys with their respective keyCode as seen in DOM events.
     * cf. https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
     *
     * This deprecated information is used for obsolete browsers.
     * @deprecated
     */
    keyCode: {
        Backspace:      8,
        Tab:            9,
        // No 10, 11
        // 12 === NumpadEqual on Windows
        // 12 === NumLock on Mac
        Enter:          13,
        // 14 reserved, but not used
        // 15 does not exists
        Shift:          16,
        Ctrl:           17,
        Alt:            18,
        Pause:          19,
        CapsLock:       20,
        // 21, 22, 23, 24, 25 : Asiatic key codes
        // 26 does not exists
        Esc:            27,
        // 28, 29, 30, 31 : Convert, NonConvert, Accept and ModeChange keys
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
        OSLeft:         91,
        OSRight:        92,
        ContextMenu:    93,
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
        AltGraph:       225,
        AndroidDefault: 229, // Android Chrome returns the same keycode number 229 for all keys pressed
    },

    /**
     * This object is the reverse of `keyCode`, and is used to translate the key code to named keys when no valid characters can be obtained by `String.fromCharCode`.
     * Note: this sparse array is initialized later in the source code.
     */
    fromCharCodeKeyCode: [],

    /**
     * Wrapper variable that hold named keyboard keys with their respective key name (as set in KeyboardEvent.key).
     * Those names are listed here :
     * @link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
     */
    keyName: {
        // Special values
        Unidentified:   'Unidentified',
        AndroidDefault: 'AndroidDefault',

        // Modifier keys
        Alt:            'Alt',
        AltGr:          'AltGraph',
        CapsLock:       'CapsLock', // Under Chrome, e.key is empty for CapsLock
        Ctrl:           'Control',
        Fn:             'Fn',
        FnLock:         'FnLock',
        Hyper:          'Hyper', // 'OS' under Firefox
        Meta:           'Meta',
        OSLeft:         'OS',
        OSRight:        'OS',
        Command:        'OS',
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
        LeftArrow:      'ArrowLeft', // 'Left' for Firefox <=36, and IE9
        UpArrow:        'ArrowUp', // 'Up' for Firefox <=36, and IE9
        RightArrow:     'ArrowRight', // 'Right' for Firefox <=36, and IE9
        DownArrow:      'ArrowDown', // 'Down' for Firefox <=36, and IE9
        End:            'End',
        Home:           'Home',
        PageUp:         'PageUp',
        PageDown:       'PageDown',

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
        A:              'A',
        B:              'B',
        C:              'C',
        D:              'D',
        E:              'E',
        F:              'F',
        G:              'G',
        H:              'H',
        I:              'I',
        J:              'J',
        K:              'K',
        L:              'L',
        M:              'M',
        N:              'N',
        O:              'O',
        P:              'P',
        Q:              'Q',
        R:              'R',
        S:              'S',
        T:              'T',
        U:              'U',
        V:              'V',
        W:              'W',
        X:              'X',
        Y:              'Y',
        Z:              'Z',
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

        // Numeric keypad keys
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

        // Special arrays for quicker tests
        _allFnKeys:     ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
        _someNonPrintableKeys: ['Tab', 'Enter', 'Shift', 'ShiftLeft', 'ShiftRight', 'Control', 'ControlLeft', 'ControlRight', 'Alt', 'AltLeft', 'AltRight', 'Pause', 'CapsLock', 'Escape'],
        _directionKeys: ['PageUp', 'PageDown', 'End', 'Home', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp'],
    },
};

// Here we populate the sparse array that uses the `event.keyCode` as index, and returns the corresponding key name (à la event.key)
AutoNumericEnum.fromCharCodeKeyCode[0] = 'LaunchCalculator';
AutoNumericEnum.fromCharCodeKeyCode[8] = 'Backspace';
AutoNumericEnum.fromCharCodeKeyCode[9] = 'Tab';
AutoNumericEnum.fromCharCodeKeyCode[13] = 'Enter';
AutoNumericEnum.fromCharCodeKeyCode[16] = 'Shift';
AutoNumericEnum.fromCharCodeKeyCode[17] = 'Ctrl';
AutoNumericEnum.fromCharCodeKeyCode[18] = 'Alt';
AutoNumericEnum.fromCharCodeKeyCode[19] = 'Pause';
AutoNumericEnum.fromCharCodeKeyCode[20] = 'CapsLock';
AutoNumericEnum.fromCharCodeKeyCode[27] = 'Escape';
AutoNumericEnum.fromCharCodeKeyCode[32] = ' ';
AutoNumericEnum.fromCharCodeKeyCode[33] = 'PageUp';
AutoNumericEnum.fromCharCodeKeyCode[34] = 'PageDown';
AutoNumericEnum.fromCharCodeKeyCode[35] = 'End';
AutoNumericEnum.fromCharCodeKeyCode[36] = 'Home';
AutoNumericEnum.fromCharCodeKeyCode[37] = 'ArrowLeft';
AutoNumericEnum.fromCharCodeKeyCode[38] = 'ArrowUp';
AutoNumericEnum.fromCharCodeKeyCode[39] = 'ArrowRight';
AutoNumericEnum.fromCharCodeKeyCode[40] = 'ArrowDown';
AutoNumericEnum.fromCharCodeKeyCode[45] = 'Insert';
AutoNumericEnum.fromCharCodeKeyCode[46] = 'Delete';
AutoNumericEnum.fromCharCodeKeyCode[48] = '0';
AutoNumericEnum.fromCharCodeKeyCode[49] = '1';
AutoNumericEnum.fromCharCodeKeyCode[50] = '2';
AutoNumericEnum.fromCharCodeKeyCode[51] = '3';
AutoNumericEnum.fromCharCodeKeyCode[52] = '4';
AutoNumericEnum.fromCharCodeKeyCode[53] = '5';
AutoNumericEnum.fromCharCodeKeyCode[54] = '6';
AutoNumericEnum.fromCharCodeKeyCode[55] = '7';
AutoNumericEnum.fromCharCodeKeyCode[56] = '8';
AutoNumericEnum.fromCharCodeKeyCode[57] = '9';
// [65, 'a'],
// [66, 'b'],
// [67, 'c'],
// [68, 'd'],
// [69, 'e'],
// [70, 'f'],
// [71, 'g'],
// [72, 'h'],
// [73, 'i'],
// [74, 'j'],
// [75, 'k'],
// [76, 'l'],
// [77, 'm'],
// [78, 'n'],
// [79, 'o'],
// [80, 'p'],
// [81, 'q'],
// [82, 'r'],
// [83, 's'],
// [84, 't'],
// [85, 'u'],
// [86, 'v'],
// [87, 'w'],
// [88, 'x'],
// [89, 'y'],
// [90, 'z'],
AutoNumericEnum.fromCharCodeKeyCode[91] = 'OS'; // Note: Firefox and Chrome reports 'OS' instead of 'OSLeft'
AutoNumericEnum.fromCharCodeKeyCode[92] = 'OSRight';
AutoNumericEnum.fromCharCodeKeyCode[93] = 'ContextMenu';
AutoNumericEnum.fromCharCodeKeyCode[96] =  '0';
AutoNumericEnum.fromCharCodeKeyCode[97] =  '1';
AutoNumericEnum.fromCharCodeKeyCode[98] =  '2';
AutoNumericEnum.fromCharCodeKeyCode[99] =  '3';
AutoNumericEnum.fromCharCodeKeyCode[100] = '4';
AutoNumericEnum.fromCharCodeKeyCode[101] = '5';
AutoNumericEnum.fromCharCodeKeyCode[102] = '6';
AutoNumericEnum.fromCharCodeKeyCode[103] = '7';
AutoNumericEnum.fromCharCodeKeyCode[104] = '8';
AutoNumericEnum.fromCharCodeKeyCode[105] = '9';
AutoNumericEnum.fromCharCodeKeyCode[106] = '*';
AutoNumericEnum.fromCharCodeKeyCode[107] = '+';
AutoNumericEnum.fromCharCodeKeyCode[109] = '-';
AutoNumericEnum.fromCharCodeKeyCode[110] = '.';
AutoNumericEnum.fromCharCodeKeyCode[111] = '/';
AutoNumericEnum.fromCharCodeKeyCode[112] = 'F1';
AutoNumericEnum.fromCharCodeKeyCode[113] = 'F2';
AutoNumericEnum.fromCharCodeKeyCode[114] = 'F3';
AutoNumericEnum.fromCharCodeKeyCode[115] = 'F4';
AutoNumericEnum.fromCharCodeKeyCode[116] = 'F5';
AutoNumericEnum.fromCharCodeKeyCode[117] = 'F6';
AutoNumericEnum.fromCharCodeKeyCode[118] = 'F7';
AutoNumericEnum.fromCharCodeKeyCode[119] = 'F8';
AutoNumericEnum.fromCharCodeKeyCode[120] = 'F9';
AutoNumericEnum.fromCharCodeKeyCode[121] = 'F10';
AutoNumericEnum.fromCharCodeKeyCode[122] = 'F11';
AutoNumericEnum.fromCharCodeKeyCode[123] = 'F12';
AutoNumericEnum.fromCharCodeKeyCode[144] = 'NumLock';
AutoNumericEnum.fromCharCodeKeyCode[145] = 'ScrollLock';
AutoNumericEnum.fromCharCodeKeyCode[182] = 'MyComputer';
AutoNumericEnum.fromCharCodeKeyCode[183] = 'MyCalculator';
AutoNumericEnum.fromCharCodeKeyCode[186] = ';';
AutoNumericEnum.fromCharCodeKeyCode[187] = '=';
AutoNumericEnum.fromCharCodeKeyCode[188] = ',';
AutoNumericEnum.fromCharCodeKeyCode[189] = '-';
AutoNumericEnum.fromCharCodeKeyCode[190] = '.';
AutoNumericEnum.fromCharCodeKeyCode[191] = '/';
AutoNumericEnum.fromCharCodeKeyCode[192] = '`';
AutoNumericEnum.fromCharCodeKeyCode[219] = '[';
AutoNumericEnum.fromCharCodeKeyCode[220] = '\\';
AutoNumericEnum.fromCharCodeKeyCode[221] = ']';
AutoNumericEnum.fromCharCodeKeyCode[222] = "'";
AutoNumericEnum.fromCharCodeKeyCode[224] = 'Meta';
AutoNumericEnum.fromCharCodeKeyCode[225] = 'AltGraph';

export default AutoNumericEnum;
