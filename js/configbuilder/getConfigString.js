
const axis = require('axis.js/dist/axis.js');

function getConfigString(configArray) {

    const tabSpace = '    ';

    let level = 1;

    function tabSpaceN(n) {
        let result = '';
        for (let i = 0; i < n; i++) {
            result += tabSpace;
        }
        return result;
    }

    function buildNestedObject(prop, valueArray) {
        let values;

        if (Array.isArray(valueArray[1])) {
            level++;
            values = buildNestedObject(valueArray[0], valueArray[1]);
        } else {
            values = valueArray.join(',\n' + tabSpaceN(level));
            level = 1;
        }
        return tabSpaceN(level - 1) + prop +
            ': {\n' +
            tabSpaceN(level + 1) +
            values +
            '\n' +
            tabSpaceN(level) +
            '}';
    }

    function mapItem(value) {
        if (Array.isArray(value)) {
            return buildNestedObject(value[0], value[1]);
        }
        return value;
    }

    let resultString = 'var config = {\n';

    resultString += tabSpace;

    resultString += configArray
                    .map(mapItem)
                    .join(',\n' + tabSpace);

    resultString += '\n};';

    return resultString;
}

export default getConfigString;