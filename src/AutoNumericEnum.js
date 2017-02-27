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
 * @type {{allowedTagList: [*], keyCode: {Backspace: number, Tab: number, Enter: number, Shift: number, Ctrl: number, Alt: number, PauseBreak: number, CapsLock: number, Esc: number, Space: number, PageUp: number, PageDown: number, End: number, Home: number, LeftArrow: number, UpArrow: number, RightArrow: number, DownArrow: number, Insert: number, Delete: number, num0: number, num1: number, num2: number, num3: number, num4: number, num5: number, num6: number, num7: number, num8: number, num9: number, a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number, q: number, r: number, s: number, t: number, u: number, v: number, w: number, x: number, y: number, z: number, Windows: number, RightClick: number, numpad0: number, numpad1: number, numpad2: number, numpad3: number, numpad4: number, numpad5: number, numpad6: number, numpad7: number, numpad8: number, numpad9: number, MultiplyNumpad: number, PlusNumpad: number, MinusNumpad: number, DotNumpad: number, SlashNumpad: number, F1: number, F2: number, F3: number, F4: number, F5: number, F6: number, F7: number, F8: number, F9: number, F10: number, F11: number, F12: number, NumLock: number, ScrollLock: number, MyComputer: number, MyCalculator: number, Semicolon: number, Equal: number, Comma: number, Hyphen: number, Dot: number, Slash: number, Backquote: number, LeftBracket: number, Backslash: number, RightBracket: number, Quote: number, Command: number}, keyName: {Unidentified: string, Alt: string, AltGr: string, CapsLock: string, Ctrl: string, Fn: string, FnLock: string, Hyper: string, Meta: string, Windows: string, Command: string, NumLock: string, ScrollLock: string, Shift: string, Super: string, Symbol: string, SymbolLock: string, Enter: string, Tab: string, Space: string, DownArrow: string, LeftArrow: string, RightArrow: string, UpArrow: string, End: string, Home: string, PageDown: string, PageUp: string, Backspace: string, Clear: string, Copy: string, CrSel: string, Cut: string, Delete: string, EraseEof: string, ExSel: string, Insert: string, Paste: string, Redo: string, Undo: string, Accept: string, Again: string, Attn: string, Cancel: string, ContextMenu: string, Esc: string, Execute: string, Find: string, Finish: string, Help: string, Pause: string, Play: string, Props: string, Select: string, ZoomIn: string, ZoomOut: string, BrightnessDown: string, BrightnessUp: string, Eject: string, LogOff: string, Power: string, PowerOff: string, PrintScreen: string, Hibernate: string, Standby: string, WakeUp: string, Compose: string, Dead: string, F1: string, F2: string, F3: string, F4: string, F5: string, F6: string, F7: string, F8: string, F9: string, F10: string, F11: string, F12: string, Print: string, num0: string, num1: string, num2: string, num3: string, num4: string, num5: string, num6: string, num7: string, num8: string, num9: string, a: string, b: string, c: string, d: string, e: string, f: string, g: string, h: string, i: string, j: string, k: string, l: string, m: string, n: string, o: string, p: string, q: string, r: string, s: string, t: string, u: string, v: string, w: string, x: string, y: string, z: string, Semicolon: string, Equal: string, Comma: string, Hyphen: string, Minus: string, Plus: string, Dot: string, Slash: string, Backquote: string, LeftBracket: string, RightBracket: string, Backslash: string, Quote: string, numpad0: string, numpad1: string, numpad2: string, numpad3: string, numpad4: string, numpad5: string, numpad6: string, numpad7: string, numpad8: string, numpad9: string, NumpadDot: string, NumpadDotAlt: string, NumpadMultiply: string, NumpadPlus: string, NumpadMinus: string, NumpadSlash: string, NumpadDotObsoleteBrowsers: string, NumpadMultiplyObsoleteBrowsers: string, NumpadPlusObsoleteBrowsers: string, NumpadMinusObsoleteBrowsers: string, NumpadSlashObsoleteBrowsers: string}}}
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
     * //TODO Replace every call to this object with a call to `keyName`
     * @deprecated
     */
    keyCode: {
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
    },

    /**
     * Wrapper variable that hold named keyboard keys with their respective key name (as set in KeyboardEvent.key).
     * Those names are listed here :
     * @link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
     */
    keyName: {
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
    },
};

export default AutoNumericEnum;
