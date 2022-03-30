/**
 * Temporary hack for allowing `yarn`/`npm` to install correctly under
 * Unix and windows systems
 *
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

/* global require */
/* eslint no-console: 0 */
/* eslint prefer-arrow-callback: 0 */
/* eslint spaced-comment: 0 */

/*
 * This is a hack to circumvent the problem when calling `test -e node_modules/phantomjs-prebuilt/install.js && node node_modules/phantomjs-prebuilt/install.js; true` on windows environment.
 * cf. issue #384 (https://github.com/autoNumeric/autoNumeric/issues/384)
 */
const exec = require('child_process').exec;
const fs = require('fs');

const phantomJsPrebuiltInstallPath = 'node_modules/phantomjs-prebuilt/install.js';
const cmd = 'node '+phantomJsPrebuiltInstallPath;

if (fs.existsSync(phantomJsPrebuiltInstallPath)) {
    // Run the command
    exec(cmd, function(error, stdout, stderr) {
        console.log(stdout); // Command output
        console.log(stderr);
    });
}
/*else {
    // otherwise do nothing
}*/
