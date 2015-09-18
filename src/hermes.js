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

(function () {
  'use strict';

  // turn off vanilla behavior (vertical scroll bar)
  var sliderElems = document.querySelectorAll('.hermes-layout--slider');
  for (var i = 0; i < sliderElems.length; ++i) {
    sliderElems[i].classList.add('is-upgraded');
  }

  // defer slider initialization
  window.addEventListener('load', function() {
    var slider = require('./node/slider');

    for (var i = 0; i < sliderElems.length; ++i) {
      slider(sliderElems[i]);
    }
  });
}());

