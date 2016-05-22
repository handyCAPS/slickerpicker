import {expect} from 'chai';

import formatObject from '../js/configbuilder/formatObject.js';

describe('Testing formatObject', () => {

    const testObject = {
        prop1: 'value1',
        prop2: {
            nestedProp: 'nestedValue'
        }
    };

    const testObjectLength = Object.keys(testObject).length;

    it('can find the module', () => {
        expect(typeof formatObject).to.equal('function');
    });

    it('should return an array of strings', () => {
        const actual = formatObject(testObject);
        expect(Array.isArray(actual)).to.equal(true);
        expect(actual.length).to.equal(testObjectLength);
        for (let i = 0; i < actual.length; i++) {
            expect(typeof actual[i]).to.equal('string');
        }
    });

    it('should handle nested objects', () => {
        const result = formatObject(testObject);
        expect(result[1]).to.equal("prop2: {\n    nestedProp: 'nestedValue'\n    }");
    });

    it('should format props without and values with single quotes', () => {
        const actual = formatObject(testObject)[0];
        const expected = "prop1: 'value1'";
        expect(actual).to.equal(expected);
    });

    it('should format nested props as nested objects', () => {
        const actual = formatObject(testObject)[1];
        const expected = "prop2: {\n    nestedProp: 'nestedValue'\n    }";
        expect(actual).to.equal(expected);
    });

});