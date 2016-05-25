
import {expect} from 'chai';

import propToString from '../js/configbuilder/propToString.js';


describe('Tesing propToString', () => {

    it('should turn prop and a value into a string', () => {
        const actual = propToString('prop', 'value');
        const expected = "prop: 'value'";
        expect(actual).to.equal(expected);
    });

    it('should omit quotes from the prop if the prop is a function', () => {
        const actual = propToString('prop', 'function() {}');
        const expected = 'prop: function() {}';
        expect(actual).to.equal(expected);
    });

});