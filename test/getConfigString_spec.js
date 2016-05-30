
import {expect} from 'chai';

import objectToArray from '../js/configbuilder/objectToArray.js';

import getConfigString from '../js/configbuilder/getConfigString.js';

describe('Testing getConfigString', () => {

    const stringOpening = "var config = {\n    ";

    const stringClosing = "\n};";

    it('should return a string', () => {
        const actual = getConfigString(['prop: value']);
        expect(typeof actual).to.equal('string');
    });

    it('should start with var config and end with a semicolon', () => {
        const actual = getConfigString(['prop: value']);
        expect(actual).to.match(/^var config = \{\n\s{4}.*\n\};$/g);
    });

    it('should return a config object from an array', () => {
        const actual = getConfigString(["prop: 'value'"]);
        const expected = stringOpening + "prop: 'value'" + stringClosing;
        expect(actual).to.equal(expected);
    });

    it('should handle multiple properties', () => {
        const actual = getConfigString(['prop1: value1', 'prop2: value2']);
        const expected = stringOpening + 'prop1: value1,\n    prop2: value2' + stringClosing;
        expect(actual).to.equal(expected);
    });

    it('should handle nested properties', () => {
        const nestedArray = [['prop1', ['nestedProp: nestedValue']]];
        const actual = getConfigString(nestedArray);
        const expected = stringOpening + "prop1: {\n        nestedProp: nestedValue\n    }" + stringClosing;
        expect(actual).to.equal(expected);
    });

    it('should work with objectToArray', () => {
        const testObject = {
            prop1: 'value1',
            prop2: {
                deepProp1: 'deepValue'
            }
        };
        const testArray = objectToArray(testObject);
        const actual = getConfigString(testArray);
        const expected = stringOpening + "prop1: 'value1',\n    prop2: {\n        deepProp1: 'deepValue'\n    }" + stringClosing;
        expect(actual).to.equal(expected);
    });

    it('should handle deeply nested objects', () => {
        const testObject = {
            prop1: {
                level2: {
                    level3: 'deepValue'
                }
            }
        };
        const testArray = objectToArray(testObject);
        const actual = getConfigString(testArray);
        const expected = stringOpening + "prop1: {\n        level2: {\n            level3: 'deepValue'\n        }\n    }" + stringClosing;
        console.log(actual);
        expect(actual).to.equal(expected);
    });

});