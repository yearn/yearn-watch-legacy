import { getWarnings } from '..';
import { strategyFactory } from '../../factories/strategy.factory';

describe('#getWarnings', () => {
    describe('when strategies do not have errors', () => {
        it('should return an empty array', () => {
            const strategy = strategyFactory.build({ errors: [] });
            const strategy2 = strategyFactory.build({ errors: [] });
            const strategy3 = strategyFactory.build({ errors: [] });

            const warnings = getWarnings([strategy, strategy2, strategy3]);

            expect(warnings.length).toEqual(0);
            expect(warnings).toEqual([]);
        });
    });

    describe('when strategies have errors', () => {
        it('should return an array containing all the errors', () => {
            const strategy = strategyFactory.build({
                errors: ['err1'],
            });
            const strategy2 = strategyFactory.build({
                errors: ['err2', 'err3'],
            });
            const strategy3 = strategyFactory.build({
                errors: [],
            });

            const warnings = getWarnings([strategy, strategy2, strategy3]);

            expect(warnings.length).toEqual(3);
            expect(warnings).toEqual(['err1', 'err2', 'err3']);
        });
    });
});
