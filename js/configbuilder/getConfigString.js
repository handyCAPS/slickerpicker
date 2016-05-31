
const axis = require('axis.js/dist/axis.js');

import tabSpaceN from './tabSpaceN';

import getObjectAsString from './getObjectAsString';

function getConfigString(configArray) {

    let level = 1;


    function mapItem(value) {
        if (Array.isArray(value)) {
            return getObjectAsString(value[0], value[1], level);
        }
        return value;
    }

    let resultString = 'var config = {\n';

    resultString += tabSpaceN(1);

    resultString += configArray
                    .map(mapItem)
                    .join(',\n' + tabSpaceN(1));

    resultString += '\n};';

    return resultString;
}

export default getConfigString;