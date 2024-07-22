export default class ReturnObjectHandler {
  message: string;
  returnValue: any;

  constructor(message: string = "", returnValue: any, success? = true) {
    this.message = message;
    this.returnValue = returnValue;
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
