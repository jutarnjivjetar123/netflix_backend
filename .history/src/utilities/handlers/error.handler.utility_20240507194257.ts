export default class ReturnObjectHandler {
    static ReturnError(errorMessage: string, { severityType}) {
    return {
      success: false,
      error: errorMessage,
    };
  }
}
