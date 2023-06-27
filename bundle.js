
			(function(modules) {
				require(0);

				function require(moduleId) {
					const [fn, map] = modules[moduleId];
					const localRequire = (dependencyPath) => {
						return require(map[dependencyPath]);
					}
					const module = { exports: {} };
					fn(localRequire, module, module.exports);
					return module.exports;
				}
			})({
				0: [
					function(require, module, exports) {
						"use strict";

var _greeting = _interopRequireDefault(require("/greeting.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
console.log(_greeting["default"]);
					}, {"/greeting.js":1}
				],
				1: [
					function(require, module, exports) {
						"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _name = require("/name.js");
var _default = "Hello, ".concat(_name.name, "!");
exports["default"] = _default;
					}, {"/name.js":2}
				],
				2: [
					function(require, module, exports) {
						"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.name = void 0;
var name = 'world';
exports.name = name;
					}, {}
				],})