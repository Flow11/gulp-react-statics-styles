'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _PluginError$File$replaceExtension = require('gulp-util');

var _join = require('path');

var _extractStyles = require('react-statics-styles');

require('babel/polyfill');
var _ = require('lodash');
var should = require('should');
var Promise = (global || window).Promise = require('bluebird');
var __DEV__ = process.env.NODE_ENV !== 'production';
var __PROD__ = !__DEV__;
var __BROWSER__ = typeof window === 'object';
var __NODE__ = !__BROWSER__;
if (__DEV__) {
  Promise.longStackTraces();
  Error.stackTraceLimit = Infinity;
}

var PLUGIN_NAME = 'gulp-react-statics-styles';

function processFile(_ref, fn) {
  var base = _ref.base;
  var path = _ref.path;
  var relative = _ref.relative;

  try {
    var moduleFile = _join.join(base, relative);
    var moduleName = require.resolve(moduleFile);
    if (require.cache[moduleName] !== void 0) {
      delete require.cache[moduleName];
    }
    var Component = require(moduleFile);
    var styles = _extractStyles.extractStyles(Component);
    var contents = undefined;
    try {
      contents = new Buffer(styles);
    } catch (err) {
      return fn(null);
    }
    this.push(new _PluginError$File$replaceExtension.File({ path: _PluginError$File$replaceExtension.replaceExtension(path, '.css'), contents: contents }));
  } catch (err) {
    return fn(err);
  }
  return fn(null);
}

exports['default'] = function () {
  return _through2['default'].obj(function enqueueFile(file, enc, fn) {
    void enc;
    if (file.isNull()) {
      return fn(null, file);
    }
    if (file.isStream()) {
      return fn(new _PluginError$File$replaceExtension.PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }
    return processFile.call(this, file, fn);
  });
};

module.exports = exports['default'];