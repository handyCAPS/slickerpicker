
import {expect} from 'chai';

import cloneObject from '../js/configbuilder/cloneObject.js';

describe('Testing cloneObject', () => {

    const testObject = {
        prop1: 'value1',
        prop2: {
            nestedProp: 'nestedValue',
            deepNestingProp: {
                level3: {
                    level4: {
                        deepestProp: 'deepestValue'
                    }
                }
            }
        }
    };

    const testObjectClone = {
        prop1: 'clonedvalue1',
        prop2: {
            nestedProp: 'clonednestedValue',
            deepNestingProp: {
                level3: {
                    level4: {
                        deepestProp: 'cloneddeepestValue'
                    }
                }
            }
        }
    };

    it('should return an object', () => {
        expect(cloneObject({})).to.be.an('object');
    });

    it('should not alter the original when the clone is altered', () => {
        let cloned = cloneObject(testObject);
        expect(testObject.prop1).to.equal(cloned.prop1);
        cloned.prop1 = testObjectClone.prop1;
        expect(testObjectClone.prop1).to.equal(cloned.prop1);
        expect(testObject.prop1).to.not.equal(cloned.prop1);
    });

    it('should handle nested objects', () => {
        let cloned = cloneObject(testObject);
        cloned.prop2.deepNestingProp.level3.level4.deepestProp = testObjectClone.prop2.deepNestingProp.level3.level4.deepestProp;
        expect(cloned.prop2.deepNestingProp.level3.level4.deepestProp).to.not.equal(testObject.prop2.deepNestingProp.level3.level4.deepestProp);
    });

});