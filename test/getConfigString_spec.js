
import {expect} from 'chai';

import getConfigString from '../js/configbuilder/getConfigString.js';

describe('Testing getConfigString', () => {

    it('should return a string', () => {
        const actual = getConfigString(['prop: value']);
        expect(typeof actual).to.equal('string');
    });

});