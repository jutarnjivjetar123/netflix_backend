export default class ReturnObjectHandler { 

    static ErrorReturn(errorMessage: string) { 
        return {
            success: false,
            error: errorMessage,
        }
    }
}