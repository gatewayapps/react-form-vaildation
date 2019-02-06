import debounce from 'lodash/debounce'
import { PureComponent } from 'react'
import Validator from 'validator'

export interface IValidationErrors {
  [field: string]: string[]
}

export interface FormValidationRenderProps {
  validationErrors: IValidationErrors
  isValid: boolean
  validate: (data?: any) => void
}

export type ValidationFn = (value: any, ...params: any) => any

export type FormValidationRenderFn = (props: FormValidationRenderProps) => React.ReactChild

export type OnValidatedFn = (isValid: boolean, validationErrors: IValidationErrors) => void

export class FormValidationRule {
  public field: string
  public test: string | ValidationFn
  public validWhen: any
  public message: string
  public args?: any[]

  constructor(field: string, test: string | ValidationFn, validWhen: any, message: string, args?: any[]) {
    this.field = field
    this.test = test
    this.validWhen = validWhen
    this.message = message
    this.args = args
  }
}

export interface IFormValidationProps {
  children: FormValidationRenderFn
  data?: any
  validateOnMount?: boolean
  onValidated?: OnValidatedFn
  validations: FormValidationRule[]
}

interface IFormValidationState {
  isValid: boolean
  validationErrors: IValidationErrors
  validating: boolean
}

function getValue(data: any, field: string): any {
  if (!data || !field) {
    return undefined
  }

  return field.split('.').reduce((result, prop) => {
    if (!result || !prop) {
      return undefined
    }
    return result[prop]
  }, data)
}

class FormValidation extends PureComponent<IFormValidationProps, IFormValidationState> {
  state = {
    isValid: false,
    validationErrors: {},
    validating: false
  }

  static defaultProps = {
    validateOnMount: true
  }

  componentDidMount() {
    if (this.props.data && this.props.validateOnMount) {
      this.onValidate(this.props.data)
    }
  }

  onValidate = debounce(async (data: any): Promise<void> => {
    if (!Array.isArray(this.props.validations) || this.props.validations.length === 0) {
      this.setState({
        validationErrors: {},
        isValid: true,
        validating: false
      })
    }

    this.setState({ validating: true })

    data = data || this.props.data

    const validationErrors = {}

    for (let i = 0; i < this.props.validations.length; i++) {
      const rule = this.props.validations[i]
      const testFn = typeof rule.test === 'string' ? Validator[rule.test] : rule.test
      if (typeof testFn === 'function') {
        const value = getValue(data, rule.field)
        const args = rule.args || []
        const validWhen = rule.validWhen || false

        let testResult: any
        try {
          testResult = await testFn(value, ...args)
        } catch (err) {
          testResult = undefined
        }

        if (testResult !== validWhen) {
          if (!Array.isArray(validationErrors[rule.field])) {
            validationErrors[rule.field] = [rule.message]
          } else {
            validationErrors[rule.field].push(rule.message)
          }
        }
      }
    }

    const isValid = Object.keys(validationErrors).length === 0

    this.setState({
      isValid,
      validationErrors,
      validating: false
    })

    if (this.props.onValidated) {
      this.props.onValidated(isValid, validationErrors)
    }
  }, 300)

  render() {
    return this.props.children({
      validationErrors: this.state.validationErrors,
      isValid: this.state.isValid,
      validate: this.onValidate
    })
  }
}

export default FormValidation
