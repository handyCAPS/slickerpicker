import {expect} from 'chai';

import objectToArray from '../js/configbuilder/objectToArray.js';

describe('Testing objectToArray', () => {

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
        ["prop2", ['nestedProp: nestedValue']],
        "prop3: function() {\n    \n}"
    ];

    it('should return an array of strings', () => {
        const actual = objectToArray(testObject);
        expect(Array.isArray(actual)).to.equal(true);
        expect(actual.length).to.equal(testObjectLength);
        for (let i = 0; i < actual.length; i++) {
            expect(typeof actual[i]).to.equal('string');
        }
    });

    it('should format an object into an array of formatted strings', () => {
        expect(objectToArray(testObject)).to.deep.equal(resultArray);
    });

    it('should handle nested objects', () => {
        const actual = objectToArray(testObject)[1];
        expect(actual).to.equal(resultArray[1]);
    });

    it('should format nested objects into nested arrays', () => {
        const actual = objectToArray(testObject)[1];
        const expected = resultArray[1];
        expect(actual).to.deep.equal(expected);
        expect(typeof actual).to.equal(typeof expected);
        expect(Array.isArray(actual)).to.be.true;
    });

    it('should format nested objects into an array where the first value is the key and the second value is an array of key value pairs', () => {
        const prop1 = 'prop';
        const prop2 = 'prop2';
        const keyValueObject = {
            deepProp: 'deepValue'
        };
        const inTestObject = {};
        inTestObject[prop1] = keyValueObject;
        const actual = objectToArray(inTestObject);
        const expected = [
            prop1, ['deepProp: deepValue']
        ];
        expect(actual).to.deep.equal(expected);
    });

    it('should format props without and values with single quotes', () => {
        const actual = objectToArray(testObject)[0];
        const expected = resultArray[0];
        expect(actual).to.equal(expected);
    });

    it('should format nested props as nested objects', () => {
        const actual = objectToArray(testObject)[1];
        const expected = resultArray[1];
        expect(actual).to.equal(expected);
    });

});