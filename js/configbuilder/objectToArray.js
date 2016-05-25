
const axis = require('axis.js/dist/axis.js');

import propToString from './propToString';

import deepObjectToArray from './deepObjectToArray';

function objectToArray(object) {

    let resultArray = [],
        resultItem;


    for (let prop in object) {
        let value = object[prop];
        if (axis.isObject(value)) {
            resultItem = deepObjectToArray(prop, value);
        }
        if (axis.isString(value)) {
            resultItem = propToString(prop, value);
        }
        resultArray.push(resultItem);
    }

    return resultArray;

}

export default objectToArray;