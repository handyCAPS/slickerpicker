
import {expect} from 'chai';

import tabSpaceN from '../js/configbuilder/tabSpaceN';

describe('Testing tabSpaceN', () => {

    const actual = tabSpaceN(2);

    const expected = '        ';

    it('should return a string of spaces', () => {
        expect(typeof actual).to.equal('string');
        expect(actual).to.equal(expected);
    });

});