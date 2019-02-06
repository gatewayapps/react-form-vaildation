import React from 'react'

interface IFormValidationMessageProps {
  id: string
  validationErrors?: string[]
}

const FormValidationMessage = (props: IFormValidationMessageProps): JSX.Element | null => {
  if (!props.validationErrors || props.validationErrors.length === 0) {
    return null
  }

  return (
    <small id={props.id} className="form-text text-danger">
      {props.validationErrors.map((msg, idx) => (
        <div key={idx}>{msg}</div>
      ))}
    </small>
  )
}

export default FormValidationMessage
