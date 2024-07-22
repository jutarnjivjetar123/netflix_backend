export default class ReturnObjectHandler {
  static ReturnError(errorMessage: string) {
    return {
      success: false,
      error: errorMessage,
    };
  }

  static ReturnSuccess(successMessage: string) {
    return {
      success: true,
      message: successMessage,
    };
  }

  static ReturnSuccessObjectAndMessage(
    successMessage: string,
    object: any,
    { severityType }
  ) {
    return {
      success: true,
      message: successMessage,
      object: object,
    };
  }

  static ReturnSuccessObject(object: any, { severityType }) {
    return {
      success: true,
      object: object,
    };
  }
}
