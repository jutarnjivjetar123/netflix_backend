export default class ReturnObjectHandler<T> {
  message: string;
  returnValue: T;
  success?: boolean;
  constructor(message: string = "", returnValue: T, success?: boolean) {
    this.message = message;
    this.returnValue = returnValue;
    this.success = success;
  }

  getMessage() {
    return this.message;
  }

  getReturnValue(): T {
    return this.returnValue;
  }

  getSuccess() {
    return this.success;
  }

  setMessage(message: string): void {
    this.message = message;
  }
  setReturnValue(value: any): void {
    this.returnValue = value;
  }
  setSuccess(value: boolean): void {
    this.success = value;
  }
}
