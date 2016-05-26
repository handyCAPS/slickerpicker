
const axis = require('axis.js/dist/axis.js');

function getConfigString(configArray) {

    const tabSpace = '    ';

    function tabSpaceN(n) {
        let result = '';
        for (let i = 0; i < n; i++) {
            result += tabSpace;
        }
        return result;
    }

    let resultString = 'var config = {\n';

    resultString += tabSpace;

    resultString += configArray
                    .map( value => {
                        if (Array.isArray(value)) {
                            return value[0] +
                                ': {\n' +
                                tabSpaceN(2) +
                                value[1]
                                    .join(',\n' + tabSpace) +
                                '\n' +
                                tabSpace +
                                '}';
                        }
                        return value;
                    })
                    .join(',\n' + tabSpace);

    resultString += '\n};';

    return resultString;
}

export default getConfigString;