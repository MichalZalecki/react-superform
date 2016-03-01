import React from "react";
import _ from "lodash";
import validator from "validator";

/** Superform's Superclass */
class Superform extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data:      {},
      errors:    {},
      submitted: false,
    };
  }

  /**
   * Called on form success submission.
   *
   * @param data {Object} Form data with all fields valid
   */
  onSuccessSubmit(data) {}

  /**
   * Called on form failure submission.
   *
   * @param errors {Object} Form errors object
   * @param data {Object} Form data
   */
  onErrorSubmit(errors, data) {}

  /**
  * Handler for input change called internally.
  *
  * @param event
  * @return {Promise} Promise resolved when data and errors are set if any
  */
  handleChange(event) {
    const name   = event.target.name;
    const value  = this._getNodeValue(event.target);
    const errors = this._validateNode(event.target);

    return Promise.all([
      this._updateDataOf(name, value),
      this._updateErrorsOf(name, errors),
    ]);
  }

  /**
  * Handler for form submission. Your form should call it as `onSubmit` handler.
  *
  * @param event
  * @return {Promise} Promise resolved with `onSuccessSubmit` or `onErrorSubmit` result
  */
  handleSubmit(event) {
    event.preventDefault();
    const errors = this._createErrors();
    return this.markAsSubmitted()
      .then(() => this._updateErrors(errors))
      .then(() => this.isFormValid() ?
        this.onSuccessSubmit(this.state.data) :
        this.onErrorSubmit(this.state.errors, this.state.data));
  }

  /**
   * Marks form as submitted by setting `this.status.submitted` to `true`.
   *
   * @return {Promise} Promise resolved after state is set.
   */
  markAsSubmitted() {
    return new Promise((resolve) => {
      this.setState({ submitted: true }, resolve);
    });
  }

  /**
   * Determines whether form was submitted.
   *
   * @return {boolean}
   */
  isSubmited() {
    return this.state.submitted;
  }

  /**
   * Returns value of specified field.
   *
   * @param name {string} Field name
   * @return {string|boolean|undefined} Field value
   */
  getValueOf(name) {
    return this.state.data[name];
  }

  /**
   * Links field value with form state. Simulates two way data binding.
   *
   * @param name {string} Field name
   * @return {Object}
   */
  linkStateOf(name) {
    return {
      value: this.state.data[name],
      requestChange: () => this.handleChange({ target: this.refs[name] }),
    };
  }

  /**
   * Returns form data.
   *
   * @return {Object} Form data which is `this.state.data`
   */
  getData() {
    return this.state.data;
  }

  /**
   * Returns form errors.
   *
   * @return {Object} Form data which is `this.state.errors`
   */
  getErrors() {
    return _(this.state.errors)
      .omitBy(errors => !errors.length)
      .value();
  }

  /**
   * Returns errors of specified field.
   *
   * @param name {string} Field name
   * @return {Array}
   */
  getErrorsOf(name) {
    return _(this.getErrors())
      .pick(name)
      .get(name, []);
  }

  /**
   * Determines whether form is valid or not based on form errors.
   *
   * @return {boolean}
   */
  isFormValid() {
    const validity = _(this.getErrors())
      .keys()
      .isEmpty();

    return validity;
  }

  /**
   * Determines whether field is valid or not based on form errors.
   *
   * @param name {string} Field name
   * @return {boolean}
   */
  isFieldValid(name) {
    const validity = _(this.getErrorsOf(name))
      .isEmpty();

    return validity;
  }

  /**
   * Returns final error message for particular field
   *
   * @param name {string} Field name
   * @return {string} Error message for the field
   */
  getErrorMessageOf(name) {
    if (!this.isSubmited() || this.isFieldValid(name)) return null;
    const error   = _(this.getErrorsOf(name)).first();
    const message =  this._getMessage(name, error.rule);
    return error.data ? this._parseMessage(message, error.data) : message;
  }

  /** */
  _createErrors() {
    return _(this.refs)
      .mapValues(node => this._validateNode(node))
      .omitBy(errors => !errors.length)
      .value();
  }

  /** */
  _updateErrors(errors) {
    return new Promise(resolve => {
      this.setState({ errors }, resolve);
    });
  }

  /** */
  _updateDataOf(name, value) {
    return new Promise(resolve => {
      const data = _.assign({}, this.state.data, { [name]: value });
      this.setState({ data }, resolve);
    });
  }

  /** */
  _updateErrorsOf(name, fieldErrors) {
    return new Promise(resolve => {
      const errors = _.assign({}, this.state.errors, { [name]: fieldErrors });
      this.setState({ errors }, resolve);
    });
  }

  /** */
  _getCustomMessageForRuleOf(name, rule) {
    const messages = this._getCustomMessagesOf(name);
    const message  = messages[rule];
    return message;
  }

  /** */
  _getCustomMessagesOf(name) {
    const msgDataset = this.refs[name].dataset.messages;
    const messages   = msgDataset ? JSON.parse(msgDataset) : {};
    return messages;
  }

  /** */
  _getMessage(name, rule) {
    const message = this._getCustomMessageForRuleOf(name, rule) || this.constructor.DEFAULT_MESSAGES[rule];

    if (!message) {
      throw new Error(`Superform: There is no message for such rule. Passed: ${rule}`);
    }

    return message;
  }

  /** */
  _parseMessage(message, data) {
    const parsedMessage = message.replace(":data", data);
    return parsedMessage;
  }

  /** */
  _validateNode(node) {
    const value = this._getNodeValue(node);
    const rules = this._collectRules(node);
    const fails = this._validate(value, rules);
    return fails;
  }

  /** */
  _getNodeValue(node) {
    switch (node.type) {
      case "checkbox":
        return node.checked;
      default:
        return node.value;
    }
  }

  /** */
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

  /** */
  _validate(value, rules) {
    const fails = [];

    if (rules.required && !this._valueExists(value)) {
      fails.push({ rule: "required" });
    }

    if (rules.pattern) {
      if (rules.pattern && !this._valueMatchesPattern(value, rules.pattern)) {
        fails.push({ rule: "pattern" });
      }
    } else {
      if (rules.email && !validator.isEmail(value)) {
        fails.push({ rule: "email" });
      }

      if (rules.url && !validator.isURL(value, { require_protocol: true })) {
        fails.push({ rule: "url" });
      }
    }

    if (rules.required || this._valueExists(value)) {
      if (rules.min && !this._valueIsGreaterOrEqual(value, rules.min)) {
        fails.push({ rule: "min", data: rules.min });
      }

      if (rules.max && !this._valueIsLowerOrEqual(value, rules.max)) {
        fails.push({ rule: "max", data: rules.max });
      }

      if (rules.minLength && !this._valueLengthIsGreaterOrEqual(value, rules.minLength)) {
        fails.push({ rule: "minLength", data: rules.minLength });
      }

      if (rules.maxLength && !this._valueLengthIsLowerOrEqual(value, rules.maxLength)) {
        fails.push({ rule: "maxLength", data: rules.maxLength });
      }
    }

    if (rules.equals && !this._valueEqualsValueOf(value, rules.equals)) {
      fails.push({ rule: "equals", data: rules.equals });
    }

    return fails;
  }

  /** */
  _valueMatchesPattern(value, pattern) {
    return new RegExp(pattern).test(value);
  }

  /** */
  _valueExists(value) {
    return !!value;
  }

  /** */
  _valueIsGreaterOrEqual(value, min) {
    const number = parseInt(value, 10);
    const lower  = parseInt(min, 10);
    if (Number.isNaN(lower)) {
      throw Error(`Superform: Invalid "min" rule. Use only with numbers. Passed: ${JSON.stringify(min)}`);
    }
    if (Number.isNaN(number)) return false;
    return number >= lower;
  }

  /** */
  _valueIsLowerOrEqual(value, max) {
    const number = parseInt(value, 10);
    const higher = parseInt(max, 10);
    if (Number.isNaN(higher)) {
      throw Error(`Superform: Invalid "max" rule. Use only with numbers. Passed: ${JSON.stringify(max)}`);
    }
    if (Number.isNaN(number)) return false;
    return number <= higher;
  }

  /** */
  _valueLengthIsGreaterOrEqual(value = "", minLength) {
    const length = value.length;
    const lower  = parseInt(minLength, 10);
    if (Number.isNaN(lower)) {
      throw Error(`Superform: Invalid "minLength" rule. Use only with numbers. Passed: ${JSON.stringify(minLength)}`);
    }
    return length >= lower;
  }

  /** */
  _valueLengthIsLowerOrEqual(value = "", maxLength) {
    const length = value.length;
    const higher = parseInt(maxLength, 10);
    if (Number.isNaN(higher)) {
      throw Error(`Superform: Invalid "maxLength" rule. Use only with numbers. Passed: ${JSON.stringify(maxLength)}`);
    }
    return length <= higher;
  }

  /** */
  _valueEqualsValueOf(value, equals) {
    return value === this.getValueOf(equals);
  }
}

Superform.DEFAULT_MESSAGES = {
  email:     "This is not a valid email.",
  url:       "This is not a valid URL.",
  required:  "Field is required.",
  pattern:   "Value format is invalid.",
  min:       "Value should be greater or equal :data.",
  max:       "Value should be lower or equal :data.",
  minLength: "Value is too short. Value length should be greater or equal :data.",
  maxLength: "Value is too long. Value length should be lower or equal :data.",
  equals:    "Value must be the same as :data.",
};

export default Superform;
