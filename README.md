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

**That's it, you are ready to go!**

## Contributors

* Super logo author: [Marcin Michalak](https://www.behance.net/marcinmichalak)
* Main Maintainer: [Michal Zalecki](http://michalzalecki.com/)
