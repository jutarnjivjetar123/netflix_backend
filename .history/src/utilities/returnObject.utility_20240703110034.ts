export default class ReturnObjectHandler {
  message: string;
  returnValue: any;
  success?: boolean;
  constructor(message: string = "", returnValue: any, success?: boolean) {
    this.message = message;
    this.returnValue = returnValue;
    this.
  }

  getMessage() {
    return this.message;
  }

  getReturnValue<T>(): T {
    return this.returnValue as T;
  }

  setMessage(message: string): void {
    this.message = message;
  }
  setReturnValue(value: any): void {
    this.returnValue = value;
  }
}