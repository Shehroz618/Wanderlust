class expressErr extends Error{
    constructor(message,statusCode){
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = expressErr;