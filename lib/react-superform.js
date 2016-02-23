(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"), require("_"), require("validator"));
	else if(typeof define === 'function' && define.amd)
		define("Superform", ["React", "_", "validator"], factory);
	else if(typeof exports === 'object')
		exports["Superform"] = factory(require("React"), require("_"), require("validator"));
	else
		root["Superform"] = factory(root["React"], root["_"], root["validator"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _Superform = __webpack_require__(1);

	var _Superform2 = _interopRequireDefault(_Superform);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _Superform2.default;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _lodash = __webpack_require__(3);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _validator = __webpack_require__(4);
	
	var _validator2 = _interopRequireDefault(_validator);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Superform = function (_React$Component) {
	  _inherits(Superform, _React$Component);
	
	  function Superform(props) {
	    _classCallCheck(this, Superform);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Superform).call(this, props));
	
	    _this.state = {
	      data: {},
	      errors: {},
	      submitted: false
	    };
	    return _this;
	  }
	
	  _createClass(Superform, [{
	    key: "handleSubmit",
	    value: function handleSubmit(event) {
	      var _this2 = this;
	
	      event.preventDefault();
	      var errors = this._createErrors();
	      return this.markAsSubmitted().then(function () {
	        return _this2._updateErrors(errors);
	      });
	    }
	  }, {
	    key: "handleChange",
	    value: function handleChange(event) {
	      var name = event.target.name;
	      var value = this._getNodeValue(event.target);
	      var errors = this._validateNode(event.target);
	
	      return Promise.all([this._updateDataOf(name, value), this._updateErrorsOf(name, errors)]);
	    }
	  }, {
	    key: "markAsSubmitted",
	    value: function markAsSubmitted() {
	      var _this3 = this;
	
	      return new Promise(function (resolve) {
	        _this3.setState({ submitted: true }, resolve);
	      });
	    }
	  }, {
	    key: "isSubmited",
	    value: function isSubmited() {
	      return this.state.submitted;
	    }
	  }, {
	    key: "getValueOf",
	    value: function getValueOf(name) {
	      return this.state.data[name];
	    }
	  }, {
	    key: "linkStateOf",
	    value: function linkStateOf(name) {
	      var _this4 = this;
	
	      return {
	        value: this.state.data[name],
	        requestChange: function requestChange() {
	          return _this4.handleChange({ target: _this4.refs[name] });
	        }
	      };
	    }
	  }, {
	    key: "getData",
	    value: function getData() {
	      return this.state.data;
	    }
	  }, {
	    key: "getErrors",
	    value: function getErrors() {
	      var errors = (0, _lodash2.default)(this.state.errors).omitBy(function (errors) {
	        return !errors.length;
	      }).value();
	
	      return errors;
	    }
	  }, {
	    key: "getErrorsOf",
	    value: function getErrorsOf(name) {
	      var errors = (0, _lodash2.default)(this.getErrors()).pick(name).get(name, []);
	
	      return errors;
	    }
	  }, {
	    key: "isFormValid",
	    value: function isFormValid() {
	      var validity = (0, _lodash2.default)(this.getErrors()).keys().isEmpty();
	
	      return validity;
	    }
	  }, {
	    key: "isFieldValid",
	    value: function isFieldValid(name) {
	      var validity = (0, _lodash2.default)(this.getErrorsOf(name)).isEmpty();
	
	      return validity;
	    }
	  }, {
	    key: "getErrorMessageOf",
	    value: function getErrorMessageOf(name) {
	      if (!this.isSubmited() || this.isFieldValid(name)) return null;
	      var error = (0, _lodash2.default)(this.getErrorsOf(name)).first();
	      var message = this._getMessage(error.rule, name);
	      return error.data ? this._parseMessage(message, error.data) : message;
	    }
	  }, {
	    key: "_createErrors",
	    value: function _createErrors() {
	      var _this5 = this;
	
	      return (0, _lodash2.default)(this.refs).mapValues(function (node) {
	        return _this5._validateNode(node);
	      }).omitBy(function (errors) {
	        return !errors.length;
	      }).value();
	    }
	  }, {
	    key: "_updateErrors",
	    value: function _updateErrors(errors) {
	      var _this6 = this;
	
	      return new Promise(function (resolve) {
	        _this6.setState({ errors: errors }, resolve);
	      });
	    }
	  }, {
	    key: "_updateDataOf",
	    value: function _updateDataOf(name, value) {
	      var _this7 = this;
	
	      return new Promise(function (resolve) {
	        var data = _lodash2.default.assign({}, _this7.state.data, _defineProperty({}, name, value));
	        _this7.setState({ data: data }, resolve);
	      });
	    }
	  }, {
	    key: "_updateErrorsOf",
	    value: function _updateErrorsOf(name, fieldErrors) {
	      var _this8 = this;
	
	      return new Promise(function (resolve) {
	        var errors = _lodash2.default.assign({}, _this8.state.errors, _defineProperty({}, name, fieldErrors));
	        _this8.setState({ errors: errors }, resolve);
	      });
	    }
	  }, {
	    key: "_getCustomMessagesOf",
	    value: function _getCustomMessagesOf(name) {
	      var msgDataset = this.refs[name].dataset.messages;
	      var messages = msgDataset ? JSON.parse(msgDataset) : {};
	      return messages;
	    }
	  }, {
	    key: "_getCustomMessageForRuleOf",
	    value: function _getCustomMessageForRuleOf(name, rule) {
	      var messages = this._getCustomMessagesOf(name);
	      var message = messages[rule];
	      return message;
	    }
	  }, {
	    key: "_getCustomMessagesOf",
	    value: function _getCustomMessagesOf(name) {
	      var msgDataset = this.refs[name].dataset.messages;
	      var messages = msgDataset ? JSON.parse(msgDataset) : {};
	      return messages;
	    }
	  }, {
	    key: "_getMessage",
	    value: function _getMessage(rule, name) {
	      var message = this._getCustomMessageForRuleOf(name, rule) || this.constructor.DEFAULT_MESSAGES[rule];
	      if (!message) throw new Error("Superform: There is no message for such rule. Passed: " + rule);
	      return message;
	    }
	  }, {
	    key: "_parseMessage",
	    value: function _parseMessage(message, data) {
	      var parsedMessage = message.replace(":data", data);
	      return parsedMessage;
	    }
	  }, {
	    key: "_validateNode",
	    value: function _validateNode(node) {
	      var name = node.name;
	      var value = this._getNodeValue(node);
	      var rules = this._collectRules(node);
	      var fails = this._validate(value, rules);
	      return fails;
	    }
	  }, {
	    key: "_getNodeValue",
	    value: function _getNodeValue(node) {
	      switch (node.type) {
	        case "checkbox":
	          return node.checked;
	        default:
	          return node.value;
	      }
	    }
	  }, {
	    key: "_collectRules",
	    value: function _collectRules(node) {
	      var rules = {
	        email: node.type === "email",
	        url: node.type === "url",
	        pattern: node.pattern,
	        required: node.required,
	        min: node.getAttribute("min"),
	        max: node.getAttribute("max"),
	        minLength: node.getAttribute("minLength"),
	        maxLength: node.getAttribute("maxLength"),
	        equals: node.dataset.equals
	      };
	      return rules;
	    }
	  }, {
	    key: "_validate",
	    value: function _validate(value, rules) {
	      var fails = [];
	
	      rules.required && !this._valueExists(value) && fails.push({ rule: "required" });
	
	      if (rules.pattern) {
	        rules.pattern && !this._valueMatchesPattern(value, rules.pattern) && fails.push({ rule: "pattern" });
	      } else {
	        rules.email && !_validator2.default.isEmail(value) && fails.push({ rule: "email" });
	        rules.url && !_validator2.default.isURL(value, { require_protocol: true }) && fails.push({ rule: "url" });
	      }
	
	      if (rules.required || this._valueExists(value)) {
	        rules.min && !this._valueIsGreaterOrEqual(value, rules.min) && fails.push({ rule: "min", data: rules.min });
	        rules.max && !this._valueIsLowerOrEqual(value, rules.max) && fails.push({ rule: "max", data: rules.max });
	        rules.minLength && !this._valueLengthIsGreaterOrEqual(value, rules.minLength) && fails.push({ rule: "minLength", data: rules.minLength });
	        rules.maxLength && !this._valueLengthIsLowerOrEqual(value, rules.maxLength) && fails.push({ rule: "maxLength", data: rules.maxLength });
	      }
	
	      rules.equals && !this._valueEqualsValueOf(value, rules.equals) && fails.push({ rule: "equals", data: rules.equals });
	
	      return fails;
	    }
	  }, {
	    key: "_valueMatchesPattern",
	    value: function _valueMatchesPattern(value, pattern) {
	      return new RegExp(pattern).test(value);
	    }
	  }, {
	    key: "_valueExists",
	    value: function _valueExists(value) {
	      return !!value;
	    }
	  }, {
	    key: "_valueIsGreaterOrEqual",
	    value: function _valueIsGreaterOrEqual(value, min) {
	      var number = parseInt(value);
	      var lower = parseInt(min);
	      if (Number.isNaN(lower)) throw Error("Superform: Invalid \"min\" rule. Use only with numbers. Passed: " + JSON.stringify(min));
	      if (Number.isNaN(number)) return false;
	      return number >= lower;
	    }
	  }, {
	    key: "_valueIsLowerOrEqual",
	    value: function _valueIsLowerOrEqual(value, max) {
	      var number = parseInt(value);
	      var higher = parseInt(max);
	      if (Number.isNaN(higher)) throw Error("Superform: Invalid \"max\" rule. Use only with numbers. Passed: " + JSON.stringify(max));
	      if (Number.isNaN(number)) return false;
	      return number <= higher;
	    }
	  }, {
	    key: "_valueLengthIsGreaterOrEqual",
	    value: function _valueLengthIsGreaterOrEqual() {
	      var value = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
	      var minLength = arguments[1];
	
	      var length = value.length;
	      var lower = parseInt(minLength);
	      if (Number.isNaN(lower)) throw Error("Superform: Invalid \"minLength\" rule. Use only with numbers. Passed: " + JSON.stringify(minLength));
	      return length >= lower;
	    }
	  }, {
	    key: "_valueLengthIsLowerOrEqual",
	    value: function _valueLengthIsLowerOrEqual() {
	      var value = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
	      var maxLength = arguments[1];
	
	      var length = value.length;
	      var higher = parseInt(maxLength);
	      if (Number.isNaN(higher)) throw Error("Superform: Invalid \"maxLength\" rule. Use only with numbers. Passed: " + JSON.stringify(maxLength));
	      return length <= higher;
	    }
	  }, {
	    key: "_valueEqualsValueOf",
	    value: function _valueEqualsValueOf(value, equals) {
	      return value === this.getValueOf(equals);
	    }
	  }]);
	
	  return Superform;
	}(_react2.default.Component);
	
	exports.default = Superform;
	
	
	Superform.DEFAULT_MESSAGES = {
	  "email": "This is not a valid email.",
	  "url": "This is not a valid URL.",
	  "required": "Field is required.",
	  "pattern": "Value format is invalid.",
	  "min": "Value should be greater or equal :data.",
	  "max": "Value should be lower or equal :data.",
	  "minLength": "Value is too short. Value length should be greater or equal :data.",
	  "maxLength": "Value is too long. Value length should be lower or equal :data.",
	  "equals": "Value must be the same as :data."
	};
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=react-superform.js.map