var validator = {
    checkRequiredFields: function(data, fieldsArray, callback){
        var errors = [];
        if(data === null){
            errors.push('Object is null');
            callback({errors: errors});
            return;
        }
        if(data === undefined){
            errors.push('Object is undefined');
            callback({errors: errors});
            return;
        }
        if(Object.keys(data).length == 0){
            errors.push('Object is empty');
            callback({errors: errors});
            return;
        }
        for( var key in fieldsArray ){
            var prop = fieldsArray[key];
            if(!data.hasOwnProperty(prop))
                errors.push(prop + ' is missing');
        }
        if(errors.length != 0){
            callback({ errors: errors });
        } else{
            callback(null, data);
        }
    }
};

module.exports = validator;