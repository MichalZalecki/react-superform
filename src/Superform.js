import React from "react";
import _ from "lodash";
import validator from "validator";

export default class Superform extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      errors: {},
      submitted: false,
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    const errors = this._createErrors();
    return this.markAsSubmitted()
      .then(() => this._updateErrors(errors))
  }

  handleChange(event) {
    const name   = event.target.name;
    const value  = this._getNodeValue(event.target);
    const errors = this._validateNode(event.target);

    return Promise.all([
      this._updateDataOf(name, value),
      this._updateErrorsOf(name, errors),
    ]);
  }

  markAsSubmitted() {
    return new Promise((resolve) => {
      this.setState({ submitted: true }, resolve);
    });
  }

  isSubmited() {
    return this.state.submitted;
  }

  getValueOf(name) {
    return this.state.data[name];
  }

  linkStateOf(name) {
    return {
      value: this.state.data[name],
      requestChange: () => this.handleChange({ target: this.refs[name] })
    };
  }

  getData() {
    return this.state.data;
  }

  getErrors() {
    const errors = _(this.state.errors)
      .omitBy(errors => !errors.length)
      .value();

    return errors;
  }

  getErrorsOf(name) {
    const errors = _(this.getErrors())
      .pick(name)
      .get(name, []);

    return errors;
  }

  isFormValid() {
    const validity = _(this.getErrors())
      .keys()
      .isEmpty();

    return validity;
  }

  isFieldValid(name) {
    const validity = _(this.getErrorsOf(name))
      .isEmpty()

    return validity;
  }

  getErrorMessageOf(name) {
    if (!this.isSubmited() || this.isFieldValid(name)) return null;
    const error   = _(this.getErrorsOf(name)).first();
    const message =  this._getMessage(error.rule, name);
    return error.data ? this._parseMessage(message, error.data) : message;
  }

  _createErrors() {
    return _(this.refs)
      .mapValues(node => this._validateNode(node))
      .omitBy(errors => !errors.length)
      .value();
  }

  _updateErrors(errors) {
    return new Promise(resolve => {
      this.setState({errors}, resolve);
    });
  }

  _updateDataOf(name, value) {
    return new Promise(resolve => {
      const data = _.assign({}, this.state.data, {[name]: value});
      this.setState({data}, resolve);
    });
  }

  _updateErrorsOf(name, fieldErrors) {
    return new Promise(resolve => {
      const errors = _.assign({}, this.state.errors, {[name]: fieldErrors});
      this.setState({errors}, resolve);
    });
  }

  _getCustomMessagesOf(name) {
    const msgDataset = this.refs[name].dataset.messages;
    const messages   = msgDataset ? JSON.parse(msgDataset) : {};
    return messages;
  }

  _getCustomMessageForRuleOf(name, rule) {
    const messages = this._getCustomMessagesOf(name);
    const message  = messages[rule];
    return message;
  }

  _getCustomMessagesOf(name) {
    const msgDataset = this.refs[name].dataset.messages;
    const messages   = msgDataset ? JSON.parse(msgDataset) : {};
    return messages;
  }

  _getMessage(rule, name) {
    const message = this._getCustomMessageForRuleOf(name, rule) || this.constructor.DEFAULT_MESSAGES[rule];
    if (!message) throw new Error(`Superform: There is no message for such rule. Passed: ${rule}`);
    return message;
  }

  _parseMessage(message, data) {
    const parsedMessage = message.replace(":data", data);
    return parsedMessage;
  }

  _validateNode(node) {
    const name  = node.name;
    const value = this._getNodeValue(node);
    const rules = this._collectRules(node);
    const fails = this._validate(value, rules);
    return fails;
  }

  _getNodeValue(node) {
    switch(node.type) {
      case "checkbox":
        return node.checked;
      default:
        return node.value;
    }
  }

  _collectRules(node) {
    const rules = {
      email:     node.type === "email",
      url:       node.type === "url",
      pattern:   node.pattern,
      required:  node.required,
      min:       node.getAttribute("min"),
      max:       node.getAttribute("max"),
      minLength: node.getAttribute("minLength"),
      maxLength: node.getAttribute("maxLength"),
      equals:    node.dataset.equals,
    };
    return rules;
  }

  _validate(value, rules) {
    const fails = [];

    rules.required && !this._valueExists(value) && fails.push({ rule: "required" });

    if (rules.pattern) {
      rules.pattern  && !this._valueMatchesPattern(value, rules.pattern) && fails.push({ rule: "pattern" });
    } else {
      rules.email && !validator.isEmail(value) && fails.push({ rule: "email" });
      rules.url   && !validator.isURL(value, {require_protocol: true}) && fails.push({ rule: "url" });
    }

    if (rules.required || this._valueExists(value)) {
      rules.min       && !this._valueIsGreaterOrEqual(value, rules.min)             && fails.push({ rule: "min", data: rules.min });
      rules.max       && !this._valueIsLowerOrEqual(value, rules.max)               && fails.push({ rule: "max", data: rules.max });
      rules.minLength && !this._valueLengthIsGreaterOrEqual(value, rules.minLength) && fails.push({ rule: "minLength", data: rules.minLength });
      rules.maxLength && !this._valueLengthIsLowerOrEqual(value, rules.maxLength)   && fails.push({ rule: "maxLength", data: rules.maxLength });
    }

    rules.equals && !this._valueEqualsValueOf(value, rules.equals) && fails.push({ rule: "equals", data: rules.equals });

    return fails;
  }

  _valueMatchesPattern(value, pattern) {
    return new RegExp(pattern).test(value);
  }

  _valueExists(value) {
    return !!value;
  }

  _valueIsGreaterOrEqual(value, min) {
    const number = parseInt(value);
    const lower  = parseInt(min);
    if (Number.isNaN(lower)) throw Error(`Superform: Invalid "min" rule. Use only with numbers. Passed: ${JSON.stringify(min)}`);
    if (Number.isNaN(number)) return false;
    return number >= lower;
  }

  _valueIsLowerOrEqual(value, max) {
    const number = parseInt(value);
    const higher = parseInt(max);
    if (Number.isNaN(higher)) throw Error(`Superform: Invalid "max" rule. Use only with numbers. Passed: ${JSON.stringify(max)}`);
    if (Number.isNaN(number)) return false;
    return number <= higher;
  }

  _valueLengthIsGreaterOrEqual(value = "", minLength) {
    const length = value.length;
    const lower  = parseInt(minLength);
    if (Number.isNaN(lower)) throw Error(`Superform: Invalid "minLength" rule. Use only with numbers. Passed: ${JSON.stringify(minLength)}`);
    return length >= lower;
  }

  _valueLengthIsLowerOrEqual(value = "", maxLength) {
    const length = value.length;
    const higher = parseInt(maxLength);
    if (Number.isNaN(higher)) throw Error(`Superform: Invalid "maxLength" rule. Use only with numbers. Passed: ${JSON.stringify(maxLength)}`);
    return length <= higher;
  }

  _valueEqualsValueOf(value, equals) {
    return value === this.getValueOf(equals);
  }
}

Superform.DEFAULT_MESSAGES = {
  "email":     "This is not a valid email.",
  "url":       "This is not a valid URL.",
  "required":  "Field is required.",
  "pattern":   "Value format is invalid.",
  "min":       "Value should be greater or equal :data.",
  "max":       "Value should be lower or equal :data.",
  "minLength": "Value is too short. Value length should be greater or equal :data.",
  "maxLength": "Value is too long. Value length should be lower or equal :data.",
  "equals":    "Value must be the same as :data.",
};