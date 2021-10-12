import { sanitizeErrors } from '../env';

describe('#sanitizeErrors', () => {
    it.each([
        [
            'this error contains secret1 and secret2 and homestead',
            {
                alchemyKey: 'secret1',
                infuraProjectId: 'secret2',
                env: '',
                fbApiKey: 'secret3',
                fbAuthDomain: 'secret4',
                fbProjectId: 'secret5',
                ethereumNetwork: 'homestead',
            },
            'this error contains redacted and redacted and homestead',
        ],
    ])(
        'should remove from %s secrets in %s to be %s',
        (errorString, env, expected) => {
            const res = sanitizeErrors(errorString, env);
            expect(res).toBe(expected);
        }
    );
});
