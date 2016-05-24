
const axis = require('axis.js/dist/axis.js');

import propToString from './propToString';

function objectToArray(object) {

    let resultArray = [],
        propString = '';

    function buildString(prop, value) {
        let resultString = prop + ": ",
            denom = "'";
        if (typeof value === 'string') {
            if (value.indexOf('function') === 0) { denom = ''; }
            resultString += denom + value + denom;
        } else if (axis.isObject(value)) {
            for (let deepProp in value) {
                resultString += buildString(deepProp, value[deepProp]);
            }
        }
        return resultString;
    }

    for (let prop in object) {
        let value = object[prop];
        if (axis.isObject(value)) {

        }
        if (axis.isString(value)) {
            propString = propToString(prop, value);
        }
        resultArray.push(propString);
    }

    return resultArray;

}

export default objectToArray;