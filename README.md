# react-form-validation

React components for validating field data and providing visual feedback to users

## Installation

`npm install @gatewayapps/react-form-validation`

## Usage

The main pieces are the `FormValidation` component and `FormValidationRule` class. These items do the heavy lifting of making sure your field data is valid according to your rules. Below is a simple example of both being used:

```
import React, {Component} from 'react
import { FormValidation, FormValidationMessage, FormValidationRule } from '@gatewayapps/react-form-validation'

default class MyComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: ''
    }
  }

  render() {
    const validators = [new FormValidationRule('name', 'isEmpty', false, 'Name is required')]

    return (
      <FormValidation validations={validators} data={this.state} onValidated={(isValid) => console.log('valid?', isValid)}>
        {({ validate, validationErrors }) => (
          <>
            <input
              type="text"
              className={`form-control ${validationErrors['name'] ? 'is-invalid' : 'is-valid'}`}
              name="name"
              onChange={(e) => {
                this.setState({ name: e.target.value })
                validate()
              }}
              value={this.state.name}
              required
              autoFocus
              aria-describedby="nameErrorBlock"
            />
            <FormValidationMessage id="nameErrorBlock" validationErrors={validationErrors['name']} />
          </>
        )}
      </FormValidation>
    )
  }
}
```

react-form-validation leverages the [validator](https://github.com/chriso/validator.js) library. Check out their documentation for a full list of supported functions and their usage.
In addition to validator, it is possible to add your own custom function for validating data.

## FormValidationRule

```
const emails = [
  "bob@fake.com",
  "sally@fake.com",
  "joe@fake.com"
]

const checkEmailAvailable = (value, emails) => {
  if(!value || emails.includes(value) {
    return false
  }

  return true
}

const validators = [new FormValidationRule('name', 'isEmpty', false, 'Name is required'),
                    new FormValidationRule('emailAddress', checkEmailAvailable, true, [emails]]
```

The `FormValidationRule` class is what the `FormValidation` component uses to verify the data being entered into your forms is valid. Any number of `FormValidationRule` instances can be passed into `FormValidation`. The definition of the class constructor is as follows:

**_FormValidationRule(nameOfProp, evaluationFn|evaluationString, isValid, validationMessage, evaluationArguments)_**

- **nameOfProp**: The `FormValidation` class accepts React state as a property. `nameOfProp` specifies which prop within the state should be evaluated
- **evaluationFn|evaluationString**: This argument can either be a string or a function. The string must match a [validator](https://github.com/chriso/validator.js) string. The function can be any valid custom function that you as the developer provide as long as it has the signature of _fn(value, ...args)_
- **isValid**: This is a boolean value that determines what the result of the evaluation function should equal in order for the data to be considered valid. The first element in the above example, when written as a sentence, would say: _if name is empty, then isValid is false_
- **validationMessage**: This is a string that can be used to inform the user.
- **evaluationArguments(optional)**: This is optional, supplementary data that can be used in the evaluation function. For instance, in the second element in the above trivial example, we pass an array of email address strings. If the field data is included in the array, we return `false` so that the validator knows that this data is invalid. Any number of args can be passed.

## FormValidation

```
<FormValidation validations={validators} data={this.state} onValidated={(isValid) => console.log('valid?', isValid)}>
        {({ validate, validationErrors }) => (
          return ...
        )}
</FormValidation>
```

The `FormValidation` component is a render prop that wraps other components. It provides a `validate` method and a `validationErrors` object that can be used inside the render prop. The definition of the component is as follows:

- **validations**: This property accepts an array of `FormValidationRule` instances
- **data**: This property accepts a React state
- **onValidated(optional)**: Provides a boolean value determining whether the data is valid or not according to the rules specified
- **validate**: This function is returned and available to the children of `FormValidation`. Calling this function kicks off the validation according to the rules specified.
- **validationErrors**: This is a dictionary containing the prop name and the validation message for any fields that did not pass validation according to the rules specified.

## FormValidationMessage

```
<FormValidationMessage id="nameErrorBlock" validationErrors={validationErrors['name']} />
```

The `FormValidationMessage` component is an optional component that can be used to render the validation error message to the user. The definition of the component is as follows:

- **id**: String used to classify the component
- **validationErrors**: Can be an array of string values. For instance, if a field has one or more validations, this component can be used to display all errors
