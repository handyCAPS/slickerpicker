
const axis = require('axis.js/dist/axis.js');

function cloneObject(object) {

    let resultObject = {};

    for (let key in object) {
        if (axis.isObject(object[key])) {
            resultObject[key] = cloneObject(object[key]);
        } else {
            resultObject[key] = object[key];
        }
    }

    return resultObject;

}

export default cloneObject;