const mongoose = require('mongoose')


function sanitizedObject(obj){
    const clean ={}
    for (const [key,value] of Object.entries(obj)) {
        if(!key.startsWith('$')){
            if(value && typeof(value) === 'object'){
                if(Array.isArray(value)){
                    clean[key] = value.map(item =>
                        (item && typeof item === 'object') ? sanitizedObject(item) : item
                      );
                }else{
                    clean[key] = sanitizedObject(value)
                }
            } else{
                clean[key] = value
            }
        }
    }
    return clean
}

module.exports = sanitizedObject