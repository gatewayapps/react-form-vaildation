import React, { Component } from 'react'
import { storiesOf } from '@storybook/react'
import FormValidation, { FormValidationRule } from '../src/FormValidation'
import FormValidationMessage from '../src/FormValidationMessage'

import './styles.scss'

class FormValidationComboBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedValue: '-1'
    }
  }

  render() {
    const validators = [new FormValidationRule('selectedValue', 'equals', false, 'Please select a value', ['-1'])]

    return (
      <FormValidation validations={validators} data={this.state} onValidated={(isValid) => console.log('valid?', isValid)}>
        {({ validate, validationErrors }) => (
          <>
            <select
              name="preference"
              onChange={(e) => {
                this.setState({ selectedValue: e.target.value })
                validate()
              }}
              value={this.state.selectedValue}
              required
              autoFocus
              aria-describedby="preferenceErrorBlock">
              <option value="-1">Please select a value</option>
              <option value="1">I like it</option>
              <option value="2">I am indifferent</option>
              <option value="3">I do not like it</option>
            </select>
            <FormValidationMessage id="preferenceErrorBlock" validationErrors={validationErrors['selectedValue']} />
          </>
        )}
      </FormValidation>
    )
  }
}

class FormValidationInput extends Component {
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

storiesOf('Form Validation', module)
  .add('with text box', () => <FormValidationInput />)
  .add('with combo box', () => <FormValidationComboBox />)
