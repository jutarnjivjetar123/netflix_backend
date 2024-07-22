class ReturnObjectHandler<T> {
  message: string;
  returnValue: T;

  constructor(message: string, returnValue: T) {
    this.message = message;
    this.returnValue = returnValue;
  }

  getMessage(): string {
    return this.message;
  }

  getReturnValue(): T {
    return this.returnValue;
  }

  setMessage(message: string): void {
    this.message = message;
  }

  setReturnValue(value: T): void {
    this.returnValue = value;
  }
}

export default ReturnObjectHandler;
