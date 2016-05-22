
const axis = require('axis.js/dist/axis.js');

function formatObject(object) {

    let resultArray = [];

    function buildString(prop, value) {
        let resultString = prop + ": ",
            denom = "'";
        if (typeof value === 'string') {
            if (value.indexOf('function') === 0) { denom = ''; }
            resultString += denom + value + denom;
        } else if (axis.isObject(value)) {
            resultString += '{\n    ';
            for (let deepProp in value) {
                resultString += buildString(deepProp, value[deepProp]);
            }
            resultString += '\n    }';
        }
        return resultString;
    }

    for (let prop in object) {
        resultArray.push(buildString(prop, object[prop]));
    }

    return resultArray;

}

export default formatObject;