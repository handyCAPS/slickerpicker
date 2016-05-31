
import tabSpaceN from './tabSpaceN';

/**
 * Format an object as a string
 * @param  {string} prop       Name of the object
 * @param  {array} valueArray  Array of key: value pairs
 * @param  {int} nDeep         Padding level 4 spaces
 * @return {string}            Formatted string containing spacing and line breaks
 */
function getObjectAsString(prop, valueArray, nDeep) {

    let padding = tabSpaceN(nDeep || 0),
        firstPadding = '';

    if (nDeep !== 1) {
        firstPadding = padding;
    }

    let valueString = padding + padding + valueArray.join(',\n' + padding + padding);

    if (Array.isArray(valueArray[1])) {
        valueString = getObjectAsString(valueArray[0], valueArray[1], ++nDeep);
    }

    let resultString = firstPadding + prop + ': {\n';

    resultString += valueString;

    resultString += '\n' + padding + '}';

    return resultString;
}

export default getObjectAsString;