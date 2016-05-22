import {expect} from 'chai';

import formatObject from '../js/configbuilder/formatObject.js';

describe('Testing formatObject', () => {

    const testObject = {
        prop1: 'value1',
        prop2: {
            nestedProp: 'nestedValue'
        },
        prop3: 'function() {\n    \n}'
    };

    const testObjectLength = Object.keys(testObject).length;

    const resultArray = [
        "prop1: 'value1'",
        "prop2: {\n    nestedProp: 'nestedValue'\n    }",
        "prop3: function() {\n    \n}"
    ];

    it('should return an array of strings', () => {
        const actual = formatObject(testObject);
        expect(Array.isArray(actual)).to.equal(true);
        expect(actual.length).to.equal(testObjectLength);
        for (let i = 0; i < actual.length; i++) {
            expect(typeof actual[i]).to.equal('string');
        }
    });

    it('should format an object into an array of formatted strings', () => {
        expect(formatObject(testObject)).to.deep.equal(resultArray);
    });

    it('should handle nested objects', () => {
        const result = formatObject(testObject);
        expect(result[1]).to.equal(resultArray[1]);
    });

    it('should format props without and values with single quotes', () => {
        const actual = formatObject(testObject)[0];
        const expected = resultArray[0];
        expect(actual).to.equal(expected);
    });

    it('should format nested props as nested objects', () => {
        const actual = formatObject(testObject)[1];
        const expected = resultArray[1];
        expect(actual).to.equal(expected);
    });

});