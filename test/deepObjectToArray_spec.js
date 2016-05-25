 import {expect} from 'chai';

 import deepObjectToArray from '../js/configbuilder/deepObjectToArray';

 describe('Testing deepObjectToArray', () => {

    it('should take a nested object and turn it into an array', () => {
        const actual = deepObjectToArray('prop', {deepProp: 'deepValue'});
        const expected = ['prop', ['deepProp: deepValue']];
        expect(actual).to.deep.equal(expected);
    });

    it('should handle deeply nested objects', () => {
        const deepObject = {
            level2: {
                level3: {
                    deepProp: 'deepValue'
                }
            }
        };
        const actual = deepObjectToArray('level1', deepObject);
        const expected = ['level1',
            ['level2',
                ['level3',
                    ['deepProp: deepValue']
                ]
            ]
        ];
        expect(actual).to.deep.equal(expected);
    });

 });