(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],2:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],3:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],4:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require("1YiZ5S"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":3,"1YiZ5S":2,"inherits":1}],5:[function(require,module,exports){
/*
 * Copyright (c) 2012 Mathieu Turcotte
 * Licensed under the MIT license.
 */

module.exports = require('./lib/checks');
},{"./lib/checks":6}],6:[function(require,module,exports){
/*
 * Copyright (c) 2012 Mathieu Turcotte
 * Licensed under the MIT license.
 */

var util = require('util');

var errors = module.exports = require('./errors');

function failCheck(ExceptionConstructor, callee, messageFormat, formatArgs) {
    messageFormat = messageFormat || '';
    var message = util.format.apply(this, [messageFormat].concat(formatArgs));
    var error = new ExceptionConstructor(message);
    Error.captureStackTrace(error, callee);
    throw error;
}

function failArgumentCheck(callee, message, formatArgs) {
    failCheck(errors.IllegalArgumentError, callee, message, formatArgs);
}

function failStateCheck(callee, message, formatArgs) {
    failCheck(errors.IllegalStateError, callee, message, formatArgs);
}

module.exports.checkArgument = function(value, message) {
    if (!value) {
        failArgumentCheck(arguments.callee, message,
            Array.prototype.slice.call(arguments, 2));
    }
};

module.exports.checkState = function(value, message) {
    if (!value) {
        failStateCheck(arguments.callee, message,
            Array.prototype.slice.call(arguments, 2));
    }
};

module.exports.checkIsDef = function(value, message) {
    if (value !== undefined) {
        return value;
    }

    failArgumentCheck(arguments.callee, message ||
        'Expected value to be defined but was undefined.',
        Array.prototype.slice.call(arguments, 2));
};

module.exports.checkIsDefAndNotNull = function(value, message) {
    // Note that undefined == null.
    if (value != null) {
        return value;
    }

    failArgumentCheck(arguments.callee, message ||
        'Expected value to be defined and not null but got "' +
        typeOf(value) + '".', Array.prototype.slice.call(arguments, 2));
};

// Fixed version of the typeOf operator which returns 'null' for null values
// and 'array' for arrays.
function typeOf(value) {
    var s = typeof value;
    if (s == 'object') {
        if (!value) {
            return 'null';
        } else if (value instanceof Array) {
            return 'array';
        }
    }
    return s;
}

function typeCheck(expect) {
    return function(value, message) {
        var type = typeOf(value);

        if (type == expect) {
            return value;
        }

        failArgumentCheck(arguments.callee, message ||
            'Expected "' + expect + '" but got "' + type + '".',
            Array.prototype.slice.call(arguments, 2));
    };
}

module.exports.checkIsString = typeCheck('string');
module.exports.checkIsArray = typeCheck('array');
module.exports.checkIsNumber = typeCheck('number');
module.exports.checkIsBoolean = typeCheck('boolean');
module.exports.checkIsFunction = typeCheck('function');
module.exports.checkIsObject = typeCheck('object');

},{"./errors":7,"util":4}],7:[function(require,module,exports){
/*
 * Copyright (c) 2012 Mathieu Turcotte
 * Licensed under the MIT license.
 */

var util = require('util');

function IllegalArgumentError(message) {
    Error.call(this, message);
    this.message = message;
}
util.inherits(IllegalArgumentError, Error);

IllegalArgumentError.prototype.name = 'IllegalArgumentError';

function IllegalStateError(message) {
    Error.call(this, message);
    this.message = message;
}
util.inherits(IllegalStateError, Error);

IllegalStateError.prototype.name = 'IllegalStateError';

module.exports.IllegalStateError = IllegalStateError;
module.exports.IllegalArgumentError = IllegalArgumentError;
},{"util":4}],8:[function(require,module,exports){
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


},{"./node/slider":12}],9:[function(require,module,exports){
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

// from Modernizr
function getTransitionEventName() {
  var el = document.createElement('fakeelement');
  var transitions = {
    'transition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'MozTransition': 'transitionend',
    'WebkitTransition': 'webkitTransitionEnd'
  };

  for (var t in transitions) {
    if (el.style[t] !== undefined) {
      return transitions[t];
    }
  }
  return 'transitionend';
}

function getTransformPropertyName() {
  var el = document.createElement('fakeelement');
  var transforms = {
    'transform': 'transform',
    'OTransform': '-o-transform',
    'MozTransform': '-moz-transform',
    'WebkitTransform': '-webkit-transform'
  };

  for (var t in transforms) {
    if (el.style[t] !== undefined) {
      return transforms[t];
    }
  }
}

var transitionEventName = getTransitionEventName();
var transformPropertyName = getTransformPropertyName();

module.exports = {
  transitionEventName: transitionEventName,
  transformPropertyName: transformPropertyName,
};


},{}],10:[function(require,module,exports){
/**
 * @name Layout Class Names
 *
 * @table name description usage client parent
 * @links name parent
 */
var Layout = {

  /**
   * Identifies main slider element.
   *
   * This class must be set on all slider elements in client HTML.
   * It can be used in client CSS code for styling.
   *
   * @name hermes-layout--slider
   * @usage role-id styling
   * @client mandatory
   */
  SLIDER: 'hermes-layout--slider',

  /**
   * Identifies a slide.
   *
   * At least 2 slides must be defined in each slider.
   * It can be used in client CSS code for styling.
   *
   * @name hermes-layout--slide
   * @usage role-id styling
   * @client mandatory
   * @parent hermes-layout--slider
   */
  SLIDE: 'hermes-layout--slide',

  /**
   * Identifies background of a slide.
   *
   * For slides in which this element is not present in slider declaration, empty background element
   * will be generated during slider upgrade.
   *
   * @name hermes-layout--background
   * @usage role-id styling transition
   * @client optional
   * @parent hermes-layout--slide
   */
  BACKGROUND: 'hermes-layout--background',

  /**
   * Identifies content of a slide.
   *
   * For slides in which this element is not present in slider declaration, it will be generated
   * during slider upgrade. Contents of a slide will be moved inside generated element.
   *
   * If element is present in slider declaration, it must contain all contents of a slide.
   *
   * @name hermes-layout--content
   * @usage role-id styling transition
   * @client optional
   * @parent hermes-layout--slide
   */
  CONTENT: 'hermes-layout--content',

  /**
   * May be set on selected elements of content of a slide.
   *
   * Used in some transitions.
   *
   * @name hermes-layout--inner
   * @usage transition
   * @client optional
   * @parent hermes-layout--content
   */
  INNER: 'hermes-layout--inner',

  /**
   * Set during upgrade on generated arrow buttons.
   *
   * This class name must not be used in client HTML.
   * It may be used in client CSS for styling.
   *
   * @name hermes-layout--arrow
   * @usage styling
   * @client forbidden
   * @parent hermes-layout--slider
   */
  ARROW: 'hermes-layout--arrow',

  /**
   * Set during upgrade on generated left arrow button.
   *
   * This class name must not be used in client HTML.
   * It may be used in client CSS for styling.
   *
   * @name hermes-layout--arrow-left
   * @usage styling
   * @client forbidden
   * @parent hermes-layout--slider
   */
  ARROW_LEFT: 'hermes-layout--arrow-left',

  /**
   * Set during upgrade on generated right arrow button.
   *
   * This class name must not be used in client HTML.
   * It may be used in client CSS for styling.
   *
   * @name hermes-layout--arrow-right
   * @usage styling
   * @client forbidden
   * @parent hermes-layout--slider
   */
  ARROW_RIGHT: 'hermes-layout--arrow-right',

  /**
   * Set during upgrade on container elements that contains dot buttons.
   *
   * This class name must not be used in client HTML.
   * It may be used in client CSS for styling.
   *
   * @name hermes-layout--dots
   * @usage styling
   * @client forbidden
   * @parent hermes-layout--slider
   */
  DOTS: 'hermes-layout--dots',

  /**
   * Set during upgrade on each dot button element.
   *
   * This class name must not be used in client HTML.
   * It may be used in client CSS for styling.
   *
   * @name hermes-layout--dot
   * @usage styling
   * @client forbidden
   * @parent hermes-layout--dots
   */
  DOT: 'hermes-layout--dot',
};

module.exports = Layout;


},{}],11:[function(require,module,exports){
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

var precond = require('precond');
var dom = require('./_dom');

function summonHermes(elem) {
  precond.checkArgument(elem instanceof Element, 'elem is not an instance of Element');

  var priv = {};
  priv.elem = elem;
  priv.phase = null;
  priv.listeners = [];
  priv.setPhase = setPhase;

  var pub = {};
  pub.getPhase = getPhase.bind(priv);
  pub.nextPhase = nextPhase.bind(priv);
  pub.addPhaseChangeListener = addPhaseChangeListener.bind(priv);
  pub.removePhaseChangeListener = removePhaseChangeListener.bind(priv);
  pub.addPhaseChangeTrigger = addPhaseChangeTrigger;
  pub.removePhaseChangeTrigger = removePhaseChangeTrigger;
  pub.startTransition = startTransition.bind(priv);
  return pub;
}

module.exports = summonHermes;

var Phase = summonHermes.Phase = {
  BEFORE_TRANSITION: 'hermes-before-transition',
  DURING_TRANSITION: 'hermes-during-transition',
  AFTER_TRANSITION: 'hermes-after-transition',
};

return;

function getPhase() {
  var priv = this;
  return priv.phase;
}

function setPhase(phase) {
  var priv = this;

  if (priv.phase !== null) {
    priv.elem.classList.remove(priv.phase);
  }
  priv.phase = phase;

  if (phase !== null) {
    priv.elem.classList.add(phase);
  }
  priv.listeners.forEach(function(listener) {
    listener(phase);
  });
}

function addPhaseChangeListener(listener) {
  var priv = this;
  priv.listeners.push(listener);
}

function removePhaseChangeListener(listener) {
  var priv = this;
  priv.listeners.splice(priv.listeners.indexOf(listener), 1);
}

function nextPhase() {
  var priv = this;

  if (priv.phase === null) {
    priv.setPhase(Phase.BEFORE_TRANSITION);
  } else if (priv.phase === Phase.BEFORE_TRANSITION) {
    priv.setPhase(Phase.DURING_TRANSITION);
  } else if (priv.phase === Phase.DURING_TRANSITION) {
    priv.setPhase(Phase.AFTER_TRANSITION);
  } else if (priv.phase === Phase.AFTER_TRANSITION) {
    priv.setPhase(null);
  }
}

function startTransition() {
  var priv = this;

  priv.setPhase(Phase.BEFORE_TRANSITION);
}

function addPhaseChangeTrigger(elem, transitionProperty) {
  precond.checkArgument(elem instanceof Element, 'elem is not an instance of Element');
  transitionProperty = transitionProperty || 'transform';
  precond.checkIsString(transitionProperty, 'transitionProperty is not a String');

  if (transitionProperty === "transform") {
    transitionProperty = dom.transformPropertyName; // maybe a prefixed version
  }

  var pub = this;
  elem.hermesPhaseChangeTrigger = function(event) {
    if (event.propertyName !== transitionProperty || event.target !== this) {
      return;
    }
    pub.nextPhase();
  };
  elem.addEventListener(dom.transitionEventName, elem.hermesPhaseChangeTrigger);
}

function removePhaseChangeTrigger(elem) {
  precond.checkArgument(elem instanceof Element, 'elem is not an instance of Element');
  precond.checkIsFunction(elem.hermesPhaseChangeTrigger, 'no trigger found on given element');

  elem.removeEventListener(dom.transitionEventName, elem.hermesPhaseChangeTrigger);
}


},{"./_dom":9,"precond":5}],12:[function(require,module,exports){
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

var hermes = require('./hermes');
var precond = require('precond');

function initializeSlider(elem) {
  precond.checkArgument(elem instanceof Element, 'elem is not an instance of Element');

  var priv = {};
  priv.elem = elem;
  priv.hermes = hermes(elem);
  priv.hermes.addPhaseChangeListener(onPhaseChange.bind(priv));
  priv.slides = searchForSlides(elem);
  precond.checkState(priv.slides.length >= 2, 'at least 2 slides needed');
  priv.transitions = searchForTransitions(elem);
  priv.tempClasses = [];
  priv.fromIndex = 1;
  priv.toIndex = 0;
  priv.chooseTransition = chooseTransition;
  priv.started = false;

  priv.elem.className = priv.elem.className.replace(Regexp.TRANSITION, '');
  upgradeSlides(priv);
  setOptions(priv);

  var pub = {};
  pub.start = start.bind(priv);
  pub.slides = priv.slides;
  Object.defineProperty(pub.slides, 'currentIndex', {
    get: function() { return priv.started? priv.toIndex: null; },
    set: moveTo.bind(priv),
  });
  Object.defineProperty(pub.slides, 'current', {
    get: function() { return priv.started? priv.slides[priv.toIndex]: null; },
    set: function() { throw "read only property! please use currentIndex instead"; },
  });
  pub.moveToNext = moveToNext.bind(priv);
  pub.moveToPrevious = moveToPrevious.bind(priv);
  return pub;
}

module.exports = initializeSlider;

// constants

var Layout = require('./_layout');

var Selector = (function () {
  var selectors = {};
  for (var name in Layout) {
    selectors[name] = '.' + Layout[name];
  }
  return selectors;
}());

var Option = {
  DEFAULTS: 'hermes-defaults',
  AUTOSTART: 'hermes-autostart',
  AUTOPLAY: 'hermes-autoplay',
  CREATE_ARROWS: 'hermes-create-arrows',
  CREATE_DOTS: 'hermes-create-dots',
  ARROW_KEYS: 'hermes-arrow-keys',
};

var Flag = {
  SLIDE_FROM: 'hermes-slide-from',
  SLIDE_TO: 'hermes-slide-to',
  UPGRADED: 'is-upgraded',
  ACTIVE: 'is-active',
};

var Regexp = {
  TRANSITION: new RegExp('hermes-transition--([^ ]+)', 'g'),
};

return;

// initialization functions

function searchForSlides(elem) {
  return [].slice.call(elem.querySelectorAll(Selector.SLIDE));
}

function searchForTransitions(elem) {
  var transitions = [];
  var matches = elem.className.match(Regexp.TRANSITION);
  if (matches) {
    for (var i = 0; i < matches.length; ++i) {
      transitions.push(matches[i]);
    }
  }
  return transitions;
}

function create() {
  var elem = document.createElement("div");
  elem.className = [].join.call(arguments, ' ');
  return elem;
}

function upgradeSlides(priv) {
  priv.slides.forEach(function(slide) {
    var content = slide.querySelector(Selector.CONTENT);
    if (content === null) {
      content = create(Layout.CONTENT);
      while (slide.childNodes.length) {
        content.appendChild(slide.childNodes[0]);
      }
      slide.appendChild(content);
    }
    priv.hermes.addPhaseChangeTrigger(content);

    var background = slide.querySelector(Selector.BACKGROUND);
    if (background === null) {
      slide.insertBefore(create(Layout.BACKGROUND), content);
    }
  });
}

function setOptions(priv) {
  var cl = priv.elem.classList;

  if (cl.contains(Option.DEFAULTS)) {
    cl.add(Option.AUTOSTART);
    cl.add(Option.AUTOPLAY);
    cl.add(Option.ARROW_KEYS);
    cl.add(Option.CREATE_ARROWS);
    cl.add(Option.CREATE_DOTS);
  }

  if (cl.contains(Option.CREATE_ARROWS)) {
    createArrowButtons(priv);
  }
  if (cl.contains(Option.CREATE_DOTS)) {
    createDotButtons(priv);
  }
  if (cl.contains(Option.ARROW_KEYS)) {
    window.addEventListener('keydown', keyBasedMove.bind(priv));
  }
  if (cl.contains(Option.AUTOSTART)) {
    window.setTimeout(start.bind(priv), 100);
  }
}

function createArrowButtons(priv) {
  var previousButton = create(Layout.ARROW, Layout.ARROW_LEFT);
  previousButton.addEventListener('click', moveToPrevious.bind(priv));
  priv.elem.appendChild(previousButton);

  var nextButton = create(Layout.ARROW, Layout.ARROW_RIGHT);
  nextButton.addEventListener('click', moveToNext.bind(priv));
  priv.elem.appendChild(nextButton);
}

function createDotButtons(priv) {
  var dots = create(Layout.DOTS);
  priv.elem.appendChild(dots);

  for (var i = 0; i < priv.slides.length; ++i) {
    var dot = create(Layout.DOT);
    dot.addEventListener('click', moveTo.bind(priv, i));
    dots.appendChild(dot);
    priv.slides[i].dot = dot;
  }
}

function keyBasedMove(event) {
  var priv = this;

  switch (event.key) {
    case 'ArrowLeft': moveToPrevious.call(priv); break;
    case 'ArrowRight': moveToNext.call(priv); break;
  }
}

function start() {
  // separate start procedure is needed because
  // only one slide is seen in the first transition
  var priv = this;
  precond.checkState(!priv.started, 'slider is already started');
  priv.started = true;

  var to = priv.slides[priv.toIndex];
  to.classList.add(Flag.SLIDE_TO);
  if (to.id !== null) {
    addTempClass.call(priv, 'hermes-slide-id-'+ to.id);
  }
  if (to.dot !== undefined) {
    to.dot.classList.add(Flag.ACTIVE);
  }

  addTempClass.call(priv, priv.chooseTransition());
  priv.hermes.startTransition();
}

// slide change functions

function moveToNext() {
  var priv = this;
  moveTo.call(priv, (priv.toIndex + 1) % priv.slides.length);
}

function moveToPrevious() {
  var priv = this;
  moveTo.call(priv, (priv.toIndex - 1 + priv.slides.length) % priv.slides.length);
}

function moveTo(i) {
  var priv = this;
  precond.checkState(priv.started, 'slider not started');
  precond.checkIsNumber(i, 'given index is not a number');

  if (i <= priv.slides.length) {
    i %= priv.slides.length;
  }
  if (i === priv.toIndex) {
    return;
  }


  var from = priv.slides[priv.fromIndex];
  var to = priv.slides[priv.toIndex];
  from.classList.remove(Flag.SLIDE_FROM);
  to.classList.remove(Flag.SLIDE_TO);
  if (to.dot !== undefined) {
    to.dot.classList.remove(Flag.ACTIVE);
  }
  removeTempClasses.call(priv);

  priv.fromIndex = priv.toIndex;
  priv.toIndex = i;
  from = priv.slides[priv.fromIndex];
  to = priv.slides[priv.toIndex];
  from.classList.add(Flag.SLIDE_FROM);
  to.classList.add(Flag.SLIDE_TO);
  if (to.id !== null) {
    addTempClass.call(priv, 'hermes-slide-id-'+ to.id);
  }
  if (to.dot !== undefined) {
    to.dot.classList.add(Flag.ACTIVE);
  }

  addTempClass.call(priv, priv.chooseTransition());
  priv.hermes.startTransition();
}

function addTempClass(className) {
  var priv = this;
  priv.tempClasses.push(className);
  priv.elem.classList.add(className);
}

function removeTempClasses() {
  var priv = this;
  priv.tempClasses.forEach(function(className) {
    priv.elem.classList.remove(className);
  });
  priv.tempClasses = [];
}

function onPhaseChange(phase) {
  var priv = this;
  if (phase === 'hermes-after-transition' && priv.elem.classList.contains(Option.AUTOPLAY)) {
    moveToNext.call(priv);
  }
}

// transition change functions

function chooseTransition() {
  var priv = this;
  var match = priv.slides[priv.toIndex].className.match(Regexp.TRANSITION);
  return (match? match[0]: false) || random(priv.transitions);
}

function random(array) {
  if (array.length === 0) {
    return "hermes-no-transition";
  }
  return array[parseInt(Math.random() * array.length)];
}


},{"./_layout":10,"./hermes":11,"precond":5}]},{},[8])