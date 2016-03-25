# react-superform

![react-superform](http://i.imgur.com/Br7NDBx.png)

Form with superpowers for ReactJS

Tired of writing validation yourself? Tired of implementing custom elements for inputs when you already know HTML5 forms? **React Superform to the rescue!**

## Installation

```
npm i -S react-superform
```

## Getting Started

React Superform lets you create validatable `<form>` with HTML5 form elements regardless of HTML5 validation support. Create your component and extend `Superform` class instead of `React.Component` use inherited methods to make your form awesome and user friendly!

```javascript
import Superform from "react-superform";

class MyForm extends Superform {
  onSuccessSubmit(data) {
    console.log(data);
  }

  onErrorSubmit(errors, data) {}

  render() {
    return (
      <form noValidate onSubmit={ this.handleSubmit.bind(this) }>
        <input
          type="email" // validate email
          ref="email"  // ref is required to read the attributes
          name="email" // name field
          valueLink={ this.linkStateOf("email") } // two way data binding
          required     // field is required
        />
        <p className="error">{ this.getErrorMessageOf("email") }</p>
        <input type="submit" />
      </form>
    );
  }
}

ReactDOM.render(<MyForm />, document.getElementById("root"));
```

[Working example](https://jsfiddle.net/MichalZalecki/gh3L24h6/)

**That's it, you are ready to go!**

## Examples

* [Bootstrap 3: Sign Up Form](https://jsfiddle.net/MichalZalecki/kabaLLtn/)
* [Zurb Foundation 4: Sign Up Form](https://jsfiddle.net/MichalZalecki/vtmLa2e4/)

You can also check `examples` dir.

## Available HTML5 validation methods

* `max`
* `maxLength`
* `min`
* `minLength`
* `pattern`
* `required`
* `type="email"`
* `type="number"`
* `type="url"`

## Available custom validation methods

### Equality

`data-equals="<other field name>"` check whether field is the same as *other field*.

[Example](https://github.com/MichalZalecki/react-superform/blob/master/examples/signup-bootstrap.html#L69)

**Warning:** Avoid deep circular equality check. `A -> B -> A` will end up with exception but `A -> B -> C -> A` can freeze the tab.

## Custom messages

`data-messages="<custom messages>"` allows to define custom messages. It accepts JSON object with keys corresponding to failed rules.

[Example](https://github.com/MichalZalecki/react-superform/blob/master/examples/signup-bootstrap.html#L56-L59)

## Contributors

* Super logo author: [Marcin Michalak](https://www.behance.net/marcinmichalak)
* Main Maintainer: [Michal Zalecki](http://michalzalecki.com/)

<a name="Superform"></a>
## Superform
Superform's Superclass

**Kind**: global class  

* [Superform](#Superform)
    * [.onSuccessSubmit(data)](#Superform+onSuccessSubmit)
    * [.onErrorSubmit(errors, data)](#Superform+onErrorSubmit)
    * [.handleChange(event)](#Superform+handleChange) ⇒ <code>Promise</code>
    * [.handleSubmit(event)](#Superform+handleSubmit) ⇒ <code>Promise</code>
    * [.markAsSubmitted()](#Superform+markAsSubmitted) ⇒ <code>Promise</code>
    * [.isSubmited()](#Superform+isSubmited) ⇒ <code>boolean</code>
    * [.getValueOf(name)](#Superform+getValueOf) ⇒ <code>string</code> &#124; <code>boolean</code> &#124; <code>undefined</code>
    * [.linkStateOf(name)](#Superform+linkStateOf) ⇒ <code>Object</code>
    * [.getData()](#Superform+getData) ⇒ <code>Object</code>
    * [.getErrors()](#Superform+getErrors) ⇒ <code>Object</code>
    * [.getErrorsOf(name)](#Superform+getErrorsOf) ⇒ <code>Array</code>
    * [.isFormValid()](#Superform+isFormValid) ⇒ <code>boolean</code>
    * [.isFieldValid(name)](#Superform+isFieldValid) ⇒ <code>boolean</code>
    * [.getErrorMessageOf(name)](#Superform+getErrorMessageOf) ⇒ <code>string</code>

<a name="Superform+onSuccessSubmit"></a>
### superform.onSuccessSubmit(data)
Called on form success submission.

**Kind**: instance method of <code>[Superform](#Superform)</code>  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Form data with all fields valid |

<a name="Superform+onErrorSubmit"></a>
### superform.onErrorSubmit(errors, data)
Called on form failure submission.

**Kind**: instance method of <code>[Superform](#Superform)</code>  

| Param | Type | Description |
| --- | --- | --- |
| errors | <code>Object</code> | Form errors object |
| data | <code>Object</code> | Form data |

<a name="Superform+handleChange"></a>
### superform.handleChange(event) ⇒ <code>Promise</code>
Handler for input change called internally.

**Kind**: instance method of <code>[Superform](#Superform)</code>  
**Returns**: <code>Promise</code> - Promise resolved when data and errors are set if any  

| Param |
| --- |
| event | 

<a name="Superform+handleSubmit"></a>
### superform.handleSubmit(event) ⇒ <code>Promise</code>
Handler for form submission. Your form should call it as `onSubmit` handler.

**Kind**: instance method of <code>[Superform](#Superform)</code>  
**Returns**: <code>Promise</code> - Promise resolved with `onSuccessSubmit` or `onErrorSubmit` result  

| Param |
| --- |
| event | 

<a name="Superform+markAsSubmitted"></a>
### superform.markAsSubmitted() ⇒ <code>Promise</code>
Marks form as submitted by setting `this.status.submitted` to `true`.

**Kind**: instance method of <code>[Superform](#Superform)</code>  
**Returns**: <code>Promise</code> - Promise resolved after state is set.  
<a name="Superform+isSubmited"></a>
### superform.isSubmited() ⇒ <code>boolean</code>
Determines whether form was submitted.

**Kind**: instance method of <code>[Superform](#Superform)</code>  
<a name="Superform+getValueOf"></a>
### superform.getValueOf(name) ⇒ <code>string</code> &#124; <code>boolean</code> &#124; <code>undefined</code>
Returns value of specified field.

**Kind**: instance method of <code>[Superform](#Superform)</code>  
**Returns**: <code>string</code> &#124; <code>boolean</code> &#124; <code>undefined</code> - Field value  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Field name |

<a name="Superform+linkStateOf"></a>
### superform.linkStateOf(name) ⇒ <code>Object</code>
Links field value with form state. Simulates two way data binding.

**Kind**: instance method of <code>[Superform](#Superform)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Field name |

<a name="Superform+getData"></a>
### superform.getData() ⇒ <code>Object</code>
Returns form data.

**Kind**: instance method of <code>[Superform](#Superform)</code>  
**Returns**: <code>Object</code> - Form data which is `this.state.data`  
<a name="Superform+getErrors"></a>
### superform.getErrors() ⇒ <code>Object</code>
Returns form errors.

**Kind**: instance method of <code>[Superform](#Superform)</code>  
**Returns**: <code>Object</code> - Form data which is `this.state.errors`  
<a name="Superform+getErrorsOf"></a>
### superform.getErrorsOf(name) ⇒ <code>Array</code>
Returns errors of specified field.

**Kind**: instance method of <code>[Superform](#Superform)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Field name |

<a name="Superform+isFormValid"></a>
### superform.isFormValid() ⇒ <code>boolean</code>
Determines whether form is valid or not based on form errors.

**Kind**: instance method of <code>[Superform](#Superform)</code>  
<a name="Superform+isFieldValid"></a>
### superform.isFieldValid(name) ⇒ <code>boolean</code>
Determines whether field is valid or not based on form errors.

**Kind**: instance method of <code>[Superform](#Superform)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Field name |

<a name="Superform+getErrorMessageOf"></a>
### superform.getErrorMessageOf(name) ⇒ <code>string</code>
Returns final error message for particular field

**Kind**: instance method of <code>[Superform](#Superform)</code>  
**Returns**: <code>string</code> - Error message for the field  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Field name |

