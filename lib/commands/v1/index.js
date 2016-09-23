'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commands = exports.version = undefined;

var _testProgressbar = require('./testProgressbar');

var testProgressbar = _interopRequireWildcard(_testProgressbar);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const version = exports.version = '1.0.0';
const commands = exports.commands = [testProgressbar];