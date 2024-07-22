export default class ReturnObjectHandler { 

    static ReturnError(errorMessage: string) { 
        return {
            success: false,
            error: errorMessage,
        }
    }
}