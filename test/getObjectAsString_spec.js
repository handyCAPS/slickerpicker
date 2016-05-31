
import {expect} from 'chai';

import getObjectAsString from '../js/configbuilder/getObjectAsString';

describe('Testing getObjectAsString', () => {

    const prop = 'prop';

    it('should return a string', () => {
        const valueArray = ['deepProp: value', 'prop2: value2'];
        const actual = getObjectAsString(prop, valueArray);
        expect(typeof actual).to.equal('string');
    });

    it('should start with the propname and end with a }', () => {
        const valueArray = ['deepProp: value', 'prop2: value2'];
        const actual = getObjectAsString(prop, valueArray);
        const expected = new RegExp('^' + prop + ': \{(\n|.)*\}$', 'g');
        expect(actual).to.match(expected);
    });

    it('should add padding', () => {
        const valueArray = ['deepProp: value', 'prop2: value2'];
        const level = 1;
        const padding = '    ';
        const actualLocal = getObjectAsString(prop, valueArray, level);
        const expected = prop +
                ": {\n" +
                padding + padding +
                valueArray[0] +
                ',\n' +
                padding + padding +
                valueArray[1] +
                '\n' +
                padding +
                "}";
        expect(actualLocal).to.equal(expected);
    })

    it('should handle nested arrays', () => {
        // Look up how the arrays come in tommorow
        const valueArray = ['deepProp', ['deepArray', ['deepestProp: deepValue']]];
        const padding = '    ';
        const actual = getObjectAsString(prop, valueArray, 1);
        const expected = prop + ': {\n' +
                padding + padding +
                valueArray[0] +
                ': {\n' +
                padding + padding + padding +
                valueArray[1][0] +
                ': {\n' +
                padding + padding + padding + padding +
                valueArray[1][1][0] +
                '\n' +
                padding + padding + padding +
                '}\n' +
                padding + padding +
                '}\n' +
                padding +
                '}';
        expect(actual).to.equal(expected);
    });

});