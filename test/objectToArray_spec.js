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
        ["prop2", [ "nestedProp: 'nestedValue'"]],
        "prop3: function() {\n    \n}"
    ];

    it('should return an array', () => {
        const actual = objectToArray(testObject);
        expect(Array.isArray(actual)).to.be.true;
    });

    it('should return a string from a single level object', () => {
        const actual = objectToArray(testObject);
        expect(typeof actual[0]).to.equal('string');
        expect(actual[0]).to.equal(resultArray[0]);
    });


    it('should format an object into an array of formatted strings', () => {
        expect(objectToArray(testObject)).to.deep.equal(resultArray);
    });

    it('should handle nested objects', () => {
        const actual = objectToArray(testObject)[1];
        expect(actual).to.deep.equal(resultArray[1]);
    });

    it('should format nested objects into nested arrays', () => {
        const actual = objectToArray(testObject)[1];
        const expected = resultArray[1];
        expect(actual).to.deep.equal(expected);
        expect(typeof actual).to.equal(typeof expected);
        expect(Array.isArray(actual)).to.be.true;
    });


    it('should format props without and values with single quotes', () => {
        const actual = objectToArray(testObject)[0];
        const expected = resultArray[0];
        expect(actual).to.equal(expected);
    });

    it('should format nested props as nested objects', () => {
        const actual = objectToArray(testObject)[1];
        const expected = resultArray[1];
        expect(actual).to.deep.equal(expected);
    });

});