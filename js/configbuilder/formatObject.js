
const axis = require('axis.js/dist/axis.js');

function formatObject(object) {

    let resultArray = [];

    function buildString(prop, value) {
        let resultString = prop + ": ";
        if (typeof value === 'string') {
            resultString += "'" + value + "'";
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