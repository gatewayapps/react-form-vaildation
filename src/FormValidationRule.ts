export type ValidationTestFn = (value: any, ...params: any) => any

export class FormValidationRule {
  public field: string
  public test: string | ValidationTestFn
  public validWhen: any
  public message: string
  public args?: any[]

  constructor(field: string, test: string | ValidationTestFn, validWhen: any, message: string, args?: any[]) {
    this.field = field
    this.test = test
    this.validWhen = validWhen
    this.message = message
    this.args = args
  }
}
