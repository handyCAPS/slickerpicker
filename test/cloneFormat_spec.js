
import {expect} from 'chai';

import configOptions from '../dist/js/configbuilder/configoptions.js';

import objectToArray from '../js/configbuilder/objectToArray.js';
import cloneObject from '../js/configbuilder/cloneObject.js';
import cloneFormat from '../js/configbuilder/cloneFormat.js';

describe('Testing cloneFormat', () => {

    it('should find the module', () => {
        expect(typeof configOptions).to.not.equal(undefined);
    });

});