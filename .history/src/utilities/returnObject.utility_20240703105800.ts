export default class ReturnObjectHandler {
  message: string;
  returnValue: any;

  constructor(message: string = "", returnValue: any) {
    this.message = message;
    this.returnValue = returnValue;
  }

  getMessage() {
    return this.message;
  }

  getReturnValue<T>(): T {
    return this.returnValue as T;
  }

  setMessage(message: string) {
    this.message = message;
  }
}
