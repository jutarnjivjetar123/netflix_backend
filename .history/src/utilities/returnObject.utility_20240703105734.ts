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

    getReturnValue<T>() { 
        return this.returnValue;
    }

    get
}