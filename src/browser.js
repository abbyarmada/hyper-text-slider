/*

   Copyright 2015 Maciej Chałapuk

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/
'use strict';

// TODO test vanilla browser script
var hermes = require('./node');

/**
 * This script is compiled to `dist/hermes.min.js` during the build
 * and is to be included on the page when vanilla browser programming.
 */
window.addEventListener('load', function() {
  if (document.body.classList.contains(hermes.Option.AUTOBOOT)) {
    hermes.boot(document.body);
  }
});

/*
  eslint-env node, browser
*/

