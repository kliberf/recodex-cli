'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.action = exports.description = exports.cmd = undefined;

var _progress = require('progress');

var _progress2 = _interopRequireDefault(_progress);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
// Dummy progressbar test
//

const cmd = exports.cmd = 'test-progress <total> [interval]';
const description = exports.description = 'Dummy test of progressbar library in Node.js';
const action = exports.action = function (total) {
  let interval = arguments.length <= 1 || arguments[1] === undefined ? 1000 : arguments[1];

  const bar = new _progress2.default(' evaluating [:bar] :percent :etas', { total: parseInt(total), width: 50 });
  const intervalHandle = setInterval(() => {
    bar.tick();
    if (--total === 0) {
      clearInterval(intervalHandle);
    }
  }, parseInt(interval));
};