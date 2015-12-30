module.exports = {
    createError: function(err, code, status){
        var error = new Error();
        error.info = err.errors;
        error.desc = code;
        error.resCode = status;
        return error;
    }
};