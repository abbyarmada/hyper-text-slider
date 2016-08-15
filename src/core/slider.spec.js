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

var slider = require('./slider');
var Layout = require('../enums/layout');
var Phase = require('../enums/phase');

describe('slider', function() {
  afterEach(function() {
    window.$clearEventListeners();
  });

  var illegalArgs = [
    { name: 'undefined', value: undefined },
    { name: 'null', value: null },
    { name: 'not element', value: [] },
  ];
  illegalArgs.forEach(function(arg) {
    describe('given '+ arg.name +' argument,', function() {
      describe('when created', function() {
        it('throws exception', function() {
          expect(function() { slider(arg.value); }).toThrow();
        });
      });
    });
  });

  var legalArgs = [
    { name: 'slider element containing 2 slides', value: createSliderElement(2) },
    { name: 'slider element containing 3 slides', value: createSliderElement(3) },
    { name: 'slider element containing 10 slides', value: createSliderElement(10) },
  ];
  legalArgs.forEach(function(arg) {
    describe('given '+ arg.name +' argument,', function() {
      describe('when created', function() {
        it('returns object instance', function() {
          var testedInstance = slider(arg.value);
          expect(testedInstance).toBeDefined();
        });
      });
    });
  });

  describe('with 3 slides and "hermes-transition--test" class', function() {
    function domSerializeHelper(key, value) {
      if (key === 'parentNode') {
        return undefined;
      }
      return value;
    }

    var sliderElement = null;
    var testedSlider = null;
    var sliderElementSerialized = null;
    beforeEach(function() {
      sliderElement = createSliderElement(3);
      sliderElement.classList.add('hermes-transition--test');
      sliderElement.childNodes[0].id = 'first';
      sliderElement.childNodes[1].id = 'second';
      sliderElement.childNodes[2].id = 'third';
      sliderElementSerialized = JSON.stringify(sliderElement, domSerializeHelper);
      testedSlider = slider(sliderElement);
    });

    describe('when just after creation', function() {
      it('then contains 0 slides', function() {
        expect(testedSlider.slides.length).toEqual(0);
      });

      it('then contains null currentIndex', function() {
        expect(testedSlider.currentIndex).toBe(null);
      });
      it('then contains null currentSlide', function() {
        expect(testedSlider.currentSlide).toBe(null);
      });

      it('then contains unmodified slider element', function() {
        expect(JSON.stringify(sliderElement, domSerializeHelper)).toEqual(sliderElementSerialized);
      });
    });

    describe('when after calling #start', function() {
      var startCallback = null;
      beforeEach(function() {
        startCallback = jasmine.createSpy();
        testedSlider.start(startCallback);
      });

      it('then start callback was not called', function() {
        expect(startCallback).not.toHaveBeenCalled();
      });

      it('then throws exception when calling #start again', function() {
        expect(function() { testedSlider.start(); }).toThrow();
      });

      it('then contains null currentIndex', function() {
        expect(testedSlider.currentIndex).toBe(null);
      });
      it('then contains null currentSlide', function() {
        expect(testedSlider.currentSlide).toBe(null);
      });

      describe('and after sending first animationStart event', function() {
        beforeEach(function() {
          sliderElement.childNodes[0].dispatchEvent(
              new AnimationEvent('animationstart', 'hermesSlideInserted'));
        });

        it('then start callback was not called', function() {
          expect(startCallback).not.toHaveBeenCalled();
        });
      });

      describe('and after upgrading first slide', function() {
        beforeEach(function() {
          sliderElement.childNodes[0].dispatchEvent(
              new AnimationEvent('animationstart', 'hermesSlideInserted'));
          sliderElement.childNodes[0].dispatchEvent(
              new AnimationEvent('animationstart', 'hermesSlideInserted'));
        });

        it('then start callback was called', function() {
          expect(startCallback).toHaveBeenCalledWith(testedSlider);
        });

        it('then contains 1 slide', function() {
          expect(testedSlider.slides.length).toEqual(1);
        });
        it('then contains currentIndex of value 0', function() {
          expect(testedSlider.currentIndex).toBe(0);
        });
        it('then contains currentSlide pointing to slides[0]', function() {
          expect(testedSlider.currentSlide).toBe(testedSlider.slides[0]);
        });

        it('then contains "hermes-slide-id-first" class', function() {
          expect(sliderElement.classList.contains('hermes-slide-id-first')).toBe(true);
        });

        it('slide contains "hermes-layout--background" element as first child', function() {
          expect(testedSlider.slides[0].childNodes[0].classList.contains(Layout.BACKGROUND)).toBe(true);
        });
        it('slides contains "hermes-layout--content" element as second child', function() {
          expect(testedSlider.slides[0].childNodes[1].classList.contains(Layout.CONTENT)).toBe(true);
        });

        it('then contains first slide with "hermes-slide-to" flag', function() {
          expect(testedSlider.slides[0].classList.contains('hermes-slide-to')).toBe(true);
        });

        it('then contains "hermes-before-transition" class', function() {
          expect(sliderElement.classList.contains(Phase.BEFORE_TRANSITION)).toBe(true);
        });
      });
    });

    describe('when after setting current slide to 1', function() {
      beforeEach(function() {
        testedSlider.start();

        sliderElement.childNodes.forEach(function(child) {
          child.dispatchEvent(new AnimationEvent('animationstart', 'hermesSlideInserted'));
          child.dispatchEvent(new AnimationEvent('animationstart', 'hermesSlideInserted'));
        });

        testedSlider.currentIndex = 1;
      });

      it('then contains "hermes-before-transition" class', function() {
        expect(sliderElement.classList.contains('hermes-before-transition')).toBe(true);
      });
      it('then does not contain "hermes-slide-id-first" class', function() {
        expect(sliderElement.classList.contains('hermes-slide-id-first')).toBe(false);
      });
      it('then contains "hermes-slide-id-second" class', function() {
        expect(sliderElement.classList.contains('hermes-slide-id-second')).toBe(true);
      });

      describe('after firing transitionend event on current slide element', function() {
        beforeEach(function() {
          var target = testedSlider.currentSlide.querySelector('.hermes-layout--content');
          var event = new TransitionEvent('transitionend', target, 'transform');
          target.dispatchEvent(event);
        });

        it('then slider moves to "hermes-during-transition" phase', function() {
          expect(sliderElement.classList.contains('hermes-during-transition')).toBe(true);
        });

        describe('and after firing transitionend event second time', function() {
          beforeEach(function() {
            var target = testedSlider.currentSlide.querySelector('.hermes-layout--content');
            var event = new TransitionEvent('transitionend', target, 'transform');
            target.dispatchEvent(event);
          });

          it('then slider moves to "hermes-after-transition" phase', function() {
            expect(sliderElement.classList.contains('hermes-after-transition')).toBe(true);
          });
        });
      });
    });
  });

  describe('with "hermes-defaults" flag', function() {
    var sliderElement = null;
    var testedSlider = null;
    beforeEach(function() {
      sliderElement = createSliderElement(2);
      sliderElement.classList.add('hermes-defaults');
      testedSlider = slider(sliderElement);
    });

    describe('when after calling #start', function() {
      beforeEach(function() {
        testedSlider.start();

        sliderElement.childNodes.forEach(function(child) {
          child.dispatchEvent(new AnimationEvent('animationstart', 'hermesSlideInserted'));
          child.dispatchEvent(new AnimationEvent('animationstart', 'hermesSlideInserted'));
        });
      });

      var defaultOptions = [
        'hermes-autoplay',
        'hermes-show-arrows',
        'hermes-show-dots',
        'hermes-arrow-keys',
        'hermes-responsive-controls',
      ];
      defaultOptions.forEach(function(option) {
        it('then it has "'+ option +'" flag', function() {
          expect(sliderElement.classList.contains(option)).toBe(true);
        });
      });
    });
  });

  describe('with "hermes-autoplay" flag', function() {
    var sliderElement = null;
    var testedSlider = null;
    beforeEach(function() {
      sliderElement = createSliderElement(2);
      sliderElement.classList.add('hermes-autoplay');
      testedSlider = slider(sliderElement);
    });

    describe('when after starting and firing transitionend event twice', function() {
      beforeEach(function() {
        testedSlider.start();

        sliderElement.childNodes.forEach(function(child) {
          child.dispatchEvent(new AnimationEvent('animationstart', 'hermesSlideInserted'));
          child.dispatchEvent(new AnimationEvent('animationstart', 'hermesSlideInserted'));
        });

        var target = testedSlider.currentSlide.querySelector('.hermes-layout--content');
        var event = new TransitionEvent('transitionend', target, 'transform');
        target.dispatchEvent(event);
        target.dispatchEvent(event);
      });

      it('then current index is 1', function() {
        expect(testedSlider.currentIndex).toEqual(1);
      });
      it('then current slide is the second slide', function() {
        expect(testedSlider.currentSlide).toBe(testedSlider.slides[1]);
      });
      it('then slider is in "hermes-before-transition" phase', function() {
        expect(sliderElement.classList.contains('hermes-before-transition')).toBe(true);
      });
    });
  });

  describe('with 3 slides and "hermes-create-arrows" flag', function() {
    var sliderElement = null;
    var testedSlider = null;
    beforeEach(function() {
      sliderElement = createSliderElement(3);
      sliderElement.classList.add('hermes-create-arrows');
      testedSlider = slider(sliderElement);
    });

    describe('when after calling #start', function() {
      beforeEach(function() {
        testedSlider.start();

        sliderElement.childNodes.forEach(function(child) {
          child.dispatchEvent(new AnimationEvent('animationstart', 'hermesSlideInserted'));
          child.dispatchEvent(new AnimationEvent('animationstart', 'hermesSlideInserted'));
        });
      });

      it('then slider contains left arrow', function() {
        var arrow = sliderElement.querySelector('.hermes-layout--arrow-left');
        expect(arrow).not.toBe(null);
        expect(arrow.classList.contains('hermes-layout--arrow')).toBe(true);
      });
      it('then slider contains right arrow', function() {
        var arrow = sliderElement.querySelector('.hermes-layout--arrow-right');
        expect(arrow).not.toBe(null);
        expect(arrow.classList.contains('hermes-layout--arrow')).toBe(true);
      });

      describe('and after click event fired on left arrow', function() {
        beforeEach(function() {
          sliderElement.querySelector('.hermes-layout--arrow-left')
            .dispatchEvent(new MouseEvent('click'));
        });

        it('then current slide is the second slide', function() {
          expect(testedSlider.currentSlide).toBe(testedSlider.slides[2]);
        });
        it('then is in "hermes-before-transition" phase', function() {
          expect(sliderElement.classList.contains('hermes-before-transition')).toBe(true);
        });
      });

      describe('and after click event fired on right arrow', function() {
        beforeEach(function() {
          sliderElement.querySelector('.hermes-layout--arrow-right')
            .dispatchEvent(new MouseEvent('click'));
        });

        it('then current slide is the second slide', function() {
          expect(testedSlider.currentSlide).toBe(testedSlider.slides[1]);
        });
        it('then is in "hermes-before-transition" phase', function() {
          expect(sliderElement.classList.contains('hermes-before-transition')).toBe(true);
        });
      });
    });
  });

  describe('with 2 slides and "hermes-create-dots" flag', function() {
    var sliderElement = null;
    var testedSlider = null;
    beforeEach(function() {
      sliderElement = createSliderElement(2);
      sliderElement.classList.add('hermes-create-dots');
      testedSlider = slider(sliderElement);
    });

    describe('when just after calling #start', function() {
      beforeEach(function() {
        testedSlider.start();

        sliderElement.childNodes.forEach(function(child) {
          child.dispatchEvent(new AnimationEvent('animationstart', 'hermesSlideInserted'));
          child.dispatchEvent(new AnimationEvent('animationstart', 'hermesSlideInserted'));
        });
      });

      it('then slider element contains dots container', function() {
        expect(sliderElement.querySelector('.hermes-layout--dots')).not.toBe(null);
      });
      it('then slider element contains 2 dots', function() {
        expect(sliderElement.querySelector('.hermes-layout--dots')
          .querySelectorAll('.hermes-layout--dot').length).toEqual(2);
      });

      describe('and after click event fired on second dot', function() {
        beforeEach(function() {
          testedSlider.slides[1].dot.dispatchEvent(new MouseEvent('click'));
        });

        it('then current slide is the second slide', function() {
          expect(testedSlider.currentSlide).toBe(testedSlider.slides[1]);
        });
        it('then is in "hermes-before-transition" phase', function() {
          expect(sliderElement.classList.contains('hermes-before-transition')).toBe(true);
        });
      });
    });
  });

  describe('with 2 slides and "hermes-arrow-keys" flag', function() {
    var sliderElement = null;
    var testedSlider = null;
    beforeEach(function() {
      sliderElement = createSliderElement(2);
      sliderElement.classList.add('hermes-arrow-keys');
      testedSlider = slider(sliderElement);
    });

    describe('when started and fired keydown event with left arrow key', function() {
      beforeEach(function() {
        testedSlider.start();

        sliderElement.childNodes.forEach(function(child) {
          child.dispatchEvent(new AnimationEvent('animationstart', 'hermesSlideInserted'));
          child.dispatchEvent(new AnimationEvent('animationstart', 'hermesSlideInserted'));
        });
      });

      it('then current slide is the second slide', function() {
        window.dispatchEvent(new KeyboardEvent('keydown', 'ArrowLeft'));
        expect(testedSlider.currentSlide).toBe(testedSlider.slides[1]);
      });
    });

    describe('when started and fired keydown event with right arrow key', function() {
      beforeEach(function() {
        testedSlider.start();

        sliderElement.childNodes.forEach(function(child) {
          child.dispatchEvent(new AnimationEvent('animationstart', 'hermesSlideInserted'));
          child.dispatchEvent(new AnimationEvent('animationstart', 'hermesSlideInserted'));
        });
      });

      it('then current slide is the second slide', function() {
        window.dispatchEvent(new KeyboardEvent('keydown', 'ArrowRight'));
        expect(testedSlider.currentSlide).toBe(testedSlider.slides[1]);
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
    no-undefined: 0,
*/

/*
  global
    createSliderElement,
*/

