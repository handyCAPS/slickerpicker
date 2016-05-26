
const axis = require('axis.js/dist/axis.js');

import propToString from './propToString';

function deepObjectToArray(prop, value) {

    let resultArray = [prop],
        resultString;

    for (let key in value) {
        if (axis.isObject(value[key])) {
            resultString = deepObjectToArray(key, value[key]);
        } else {
            resultString = [propToString(key, value[key])];
        }
        resultArray.push(resultString);
    }

    return resultArray;
}

export default deepObjectToArray;