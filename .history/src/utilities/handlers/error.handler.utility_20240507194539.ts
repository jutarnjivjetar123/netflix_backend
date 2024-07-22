export default class ReturnObjectHandler {
  static ReturnError(errorMessage: string, { severityType }) {
    return {
      success: false,
      error: errorMessage,
      severityType: severityType,
    };
  }

  static ReturnSuccess(successMessage: string, { severityType }) {
    return {
      success: true,
      message: successMessage,
    };
  }
    
  static ReturnSuccessObject(successMessage)
}
