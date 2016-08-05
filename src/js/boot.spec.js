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

Object.values = require('./polyfill/values');

var boot = require('./boot');
var Option = require('./classnames/_options');
var Flag = require('./classnames/_flags');

describe('boot', function() {
  var sliderElems = null;
  var containerElem = null;

  beforeEach(function() {
    sliderElems = [
      createSliderElement(2),
      createSliderElement(2),
    ];
    containerElem = createElement('div');
    sliderElems.forEach(function(elem) {
      containerElem.appendChild(elem);
    });
  });

  describe('when called on element containing two sliders', function() {
    var sliders = null;

    beforeEach(function() {
      sliders = boot(containerElem);
    });

    it('should return array containing two Slider instances', function() {
      expect(sliders.length).toBe(2);
    });

    it('all Slider instances should be started', function() {
      window.$applyTimeouts();

      sliders.forEach(function(slider) {
        expect(slider.currentIndex).toBe(0);
      });
    });

    it('all slider elements should be upgraded', function() {
      sliderElems.forEach(function(elem) {
        expect(elem.classList.contains(Flag.UPGRADED)).toBe(true);
      });
    });
  });

  Object.values(Option)
    .filter(function(className) { return className !== Option.AUTOBOOT; })
    .forEach(function(className) {
      describe('when called on container with '+ className +' class name', function() {
        beforeEach(function() {
          containerElem.classList.add(className);
          boot(containerElem);
        });

        it('all slider elements should have '+ className +' class name', function() {
          sliderElems.forEach(function(elem) {
            expect(elem.classList.contains(className)).toBe(true);
          });
        });
      });
    });
});

/*
  eslint-env node, browser, jasmine
*/

/*
  eslint
    max-nested-callbacks: 0,
 */

/*
  global
    createElement,
    createSliderElement,
 */

